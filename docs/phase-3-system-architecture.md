# Phase 3 — System Architecture

## 1. Architecture Style
I recommend using **Modular Monolith** with Laravel.

Why?
* Easier to develop than Microservices.
* Faster to start.
* Easier to scalable into Microservices in the future if the company grows.

---

# 2. Tech Stack

### Backend
* Laravel 12
* PHP 8.4+

### Frontend
* Vue.js 3
* Inertia.js
* Tailwind CSS

### Database
* MySQL 8

### Cache
* Redis

### Queue
* Redis Queue

### Storage
* Amazon S3 or any S3 Compatible Storage

### Authentication
* Laravel Sanctum

### Roles & Permissions
* Spatie Permission

---

# 3. Folder Structure
```text
app/
Modules/ 
Authentication/ 
CRM/ 
Clients/ 
Projects/ 
Tasks/ 
Finance/ 
Hosting/ 
Support/ 
HR/ 
Reports/ 
AI/ 
Notifications/
Settings/
Core/
Services/
Repositories/
Actions/
Policies/
Enums/
Traits/
Events/
Listeners/
Jobs/
Mail/
Notifications/
Rules/
```

---

# 4. Inside each Module
Example Module named Projects:
```text
Projects/
Controllers/
Models/
Requests/
Services/
Repositories/
Policies/
Events/
Listeners/
Jobs/
Resources/
Routes/
Views/
```
Each Module is independent of the others.

---

# 5. Design Pattern
We will use:
* Repository Pattern
* Service Layer
* DTO
* Observer
* Event Driven
* Dependency Injection

---

# 6. Authentication Flow
```text
Login
↓
Sanctum
↓
Middleware
↓
Permission Check
↓
Controller
↓
Service
↓
Repository
↓
Database
```

---

# 7. Project Flow
```text
Lead
↓
Quotation
↓
Contract
↓
Invoice
↓
Payment
↓
Project
↓
Tasks
↓
Development
↓
Testing
↓
Deployment
↓
Support
```

---

# 8. API Structure
```text
/api/v1/
```
Modules:
```text
/api/v1/auth
/api/v1/users
/api/v1/clients
/api/v1/projects
/api/v1/tasks
/api/v1/invoices
/api/v1/support
/api/v1/domains
/api/v1/hosting
/api/v1/reports
```

---

# 9. Dashboard Architecture
Dashboard will be made up of Widgets.
For example:
```text
Revenue Widget
Projects Widget
Clients Widget
Hosting Widget
Tickets Widget
Invoices Widget
Notifications Widget
Employees Widget
```
Each widget is independent.

---

# 10. Permissions
Each page is associated with a Permission.
Example:
```text
project.view
project.create
project.edit
project.delete
invoice.create
invoice.pay
ticket.reply
hosting.edit
domain.renew
```

---

# 11. Notifications
Any significant event triggers a notification.
For example:
* New client.
* New project.
* Invoice paid.
* Domain about to expire. 
* Hosting is about to expire.
* New ticket.
* New bug.

---

# 12. Queue Jobs
All heavy-duty operations are handled within a queue.
For example:
* Sending emails.
* Creating PDFs.
* Backup.
* Uploading files.
* Sending notifications.
* Image processing.

---

# 13. Security
* CSRF Protection
* XSS Protection
* SQL Injection Protection
* Rate Limiting
* 2FA (Optional)
* Encrypted Secrets
* Activity Logs
* Password Hashing

---

# 14. Logging
We log all important operations.
Example:
```text
User Login
Client Created
Project Updated
Invoice Paid
Hosting Renewed
Domain Added
Permission Changed
```

---

# 15. AI Module (Premium Feature)
Instead of AI being just a chatbot, make it part of the system:
* Analyze client requirements.
* Propose an initial project price.
* Write a quotation.
* Create a scope of work.
* Break the project into tasks.
* Write documentation.
* Propose a timeline.
* Review code.
* Summarize tickets.
* Suggest solutions for errors.

---

# 16. Implementation Plan (Roadmap)
I recommend adopting the project in this order:
1. Authentication & Roles
2. Dashboard
3. CRM
4. Projects & Tasks
5. Finance
6. Support
7. Hosting & Domains
8. Notifications
9. Reports
10. AI Module
11. Settings
12. Deployment
