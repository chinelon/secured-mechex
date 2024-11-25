/** importing react from react, link from react router dom that works in navigating between components and icons from Material UI
 * a React Icon Library
 */
//import { React, useContext } from 'react';
import { Link } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LightbulbCircleOutlinedIcon from '@mui/icons-material/LightbulbCircleOutlined';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';

function Sidebar() {
/**the return statement renders links to the home, about and contact us component 'Link' uses its predefined path in app.jsx. 
 * The icons beside it are illustrating what they do like a small house icon
  */
    return (
        <nav>
            <div className="sidebars">
                    <div>
                   <HomeOutlinedIcon style={{ color: '#6c798d' }}/>
                        <Link to="/"> Home</Link>
                    </div>
                    <div>
                        <LightbulbCircleOutlinedIcon style={{ color: '#6c798d' }} />
                        <Link to="/about">About</Link>
                    </div>
                    <div>
                        <ContactPageOutlinedIcon style={{ color: '#6c798d' }}/>
                        <Link to="/contact-us">Contact Us</Link>
                    </div>
            </div>
        </nav>

    );
}

export default Sidebar;

