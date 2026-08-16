# API Documentation

This document contains all REST API endpoints implemented in the backend.

Base URL:

`/api/v1`

Status: Backend API implementation completed for current MVP scope.


# Sprint-wise Distribution

Sprint 1 ✅ Project Foundation

Sprint 2 ✅ Database Design

Sprint 3 ✅ Authentication & Authorization

Sprint 4 ✅ Medical Reports Management

Sprint 5 ✅ OCR Processing

Sprint 6 ✅ AI Report Analysis

Sprint 7 ✅ AI Symptom Checker

Sprint 8 ✅ AI Chat Assistant

Sprint 9 ✅ Appointments & Reminders

Sprint 10 ✅ Notifications

Sprint 11 ✅ Symptoms & Symptom History

Sprint 12 ✅ User Profile & Account Management

Sprint 13 ✅ Doctors & Admin Doctor Management

Sprint 14 ✅ Backend Infrastructure & Error Handling

Sprint 15 ✅ Production Hardening & Deployment Readiness


# Sprint 1 - Project Foundation

## Sprint 1.1 - Project Setup

- [x] Initialize backend project
- [x] Configure TypeScript
- [x] Setup Express server
- [x] Configure environment variables
- [x] Setup folder structure

## Sprint 1.2 - Development Environment

- [x] Setup Docker
- [x] Configure PostgreSQL container
- [x] Configure Redis container
- [x] Connect application to PostgreSQL
- [x] Connect application to Redis

## Sprint 1.3 - Core Infrastructure

- [x] Configure Prisma ORM
- [x] Generate Prisma Client
- [x] Setup database connection
- [x] Configure Redis client
- [x] Health Check API
- [x] Global middleware setup
- [x] Static project architecture

### APIs Implemented

- GET /api/v1/health


# Sprint 2 - Database Design

## Sprint 2.1 - Database Modeling

- [x] Design application database
- [x] Define enums
- [x] Define relationships
- [x] Optimize indexes
- [x] Configure Prisma schema

## Sprint 2.2 - Initial Database Migration

- [x] Generate initial migration
- [x] Apply migration
- [x] Generate Prisma Client
- [x] Validate database schema

## Database Models

- [x] User
- [x] RefreshToken
- [x] Doctor
- [x] Appointment
- [x] MedicalReport
- [x] SymptomCheck
- [x] ChatSession
- [x] ChatMessage
- [x] Reminder
- [x] EmergencyContact
- [x] Notification


# Sprint 3 - Authentication & Authorization

## Sprint 3.1 - Authentication Foundation

- [x] JWT utilities
- [x] Password hashing using bcrypt
- [x] Cookie utilities
- [x] Authentication module structure
- [x] Validation using Zod

## Sprint 3.2 - User Authentication

- [x] User Registration
- [x] User Login
- [x] Password hashing before storage
- [x] Refresh Token storage
- [x] Access Token generation
- [x] Refresh Token generation

## Sprint 3.3 - Authorization

- [x] Authentication middleware
- [x] Protected routes
- [x] Current user endpoint
- [x] Admin authorization middleware
- [x] Async handler
- [x] Request validation middleware

## Sprint 3.4 - Session Management

- [x] Refresh Access Token
- [x] Refresh Token Rotation
- [x] User Logout
- [x] Clear Refresh Token Cookie
- [x] HttpOnly Refresh Token Cookie

### APIs Implemented

#### Authentication

- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- POST /api/v1/auth/logout
- GET /api/v1/auth/me


# Sprint 4 - Medical Reports

## Sprint 4.1 - Upload Reports

- [x] Setup Multer
- [x] Configure upload directory
- [x] Upload medical reports
- [x] Store report metadata in PostgreSQL
- [x] Serve uploaded files

## Sprint 4.2 - Report Management

- [x] Get all reports
- [x] Get report by ID
- [x] Delete report
- [x] Delete uploaded file from storage

### APIs Implemented

- POST /api/v1/reports
- GET /api/v1/reports
- GET /api/v1/reports/:id
- DELETE /api/v1/reports/:id


# Sprint 5 - OCR Processing

## Sprint 5.1 - OCR Service

