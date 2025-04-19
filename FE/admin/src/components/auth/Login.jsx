import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx'; // Import useAuth here
import '../styles/app.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth(); // Get the login function from AuthContext

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogin = async () => {
        if (!formData.email || !formData.password) {
            setError('Both fields are required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/login', formData);

            console.log(response);

            if (response.data && response.data.userId) {
                // Call the login function from the context to update the authentication state
                login(response.data.userId);  // Pass userId to the login function
                localStorage.setItem('userId', response.data.userId); // Store userId in localStorage
                alert('Login successful');
                
                // Navigate to the to-do page after successful login
                navigate('/home');
            } else {
                setError('Failed to retrieve user information');
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.msg) {
                setError(err.response.data.msg);
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignUpRedirect = () => {
        navigate('/signup');
    };

    return (
        <div className="auth-container">
            <div className="auth-image-section"></div>
            <div className="auth-form-section">
                <div className="auth-form-container">
                    <h1>Login</h1>
                    {error && <p className="error-message">{error}</p>}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button onClick={handleLogin} disabled={loading}>
                        {loading ? 'Logging In...' : 'Login'}
                    </button>
                    <p className="auth-redirect">
                        Don't have an account? 
                        <span className="auth-link" onClick={handleSignUpRedirect}>
                            Sign up here
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
