if (!Object.hasOwn) {
  Object.hasOwn = function (obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };
}
//requiring the necessary packages
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
//uuid4 is used to generate a unique key for our sessionIdentifier 
const { v4: uuidv4 } = require('uuid');
const { query, validationResult } = require('express-validator');

const app = express();

/* using helmet to establish content security policy,
referrer policy, frameguard, hsts, nosniff and xssfilter*/
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

const usersRoute = express.Router();
const reviews = express.Router();
const mechanicsRoute = express.Router();
const appointmentsRoute = express.Router();

/* Middleware is software that lies between an operating system and the applications running on it, and is used to manage network resources and other aspects of the system.*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', // Frontend origin
  credentials: true,              // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());
app.disable('x-powered-by');

//connection to database is setup 
const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mechex',
  password: 'chinelo',
  port: 5432,
});

pool.connect()
  .then(() => console.log('Connected to Postgres database'))
  .catch(err => console.error('Failed to connect to Postgres database', err.stack));

//api endpoint for landing page
app.get('/', (req, res) => {
  res.send('Landing Page');
});

//salt added to the password to make it more secure
const saltRounds = 10;
const sessionId = uuidv4();

//session configuration using express-session
app.use(session({
  name: 'secured-mechex-session',
  //sets the secret key for the session with sessionId generated using uuidv4
  secret: sessionId,
  resave: false,
  saveUninitialized: false,
  //sets cookie features like httpOnly, sameSite, secure and maxAge
  cookie: {
    httpOnly: true,
    sameSite: 'Strict',
    secure: false, //secure set to false as there is no ssl certificate available
    maxAge: 3600000, // Session expiration time
  },
}));

/**
When a user or mechanic logs in successfully, a unique session identifier is generated using uuidv4. 
The relevant user or mechanic ID is extracted from the query result, and the session data is stored in the sessions 
object using the session identifier as the key.

The /login endpoint then responds with the success status and the generated session identifier. 
This allows the client-side to store the session identifier in local storage.
 */
//defines post endpoints that handles login requests from the frontend
app.post('/login',
  //data validation of the email and password fields using express-validator
  [query('email').escape().trim().notEmpty().isEmail().withMessage('email is required'),
  query('password').escape().trim().notEmpty().withMessage('password is required')
  ], async (req, res) => {
    //email and password are extracted from the request sent from frontend
    const { email, password } = req.body;
    //validation errors are checked and if there are any the errors are returned in the console
    // const errors = validationResult(req); // extracts validation errors from request
    // if (!errors.isEmpty()) {  // Check if there are validation errors
    //   return res.status(400).json({ errors: errors.array() }); //returns valldation errors in an array
    // }
   
    try {
      // Query the customers table 
      const userQuery = 'SELECT * FROM public.users WHERE email = $1';
      const userResult = await pool.query(userQuery, [email]);

      if (userResult.rows.length > 0) {
        /*compares hashed password in the database with the password entered by the 
        user and puts results in a variable called match*/
        const match = await bcrypt.compare(password, userResult.rows[0].password);

        if (match) { //if the password matches let the code below be executed
          //if a user is found and they are a customer
          const user_id = userResult.rows[0].id;
          req.session.user_id = user_id; //stores user id in the session
          req.session.userType = 'customer'; //stores user type in session
          return res.json({ success: true, userType: 'customer', user_id: user_id, sessionId });
        }
      }

      //if the user isnt found in the users table the code gpes to check in the mechanic table using thr code below
      // Query the mechanics table
      const mechanicQuery = 'SELECT * FROM public.mechanics WHERE email = $1';
      const mechanicResult = await pool.query(mechanicQuery, [email]);

      if (mechanicResult.rows.length > 0) {
        /*compares hashed password in the database with the password entered by the 
        user and puts results in a variable called match*/
        const match = await bcrypt.compare(password, mechanicResult.rows[0].password);
        //if a user is found and they are a mechanic
        if (match) {
          const mechanic_id = mechanicResult.rows[0].id; // Extract mechanic ID from the query result
          req.session.mechanic_id = mechanic_id; // Store the mechanic ID in the session
          req.session.userType = 'mechanic'; // Store the user type in the session
          return res.json({ success: true, userType: 'mechanic', mechanic_id, sessionId });
        }

      }

      // if User not found in either table
      res.json({ success: false }, errors);
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ success: false, error: 'An error occurred during login' });
    }
  });

