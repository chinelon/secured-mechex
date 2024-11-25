/*imports the sidebar component so that it can be rendered beside the contact us component for the purpose of 
continuity within the platform and easy navigation*/
//import React from 'react';
import '../assets/About.css';
import Sidebar from './Sidebar';
import johnDoeImage from '../assets/logo.png';


function About() {
	//the return statement renders a about component that is syled with css, some pictures have been added to be associated with the team members
	return (
		<div className="about-page">
			<Sidebar />
			<div className="about-content">
				<h1>About Us</h1>
				<p>
					Our company is dedicated to providing top-quality automotive services and connecting mechanics with customers in an efficient and convenient way. We strive to enhance customer service in the automotive industry by leveraging modern technology and creating a seamless experience for our users.
				</p>
				<section>
					<h2>Our Story</h2>
					<p>
						Our journey began with a passion for improving the automotive service industry. We noticed the challenges faced by both customers and mechanics, and we aimed to bridge the gap between them. With the help of our talented team and innovative technologies, we developed a platform that simplifies the process of finding and connecting with skilled mechanics.
					</p>
				</section>
				<section>
					<h2>Our Team</h2>
					<div className="team-members">
						<div className="team-member">
							<img src={johnDoeImage} alt="Jane Smith" />
							<p>Chinelo - Creator</p>
						</div>
						<div className="team-member">
							<img src={johnDoeImage} alt="Jane Smith" />
							<p>Chinelo Nwobbi - CFO</p>
						</div>
						<div className="team-member">
							<img src={johnDoeImage} alt="Jane Smith" />
							<p>Bob Johnson - CTO</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

export default About;