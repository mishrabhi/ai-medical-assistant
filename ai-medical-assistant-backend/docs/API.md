# API Documentation

This document will contain all REST API endpoints.

Status: Under Development.

# Sprint wise distribution:
Sprint 1 ✅ Project Foundation

Sprint 2 ✅ Database Design

Sprint 3 ✅ Authentication & Authorization

Sprint 4 ✅ Medical Reports Management

Sprint 5 ⏳ OCR Processing

Sprint 6 ⏳ AI Report Analysis

Sprint 7 ⏳ AI Symptom Checker

Sprint 8 ⏳ AI Chat Assistant

Sprint 9 ⏳ Appointments & Reminders

Sprint 10 ⏳ Notifications & Deployment

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

# Sprint 3 - Authentication & Authorization

## Sprint 3.1 - Authentication Foundation
- [x] JWT utilities
- [x] Password hashing (bcrypt)
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
- [x] Async handler
- [x] Request validation middleware

## Sprint 3.4 - Session Management
- [x] Refresh Access Token
- [x] Refresh Token Rotation
- [x] User Logout
- [x] Clear Refresh Token Cookie

### APIs Implemented

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