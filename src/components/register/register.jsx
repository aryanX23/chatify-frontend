import React, { useState, useRef, useEffect } from 'react';
import './register.css';
import { IonIcon } from '@ionic/react';
import { mail, lockClosed, person, closeCircle, checkmarkCircle, alertCircle } from 'ionicons/icons';
import { Link, useNavigate } from 'react-router-dom';
import {  Axios,URL } from '../../api/axios';

export default function Register() {
    const navigate = useNavigate();
    useEffect(() => {
        let isAuth = localStorage.getItem('isAuthenticated');
        if(isAuth && isAuth !== null) {
            navigate("/chatify-frontend/dashboard/");
        }
    }, [navigate]);
    const ref = useRef([]);
    const [showMessage, setShowMessage] = useState("");
    const [userDetails, setUserDetails] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
    function handleRegister(e) {
        e.preventDefault();
        if (userDetails.password !== userDetails.confirmPassword) {
            setUserDetails(prev => ({
                ...prev,
                password: "",
                confirmPassword: ""
            }));
            setShowMessage(prev => "passerr");
            setTimeout(() => {
                setShowMessage(prev => "");
            }, 2000);
            return;
        }
        else {
            const bodyFormData = {
                fullName: userDetails.fullName,
                email: userDetails.email,
                password: userDetails.password
            };
            Axios({
                method: "post",
                url: URL + "/users/register/",
                data: bodyFormData,
                })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (response) {
                    console.log(response);
                    setShowMessage(prev => "userexists");
                    setTimeout(() => {
                        setShowMessage(prev => "");
                    }, 2000);
                    return;
                });
            setUserDetails(prev => ({
                fullName: "",
                email: "",
                password: "",
                confirmPassword: ""
            }));
            ref.current.checked = false;
            setShowMessage(prev => "regsuccess");
            setTimeout(() => {
                setShowMessage(prev => "");
                navigate("/chatify-frontend/"); 
            }, 2000);      
        }
    }
    function handleChange(e) {
        setUserDetails(prev => ({
            ...prev,
            [e.target.name] : e.target.value,
        }));
    }
    function chooseResponse(response) {
        if(response === "passerr"){
        return <div className='dialogInner'>
            <IonIcon className='icon' style={{color:'red'}} icon={ closeCircle } />
             <span>Passwords Do Not Match!</span>
        </div>}
        if(response === "regsuccess"){
        return <div className='dialogInner'>
                <IonIcon className='icon' style={{color:'green'}} icon={ checkmarkCircle } />
                    <span>User Registration Success!</span>
            </div>
        }
        if(response === "userexists"){
        return <div className='dialogInner'>
                <IonIcon className='icon' style={{color:'red'}} icon={ alertCircle } />
                    <span>User Already Exists!</span>
            </div>
        }
    }
    return (
        <div className="signInBody">
            <img
                src={process.env.PUBLIC_URL + "/images/signupbg1.jpg"}
                alt="background"
                className="signInbg"
            />
            <div className="headerBody">
                <div className="headerTitle">
                    <span>Chatify</span>
                </div>
                <div>
                    <button
                        onClick={() => {
                            navigate("/");
                        }}
                        className="actionButton"
                    >
                        Login
                    </button>
                </div>
            </div>
            {showMessage.length !== 0 ? (
                <div className="dialogBox">{chooseResponse(showMessage)}</div>
            ) : (
                <></>
            )}
            <div className="formWrapper">
                <div className="form-box">
                    <h2>Register</h2>
                    <form onSubmit={handleRegister}>
                        <div className="input-box">
                            <span className="icon">
                                <IonIcon icon={person} />
                            </span>
                            <input
                                type="text"
                                onChange={handleChange}
                                value={userDetails.fullName}
                                name="fullName"
                                placeholder=" "
                                required
                            />
                            <label>Full Name</label>
                        </div>
                        <div className="input-box">
                            <span className="icon">
                                <IonIcon icon={mail} />
                            </span>
                            <input
                                type="email"
                                name="email"
                                onChange={handleChange}
                                value={userDetails.email}
                                placeholder=" "
                                required
                            />
                            <label>Email</label>
                        </div>
                        <div className="input-box">
                            <span className="icon">
                                <IonIcon icon={lockClosed} />
                            </span>
                            <input
                                type="password"
                                name="password"
                                onChange={handleChange}
                                value={userDetails.password}
                                placeholder=" "
                                required
                            />
                            <label>Password</label>
                        </div>
                        <div className="input-box">
                            <span className="icon">
                                <IonIcon icon={lockClosed} />
                            </span>
                            <input
                                type="password"
                                name="confirmPassword"
                                onChange={handleChange}
                                value={userDetails.confirmPassword}
                                placeholder=" "
                                required
                            />
                            <label>Confirm Password</label>
                        </div>
                        <div className="remember-forgot">
                            <label>
                                <input
                                    type="checkbox"
                                    ref={(element) => {
                                        ref.current = element;
                                    }}
                                    required
                                />
                                <Link>Accept Our Terms and Conditions?</Link>
                            </label>
                        </div>
                        <button type="submit" className="btn">
                            Register
                        </button>
                        <div className="login-register">
                            <p>
                                Already have an account?
                                <Link to="/chatify-frontend/">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}