//imports components that will be embedded into the dashboard
//import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import ViewApp from './ViewApp';
import TrackProg from './TrackProg'
import axios from 'axios';

const Dashboard = () => {
    const sessionIdentifier = localStorage.getItem('session');
    const navigate = useNavigate()
    if (!sessionIdentifier) {
        // Session identifier is not present, redirect to login page
        navigate('/login')
    }

    //login function used to logout users
    const handleLogout = async () => {
        try {
            // Send a POST request to the logout endpoint
            await axios.post('http://localhost:5001/logout', { sessionIdentifier }, { withCredentials: true });
            // Clear the session from state and local storage
            localStorage.removeItem('id', 'mid');
            navigate('/login');
            alert('You are now logged out')
        } catch (error) {
            console.error('Error during logout:', error);
            alert('An error occurred, please try again');
        }
    };

    /** the imported components are rendered in the dashboard which takes on the form of a parent component */
    return (
        <div className='dashboard'>
            <div className="sidebar">
                <button onClick={handleLogout}>Logout </button>

                <div>
                    <Sidebar />
                </div>
            </div>
            <div className="projects">
                <div>
                    <ViewApp />
                </div>
            </div>
            <div className="track">
                <div>
                    <TrackProg />
                </div>
            </div>
        </div>
    );
}


export default Dashboard;