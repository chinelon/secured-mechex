//this will allow users and mechanics to log in
//import React from "react";
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import '/Users/laurennwobbi/secured-mechex/secured-mechex/mechex-frontend/src/assets/Booking.css';

//function login gets a prop (onLogin) that has been passed to it from app.jsx
 function Login({ onLogin }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const [csrfToken, setCsrfToken] = useState('');
  
  // useEffect(() => {
  //   // Fetch the CSRF token from the cookies
  //   const token = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN')).split('=')[1];
  //   setCsrfToken(token);
  // }, []);

  //defines a variable 'navigate' and puts the react-router-dom function 'useNavigate' inside
  const navigate = useNavigate();

  //function handleSubmit handles when the form rendered in the return stateent below is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if login was successful
    try {
      /** line 26-28 tries to log users in by making a POST request to the 'http://localhost:5001/login' endpoint using the provided email and password values.
      Logs the response data to the console.
      Destructures properties from the response data into variables: success, userType, sessionIdentifier, mechanic_id, and user_id */
      const response = await axios.post('http://localhost:5001/login', { email, password}, { withCredentials: true });
      console.log(response.data);
      const {success, userType, sessionId, mechanic_id, user_id } = response.data;

      if (success) {
        // Store the session identifier/token in local storage
       // localStorage.setItem('session', sessionIdentifier);
        /* Call the onLogin prop with the session identifier, user_id and mechanic_id and log it to check if they are there 
        (alternatively you can check in the storage part of your browser)*/
        onLogin(sessionId, user_id, mechanic_id);
        console.log(user_id)
        console.log(mechanic_id)
        // if Login successful, redirect to the appropriate page
        /**line 38-43 is a conditional statement that redirects users to different dashboards based on their usertype(customer/mechanic ) */
        if (userType === 'customer') {
          // Redirect to customer page
          navigate('/dashboard');
        } else if (userType === 'mechanic') {
          // Redirect to mechanic page
          navigate('/dashboards');
        }
      } else {
        // Login failed
        alert ("Login failed, Please check credentials and try again");
  
        //resets state variables to null
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Handle error
    }
  };

  return (
    //the return statement renders a form for the login with input for email and password <form> calls the handleSubmit function to submit the form
    <div className="form-columnss">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
      <input type="hidden" name="_csrf" value="{{csrfToken}}"/>
        <div>
          <label htmlFor="email">     Email:</label>
          <input
            type="email"
            id="email"
            placeholder='chinelo@yahoo.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder='******'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className ="submits-button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;