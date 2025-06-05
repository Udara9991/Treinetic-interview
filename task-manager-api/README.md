# Task Manager API

## 1. Overview

This project is the backend API for a Task Manager application. It's built using Spring Boot and provides RESTful endpoints for managing tasks (Create, Read, Update, Delete). User authentication is handled using JWT (JSON Web Tokens). Tasks are stored in a MongoDB database.

## 2. Prerequisites

*   Java Development Kit (JDK) - Version 17 or later (as specified in `pom.xml`)
*   Apache Maven - Version 3.6.x or later
*   MongoDB - Running instance (e.g., locally on port 27017 or a cloud instance)

## 3. Setup and Running the Backend

### 3.1. Database Configuration

1.  **Ensure MongoDB is running.**
2.  The application connects to MongoDB using the URI specified in `src/main/resources/application.properties`:
    ```properties
    spring.data.mongodb.uri=mongodb://localhost:27017/taskmanagerdb
    ```
    -   By default, it connects to a database named `taskmanagerdb` on `localhost:27017`.
    -   If your MongoDB instance is different, update this URI accordingly.
    -   The database and collections (`tasks`, `users`) will be created automatically by Spring Data MongoDB when the application starts and interacts with them if they don't already exist.

### 3.2. JWT Secret Configuration (Important Security Note)

The application uses a JWT secret key for signing tokens. This is configured in `src/main/resources/application.properties`:
```properties
taskmanager.app.jwtSecret=DefaultSecretKeyMustBeChangedAndAtLeast32BytesLongForHS256SecurityOtherwiseAppWillUseADynamicOne!
taskmanager.app.jwtExpirationMs=86400000
```
**For production or any real deployment, you MUST change `taskmanager.app.jwtSecret` to a strong, unique, and random secret key (at least 32 bytes long for HS256).** The application will log a warning if a weak or default key is used.

### 3.3. Build the Application

Navigate to the root directory of the `task-manager-api` project in your terminal and run:
```bash
mvn clean install
```
This command will compile the code, run tests, and package the application into a JAR file in the `target/` directory (e.g., `task-manager-api-0.0.1-SNAPSHOT.jar`).

### 3.4. Run the Application

Once the build is successful, you can run the application using:
```bash
java -jar target/task-manager-api-0.0.1-SNAPSHOT.jar
```
(Replace the JAR filename if it's different).
The backend API should now be running, typically on `http://localhost:8080` (default Spring Boot port).

## 4. API Endpoints

The API is rooted at `/api`.

### 4.1. Authentication Endpoints (`/api/auth`)

*   **`POST /api/auth/signup`**: Register a new user.
    *   Request Body: `SignUpDto`
        ```json
        {
            "username": "testuser",
            "password": "password123"
        }
        ```
    *   Response: Success message or error if username exists.
*   **`POST /api/auth/login`**: Authenticate an existing user and get a JWT.
    *   Request Body: `LoginDto`
        ```json
        {
            "username": "testuser",
            "password": "password123"
        }
        ```
    *   Response: `JwtResponseDto` (contains token, user ID, username)
        ```json
        {
            "token": "eyJhbGciOiJIUzI1NiJ9...",
            "type": "Bearer",
            "id": "60f7e3b3e4b0e3f3e8a3e3e3",
            "username": "testuser"
        }
        ```

### 4.2. Task Endpoints (`/api/tasks`)

These endpoints require authentication. The JWT obtained from login must be included in the `Authorization` header as a Bearer token (e.g., `Authorization: Bearer <your_jwt_token>`).

*   **`GET /api/tasks`**: Get all tasks for the authenticated user (Note: current implementation returns all tasks, not user-specific yet unless modified).
*   **`POST /api/tasks`**: Create a new task.
    *   Request Body: `TaskDto` (id and createdAt are ignored/set by backend)
        ```json
        {
            "title": "My New Task Title",
            "description": "Details about the task",
            "status": "TO_DO"
        }
        ```
*   **`GET /api/tasks/{id}`**: Get a specific task by its ID.
*   **`PUT /api/tasks/{id}`**: Update an existing task by its ID.
    *   Request Body: `TaskDto`
*   **`DELETE /api/tasks/{id}`**: Delete a task by its ID.

*(Note: The `TaskDto` structure includes `id`, `title`, `description`, `status`, `createdAt`.)*

## 5. User Credentials

*   **Registration**: New users can be created via the `/api/auth/signup` endpoint.
*   **Sample User**: There are no pre-loaded sample users. You need to register a user first to obtain a JWT for accessing protected task endpoints.

---
This README provides basic instructions. Further details about specific DTOs or advanced configurations can be found within the source code and Spring Boot documentation.
