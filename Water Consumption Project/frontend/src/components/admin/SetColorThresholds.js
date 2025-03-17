import React, { useEffect, useState } from "react";
import "./SetColorThresholds.css";

function SetColorThresholds() {
    const [data, setData] = useState([]); // The entire list of person types
    const [errorMessage, setErrorMessage] = useState("");

    // The "current" colors shown in the top section (read-only).
    // If there's at least one entry in the DB, we display data[0]'s colors;
    // otherwise, we display "undefined."
    const [currentColorUnder, setCurrentColorUnder] = useState(undefined);
    const [currentColorBetween, setCurrentColorBetween] = useState(undefined);
    const [currentColorOver, setCurrentColorOver] = useState(undefined);

    // The new colors the user wants to apply to ALL person types.
    // These are in the bottom section with editable color pickers.
    const [colorUnder, setColorUnder] = useState("#ffffff");
    const [colorBetween, setColorBetween] = useState("#ffffff");
    const [colorOver, setColorOver] = useState("#ffffff");
    const token = localStorage.getItem("authToken");

    // Fetch data from backend
    const fetchData = async () => {
        const url = "http://localhost:8080/personTypes";
        try {
            const response = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const result = await response.json();
            console.log("Fetched personTypes:", result);
            setData(result);
        } catch (err) {
            console.error(err.message);
            setErrorMessage(err.message);
        }
    };

    // When the component first mounts, load the data
    useEffect(() => {
        fetchData();
    }, []);

    // Whenever 'data' changes, update the "read-only" colors to match the first entry (if any).
    useEffect(() => {
        if (data.length > 0) {
            // Use the first person's colors in the database
            setCurrentColorUnder(data[0].colorUnder);
            setCurrentColorBetween(data[0].colorBetween);
            setCurrentColorOver(data[0].colorOver);
        } else {
            // If no entries, set them to undefined
            setCurrentColorUnder(undefined);
            setCurrentColorBetween(undefined);
            setCurrentColorOver(undefined);
        }
    }, [data]);

    // Function to update colors for ALL personTypes in the DB
    const saveColors = async () => {
        try {
            for (const personType of data) {
                const url = `http://localhost:8080/personTypes/${personType.id}`;
                await fetch(url, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        lowerAge: personType.lowerAge,
                        upperAge: personType.upperAge,
                        lowerBracket: personType.lowerBracket,
                        upperBracket: personType.upperBracket,
                        gender: personType.gender,
                        colorUnder: colorUnder,
                        colorBetween: colorBetween,
                        colorOver: colorOver,
                    }),
                });
            }

            alert("Culorile pentru praguri au fost modificate cu succes!");
            // Re-fetch so we can see the updated data (if needed for anything else)
            fetchData();
        } catch (error) {
            console.error("Failed to update colors:", error.message);
            alert("A apărut o eroare în încercarea de a schimba culorile pragurilor.");
        }
    };

    return (
        <div className="form-wrapper">
            {/* -- TOP SECTION: Display the FIRST person's colors (read-only) -- */}
            <div className="dashboard-form-lateral">
                <div className="input-container">
                    {/* If currentColorUnder is undefined, show a message; otherwise, show the color. */}
                    {currentColorUnder !== undefined ? (
                        <input
                            type="color"
                            value={currentColorUnder}
                            readOnly
                            required
                            style={{
                                backgroundColor: currentColorUnder,
                                pointerEvents: "none",
                                opacity: 0.7,
                            }}
                        />
                    ) : (
                        <p>undefined</p>
                    )}
                    <label>Actuala culoare sub medie</label>
                </div>

                <div className="input-container">
                    {currentColorBetween !== undefined ? (
                        <input
                            type="color"
                            value={currentColorBetween}
                            readOnly
                            required
                            style={{
                                backgroundColor: currentColorBetween,
                                pointerEvents: "none",
                                opacity: 0.7,
                            }}
                        />
                    ) : (
                        <p>undefined</p>
                    )}
                    <label>Actuala culoare mediană</label>
                </div>

                <div className="input-container">
                    {currentColorOver !== undefined ? (
                        <input
                            type="color"
                            value={currentColorOver}
                            readOnly
                            required
                            style={{
                                backgroundColor: currentColorOver,
                                pointerEvents: "none",
                                opacity: 0.7,
                            }}
                        />
                    ) : (
                        <p>undefined</p>
                    )}
                    <label>Actuala culoare peste medie</label>
                </div>
            </div>

            <div>
                <h2 className="modify-colors">
                    Apasă câmpurile de sub textul de mai jos pentru a selecta culoarea dorită
                </h2>
            </div>

            {/* -- BOTTOM SECTION: Let user pick NEW colors to apply to ALL personTypes -- */}
            <div className="dashboard-form-lateral">
                <div className="input-container">
                    <input
                        type="color"
                        value={colorUnder}
                        onChange={(e) => setColorUnder(e.target.value)}
                        style={{ backgroundColor: colorUnder }}
                        required
                    />
                    <label>Setează culoarea sub medie</label>
                </div>
                <div className="input-container">
                    <input
                        type="color"
                        value={colorBetween}
                        onChange={(e) => setColorBetween(e.target.value)}
                        style={{ backgroundColor: colorBetween }}
                        required
                    />
                    <label>Setează culoarea mediană</label>
                </div>
                <div className="input-container">
                    <input
                        type="color"
                        value={colorOver}
                        onChange={(e) => setColorOver(e.target.value)}
                        style={{ backgroundColor: colorOver }}
                        required
                    />
                    <label>Setează culoarea peste medie</label>
                </div>
            </div>

            {/* -- Save button (disabled if no data in the table) -- */}
            <button className="btn" onClick={saveColors} disabled={data.length === 0}>
                Salvează culorile stabilite
            </button>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default SetColorThresholds;