- [x] Setup OCR service
- [x] PDF text extraction
- [x] Image text extraction
- [x] Tesseract.js integration
- [x] PDF parsing using pdf-parse
- [x] Validate supported file types

## Sprint 5.2 - OCR Processing API

- [x] Process uploaded medical report
- [x] Extract text from medical reports
- [x] Store OCR text
- [x] Prevent unsupported file processing

### APIs Implemented

- POST /api/v1/reports/:id/ocr


# Sprint 6 - AI Report Analysis

## Sprint 6.1 - AI Integration

- [x] OpenAI integration
- [x] Medical report analysis
- [x] Patient-friendly explanations
- [x] Risk level generation
- [x] Abnormal findings detection
- [x] Recommendations generation

## Sprint 6.2 - Report Analysis

- [x] Require OCR before AI analysis
- [x] Analyze OCR extracted report text
- [x] Store AI analysis
- [x] Retrieve stored analysis

### APIs Implemented

- POST /api/v1/reports/:id/analyze
- GET /api/v1/reports/:id/analysis


# Sprint 7 - AI Symptom Checker

## Sprint 7.1 - Symptom Analysis

- [x] Symptom input validation
- [x] AI symptom analysis
- [x] Possible causes generation
- [x] Risk level generation
- [x] Urgency classification
- [x] Recommendations
- [x] Warning signs

## Sprint 7.2 - Symptom History

- [x] Store symptom checks
- [x] Get symptom history
- [x] Get symptom check by ID
- [x] Delete symptom check

### APIs Implemented

- POST /api/v1/symptoms/check
- GET /api/v1/symptoms
- GET /api/v1/symptoms/:id
- DELETE /api/v1/symptoms/:id


# Sprint 8 - AI Chat Assistant

## Sprint 8.1 - Chat Sessions

- [x] Create chat session
- [x] Get chat sessions
- [x] Get chat session
- [x] Archive chat session
- [x] Delete chat session

## Sprint 8.2 - Chat Messages

- [x] Send message
- [x] AI response generation
- [x] Store chat messages
- [x] Retrieve chat messages

### APIs Implemented

- POST /api/v1/chat/sessions
- POST /api/v1/chat/sessions/:id/messages
- GET /api/v1/chat/sessions
- GET /api/v1/chat/sessions/:id
- GET /api/v1/chat/sessions/:id/messages
- PATCH /api/v1/chat/sessions/:id/archive
- DELETE /api/v1/chat/sessions/:id

# Sprint 9 - Appointments & Reminders

## Sprint 9.1 - Appointments

- [x] Create appointment
- [x] Validate appointment date
- [x] Validate doctor availability
- [x] Prevent duplicate appointment slots
- [x] Get user appointments
- [x] Get appointment by ID
- [x] Update appointment status
- [x] Delete appointment

### APIs Implemented

- POST /api/v1/appointments
- GET /api/v1/appointments
- GET /api/v1/appointments/:id
- PATCH /api/v1/appointments/:id/status
- DELETE /api/v1/appointments/:id

## Sprint 9.2 - Reminders

- [x] Create reminder
- [x] Get reminders
- [x] Get reminder by ID
- [x] Update reminder
- [x] Delete reminder
- [x] Pause reminder
- [x] Complete reminder
- [x] Repeat reminders
- [x] Reminder scheduler
- [x] Reminder processing

### APIs Implemented

- POST /api/v1/reminders
- GET /api/v1/reminders
- GET /api/v1/reminders/:id
- PATCH /api/v1/reminders/:id
- DELETE /api/v1/reminders/:id
- PATCH /api/v1/reminders/:id/status
- PATCH /api/v1/reminders/:id/complete

# Sprint 10 - Notifications

## Sprint 10.1 - Notification System

- [x] Notification model
- [x] Create notifications
- [x] Retrieve notifications
- [x] Mark notification as read
- [x] Mark all notifications as read
- [x] Reminder-generated notifications

### APIs Implemented

- GET /api/v1/notifications
- PATCH /api/v1/notifications/:id/read
- PATCH /api/v1/notifications/read-all

# Sprint 11 - Symptoms & Symptom History

