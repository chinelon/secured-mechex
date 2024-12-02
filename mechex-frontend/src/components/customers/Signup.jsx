//this react component will be used to sign up customers
//imports axios that is used to connect to the backend 
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PasswordStrengthBar from 'react-password-strength-bar';
import PasswordChecklist from 'react-password-checklist';
function Signup() {
    //uses the useState hook to define a state variable and a corresponding setter function .
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [usertype, setUserType] = useState('customer')

    // creates a variable called navigate and stores react-router-doms predefined function useNavigate in it
    const navigate = useNavigate();

    //function handleSubmit handles when the form rendered in the return statement below is submitted
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            /* tries Send a POST request to http://localhost:5002/users/signup your backend API endpoint. second part is an object that represents the data 
       to be sent with the request.*/

            const response = await axios.post('http://localhost:5001/users/signup', {
                username,
                password,
                email,
                phone_no: phone,
                user_type: usertype
            });

            // log the response from the backend as needed
            console.log(response.data);

            // Reset form fields after successful signup
            setUsername('');
            setPassword('');
            setEmail('');
            setPhone('');
            setUserType('');

            alert('login to verify account')
            //navigates to the customers dashboard
            navigate('/login');
        } catch (error) {
            // Handle any errors that occurred during the signup process
            console.error(error);
        }

    };

    //the return statement renders the signup form where users input data which will be set in the state variable using the setters
    return (
        <div className='signup'>
            <div className='main-form'>
                <h2>Welcome to the MechEx Family!</h2>
                <form onSubmit={handleSubmit}>
                    <div className='search-form'>
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
                    <div className='formcolumns'>
                        <div className='formcolumn'>
                            <div>
                                <label htmlFor="username"></label>
                                <input
                                    type="text"
                                    id="username"
                                    placeholder=' Username: chinelon'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="phone_no"> </label>
                                <input
                                    type="integer"
                                    id="phone_no"
                                    placeholder='Phone Number: 09063330222'
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='formcolumn'>
                            <div>
                                <label htmlFor="email"></label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder='Email: chinelo@yahoo.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password"></label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder='Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
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
                    <div className='submitbutton'>
                        <button type="submit">Sign up</button>
                    </div>

                </form>
            </div>

        </div>
    );
}

export default Signup;
