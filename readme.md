# Mechex
Mechex is a comprehensive platform designed to connect users with mechanics for vehicle maintenance and repair services. The project consists of a frontend and a backend, providing a seamless user experience and robust API services.

## Overview

### Frontend
The frontend is built using modern web technologies and frameworks to provide an intuitive and responsive user interface. It allows users to:

- Sign up and log in.
- Search for mechanics by city.
- Book appointments with mechanics.
- Leave reviews for mechanics.

### Backend
The backend is built using Node.js, Express, and PostgreSQL. It provides APIs for user authentication, managing mechanics, appointments, and reviews. Key features include:

- User Authentication: Secure login and signup processes with hashed passwords.
- Mechanic Management: CRUD operations for mechanics.
- Appointment Management: CRUD operations for appointments.
- Review Management: CRUD operations for reviews.

## Project Structure

```
secured-mechex/
├── mechex-frontend/
└── backend
```

### Testing
SAST Testing was done using Bearer Scan, the project folder was scanned using bearer scan secured-mechex and a report was generated from it, following that a summary table of results was created and can be found in the Appendix. For functional testing was carried out by testing specific functions of the project in which all tests were passed.

Check readme files in backend and mechex frontend folders for more information