import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarHome from '../components/NavbarHome';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { email, password };
  
    fetch('http://localhost:5000/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(async (res) => {
        const data = await res.json();
        console.log('Response from backend:', data);
  
        if (data.success) {
          localStorage.setItem('token', data.token);
          navigate('/dashboard');
        } else {
          setResponseMessage(data.message || 'Login failed.');
        }
      })
      .catch((error) => {
        console.error('Fetch Error:', error);
        setResponseMessage('Something went wrong. Please try again.');
      });
  };
  
  return (
    <>
      <NavbarHome />
      <div className="maindiv">
        <div className="card">
          <div className="left">
            <h1>Sign In</h1>
            {responseMessage && <p className="response-message">{responseMessage}</p>}
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="signin-btn">Sign In</button>
            </form>
          </div>
          <div className="right">
            <h3>Don't Have an Account?</h3>
            <button className="signup-btn" onClick={()=>{navigate("/register")}}>Sign Up</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;