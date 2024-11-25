//imports components that will be embedded into the dashboard
//import React from 'react';
import { useNavigate } from 'react-router-dom';
import ViewApps from './ViewApps';
import Sidebar from '../Sidebar';

function Dashboards() {
    const sessionIdentifier = localStorage.getItem('session');
    const navigate = useNavigate()
    if (!sessionIdentifier) {
        // Session identifier is not present, redirect to login page
        navigate('/login')
    }
/** the imported components are rendered in the dashboard which takes on the form of a parent component */
    return (
        <div className='dashboards'>
            <div className="sidebar">
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