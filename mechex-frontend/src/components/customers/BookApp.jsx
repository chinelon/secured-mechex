// this component allows users to book their appointments
//imports axios that is used to connect to the backend 
import { useNavigate, Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import '/Users/laurennwobbi/secured-mechex/secured-mechex/mechex-frontend/src/assets/Booking.css';

//user_id is passed as a prop from app.jsx
function BookApp({ user_id }) {
  //uses the useState hook to define a state variable and a corresponding setter function .
  //const [user, setUser] = useState('');
  const [mechanics, setMechanics] = useState([]);
  const [city, setCity] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [appointment_date, setAppointment_Date] = useState('');
  const [vehicle_make, setVehicle_Make] = useState('');
  const [vehicle_model, setVehicle_Model] = useState('');
  const [vehicle_year, setVehicle_Year] = useState('');
  const [vehicle_description, setVehicle_Description] = useState('');
  const navigate = useNavigate()

  //const [user_id, setUser_Id] = useState(""); // Store the logged-in user ID here
  /** line 26-34 the function handleSearch attempts to make an GET request to http://localhost:5003/mechanics/${city}
   * which handles the searching of mechanics with a particular city that has been inputted in the form
   */
  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/mechanics/${city}`);
      const mechanicsData = response.data;
      setMechanics(mechanicsData);
    } catch (error) {
      console.log(error);
    }
  };

  const onOptionPick = (e) => {
    setSelectedMechanic(e.target.value)
    console.log(e.target.value);
  }

  //function handleSubmit handles when the form rendered in the return statement below is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user_id)

    //if a user_id is not present an aloert message is shown and redirects users to the log in page
    if (!user_id) {
      alert('Please log in to create an appointment');
      navigate('/login')
      return;
    }

    // Retrieve the selected mechanic's information and continue with form submission
    if (selectedMechanic) {
      e.preventDefault();

      try {
        /* tries Send a POST request to http://localhost:5004/appointments your backend API endpoint. second part is an object that represents the data 
       to be sent with the request.*/

        const response = await axios.post('http://localhost:5001/appointments', {
          user_id: user_id,
          mechanic_id: selectedMechanic,
          appointment_date,
          vehicle_make,
          vehicle_model,
          vehicle_year,
          vehicle_description,

        });

        // logs the response from the backend as needed
        console.log(response.data);

        // Reset form fields after successful signup
        setMechanics([]);
        setCity('');
        setSelectedMechanic('');
        setAppointment_Date('');
        setVehicle_Make('');
        setVehicle_Model('');
        setVehicle_Year('');
        setVehicle_Description('');
        //setUser_Id('');

        //navigates users back to view appointments
        navigate('/appointments');
      } catch (error) {
        // Handle any errors that occurred during the signup process
        console.error(error);
      }
    } else {
      alert('Please select a mechanic')
      // Handle the case when no mechanic is selected
    }
  };

  //the return statement renders the signup form where users input data which will be set in the state variable using the setters
  return (
    <div>
      <div className="booking-app">


        <form onSubmit={handleSubmit}>
          <div className="main-form">
            <div><Link to="/dashboard">Back to Dashboard</Link></div>
            <h2>Book Appointment</h2>
            <p>Search for Mechanics</p>
            <div className="search-form">
              <div>
                <input
                  type="text"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <button type="button" onClick={handleSearch}>Search</button>
              </div>
              {mechanics.length > 0 && (
                <div>
                  <label>Select a mechanic:</label>
                  <select onChange={onOptionPick}>
                    <option value="">Select</option>
                    {mechanics.map((mechanic) => (
                      <option key={mechanic.id} value={mechanic.id}>
                        {mechanic.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="form-columns">
              <div className="form-column">
                <div>
                  <label htmlFor="date">Appointment Date: </label>
                  <input type="date" id="appointment_date" value={appointment_date} placeholder='10/11/2033' onChange={(e) => setAppointment_Date(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="vehicle_make">Vehicle Make: </label>
                  <input type="text" id="vehicle_make" value={vehicle_make} placeholder='Toyota' onChange={(e) => setVehicle_Make(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="vehicle_model">Vehicle Model: </label>
                  <input type="text" id="vehicle_model" value={vehicle_model} placeholder='Camry' onChange={(e) => setVehicle_Model(e.target.value)} />
                </div>
              </div>
              <div className="form-column">
                <div>
                  <label htmlFor="vehicle_year">Vehicle Year: </label>
                  <input type="text" id="vehicle_year" value={vehicle_year} placeholder='2003' onChange={(e) => setVehicle_Year(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="vehicle_description">Vehicle Description: </label>
                  <input type="text" id="vehicle_description" value={vehicle_description} placeholder='Oil change needed' onChange={(e) => setVehicle_Description(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="submit-button">
              <button type="submit" >Book Appointment </button>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

export default BookApp;
