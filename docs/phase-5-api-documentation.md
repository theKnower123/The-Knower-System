# Phase 5 — API Documentation

## 1. API Standards

### Base URL
```text
https://api.theknowersystem.com/api/v1
```

---

### Response Format

**success**
```json
{ 
  "success": true, 
  "message": "Operation completed successfully.", 
  "data": {}
}
```

---

**mistake**
```json
{ 
  "success": false, 
  "message": "Validation failed.", 
  "errors": {}
}
```

---

## 2. Authentication

### Login
```http
POST /auth/login
```
Request
```json
{ 
  "email": "admin@example.com", 
  "password": "********"
}
```
Response
```json
{ 
  "token": "...", 
  "user": {}
}
```

---

### Logout
```http
POST /auth/logout
```

---

### Current User
```http
GET /auth/me
```

---

### Refresh Session
```http
POST /auth/refresh
```

---

# 3. Users API
```text
GET /users
GET /users/{id}
POST /users
PUT /users/{id}
DELETE /users/{id}
```

---

# 4. Roles API
```text
GET /roles
POST /roles
PUT /roles/{id}
DELETE /roles/{id}
```

---

# 5. Permissions API
```text
GET /permissions
```

---

# 6. CRM APIs

## Leads
```text
GET /leads
POST /leads
GET /leads/{id}
PUT /leads/{id}
DELETE /leads/{id}
```

---

## Clients
```text
GET /clients
POST /clients
GET /clients/{id}
PUT /clients/{id}
DELETE /clients/{id}
```

---

## Companies
```text
GET /companies
POST /companies
PUT /companies/{id}
DELETE /companies/{id}
```

---

## Quotations
```text
GET /quotations
POST /quotations
PUT /quotations/{id}
DELETE /quotations/{id}
```

---

## Contracts
```text
GET /contracts
POST /contracts
PUT /contracts/{id}
DELETE /contracts/{id}
```

---

# 7. Projects API

## Projects
```text
GET /projects
POST /projects
GET /projects/{id}
PUT /projects/{id}
DELETE /projects/{id}
```

---

## Milestones
```text
GET /projects/{id}/milestones
POST /projects/{id}/milestones
```

---

## Tasks
```text
GET /tasks
POST /tasks
PUT /tasks/{id}
DELETE /tasks/{id}
```

---

## Task Comments
```text
GET /tasks/{id}/comments
POST /tasks/{id}/comments
```

---

## Bugs
```text
GET /bugs
POST /bugs
PUT /bugs/{id}
DELETE /bugs/{id}
```

---

## Files
```text
POST /projects/{id}/files
GET /projects/{id}/files
DELETE /files/{id}
```

---

# 8. Finance APIs

## Invoices
```text
GET /invoices
POST /invoices
PUT /invoices/{id}
DELETE /invoices/{id}
```

---

## Payments
```text
GET /payments
POST /payments
```

---

## Expenses
```text
GET /expenses
POST /expenses
PUT /expenses/{id}
DELETE /expenses/{id}
```

---

# 9. Hosting APIs

## Domains
```text
GET /domains
POST /domains
PUT /domains/{id}
DELETE /domains/{id}
```

---

## Hosting Accounts
```text
GET /hosting
POST /hosting
PUT /hosting/{id}
DELETE /hosting/{id}
```

---

## Servers
```text
GET /servers
POST /servers
PUT /servers/{id}
DELETE /servers/{id}
```

---

## SSL
```text
GET /ssl
POST /ssl
PUT /ssl/{id}
DELETE /ssl/{id}
```

---

# 10. Support APIs

## Tickets
```text
GET /tickets
POST /tickets
PUT /tickets/{id}
DELETE /tickets/{id}
```

---

## Ticket Replies
```text
GET /tickets/{id}/messages
POST /tickets/{id}/messages
```

---

# 11. HR APIs

## Employees
```text
GET /employees
POST /employees
PUT /employees/{id}
DELETE /employees/{id}
```

---

## Attendance
```text
GET /attendance
POST /attendance
```

---

## Leaves
```text
GET /leaves
POST /leaves
PUT /leaves/{id}
```

---

# 12. Reports APIs
```text
GET /reports/revenue
GET /reports/projects
GET /reports/clients
GET /reports/employees
GET /reports/finance
```

---

# 13. Notifications
```text
GET /notifications
PUT /notifications/read
DELETE /notifications/{id}
```

---

# 14. AI Assistant
```text
POST /ai/chat
POST /ai/generate-quotation
POST /ai/generate-tasks
POST /ai/project-summary
POST /ai/analyze-bug
POST /ai/summarize-ticket
```

---

# 15. Search
```text
GET /search
```
example:
```text
GET /search?q=pharmacy
```

---

# 16. Upload API
```text
POST /upload
```
Supports:
* Images
* PDFs
* Word
* Excel
* ZIP
* Project Files

---

# 17. Export API
```text
GET /export/pdf
GET /export/excel
```

---

# 18. Dashboard APIs
```text
GET /dashboard
GET /dashboard/revenue
GET /dashboard/projects
GET /dashboard/tasks
GET /dashboard/charts
```

---

# 19. Settings APIs
```text
GET /settings
PUT /settings/company
PUT /settings/mail
PUT /settings/security
PUT /settings/backup
```

---

# 20. API Security
* Use HTTPS only.
* Authentication via Laravel Sanctum.
* Role-Based Access Control (RBAC).
* Rate Limiting.
* Validation for all requests.
* Audit Log.
* Versioning (`/api/v1`) with preparation for a future `/api/v2` release.
