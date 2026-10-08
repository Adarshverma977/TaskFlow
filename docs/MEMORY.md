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