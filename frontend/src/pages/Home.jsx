import React from 'react'
import NavbarHome from '../components/NavbarHome'
import { useNavigate } from 'react-router-dom';
import image from '../assets/homemain_connection.jpg'
import './Home.css'
function Home() {
  const navigate = useNavigate();
  return (
    <>
        <NavbarHome/>
        <div className='maindiv'>
            <div className='leftdiv'>
                <h1>Connect with Friends</h1>
                <h1>without Exaggeration</h1>
                <h3>A True social media platform, with stories no blufs</h3>
                <h3>!</h3>
                <button onClick={()=>{
                  navigate("/register")
                }}>Join Now</button>
            </div>
            <div className='rightdiv'>
                <img src={image} alt="" />
            </div>
        </div>
    </>
  )
}

export default Home