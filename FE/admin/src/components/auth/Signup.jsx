import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import '../styles/app.css';  

const Signup = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSignup = async () => {
        if (!formData.username || !formData.email || !formData.password) {
            setError('All fields are required');
            return;
        }

        setLoading(true); 
        setError(''); 

        try {
            const response = await axios.post('http://localhost:5000/api/signup', formData);

            console.log(response);

            if (response.status === 201) {
                alert('User created successfully');
                navigate('/login');
            }
        } catch (err) {

            if(err.response && err.response.data && err.response.data.msg) {
                setError(err.response.data.msg);
            } else {
            setError('Signup failed. Please try again.');
            }
        } finally {
            setLoading(false); 
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="auth-container">
            <div className="auth-image-section"></div>
            <div className="auth-form-section">
                <div className="auth-form-container">
                    <h1>Signup</h1>
                    {error && <p className="error-message">{error}</p>}
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                    />
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
                    <button onClick={handleSignup} disabled={loading}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                    <p className="auth-redirect">
                        Already have an account? 
                        <span className="auth-link" onClick={handleLoginRedirect}>
                            Login here
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
