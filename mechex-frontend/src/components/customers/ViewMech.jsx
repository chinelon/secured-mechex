//imports axios that is used to connect to the backend 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import profiles from '/Users/laurennwobbi/secured-mechex/secured-mechex/mechex-frontend/src/assets/profiles.jpg'
import { Link } from 'react-router-dom';

function ViewMech() {
      //uses the useState hook to define a state variable and a corresponding setter function .
    const [mechanics, setMechanics] = useState([]);
    const [currentMechanicIndex, setCurrentMechanicIndex] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [name, setName] = useState('')
    const [reviewText, setReviewText] = useState('');

  /** this useffect hook is used here to as a side effect. the function fetchMechanics tries to make a GET request to
 *  http://localhost:5003/mechanics in order to get all the Mechanics in the database
 * when it gets the response.data from the backend it updates the mechanics with setMechanics */
    useEffect(() => {
        const fetchMechanics = async () => {
            try {
                const response = await axios.get('http://localhost:5001/mechanics/');
                setMechanics(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchMechanics();
    }, []);

  /** this useffect hook is used here to as a side effect. the function fetchReviews tries to make a GET request to
 *  http://localhost:5005/reviews/mechanics/${mechanic_id} in order to get the reviews of mechanics associated with a specific mechanic id
 * when it gets the response.data from the backend it updates the reviews with setReviews */
    useEffect(() => {
        const fetchReviews = async () => {//function responsible for fetching reviews for a selected mechanic.
            if (mechanics.length > 0) { //fetchReviews function is only executed when there are mechanics available
                try {
                    const mechanic_id = mechanics[currentMechanicIndex]?.id
                    console.log(mechanic_id)
                    if (mechanic_id) {
                        const response = await axios.get(`http://localhost:5001/reviews/mechanics/${mechanic_id}`);
                        setReviews(response.data);
                    } else
                        console.log('no mechanicid')
                } catch (error) {
                    console.log(error);
                    console.log('not working')
                }
            }
        };

        fetchReviews();
    }, [currentMechanicIndex, mechanics]);

    /**the navigateNextMechanic and navigatePreviousMechanic function is responsible for navigating to the next or previous mechanic in the mechanics array.
It uses the setCurrentMechanicIndex setter function for updating the currentMechanicIndex state variable. */
    const navigateNextMechanic = () => {
        setCurrentMechanicIndex((prevIndex) => (prevIndex + 1) % mechanics.length);
    };

    const navigatePreviousMechanic = () => {
        setCurrentMechanicIndex((prevIndex) =>
            prevIndex === 0 ? mechanics.length - 1 : prevIndex - 1
        );
    };
       
    //function createReview creates new reviews when the review form is submitted 
    const createReview = async (mechanicId) => {
        /* tries Send a POST request to http://localhost:5005/reviews your backend API endpoint. second part is an object that represents the data 
      to be sent with the request.*/
        try {
            const response = await axios.post('http://localhost:5001/reviews', {
                mechanicId,
                name,
                reviewText,
            });
            //resets state variables 
            setName('');
            setReviewText('');
           
            //  logs the success response as needed
            console.log(response.data);
        } catch (error) {
            console.log(error);
            //  can handle the error response as needed
        }
    };

    /** the return statement renders all the mechanics in the databse, the way it is rendered depends on the css associated with it. 
     * below the rendered mechanics is a list of reviews associated with the particular mechanic being rendered at the time along with a 
     * small form to submit new mechanic reviews  */
    return (
        <div>
            <Link to="/dashboard"> Back to Dashboard</Link>
            {mechanics.length > 0 && (
                <div className="mechanic-window">
                    <div className="arrow left" onClick={navigatePreviousMechanic}>
                        &lt;
                    </div>
                    <div key={mechanics[currentMechanicIndex].id} className="appointments-card">
                        <div className='mechanics'>
                            <div> <img src={profiles} alt="Profile" /> </div>
                            <div>{mechanics[currentMechanicIndex].name}</div>
                            <div>{mechanics[currentMechanicIndex].phone}</div>
                            <div>{mechanics[currentMechanicIndex].email}</div>
                            <div>{mechanics[currentMechanicIndex].address}</div>
                            <div>{mechanics[currentMechanicIndex].city}</div>
                        </div>
                        <div className="review-section">
                            <div className='viewreviews'>
                                <h3>Reviews:</h3>
                                <div className='reviews-container'>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Review</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reviews.map((review) => (
                                                <tr key={review.id}>
                                                    <td>{review.name}</td>
                                                    <td>{review.reviewText}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className='review-form'>
                                <form>
                                    <div >
                                        <label htmlFor="name">    Name </label>
                                        <input
                                            type="name"
                                            id="name"
                                            placeholder='chinelo'
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div >
                                        <label htmlFor="reviews">    Review  </label>
                                        <input
                                            type="review"
                                            id="review"
                                            placeholder='review'
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                        />
                                    </div>
                                </form>

                                <button className="review-button" onClick={() => createReview(mechanics[currentMechanicIndex].id)}>
                                    Submit Review
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="arrow right" onClick={navigateNextMechanic}>
                        &gt;
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewMech;
