import React, { useState, useEffect } from 'react';
import './Ranking.css';
import firstPlaceImage from './loc1.jpg';
import secondPlaceImage from './loc2.jpg';
import thirdPlaceImage from './loc3.jpg';
import { useNavigate } from 'react-router-dom';

const Ranking = () => {
    const [rankings, setRankings] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [currentMonth, setCurrentMonth] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        fetchRankings();
        fetchLoggedInUser();
        setCurrentMonth(new Date().toLocaleString('default', { month: 'long' }));
    }, []);

    const fetchRankings = async () => {
        try {
            console.error("here")
            const response = await fetch('http://localhost:8080/households/ranking', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Rankings data:", data);
                setRankings(data);
            } else {
                console.error('Failed to fetch rankings', response.status);
            }
        } catch (error) {
            console.error('Error fetching rankings:', error);
        }
    };

    const fetchLoggedInUser = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error("User ID not found in localStorage");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
            });

            if (response.ok) {
                const userData = await response.json();
                console.log("Logged-in user data:", userData);
                setLoggedInUser(userData);
            } else {
                console.error('Failed to fetch logged-in user data', response.status);
            }
        } catch (error) {
            console.error('Error fetching logged-in user data:', error);
        }
    };

    const getPositionImage = (index) => {
        switch (index) {
            case 0:
                return <img src={firstPlaceImage} alt="First Place" className="position-image" />;
            case 1:
                return <img src={secondPlaceImage} alt="Second Place" className="position-image" />;
            case 2:
                return <img src={thirdPlaceImage} alt="Third Place" className="position-image" />;
            default:
                return index + 1;
        }
    };

    return (
        <div className="household-details-wrapper">
            <nav className="household-details-nav">
                <button onClick={() => navigate('/dashboard')}>Înapoi</button>
            </nav>
            <div className="ranking-container">
                <h2>Clasament Utilizatori - {currentMonth}</h2>
                <div className="ranking-table-container">
                    <table className="ranking-table">
                        <thead>
                        <tr>
                            <th>Poziție</th>
                            <th>Nume Utilizator</th>
                            <th>Consum Total</th>
                            <th>Consum Minim All Time</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rankings
                            .filter(ranking => ranking.totalConsumption > 0)
                            .slice(0, 7)
                            .map((ranking, index) => {
                                const isHighlighted = loggedInUser && ranking.userId === loggedInUser.id;
                                console.log(`Ranking User ID: ${ranking.userId}, Logged In User ID: ${loggedInUser?.id}, Highlighted: ${isHighlighted}`);

                                return (
                                    <tr
                                        key={index}
                                        className={isHighlighted ? 'highlighted-row' : ''}
                                    >
                                        <td>{getPositionImage(index)}</td>
                                        <td>{ranking.userName}</td>
                                        <td>{ranking.totalConsumption.toFixed(2)} m³</td>
                                        <td>{ranking.minConsumption.toFixed(2)} m³</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Ranking;