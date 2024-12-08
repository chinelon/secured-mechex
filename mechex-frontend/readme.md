# Mechex Frontend

## Features and Security Objectives

### Major Functionalities
- **User Registration**: Allows users to create an account.
- **Login**: Secure user authentication.
- **Booking Appointments**: Enables users to book appointments with chosen mechanics.
- **Reviews**: Allows users to leave reviews about mechanics
- **Follow-Ups**: Allows mechanics make updates on the progress of appointments
- **Track Progress**: Allows users view updates on their vehicles


## Project Structure

```
mechex-frontend/
├── public/
│   ├── index.html
│   └── ...
├── node_modules/
    └── ...
├── src/
│   ├── components/
        ├──mechanics/
        ├──customers/
│       └── ...
│   ├── assets/
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
├── package.json
└── README.md
```

- **public/**: Contains static files like `index.html`.
- **src/**: Contains the main source code.
    - **components/**: Reusable UI components.
        - **About**: About page.
        - **Login**: Users login page.
        - **Customers/**: Customers components containing:
            - **BookApp**: For booking new appointments.
            - **Dashboard**: Users dashboard for viewing appointments and progress of appointments.
            - **Signup**: Seperate signup page for users.
            - **TrackProg**: View progress on vehicles.
            - **ViewApp**: For viewing appointments.
            - **ViewMech**: For viewing and making reviews on mechanics.
        - **Mechanics/**: Mechanics components containing:
            - **Dashboard**: Mechanics dashboard for viewing appointments and updating progress of appointments.
            - **FollowUp**: For making upodates on appointments.
            - **ViewApps**: For viewing appointments.
            - **Signups**: Seperate signup page for mechanics.
    - **App.js**: Main application component.
    - **index.js**: Entry point of the application.
- **package.json**: Lists dependencies and scripts.
- **README.md**: Project documentation.

## Setup and Installation Instructions

1. **Clone the repository**:
     ```sh
     git clone https://github.com/yourusername/mechex-frontend.git
     cd mechex-frontend
     ```

2. **Install dependencies**:
     ```sh
     npm install
     ```

3. **Run the application**:
     ```sh
     npm run dev
     ```

## Usage Guidelines

- **Register**: Navigate to the registration page and fill in the required details.
- **Login**: Use your credentials to log in.
- **Booking appointments**: Navigate to book appointments tab and book a new appointment.

### Security Improvements
- **Password Strength Bar**: Used to show the strength of a password.
- **Password Requirements**: Strenghtens password policies by making certain characteristics of a password a requirement.

    ```sh
        <PasswordChecklist
                                    rules={["minLength", "specialChar", "number", "capital"]}
                                    minLength={10}
                                    value={password}
                                    messages={{
                                        minLength: "Password must be 10 characters",
                                        specialChar: "Must have a special character.",
                                        number: "Password must contain a number.",
                                        capital: "Must have a captal letter.",
                                    }}
                                />
                                <PasswordStrengthBar password={password} />
    ```
- **Data Sanitisation**: Ensured all user inputs are sanitized.
    ```sh
            <div>{DOMPurify.sanitize(ChangeDate(appointment.appointment_date))}</div>
            <div>Vehicle Make: {DOMPurify.sanitize(appointment.vehicle_make)}</div>
            <div>Vehicle Model: {DOMPurify.sanitize(appointment.vehicle_model)}</div>
            <div>Description: {DOMPurify.sanitize(appointment.vehicle_description)
    ```