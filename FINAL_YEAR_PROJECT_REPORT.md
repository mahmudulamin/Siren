# SIREN: Strategic Incident Response and Emergency Network

## Undergraduate Final Year Project Report

**Student Name:** [Your Name]  
**Department:** [Your Department]  
**University:** [Your University]  
**Supervisor:** [Supervisor Name]  
**Submission Date:** [Date]

---

## Abstract

SIREN, which stands for Strategic Incident Response and Emergency Network, is a full-stack web-based emergency response coordination platform designed to improve the way disaster-related cases are reported, managed, assigned, and tracked. The project was developed to solve a practical coordination problem that appears repeatedly during floods, rescue missions, medical emergencies, and other crisis situations: victims often cannot reach the right help quickly, while volunteers and officials do not have a centralized system that shows the full situation in real time.

The system connects four main user groups: victims, volunteers, officials, and donors. Victims can submit emergency requests with location, severity, type of emergency, and description. Volunteers can view assignments and update task progress. Officials can monitor the overall situation, assign volunteers, analyze request trends, and review AI-based zone predictions. Donors can contribute support and view donation-related information. The application uses a React frontend, a Node.js and Express backend, and a MongoDB database. Security and stability are supported through JWT authentication, password hashing, validation, rate limiting, and structured logging.

This report explains what the project is, why it was built, how it works, which technologies were used and why, what work was completed in the project, and how the system behaves from registration to assignment and reporting. It also discusses architecture, design decisions, modules, testing, deployment, limitations, and future improvements.

---

## Table of Contents

1. Introduction
2. Background and Motivation
3. Problem Statement
4. Project Objectives
5. Project Scope
6. Project Overview and System Concept
7. Technology Stack and Why It Was Used
8. System Analysis and Requirements
9. System Design and Architecture
10. How the Project Works
11. Frontend Implementation
12. Backend Implementation
13. Database Design
14. Authentication and Authorization
15. Emergency Request Workflow
16. Volunteer Workflow
17. Donation Workflow
18. Dashboard, Analytics, and AI Zone Prediction
19. Key Features of the System
20. Work Done in the Project
21. Testing and Validation
22. Deployment and Running Instructions
23. Limitations and Challenges
24. Future Scope
25. Conclusion
26. References

---

## 1. Introduction

Disaster response is a critical public service because a delay of only a few minutes can change the outcome for someone who needs rescue, medicine, food, shelter, or transport. In many emergency situations, the major problem is not the absence of people willing to help, but the absence of a structured system that connects the right people with the right information at the right time. Traditional communication methods such as phone calls, messages, and informal coordination often become slow, inconsistent, and difficult to monitor once the number of cases increases.

The SIREN project was created as a digital response to this issue. It is designed as a web platform that can be accessed from a browser on desktop or mobile devices. The system organizes emergency requests, volunteer support, administrative oversight, and donation tracking into one coordinated environment. Rather than treating each emergency as an isolated report, SIREN stores it as a structured case that can be tracked through a full workflow.

The project is relevant both academically and practically. Academically, it demonstrates how a complete full-stack application can be built using modern web technologies. Practically, it offers a prototype that reflects how digital coordination can reduce confusion and improve disaster response efficiency. The system combines user interface design, server-side development, database design, role-based access, map visualization, analytics, and security controls into one integrated solution.

---

## 2. Background and Motivation

Bangladesh is a country that frequently faces floods, waterlogging, storms, and other disaster conditions. These events can affect large populations at once, especially in low-lying and densely populated areas. During such events, the demand for rescue, support, and relief becomes very high very quickly. Victims may need urgent help, volunteers may want to serve, and officials may need a clear operational picture. Donors may also want to contribute supplies or money, but they need a reliable system that shows where support is required.

The motivation behind SIREN came from observing that emergency response is often fragmented. A person in need may contact local people, then volunteers, then officials, but the information may not be recorded consistently. Another issue is that different stakeholders work with different information, which creates duplication and delay. A centralized system can reduce this problem by maintaining one consistent source of truth.

Another strong motivation is usability. In a real emergency, users cannot spend time navigating a complex or confusing interface. They need a simple, fast, readable, and mobile-friendly experience. This requirement influenced the project’s design approach. The frontend was built with reusable components and clean layouts, while the backend was built with clear API structure and standardized response formats.

The system was also motivated by the need for better visibility. Officials often need to see which requests are pending, which are critical, where they are located, and which volunteer is assigned. SIREN addresses this by combining request tables, map views, dashboards, charts, and zone predictions.

---

## 3. Problem Statement

The central problem solved by this project is the lack of a unified, organized, and trackable emergency response coordination system. In many disaster situations, the response process depends on manual communication, verbal updates, scattered notes, or disconnected software tools. This leads to several issues.

First, victims may not be able to communicate their exact location or severity clearly enough. Second, volunteers may not know which cases are nearby or urgent. Third, officials may not have a complete picture of current requests and resources. Fourth, donations may not be transparently tracked. Fifth, there is often no simple way to analyze emergency patterns over time.

