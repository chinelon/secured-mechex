import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ViewApps() {
  // creates a variable called storedMechanicId and stores the mechanic id stored in the local storage in it 
  const storedMechanicId = localStorage.getItem('mid');
  //uses the useState hook to define a state variable named appointments and a corresponding setter function named setAppointments.
  const [appointments, setAppointments] = useState([]);
  // creates a variable called navigate and stores react-router-doms predefined function useNavigate in it
  const navigate = useNavigate()

  /**this function is called in the buitton at the button of each appointment when the button is clicked on it redirect to another page where
   * mehanics can followup on a particular appointment based on the appointment id
   */
  const handleClick = (appointment_id) => {
    
    // Navigate to the Followups component
    navigate(`/follow-up/${appointment_id}`);
  };
/** this useffect hook is used here to as a side effect. the function fetchAppointments tries to make a GET request to
 *  http://localhost:5004/appointments/mechanic/${storedMechanicId} in order to get the appointments of mechanics associated with a specific mechanic id
 * when it gets the response.data from the backend it updates it with appoinments with setAppointments */
  useEffect(() => {
    console.log('storedmechanicid',storedMechanicId)
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/appointments/mechanic/${storedMechanicId}`);
        setAppointments(response.data);
        console.log(response.data)
      } catch (error) {
        console.log(error);
      }
    };

    fetchAppointments();
  }, [storedMechanicId]);

/*the creation of the function in line 40-47 arose from complications associated with how the date of the appointments were being rendered. 
the date was being rendered along with the time the split function was used to split the output from T (which is where the time started) and 
return the first part of the result whic is our date*/

  const ChangeDate = (date) => {
    //Get the datee
    var newdate = date.toString();

    const finalDate = newdate.split("T")
    //Split based on t
    return finalDate[0];
  }
/** the return statement renders a view of all appointments associated with a particular mechanic and includes information 
 * like mechanic and user id, date, vehicle make, vehicle model and vehicle description in the render
 */
  return (
    <div>
      <h2>View Appointments</h2>
      <div className="view-appointments-grid">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="appointment-card">
            <div>User: {appointment.user_id}</div>
            <div>Mechanic: {appointment.mechanic_id}</div>
            <div>Date: {ChangeDate(appointment.appointment_date)}</div>
            <div>Make: {appointment.vehicle_make}</div>
            <div>Model: {appointment.vehicle_model}</div>
            <div>Description: {appointment.vehicle_description}</div>
            <div>
              <button onClick={() => handleClick(appointment.id)}>
                Update Progress
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewApps;
