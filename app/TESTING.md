# API Testing Guide

## Setup
- Start the backend from `app/`:
  ```bash
  cd app
  ./mvnw clean compile
  ./mvnw spring-boot:run
  ```
- Open Swagger UI at: `http://localhost:8080/swagger-ui/index.html`
- Base URL: `http://localhost:8080`
- Important: every protected endpoint (`/api/**`) requires a valid JWT in the `Authorization` header.
- If you get `401 Unauthorized` in Swagger, it usually means one of these is missing:
  - a valid `Authorization: Bearer <token>` header
  - a token from `/auth/login`
  - a fresh token after the previous one expired
  - a user whose role matches the endpoint requirement (`ADMIN`, `VENDOR`, or `CUSTOMER`)
- In Swagger, use the `Authorize` button at the top right and enter the token as: `Bearer <token>`

## Roles
- `CUSTOMER` — can search products and place orders
- `VENDOR` — can add/update/delete products and view products by vendor ID
- `ADMIN` — can manage users/vendors/products and view all orders

## Auth
### Register
Use the `AuthController` → `POST /auth/register` endpoint in Swagger.

Request body:
```json
{
  "username": "user1",
  "email": "user1@example.com",
  "password": "pass123",
  "role": "CUSTOMER"
}
```

Response:
```json
{
  "message": "registered successful"
}
```

### Login
Use the `AuthController` → `POST /auth/login` endpoint in Swagger.

Request body:
```json
{
  "username": "user1",
  "password": "pass123"
}
```

Response:
```json
{
  "token": "<jwt>"
}
```

Copy the returned token and paste it into Swagger’s `Authorize` dialog as `Bearer <token>`.

## Product endpoints
### Get all products
`GET /api/products`

### Get product by id
`GET /api/products/{id}`

### Add product
Use the `ProductController` → `POST /api/products` endpoint in Swagger.
- Role: `VENDOR`, `ADMIN`

Request body:
```json
{
  "name": "Keyboard",
  "description": "Mechanical keyboard",
  "price": 149.99,
  "stock": 20,
  "vendor": {
    "id": 2
  }
}
```

### Update product
Use `PUT /api/products/{id}`.
- Role: `VENDOR`, `ADMIN`

Request body:
```json
{
  "name": "Updated Keyboard",
  "description": "Mechanical keyboard updated",
  "price": 169.99,
  "stock": 15,
  "vendor": {
    "id": 2
  }
}
```

### Delete product
Use `DELETE /api/products/{id}`.
- Role: `VENDOR`, `ADMIN`

### Delete all products
Use `DELETE /api/products`.
- Role: `ADMIN`

### Get products by vendor
Use `GET /api/products/vendor/{vendorId}`.

## Vendor endpoints
### Get all vendors
`GET /api/vendors`
- Role: `VENDOR`, `ADMIN`

### Get vendor by id
`GET /api/vendors/{id}`
- Role: `VENDOR`, `ADMIN`

### Add vendor
Use the `VendorController` → `POST /api/vendors` endpoint in Swagger.
- Role: `ADMIN`

Request body:
```json
{
  "name": "ElectroHub"
}
```

### Update vendor
Use `PUT /api/vendors/{id}`.
- Role: `ADMIN`

Request body:
```json
{
  "name": "Updated ElectroHub"
}
```

### Delete vendor
Use `DELETE /api/vendors/{id}`.
- Role: `ADMIN`

### Delete all vendors
Use `DELETE /api/vendors`.
- Role: `ADMIN`

## Order endpoints
### Get all orders
`GET /api/orders`
- Role: `CUSTOMER`, `VENDOR`, `ADMIN`

### Get order by id
`GET /api/orders/{id}`
- Role: `CUSTOMER`, `VENDOR`, `ADMIN`

### Create order
Use the `OrderController` → `POST /api/orders` endpoint in Swagger.
- Role: `CUSTOMER`

Request body:
```json
{
  "customer": {
    "id": 2
  },
  "items": [
    {
      "product": {
        "id": 1
      },
      "quantity": 2,
      "unitPrice": 10.5
    }
  ],
  "status": "PENDING"
}
```

### Note about Swagger schema
The current `Vendor` model only contains `id` and `name`, so Swagger should not show a `products` array for vendor payloads. If you see one, it is likely from an older schema cached in the browser or from a stale Swagger UI session.

### Recommended tests
1. Register and login as `ADMIN`.
2. Create a vendor.
3. Register and login as `VENDOR`.
4. Create a product for the vendor.
5. Register and login as `CUSTOMER`.
6. Create an order.
7. Validate access:
   - `CUSTOMER` should not add vendor.
   - `CUSTOMER` should not delete products.
   - `VENDOR` should not delete all products.
   - `ADMIN` should access all vendor/product management.
