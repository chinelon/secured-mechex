//requiring the necessary packages
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const cors = require('cors');
//uuid4 is used to generate a unique key for our sessionIdentifier 
const { v4: uuidv4 } = require('uuid');
const { query, validationResult } = require('express-validator');

//importing routers in index.js
/*const usersRoute = require('./routes/usersRoute');
app.use('/api/users', usersRoute);

const mechanicsRoute = require('./routes/mechanicsRoute');
app.use('/api/mechanics', mechanicsRoute);

const appointmentsRoute = require('./routes/appointmentsRoute');
app.use('/api/appointments', appointmentsRoute);

const reviews = require('./routes/reviews');
app.use('/api/reviews', reviews);*/


const usersRoute = express.Router();
const reviews = express.Router();
const mechanicsRoute = express.Router();
const appointmentsRoute = express.Router();

/* Middleware is software that lies between an operating system and the applications running on it, and is used to manage network resources and other aspects of the system.*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

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

/**
When a user or mechanic logs in successfully, a unique session identifier is generated using uuidv4. 
The relevant user or mechanic ID is extracted from the query result, and the session data is stored in the sessions 
object using the session identifier as the key.

The /login endpoint then responds with the success status and the generated session identifier. 
This allows the client-side to store the session identifier in local storage.
 */

// empty object used to store session data when a user logs in
const sessions = {};

//defines post endpoints that handles login requests from the frontend
app.post('/login',
  [query('email').escape().trim().notEmpty().isEmail().withMessage('email is required'),
  query('password').escape().trim().notEmpty().withMessage('password is required')
  ], async (req, res) => {
    //email and password are extracted from the request sent from frontend
    const { email, password } = req.body;

    try {
      // Query the customers table 
      const userQuery = 'SELECT * FROM public.users WHERE email = $1 AND password = $2';
      const userResult = await pool.query(userQuery, [email, password]);

      if (userResult.rows.length > 0) {
        //if a user is found and they are a customer

        const sessionIdentifier = uuidv4(); // Generate session identifier
        const user_id = userResult.rows[0].id; // Extract user ID from the query result

        // Store the session data
        sessions[sessionIdentifier] = {
          user_id,
          userType: 'customer',
        };

        //json response is sent back to the client with the success status, session identifier, user type, and user ID.
        res.json({ success: true, sessionIdentifier, userType: 'customer', user_id });
        return;
      }

      //if the user isnt found in the users table the code gpes to check in the mechanic table using thr code below
      // Query the mechanics table
      const mechanicQuery = 'SELECT * FROM public.mechanics WHERE email = $1 AND password = $2';
      const mechanicResult = await pool.query(mechanicQuery, [email, password]);

      if (mechanicResult.rows.length > 0) {
        //if a user is found and they are a mechanic

        const sessionIdentifier = uuidv4(); // Generate session identifier
        const mechanic_id = mechanicResult.rows[0].id; // Extract mechanic ID from the query result

        // Store the session data
        sessions[sessionIdentifier] = {
          mechanic_id,
          userType: 'mechanic',
        };

        //json response is sent back to the client with the success status, session identifier, user type, and mechanic ID.
        res.json({ success: true, sessionIdentifier, userType: 'mechanic', mechanic_id });
        return;
      }

      // if User not found in either table
      res.json({ success: false });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ success: false, error: 'An error occurred during login' });
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
  query('username').escape().trim().notEmpty().withMessage('username is required'),
  query('password').escape().trim().notEmpty().withMessage('password is required').isLength({ min: 6 }).withMessage('password must be at least 6 characters long'),
  query('email').escape().trim().notEmpty().isEmail().withMessage('email is required'),
  query('phone_no').isInt().escape().trim().notEmpty().isMobilePhone().withMessage('phone number is required'),
], (req, res) => {
  const { username, password, email, phone_no, user_type } = req.body
  console.log(username, password, email, phone_no, user_type);

  pool.query('INSERT INTO public.users (username, password, email, phone_no, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING *', [username, password, email, phone_no, user_type], (error, results) => {
    if (error) {
      console.log(error)
    } else {
      res.status(201).send(`User added with ID: ${results.rows[0].id}`)
    }
  });
});

