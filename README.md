# ASPMonitor Dashboard

**ASPMonitor Dashboard** is a web-based application designed for monitoring and visualizing data collected from test result files (`.RES`). This system retrieves parsed data from a SQL Server database processed by a separate Windows Form application (Monitor Interface). The dashboard presents real-time data visualization organized by **Room → Section**, along with recent activities, summary counts, and user management.

---

## ✨ Features

- 🔐 Secure user login and authentication
- 📊 Dashboard displays data organized by **Room → Section**
- 🔄 Real-time data updates synchronized from the database
- 🕒 Recent activities timeline to track incoming data
- 📈 Summary of total test counts and sections
- ⚙️ Manage rooms and sections dynamically
- 🌐 Fully deployable on **IIS (Internet Information Services)** for local or network access

---

## 🛠️ Tech Stack

- Backend: **ASP.NET Core MVC (C#)**
- Frontend: **Razor Pages**, **Bootstrap 5**, **HTML/CSS**, **JavaScript**
- Database: **SQL Server**
- ORM: **Entity Framework Core**
- Hosting: **IIS (Internet Information Services)**

---

## 📦 Database Setup

1. Open **SQL Server Management Studio (SSMS)**.
2. Run the SQL script located in `/Database/aspdashboard.sql`.
3. This will create the database, tables, sample data, and stored procedures automatically.

---

## 🚀 Deployment Guide

⚙️ Configure appsettings.json

    "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ASPMonitorDB;Trusted_Connection=True;"
    }

🌐 IIS Deployment
Open IIS Manager.

Add a new Website or Application pointing to the project’s publish folder.

Configure the Application Pool to use .NET CLR Version No Managed Code and Managed Pipeline Mode: Integrated.

Ensure ASP.NET Core Hosting Bundle is installed on the server.

Bind the website to a port or domain as needed (e.g., http://localhost:8080 or internal network IP).

Apply permissions to allow IIS to access the project files.

---
## 🔥 ✅ วิธีใช้งาน

1. เปิดไฟล์ **`README.md`** ใน Visual Studio
2. วางเนื้อหานี้ทั้งหมดลงไป
3. Save
4. ใช้คำสั่ง:

```bash
git add README.md
git commit -m "Add professional README.md for ASPMonitor Dashboard"
git push

---

### 📥 Clone the repository

```bash
git clone https://github.com/yourusername/ASPMonitor-Dashboard.git
