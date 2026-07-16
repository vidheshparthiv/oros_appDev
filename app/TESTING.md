# API Testing Guide

## Setup
- Start the backend from `app/`:
  ```bash
  cd app
  ./mvnw clean compile
  ./mvnw spring-boot:run
  ```
- Base URL: `http://localhost:8080`
- Headers for protected endpoints:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`

## Roles
- `CUSTOMER` — can search products and place orders
- `VENDOR` — can add/update/delete products and view products by vendor ID
- `ADMIN` — can manage users/vendors/products and view all orders

## Auth
### Register
`POST /auth/register`

Request body:
```json
{
  "username": "user1",
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
`POST /auth/login`

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

## Product endpoints
### Get all products
`GET /api/products`

### Get product by id
`GET /api/products/{id}`

### Add product
`POST /api/products`
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
`PUT /api/products/{id}`
- Role: `VENDOR`, `ADMIN`

### Delete product
`DELETE /api/products/{id}`
- Role: `VENDOR`, `ADMIN`

### Delete all products
`DELETE /api/products`
- Role: `ADMIN`

### Get products by vendor
`GET /api/products/vendor/{vendorId}`

## Vendor endpoints
### Get all vendors
`GET /api/vendors`
- Role: `VENDOR`, `ADMIN`

### Get vendor by id
`GET /api/vendors/{id}`
- Role: `VENDOR`, `ADMIN`

### Add vendor
`POST /api/vendors`
- Role: `ADMIN`

Request body:
```json
{
  "name": "ElectroHub"
}
```

### Update vendor
`PUT /api/vendors/{id}`
- Role: `ADMIN`

### Delete vendor
`DELETE /api/vendors/{id}`
- Role: `ADMIN`

### Delete all vendors
`DELETE /api/vendors`
- Role: `ADMIN`

## Order endpoints
### Get all orders
`GET /api/orders`
- Role: `CUSTOMER`, `VENDOR`, `ADMIN`

### Get order by id
`GET /api/orders/{id}`
- Role: `CUSTOMER`, `VENDOR`, `ADMIN`

### Create order
`POST /api/orders`
- Role: `CUSTOMER`

Request body:
```json
{
  "customer": {
    "id": 2
  },
  "totalPrice": 1049.98,
  "status": "PENDING"
}
```

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