These problems create practical consequences. Rescue takes longer, resource allocation becomes inefficient, and case history is not preserved in a structured way. As a result, it becomes harder to make decisions based on data. A system like SIREN is necessary because it provides a structured digital workflow for a problem that is otherwise difficult to manage manually.

The project therefore focuses on transforming emergency coordination from a loose communication process into a monitored, role-based, database-driven digital system.

---

## 4. Project Objectives

The project was designed with several clear objectives.

The first objective is to allow victims to create help requests quickly and accurately. A user should be able to submit emergency information without unnecessary complexity.

The second objective is to give volunteers a clear way to see tasks and act on them. Volunteers should be able to identify which cases need attention and how their work is progressing.

The third objective is to provide officials with a dashboard that summarizes the situation. Officials should be able to view pending requests, active volunteers, completed cases, and zone-level patterns in one place.

The fourth objective is to support transparent donation management. Relief contributions should not be handled informally; they should be tracked as part of the overall system.

The fifth objective is to create a secure and maintainable full-stack application. This includes proper authentication, validation, backend organization, and data storage.

The sixth objective is to support practical presentation and academic evaluation. The final result should demonstrate real-world problem solving, not only code implementation.

---

## 5. Project Scope

SIREN is a complete prototype for emergency coordination, but it is intentionally scoped to remain feasible for an undergraduate project. The system includes user registration, login, role-based access control, request submission, request browsing, volunteer assignment, task management, donation tracking, analytics, and AI zone prediction.

The project does not attempt to replace government-level disaster infrastructure. Instead, it serves as a strong prototype that can show how emergency coordination can be organized digitally. This makes the project manageable while still being meaningful.

The scope also includes responsive web design, backend API development, database modeling, route protection, validation, documentation, and demo-ready local deployment. In addition, the project includes mock data support so the application can be demonstrated even when the backend is not connected.

---

## 6. Project Overview and System Concept

The concept behind SIREN is straightforward: when a disaster occurs, there should be one platform where victims can ask for help, volunteers can respond, officials can supervise, and donors can contribute. The system should show the current status of each case and organize all relevant data in one place.

The project is role-based. Each role has a different purpose and different permissions. Victims create requests, volunteers receive tasks, officials manage the response, and donors support the relief side of the operation. This separation is important because emergency operations are collaborative, but not every participant should have the same access.

The system is also location-aware. The project uses coordinates and map visualization to help users understand where a request is coming from. Location is one of the most important details in disaster response, and SIREN treats it as a core element of the workflow.

The application works as a chain of connected modules. The frontend captures user input, the backend validates and stores it, and the database preserves the state of every request and user record. Officials and volunteers then use the stored data to continue the response process.

---

## 7. Technology Stack and Why It Was Used

This section explains the technology used in the project and the reason each technology was selected.

### 7.1 React

React is used for the frontend because it is excellent for building interactive, component-based user interfaces. SIREN contains many pages, forms, dashboards, and data-driven views. React makes it easier to break the interface into reusable components such as buttons, cards, alerts, modals, tables, inputs, and layout containers. This keeps the code organized and maintainable.

React was also chosen because it works well for dynamic state handling. In SIREN, the UI must update when a user logs in, when a request is created, when a volunteer task changes status, or when analytics data is loaded. React handles this kind of dynamic interaction efficiently.

### 7.2 Vite

Vite is used as the build tool because it provides a fast development environment and a modern production build process. It starts quickly, refreshes efficiently during development, and generates optimized output for deployment. For a project that is frequently tested and adjusted, development speed is very important.

### 7.3 React Router

React Router is used because the application has multiple pages such as login, register, dashboard, request help, map, requests list, tasks, admin panel, and AI zones. Route management is essential in a project like this. It allows the application to behave like a multi-page system while still remaining a single-page application.

### 7.4 Tailwind CSS

Tailwind CSS is used for styling because it allows rapid construction of modern, consistent, and responsive interfaces. In SIREN, the interface must remain readable and accessible on mobile and desktop devices. Tailwind is effective because it makes it easy to apply layout, spacing, typography, and color without writing large custom style sheets.

### 7.5 Axios

Axios is used for HTTP communication between the frontend and backend. The project needs to send requests to create accounts, log in, fetch emergency data, manage volunteer actions, and retrieve analytics. Axios makes API integration straightforward and allows request interceptors, token handling, and error interception.

### 7.6 Leaflet and React Leaflet

Leaflet is used for map visualization because emergency response depends heavily on location. The project needs an interactive map to display request locations, zone data, and possible high-risk regions. React Leaflet integrates well with React and provides a practical way to render maps and markers.

### 7.7 Recharts

Recharts is used for charts and analytics visualization. Officials need summaries, not only raw tables. Charts help show trends, request distributions, volunteer performance, and zone risk patterns. Recharts was selected because it is easy to integrate with React and produces readable data visualizations.

