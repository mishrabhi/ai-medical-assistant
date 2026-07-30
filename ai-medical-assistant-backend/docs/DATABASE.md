# Database Design

## Database

- PostgreSQL 16
- Prisma ORM

## Core Entities

- User
- RefreshToken
- Doctor
- Appointment
- MedicalReport
- SymptomCheck
- ChatSession
- ChatMessage
- Reminder
- EmergencyContact
- Notification
- AuditLog

## User Relationships

User

├── RefreshTokens

├── MedicalReports

├── SymptomChecks

├── Appointments

├── ChatSessions

├── Reminders

├── EmergencyContacts

├── Notifications

└── AuditLogs

## Entity Order

The database schema is implemented in the following order:

1. User
2. RefreshToken
3. Doctor
4. Appointment
5. MedicalReport
6. SymptomCheck
7. ChatSession
8. ChatMessage
9. Reminder
10. EmergencyContact
11. Notification
12. AuditLog

## Database Standards

- All primary keys use `cuid()`.
- Every model includes `createdAt` and `updatedAt`.
- All foreign keys are indexed.
- Enums are used instead of string literals for status fields.
- Repository classes are the only layer allowed to access Prisma.


## Completed

### Enums

- UserRole
- Gender
- BloodGroup
- AppointmentStatus
- ReportType

### Models

- User
- RefreshToken
- Doctor : Stores doctor information available for appointment booking.
- Appointment : Represents appointments booked by users with doctors.
- MedicalReport : Stores uploaded medical reports along with OCR text and AI-generated summaries.
- SymptomCheck : Stores AI-powered symptom analysis history.
- 

### Relationships

User (1) -------- (*) RefreshToken

## Sprint 2 Status

✅ Database schema finalized

### Migration

- Initial migration created successfully.
- Prisma Client generated.
- PostgreSQL schema synchronized.

### Current Models

- User
- RefreshToken
- Doctor
- Appointment
- MedicalReport
- SymptomCheck
- ChatSession
- ChatMessage
- Reminder
- EmergencyContact

Status: Complete ✅

