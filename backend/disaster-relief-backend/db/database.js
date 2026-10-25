// db/database.js
// Sets up a simple JSON-file based database using lowdb.
// No compilation/build tools needed - pure JavaScript, works everywhere.

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

// This creates a file called disaster_relief.json inside the db/ folder.
// All submitted reports will physically live inside this file.
const adapter = new FileSync(path.join(__dirname, 'disaster_relief.json'));
const db = low(adapter);

// Set default structure if the file is empty (first run)
db.defaults({ reports: [], nextId: 1 }).write();

module.exports = db;
