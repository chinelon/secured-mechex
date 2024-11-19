import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InsightsSharpIcon from '@mui/icons-material/InsightsSharp';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';

function TrackProg() {
  //uses the useState hook to define a state variable named appointments and a corresponding setter function named setAppointments.
  const [appointments, setAppointments] = useState([]);
  // creates a variable called storedUserId and stores the user id stored in the local storage in it 
  const storedUserId = localStorage.getItem('id');

  /** this useffect hook is used here to as a side effect. the function fetchAppointments tries to make a GET request to
 *  http://localhost:5004/appointments/user/${storedUserId} in order to get the appointments of users associated with a specific user id
 * when it gets the response.data from the backend it updates it with appoinments with setAppointments */
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/appointments/user/${storedUserId}`);
        setAppointments(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAppointments();
  }, [storedUserId]);

  /** the return statement renders a view of all appointments associated with a particular user and includes information 
 * like appointment id, description, status and mechanic's notes in the render
 */
  return (
    <div>
    <h2> < InsightsSharpIcon color="primary"/> Track Progress</h2>
    <div className="track-progress-grid">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="progress-card">
          <AnalyticsOutlinedIcon style={{ color: '#6c798d' }}/> 
          <div>Appointment ID: {appointment.id}</div>
          <div>Description: {appointment.vehicle_description}</div>
          <div>Status: {appointment.status}</div>
          <div>Mechanic's Notes: {appointment.notes}</div>
        </div>
      ))}
    </div>
  </div>
  );
}

export default TrackProg;
