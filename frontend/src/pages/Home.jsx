import React from 'react';
import NavbarHome from '../components/NavbarHome';
import { useNavigate } from 'react-router-dom';
import image from '../assets/homemain_connection.jpg';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  return (
    <>
      <NavbarHome />
      <div className='mainDiv'>
        <div className='leftDiv'>
          <h1>Connect with Friends</h1>
          <h1>without Exaggeration</h1>
          <h3>A True social media platform, with stories no bluffs</h3>
          <h3>!</h3>
          <button onClick={() => navigate('/register')}>Join Now</button>
        </div>
        <div className='rightDiv'>
          <img src={image} alt='Connection' />
        </div>
      </div>
    </>
  );
}

export default Home;