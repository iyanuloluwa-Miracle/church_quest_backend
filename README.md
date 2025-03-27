# Church Quest API

A RESTful API for the Church Quest application.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary account (for image uploads)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file in the root directory with the following variables:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication

#### Register a new user
- **URL**: `/api/auth/signup`
- **Method**: `POST`
- **Access**: Public
- **Body**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
- **File Upload**: Optional profile picture (multipart/form-data)
- **Success Response**: 
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "string",
      "name": "string",
      "email": "string",
      "profilePic": {
        "url": "string",
        "publicId": "string"
      },
      "createdAt": "string"
    },
    "token": "string"
  }
}
```

#### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Access**: Public
- **Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
- **Success Response**:
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "_id": "string",
      "name": "string",
      "email": "string",
      "profilePic": {
        "url": "string",
        "publicId": "string"
      },
      "createdAt": "string"
    },
    "token": "string"
  }
}
```

#### Get User Profile
- **URL**: `/api/auth/profile`
- **Method**: `GET`
- **Access**: Private (requires JWT token)
- **Headers**:
```
Authorization: Bearer <token>
```
- **Success Response**:
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "_id": "string",
      "name": "string",
      "email": "string",
      "profilePic": {
        "url": "string",
        "publicId": "string"
      },
      "createdAt": "string"
    }
  }
}
```

#### Logout
- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Access**: Private (requires JWT token)
- **Headers**:
```
Authorization: Bearer <token>
```
- **Success Response**:
```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "success": false,
  "message": "Error message",
  "error": null | object
}
```

Common HTTP status codes:
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Authentication

Protected routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

The token is obtained upon successful registration or login.
