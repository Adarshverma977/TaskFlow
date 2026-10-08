# TaskFlow — Development & Coding Rules

## 1. Language

The project will use JavaScript and JSX.

TypeScript will not be used in this project.

---

## 2. Naming Conventions

### Variables and Functions

Use camelCase.

Examples:

- taskTitle
- completedTasks
- createTask()
- updateTask()

### React Components

Use PascalCase.

Examples:

- TaskCard
- TaskForm
- Dashboard

### Constants

Use descriptive uppercase names for global constants.

Example:

API_BASE_URL

---

## 3. Component Rules

React components should have a clear responsibility.

Avoid unnecessarily large components.

Prefer reusable components such as:

- Button
- Input
- Modal
- TaskCard
- TaskForm
- StatCard

---

## 4. Backend Structure

Backend responsibilities should remain separated.

Preferred flow:

Route
→ Middleware
→ Controller
→ Service
→ Model
→ Database

Business logic should not be unnecessarily placed inside routes.

---

## 5. API Rules

Use REST-style API endpoints.

Examples:

GET /api/tasks
GET /api/tasks/:id
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id

Use HTTP methods according to their intended purpose.

---

## 6. Error Handling

Errors must be handled consistently.

API responses should provide meaningful messages.

Example:

{
  "success": false,
  "message": "Task not found"
}

---

## 7. Validation

All user-provided input must be validated.

Validation should cover:

- Required fields
- Data types
- Allowed values
- String lengths
- Dates
- IDs

---

## 8. Environment Variables

Secrets and environment-specific configuration must not be
hardcoded into source code.

Use environment variables for:

- Database credentials
- API keys
- JWT secrets
- Application configuration

The .env file must never be committed.

---

## 9. Git Rules

Commit messages should clearly describe the change.

Examples:

feat: add task model
feat: create task API
fix: handle invalid task id
style: improve task card
docs: update architecture

Avoid meaningless commit messages such as:

update
changes
final
new
test

---

## 10. Reusable Logic

Avoid unnecessary code duplication.

Repeated logic should be extracted into:

- Components
- Functions
- Utilities
- Hooks
- Services

where appropriate.

---

## 11. Security Rules

Never commit:

- Passwords
- API keys
- Database credentials
- JWT secrets
- Private tokens

Input validation and secure configuration are mandatory.

Security mechanisms will be introduced progressively as
project complexity increases.

---

## 12. UI Rules

Important UI actions should support appropriate states:

- Loading
- Success
- Error
- Empty
- Disabled

The interface should provide useful feedback to users.

---

## 13. Responsive Design

The application must be tested on:

- Mobile
- Tablet
- Laptop
- Desktop

Layouts should adapt naturally to different screen sizes.

---

## 14. Code Quality

Code should be:

- Readable
- Maintainable
- Modular
- Reusable
- Consistent

Avoid unnecessary complexity.

Comments should explain why something is done when the reason
is not obvious from the code itself.

---

## 15. General Principle

Prefer simple, readable, maintainable solutions over
unnecessary complexity.

Every implementation should have a clear reason.