### 7.8 Lucide React

Lucide React provides icons used throughout the interface. Icons help improve clarity, guide the user visually, and make the application feel more polished. In emergency systems, visual cues are useful because they reduce reading time.

### 7.9 React Hot Toast

React Hot Toast is used for notifications. It gives immediate feedback to the user after actions like login, submission, or errors. This improves usability because users know whether an action succeeded or failed.

### 7.10 Node.js

Node.js is used for the backend runtime because it is suitable for modern JavaScript-based full-stack development. It is efficient for handling asynchronous operations such as API requests, database queries, and authentication checks. Using the same language on both frontend and backend also simplifies development.

### 7.11 Express.js

Express is used because it provides a clean, lightweight, and flexible structure for REST APIs. SIREN requires multiple routes for auth, requests, volunteers, donations, and admin actions. Express makes it easy to define routes, attach middleware, and organize controllers.

### 7.12 MongoDB and Mongoose

MongoDB is used as the database because emergency data is often document-like and flexible. Requests, users, volunteers, donations, and analytics records can have varying fields, and MongoDB handles that well. Mongoose is used on top of MongoDB to define schemas, validation rules, and data models. This gives structure while still keeping flexibility.

### 7.13 JWT

JSON Web Token is used for authentication because it is a common and secure method for stateless login sessions. After login, the user receives a token that is sent with protected requests. This approach works well for separated frontend and backend applications.

### 7.14 bcryptjs

bcryptjs is used to hash passwords before they are stored. This is essential for user security. Passwords should never be stored in plain text.

### 7.15 express-validator

express-validator is used to validate input before it reaches the controller logic. This helps protect the system from malformed or incomplete requests and ensures data quality.

### 7.16 express-rate-limit

Rate limiting is included to reduce abuse, prevent spam, and make the backend more stable under repeated requests.

### 7.17 Helmet and CORS

Helmet is used to set security-related HTTP headers. CORS is used to control which frontend origin can access the backend. These measures are important in a deployment where frontend and backend are hosted separately.

### 7.18 Morgan and Custom Logger

Morgan is used for HTTP request logging, while a custom logger handles application-level events. Logging helps during debugging, testing, and monitoring.

### 7.19 Swagger Documentation

Swagger tools are used to document the API. This makes it easier to understand the backend routes, test them, and present the project professionally.

### 7.20 dotenv

dotenv is used for environment configuration. It keeps sensitive values such as database URIs and JWT secrets outside the source code.

---

## 8. System Analysis and Requirements

Before implementation, the system was analyzed from the perspective of users, system behavior, deployment environment, and data handling. This analysis helped define what the platform must do, how it should behave, and which technical constraints must be considered during development and testing.

### 8.1 User Requirements

The system is intended for four main user groups: victims, volunteers, officials, and donors. Each user group has a different goal and a different interaction pattern.

- Victims need a fast way to submit emergency requests and track their status.
- Volunteers need a clear list of tasks, assigned cases, and progress updates.
- Officials need a complete operational view for monitoring, assignment, and analytics.
- Donors need a reliable way to contribute resources and review donation-related information.

The interface must therefore be simple enough for stressed users during emergencies, but structured enough for officials to manage multiple cases at once.

### 8.2 Functional Requirements

The functional requirements describe the actual features that the system must provide.

- The system must allow user registration with role selection.
- The system must allow user login and logout.
- The system must support role-based access control.
- The system must allow victims to create emergency help requests.
- The system must allow victims to attach details such as location, severity, and description.
- The system must allow volunteers to view available or assigned tasks.
- The system must allow volunteers to update task progress and completion status.
- The system must allow officials to assign volunteers to requests.
- The system must allow officials to browse, filter, and manage all emergency requests.
- The system must provide request tracking through different statuses such as pending, assigned, in progress, and completed.
- The system must support donation creation and donation history.
- The system must display map-based incident data.
- The system must display dashboard statistics and charts for operational oversight.
- The system must provide AI-based zone prediction for risk awareness.
- The system must support offline local storage for request capture when the backend is unavailable.
- The system must sync locally stored request data when connectivity returns.

### 8.3 Non-Functional Requirements

The non-functional requirements describe the quality attributes that the system must satisfy.

- The application must be responsive and usable on mobile, tablet, and desktop screens.
- The system must remain understandable under emergency conditions.
- The frontend must load quickly and remain visually consistent.
- The backend must return predictable and structured JSON responses.
- The database must store records without losing key information.
- The system must be maintainable and modular for future improvement.
- The platform must be secure enough to protect personal and operational data.
- The application must be reliable during both online and offline usage modes.
- The system should continue to function in local network environments even when public internet is not available.
- The code should be organized so that new features can be added without rewriting the entire application.

### 8.4 Technical Requirements

The project requires a modern browser, a Node.js runtime, a frontend build tool, and a database server.