//handles logout  =
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Failed to log out');
    }
    res.clearCookie('secured-mechex-session'); // Clear the session cookie
    console.log('Session destroyed and cookie cleared');
    res.send('Logged out');
  });
});

// Session validation route to check the session on each request)
app.get('/session', (req, res) => {
  if (req.session.user_id) {
    res.json({ session: req.session });
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
});

/**<<-----USERS ROUTES------>>>> */
usersRoute.get('/', (req, res) => {
  //query database
  pool.query('SELECT * FROM public.users ORDER BY id ASC', (error, results) => {
    if (error) {
      console.log(Hello)
    } else {
      res.status(200).json(results.rows)
    }
  });
});

//this endpoint gets a user by their ID
usersRoute.get('/:id', (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('SELECT * FROM public.users WHERE id = $1', [id], (error, results) => {
    if (error) {
      console.log(error)
    } else {
      res.status(200).json(results.rows)
    }
  });

});

//this endpoint creates a new user 
usersRoute.post('/signup', [
  //data validation of the username, password, email and phone number fields using express-validator
  query('username').escape().trim().notEmpty().withMessage('username is required'),
  query('password').escape().trim().notEmpty().withMessage('password is required').isLength({ min: 6 }).withMessage('password must be at least 6 characters long'),
  query('email').escape().trim().notEmpty().isEmail().withMessage('email is required'),
  query('phone_no').isInt().escape().trim().notEmpty().isMobilePhone().withMessage('phone number is required'),
], (req, res) => {

  const { username, password, email, phone_no, user_type } = req.body
  console.log(username, password, email, phone_no, user_type);
  //adds function to hash a password into the hashedPassword variable, using the bcrypt.hashSync function
  //hashes the password gotten from the request body plus saltrounds and stores it in the database
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  pool.query('INSERT INTO public.users (username, password, email, phone_no, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING *', [username, hashedPassword, email, phone_no, user_type], (error, results) => {
    if (error) {
      console.log(error)
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    } else {
      res.status(201).send(`User added with ID: ${results.rows[0].id}`)
    }
  });
});

// this endpoint updates users information by their id
usersRoute.put('/:id', [
  //data validation of the username, password, email and phone number fields using express-validator
  query('username').escape().trim().notEmpty().withMessage('username is required'),
  query('password').escape().trim().notEmpty().withMessage('password is required').isLength({ min: 6 }).withMessage('password must be at least 6 characters long'),
  query('email').escape().trim().notEmpty().isEmail().withMessage('email is required'),
  query('phone_no').isInt().escape().trim().notEmpty().isMobilePhone().withMessage('phone number is required'),
], (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = parseInt(req.params.id)
  const { username, password, email, phone_no } = req.body

  pool.query(
    'UPDATE public.users SET username = $1, password = $2, email = $3, phone_no = $4  WHERE id = $5',
    [username, password, email, phone_no, id],
    (error, results) => {
      if (error) {
        console.log(error)
      }
      res.status(200).send(`User modified with ID: ${id}`)
    }
  );
});

// this endpoint deletes a user by their ID
usersRoute.delete('/:id', (req, res) => {

  const id = parseInt(req.params.id)

  pool.query('DELETE FROM public.users WHERE id = $1', [id], (error, results) => {
    if (error) {
      console.log(error)
    }
    res.status(200).send(`User deleted with ID: ${id}`)
  });
});

module.exports =
  usersRoute
  ;

// Add the users router to the app
app.use('/users', usersRoute);


/**<<-----REVIEWS ROUTES------>>>> */
reviews.post('/',
  [
    //data validation of the name and reviewText fields using express-validator
    query('name').trim().escape().not().isEmpty().withMessage('Name is required'),
    query('reviewText').trim().escape().not().isEmpty().withMessage('Review text is required')
  ],
  (req, res) => {
  
    const { mechanicId, name, reviewText } = req.body;

    pool.query('INSERT INTO public.reviews (mechanic_id, name, "reviewText") VALUES ($1, $2, $3) RETURNING *',
      [mechanicId, name, reviewText],
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: 'An error occurred while creating the review' });
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
        } else {
          res.status(201).json({ message: 'Review created successfully' });
        }
      }
    );
  });


// GETs all reviews for a specific mechanic
reviews.get('/mechanics/:mechanic_id', (req, res) => {
  const mechanic_id = parseInt(req.params.mechanic_id)

  pool.query(
    'SELECT * FROM public.reviews WHERE mechanic_id = $1',
    [mechanic_id],
    (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching the reviews', error });
      } else {
        res.status(200).json(result.rows);
      }
    }
  );
});

