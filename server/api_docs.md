# API Documentation

## Endpoints

### Authentication
- `POST /login` - User login
- `POST /auth/google` - Google OAuth login
- `POST /register` - User registration

### Recipes
- `GET /recipes` - Get all recipes
- `GET /recipes/:id` - Get a recipe by ID
- `GET /recipes/:id/generate` - Generate alternatives for recipe ingredients
- `GET /my-recipes` - Get recipes created by the authenticated user
- `POST /recipes` - Create a new recipe
- `PUT /recipes/:id` - Update a recipe
- `DELETE /recipes/:id` - Delete a recipe

### Regions
- `GET /regions` - Get all regions

---

## Authentication

### POST /login
**Description:**
- User login.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:**
- 200 OK:  
  ```json
  {
    "access_token": "string"
  }
  ```
- 400 Bad Request:  
  ```json
  {
    "message": "Email is required"
  }
  ```
  or  
  ```json
  {
    "message": "Password is required"
  }
  ```

### POST /auth/google
**Description:**
- Google OAuth login.

**Request Body:**
```json
{
  "googleToken": "string"
}
```
**Response:**
- 200 OK or 201 Created:  
  ```json
  {
    "access_token": "string"
  }
  ```
- 500 Internal Server Error:  
  ```json
  {
    "message": "Internal server error"
  }
  ```

### POST /register
**Description:**
- User registration.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:**
- 201 Created:  
  ```json
  {
    "id": "number",
    "email": "string"
  }
  ```
- 400 Bad Request:  
  ```json
  {
    "message": "Validation error message"
  }
  ```

---

## Recipes

### GET /recipes
**Description:**
- Get all recipes.

**Query Parameters:**
- `q` (optional): Search query.
- `regionId` (optional): Filter by region ID.
- `page` (optional): Page number (default: 1).

**Response:**
- 200 OK:  
  ```json
  {
    "totalData": "number",
    "totalPages": "number",
    "currentPage": "number",
    "recipes": [
      {
        "id": "number",
        "name": "string",
        "imageUrl": "string",
        "ingredient1": "string",
        // ...ingredient2 to ingredient20...
        "measurement1": "string",
        // ...measurement2 to measurement20...
        "instructions": "string",
        "RegionId": "number",
        "UserId": "number",
        "createdAt": "string",
        "updatedAt": "string",
        "Region": {
          "id": "number",
          "name": "string"
        }
      },
      ...
    ]
  }
  ```

### GET /recipes/:id
**Description:**
- Get a recipe by ID.

**Response:**
- 200 OK:  
  ```json
  {
    "recipe": {
      "id": "number",
      "name": "string",
      "imageUrl": "string",
      "ingredient1": "string",
      // ...ingredient2 to ingredient20...
      "measurement1": "string",
      // ...measurement2 to measurement20...
      "instructions": "string",
      "RegionId": "number",
      "UserId": "number",
      "createdAt": "string",
      "updatedAt": "string",
      "Region": {
        "id": "number",
        "name": "string"
      }
    }
  }
  ```
- 404 Not Found:  
  ```json
  {
    "message": "Recipe not found"
  }
  ```

### GET /recipes/:id/generate
**Description:**
- Generate alternatives for recipe ingredients.

**Response:**
- 200 OK:  
  ```json
  [
    { "Ingredient": ["alternative1", "alternative2", "alternative3"] },
    ...
  ]
  ```
- 404 Not Found:  
  ```json
  {
    "message": "Recipe not found"
  }
  ```
- 503 Service Unavailable:  
  ```json
  {
    "message": "Service Unavailable"
  }
  ```
- 500 Internal Server Error:  
  ```json
  {
    "message": "Failed to parse generated content"
  }
  ```

### GET /my-recipes
**Description:**
- Get recipes created by the authenticated user.

**Query Parameters:**
- `q` (optional): Search query.
- `regionId` (optional): Filter by region ID.
- `page` (optional): Page number (default: 1).

**Response:**
- 200 OK:  
  ```json
  {
    "totalItems": "number",
    "totalPages": "number",
    "currentPage": "number",
    "recipes": [
      {
        "id": "number",
        "name": "string",
        "imageUrl": "string",
        "ingredient1": "string",
        // ...ingredient2 to ingredient20...
        "measurement1": "string",
        // ...measurement2 to measurement20...
        "instructions": "string",
        "RegionId": "number",
        "UserId": "number",
        "createdAt": "string",
        "updatedAt": "string",
        "Region": {
          "id": "number",
          "name": "string"
        }
      },
      ...
    ]
  }
  ```

### POST /recipes
**Description:**
- Create a new recipe.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string",
  "ingredient1": "string",
  // ...ingredient2 to ingredient20...
  "measurement1": "string",
  // ...measurement2 to measurement20...
  "instructions": "string",
  "RegionId": "number",
  "file": "binary"
}
```
**Response:**
- 201 Created:  
  ```json
  {
    "recipe": {
      "id": "number",
      "name": "string",
      "imageUrl": "string",
      "ingredient1": "string",
      // ...ingredient2 to ingredient20...
      "measurement1": "string",
      // ...measurement2 to measurement20...
      "instructions": "string",
      "RegionId": "number",
      "UserId": "number",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```
- 400 Bad Request:  
  ```json
  {
    "message": "Validation error message"
  }
  ```

### PUT /recipes/:id
**Description:**
- Update a recipe.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string",
  "ingredient1": "string",
  // ...ingredient2 to ingredient20...
  "measurement1": "string",
  // ...measurement2 to measurement20...
  "instructions": "string",
  "RegionId": "number",
  "file": "binary"
}
```
**Response:**
- 200 OK:  
  ```json
  {
    "recipe": {
      "id": "number",
      "name": "string",
      "imageUrl": "string",
      "ingredient1": "string",
      // ...ingredient2 to ingredient20...
      "measurement1": "string",
      // ...measurement2 to measurement20...
      "instructions": "string",
      "RegionId": "number",
      "UserId": "number",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```
- 403 Forbidden:  
  ```json
  {
    "message": "Forbidden"
  }
  ```
- 404 Not Found:  
  ```json
  {
    "message": "Recipe not found"
  }
  ```

### DELETE /recipes/:id
**Description:**
- Delete a recipe.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
- 200 OK:  
  ```json
  {
    "message": "Recipe '<name>' deleted successfully"
  }
  ```
- 403 Forbidden:  
  ```json
  {
    "message": "Forbidden"
  }
  ```
- 404 Not Found:  
  ```json
  {
    "message": "Recipe not found"
  }
  ```

---

## Regions

### GET /regions
**Description:**
- Get all regions.

**Response:**
- 200 OK:  
  ```json
  [
    { "id": "number", "name": "string" },
    ...
  ]
  ```

---

## Global Errors

### 401 Unauthorized
**Description:**
- The request requires user authentication.

**Response:**
```json
{
  "message": "Unauthorized"
}
```

### 500 Internal Server Error
**Description:**
- An unexpected error occurred on the server.

**Response:**
```json
{
  "message": "Internal Server Error"
}
```

