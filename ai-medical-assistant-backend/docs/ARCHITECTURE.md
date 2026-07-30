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


