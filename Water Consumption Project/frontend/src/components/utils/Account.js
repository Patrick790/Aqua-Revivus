import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Account.css';

const Account = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [educationLevel, setEducationLevel] = useState('');
    const [income, setIncome] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        const fetchData = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                console.error("User ID not found in localStorage");
                return;
            }

            try {
                const userResponse = await fetch(`http://localhost:8080/users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}`
                    },
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setName(userData.name || '');
                    setEmail(userData.email || '');
                    setPassword(userData.password || '');
                    setGender(userData.gender || '');
                    setDateOfBirth(userData.birthDate || '');
                    setEducationLevel(userData.education || '');
                    setIncome(userData.income || '');
                } else {
                    console.error('Failed to fetch user data', userResponse.status);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleSave = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error("User ID not found in localStorage");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, gender, birthDate: dateOfBirth, education: educationLevel, income }),
            });

            if (response.ok) {
                alert('Profile updated successfully');
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="account-wrapper">
            <nav className="account-nav">
                <button onClick={() => navigate('/dashboard')}>Înapoi</button>
            </nav>
            <div className="account-container">
                <h2>Completare profil</h2>
                <div className="gender-selection">
                    <label>
                        <input
                            type="radio"
                            value="masculin"
                            checked={gender === 'masculin'}
                            onChange={(e) => setGender(e.target.value)}
                        />
                        Dl.
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="feminin"
                            checked={gender === 'feminin'}
                            onChange={(e) => setGender(e.target.value)}
                        />
                        D.
                    </label>
                </div>
                <div className="form-content">
                    <div className="input-container-account">
                        <label>Nume</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="input-container-account">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-container-account">
                        <label>Parola</label>
                        <input
                            type="password"
                            value={password}
                            readOnly
                        />
                    </div>
                    <div className="input-container-account">
                        <label>Data nașterii</label>
                        <input
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                        />
                    </div>
                    <div className="input-container-account">
                        <label>Nivelul educațional</label>
                        <input
                            type="text"
                            value={educationLevel}
                            onChange={(e) => setEducationLevel(e.target.value)}
                        />
                    </div>
                    <div className="input-container-account">
                        <label>Venitul total al familiei</label>
                        <input
                            type="number"
                            value={income}
                            onChange={(e) => setIncome(e.target.value)}
                        />
                    </div>
                    <button onClick={handleSave}>Salvare</button>
                </div>
            </div>
        </div>
    );
};

export default Account;