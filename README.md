<<<<<<< HEAD
# Local Events Hub

## 1. Project Overview

Local Events Hub is a mobile event-discovery and management application developed using React Native and Expo for the frontend, with a Node.js and Express.js backend and MySQL database.

The application allows users to discover local events, view event details, RSVP to events, participate through comments, manage their profiles, and access their personal event information.

Administrators have additional functionality for creating, editing, and deleting events.

---

## 2. Project Objectives

The main objectives of Local Events Hub are to:

- Provide users with a simple mobile interface for discovering local events.
- Allow users to view detailed event information.
- Allow authenticated users to RSVP to events.
- Allow users to cancel their RSVP.
- Provide event commenting functionality.
- Provide user profile management.
- Provide administrator event management.
- Implement secure authentication and role-based authorization.
- Provide a responsive and theme-aware mobile interface.
- Connect the mobile application with a RESTful backend API.

---

## 3. Technology Stack

### Frontend

- React Native
- Expo SDK
- TypeScript
- React Navigation
- Axios
- Zustand
- AsyncStorage
- Expo Vector Icons
- React Native Maps

### Backend

- Node.js
- Express.js
- MySQL
- JSON Web Token (JWT)
- bcrypt
- Express Validator
- Socket.IO

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Expo Go
- MySQL

---

# 4. Project Structure

```text
Local-Events-Hub/
│
├── .gitignore
├── README.md
│
├── mobile/
│   ├── package.json
│   ├── app.json
│   ├── assets/
│   │
│   └── src/
│       ├── components/
│       ├── screens/
│       │   ├── auth/
│       │   ├── events/
│       │   ├── profile/
│       │   ├── settings/
│       │   └── admin/
│       │
│       ├── navigation/
│       ├── services/
│       ├── store/
│       ├── theme/
│       ├── hooks/
│       ├── utils/
│       ├── types/
│       └── constants/
│
└── backend/
    ├── package.json
    ├── .env.example
    │
    └── src/
        ├── config/
        ├── controllers/
        ├── middleware/
        ├── routes/
        ├── services/
        ├── utils/
        └── server.js
````

---

# 5. Setup Guide

## 5.1 Prerequisites

Install the following software before running the application:

* Node.js
* npm
* MySQL
* Git
* Expo Go mobile application
* Visual Studio Code or another code editor

Verify Node.js:

```bash
node --version
```

Verify npm:

```bash
npm --version
```

Verify Git:

```bash
git --version
```

---

# 6. Clone the Repository

Clone the project repository:

```bash
git clone https://github.com/YOUR-USERNAME/local-events-hub.git
```

Move into the project directory:

```bash
cd local-events-hub
```

---

# 7. Backend Setup

Open a terminal in the project root.

Move into the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

---

## 7.1 Configure Environment Variables

Create a file named:

```text
backend/.env
```

Use `.env.example` as the template.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=local_events_hub

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

### Important

Do not commit the actual `.env` file to GitHub.

The repository includes:

```text
backend/.env.example
```

for configuration guidance.

---

# 8. Database Setup

Create the MySQL database:

```sql
CREATE DATABASE local_events_hub;
```

Configure the database credentials in:

```text
backend/.env
```

The backend database configuration is located at:

```text
backend/src/config/database.js
```

Make sure the MySQL server is running before starting the backend.

---

# 9. Start the Backend

From the `backend` directory:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

The API base path is:

```text
http://localhost:5000/api
```

For mobile testing on a physical device, update the frontend API configuration with the local computer IP address.

Example:

```text
http://YOUR_LOCAL_IP:5000/api
```

The configuration file is:

```text
mobile/src/constants/config.ts
```

---

# 10. Frontend Setup

Open another terminal.

From the project root:

```bash
cd mobile
```

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npx expo start
```

Open the application using Expo Go.

For a physical mobile device:

1. Connect the computer and mobile device to the same network.
2. Start the backend.
3. Set the correct computer IP address in `config.ts`.
4. Start Expo.
5. Scan the Expo QR code using Expo Go.

---

# 11. Frontend API Configuration

The API configuration is stored in:

```text
mobile/src/constants/config.ts
```

Example:

```typescript
export const API_BASE_URL = "http://YOUR_LOCAL_IP:5000/api";
export const SOCKET_URL = "http://YOUR_LOCAL_IP:5000";
export const APP_NAME = "Local Events Hub";
```

Replace the IP address with the IP address of the computer running the backend.

---

# 12. Application User Roles

The application provides two main roles.

## USER

