import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import NavbarHome from '../components/NavbarHome';
import './Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { username, name, email, password };

    fetch('http://localhost:5000/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        setResponseMessage(data.message || 'Registration successful!');
      })
      .catch((error) => {
        console.error('Error:', error);
        setResponseMessage('Registration failed. Please try again.');
      });
  };

  return (
    <>
      <NavbarHome />
      <div className="maindiv">
        <div className="card">
          <div className="left">
            <h1>Sign Up</h1>
            {responseMessage && <p className="response-message">{responseMessage}</p>}
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
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
              <button type="submit" className="signup-btn1">Sign Up</button>
            </form>
          </div>
          <div className="right">
            <h3>Already Have an Account?</h3>
            <button className="signin-btn1" onClick={() => navigate('/login')}>Sign In</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