- Frontend: React, Vite, React Router, Tailwind CSS, Axios, Leaflet, Recharts, and supporting UI libraries.
- Backend: Node.js, Express.js, JWT, bcryptjs, express-validator, express-rate-limit, Helmet, CORS, Morgan, Swagger tools, and dotenv.
- Database: MongoDB with Mongoose for schema validation and persistence.
- Development tools: npm, code editor support, and terminal-based local testing.
- Optional network setup: local Wi-Fi, hotspot, or LAN for multi-device use without internet.

These requirements ensure that the application can be developed, tested, and demonstrated in an academic environment.

### 8.5 Operational Requirements

The platform must behave properly under real usage conditions.

- When the backend is online, the frontend should communicate with the API directly.
- When internet is not available, the frontend should still open and allow cached or locally stored data to be viewed.
- When a victim creates a request offline, the information should be stored locally and marked for later synchronization.
- When network connectivity returns, pending requests should be synchronized with the backend.
- In a local network setup, devices should be able to use the application through the local server without requiring internet access.

This makes the project more practical for disaster-prone areas where internet connectivity may be unstable.

### 8.6 Constraints and Assumptions

Several assumptions were made during analysis.

- Users are assumed to have access to a browser or mobile device.
- Emergency request data is assumed to be entered by the victim or a person on behalf of the victim.
- The backend server is assumed to be running when online API features are tested.
- For offline use, the browser must first load the application once so that the app shell and service worker can be cached.
- For local network support, the frontend and backend must be reachable within the same LAN or hotspot.

The project also has constraints.

- Live multi-user coordination is limited when there is no backend server available.
- Offline mode is mainly useful for request capture, cached views, and local demo use.
- Some features depend on external map tiles or online services unless cached or replaced by local resources.

### 8.7 Data Requirements

The system needs to store user data, emergency request data, volunteer profile data, donation data, and analytics-related data. The database design must be flexible enough to support these categories while still preserving consistency.

In addition, the system must preserve local request records when offline so that no emergency report is lost before synchronization.

The most important data elements are:

- user identity and role
- request location and coordinates
- emergency category and severity
- volunteer profile and availability
- donation details and status
- request status history
- analytics summaries and zone predictions

### 8.8 Security Requirements

The platform must protect user data and prevent unauthorized access.

- Passwords must be hashed before storage.
- Protected routes must require a valid token.
- Only the correct roles should be allowed to access sensitive actions.
- The backend should reject invalid or incomplete input.
- The system should apply rate limiting to reduce repeated abuse.

### 8.9 Performance Requirements

The application should remain usable even when the number of requests increases.

- Common pages should load without noticeable delay in normal conditions.
- Request listing should remain efficient when filters are applied.
- Dashboard statistics should be generated without blocking the user interface.
- Local offline data should be read and written quickly using browser storage.

### 8.10 Summary of Analysis

From the requirement analysis, the project was designed as a role-based emergency coordination platform with support for online operation, local network deployment, and offline-first request capture. This analysis justified the choice of a modular frontend, a REST-based backend, MongoDB storage, secure authentication, map visualization, and local caching for resilience in low-connectivity environments.

---

## 9. System Design and Architecture

SIREN follows a standard three-layer web architecture.

The first layer is the frontend presentation layer. It is responsible for the user interface, forms, pages, map views, and charts.

The second layer is the backend application layer. It handles business logic, validation, authentication, routing, and data processing.

The third layer is the database layer, which stores and retrieves records.

This structure is suitable because it separates concerns clearly. The frontend is focused on interaction, the backend is focused on processing, and the database is focused on persistence. This separation makes the system easier to maintain and debug.

### 9.1 Frontend Structure

The frontend is organized into folders for components, layouts, pages, services, context, hooks, data, and utilities. This makes the codebase cleaner and easier to navigate.

### 9.2 Backend Structure

The backend is organized into config, controllers, middleware, models, routes, seed, utils, and validators. Each folder has a specific responsibility.

### 9.3 Data Flow

The user submits input through the frontend. The frontend sends the request to the backend. The backend validates the data, checks permissions, interacts with the database, and returns a response. The frontend then updates the UI based on the result.

---

## 10. How the Project Works

This section explains the actual working process of the system from the perspective of a user and from the perspective of the architecture.

### 10.1 User Registration and Login

A new user opens the site and selects a role. The user then creates an account by entering details such as name, email, phone, password, and role. The frontend submits the form to the backend. The backend validates the input, checks whether the email already exists, hashes the password, stores the user record, and returns a JWT token.

After login, the token is saved in browser storage. The frontend uses that token for protected requests. If the user is not authenticated, protected routes cannot be accessed.

### 10.2 Victim Request Submission

A victim logs in and opens the request help page. The victim enters the emergency type, description, severity, contact details, and location information. The frontend sends this information to the backend. The backend stores it as a new request with status pending. Officials can then see it from the dashboard or request list.

