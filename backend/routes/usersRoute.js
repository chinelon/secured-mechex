//requiring the necessary packages 
/*const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

// Define routes for the users resource
const usersRoute = express.Router();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Set up a connection to databasee:
const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mechex',
    password: 'chinelo',
    port: 5432,
});
//if database is connected exeecute line 24 or else execute line 25
pool.connect()
    .then(() => console.log('Connected to Postgres database'))
    .catch(err => console.error('Failed to connect to Postgres database', err.stack));

//API Endpoints
//this endpoint gets all users from the database


/*const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});*/
