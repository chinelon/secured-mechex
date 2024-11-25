//import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DateRangeIcon from '@material-ui/icons/DateRange';
import EventAvailableTwoToneIcon from '@mui/icons-material/EventAvailableTwoTone';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ViewAgendaOutlinedIcon from '@mui/icons-material/ViewAgendaOutlined';
import ShareLocationOutlinedIcon from '@mui/icons-material/ShareLocationOutlined';

function ViewApp() {
  // creates a variable called storedUserId and stores the user id stored in the local storage in it 
  const storedUserId = localStorage.getItem('id');
  //uses the useState hook to define a state variable named appointments and a corresponding setter function named setAppointments.
  const [appointments, setAppointments] = useState([]);

  /** this useffect hook is used here to as a side effect. the function fetchAppointments tries to make a GET request to
 *  http://localhost:5004/appointments/user/${storedUserId} in order to get the appointments of users associated with a specific user id
 * when it gets the response.data from the backend it updates it with appoinments with setAppointments */
  useEffect(() => {
    console.log(storedUserId)
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

  /** the return statement renders a view of all appointments associated with a particular user and includes information 
 * like date, vehicle make, vehicle model and vehicle description in the render
 */
  return (
    <div>
      <div className="welcome">
        <div>
          <AddOutlinedIcon style={{ padding: 3, color: '#6c798d' }} />
          <Link to="/booking">Ready for a New Appointment?</Link>
        </div>
        <div>
          <ViewAgendaOutlinedIcon style={{ padding: 4, color: '#6c798d' }} />
          <Link to="/mechanics/:mechanicId/">View Mechanics</Link>
        </div>
        <div>

          <Link to="/map"> <ShareLocationOutlinedIcon style={{ padding: 2, color: '#6c798d' }} />  Mechanics Map</Link>
        </div>

      </div>
      <h2> <DateRangeIcon color="primary" /> View Appointments</h2>
      <div className="appointments-grid">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="appointment-card">
            <EventAvailableTwoToneIcon color="primary" />
            <div> Appointment Date: {DOMPurify.sanitize(ChangeDate(appointment.appointment_date))}</div>
            <div>Vehicle Make: {DOMPurify.sanitize(appointment.vehicle_make)}</div>
            <div>Vehicle Model: {DOMPurify.sanitize(appointment.vehicle_model)}</div>
            <div>Description: {DOMPurify.sanitize(appointment.vehicle_description)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewApp;
