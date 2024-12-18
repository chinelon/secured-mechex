# Secured MechEx Backend

This is the backend for the Mechex project, which provides APIs for user authentication, managing mechanics, appointments, and reviews. The backend is built using Node.js, Express, and PostgreSQL.

## Prerequisites

- Node.js
- npm
- PostgreSQL

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/chinelon/secured-mechex.git
    ```
2. Navigate to the backend directory:
    ```sh
    cd secured-mechex/backend
    ```
3. Install dependencies:
    ```sh
    npm install
    ```
  
## Running the Application

1. Start the backend server:
    ```sh
    node index.js
    ```
    or
    ```sh
    nodemon index.js
    ````

# API Endpoints

## User Routes

1. GET /users: Get all users.
2. GET /users/:id: Get a user by ID.
3. POST /users/signup: Create a new user.
4. PUT /users/:id: Update a user by ID.
5. DELETE /users/:id: Delete a user by ID.

## Mechanic Routes

1. GET /mechanics: Get all mechanics.
2. GET /mechanics/:city: Get mechanics by city.
3. GET /mechanics/:id: Get a mechanic by ID.
4. POST /mechanics/signups: Create a new mechanic.
5. PUT /mechanics/:id: Update a mechanic by ID.
6. DELETE /mechanics/:id: Delete a mechanic by ID.

## Appointment Routes
1. GET /appointments: Get all appointments.
2. GET /appointments/:id: Get an appointment by ID.
3. POST /appointments: Create a new appointment.
4. PUT /appointments/:id: Update an appointment by ID.
5. DELETE /appointments/:id: Delete an appointment by ID.

## Review Routes
1. POST /reviews: Create a new review.
2. GET /reviews/mechanics/:mechanic_id: Get all reviews for a specific mechanic.

# Middleware

1. Helmet: For security headers.
2. CORS: For handling Cross-Origin Resource Sharing.
3. Body-Parser: For parsing request bodies.
4. Cookie-Parser: For parsing cookies.
5. Express-Session: For managing sessions.

# Security Improvements
1. Helmet Middleware: Used to set various HTTP headers for security purposes.
    ```sh 
        app.use(helmet());
        app.use(
        helmet({
            contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: [],
            },
            },
            referrerPolicy: { policy: 'no-referrer' },
            frameguard: { action: 'deny' },
            noSniff: true,
            xssFilter: true,
        })
        );
    ```

2. CORS Middleware: Used to allow requests from the frontend origin and allow credentials to be sent.
    ```sh
        app.use(cors({
        origin: 'http://localhost:5173', 
        credentials: true,              
        }));
    ```

3. Express-session: For secure session management.

    ```sh
        app.use(session({
        name: 'secured-mechex-session',
        secret: sessionId,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: 'Strict',
            secure: false, // Set to true if using HTTPS
            maxAge: 3600000, // Session expiration time
        },
        }));
    ```

4. Password Hashing: passwords are hashed and stored in the database and comapared against passwords at login.

    ```sh
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    
    const match = await bcrypt.compare(password, userResult.rows[0].password);

    ```
# Database
The backend uses PostgreSQL as the database. Ensure that you have PostgreSQL installed and running. 