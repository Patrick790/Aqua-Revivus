import React, { useState, useEffect } from "react";
import './SendNotifications.css';

function SendNotifications() {
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");

    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const token = localStorage.getItem("authToken");

    const handleInputChange = (setter, field) => (e) => {
        setter(e.target.value);
        setErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
        setErrorMessage("");
    };

    async function sendNotification() {
        const newErrors = {};
        if (subject === "") newErrors.subject = true;
        if (body === "") newErrors.body = true;
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setErrorMessage("Toate câmpurile sunt obligatorii!");
            return;
        }

        const url = "http://localhost:8080/notifications";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    subject,
                    body
                }),
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            try {
                const json = await response.json();
                console.log(json);
                alert("Notificare trimisă cu succes!");
            } catch (err) {
                alert("A apărut o eroare!");
                console.log(err);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <div className="form-wrapper">
            <div className="dashboard-form-lateral">
                <div className={`input-container ${errors.subject ? "error" : ""}`}>
                    <input
                        type="text"
                        value={subject}
                        onChange={handleInputChange(setSubject, "subject")}
                        placeholder=" "
                        required
                    />
                    <label>Subiect</label>
                </div>
                <div className={`input-container ${errors.body ? "error" : ""}`}>
                <textarea
                    value={body}
                    onChange={handleInputChange(setBody, "body")}
                    placeholder=" "
                    required
                />
                    <label>Mesaj</label>
                </div>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="btn" onClick={sendNotification}>
                Submit
            </button>
        </div>
    );

}

export default SendNotifications;
