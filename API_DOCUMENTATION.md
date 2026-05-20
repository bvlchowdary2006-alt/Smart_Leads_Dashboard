# Smart Leads Dashboard - API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Response Format

All responses follow a consistent format:

```json
{
  "success": true,
  "message": "Description of the result",
  "data": {},
  "meta": {}
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": ["Error message"]
  }
}
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Rate limited: 20 requests per 15 minutes.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "sales"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | User's full name (2-100 chars) |
| email | string | Yes | Valid email address |
| password | string | Yes | Password (min 6 chars) |
| role | string | No | "admin" or "sales" (default: "sales") |

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user": {
      "id": "507f191e810c19729de860ea",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "sales"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Login

**POST** `/auth/login`

Rate limited: 20 requests per 15 minutes.

**Request Body:**
```json
{
  "email": "admin@smartleads.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": "507f191e810c19729de860ea",
      "name": "Admin User",
      "email": "admin@smartleads.com",
      "role": "admin"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

Sets HTTP-only cookie: `refreshToken`

---

### Logout

**POST** `/auth/logout`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful."
}
```

Clears the `refreshToken` cookie.

---

### Get Current User

**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "User fetched successfully.",
  "data": {
    "id": "507f191e810c19729de860ea",
    "name": "Admin User",
    "email": "admin@smartleads.com",
    "role": "admin",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Lead Endpoints

### Get All Leads

**GET** `/leads`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | Search by name or email (regex) |
| status | string | Filter: New, Contacted, Qualified, Lost |
| source | string | Filter: Website, Instagram, Referral |
| sort | string | Sort: latest, oldest (default: latest) |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |

**Example:**
```
GET /leads?search=john&status=New&sort=latest&page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "message": "Leads fetched successfully.",
  "data": [
    {
      "_id": "507f191e810c19729de860ea",
      "name": "John Smith",
      "email": "john@example.com",
      "status": "New",
      "source": "Website",
      "createdBy": {
        "_id": "507f191e810c19729de860eb",
        "name": "Admin User",
        "email": "admin@smartleads.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "pages": 5,
    "limit": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### Get Single Lead

**GET** `/leads/:id`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Lead fetched successfully.",
  "data": {
    "_id": "507f191e810c19729de860ea",
    "name": "John Smith",
    "email": "john@example.com",
    "status": "New",
    "source": "Website",
    "createdBy": {
      "_id": "507f191e810c19729de860eb",
      "name": "Admin User",
      "email": "admin@smartleads.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "Lead not found."
}
```

---

### Create Lead

**POST** `/leads`

**Headers:** `Authorization: Bearer <token>`

**Access:** Admin, Sales

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "status": "New",
  "source": "Website"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Lead name (2-100 chars) |
| email | string | Yes | Valid email |
| status | string | No | New, Contacted, Qualified, Lost (default: New) |
| source | string | Yes | Website, Instagram, Referral |

**Response (201):**
```json
{
  "success": true,
  "message": "Lead created successfully.",
  "data": {
    "_id": "507f191e810c19729de860ea",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "status": "New",
    "source": "Website",
    "createdBy": "507f191e810c19729de860eb",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Update Lead

**PUT** `/leads/:id`

**Headers:** `Authorization: Bearer <token>`

**Access:** Admin, Sales

**Request Body:** (all fields optional)
```json
{
  "name": "Jane Smith",
  "status": "Contacted"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Lead updated successfully.",
  "data": {
    "_id": "507f191e810c19729de860ea",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "status": "Contacted",
    "source": "Website",
    "createdBy": {
      "_id": "507f191e810c19729de860eb",
      "name": "Admin User",
      "email": "admin@smartleads.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### Delete Lead

**DELETE** `/leads/:id`

**Headers:** `Authorization: Bearer <token>`

**Access:** Admin only

**Response (200):**
```json
{
  "success": true,
  "message": "Lead deleted successfully."
}
```

**Error (403):**
```json
{
  "success": false,
  "message": "You do not have permission to perform this action."
}
```

---

### Export Leads as CSV

**GET** `/leads/export/csv`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:** Same as Get All Leads (search, status, source)

**Response:** CSV file download

**Example CSV:**
```csv
Name,Email,Status,Source,Created By,Created At
"John Smith","john@example.com","New","Website","Admin User","2024-01-15T10:30:00.000Z"
"Jane Doe","jane@example.com","Contacted","Instagram","Admin User","2024-01-15T11:00:00.000Z"
```

---

### Get Dashboard Stats

**GET** `/leads/stats`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Dashboard stats fetched successfully.",
  "data": {
    "totalLeads": 50,
    "leadsByStatus": [
      { "_id": "Contacted", "count": 15 },
      { "_id": "Lost", "count": 5 },
      { "_id": "New", "count": 20 },
      { "_id": "Qualified", "count": 10 }
    ],
    "leadsBySource": [
      { "_id": "Instagram", "count": 12 },
      { "_id": "Referral", "count": 13 },
      { "_id": "Website", "count": 25 }
    ],
    "recentLeads": [
      {
        "_id": "507f191e810c19729de860ea",
        "name": "John Smith",
        "email": "john@example.com",
        "status": "New",
        "source": "Website",
        "createdBy": {
          "name": "Admin User",
          "email": "admin@smartleads.com"
        },
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## cURL Examples

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@smartleads.com", "password": "admin123"}'
```

### Get Leads
```bash
curl -X GET "http://localhost:5000/api/leads?page=1&limit=10" \
  -H "Authorization: Bearer <your_token>"
```

### Create Lead
```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{"name": "Test Lead", "email": "test@example.com", "source": "Website"}'
```

### Export CSV
```bash
curl -X GET "http://localhost:5000/api/leads/export/csv?status=New" \
  -H "Authorization: Bearer <your_token>" \
  --output leads.csv
```
