# SIREN Backend - Complete API Specification

## Overview

**Base URL:** `http://localhost:5000/api`

**Documentation:** `http://localhost:5000/api/docs`

**Response Format:** All endpoints return JSON with standardized format:

```json
{
  "success": true/false,
  "message": "Description",
  "data": {}
}
```

---

## Authentication

### Register

**POST** `/auth/register`

Create a new user account.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "Password123",
  "name": "John Doe",
  "phone": "+8801700000000",
  "role": "victim"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "+8801700000000",
      "role": "victim",
      "createdAt": "2024-06-15T10:30:00Z",
      "updatedAt": "2024-06-15T10:30:00Z"
    }
  }
}
```

**Validation:**

- Email: Valid format, unique
- Password: Min 8 chars, uppercase, lowercase, number
- Name: 2-50 chars
- Phone: Valid format
- Role: victim | volunteer | official | donor

**Error Responses:**

- 400: Validation error
- 409: Email already registered

---

### Login

**POST** `/auth/login`

Authenticate a user and receive JWT token.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "Password123",
  "role": "victim"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "victim"
    }
  }
}
```

**Error Responses:**

- 401: Invalid credentials
- 401: Role does not match

---

### Get Current User

**GET** `/auth/me`

Retrieve authenticated user profile.

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+8801700000000",
    "role": "victim",
    "createdAt": "2024-06-15T10:30:00Z"
  }
}
```

---

## Emergency Requests

### Create Request

**POST** `/requests`

Submit a new emergency help request.

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**

```json
{
  "victimName": "Karim Ahmed",
  "phone": "+8801712345678",
  "email": "karim@example.com",
  "address": "Sylhet Sadar, Sylhet",
  "coordinates": {
    "lat": 24.8949,
    "lng": 91.8687
  },
  "emergencyType": "Flood",
  "description": "House flooded, need immediate rescue and shelter",
  "severity": "critical"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Request created successfully",
  "data": {
    "_id": "607f1f77bcf86cd799439012",
    "victimName": "Karim Ahmed",
    "phone": "+8801712345678",
    "email": "karim@example.com",
    "address": "Sylhet Sadar, Sylhet",
    "coordinates": {
      "lat": 24.8949,
      "lng": 91.8687
    },
    "emergencyType": "Flood",
    "description": "House flooded, need immediate rescue and shelter",
    "severity": "critical",
    "status": "pending",
    "assignedVolunteer": null,
    "victimId": "507f1f77bcf86cd799439011",
    "createdAt": "2024-06-15T10:30:00Z",
    "updatedAt": "2024-06-15T10:30:00Z"
  }
}
```

**Emergency Types:**

- Flood
- Medical Emergency
- Food/Water Shortage
- Shelter
- Rescue
- Other

**Severity Levels:**

- low
- medium
- high
- critical

---

### Get All Requests

**GET** `/requests`

List all emergency requests with pagination and filtering.

**Query Parameters:**

- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 10, max: 100)
- `status` (string): Filter by status
- `severity` (string): Filter by severity
- `emergencyType` (string): Filter by type
- `search` (string): Search in name, description, address

**Example:**

```
GET /api/requests?page=1&limit=10&status=pending&severity=critical
```

**Response (200):**

```json
{
  "success": true,
  "message": "Requests retrieved successfully",
  "data": {
    "requests": [
      {
        "_id": "607f1f77bcf86cd799439012",
        "victimName": "Karim Ahmed",
        "phone": "+8801712345678",
        "email": "karim@example.com",
        "address": "Sylhet Sadar, Sylhet",
        "coordinates": {
          "lat": 24.8949,
          "lng": 91.8687
        },
        "emergencyType": "Flood",
        "description": "House flooded, need immediate rescue and shelter",
        "severity": "critical",
        "status": "pending",
        "assignedVolunteer": null,
        "createdAt": "2024-06-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

---

### Get Request by ID

**GET** `/requests/:id`

Retrieve a specific emergency request.

**Parameters:**

- `id` (string): MongoDB object ID

**Response (200):**

```json
{
  "success": true,
  "message": "Request retrieved successfully",
  "data": {
    "_id": "607f1f77bcf86cd799439012",
    "victimName": "Karim Ahmed",
    "phone": "+8801712345678",
    "email": "karim@example.com",
    "address": "Sylhet Sadar, Sylhet",
    "coordinates": {
      "lat": 24.8949,
      "lng": 91.8687
    },
    "emergencyType": "Flood",
    "description": "House flooded, need immediate rescue and shelter",
    "severity": "critical",
    "status": "pending",
    "assignedVolunteer": null,
    "createdAt": "2024-06-15T10:30:00Z",
    "updatedAt": "2024-06-15T10:30:00Z"
  }
}
```

---

### Update Request

**PUT** `/requests/:id`

Update an emergency request (official/volunteer only).

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**

```json
{
  "status": "in_progress",
  "severity": "high"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Request updated successfully",
  "data": {
    "_id": "607f1f77bcf86cd799439012",
    "victimName": "Karim Ahmed",
    "phone": "+8801712345678",
    "email": "karim@example.com",
    "address": "Sylhet Sadar, Sylhet",
    "coordinates": {
      "lat": 24.8949,
      "lng": 91.8687
    },
    "emergencyType": "Flood",
    "description": "House flooded, need immediate rescue and shelter",
    "severity": "high",
    "status": "in_progress",
    "assignedVolunteer": null,
    "createdAt": "2024-06-15T10:30:00Z",
    "updatedAt": "2024-06-15T10:35:00Z"
  }
}
```

**Allowed Status Changes:**

- pending → assigned | in_progress | cancelled
- assigned → in_progress | cancelled
- in_progress → completed | cancelled
- completed (terminal state)
- cancelled (terminal state)

---

### Delete Request

**DELETE** `/requests/:id`

Delete an emergency request (official/victim only).

**Response (200):**

```json
{
  "success": true,
  "message": "Request deleted successfully",
  "data": null
}
```

---

### Assign Volunteer

**POST** `/requests/:id/assign`

Assign a volunteer to an emergency request (official only).

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**

```json
{
  "volunteerId": "507f1f77bcf86cd799439013",
  "volunteerName": "Rahman Volunteer",
  "volunteerPhone": "+8801811111111"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Volunteer assigned successfully",
  "data": {
    "_id": "607f1f77bcf86cd799439012",
    "victimName": "Karim Ahmed",
    "status": "assigned",
    "assignedVolunteer": {
      "volunteerId": "507f1f77bcf86cd799439013",
      "name": "Rahman Volunteer",
      "phone": "+8801811111111",
      "assignedAt": "2024-06-15T10:40:00Z"
    }
  }
}
```

---

## Volunteers

### Get All Volunteers

**GET** `/volunteers`

List all available volunteers.

**Query Parameters:**

- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 10)
- `availability` (boolean): Filter by availability

**Response (200):**

```json
{
  "success": true,
  "message": "Volunteers retrieved successfully",
  "data": {
    "volunteers": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "userId": "507f1f77bcf86cd799439003",
        "name": "Rahman Volunteer",
        "email": "rahman@example.com",
        "phone": "+8801811111111",
        "skills": ["First Aid", "Emergency Response", "CPR"],
        "availability": true,
        "location": {
          "lat": 24.8949,
          "lng": 91.8687
        },
        "tasksCompleted": 15,
        "rating": 4.8,
        "bio": "Experienced emergency responder",
        "createdAt": "2024-06-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "pages": 1
    }
  }
}
```

---

### Get Volunteer by ID

**GET** `/volunteers/:id`

Get a specific volunteer's profile.

**Response (200):**

```json
{
  "success": true,
  "message": "Volunteer retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439003",
    "name": "Rahman Volunteer",
    "email": "rahman@example.com",
    "phone": "+8801811111111",
    "skills": ["First Aid", "Emergency Response", "CPR"],
    "availability": true,
    "location": {
      "lat": 24.8949,
      "lng": 91.8687
    },
    "tasksCompleted": 15,
    "rating": 4.8,
    "bio": "Experienced emergency responder",
    "createdAt": "2024-06-15T10:30:00Z"
  }
}
```

---

### Update Volunteer

**PUT** `/volunteers/:id`

Update volunteer profile (volunteer/official only).

**Request:**

```json
{
  "availability": false,
  "skills": ["First Aid", "CPR", "Rescue Ops"],
  "location": {
    "lat": 25.0658,
    "lng": 91.395
  },
  "bio": "Updated bio text"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Volunteer updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Rahman Volunteer",
    "availability": false,
    "skills": ["First Aid", "CPR", "Rescue Ops"],
    "location": {
      "lat": 25.0658,
      "lng": 91.395
    },
    "bio": "Updated bio text"
  }
}
```

---

### Create Volunteer Profile

**POST** `/volunteers/profile`

Create a volunteer profile (volunteer role only).

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**

```json
{
  "skills": ["First Aid", "Emergency Response"],
  "availability": true,
  "location": {
    "lat": 24.8949,
    "lng": 91.8687
  },
  "bio": "I am an experienced emergency responder"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Volunteer profile created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439003",
    "name": "Rahman",
    "email": "rahman@example.com",
    "phone": "+8801811111111",
    "skills": ["First Aid", "Emergency Response"],
    "availability": true,
    "location": {
      "lat": 24.8949,
      "lng": 91.8687
    },
    "tasksCompleted": 0,
    "rating": 0,
    "bio": "I am an experienced emergency responder",
    "createdAt": "2024-06-15T10:30:00Z"
  }
}
```

---

### Get Volunteer Statistics

**GET** `/volunteers/:id/stats`

Retrieve volunteer performance statistics.

**Response (200):**

```json
{
  "success": true,
  "message": "Volunteer stats retrieved successfully",
  "data": {
    "tasksCompleted": 15,
    "rating": 4.8,
    "availability": true,
    "skills": ["First Aid", "Emergency Response", "CPR"],
    "joinedAt": "2024-01-15T00:00:00Z"
  }
}
```

---

## Donations

### Create Donation

**POST** `/donations`

Create a new donation.

**Request (Money Donation):**

```json
{
  "donorName": "Generous Donor",
  "email": "donor@example.com",
  "phone": "+8801944444444",
  "type": "money",
  "category": "General Relief Fund",
  "amount": 50000,
  "currency": "BDT",
  "description": "Donation for flood relief",
  "anonymous": false,
  "paymentMethod": "bKash"
}
```

**Request (Supply Donation):**

```json
{
  "donorName": "Helper",
  "email": "helper@example.com",
  "phone": "+8801955555555",
  "type": "supply",
  "category": "Food & Water Supplies",
  "items": ["Rice", "Bottled Water"],
  "quantity": 100,
  "description": "Food and water supplies",
  "anonymous": false,
  "paymentMethod": "Direct"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Donation created successfully",
  "data": {
    "_id": "607f1f77bcf86cd799439014",
    "donorId": null,
    "donorName": "Generous Donor",
    "email": "donor@example.com",
    "phone": "+8801944444444",
    "type": "money",
    "category": "General Relief Fund",
    "amount": 50000,
    "currency": "BDT",
    "description": "Donation for flood relief",
    "anonymous": false,
    "status": "pending",
    "paymentMethod": "bKash",
    "transactionId": "SIREN-ABCD1234",
    "createdAt": "2024-06-15T10:30:00Z"
  }
}
```

**Donation Categories:**

- General Relief Fund
- Food & Water Supplies
- Medical Supplies & Treatment
- Shelter & Rehabilitation
- Rescue Operations
- Emergency Reserve Fund

**Payment Methods:**

- bKash
- Nagad
- Rocket
- Card
- Bank Transfer
- Direct

---

### Get All Donations

**GET** `/donations`

List public donations (non-anonymous).

**Query Parameters:**

- `page` (integer): Page number
- `limit` (integer): Items per page
- `status` (string): Filter by status
- `category` (string): Filter by category

**Response (200):**

```json
{
  "success": true,
  "message": "Donations retrieved successfully",
  "data": {
    "donations": [
      {
        "_id": "607f1f77bcf86cd799439014",
        "donorName": "Generous Donor",
        "type": "money",
        "category": "General Relief Fund",
        "amount": 50000,
        "currency": "BDT",
        "status": "completed",
        "createdAt": "2024-06-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

---

### Get User's Donations

**GET** `/donations/user/history`

Get authenticated user's donation history.

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "success": true,
  "message": "User donations retrieved successfully",
  "data": {
    "donations": [...],
    "pagination": {...}
  }
}
```

---

### Get Donation Statistics

**GET** `/donations/stats/overview`

Get overall donation statistics.

**Response (200):**

```json
{
  "success": true,
  "message": "Donation stats retrieved successfully",
  "data": {
    "totalDonations": 375000,
    "donationCount": 5,
    "supplyDonations": 2,
    "averageDonation": 75000
  }
}
```

---

### Get Donations by Category

**GET** `/donations/category/breakdown`

Get donations grouped by category.

**Response (200):**

```json
{
  "success": true,
  "message": "Donations by category retrieved successfully",
  "data": [
    {
      "_id": "General Relief Fund",
      "totalAmount": 50000,
      "count": 1
    },
    {
      "_id": "Food & Water Supplies",
      "totalAmount": 0,
      "count": 1
    }
  ]
}
```

---

## Admin Analytics

### Get Dashboard Stats

**GET** `/admin/stats`

Get overall system statistics (official only).

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Dashboard stats retrieved successfully",
  "data": {
    "totalRequests": 156,
    "pendingRequests": 23,
    "activeVolunteers": 45,
    "completedTasks": 98,
    "criticalRequests": 12,
    "responseRate": 87.5,
    "averageResponseTime": "2.3 hours",
    "activeDisasters": 3,
    "totalDonations": 2500000,
    "totalVolunteers": 50
  }
}
```

---

### Get Analytics

**GET** `/admin/analytics`

Get detailed analytics for a period (official only).

**Query Parameters:**

- `period` (string): 7d | 30d | 90d | 1y (default: 7d)

**Response (200):**

```json
{
  "success": true,
  "message": "Analytics retrieved successfully",
  "data": {
    "requestsByDay": [
      {
        "_id": "2024-06-15",
        "count": 12
      },
      {
        "_id": "2024-06-16",
        "count": 19
      }
    ],
    "requestsByType": [
      {
        "_id": "Flood",
        "count": 45
      },
      {
        "_id": "Medical Emergency",
        "count": 32
      }
    ],
    "requestsBySeverity": [
      {
        "_id": "critical",
        "count": 12
      },
      {
        "_id": "high",
        "count": 34
      }
    ],
    "volunteerPerformance": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "name": "Rahman Volunteer",
        "tasksCompleted": 15,
        "rating": 4.8
      }
    ]
  }
}
```

---

### Get Zone Predictions

**GET** `/admin/zones`

Get AI-powered zone predictions (official only).

**Response (200):**

```json
{
  "success": true,
  "message": "Zone predictions retrieved successfully",
  "data": [
    {
      "id": "zone-0",
      "name": "Sunamganj Sadar, Sunamganj",
      "severity": "critical",
      "riskScore": 92,
      "coordinates": {
        "lat": 25.0658,
        "lng": 91.3958
      },
      "affectedPopulation": 45000,
      "prediction": "High flood risk in next 48 hours"
    }
  ]
}
```

---

## Error Responses

### Bad Request (400)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "message": "No authorization token provided",
  "errors": []
}
```

### Forbidden (403)

```json
{
  "success": false,
  "message": "Insufficient permissions for this action",
  "errors": []
}
```

### Not Found (404)

```json
{
  "success": false,
  "message": "Request not found",
  "errors": []
}
```

### Conflict (409)

```json
{
  "success": false,
  "message": "Email already registered",
  "errors": []
}
```

### Rate Limited (429)

```json
{
  "success": false,
  "message": "Too many requests, please try again later",
  "errors": []
}
```

### Internal Server Error (500)

```json
{
  "success": false,
  "message": "Internal Server Error",
  "errors": []
}
```

---

## Status Codes Reference

| Code | Meaning                              |
| ---- | ------------------------------------ |
| 200  | OK - Success                         |
| 201  | Created - Resource created           |
| 400  | Bad Request - Validation error       |
| 401  | Unauthorized - Auth required         |
| 403  | Forbidden - Insufficient permissions |
| 404  | Not Found - Resource not found       |
| 409  | Conflict - Duplicate entry           |
| 429  | Too Many Requests - Rate limited     |
| 500  | Internal Server Error                |

---

**Last Updated: June 15, 2024**
