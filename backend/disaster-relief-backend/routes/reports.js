// routes/reports.js
// Reports + tamper-evident ledger (hash chain) + peer verification

const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const db = require('../db/database');
const { addNotification } = require('./notifications');

/* =========================================
   LEDGER HELPERS
========================================= */

const GENESIS = '0'.repeat(64);

db.defaults({ ledger: [] }).write();

function sha256(text) {
  return crypto.createHash('sha256').update(String(text)).digest('hex');
}

// report ka wo data jo kabhi nahi badalna chahiye
function hashReportData(r) {
  return sha256(JSON.stringify([
    r.id,
    r.type,
    r.title,
    r.description,
    r.location_name,
    r.latitude,
    r.longitude,
    r.people_affected,
    r.reported_by,
    r.created_at
  ]));
}

function hashBlock(b) {
  const parts = [
    b.index,
    b.report_id,
    b.action,
    b.status,
    b.data_hash,
    b.prev_hash,
    b.timestamp
  ];

  // verify karne wale ki detail (purane blocks me ye nahi hoti)
  if (b.verified_by !== undefined) {
    parts.push(b.verified_by, b.verification_type);
  }

  return sha256(parts.join('|'));
}

function addBlock(report, action, status, extra = {}) {
  const chain = db.get('ledger').value();
  const prev = chain.length ? chain[chain.length - 1].hash : GENESIS;

  const block = {
    index: chain.length,
    report_id: report.id,
    action,
    status,
    data_hash: hashReportData(report),
    prev_hash: prev,
    timestamp: new Date().toISOString(),
    ...extra
  };

  block.hash = hashBlock(block);

  db.get('ledger').push(block).write();
  return block;
}

// chain check: kya kuch badla gaya?
function verifyLedger() {
  const chain = db.get('ledger').value();
  const reports = db.get('reports').value();
  const problems = [];
  const lastStatus = {};

  chain.forEach((b, i) => {

    const expectedPrev = i === 0 ? GENESIS : chain[i - 1].hash;

    if (b.prev_hash !== expectedPrev) {
      problems.push({
        block: b.index,
        report_id: b.report_id,
        reason: 'Chain broken: previous hash does not match'
      });
    }

    if (hashBlock(b) !== b.hash) {
      problems.push({
        block: b.index,
        report_id: b.report_id,
        reason: 'Ledger block was altered'
      });
    }

    const report = reports.find(r => r.id === b.report_id);

    if (!report) {
      problems.push({
        block: b.index,
        report_id: b.report_id,
        reason: 'Report was deleted'
      });
    } else if (hashReportData(report) !== b.data_hash) {
      problems.push({
        block: b.index,
        report_id: b.report_id,
        reason: 'Report content was changed'
      });
    }

    lastStatus[b.report_id] = b.status;
  });

  reports.forEach(r => {
    if (lastStatus[r.id] !== undefined && lastStatus[r.id] !== r.status) {
      problems.push({
        report_id: r.id,
        reason: 'Status was changed outside the ledger'
      });
    }
  });

  return {
    valid: problems.length === 0,
    total_blocks: chain.length,
    checked_at: new Date().toISOString(),
    problems
  };
}

// server start par: jin purani reports ka block nahi hai, unka bana do
function sealExistingReports() {
  const sealed = new Set(db.get('ledger').value().map(b => b.report_id));

  const missing = [...db.get('reports').value()]
    .filter(r => !sealed.has(r.id))
    .sort((a, b) => a.id - b.id);

  missing.forEach(r => addBlock(r, 'IMPORTED', r.status));

  if (missing.length > 0) {
    console.log(`Ledger: sealed ${missing.length} existing report(s).`);
  }
}

sealExistingReports();


/* =========================================
   POST /api/reports  -> new report
========================================= */

