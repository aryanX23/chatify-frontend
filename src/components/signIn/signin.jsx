import React, { useState,useEffect } from 'react';
import './signIn.css';
import { IonIcon } from '@ionic/react';
import { mail, lockClosed, closeCircle, alertCircle } from 'ionicons/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Axios, URL} from '../../api/axios';
export default function SignIn() {
    const navigate = useNavigate();
    useEffect(() => {
        let isAuth = localStorage.getItem('isAuthenticated');
        if(isAuth && isAuth !== null) {
            navigate("/chatify-frontend/dashboard/");
        }
    }, [navigate]);
    const [showMessage, setShowMessage] = useState("");
    const [userDetails, setUserDetails] = useState({ email:"",password:""});
    function chooseResponse(response) {
        if(response === "passerr"){
        return <div className='dialogInner'>
                <IonIcon className='icon' style={{color:'red'}} icon={ closeCircle } />
                <span>Wrong Password!</span>
            </div>
        }
        if(response === "usernotexists"){
        return <div className='dialogInner'>
                <IonIcon className='icon' style={{color:'red'}} icon={ alertCircle } />
                    <span>User Not Found!</span>
            </div>
        }
    }
    function handleChange(e) {
        setUserDetails(prev => ({
            ...prev,
            [e.target.name] : e.target.value,
        }));
    }
    function handleSubmit(e) {
        e.preventDefault();
        const bodyFormData = {
                email: userDetails.email,
                password: userDetails.password
            };
        Axios({
            method: "post",
            url: URL + "users/login/",
            withCredentials:true,
            data: bodyFormData,
            })
            .then(function (response) {
                if (response.data.authenticated) {
                    localStorage.setItem("isAuthenticated", true);
                    localStorage.setItem("fullName", response.data.user.fullName);
                    localStorage.setItem("userId", response.data.user._id);
                    localStorage.setItem("email", response.data.user.email);
                    navigate("/chatify-frontend/dashboard/");
                }
            })
            .catch(function (response) {
                console.log("User Does Not Exists!");
                setShowMessage(prev => "usernotexists");
                setTimeout(() => {
                    setShowMessage(prev => "");
                    setUserDetails(prev => ({
                        email: "",
                        password: ""
                    }));
                }, 2000);
                return;
            });
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
                        className="actionButton"
                        onClick={() => {
                            navigate("/chatify-frontend/register/");
                        }}
                    >
                        Register
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
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-box">
                            <span className="icon">
                                <IonIcon icon={mail} />
                            </span>
                            <input
                                type="email"
                                onChange={handleChange}
                                name="email"
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
                                onChange={handleChange}
                                name="password"
                                value={userDetails.password}
                                placeholder=" "
                                required
                            />
                            <label>Password</label>
                        </div>
                        <div className="remember-forgot">
                            <label>
                                <input type="checkbox" />
                                Remember Me
                            </label>
                            <Link>Forgot Password?</Link>
                        </div>
                        <button type="submit" className="btn">
                            Login
                        </button>
                        <div className="login-register">
                            <p>
                                Don't have an account?
                                <Link to="/chatify-frontend/register/">
                                    Register
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}