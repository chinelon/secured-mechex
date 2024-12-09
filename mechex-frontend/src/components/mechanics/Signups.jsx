//this react component will be used to signup mechanics
//imports axios that is used to connect to the backend 
import /*React,*/ { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PasswordStrengthBar from "react-password-strength-bar";
import PasswordChecklist from "react-password-checklist";

function Signups() {
  //uses the useState hook to define a state variable and a corresponding setter function .
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUserType] = useState('mechanic');

  // creates a variable called navigate and stores react-router-doms predefined function useNavigate in it
  const navigate = useNavigate()

  //function handleSubmit handles when the form rendered in the return statement below is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      /* tries Send a POST request to http://localhost:5003/mechanics/signups your backend API endpoint. second part is an object that represents the data 
      to be sent with the request.*/
      const response = await axios.post('http://localhost:5001/mechanics/signups', {
        name,
        phone,
        email,
        address,
        city,
        password,
        user_type: usertype
      });

      // log the response from the backend as needed
      console.log(response.data);

      // Reset form fields after successful signup
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setCity('');
      setPassword('');
      setUserType('');

      alert('login to verify account')
      //navigates to the mechanics dashboard
      navigate('/login');
    } catch (error) {
      alert('Check credentials and try again');
      navigate('/signups')
      // Handle any errors that occurred during the signup process
      console.error(error);
    }
  };

  //the return statement renders the signup form where users input data which will be set in the state variable using the setters
  return (
    <div className="signup">
      <div className="main-form">
        <h2>Welcome to our Mechanic Party!</h2>
        <form onSubmit={handleSubmit}>
          <div className="search-form">
            <label htmlFor="usertype">What kind of user are you?:</label>
            <select
              id="usertype"
              value={usertype}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="customer">Customer</option>
              <option value="mechanic">Mechanic</option>
            </select>
          </div>
          <div className="formcolumns">
            <div className="formcolumn">
              <div id="name">
                <label htmlFor="name"></label>
                <input
                  type="text"
                  id="name"
                  placeholder='Name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div id="phone">
                <label htmlFor="phone"></label>
                <input
                  type="text"
                  id="phone"
                  placeholder='Phone Number:'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div id="email">
                <label htmlFor="email"></label>
                <input
                  type="email"
                  id="email"
                  placeholder='Email:'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="formcolumn">

              <div id="address">
                <label htmlFor="address"> </label>
                <input
                  type="address"
                  id="address"
                  placeholder='Street Address:'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div id="city">
                <label htmlFor="city"></label>
                <input
                  type="city"
                  id="city"
                  placeholder='City:'
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div id="password">
                <label htmlFor="password"></label>
                <input
                  type="password"
                  id="password"
                  placeholder='Password:'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* Password strength bar and checklist to 
                                increase password strength in users */}
                <PasswordChecklist
                  rules={["minLength", "specialChar", "number", "capital"]}
                  minLength={10}
                  value={password}
                  messages={{
                    minLength: "Password must be 10 characters",
                    specialChar: "Must have a special character.",
                    number: "Password must contain a number.",
                    capital: "Must have a captal letter.",
                  }}
                />
                <PasswordStrengthBar password={password} />
              </div>
            </div>


          </div>

          <button className="submitbutton" type="submit">Sign up</button>
        </form>
      </div>
    </div>
  )
}

export default Signups;