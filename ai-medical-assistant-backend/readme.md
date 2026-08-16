# AI Medical Assistant — Backend

Backend API for an AI-powered medical assistance platform that helps users manage medical reports, understand symptoms, interact with an AI medical assistant, manage appointments and reminders, and maintain their healthcare-related information.

The backend is built using **Node.js, Express.js, TypeScript, PostgreSQL, Prisma, Redis, and OpenAI**.

---

## Features

### Authentication & Authorization

- User registration and login
- JWT-based authentication
- Access and refresh tokens
- Refresh token rotation
- HttpOnly refresh-token cookies
- Password hashing using bcrypt
- Role-based authorization
- Admin access control
- Account deactivation
- Password change

### User Management

- User profile management
- Profile updates
- Profile picture upload
- Current user information
- Account management

### Medical Reports

- Upload medical reports
- PDF and image support
- Report metadata storage
- Report history
- Report deletion
- OCR processing
- AI-powered report analysis

### OCR

Supports:

- PDF text extraction
- PNG images
- JPEG/JPG images
- Tesseract.js OCR
- PDF parsing using `pdf-parse`

### AI Medical Assistance

- AI medical report analysis
- AI symptom checker
- AI chat assistant
- Risk-level classification
- Possible causes
- Urgency classification
- Warning signs
- Patient-friendly recommendations

> AI-generated information is intended for general educational purposes and should not be treated as a medical diagnosis or a replacement for professional medical advice.

### Doctors

- Doctor management
- Doctor listing
- Doctor details
- Doctor availability
- Admin doctor management
- Create, update and delete doctors

### Appointments

- Book appointments
- View appointments
- View appointment details
- Update appointment status
- Cancel/delete appointments
- Doctor availability validation
- Duplicate appointment-slot prevention

### Reminders

- Create reminders
- Update reminders
- Delete reminders
- Pause reminders
- Complete reminders
- Daily reminders
- Weekly reminders
- Monthly reminders
- Automated reminder processing

### Notifications

- User notifications
- Reminder-generated notifications
- Mark notification as read
- Mark all notifications as read

### Emergency Contacts

- Create emergency contacts
- Update contacts
- Delete contacts
- Primary emergency contact support

---

# Tech Stack

## Backend

- Node.js
- Express.js
- TypeScript

## Database

- PostgreSQL
- Prisma ORM

## Caching / Infrastructure

- Redis
- Docker
- Docker Compose

## Authentication

- JWT
- bcrypt
- HttpOnly cookies

## AI

- OpenAI API

## OCR

- Tesseract.js
- pdf-parse

## Validation

- Zod

## Security

- Helmet
- CORS
- express-rate-limit
- Multer

## Scheduling

- node-cron

---

# Project Structure

```text
src/
├── config/
│   └── env.ts
│
├── jobs/
│   └── reminder.job.ts
│
├── lib/
│   ├── bcrypt.ts
│   ├── cookies.ts
│   ├── jwt.ts
│   ├── prisma.ts
│   └── redis.ts
│
├── middlewares/
│   ├── admin.middleware.ts
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── notFound.middleware.ts
│   ├── rateLimiter.middleware.ts
│   ├── upload.middleware.ts
│   └── validation.middleware.ts
│
├── modules/
│   ├── admin/
│   ├── appointments/
│   ├── auth/
│   ├── chat/
│   ├── doctors/
│   ├── emergency-contacts/
│   ├── notifications/
│   ├── reminders/
│   ├── reports/
│   ├── symptoms/
│   └── users/
│
├── routes/
│   └── index.ts
│
├── services/
│   ├── ai/
│   │   └── ai.service.ts
│   ├── ocr/
│   │   └── ocr.service.ts
│   └── reminders/
│       └── reminder.processor.ts
│
├── utils/
│   ├── ApiError.ts
│   ├── apiResponse.ts
│   ├── asyncHandler.ts
│   └── logger.ts
│
├── app.ts
└── server.ts
```

### Installation

Clone the repository:
```
git clone <repository-url>
cd ai-medical-assistant-backend
```

Install dependencies:
```
npm install
```

### Running PostgreSQL & Redis

The project includes Docker Compose configuration.

Start the infrastructure:
```
docker compose up -d
```

Check running containers:
```
docker ps
```

The default local configuration uses:
```
PostgreSQL → localhost:5433
Redis      → localhost:6379
```

Stop the containers:
```
docker compose down
```

### Database Setup

Generate Prisma Client:
```
npx prisma generate
```

Run migrations:
```
npx prisma migrate dev
```

Check database using Prisma Studio:
```
npx prisma studio
```

### Development

Start the backend in development mode:
```
npm run dev
```

### Production Build

Build the TypeScript project:
```
npm run build
```

Start the compiled application:
```
npm start
```

Compiled output:
```
dist/
```

### Docker

Build the backend image:
```
docker build -t ai-medical-assistant-backend .
```

Run:
```
docker run ai-medical-assistant-backend
```

The backend image is configured to expose:
```
8000
```