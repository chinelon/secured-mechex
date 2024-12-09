//imports components that will be embedded into the dashboard
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ViewApps from './ViewApps';
import Sidebar from '../Sidebar';
import axios from 'axios';

function Dashboards() {
    const sessionIdentifier = localStorage.getItem('session');
    const navigate = useNavigate()
    if (!sessionIdentifier) {
        // Session identifier is not present, redirect to login page
        navigate('/login')
    }

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
        <div className='dashboards'>
            <div className="sidebar">
            <button onClick={handleLogout}>Log Out</button>
                <Sidebar />
            </div>
            <div className="projects">
                <div>
                    <ViewApps />
                </div>
            </div>
        </div>
    );
}

export default Dashboards;