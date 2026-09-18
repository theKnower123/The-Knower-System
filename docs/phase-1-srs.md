# Phase 1 — Software Requirements Specification (SRS)

## 1. Project Information
| Field | Value |
| ------------ | ------------------------ |
| Company Name | The Knower System |
| System Name | The Knower OS |
| Project Type | Software House ERP / CRM |
| Version | 1.0 |
| Platform | Web Application |
| Architecture | Multi-Tenant Ready |
| Prepared By | The Knower System |

## 2. Project Vision
To create a unified system that manages all of The Knower System's operations, eliminating the need for the team to use external tools such as Trello, Excel, or separate CRM systems.

The system will be responsible for:
* Customer Management
* Project Management
* Team Management
* Task Management
* Invoicing
* Hosting
* Technical Support
* Reports
* Permissions
* Notifications
* File Management

## 3. Project Objectives
### Business Goals
* Reduce wasted time in project management.
* Organize all customer data.
* Track profits and expenses.
* Monitor employees.
* Improve communication with customers.
* Manage hosting and domains.
* Accelerate project delivery.

## 4. User Roles
* **Super Admin**: Full system access.
* **CEO**: Views Earnings, Clients, Projects, Reports, Employees.
* **Sales**: Can Add Lead, Add Client, Create Quote, Follow Up with Clients.
* **Project Manager**: Create Projects, Assign Tasks, Monitor Team, Approve Completion.
* **Team Leader**: Review Code, Monitor Developers, Review Quality.
* **Software Developer**: View Tasks, Upload Files, Update Task Status, Add Notes.
* **UI/UX Designer**: Upload Designs, Update Designs, Share Files.
* **QA Tester**: Test Projects, Log Bugs, Approve Versions.
* **Accountant**: Invoices, Expenses, Earnings, Payments.
* **HR**: Employees, Attendance, Vacations, Salaries.
* **Support**: Responding to Customers, Ticket Management.
* **Client**: Views only Project, Invoices, Contract, Percentage Completion, Technical Support.

## 5. Modules
* **Dashboard**: Displays Projects, Revenue, Clients, Notifications, Tasks, Charts
* **CRM**: Leads, Clients, Companies, Contacts, Meetings, Notes
* **Projects**: Projects, Milestones, Tasks, Subtasks, Bugs, Files, Timeline
* **Finance**: Invoices, Payments, Expenses, Revenue, Reports
* **Hosting**: Domains, Hosting Accounts, Servers, SSL Certificates, Renewals, DNS
* **HR**: Employees, Departments, Attendance, Leaves, Payroll
* **Support**: Tickets, Replies, Attachments, Status
* **Reports**: Sales Report, Finance Report, Clients Report, Projects Report, Employees Report
* **Settings**: Company, SMTP, APIs, Backup, Notifications, Security

## 6. Workflow
Lead → Meeting → Quotation → Negotiation → Contract → Invoice → Payment → Project Creation → Task Assignment → Development → Testing → Deployment → Hosting → Support → Maintenance

## 7. Dashboard KPIs
* Number of clients, New clients
* Active projects, Completed projects, Overdue projects
* Monthly revenue, Annual revenue, Unpaid invoices
* Number of open tickets
* Number of online employees
* Hosting accounts expiring soon, Domains expiring soon

## 8. Functional Requirements
* Login and logout
* User and permissions management
* Client and company creation
* Project and task creation
* File uploading
* Issuing quotes
* Contract creation
* Invoice creation * Payment recording.
* Hosting and domain management.
* Ticket creation.
* Notification sending.
* PDF and Excel report generation.
* Advanced search and filters.
* Activity log.

## 9. Non-Functional Requirements
* Responsive across all devices.
* Arabic and English support.
* Fast performance (low latency).
* Password encryption.
* Protection against CSRF, XSS, and SQL injection.
* Automatic backup.
* Flexible permissions system (RBAC).
* Scalability.
* API support.

## 10. Technology Stack
* **Backend:** Laravel 12
* **Frontend:** react js
* **Database:** MySQL 8
* **Cache & Queue:** Redis
* **Authentication:** Laravel Sanctum
* **Roles & Permissions:** Spatie Permission
* **Real-time:** Laravel Reverb
* **Storage:** S3 Compatible Storage
* **Web Server:** Nginx
* **Deployment:** Docker
