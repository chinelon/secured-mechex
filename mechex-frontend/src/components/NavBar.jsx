/**imports react and a oicture called mechex from the assets folder */
//import { React } from 'react';
import mechex from '../assets/mechex.png';

function Navbar() {

/**
 * const handleLogout= () => {

}
 * the return statement renders an image called mechex */
    return (
        <div className='flex-container'>
            <img src={mechex} alt="Jane Smith" />
        </div>
            

    );
}

export default Navbar;

