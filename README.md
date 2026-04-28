India Crime Hotspot Portal:

India Crime Hotspot Portal is a full-stack web application developed to analyze, manage, and visualize crime data across different states of India. The system helps users understand crime trends, hotspot regions, and crime statistics through interactive dashboards, charts, maps, and prediction modules.
This project is designed using React.js for the frontend, FastAPI (Python) for the backend, and MySQL for database management. It also uses Pandas and CSV datasets for crime data analysis.

Features:
User Authentication:
User Registration
Secure Login System
Access Control for Users

Dashboard Analytics:
Total Crime Count
State-wise Crime Statistics
Summary Cards
Visual Reports

Crime Records Management:
Add New Crime Records
View All Records
Delete Crime Records
Organized Table Display

Data Visualization:
Bar Charts
Pie Charts
Trend Analysis
State Comparison Charts

India Map Module:
Crime Distribution by State
Hotspot Identification
Interactive Map View

Prediction Module:
Predict Crime Trends
Analyze Future Possibilities
Data-driven Insights

Responsive Design:
Desktop Friendly
Mobile Responsive
Clean Modern UI

Technologies Used:
Frontend
React.js
JavaScript
HTML5
CSS3
Tailwind CSS
Bootstrap

Backend
Python
FastAPI
REST API

Database:
MySQL

Data Analysis:
Pandas
CSV Dataset

Project Structure:
India-Crime-Hotspot-Portal/
│── public/
│── src/
│   ├── App.js
│   ├── Dashboard.js
│   ├── DashboardPage.js
│   ├── CrimeManager.js
│   ├── CrimeCharts.js
│   ├── CrimePrediction.js
│   ├── CrimeTable.js
│   ├── IndiaMap.js
│   ├── StatsCards.js
│   ├── Login.js
│   ├── Register.js
│   ├── Input.js
│   ├── api.js
│   ├── dashboard.css
│   ├── auth.css
│
│── backend/
│   ├── main.py
│   ├── auth.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│
│── crimes.csv
│── requirements.txt
│── package.json
│── README.md

Installation Guide
1. Clone the Repository
git clone https://github.com/your-username/India-Crime-Hotspot-Portal.git
cd India-Crime-Hotspot-Portal
Backend Setup
Install Python Dependencies
pip install -r requirements.txt
Run FastAPI Server
uvicorn main:app --reload

Backend runs at:

http://127.0.0.1:8000
Frontend Setup
Install Node Modules
npm install
Run React Application
npm start

Frontend runs at:

http://localhost:3000
Database Setup
Create MySQL Database
CREATE DATABASE crimeportal;

Update database credentials inside:

database.py

Example:

DATABASE_URL = "mysql+pymysql://root:password@localhost:3306/crimeportal"
API Endpoints
Authentication APIs
POST /register
POST /login
Crime APIs
GET /crimes
POST /crimes
DELETE /crimes/{id}
Dashboard APIs
GET /dashboard/stats
GET /state-count
Prediction APIs
GET /predict
Main Modules
Login & Register

Allows users to securely access the system.

Dashboard

Displays crime overview with cards and charts.

Crime Manager

Handles add, view, and delete crime records.

Charts

Visual representation of crime statistics.

India Map

Shows crime hotspots state-wise.

Prediction

Predicts crime trends using existing data.

Screenshots

Add screenshots here:

Login Page
Dashboard
Crime Records
Charts
India Map
Prediction Module
Future Enhancements
Real-time Crime Data APIs
Machine Learning Prediction
Heatmap Visualization
Export Reports to PDF / Excel
Admin Panel
Role-Based Access
Notification Alerts
Mobile Application
Advantages
Easy Crime Data Management
Better Visualization
Fast Analysis
User Friendly Interface
Helps Identify Hotspot Areas
Scalable Architecture