Regular users can:

* Register an account.
* Log in.
* Browse events.
* View event details.
* RSVP to events.
* Cancel RSVP.
* View their events.
* Comment on events.
* Manage their profile.
* Access application settings.
* Log out.

## ADMIN

Administrators can perform all regular user functions and additionally:

* Access the Admin Dashboard.
* View managed events.
* Create events.
* Edit events.
* Delete events.
* Manage event information.

Administrative permissions are enforced by the backend using authentication and role-based authorization.

---

# 13. Theme Rationale

## Selected Theme

**Local Events Hub**

The interface uses a modern community-event visual style designed around event discovery and participation.

The application uses a blue and purple primary colour combination with neutral backgrounds and readable text.

### Primary Colour

```text
#2563EB
```

Blue is used as the main action colour for important interactive elements such as buttons and navigation actions.

### Secondary Colour

```text
#7C3AED
```

Purple provides visual differentiation for secondary actions and supporting interface elements.

### Light Mode

The light theme uses:

* Light background
* White surfaces
* Dark primary text
* Grey secondary text
* Blue primary actions
* Purple secondary actions

### Dark Mode

The dark theme uses:

* Dark navy background
* Dark surface cards
* Light text
* Light secondary text
* Lighter blue primary actions
* Lighter purple secondary actions

The theme is implemented centrally so that screens and components can use consistent colours through the application theme system.

Theme-related files include:

```text
mobile/src/theme/colors.ts
mobile/src/theme/theme.ts
mobile/src/store/themeStore.ts
mobile/src/hooks/useTheme.ts
```

The design aims to provide:

* Consistent visual hierarchy.
* Clear navigation.
* Readable content.
* Consistent button styling.
* Consistent form controls.
* Support for light and dark appearance.
* Accessible visual contrast.

---

# 14. Frontend Architecture

The frontend follows a component-based React Native structure.

## Screens

Application screens are separated according to their responsibilities.

```text
Auth
 ├── Login
 └── Register

Events
 ├── Events
 ├── Event Details
 └── My Events

Profile
 └── Profile

Settings
 └── Settings

Admin
 ├── Admin Dashboard
 ├── Manage Events
 ├── Create Event
 └── Edit Event
```

## Services

API communication is separated into service files:

```text
authService.ts
eventService.ts
rsvpService.ts
commentService.ts
notificationService.ts
```

## State Management

Zustand is used for application state management.

Main stores include:

```text
authStore.ts
eventStore.ts
themeStore.ts
```

---

# 15. Backend Architecture

The backend follows a layered Express.js structure.

```text
Client
   |
   v
Express Routes
   |
   v
Authentication / Authorization
   |
   v
Controllers
   |
   v
MySQL Database
```

Backend components include:

```text
routes/
controllers/
middleware/
services/
utils/
config/
```

Authentication is handled using JWT.

Passwords are protected using bcrypt hashing.

Role-based access is implemented using authentication and role middleware.

---

# 16. API Documentation

Base URL:

```text
http://localhost:5000/api
```

For mobile-device testing, replace `localhost` with the computer's local network IP address.

---

## 16.1 Authentication API

### Register

```http
POST /api/auth/register
```

Request:

```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123"
}
```

Response contains:

```json
{
  "success": true,
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "name": "New User",
    "email": "newuser@example.com",
    "role": "USER"
  }
}
```

---

