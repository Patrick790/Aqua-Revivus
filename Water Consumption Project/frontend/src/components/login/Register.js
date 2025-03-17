import React, { useState } from "react";
import "./Register.css";

function Register({ onBackToLogin }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleRegister = async () => {
        const newErrors = {};
        if (!name) newErrors.name = true;
        if (!email) {
            newErrors.email = true;
        } else if (!validateEmail(email)) {
            newErrors.email = true;
            setErrorMessage("Email-ul nu este valid!");
        }
        if (!password) newErrors.password = true;
        if (!confirmPassword) newErrors.confirmPassword = true;
        if (password !== confirmPassword) newErrors.confirmPassword = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            if (!errorMessage) setErrorMessage("Toate câmpurile sunt obligatorii!");
            return;
        }

        const user = { name, email, password };

        try {
            const response = await fetch("http://localhost:8080/register/test", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                alert("Cont creat cu succes!");
                onBackToLogin();
            } else {
                alert("Eroare la crearea contului!");
            }
        } catch (error) {
            console.error("Eroare la crearea contului:", error);
            alert("Eroare la crearea contului!");
        }
    };

    const handleInputChange = (setter, field) => (e) => {
        setter(e.target.value);
        setErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
        setErrorMessage("");
    };

    return (
        <div className="form-container">
            <h2>Aqua Revivus</h2>
            <div className={`input-container-register ${errors.name ? 'error' : ''}`}>
                <input
                    type="text"
                    value={name}
                    onChange={handleInputChange(setName, 'name')}
                    placeholder=" "
                    required
                />
                <label>Nume</label>
            </div>
            <div className={`input-container-register ${errors.email ? 'error' : ''}`}>
                <input
                    type="email"
                    value={email}
                    onChange={handleInputChange(setEmail, 'email')}
                    placeholder=" "
                    required
                />
                <label>Email</label>
            </div>
            <div className={`input-container-register ${errors.password ? 'error' : ''}`}>
                <input
                    type="password"
                    value={password}
                    onChange={handleInputChange(setPassword, 'password')}
                    placeholder=" "
                    required
                />
                <label>Parola</label>
            </div>
            <div className={`input-container-register ${errors.confirmPassword ? 'error' : ''}`}>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={handleInputChange(setConfirmPassword, 'confirmPassword')}
                    placeholder=" "
                    required
                />
                <label>Confirmare parolă</label>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="button-group">
                <button onClick={onBackToLogin}>Înapoi</button>
                <button onClick={handleRegister}>Creează cont</button>
            </div>
        </div>
    );
}

export default Register;