module.exports = reviews;

// Add the users router to the app
app.use('/reviews', reviews);

/**<<-----MECHANICS ROUTES------>>>> */
mechanicsRoute.get('/', (req, res) => {
  pool.query('SELECT * FROM public.mechanics ORDER BY id ASC', (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(200).json(results.rows);
    }
  });
});


//get mechanics by their city
mechanicsRoute.get('/:city', [
  //data validation of the city field using express-validator
  query('city').isString().escape()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const city = req.params.city
    console.log(city)

    pool.query('SELECT * FROM public.mechanics WHERE "city" LIKE $1', [`%${city}%`], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching mechanics' });
      } else {
        res.status(200).json(results.rows);
      }
    });


  });

//this endpoint gets a mechanic by their ID
mechanicsRoute.get('/:id', (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('SELECT * FROM public.mechanics WHERE id = $1', [id], (error, results) => {
    if (error) {
      console.log(error)
    } else {
      res.status(200).json(results.rows)
    }
  });

});

//this endpoint creates a new mechanic 
mechanicsRoute.post('/signups', [
  //data validation of the name, password, email, city address and phone number fields using express-validator
  query('name').escape().trim().notEmpty().withMessage('username is required'),
  query('phone').isInt().escape().trim().notEmpty().withMessage('phone number is required'),
  query('email').escape().trim().notEmpty().isEmail().withMessage('email is required'),
  query('address').escape().trim().notEmpty().withMessage('address is required'),
  query('city').escape().trim().notEmpty().withMessage('city is required'),
  query('password').escape().trim().notEmpty().withMessage('password is required').isLength({ min: 6 }).withMessage('password must be at least 6 characters long'),
], (req, res) => {

  const { name, phone, email, address, city, password, user_type } = req.body
  console.log(name, phone, email, address, password);
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  pool.query('INSERT INTO public.mechanics (name, phone, email, address, city, password, user_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [name, phone, email, address, city, hashedPassword, user_type], (error, results) => {
    if (error) {
      console.log(error)
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    } else {
      res.status(201).send(`Mechanic added with ID: ${results.rows[0].id}`)
    }
  });
});

// Updates a mechanic by ID
mechanicsRoute.put('/:id', [
  //data validation of the name, address, city, email and phone number fields using express-validator
  query('name').escape().trim().notEmpty().withMessage('username is required'),
  query('phone').isInt().escape().trim().notEmpty().isMobilePhone().withMessage('phone number is required'),
  query('email').escape().trim().notEmpty().isEmail().withMessage('email is required'),
  query('address').escape().trim().notEmpty().withMessage('address is required'),
  query('city').escape().trim().notEmpty().withMessage('city is required')],

  (req, res) => {
    const id = parseInt(req.params.id)
    const { name, phone, email, address, city, user_type } = req.body

    pool.query(
      'UPDATE public.mechanics SET name = $1, phone = $2, email = $3, address = $4, city = $5, password = $6, user_type = $7 WHERE id = $6',
      [name, phone, email, address, city, password, user_type, id],
      (error, results) => {
        if (error) {
          console.log(error)
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
        }
        res.status(200).send(`Mechanic modified with ID: ${results.rows[0].id}`)
      }
    );
  });

//Deletes a user by ID
mechanicsRoute.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('DELETE FROM public.mechanics WHERE id = $1', [id], (error, results) => {
    if (error) {
      console.log(error)
    }
    res.status(200).send(`Mechanic deleted with ID: ${results.id}`)
  });
});

module.exports = mechanicsRoute;

// Add the mechanic router to the app
app.use('/mechanics', mechanicsRoute);

/**<<-----APPPOINTMENTS ROUTES------>>>> */
appointmentsRoute.get('/', (req, res) => {
  pool.query('SELECT * FROM public.appointments ORDER BY id ASC', (error, results) => {
    if (error) {
      console.log(error)
    } else {
      res.status(200).json(results.rows)
    }
  });
});

//Get an appointment by ID from the database
appointmentsRoute.get('/:id', (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('SELECT * FROM public.appointments WHERE id = $1', [id], (error, results) => {
    if (error) {
      console.log(error)
    } else {
      res.status(200).json(results.rows)
    }
  });

});

