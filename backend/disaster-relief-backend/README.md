# Disaster Relief Backend - Setup Guide

## Ye kya karta hai
Jab citizen "Report an Incident" form submit karega, ye backend us report ko
`db/disaster_relief.json` file mein save kar dega. Dashboard/map is
backend se hi data fetch karke reports dikhayega.

Database ke liye lowdb use kiya gaya hai - ye pure JavaScript hai, isliye
koi Python/build-tools install karne ki zaroorat nahi hai.

## Setup Steps (VS Code Terminal mein run karein)

1. Is `disaster-relief-backend` folder ko apne project ke andar rakhein
   (jaise `disaster-relief-app/backend/`)

2. Terminal ko **Command Prompt (cmd)** par rakhein (PowerShell nahi,
   dropdown se "cmd" select karein terminal ke upar)

3. Us folder mein jaayein:
   ```
   cd disaster-relief-backend
   ```

4. Dependencies install karein:
   ```
   npm install
   ```

5. Server start karein:
   ```
   npm start
   ```

6. Agar sab sahi hua, to terminal mein dikhega:
   ```
   Server running at http://localhost:5000
   ```

7. Browser mein `http://localhost:5000` khol ke check karein -
   "Disaster Relief Backend is running." dikhna chahiye.

## API Endpoints

| Method | URL                     | Kaam                                  |
|--------|-------------------------|----------------------------------------|
| POST   | /api/reports             | Naya incident report submit karna      |
| GET    | /api/reports             | Saare reports fetch karna              |
| GET    | /api/reports?status=Verified | Sirf verified reports fetch karna |
| GET    | /api/reports/:id          | Ek specific report fetch karna         |
| PATCH  | /api/reports/:id          | Report ka status update karna (Responder ke liye) |

## Frontend Connect Karna

`frontend-example.js` file dekhein - ismein `submitReport()` aur `loadReports()`
functions hain jo aap apne existing HTML/JS dashboard mein copy-paste karke
use kar sakte hain.

Important: Frontend ko HTML file directly open karke test mat karein
(file:// URL se CORS issue ho sakta hai) - use "Live Server" extension in VS Code,
ya simple `npx serve` command se frontend ko bhi serve karein.

## Report kahan save hoti hai?

Har report `db/disaster_relief.json` file mein permanently save hoti hai. Ye file
automatically ban jaati hai jab aap pehli baar server start karte hain. Isse aap
seedha text editor mein khol ke bhi data dekh sakte hain, kyunki ye simple JSON hai.