## Sprint 11.1 - Symptom Checker

- [x] Symptom input
- [x] AI symptom analysis
- [x] Risk assessment
- [x] Urgency assessment
- [x] Warning signs
- [x] Recommendations

## Sprint 11.2 - Symptom History

- [x] Store symptom analysis
- [x] Retrieve history
- [x] Retrieve individual check
- [x] Delete symptom check

### APIs Implemented

- POST /api/v1/symptoms/check
- GET /api/v1/symptoms
- GET /api/v1/symptoms/:id
- DELETE /api/v1/symptoms/:id

# Sprint 12 - User Profile & Account Management

## Sprint 12.1 - User Profile

- [x] Get user profile
- [x] Update user profile
- [x] Upload profile picture

## Sprint 12.2 - Account Management

- [x] Change password
- [x] Deactivate account

### APIs Implemented

- GET /api/v1/users/profile
- PATCH /api/v1/users/profile
- PATCH /api/v1/users/profile-picture
- PATCH /api/v1/users/change-password
- PATCH /api/v1/users/deactivate


# Sprint 13 - Doctors & Admin Management

## Sprint 13.1 - Doctor Management

- [x] Create doctor
- [x] Get all doctors
- [x] Get doctor by ID
- [x] Update doctor availability

### APIs Implemented

- POST /api/v1/doctors
- GET /api/v1/doctors
- GET /api/v1/doctors/:id
- PATCH /api/v1/doctors/:id/availability

## Sprint 13.2 - Admin Doctor Management

- [x] Admin authentication
- [x] Admin authorization
- [x] Create doctor as admin
- [x] Update doctor
- [x] Delete doctor
- [x] Update doctor availability

### APIs Implemented

- POST /api/v1/admin/doctors
- PATCH /api/v1/admin/doctors/:id
- DELETE /api/v1/admin/doctors/:id
- PATCH /api/v1/admin/doctors/:id/availability

# Sprint 14 - Backend Infrastructure

## Sprint 14.1 - Error Handling

- [x] Global error middleware
- [x] 404 route handling
- [x] ApiError implementation
- [x] Standardized HTTP error status codes
- [x] Prisma error handling
- [x] OpenAI error handling
- [x] Production-safe error responses

## Sprint 14.2 - OCR & AI Infrastructure

- [x] OCR service
- [x] PDF text extraction
- [x] Image OCR
- [x] AI report analysis
- [x] AI symptom analysis
- [x] AI chat assistant
- [x] OCR-before-AI validation

## Sprint 14.3 - API Architecture

- [x] Controller/service/repository architecture
- [x] Request validation
- [x] Async request handling
- [x] User ownership validation
- [x] Admin authorization
- [x] Protected API routes


# Sprint 15 - Production Hardening & Deployment

## Sprint 15.1 - Environment & Configuration

- [x] Environment variable validation
- [x] `.env` protection
- [x] `.env.example`
- [x] Centralized environment configuration
- [x] Production-safe configuration

## Sprint 15.2 - Security Hardening

- [x] Helmet security headers
- [x] CORS configuration
- [x] JWT authentication
- [x] HttpOnly refresh token cookies
- [x] Refresh token rotation
- [x] Admin authorization
- [x] Authentication rate limiting
- [x] AI endpoint rate limiting
- [x] Upload file type validation
- [x] Upload file size limits
- [x] Safe generated upload filenames
- [x] Production-safe error handling

### Rate Limited APIs

Authentication:

- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh

AI:

- POST /api/v1/symptoms/check
- POST /api/v1/reports/:id/analyze
- POST /api/v1/chat/sessions/:id/messages

## Sprint 15.3 - Logging

- [x] Structured application logger
- [x] Error logging
- [x] Server startup logging
- [x] Reminder job logging
- [x] Redis connection logging
- [x] Remove duplicate logger implementation

## Sprint 15.4 - Database & Performance

- [x] Database indexes
- [x] Composite appointment index
- [x] Composite reminder scheduler index
- [x] User-specific query indexes
- [x] Notification indexes
- [x] Report indexes
- [x] Chat indexes

## Sprint 15.5 - Deployment Readiness

