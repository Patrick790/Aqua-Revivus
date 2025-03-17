import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import UserDashboard from "../client/UserDashboard";
import AdminDashboard from "../admin/AdminDashboard";
import Register from "./Register";

function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(() =>
        localStorage.getItem("isLoggedIn") === "true"
    );
    const [userType, setUserType] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            const storedUserType = localStorage.getItem("userType");
            setUserType(storedUserType);
            if (storedUserType === "admin") {
                navigate('/admin-dashboard', { replace: true });
            } else if (storedUserType === "client") {
                navigate('/user-dashboard', { replace: true });
            }
        }
    }, [isLoggedIn, navigate]);

    const goToRegister = () => setIsRegister(true);
    const goToLogin = () => setIsRegister(false);

    const handleInputChange = (setter, field) => (e) => {
        setter(e.target.value);
        setErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
        setErrorMessage("");
    };

    async function login() {
        const newErrors = {};
        if (!email) newErrors.email = true;
        if (!password) newErrors.password = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setErrorMessage("Toate câmpurile sunt obligatorii!");
            return;
        }

        const url = "http://localhost:8080/login";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const json = await response.json();
            console.log(json);

            const urlToken = "http://localhost:8080/login/generateToken";
            const genToken = await fetch(urlToken, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (genToken.ok) {
                const token = await genToken.text();
                console.log(token)
                localStorage.setItem('authToken', token);
            }

            localStorage.setItem("userId", json.id);
            localStorage.setItem("userType", json.userType);

            alert("Login successful!");
            setIsLoggedIn(true);
            setUserType(json.userType);
            localStorage.setItem("isLoggedIn", "true");

            if (json.userType === "admin") {
                navigate('/admin-dashboard', { replace: true });
            } else {
                navigate('/user-dashboard', { replace: true });
            }
        } catch (err) {
            setErrorMessage("Email sau parola incorectă!");
            console.log(err);
        }
    }

    const onKeyDownHandlerEmailField = (e) => {
        if (e.keyCode === 13) {
            document.querySelector('input[type="password"]').focus();
        }
    }

    const onKeyDownHandlerPasswordField = (e) => {
        if (e.keyCode === 13) {
            login().then(r => console.log(r));
        }
    };

    const resetFields = () => {
        setEmail("");
        setPassword("");
        setErrors({});
        setErrorMessage("");
    };

    if (isLoggedIn) {
        if (userType === "client") {
            return <UserDashboard userEmail={email} />;
        }
        if (userType === "admin"){
            return <AdminDashboard userEmail={email} />;
        }
    }

    return (
        <div className="form-wrapper">
            {isRegister ? (
                <Register onBackToLogin={goToLogin} />
            ) : (
                <div className="form-container">
                    <h2>Aqua Revivus</h2>
                    <div className={`input-container-login ${errors.email ? 'error' : ''}`}>
                        <input
                            type="email"
                            value={email}
                            onChange={handleInputChange(setEmail, 'email')}
                            onKeyDown={onKeyDownHandlerEmailField}
                            placeholder=" "
                            required
                        />
                        <label>Email</label>
                    </div>
                    <div className={`input-container-login ${errors.password ? "error" : ""}`}>
                        <input
                            type="password"
                            value={password}
                            onChange={handleInputChange(setPassword, 'password')}
                            onKeyDown={onKeyDownHandlerPasswordField}
                            placeholder=" "
                            required
                        />
                        <label>Parola</label>
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button onClick={login}>Conectare</button>
                    <p>
                        Nu ai cont de utilizator?{" "}
                        <span onClick={goToRegister}>Creează cont</span>
                    </p>
                </div>
            )}
        </div>
    );
}

export default Login;