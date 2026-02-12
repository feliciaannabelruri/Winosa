# Winosa Backend API Documentation

Base URL: `http://localhost:5000`

## Authentication

All admin endpoints require JWT authentication.

**Headers:**
```
Authorization: Bearer {token}
```

---

## Public Endpoints

### Auth

#### Register Admin
```
POST /api/auth/register
```

**Body:**
```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "password123"
}
```

#### Login
```
POST /api/auth/login
```

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer {token}
```

#### Logout
```
POST /api/auth/logout
Headers: Authorization: Bearer {token}
```

---

### Services

#### Get All Services (Public)
```
GET /api/services
```

#### Get Service by Slug
```
GET /api/services/:slug
```

---

### Portfolio

#### Get All Portfolios (Public)
```
GET /api/portfolio
Query: ?page=1&limit=10&category=web
```

#### Get Portfolio by Slug
```
GET /api/portfolio/:slug
```

---

### Blog

#### Get All Blogs (Public)
```
GET /api/blog
Query: ?page=1&limit=10
```

#### Get Blog by Slug
```
GET /api/blog/:slug
```

---

### Subscriptions

#### Get All Subscriptions
```
GET /api/subscriptions
```

---

### Contact

#### Submit Contact Form
```
POST /api/contact
Query: ?lang=id|en|nl
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry",
  "message": "Message here"
}
```

---

### Newsletter

#### Subscribe to Newsletter
```
POST /api/newsletter
Query: ?lang=id|en|nl
```

**Body:**
```json
{
  "email": "subscriber@example.com"
}
```

---

## Admin Endpoints

**All admin endpoints require authentication**

### Admin - Services

#### Get All Services (Admin)
```
GET /api/admin/services
Headers: Authorization: Bearer {token}
```

#### Create Service
```
POST /api/admin/services
Headers: Authorization: Bearer {token}
```

**Body:**
```json
{
  "title": "Service Name",
  "slug": "service-name",
  "description": "Service description",
  "icon": "icon-name",
  "features": ["Feature 1", "Feature 2"],
  "price": "Starting from $99",
  "isActive": true
}
```

#### Update Service
```
PUT /api/admin/services/:id
Headers: Authorization: Bearer {token}
```

**Body:** (all fields optional)
```json
{
  "title": "Updated Name",
  "price": "Starting from $199"
}
```

#### Delete Service
```
DELETE /api/admin/services/:id
Headers: Authorization: Bearer {token}
```

---

### Admin - Portfolio

#### Get All Portfolios (Admin)
```
GET /api/admin/portfolio
Headers: Authorization: Bearer {token}
Query: ?page=1&limit=10&category=web
```

#### Create Portfolio
```
POST /api/admin/portfolio
Headers: Authorization: Bearer {token}
```

**Body:**
```json
{
  "title": "Project Name",
  "slug": "project-name",
  "description": "Project description",
  "image": "https://example.com/image.jpg",
  "category": "web",
  "client": "Client Name",
  "projectUrl": "https://project.com",
  "isActive": true
}
```

#### Update Portfolio
```
PUT /api/admin/portfolio/:id
Headers: Authorization: Bearer {token}
```

#### Delete Portfolio
```
DELETE /api/admin/portfolio/:id
Headers: Authorization: Bearer {token}
```

---

### Admin - Blog

#### Get All Blogs (Admin)
```
GET /api/admin/blog
Headers: Authorization: Bearer {token}
Query: ?page=1&limit=10&isPublished=true&author=John
```

#### Get Blog by ID
```
GET /api/admin/blog/:id
Headers: Authorization: Bearer {token}
```

#### Create Blog
```
POST /api/admin/blog
Headers: Authorization: Bearer {token}
```

**Body:**
```json
{
  "title": "Blog Title",
  "slug": "blog-title",
  "content": "Blog content (minimum 50 characters)",
  "excerpt": "Short description (minimum 20 characters)",
  "image": "https://example.com/image.jpg",
  "author": "Author Name",
  "tags": ["tag1", "tag2"],
  "isPublished": true
}
```

#### Update Blog
```
PUT /api/admin/blog/:id
Headers: Authorization: Bearer {token}
```

#### Delete Blog
```
DELETE /api/admin/blog/:id
Headers: Authorization: Bearer {token}
```

---

## Error Responses

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title must be at least 3 characters"
    }
  ]
}
```

### Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Duplicate Entry
```json
{
  "success": false,
  "message": "Slug already exists"
}
```

---

## Multi-Language Support

Add `?lang=id|en|nl` query parameter to endpoints that support it:
- Contact form
- Newsletter subscription
- Authentication endpoints

**Example:**
```
POST /api/contact?lang=id
POST /api/newsletter?lang=nl
POST /api/auth/login?lang=en
```

---

## Pagination

Endpoints that support pagination:
- GET /api/portfolio
- GET /api/blog
- GET /api/admin/portfolio
- GET /api/admin/blog

**Query Parameters:**
```
?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": [...]
}
```