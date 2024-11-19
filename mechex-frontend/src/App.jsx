/*import statements for all coomponents needed to satisfy project and for react-router-dom which 
is used for navigation through components here amongst other things*/
import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './index.css';
import BookApp from './components/customers/BookApp';
import ViewApp from './components/customers/ViewApp';
import TrackProg from './components/customers/TrackProg';
import Navbar from './components/NavBar';
import Dashboard from './components/customers/Dashboard';
import About from './components/About';
import ContactUs from './components/ContactUs';
import LandPage from './components/LandPage';
import Signup from './components/customers/Signup';
import Signups from './components/mechanics/Signups';
import Login from './components/Login';
import Dashboards from './components/mechanics/Dashboards';
import FollowUp from './components/mechanics/FollowUp';
import ViewApps from './components/mechanics/ViewApps';
import Map from './components/customers/Map';
import {withGoogleMaps} from 'react-google-maps'
import ViewMech from './components/customers/ViewMech';

//defines session context
export const SessionContext = createContext();

function App() {
  const [appointments, setAppointments] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [users, setUsers] = useState([]);
  const [progress, setProgress] = useState([]);
  const [session, setSession] = useState(null);
  const [user_id, setUser_Id] = useState()
  const [mechanic_id, setMechanic_Id] = useState()

  /* The useEffect hook is used to perform side effects in a functional component. It accepts two arguments, 
  is executed only once when the component is mounted. 
  It checks if there is a 'session' key stored in the browser's local storage. 
  If a session is found, it updates the state using the setSession function with the stored session value.*/
  useEffect(() => {
    // Check if there is a session stored in local storage
    const storedSession = localStorage.getItem('session');
    if (storedSession) {
      setSession((storedSession));// if there is a stored session it updates the state with the stored session value
    }
  }, []);

  //handles the login event
  const handleLogin = (sessionIdentifier, user_id, mechanic_id) => {
    setSession(sessionIdentifier);// Sets the sessionIdentifier generated and passed from the backend in the setSession state
    /**line 53-57 stores sessionIdentifier, user_id and mechanic_id in the localstorage of the browser when a user logs in.
     * setMechanic_id and and setUser_Id are set with the user or mechanic id used to log in
     */
    localStorage.setItem('session', sessionIdentifier);
    localStorage.setItem('id', user_id);
    localStorage.setItem('mid', mechanic_id)
    setMechanic_Id(mechanic_id);
    setUser_Id(user_id); // Set the user_id in the state
    console.log(user_id)
  };
//login function used to logout users
  const handleLogout = () => {
    alert('You are now logged out')
    const navigate = useNavigate();
    // Perform logout logic
    // ...

    // Clear the session from state and local storage
    setSession(null);
    localStorage.removeItem('session');
    navigate('/login');
  };
  
/** line 67-72 defines a function called protected route. this function checks if there is a session in progress. if there is no session in progress 
 * users are navigated back to the login page and required to login before they can access that path, if there is no session in progress users continue 
 * that path
 */
  const ProtectedRoute = ({ path, element }) => {
    if (!session) {
      return <Navigate to="/login" />;
    }
    return <Routes> <Route path={path} element={element} /> </Routes>
  };
/** The return statement below renders the navigation bar, defines the routes to each component and calls the predefined protectedroute function to apply
 * the conditonal statement on those routes
 */
  return (
    <SessionContext.Provider value={{ session, handleLogout }}>
      <Router>
        <div className="App">
          <Navbar />
          
          <Routes>
            <Route path="/" element={<LandPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signups" element={<Signups />} />
            <Route path="/map" element={<Map />} />


            <Route path="/dashboard/*" element={<ProtectedRoute path="/" element={<Dashboard />} />} />
            <Route path="/dashboards/*" element={<ProtectedRoute path="/" element={<Dashboards />} />} />
            <Route path="/booking/*" element={<ProtectedRoute path="/" element={<BookApp user_id={user_id} />} />} />
            <Route path="/appointments/*" element={<ProtectedRoute path="/" element={<ViewApp />} />} />
            <Route path="/appointment/*" element={<ProtectedRoute path="/" element={<ViewApps />} />} />
            <Route path="/progress/*" element={<ProtectedRoute path="/" element={<TrackProg />} />} />
            <Route path="/follow-up/:appointment_id/*" element={<ProtectedRoute path="/" element={<FollowUp />} />} />
            <Route path="/mechanics/:mechanicId/*" element={<ProtectedRoute path="/" element={<ViewMech />} />} />


            
          </Routes>
        </div>
      </Router>
    </SessionContext.Provider>
  );
}

export default App;