//Creates a new appointment
appointmentsRoute.post('/', [
  //data validation of the vehicle make, vehicle model, vehicle year and vehicle description fields using express-validator
  query('vehicle_make').escape().trim().notEmpty().withMessage('Vehicle make is required'),
  query('vehicle_model').escape().trim().notEmpty().withMessage('Vehicle model is required'),
  query('vehicle_year').isInt().withMessage('Must be a number').isLength({ min: 4 }),
  query('vehicle_description').escape().trim().notEmpty().withMessage('Vehicle description is required')
], (req, res) => {
  const { user_id, mechanic_id, appointment_date, vehicle_make, vehicle_model, vehicle_year, vehicle_description } = req.body

  pool.query('INSERT INTO public.appointments (user_id, mechanic_id, appointment_date, vehicle_make, vehicle_model, vehicle_year, vehicle_description) VALUES ($1, $2, $3, $4, $5, $6, $7 ) RETURNING *', [user_id, mechanic_id, appointment_date, vehicle_make, vehicle_model, vehicle_year, vehicle_description], (error, results) => {
    if (error) {
      console.log(error)
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    } else if (!user_id) {
      return res.status(400).json({ error: 'Invalid userId' });
    } else {
      res.status(201).send(`Appoinmtent added with ID: ${results.rows[0].id}`)
    }
  });
});

//gets appointments based on the stored userid
appointmentsRoute.get('/user/:storedUserId', (req, res) => {
  const storedUserId = parseInt(req.params.storedUserId)
  pool.query('SELECT * FROM public.appointments WHERE "user_id" = $1', [storedUserId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred while fetching mechanics' });
    } else {
      res.status(200).json(results.rows);
    }
  });


});

//gets appointments based on the stored userid
appointmentsRoute.get('/mechanic/:storedMechanicId', (req, res) => {
  const storedMechanicId = parseInt(req.params.storedMechanicId)

  pool.query('SELECT * FROM public.appointments WHERE "mechanic_id" = $1', [storedMechanicId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred while fetching appointments' });
    } else {
      res.status(200).json(results.rows);
    }
  });


});

// API endpoint to update the appointment progress and notes in the database
appointmentsRoute.put('/:appointment_id', [
  //data validation of the status and notes fields using express-validator
  query('status').escape().trim().notEmpty().withMessage('Status is required'),
  query('notes').escape().trim().notEmpty().withMessage('Notes is required')
], (req, res) => {
  const appointment_id = parseInt(req.params.appointment_id);
  const { status, notes } = req.body;

  pool.query(
    'UPDATE public.appointments SET status = $1, notes = $2 WHERE id = $3',
    [status, notes, appointment_id],
    (error, results) => {
      if (error) {
        console.log(error);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        return res.status(500).json({ error: 'An error occurred while updating appointment progress' });
      }
      console.log('Received data:', { status, notes });
      res.status(200).json(`Mechanic modified with ID: ${appointment_id}`); //{ success: true, message: 'Appointment progress and notes updated successfully' }, 
    }
  );
});

//Update an appointment by ID
appointmentsRoute.put('/:id', [
  //data validation of the vehicle make, vehicle model, vehicle year and vehicle description fields using express-validator
  query('appointment_date').isDate().withMessage('Must be a date').notEmpty,
  query('vehicle_make').escape().trim().notEmpty().withMessage('Vehicle make is required'),
  query('vehicle_model').escape().trim().notEmpty().withMessage('Vehicle model is required'),
  query('vehicle_year').isInt().withMessage('Must be a number').isLength({ min: 4 }),
  query('vehicle_description').escape().trim().notEmpty().withMessage('Vehicle description is required')
], (req, res) => {
  const id = parseInt(req.params.id)
  const { appointment_date, vehicle_make, vehicle_model, vehicle_year, vehicle_description } = req.body

  pool.query(
    'UPDATE public.appointments SET appointment_date =$1 , vehicle_make = $2, vehicle_model = $3, vehicle_year = $4, vehicle_description = $5  WHERE id = $6',
    [appointment_date, vehicle_make, vehicle_model, vehicle_year, vehicle_description, id],
    (error, results) => {
      if (error) {
        console.log(error)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
      }
      res.status(200).send(`Mechanic modified with ID: ${results.rows[0].id}`)
    }
  );
});

// Deletes an appointment by ID
appointmentsRoute.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('DELETE FROM public.appointments WHERE id = $1', [id], (error, results) => {
    if (error) {
      console.log(error)
    }
    res.status(200).send(`appoinments deleted with ID: ${results.id}`)
  });
});

module.exports = appointmentsRoute;

// Add the appointments router to the app
app.use('/appointments', appointmentsRoute);

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

