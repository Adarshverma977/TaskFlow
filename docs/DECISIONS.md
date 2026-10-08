# TaskFlow — Architecture Decisions

This document records important technical and architectural
decisions made during the development of TaskFlow.

The purpose is to document not only what was chosen,
but also why it was chosen and what trade-offs exist.

---

# ADR-001 — Use MERN Stack

## Context

TaskFlow requires a full-stack web application with a
JavaScript-based frontend and backend.

## Options

- MERN
- Java + Spring Boot
- Django
- Laravel

## Decision

Use the MERN stack.

## Reason

The project uses JavaScript across the frontend and backend,
which simplifies development and allows code concepts to be
shared across the stack.

## Trade-offs

MERN is not automatically the best choice for every type of
application. Some systems may benefit more from other
languages or frameworks.

---

# ADR-002 — Use React for Frontend

## Context

TaskFlow requires an interactive dashboard with reusable
components and dynamic state.

## Options

- React
- Vue
- Angular
- Server-rendered templates

## Decision

Use React.

## Reason

React provides a component-based architecture that fits the
TaskFlow dashboard and allows reusable UI components.

## Trade-offs

React applications require careful state and component
architecture as complexity grows.

---

# ADR-003 — Use Node.js and Express

## Context

TaskFlow needs a REST API to communicate with the React
frontend.

## Options

- Node.js + Express
- Spring Boot
- Django
- Laravel

## Decision

Use Node.js with Express.js.

## Reason

Express provides a lightweight and flexible HTTP server
framework and fits naturally with the JavaScript-based
MERN stack.

## Trade-offs

Express provides flexibility but requires the development
team to establish project conventions and architecture.

---

# ADR-004 — Use MongoDB

## Context

TaskFlow needs a database for storing tasks and users.

## Options

- MongoDB
- PostgreSQL
- MySQL

## Decision

Use MongoDB.

## Reason

MongoDB fits naturally with the MERN ecosystem and stores
document-oriented data that maps conveniently to JavaScript
objects.

## Trade-offs

Highly relational or complex analytical workloads may be
better suited to relational databases.

---

# ADR-005 — Use Mongoose

## Context

The backend needs a structured way to interact with MongoDB.

## Options

- MongoDB native driver
- Mongoose

## Decision

Use Mongoose.

## Reason

Mongoose provides schema definitions, validation support,
models, middleware, and a structured interface for MongoDB.

## Trade-offs

Mongoose adds an abstraction layer over the native MongoDB
driver and introduces its own conventions.

---

# ADR-006 — Use REST API

## Context

The React frontend needs to communicate with the backend.

## Options

- REST
- GraphQL
- RPC

## Decision

Use REST.

## Reason

TaskFlow has straightforward resource-based operations such
as creating, reading, updating, and deleting tasks.

REST provides a simple and well-understood architecture for
these operations.

## Trade-offs

For highly complex data-fetching requirements, GraphQL can
provide more flexible querying.

---

# ADR-007 — Separate Frontend and Backend

## Context

TaskFlow has a React frontend and an Express backend.

## Decision

Keep the frontend and backend as separate applications.

## Reason

This provides clear separation of responsibilities and
allows the frontend and backend to evolve independently.

## Trade-offs

Separate applications require API integration and additional
deployment configuration.

---

# ADR-008 — Use Layered Backend Structure

## Context

The backend needs to remain maintainable as features grow.

## Decision

Separate responsibilities between:

- Routes
- Middleware
- Controllers
- Services
- Models

## Reason

Separating responsibilities makes the code easier to
understand, test, debug, and extend.

## Trade-offs

For a very small application, additional layers can feel like
extra code. The architecture should grow according to the
complexity of the application.

---

# ADR-009 — Validate on the Backend

## Context

Frontend validation improves user experience but cannot be
trusted for security.

## Decision

Perform validation on the backend even when frontend
validation exists.

## Reason

Clients can bypass frontend validation and directly send
requests to the API.

## Trade-offs

Validation logic may exist at both frontend and backend,
but they serve different purposes.

Frontend validation improves UX.

Backend validation protects the application.

---

# ADR-010 — Use Environment Variables for Secrets

## Context

TaskFlow requires sensitive configuration such as database
credentials and future authentication secrets.

## Decision

Store sensitive configuration in environment variables.

## Reason

Secrets should not be hardcoded into source code or committed
to version control.

## Trade-offs

Each environment must be configured correctly before the
application can run.

---

# Decision Review

Architecture decisions may change as the application grows.

When a major decision changes:

1. Document the new decision.
2. Explain why the previous approach was insufficient.
3. Explain the new approach.
4. Document the trade-offs.
5. Update related documentation.