// this endpoint updates users information by their id
usersRoute.put('/:id', [
  query('username').escape().trim().notEmpty().withMessage('username is required'),
  query('password').escape().trim().notEmpty().withMessage('password is required').isLength({ min: 6 }).withMessage('password must be at least 6 characters long'),
  query('email').escape().trim().notEmpty().isEmail().withMessage('email is required'),
  query('phone_no').isInt().escape().trim().notEmpty().isMobilePhone().withMessage('phone number is required'),
], (req, res) => {

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
    query('mechanicId').isInt().withMessage('Mechanic ID must be an integer'),
    query('name').trim().escape().not().isEmpty().withMessage('Name is required'),
    query('reviewText').trim().escape().not().isEmpty().withMessage('Review text is required')
  ],
  (req, res) => {
    const { mechanicId, name, reviewText } = req.body;

    pool.query('INSERT INTO public.reviews (mechanic_id, name, reviewText) VALUES ($1, $2, $3) RETURNING *',
      [mechanicId, name, reviewText],
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: 'An error occurred while creating the review' });
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
mechanicsRoute.get('/:city', [query('city').isString().escape()], (req, res) => {
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
mechanicsRoute.post('/signups',[
  query('name').escape().trim().notEmpty().withMessage('username is required'),  
  query('phone').isInt().escape().trim().notEmpty().isMobilePhone().withMessage('phone number is required'),
  query('email').escape().trim().notEmpty().isEmail().withMessage('email is required'),
  query('address').escape().trim().notEmpty().withMessage('address is required'),
  query('city').escape().trim().notEmpty().withMessage('city is required'),
  query('password').escape().trim().notEmpty().withMessage('password is required').isLength({ min: 6 }).withMessage('password must be at least 6 characters long'),
], (req, res) => {

  const { name, phone, email, address, city, password, user_type } = req.body
  console.log(name, phone, email, address, password);

  pool.query('INSERT INTO public.mechanics (name, phone, email, address, city, password, user_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [name, phone, email, address, city, password, user_type], (error, results) => {
    if (error) {
      console.log(error)
    } else {
      res.status(201).send(`Mechanic added with ID: ${results.rows[0].id}`)
    }
  });
});

// Updates a mechanic by ID
mechanicsRoute.put('/:id', [
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

//Creatse a new appointment
appointmentsRoute.post('/', [
  query('user_id').isInt().withMessage('Must be a number').notEmpty,
  query('mechanic_id').isInt().withMessage('Must be a number').notEmpty,
  query('appointment_date').isDate().withMessage('Must be a date').notEmpty,
  query('vehicle_make').escape().trim().notEmpty().withMessage('Vehicle make is required'),
  query('vehicle_model').escape().trim().notEmpty().withMessage('Vehicle model is required'),
  query('vehicle_year').isInt().withMessage('Must be a number').isLength({ min: 4 }),
  query('vehicle_description').escape().trim().notEmpty().withMessage('Vehicle description is required')
], (req, res) => {
  const { user_id, mechanic_id, appointment_date, vehicle_make, vehicle_model, vehicle_year, vehicle_description } = req.body

  pool.query('INSERT INTO public.appointments (user_id, mechanic_id, appointment_date, vehicle_make, vehicle_model, vehicle_year, vehicle_description) VALUES ($1, $2, $3, $4, $5, $6, $7 ) RETURNING *', [user_id, mechanic_id, appointment_date, vehicle_make, vehicle_model, vehicle_year, vehicle_description], (error, results) => {
    if (error) {
      console.log(error)

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
        return res.status(500).json({ error: 'An error occurred while updating appointment progress' });
      }
      console.log('Received data:', { status, notes });
      res.status(200).json(`Mechanic modified with ID: ${appointment_id}`); //{ success: true, message: 'Appointment progress and notes updated successfully' }, 
    }
  );
});

//Update an appointment by ID
appointmentsRoute.put('/:id',[
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

