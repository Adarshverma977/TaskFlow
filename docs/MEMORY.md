# TaskFlow — Project Memory

This document stores important lessons, concepts, problems,
solutions, and development knowledge discovered while building
TaskFlow.

It should be updated throughout the project.

---

# 1. Project Status

## Current Stage

Project planning and documentation.

## Completed Documentation

- PRD
- Architecture
- Design
- Development Rules
- Task Plan
- Testing Strategy
- Security Requirements
- Architecture Decisions

## Current Goal

Complete project foundation and begin backend development.

---

# 2. Important Concepts Learned

## Product Requirements

PRD defines what the product should do and who it is for.

## System Architecture

Architecture defines how different parts of the application
communicate with each other.

## Design System

A design system defines visual and interaction rules such as
colors, typography, spacing, components, states, and responsive
behavior.

## REST API

REST provides resource-oriented HTTP endpoints for communication
between the frontend and backend.

## Separation of Concerns

Different parts of the application should have different
responsibilities.

Example:

Route
→ Controller
→ Service
→ Model
→ Database

---

# 3. Important Security Lessons

## Frontend Cannot Be Trusted

Frontend validation improves user experience but cannot be
considered a security boundary.

The backend must validate user input.

## Authentication vs Authorization

Authentication answers:

"Who are you?"

Authorization answers:

"What are you allowed to do?"

## Secrets

Sensitive information must be stored outside source code using
environment variables.

---

# 4. Important Testing Lessons

A feature is not complete simply because the happy path works.

We should also test:

- Invalid input
- Missing input
- Edge cases
- Resource not found
- Server errors
- Database errors
- UI loading states
- UI error states
- Regression scenarios

---

# 5. Bugs Solved

No project bugs recorded yet.

This section will be updated during development.

Format:

## Bug Title

### Problem

What happened?

### Expected

What should have happened?

### Root Cause

Why did it happen?

### Solution

How was it fixed?

### Lesson

What should be remembered?

---

# 6. Development Lessons

This section will contain lessons discovered while implementing
features.

Examples:

- Keep controllers focused.
- Avoid unnecessary duplicate logic.
- Validate data on the server.
- Keep components reusable.
- Handle loading and error states.
- Do not expose sensitive information.

---

# 7. Architecture Changes

No architecture changes yet.

When a major architecture change occurs, document:

- Previous approach
- Problem
- New approach
- Reason for change
- Trade-offs

---

# 8. Important Commands

Important project commands will be recorded here.

Example:

```bash
npm install
npm run dev
npm test

 9. Backend Validation, Error Handling & Testing

Completed

* Implemented centralized error-handling middleware.
* Added request validation for task data, query parameters, and route parameters using Zod.
* Added handling for invalid MongoDB ObjectIds, missing tasks, validation errors, and malformed JSON.
* Added automated API tests using Jest and Supertest.
* Used MongoDB Memory Server for isolated test database operations.
* Verified that all 8 automated tests pass across 2 test suites.

Important Learnings

* Centralized error handling avoids duplicating error responses in controllers.
* Zod validates incoming request data before it reaches business logic.
* Supertest allows API endpoints to be tested without manually using Postman.
* MongoDB Memory Server provides an isolated database for automated tests.
* Expected client errors, such as 400 and 404, should not produce unnecessary server-error logs.
* Unexpected server errors should still be logged for debugging.

Current Test Status

* Test suites passed: 2
* Tests passed: 8
* Test failures: 0

Next Steps

* Review backend configuration and security.
* Update the project task checklist.
* Begin the React dashboard and integrate it with the TaskFlow API.