- [x] Production TypeScript build
- [x] Dockerfile
- [x] Docker ignore configuration
- [x] Docker image build
- [x] PostgreSQL Docker configuration
- [x] Redis Docker configuration
- [x] Prisma production configuration


# API Summary

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register user |
| POST | `/api/v1/auth/login` | Login user |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/logout` | Logout user |
| GET | `/api/v1/auth/me` | Get current user |

## Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/users/profile` | Get profile |
| PATCH | `/api/v1/users/profile` | Update profile |
| PATCH | `/api/v1/users/profile-picture` | Update profile picture |
| PATCH | `/api/v1/users/change-password` | Change password |
| PATCH | `/api/v1/users/deactivate` | Deactivate account |

## Medical Reports

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/reports` | Upload medical report |
| GET | `/api/v1/reports` | Get user's reports |
| GET | `/api/v1/reports/:id` | Get report |
| DELETE | `/api/v1/reports/:id` | Delete report |
| POST | `/api/v1/reports/:id/ocr` | Process OCR |
| POST | `/api/v1/reports/:id/analyze` | Analyze report with AI |
| GET | `/api/v1/reports/:id/analysis` | Get AI analysis |

## Symptoms

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/symptoms/check` | Analyze symptoms |
| GET | `/api/v1/symptoms` | Get symptom history |
| GET | `/api/v1/symptoms/:id` | Get symptom check |
| DELETE | `/api/v1/symptoms/:id` | Delete symptom check |

## Chat

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/chat/sessions` | Create chat session |
| POST | `/api/v1/chat/sessions/:id/messages` | Send chat message |
| GET | `/api/v1/chat/sessions` | Get chat sessions |
| GET | `/api/v1/chat/sessions/:id` | Get chat session |
| GET | `/api/v1/chat/sessions/:id/messages` | Get messages |
| PATCH | `/api/v1/chat/sessions/:id/archive` | Archive session |
| DELETE | `/api/v1/chat/sessions/:id` | Delete session |

## Doctors

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/doctors` | Create doctor |
| GET | `/api/v1/doctors` | Get doctors |
| GET | `/api/v1/doctors/:id` | Get doctor |
| PATCH | `/api/v1/doctors/:id/availability` | Update availability |

## Admin Doctors

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/admin/doctors` | Create doctor |
| PATCH | `/api/v1/admin/doctors/:id` | Update doctor |
| DELETE | `/api/v1/admin/doctors/:id` | Delete doctor |
| PATCH | `/api/v1/admin/doctors/:id/availability` | Update availability |

## Appointments

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/appointments` | Book appointment |
| GET | `/api/v1/appointments` | Get appointments |
| GET | `/api/v1/appointments/:id` | Get appointment |
| PATCH | `/api/v1/appointments/:id/status` | Update appointment status |
| DELETE | `/api/v1/appointments/:id` | Delete appointment |

## Reminders

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/reminders` | Create reminder |
| GET | `/api/v1/reminders` | Get reminders |
| GET | `/api/v1/reminders/:id` | Get reminder |
| PATCH | `/api/v1/reminders/:id` | Update reminder |
| DELETE | `/api/v1/reminders/:id` | Delete reminder |
| PATCH | `/api/v1/reminders/:id/status` | Update reminder status |
| PATCH | `/api/v1/reminders/:id/complete` | Complete reminder |

## Notifications

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/notifications` | Get notifications |
| PATCH | `/api/v1/notifications/:id/read` | Mark notification as read |
| PATCH | `/api/v1/notifications/read-all` | Mark all notifications as read |

## Emergency Contacts

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/emergency-contacts` | Create emergency contact |
| GET | `/api/v1/emergency-contacts` | Get emergency contacts |
| GET | `/api/v1/emergency-contacts/:id` | Get emergency contact |
| PATCH | `/api/v1/emergency-contacts/:id` | Update emergency contact |
| DELETE | `/api/v1/emergency-contacts/:id` | Delete emergency contact |
| GET | `/api/v1/emergency-contacts/primary` | Get primary emergency contact |


# Authentication

Most APIs require an authenticated user.

Access token:

```http
Authorization: Bearer <access_token>