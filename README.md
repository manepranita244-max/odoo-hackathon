# odoo-hackathon

🚚 TransitOps – Smart Transport Operations Platform

A centralized platform to manage transport operations, vehicle lifecycle, drivers, trips, maintenance, fuel, and operational expenses.

📖 Overview

TransitOps is a modern Transport Operations Management System built to digitize and automate fleet operations. The platform replaces spreadsheets and manual records with a single, secure system where organizations can efficiently manage their vehicles, drivers, trips, maintenance schedules, fuel logs, and expenses.

The system also provides real-time dashboards and analytics that help businesses monitor fleet performance, reduce operational costs, and improve decision-making.

🎯 Problem Statement

Many transport and logistics companies still depend on manual processes for managing fleet operations. These traditional methods often result in:

Vehicle scheduling conflicts
Driver assignment errors
Missed maintenance schedules
Expired driving licenses
Inaccurate fuel and expense tracking
Limited operational visibility

TransitOps addresses these challenges by providing a centralized and automated transport management solution.

💡 Solution

TransitOps brings all transport-related operations into one platform. The application manages vehicles, drivers, trips, maintenance records, fuel logs, and operational expenses while automatically enforcing business rules and updating vehicle and driver statuses.

The platform improves productivity, minimizes manual errors, and provides meaningful insights through interactive dashboards and reports.

🏗️ System Architecture
                    +--------------------+
                    |       Users        |
                    +--------------------+
                             |
          ------------------------------------------
          |          |           |                |
   Fleet Manager  Dispatcher  Safety Officer  Financial Analyst
                             |
                       Secure Login (RBAC)
                             |
                     +-------------------+
                     |     Dashboard     |
                     +-------------------+
                             |
 ------------------------------------------------------------------------
 |              |               |               |              |           |
Vehicle      Driver          Trip        Maintenance     Fuel &      Reports &
Management  Management     Management      Management    Expenses    Analytics
 |              |               |               |              |           |
CRUD         CRUD       Assign Driver     Service Log    Fuel Log    KPI Charts
Status       License    Assign Vehicle    Status Update  Expenses    Export CSV
Update       Check      Complete Trip     Available      Cost        Performance


Project structure

```
transitops/
├── backend/
│   ├── config/db.js          MongoDB connection
│   ├── models/                Mongoose schemas (User, Vehicle, Driver, Trip, Maintenance, FuelLog, Expense)
│   ├── controllers/           Business logic + validation rules
│   ├── routes/                Express route definitions
│   ├── middleware/             JWT auth + role-based access control
│   ├── seed/seed.js            Demo data generator
│   └── server.js
└── frontend/
    └── src/
        ├── pages/              Login, Register, Dashboard, Vehicles, Drivers, Trips, Maintenance, FuelExpenses, Reports
        ├── components/         Sidebar layout, KPI cards, gauge chart, modal, status badges
        ├── context/AuthContext.jsx
        └── api/axios.js
```

🛠️ Tech Stack

Frontend
React.js
Tailwind CSS
HTML5
CSS3
JavaScript

Backend
Node.js
Express.js

Database
MongoDB


✨ Features
🔐 Authentication

Secure Login
Email & Password Authentication
Role-Based Access Control (RBAC)

🚚 Vehicle Management

Add, Edit and Delete Vehicles
Vehicle Status Tracking
Capacity Management
Vehicle Registry

👨‍✈️ Driver Management

Driver Profile Management
License Validation
Safety Score Tracking
Driver Availability

📦 Trip Management

Create Trips
Assign Vehicle & Driver
Dispatch Trips
Complete or Cancel Trips
Automatic Status Updates

🔧 Maintenance

Maintenance Scheduling
Vehicle Repair Records
Automatic "In Shop" Status

⛽ Fuel & Expense Management

Fuel Log Recording
Maintenance Expenses
Toll Expenses
Operational Cost Calculation

📊 Dashboard & Analytics

Active Vehicles
Active Trips
Fleet Utilization
Fuel Efficiency
Operational Cost
Vehicle ROI
Interactive Charts

👥 User Roles

Role	                       Responsibilities
Fleet Manager	     Manage vehicles, maintenance and fleet operations
Dispatcher	         Create and manage trips
Safety Officer	     Monitor driver licenses and safety
Financial Analyst	 Track expenses, fuel costs and reports

⚙️ Business Rules

Every vehicle must have a unique registration number.
Vehicles under maintenance cannot be assigned to trips.
Drivers with expired licenses cannot be assigned.
Suspended drivers cannot start trips.
Cargo weight cannot exceed vehicle capacity.
Vehicle and driver status automatically change during dispatch and completion.
Completing a trip automatically restores vehicle and driver availability.

📊 Dashboard KPIs

Active Vehicles
Available Vehicles
Vehicles in Maintenance
Active Trips
Pending Trips
Drivers On Duty
Fleet Utilization
Fuel Efficiency
Operational Cost
Vehicle ROI

🚀 Future Enhancements

Live GPS Tracking
Predictive Maintenance
AI-based Route Optimization
Mobile Application
Email & SMS Notifications
QR Code Vehicle Inspection
Real-time Driver Monitoring

📈 Benefits

Reduces manual work
Improves fleet management
Saves time
Minimizes operational errors
Tracks expenses efficiently
Provides better business insights