### 10.3 Volunteer Assignment

An official opens the request list, reviews the details, and assigns a volunteer. The assigned status is stored in the database. The volunteer can then see the task and update progress.

### 10.4 Monitoring and Updates

The official dashboard shows totals, status counts, and analytics. The map view shows the incident location. The AI zone page shows possible high-risk areas. This helps officials make faster decisions.

### 10.5 Donation Handling

Donors can submit donations through the donation module. Donation records are stored and categorized. This enables reporting and transparency.

### 10.6 Overall System Flow

The complete workflow is: registration → login → request creation → review → assignment → task progress → completion → reporting. This chain is the core behavior of the project.

---

## 11. Frontend Implementation

The frontend is built to keep the interface clear, modern, and easy to use. The main app uses route-based pages wrapped by shared layouts. A public layout handles landing, login, and registration, while a protected dashboard layout handles internal pages.

### 11.1 Main Application Structure

The main app uses route protection so users cannot access restricted pages without authorization. Public routes are available for unauthenticated users, while protected routes require a valid session.

### 11.2 Pages

The project includes pages for landing, login, register, dashboard, request help, map, requests list, tasks, admin panel, AI zones, donate, and donation history. Each page has a focused purpose.

### 11.3 Reusable Components

The project contains reusable components such as buttons, cards, inputs, text areas, selects, alerts, badges, tables, modals, loaders, and stats cards. Reusable components reduce repetition and make the interface more consistent.

### 11.4 Frontend State Management

The application uses context for authentication state and utility hooks for common logic. This keeps the app structured and avoids prop drilling in common workflows.

### 11.5 Service Layer

API calls are separated into service files. This is useful because the UI components do not need to know about direct HTTP details. The service layer handles communication with the backend.

### 11.6 Mock Support

For demonstration and development, the frontend includes fallback mock data in some service functions. This allows the application to continue functioning even when the backend is unavailable during local testing.

---

## 12. Backend Implementation

The backend is the core processing engine of the system. It receives requests from the frontend, validates them, performs database operations, and returns structured results.

### 12.1 App Initialization

The Express application configures middleware for security, logging, body parsing, CORS, and rate limiting. Routes are then mounted for auth, requests, volunteers, donations, and admin features.

### 12.2 Controllers

Controllers contain the business logic. For example, the auth controller handles registration, login, current user lookup, and logout. The request controller handles request creation, listing, updating, deletion, and volunteer assignment. The volunteer controller handles profile creation, updates, and statistics. The donation controller handles donation creation and reporting. The admin controller handles dashboard stats, analytics, and zone prediction.

### 12.3 Middleware

Middleware is used for authentication, authorization, validation, rate limiting, and error handling. This keeps the controllers clean and ensures that repeated concerns are handled in one place.

### 12.4 Route Design

Each route group has a dedicated purpose. This makes the API easier to understand and document. REST-style endpoints are used so the frontend can work with standard HTTP methods.

### 12.5 Response Format

The backend returns JSON responses with a standardized success flag, message, and data section. This consistent format helps the frontend handle results in a predictable way.

---

## 13. Database Design

The database is built using MongoDB and Mongoose.

### 13.1 User Model

The user model stores identity fields such as email, hashed password, name, phone, role, and account status.

### 13.2 Request Model

The request model stores victim details, contact information, coordinates, emergency type, description, severity, status, assigned volunteer, and timestamps.

### 13.3 Volunteer Model

The volunteer model stores name, contact information, skills, availability, location, rating, tasks completed, and linked user data.

### 13.4 Donation Model

The donation model stores donor name, type, category, amount or items, payment method, transaction reference, status, and other supporting fields.

### 13.5 Why MongoDB Was Used

MongoDB was selected because emergency-related records may change over time and may not follow one rigid tabular structure. A document-based database is suitable for storing flexible case records and nested objects such as coordinates and assignment data.

---

## 14. Authentication and Authorization

The system must ensure that only the right users can access the right pages and actions.

JWT is used to issue a signed token after login. The frontend stores the token and sends it with protected API requests. The backend verifies the token before granting access.

Role-based access control is important because officials, volunteers, victims, and donors all need different permissions. This prevents unauthorized access and keeps the system organized.

Passwords are hashed with bcrypt before storage. This protects user accounts even if the database is exposed.

---

## 15. Emergency Request Workflow

The emergency request workflow is one of the most important parts of the project.

### 15.1 Creation

The victim submits a request with emergency type, location, severity, and description. The backend stores the request as pending.

### 15.2 Review

Officials review the request from the list or dashboard. They check the severity and the details provided by the victim.

### 15.3 Assignment

If suitable, the official assigns a volunteer to the request. The request status changes to assigned.

### 15.4 Progress Tracking

The volunteer can update the case status as work progresses. This gives visibility to the response team and the victim.

### 15.5 Completion

When the issue is resolved, the request can be marked completed. This record remains in the system for analysis and reporting.

---

