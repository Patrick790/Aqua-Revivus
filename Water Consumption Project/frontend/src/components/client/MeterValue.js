import React, { useState, useEffect } from "react";
import "./MeterValue.css";

function MeterValue() {
    const [households, setHouseholds] = useState([]);
    const [selectedHousehold, setSelectedHousehold] = useState("");
    const [sources, setSources] = useState([]);
    const [waterSource, setWaterSource] = useState(""); // will hold the string form of source.id
    const [value, setValue] = useState("");
    const [date, setDate] = useState("");
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        async function fetchHouseholds() {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                console.error("User ID not found in localStorage");
                return;
            }
            try {
                const response = await fetch(`http://localhost:8080/households/user/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                console.log("Fetched households:", data);
                setHouseholds(data);
            } catch (error) {
                console.error("Error fetching households:", error);
            }
        }
        fetchHouseholds();
    }, []);

    useEffect(() => {
        async function fetchSources() {
            if (!selectedHousehold) return; // No household selected yet
            try {
                const response = await fetch(
                    `http://localhost:8080/sources/household/${selectedHousehold}`,
                    {
                        method: 'GET',
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                console.log("Fetched sources:", data);
                setSources(data);
            } catch (error) {
                console.error("Error fetching sources:", error);
            }
        }
        fetchSources();
    }, [selectedHousehold]);

    const handleSubmit = async () => {
        // Basic validation
        if (!selectedHousehold || !waterSource || !value || !date) {
            alert("All fields are required!");
            return;
        }

        // Parse the waterSource string into a number
        const numericSourceId = parseInt(waterSource, 10);
        if (isNaN(numericSourceId)) {
            alert("Invalid source ID! Please select a valid water source.");
            return;
        }

        let createdAt = null;
        try {
            // Use the numericSourceId in the query param
            const lastConsumptionResponse = await fetch(
                `http://localhost:8080/consumptions/last?sourceId=${numericSourceId}`,
                {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            console.log("Response status:", lastConsumptionResponse.status);

            if (lastConsumptionResponse.ok) {
                const textResponse = await lastConsumptionResponse.text();
                console.log("Raw response:", textResponse);
                const lastConsumption = textResponse ? JSON.parse(textResponse) : null;
                createdAt = lastConsumption?.untilAt || null;
            }
        } catch (error) {
            console.error("Error fetching last consumption:", error);
        }

        // Build the POST payload
        const consumptionData = {
            sourceId: numericSourceId,  // use the numeric ID
            amount: parseFloat(value),
            createdAt: createdAt
                ? new Date(createdAt).toISOString()
                : new Date().toISOString(),
            untilAt: new Date(date).toISOString(),
        };
        console.log("Sending payload:", consumptionData);

        try {
            const response = await fetch("http://localhost:8080/consumptions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(consumptionData),
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            alert("Meter value added successfully!");
            setSelectedHousehold("");
            setWaterSource("");
            setValue("");
            setDate("");
        } catch (error) {
            console.error("Error adding meter value:", error);
        }
    };

    return (
        <div className="enter-meter-reading">
            <h2>Adaugă valoarea contorului</h2>
            <div className="form-group">
                <label>Locuință</label>
                <select
                    value={selectedHousehold}
                    onChange={(e) => setSelectedHousehold(e.target.value)}
                >
                    <option value="">Selectează locuință</option>
                    {households.map((household) => (
                        <option key={household.id} value={household.id}>
                            {household.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Sursă de apă</label>
                <select
                    value={waterSource}
                    onChange={(e) => setWaterSource(e.target.value)}
                >
                    <option value="">Selectează sursa de apă</option>
                    {sources.map((source) => (
                        // source.id is presumably numeric from backend
                        <option key={source.id} value={source.id}>
                            {source.name} ({source.type || "N/A"})
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Valoare (metri cubi)</label>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Data</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>
            <button className="submit-value-button" onClick={handleSubmit}>
                Adaugă valoarea
            </button>
        </div>
    );
}

export default MeterValue;