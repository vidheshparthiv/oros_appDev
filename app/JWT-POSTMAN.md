# JWT + RBAC Postman Quick Guide

Base URL: `http://localhost:8080`

1) Register a user

- POST `/auth/register`
- Body (JSON):

```
{
  "username": "alice",
  "password": "password",
  "role": "ADMIN" // or CUSTOMER, VENDOR
}
```

Response: `{ "token": "<jwt>" }`

2) Login

- POST `/auth/login`
- Body (JSON):

```
{
  "username": "alice",
  "password": "password"
}
```

Response: `{ "token": "<jwt>" }`

3) Use token

- Add header: `Authorization: Bearer <jwt>` to any protected request.


4) MySQL setup (local)

- Create a database for the app, for example using the `mysql` client:

```
mysql -u root -p -e "CREATE DATABASE oros_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

- Update `application.properties` with your MySQL username and password (the project uses `spring.datasource.url` shown there).

Notes:
- Tokens are signed using `jwt.secret` and expire after `jwt.expiration` ms.
- Roles are enforced via `ROLE_<ROLE_NAME>` authorities. Use `CUSTOMER`, `VENDOR`, or `ADMIN` when registering.