## 16. Volunteer Workflow

Volunteers are central to the practical success of the system.

### 16.1 Profile Creation

After registering, a volunteer can create a profile with skills, availability, and location. This helps the system understand the volunteer’s capabilities.

### 16.2 Task Discovery

The volunteer can view assigned tasks or request-related work depending on the workflow being used.

### 16.3 Task Updates

The volunteer updates progress and completion status to keep the system accurate.

### 16.4 Performance Tracking

The system can track tasks completed and volunteer statistics. This helps officials and administrators monitor response capability.

---

## 17. Donation Workflow

The donation workflow supports relief and aid management.

Donors can submit donations as money or supplies. Donation categories, quantities, and amounts are stored in the backend. This information is important for transparency and organization.

The donation module is useful because emergency response is not only about rescue. Relief supply distribution and support tracking are also necessary parts of the overall system.

---

## 18. Dashboard, Analytics, and AI Zone Prediction

The dashboard turns raw operational data into meaningful summaries.

### 18.1 Dashboard Metrics

The official dashboard can show total requests, pending requests, active volunteers, completed tasks, critical requests, and response performance.

### 18.2 Analytics Charts

Charts are used to show request patterns by day, by type, by severity, and volunteer performance. Visual summaries help users understand the state of the system quickly.

### 18.3 AI Zone Prediction

The AI zone view is designed to show possible high-risk regions based on request patterns. It can support planning and awareness for officials.

### 18.4 Why These Features Matter

These features matter because disaster management requires both immediate action and longer-term planning. A dashboard answers “what is happening now,” while analytics and zone prediction help answer “where may help be needed next.”

---

## 19. Key Features of the System

The most important features of SIREN are the following:

1. Multi-role authentication and access control
2. Emergency help request submission
3. Request tracking by status
4. Volunteer assignment and task updates
5. Donation handling and donation history
6. Map-based incident visualization
7. Admin dashboard with metrics and charts
8. AI-based zone prediction view
9. Responsive UI for mobile and desktop
10. Secure backend with validation and tokens

These features collectively transform the system from a simple form website into a structured emergency coordination platform.

---

## 20. Work Done in the Project

This section summarizes the actual work completed in building the project.

### 20.1 Planning and Problem Analysis

The project started with identifying the emergency coordination problem and determining the user groups involved. Requirements were defined based on how victims, volunteers, officials, and donors interact during a disaster.

### 20.2 Frontend Development

The interface was built using React and Tailwind CSS. Pages, layouts, and components were created for all major flows. Routing and protected access were implemented.

### 20.3 Backend Development

The Express backend was structured into routes, controllers, middleware, validators, and utilities. REST endpoints were implemented for authentication, requests, volunteers, donations, and admin analytics.

### 20.4 Database Modeling

MongoDB collections and Mongoose schemas were created for users, requests, volunteers, and donations.

### 20.5 Security Implementation

JWT login, password hashing, validation, CORS, Helmet, and rate limiting were implemented to improve protection.

### 20.6 Data Visualization and Mapping

The project includes map views and chart-based analytics to make the system easier to supervise.

### 20.7 Documentation and Demo Support

Project documentation, setup notes, and mock data support were added to make the system easier to present and demonstrate.

---

## 21. Testing and Validation

Testing was performed to ensure that the system works logically and that the major flows are functional.

### 21.1 Functional Testing

Core functions such as registration, login, request submission, request listing, dashboard loading, and donation handling were checked.

### 21.2 Validation Testing

Input validation ensures that required fields are not empty and that values are in the expected format. This prevents malformed records from being stored.

### 21.3 API Testing

The backend API is documented with Swagger, which helps test endpoints in a structured way.

### 21.4 UI Testing

The interface was checked for responsiveness and basic navigation flow across different pages.

---

## 22. Deployment and Running Instructions

The project is designed to run locally during development.

### 22.1 Frontend

The frontend can be started using the Vite development server. It runs on port 3000 by default.

### 22.2 Backend

The backend can be started separately. It connects to MongoDB and serves the API on port 5000 by default.

### 22.3 Environment Configuration

Environment variables are used for API base URL, map token, database URI, JWT secret, and frontend origin.

### 22.4 Production Considerations

If deployed online, the frontend and backend URLs should be updated correctly. The backend CORS settings should match the frontend origin.

---

## 23. Limitations and Challenges

Although the project is complete as an undergraduate prototype, it still has limitations.

The system uses mock fallback data in some frontend services for development convenience. That means some flows can operate in demo mode even if the backend is not available.

The AI zone prediction feature is decision-support oriented, not a fully trained machine learning disaster forecast engine.

The project does not yet include SMS or push notification integration, offline synchronization, or direct government system integration.

These are not mistakes; they are normal limitations for a final year project and create room for future enhancement.

---

## 24. Future Scope

There are many possible directions for future improvement.

