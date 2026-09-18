# Phase 2 — Database Design & ERD

## Objective
To design a **scalable** and **normalized** database that supports all system modules.

---

# Database Modules
We will divide the database into logical groups:
* Authentication
* CRM
* Projects
* Finance
* Hosting
* Support
* HR
* Notifications
* Reports
* Settings

---

# Authentication Module

## users
`id`, `name`, `email`, `phone`, `password`, `avatar`, `status`, `last_login_at`, `created_at`, `updated_at`

## roles
`id`, `name`, `description`, `created_at`, `updated_at`

## permissions
`id`, `name`, `module`, `created_at`, `updated_at`

## role_user
`user_id`, `role_id`

## permission_role
`permission_id`, `role_id`

---

# CRM Module

## companies
`id`, `company_name`, `industry`, `website`, `tax_number`, `address`, `city`, `country`, `notes`, `created_at`, `updated_at`

## clients
`id`, `company_id`, `name`, `email`, `phone`, `position`, `status`, `created_at`, `updated_at`

## leads
`id`, `name`, `email`, `phone`, `source`, `budget`, `status`, `assigned_to`, `notes`, `created_at`, `updated_at`

## quotations
`id`, `client_id`, `quotation_number`, `price`, `currency`, `status`, `valid_until`, `created_at`, `updated_at`

## contracts
`id`, `client_id`, `quotation_id`, `contract_number`, `start_date`, `end_date`, `status`, `file`, `created_at`, `updated_at`

---

# Projects Module

## projects
`id`, `client_id`, `name`, `description`, `type`, `status`, `priority`, `start_date`, `deadline`, `budget`, `progress`, `created_by`, `created_at`, `updated_at`

## milestones
`id`, `project_id`, `title`, `deadline`, `progress`, `status`, `created_at`, `updated_at`

## tasks
`id`, `project_id`, `milestone_id`, `assigned_to`, `title`, `description`, `status`, `priority`, `start_date`, `due_date`, `estimated_hours`, `actual_hours`, `created_at`, `updated_at`

## task_comments
`id`, `task_id`, `user_id`, `comment`, `created_at`

## bugs
`id`, `project_id`, `task_id`, `reported_by`, `assigned_to`, `severity`, `status`, `description`, `created_at`, `updated_at`

## files
`id`, `project_id`, `uploaded_by`, `file_name`, `file_path`, `size`, `type`, `created_at`

---

# Finance Module

## invoices
`id`, `client_id`, `project_id`, `invoice_number`, `amount`, `status`, `due_date`, `created_at`, `updated_at`

## payments
`id`, `invoice_id`, `method`, `amount`, `paid_at`, `reference`, `created_at`

## expenses
`id`, `category`, `title`, `amount`, `payment_method`, `created_by`, `created_at`

---

# Hosting Module

## domains
`id`, `client_id`, `project_id`, `domain`, `registrar`, `expiry_date`, `auto_renew`, `status`, `created_at`

## hosting_accounts
`id`, `client_id`, `project_id`, `provider`, `plan`, `username`, `server_id`, `expiry_date`, `status`, `created_at`

> **Security Note:** Do not store hosting passwords or API keys as plain text in the database. Use application-level encryption or a Secrets Manager.

## servers
`id`, `name`, `provider`, `ip`, `location`, `os`, `status`, `created_at`

## ssl_certificates
`id`, `domain_id`, `provider`, `expiry_date`, `status`, `created_at`

---

# Support Module

## tickets
`id`, `client_id`, `project_id`, `subject`, `priority`, `status`, `assigned_to`, `created_at`, `updated_at`

## ticket_messages
`id`, `ticket_id`, `sender_id`, `message`, `created_at`

---

# HR Module

## employees
`id`, `user_id`, `department`, `position`, `salary`, `hire_date`, `status`, `created_at`

## attendance
`id`, `employee_id`, `date`, `check_in`, `check_out`

## leaves
`id`, `employee_id`, `type`, `start_date`, `end_date`, `status`

---

# Notifications

## notifications
`id`, `user_id`, `title`, `message`, `type`, `is_read`, `created_at`

---

# Activity Logs

## activity_logs
`id`, `user_id`, `module`, `action`, `ip_address`, `user_agent`, `created_at`

---

# Key relationships (ERD Concept)
```text
Company 
│ 
└──── Clients 
│ 
├──── Quotations 
├──── Contracts 
├──── Projects 
│ │ 
│ ├──── Milestones 
│ │ │ 
│ │ └──── Tasks 
│ │ │ 
│ │ ├──── Comments 
│ │ └──── Bugs 
│ │
│ └──── Files
│
├──── Invoices
│ │
│ └──── Payments
│
├──── Domains
│ └──── SSL Certificates
│
├──── Hosting Accounts
│ └──── Servers
│
└──── Support Tickets
└──── Ticket Messages
```