router.post('/', (req, res) => {
  const { type, title, description, location_name, latitude, longitude, people_affected, severity, reported_by } = req.body;

  if (!type || latitude === undefined || longitude === undefined) {
    return res.status(400).json({
      error: 'Missing required fields: type, latitude, longitude are required.'
    });
  }

  const id = db.get('nextId').value();

  const newReport = {
    id,
    type,
    title: title || null,
    description: description || null,
    location_name: location_name || null,
    latitude,
    longitude,
    people_affected: people_affected || 0,
    severity: severity || 'Moderate',
    status: 'Pending',
    reported_by: reported_by || 'Anonymous',
    created_at: new Date().toISOString()
  };

  db.get('reports').push(newReport).write();
  db.set('nextId', id + 1).write();

  const block = addBlock(newReport, 'SUBMITTED', 'Pending');
  addNotification(
    newReport.reported_by,
    '🚨',
    'New Report Submitted',
    `Your report "${newReport.title || newReport.type}" has been submitted and is pending verification.`
  );

  res.status(201).json({
    message: 'Report submitted successfully',
    report: newReport,
    ledger_hash: block.hash
  });
});


/* =========================================
   GET /api/reports  -> all reports
========================================= */

router.get('/', (req, res) => {
  const { status } = req.query;

  let reports = db.get('reports').value();

  if (status) {
    reports = reports.filter(r => r.status === status);
  }

  const chain = db.get('ledger').value();
  const check = verifyLedger();

  const tampered = new Set(
    check.problems
      .filter(p => p.report_id !== undefined)
      .map(p => p.report_id)
  );

  const result = [...reports]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map(r => {
      const first = chain.find(b => b.report_id === r.id);

      return {
        ...r,
        ledger_hash: first ? first.hash : null,
        ledger_status: tampered.has(r.id)
          ? 'tampered'
          : (first ? 'sealed' : 'unsealed')
      };
    });

  res.json(result);
});


/* =========================================
   LEDGER ROUTES (/:id se pehle hi rakhna)
========================================= */

router.get('/ledger/verify', (req, res) => {
  res.json(verifyLedger());
});

router.get('/ledger', (req, res) => {
  res.json(db.get('ledger').value());
});


/* =========================================
   GET /api/reports/:id
========================================= */

router.get('/:id', (req, res) => {
  const report = db.get('reports').find({ id: Number(req.params.id) }).value();
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  res.json(report);
});


/* =========================================
   PATCH /api/reports/:id  -> verify / reject
========================================= */

router.patch('/:id', (req, res) => {
  const { status, severity, verified_by } = req.body;
  const id = Number(req.params.id);
  const existing = db.get('reports').find({ id }).value();

  if (!existing) {
    return res.status(404).json({ error: 'Report not found' });
  }

  const oldStatus = existing.status;
  const newStatus = status || existing.status;

  const changes = {
    status: newStatus,
    severity: severity || existing.severity
  };

  let extra = {};

  // verify ya reject hone par: kisne kiya aur kaisa (self ya peer)
  if (newStatus !== oldStatus &&
      (newStatus === 'Verified' || newStatus === 'Rejected')) {

    const verifier = String(verified_by || 'Unknown').trim();

    const sameUser =
      verifier.toLowerCase() ===
      String(existing.reported_by || '').trim().toLowerCase();

    const verificationType = sameUser ? 'self' : 'peer';

    changes.verified_by = verifier;
    changes.verification_type = verificationType;

    extra = {
      verified_by: verifier,
      verification_type: verificationType
    };
  }

  db.get('reports').find({ id }).assign(changes).write();

  const updated = db.get('reports').find({ id }).value();

  if (updated.status !== oldStatus) {
    addBlock(updated, updated.status.toUpperCase(), updated.status, extra);
  }

  if (updated.status !== oldStatus &&
      (updated.status === 'Verified' || updated.status === 'Rejected')) {

    const name = updated.title || updated.type;
    const isSelf = extra.verification_type === 'self';

    if (updated.status === 'Verified') {

      addNotification(
        updated.reported_by,
        '✅',
        'Report Verified',
        isSelf
          ? `You verified your own report "${name}" (self-verified).`
          : `Your report "${name}" has been verified by another community member.`
      );

    } else {

      addNotification(
        updated.reported_by,
        '❌',
        'Report Rejected',
        isSelf
          ? `You rejected your own report "${name}".`
          : `Your report "${name}" was rejected by another community member.`
      );
    }
  }
  res.json({ message: 'Report updated', report: updated });
});

module.exports = router;