1. SMS-based emergency alerts
2. Push notifications for request status changes
3. Volunteer route optimization
4. Advanced AI-based risk forecasting
5. Offline-first request submission for low connectivity areas
6. Multi-language support
7. Integration with government emergency systems
8. Shelter and inventory management
9. More detailed analytics and reporting
10. Public safety alert broadcasting

These additions would make the system more capable and closer to a real operational deployment.

---

## 25. Conclusion

SIREN is a complete emergency response coordination platform developed as an undergraduate final year project. It shows how modern web technologies can be applied to a social problem that directly affects public safety. The system connects victims, volunteers, officials, and donors in one structured workflow.

The project demonstrates frontend development, backend API design, database modeling, authentication, authorization, mapping, analytics, and security. It also shows how a system can be made user-friendly and maintainable while still being technically strong.

The main value of SIREN is that it creates visibility and structure in a situation that usually suffers from confusion and delay. It does not merely store data; it organizes a response process. This makes the project meaningful both as a software engineering exercise and as a public-service prototype.

---

## 26. References

The project was developed using concepts and documentation from the following technologies and topics:

- React documentation
- Vite documentation
- Tailwind CSS documentation
- React Router documentation
- Axios documentation
- Leaflet documentation
- Recharts documentation
- Node.js documentation
- Express.js documentation
- MongoDB and Mongoose documentation
- JWT authentication concepts
- Password hashing and web security best practices
- REST API design principles
- Disaster response coordination concepts

---

## Appendix A: Short Summary for Viva

SIREN is a full-stack web platform for emergency response coordination. It allows victims to submit help requests, volunteers to manage tasks, officials to monitor cases, and donors to provide support. It uses React on the frontend, Node.js and Express on the backend, and MongoDB for data storage. The system includes authentication, validation, analytics, map visualization, and AI zone prediction.

---

## Appendix B: Suggested Presentation Flow

If you use this report for presentation or viva, a strong explanation order is:

1. Start with the problem and motivation.
2. Explain what SIREN is and who uses it.
3. Describe the technologies used and why they were chosen.
4. Explain how the system works from login to request completion.
5. Present the key features and modules.
6. Show the frontend, backend, and database design.
7. Discuss testing, deployment, limitations, and future work.

---

## Appendix C: Detailed User Scenarios

To make the system easier to understand, the following real-world style scenarios describe how each user type interacts with SIREN.

### Scenario 1: A victim reports a flood emergency

A person living in a flood-affected area opens the website from a mobile phone. After registering and logging in as a victim, the user selects the request help page. The form asks for personal information, emergency type, severity, address, and description. The user describes that water has entered the house and rescue is needed immediately. The location is pinned using coordinates or entered through address details. Once submitted, the request enters the system as a pending case.

From this point onward, the victim no longer needs to repeat the same information through different channels. The request is visible to the official dashboard, and the status can be updated as the case progresses.

### Scenario 2: A volunteer accepts a nearby rescue task

A volunteer logs in to view available requests or assigned tasks. The volunteer checks the severity, type, and location. If the case is close and relevant to the volunteer’s skill set, the task can be accepted. After acceptance, the task status changes in the system. The volunteer can then update notes or progress information as the work continues.

This scenario demonstrates why task management is important. A volunteer should not need to search across multiple sources. The platform brings together all the relevant details in one place.

### Scenario 3: An official monitors the response operation

An official opens the admin panel to review totals, request types, request status, and volunteer availability. The dashboard shows summary cards and analytics charts. The official can also inspect the map view to identify clusters of cases. Based on the available data, the official assigns a volunteer to an emergency and monitors whether the case is completed.

This scenario shows the management value of the platform. It turns scattered emergency data into something visible and actionable.

### Scenario 4: A donor contributes relief support

A donor visits the donation section and submits a contribution. The system stores the donor details and the donation type, which may be money or supplies. The donation record becomes part of the broader relief workflow. This improves transparency because the support is not hidden in informal channels.

---

## Appendix D: Detailed API and Module Summary

The backend was designed as a REST API so the frontend can communicate through standard HTTP operations. The major modules are summarized below.

### Authentication Module

The authentication system handles register, login, current user retrieval, and logout. During registration, the system validates the input, checks for duplicate emails, hashes the password, stores the user, and returns a token. During login, the system verifies the email, password, and role, then returns the authenticated user data and token.

This module is essential because every protected action in the system depends on it.

### Request Module

The request module is responsible for creating emergency cases, listing them with filters and pagination, retrieving a single request by ID, updating request details, deleting requests when permitted, and assigning volunteers.

The module supports filtering by status, severity, emergency type, and search term. This is very useful for officials because emergency data can grow quickly during a crisis.

### Volunteer Module

The volunteer module supports volunteer profile creation, profile updates, listing volunteers, viewing a volunteer by ID, and collecting volunteer statistics. This supports both the operational side and the administrative side of the project.

### Donation Module

