import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HouseholdDetails.css';

const HouseholdDetails = () => {
    const [households, setHouseholds] = useState([]);
    const [selectedHousehold, setSelectedHousehold] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        fetchHouseholds();
    }, []);

    const fetchHouseholds = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error("User ID not found in localStorage");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/households/user/${userId}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setHouseholds(data);
            } else {
                console.error('Failed to fetch households', response.status);
            }
        } catch (error) {
            console.error('Error fetching households:', error);
        }
    };

    const handleDeleteHousehold = async () => {
        setErrorMessage("");
        if (!selectedHousehold) {
            setErrorMessage("Selectează o locuință ");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/households/${selectedHousehold.id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                setHouseholds(households.filter(h => h.id !== selectedHousehold.id));
                setSelectedHousehold(null);
            } else {
                console.error('Failed to delete household', response.status);
            }
        } catch (error) {
            console.error('Error deleting household:', error);
        }
    };

    const handleRowClick = (household) => {
        if (selectedHousehold && selectedHousehold.id === household.id) {
            setSelectedHousehold(null);
        } else {
            setSelectedHousehold(household);
        }
        setErrorMessage("");
    };

    return (
        <div className="household-details-wrapper">
            <nav className="household-details-nav">
                <button onClick={() => navigate('/dashboard')}>Înapoi</button>
            </nav>
            <div className="household-details-container">
                <h2>Locuințele mele</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <div className="household-table-container">
                    <table className="household-table">
                        <thead>
                        <tr>
                            <th>Nume</th>
                            <th>Adresa</th>
                            <th>Număr locuitori</th>
                            <th>Tip</th>
                            <th>Mediu</th>
                            <th>Suprafața</th>
                        </tr>
                        </thead>
                        <tbody>
                        {households.map((household) => (
                            <tr
                                key={household.id}
                                onClick={() => handleRowClick(household)}
                                className={selectedHousehold && selectedHousehold.id === household.id ? 'selected' : ''}
                            >
                                <td>{household.name}</td>
                                <td>{household.address}</td>
                                <td>{household.numberOfResidents}</td>
                                <td>{household.type}</td>
                                <td>{household.area}</td>
                                <td>{household.surface}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <button className="delete-button-details" onClick={handleDeleteHousehold}>Șterge Locuința</button>
            </div>
        </div>
    );
};

export default HouseholdDetails;
