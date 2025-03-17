import React, { useState, useEffect } from "react";
import "./Notifications.css"; // Optional for styling

function Notifications() {
    const [data, setData] = useState([]); // State for storing notifications
    const [selectedMessage, setSelectedMessage] = useState(null); // State for the selected message
    const [isLoading, setIsLoading] = useState(true); // State for loading status
    const [error, setError] = useState(null); // State for error handling
    const token = localStorage.getItem("authToken");

    // Function to fetch data
    const fetchData = async () => {
        const url = "http://localhost:8080/notifications"; // Replace with your API endpoint
        setIsLoading(true);
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const result = await response.json();
            setData(result);
            setError(null);
        } catch (err) {
            setError("A apărut o eroare. Încercați din nou!");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchData();
    }, []);

    // Handle row click
    const handleRowClick = (message) => {
        setSelectedMessage(message); // Set the clicked message as selected
    };

    return (
        <div className="notifications-container">
            <div className="table-wrapper">
                <h2>Notificări</h2>
                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <table className="subject-table">
                        <thead>
                        <tr>
                            <th>Subiect</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item) => (
                            <tr
                                key={item.id}
                                onClick={() => handleRowClick(item)}
                                style={{ cursor: "pointer" }}
                            >
                                <td>{item.subject}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
            <div className="message-display">
                {selectedMessage ? (
                    <div className="message-body">
                        <h3>{selectedMessage.subject}</h3>
                        <pre>{selectedMessage.body}</pre>
                    </div>
                ) : (
                    <p>Selectați un mesaj pentru a vedea detalii.</p>
                )}
            </div>
        </div>
    );
}

export default Notifications;
