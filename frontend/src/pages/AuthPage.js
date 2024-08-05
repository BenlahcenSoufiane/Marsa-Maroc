// AuthPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../AuthPage.css';

const AuthPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user'); // Default role is user
    const [firstName, setFirstName] = useState(''); // State for first name
    const [lastName, setLastName] = useState(''); // State for last name
    const navigate = useNavigate();

    const toggleSignUp = () => {
        setIsSignUp(!isSignUp);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignUp) {
            fetch('http://localhost:8084/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role, firstName, lastName })
            })
                .then(async res => {
                    if (!res.ok) {
                        const text = await res.text();
                        throw new Error(`Server responded with status ${res.status}: ${text}`);
                    }
                    return res.json();
                })
                .then(data => {
                    if (data.success) {
                        alert('User added successfully');
                        window.location.reload();
                    } else {
                        alert('Signup failed: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error.message);
                    alert('Signup failed: ' + error.message);
                });
        } else {
            fetch('http://localhost:8084/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.token) {
                        localStorage.setItem('token', data.token);
                        navigate('/Dashboard');
                    } else {
                        alert('Invalid credentials');
                    }
                })
                .catch(error => {
                    console.error('Error during login:', error);
                    alert('An error occurred during login. Please try again.');
                });
        }
    };

    return (
        <div className={`cont ${isSignUp ? 's--signup' : ''}`}>
            <form onSubmit={handleSubmit}>

                <div className="form sign-in">
                    <h2>Welcome</h2>
                    <label>
                        <span>Email</span>
                        <input type="email"
                            id="email"
                            name="email" onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <label>
                        <span>Password</span>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    <button type="submit" className="submit">Sign In</button>
                </div>
            </form>
            <div className="sub-cont">
                <div className="img">
                    <div className="img__text m--up">
                        <h3>Don't have an account? Please Sign up!</h3>
                    </div>
                    <div className="img__text m--in">
                        <h3>If you already have an account, just sign in.</h3>
                    </div>
                    <div className="img__btn" onClick={toggleSignUp}>
                        <span className="m--up">Sign Up</span>
                        <span className="m--in">Sign In</span>
                    </div>
                </div>
                <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
                    <div className="form sign-up">
                        <h2>Create your Account</h2>
                        <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                            <div>
                                <label className='text-xs'>
                                    FIRST NAME
                                </label>
                                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                            </div>
                            <div className="w-full">
                                <label className='text-xs'>
                                    LAST NAME
                                </label>
                                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                            </div>
                        </div>
                        <label>
                            <span>Email</span>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </label>
                        <label>
                            <span>Password</span>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </label>
                        <label>
                            <span>Role</span>
                            <select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </label>
                        <button type="submit" className="submit">Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;