## 16.2 Login

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "newuser@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "name": "New User",
    "email": "newuser@example.com",
    "role": "USER"
  }
}
```

The frontend stores the authentication token locally and attaches it to authenticated API requests.

---

# 17. Events API

## Get All Events

```http
GET /api/events
```

Authentication:

```text
Not required
```

Returns the available events.

---

## Get Event by ID

```http
GET /api/events/:id
```

Example:

```http
GET /api/events/1
```

Authentication:

```text
Not required
```

---

## Create Event

```http
POST /api/events
```

Authentication:

```text
Required
```

Authorization:

```text
ADMIN
```

Request:

```json
{
  "title": "Community Food Festival",
  "description": "A local community food event.",
  "category": "Community",
  "location": "City Community Hall",
  "latitude": -31.9505,
  "longitude": 115.8605,
  "event_date": "2026-10-09",
  "event_time": "18:30:00",
  "image_url": "https://example.com/event.jpg",
  "capacity": 100
}
```

---

## Update Event

```http
PUT /api/events/:id
```

Authentication:

```text
Required
```

Authorization:

```text
ADMIN
```

Example:

```http
PUT /api/events/1
```

---

## Delete Event

```http
DELETE /api/events/:id
```

Authentication:

```text
Required
```

Authorization:

```text
ADMIN
```

Example:

```http
DELETE /api/events/1
```

---

# 18. RSVP API

## RSVP to Event

```http
POST /api/events/:id/rsvp
```

Authentication:

```text
Required
```

Example:

```http
POST /api/events/1/rsvp
```

---

## Cancel RSVP

```http
DELETE /api/events/:id/rsvp
```

Authentication:

```text
Required
```

Example:

```http
DELETE /api/events/1/rsvp
```

---

## Get My RSVPs

```http
GET /api/users/my-rsvps
```

Authentication:

```text
Required
```

Returns the authenticated user's RSVP information.

---

# 19. Comments API

## Add Comment

```http
POST /api/events/:id/comments
```

Authentication:

```text
Required
```

Example request:

```json
{
  "content": "Looking forward to this event!"
}
```

---

## Get Event Comments

```http
GET /api/events/:id/comments
```

Authentication:

```text
Depending on endpoint configuration
```

Returns comments associated with the selected event.

---

## Delete Comment

```http
DELETE /api/comments/:id
```

Authentication:

```text
Required
```

The backend verifies the authenticated user before allowing protected operations.

---

# 20. User Profile API

## Get Profile

```http
GET /api/users/profile
```

Authentication:

```text
Required
```

---

## Update Profile

```http
PUT /api/users/profile
```

Authentication:

```text
Required
```

Request:

```json
{
  "name": "Updated User Name"
}
```

---

# 21. Authentication Headers

Authenticated requests use the JWT token.

The request header format is:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

The frontend API service automatically attaches the saved authentication token to protected requests.

---

# 22. Security

The application implements several security mechanisms:

* JWT-based authentication.
* Password hashing using bcrypt.
* Role-based authorization.
* Protected backend routes.
* Authentication middleware.
* Admin authorization middleware.
* Input validation.
* Environment variables for sensitive configuration.
* No real `.env` credentials committed to the repository.

Users cannot gain administrator functionality simply by navigating to an admin screen because protected administrative API routes require an authenticated administrator role.

---

# 23. Error Handling

The backend provides API error responses for invalid or unauthorized requests.

Typical HTTP responses include:

```text
200 - Successful request
201 - Resource created
400 - Invalid request
401 - Authentication required/invalid
403 - Insufficient permissions
404 - Resource not found
500 - Server error
```

The frontend displays appropriate error messages to users when API requests fail.

---

# 24. Validation

The application validates important input before sending data to the backend.

Examples include:

* Required event title.
* Required event description.
* Required category.
* Required location.
* Valid event date.
* Valid event time.
* Positive event capacity.
* Valid latitude.
* Valid longitude.
* Valid user name.
* Required registration fields.

Backend validation is also applied to protected API operations.

---

# 25. Git Repository

The complete source code is maintained using Git.

Repository:

```text
https://github.com/YOUR-USERNAME/local-events-hub
```

The repository contains:

* React Native frontend.
* Node.js backend.
* Configuration files.
* Documentation.
* `.env.example`.
* Git development history.

View commit history using:

```bash
git log --oneline --graph --decorate --all
```

The GitHub repository's **Commits** section provides the complete development history.

---

# 26. Team Roles and Contributions

> Replace the names and contribution details below with the actual team member names and work completed before submission.

| Team Member       | Role                    | Contributions                                                                                         |
| ----------------- | ----------------------- | ----------------------------------------------------------------------------------------------------- |
| Member 1 – [Name] | Frontend Developer      | React Native screens, navigation, UI components, theme implementation and frontend integration.       |
| Member 2 – [Name] | Backend Developer       | Express.js API, controllers, routes, authentication and backend validation.                           |
| Member 3 – [Name] | Database Developer      | MySQL database structure, relationships, queries and database integration.                            |
| Member 4 – [Name] | Full-Stack Developer    | RSVP, commenting, profile functionality and frontend-backend integration.                             |
| Member 5 – [Name] | Testing & Documentation | Functional testing, bug fixing, README documentation, API documentation and presentation preparation. |

### Team Collaboration

The project was developed collaboratively using Git and GitHub. Team members worked on separate application components and integrated their work into the main branch.

Git commits were used to track development changes and provide a record of project progress.

---

# 27. Testing

The application should be tested across the main functional areas:

### Authentication

* User registration.
* User login.
* Invalid login.
* Logout.
* Protected routes.

### Events

* View events.
* View event details.
* Admin create event.
* Admin edit event.
* Admin delete event.

### RSVP

* RSVP to event.
* Cancel RSVP.
* View personal RSVPs.

### Comments

* Add comment.
* View comments.
* Protected comment operations.

### Profile

* View profile.
* Update profile.
* Verify authentication remains active after profile update.

### Authorization

* USER cannot create events.
* USER cannot edit events.
* USER cannot delete events.
* ADMIN can perform administrative event operations.

---

# 28. Troubleshooting

## Backend cannot connect to MySQL

Check:

```text
MySQL server is running
DB_HOST is correct
DB_USER is correct
DB_PASSWORD is correct
DB_NAME is correct
```

Then restart the backend.

---

## Mobile application cannot connect to backend

Check:

```text
Backend is running.
Phone and computer are on the same network.
API_BASE_URL uses the computer's local IP address.
Port 5000 is available.
```

Example:

```typescript
export const API_BASE_URL =
  "http://YOUR_LOCAL_IP:5000/api";
