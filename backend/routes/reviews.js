//requiring the necessary packages at the top of your file:
/*const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

// Define routes for the reviews resource
const reviews = express.Router();
//fixes the error '[Error] Origin http://127.0.0.1:5173 is not allowed by Access-Control-Allow-Origin. Status code: 200'
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Set up a connection to database
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



//this endpoint creates a new review


/*const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});*/
