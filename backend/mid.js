if (!Object.hasOwn) {
  Object.hasOwn = function (obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };
}

const express = require('express');
const helmet = require('helmet');
const app = express();
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
  },
}));
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
app.use(cookieParser());

app.get('/', (req, res) => {
const sessionIdentifier = uuidv4();
  // Set the cookie before sending the response
  //res.cookie("loggedin", true, { httpOnly: true, sameSite: 'Strict' });
  res.cookie('session', sessionIdentifier, { httpOnly: true, sameSite: 'Strict' });
  res.send('Hello World!');

  console.log(sessionIdentifier);
});

app.listen(3000, () => console.log('Server running on port 3000'));