```

---

## Authentication token errors

Check that the user is logged in and that the API request includes:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# 29. Third-Party Resources and APA 7 References

The application uses several open-source libraries and development resources. The following references document the main technologies used in the project.

## References

Expo. (n.d.). *Expo documentation*. Retrieved September 24, 2026, from [https://docs.expo.dev/](https://docs.expo.dev/)

Meta Platforms, Inc. (n.d.). *React Native documentation*. Retrieved September 24, 2026, from [https://reactnative.dev/](https://reactnative.dev/)

Meta Platforms, Inc. (n.d.). *React documentation*. Retrieved September 24, 2026, from [https://react.dev/](https://react.dev/)

Microsoft. (n.d.). *TypeScript documentation*. Retrieved September 24, 2026, from [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)

Node.js. (n.d.). *Node.js documentation*. Retrieved September 24, 2026, from [https://nodejs.org/docs/latest/api/](https://nodejs.org/docs/latest/api/)

OpenJS Foundation. (n.d.). *Express.js documentation*. Retrieved September 24, 2026, from [https://expressjs.com/](https://expressjs.com/)

Axios. (n.d.). *Axios documentation*. Retrieved September 24, 2026, from [https://axios-http.com/docs/intro](https://axios-http.com/docs/intro)

Facebook Open Source. (n.d.). *React Navigation*. Retrieved September 24, 2026, from [https://reactnavigation.org/](https://reactnavigation.org/)

Zustand. (n.d.). *Zustand documentation*. Retrieved September 24, 2026, from [https://zustand.docs.pmnd.rs/](https://zustand.docs.pmnd.rs/)

MySQL. (n.d.). *MySQL 8.4 reference manual*. Retrieved September 24, 2026, from [https://dev.mysql.com/doc/refman/8.4/en/](https://dev.mysql.com/doc/refman/8.4/en/)

Auth0. (n.d.). *JSON Web Token introduction*. Retrieved September 24, 2026, from [https://jwt.io/introduction](https://jwt.io/introduction)

bcrypt.js. (n.d.). *bcrypt.js*. Retrieved September 24, 2026, from [https://github.com/dcodeIO/bcrypt.js](https://github.com/dcodeIO/bcrypt.js)

Socket.IO. (n.d.). *Socket.IO documentation*. Retrieved September 24, 2026, from [https://socket.io/docs/v4/](https://socket.io/docs/v4/)

React Native Maps. (n.d.). *React Native Maps documentation*. Retrieved September 24, 2026, from [https://github.com/react-native-maps/react-native-maps](https://github.com/react-native-maps/react-native-maps)

---

# 30. License

This project was developed as an academic coursework project for educational purposes.

Third-party libraries remain subject to their respective licences.

---

# 31. Academic Integrity

All project functionality, implementation decisions, configuration, documentation and team contributions should be represented accurately.

Third-party libraries and resources used by the application are acknowledged through the references provided in this README.

````

### Before submitting

There are **3 things you must change** in this README:

1. Replace:
```text
https://github.com/YOUR-USERNAME/local-events-hub
````

with your actual GitHub repository.

2. Replace the **Team Roles and Contributions** table with your actual member names and actual contributions. **Do not leave invented roles/names in the final submission.**

3. Check the API routes against your final backend before submission, especially the **comment endpoints**, because those should match the exact routes in your `commentRoutes.js`.
=======
# Local-Events-Hub-App
>>>>>>> 7d4f450f56b7c6ad3abef84728fcbc96e6819760
