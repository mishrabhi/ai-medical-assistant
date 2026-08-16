## Database Architecture

The project follows a relational database design where the `User` entity is the central aggregate root.

Every feature module owns its own data model while maintaining relationships through foreign keys.

Database access follows:

Repository → Prisma ORM → PostgreSQL

No controller or service communicates directly with Prisma.

Request

↓

Route

↓

Controller

↓

Service

↓

Repository

↓

Prisma ORM

↓

PostgreSQL

Every module follows the same folder structure:

- Routes
- Controller
- Service
- Repository
- Validation
- Types

Shared utilities are placed inside the shared and utils folders.


## Authentication Architecture

The authentication module follows the same layered architecture as the rest of the application.

```
Request
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Prisma
```

Authentication uses:

- JWT Access Tokens
- Refresh Token Rotation
- HttpOnly Cookies
- Password Hashing with bcrypt
- Zod Validation


## Authentication Layers

The authentication module follows a layered architecture:

- Controller: Handles HTTP requests and responses.
- Service: Contains authentication business logic.
- Repository: Handles database access using Prisma.
- Shared Libraries: JWT, bcrypt, cookies, and Prisma client.

Business logic never accesses Prisma directly. All database interactions go through the repository layer.


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