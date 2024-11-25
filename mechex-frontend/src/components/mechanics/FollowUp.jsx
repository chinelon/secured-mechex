import { useState, useEffect } from "react";
//useParams is used to extract the parameter values from the URL path.
import { useParams, Link } from 'react-router-dom';
//imports axios that is used to connect to the backend 
import axios from "axios";

function FollowUp() {

    //uses the useState hook to define a state variable and a corresponding setter function.
    const [status, setStatus] = useState(0);
    const [notes, setNotes] = useState('');
    const [appointment, setAppointment] = useState('');
    //extracts appointment_id
    const { appointment_id } = useParams();

    /* the function fetchAppointmentsDetails tries to make a GET request to http://localhost:5004/appointments/${appointment_id} 
    in order to get a specific appointments for a mechanic when it gets the response.data from the backend it 
    updates it with appoinments with setAppointments */
    useEffect(() => {
        console.log('app id', appointment_id)
        const fetchAppointmentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/appointments/${appointment_id}`);
                setAppointment(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchAppointmentDetails();
    }, [appointment_id]);

    
    //function handleSubmit handles when the form rendered in the return statement below is submitted
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
    /* tries Send a POST request to http://localhost:5004/appointments/${appointment_id} your backend API endpoint. second part is an object 
    that represents the data to be sent with the request.*/
            const response = await axios.put(`http://localhost:5001/appointments/${appointment_id}`, {
                status,
                notes,
                appointment_id,
            });

            // logs the response from the backend as needed
            console.log(response.data);

            // Reset form fields after successful signup
            setStatus('');
            setNotes('');
        //alerts users that a follow up has been created with a pop up message
            alert('follow up has been created')
        } catch (error) {
            // Handle any errors that occurred during the signup process
            console.error(error);
        }
    };
//if there is no appointment id the compoent returns loading.. in the browser
    if (!appointment_id) {
        return <p>Loading...</p>;
    }
  
    //the return statement renders the signup form where users input data which will be set in the state variable using the setters
    return (
        <div className="form-columnss">
            <div><Link to="/dashboards">Back to Dashboard</Link></div>
            <h2>Enter Follow up Information</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="statuss">Status: </label>
                    <input
                        type="number"
                        id="status"
                        placeholder='80% completed'
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="notes">Notes: </label>
                    <input
                        type="text"
                        id="notes"
                        placeholder='Please come back for further analysis in two weeks'
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                <button className="submits-button" type="submit">
                    Save
                </button>
            </form>
        </div>

    );
}

export default FollowUp;