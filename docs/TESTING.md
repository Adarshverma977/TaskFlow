# TaskFlow — Testing Strategy

## 1. Testing Objective

The goal of testing is to verify that TaskFlow behaves
correctly under valid, invalid, and unexpected conditions.

Testing should identify functional bugs, validation issues,
security problems, UI issues, and regression problems.

---

## 2. Testing Levels

TaskFlow will progressively use:

- Manual Testing
- API Testing
- Integration Testing
- Frontend Testing
- Automated Testing

---

## 3. API Testing

API endpoints will initially be tested using Postman.

Every endpoint should be tested for:

- Successful requests
- Invalid input
- Missing input
- Invalid IDs
- Resource not found
- Server errors
- Database errors

---

## 4. Task API Test Cases

### Create Task

#### Valid Request

Input:

- Valid title
- Valid description
- Valid priority
- Valid status
- Valid due date

Expected:

- HTTP 201
- Task created successfully
- Created task returned in response

#### Missing Title

Expected:

- HTTP 400
- Validation error returned

#### Invalid Priority

Example:

priority = "urgent"

Expected:

- HTTP 400
- Validation error returned

#### Invalid Status

Example:

status = "unknown"

Expected:

- HTTP 400
- Validation error returned

---

## 5. Get Tasks

### Valid Request

Expected:

- HTTP 200
- Array of tasks returned

### Empty Database

Expected:

- HTTP 200
- Empty array returned
- Frontend displays empty state

---

## 6. Get Single Task

### Valid ID

Expected:

- HTTP 200
- Correct task returned

### Invalid ID

Expected:

- HTTP 400 or appropriate validation response

### Non-existing Task

Expected:

- HTTP 404
- Meaningful error message

---

## 7. Update Task

### Valid Update

Expected:

- HTTP 200
- Updated task returned

### Invalid Data

Expected:

- HTTP 400
- Validation error

### Non-existing Task

Expected:

- HTTP 404

---

## 8. Delete Task

### Existing Task

Expected:

- HTTP 200 or appropriate success status
- Task removed

### Non-existing Task

Expected:

- HTTP 404 or appropriate response

---

## 9. Status Update

Valid statuses:

- pending
- in-progress
- completed

Invalid statuses should be rejected.

---

## 10. Frontend Testing

The frontend should be tested for:

### Loading State

- Loading indicator appears
- User cannot accidentally submit duplicate actions

### Success State

- Successful operation provides feedback
- UI reflects the updated data

### Error State

- Error message is displayed
- User receives a recovery option where appropriate

### Empty State

- Empty task list displays a useful message
- Create Task action remains accessible

---

## 11. Responsive Testing

The UI should be tested on:

- Mobile
- Tablet
- Laptop
- Desktop

Important areas:

- Navigation
- Dashboard
- Task cards
- Forms
- Modals
- Buttons
- Filters

---

## 12. Edge Cases

Important edge cases include:

- Empty title
- Very long title
- Empty description
- Very long description
- Invalid priority
- Invalid status
- Invalid date
- Past due date
- Invalid task ID
- Non-existing task
- Duplicate requests
- Network failure
- Database failure

---

## 13. Regression Testing

Whenever a new feature is added, previously working
features should be tested again.

Examples:

- Authentication should not break task CRUD
- Filtering should not break pagination
- UI changes should not break API integration
- Authorization should not break valid user access

---

## 14. Bug Tracking

Every important bug should record:

- Bug description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Root cause
- Fix
- Verification

Example:

### Bug: Task not appearing after creation

Steps:

1. Open dashboard
2. Create task
3. Submit form

Expected:

Task should appear in task list.

Actual:

Task was created in database but not displayed.

Root Cause:

Frontend state was not updated after successful API request.

Fix:

Refresh task data after successful creation.

Status:

Resolved

---

## 15. Testing Principle

A feature should not be considered complete only because
the happy path works.

A feature is complete when:

- Valid inputs work
- Invalid inputs are handled
- Edge cases are handled
- Errors are handled
- UI states are handled
- Existing functionality still works