//imports react, link from react-router-dom and css being applied to it
/*import { Link } from 'react-router-dom';
import '../assets/Landpage.css';
import { useEffect, React } from 'react';

function LandPage() {
  useEffect(() => {
    // Fetch landing page content from the server
    fetch('/')
      .then((response) => response.text())
      .then((data) => setLandingPageContent(data))
      .catch((error) => console.error('Error fetching landing page:', error));
  }, []);
  //the return statement renders a landing page that is syled with css and can navigate to the login and signup components
  return (
    <div className="landing-page">

      <div className="content">
        <div className="title">
          <h1>Welcome to MechEx!</h1>
        </div>

        <div className="subtitle">
          <p>Your one-stop shop for connecting with mechanics in Nigeria.</p>
        </div>

        <div className="cta-buttons">
          <Link to="/login" className="cta-button">
            Login
          </Link>
          <Link to="/signup" className="cta-button">
            User Signup
          </Link>
          <Link to="/signups" className="cta-button">
            Mechanic SignUp
          </Link>
        </div>
      </div>

      <div className="testimonial">
        <div className="quote">
          "This platform helped me find the best mechanic in town. Highly recommended!"
          - Ifeoma Oki
        </div>

        <div className="quote">
          "This platform saved me thousands of naira by connecting me to the best mechanic in Lagos!"
          - Olisa Oka
        </div>

        <div className="quote">
          "This platform saved me so much time"
          - Bode Elliot
        </div>

      </div>

      <footer className="footer">
        &copy; 2023 MechEx. 19100111211
      </footer>
    </div>
  );
}

export default LandPage;
*/
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../assets/Landpage.css';

function LandPage() {
  /* const [landingPageContent, setLandingPageContent] = useState('');
 
   useEffect(() => {
     const fetchLandingPageContent = async () => {
   try {
     const response = await axios.get('https://your-heroku-app-url/api/landing-page'); // Update the endpoint
     setLandingPageContent(response.data);
   } catch (error) {
     console.error('Error fetching landing page content:', error);
   }
 };
 
 
     fetchLandingPageContent();
   }, []);*/

  return (
    <div className="landing-page">
      <div className="content">
        <div className="title">
          <h1>Welcome to MechEx!</h1>
        </div>

        <div className="subtitle">
          <p>Your one-stop shop for connecting with mechanics in Nigeria.</p>
        </div>

        <div className="cta-buttons">
          <Link to="/login" className="cta-button">
            Login
          </Link>
          <Link to="/signup" className="cta-button">
            User Signup
          </Link>
          <Link to="/signups" className="cta-button">
            Mechanic SignUp
          </Link>
        </div>
      </div>

      <div className="testimonial">
        <div className="quote">
          "This platform helped me find the best mechanic in town. Highly recommended!"
          - Ifeoma Oki
        </div>

        <div className="quote">
          "This platform saved me thousands of naira by connecting me to the best mechanic in Lagos!"
          - Olisa Oka
        </div>

        <div className="quote">
          "This platform saved me so much time"
          - Bode Elliot
        </div>

      </div>

      <footer className="footer">
        &copy; 2023 MechEx. 19100111211
      </footer>
    </div>
  );
}

export default LandPage;