The donation module supports donation creation, public donation listing, user donation history, donation summary statistics, category breakdowns, and status updates. It is a supporting module, but a highly important one because disaster response also depends on supplies and financial support.

### Admin Module

The admin module supports dashboard statistics, analytics data, and AI zone prediction. It is used by officials to understand the broader state of the system and improve planning.

---

## Appendix E: Why the Design Choices Were Practical

Several design choices were made because they are practical for both a final year project and a real web application.

### Component-based frontend

A component-based interface is easier to scale than a large static page. Since SIREN includes many forms and data views, reusable components reduce duplication and keep the code easier to read.

### Separate service layer

The frontend service layer keeps API logic out of page components. This improves maintainability and makes it easier to change backend behavior later.

### Validation in the backend

Validation is placed on the server so data quality does not depend on the frontend alone. Even if the frontend changes or a request is sent manually, the backend still checks whether the payload is valid.

### Role-based access control

Emergency systems require clear separation of roles. Victims should not have administrator powers, and volunteers should not access all official data. RBAC is therefore both a security and organization decision.

### MongoDB for flexible records

Emergency requests can contain varying levels of detail. MongoDB can store structured and semi-structured data more naturally than a rigid relational schema in this case.

### Map and chart visualizations

Maps and charts help turn raw records into actionable information. This matters because decision-makers often need a visual overview instead of a long table.

---

## Appendix F: Data Handling and Flow Explanation

The data flow of SIREN can be understood as a sequence of operations.

### Step 1: User input

A user interacts with the frontend and fills out a form or navigates a page.

### Step 2: Request transmission

The frontend sends a request to the backend using Axios. If the request is protected, the token is attached in the authorization header.

### Step 3: Validation and authentication

The backend checks whether the token is valid and whether the data fields are correct.

### Step 4: Database interaction

If the request passes validation, the backend stores or retrieves data from MongoDB.

### Step 5: Standardized response

The backend sends a JSON response using a consistent structure.

### Step 6: Frontend update

The frontend updates the page, stores session data, shows a notification, or redirects the user as needed.

This flow is repeated across the entire system. It is the reason the application remains coherent even though it has many pages and modules.

---

## Appendix G: Frontend Pages Explained in Detail

### Landing Page

The landing page introduces the system and explains the purpose of SIREN. It serves as the first impression of the project and directs users to registration or login.

### Login and Registration Pages

These pages allow users to access the system based on their role. They are designed to be simple and clear, because account creation should not feel difficult.

### Dashboard Page

The dashboard is different for each role. It shows summaries and relevant actions, keeping the interface focused on the user’s job.

### Request Help Page

This page is one of the most important features. It allows a victim to create a structured emergency report.

### Requests List Page

This page helps users browse and filter requests. It is especially useful for officials and monitoring purposes.

### Tasks Page

The tasks page helps volunteers manage their work. It provides a practical place to review assigned or available tasks.

### Map Page

The map page visually displays request locations. This makes incident distribution easier to understand.

### Admin Panel

The admin panel shows analytics, metrics, and system-level control information.

### AI Zones Page

This page displays risk-oriented insights and possible hot zones.

### Donation Pages

The donation and donation history pages support the relief side of the platform.

---

## Appendix H: Backend Logic Explained in Detail

### Request creation logic

When a request is created, the backend receives the submitted fields, checks the authenticated user, and saves the request with a default pending status. This is the start of the lifecycle of a case.

### Request assignment logic

When an official assigns a volunteer, the request is updated with volunteer details and a new status. This creates traceability and accountability.

### Volunteer profile logic

Volunteer information is associated with a user account. This makes it possible to link identity, skills, and tasks cleanly.

### Donation record logic

Donations are stored with type, category, amount or items, and transaction reference. This helps the system organize relief data clearly.

### Dashboard statistics logic

The dashboard module aggregates data from requests, volunteers, and donations to produce summary metrics. These metrics help officials understand the operational status of the platform.

---

## Appendix I: What Makes SIREN Different

SIREN is different from a simple report form or ordinary contact page because it combines multiple functions into one workflow.

It is not only a request submission tool. It is also a case tracking platform, a volunteer coordination tool, a donation support tool, a map-based operational view, and a dashboard for analysis.

The value of this design is integration. The user does not need one system for reporting, another for volunteers, another for analytics, and another for donations. Everything is combined in one architecture.

Another difference is the role-based nature of the system. The same interface does not expose the same actions to every user. This keeps the platform focused and more secure.

---

## Appendix J: Final Implementation Outcome

After development, the project resulted in a structured emergency response platform with the following outcome:

- A functional React frontend with route-based screens
- A modular Node.js and Express backend
- MongoDB models for users, requests, volunteers, and donations
- Authentication and authorization controls
- Admin analytics and AI zone views
- Map-based visualization and dashboard summaries
- Mock data support for demonstration mode
- Documentation and setup instructions for local execution

This outcome demonstrates that the project is not just conceptual. It has been built as a working prototype with a complete workflow.
