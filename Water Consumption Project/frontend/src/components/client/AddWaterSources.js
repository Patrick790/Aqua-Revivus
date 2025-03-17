import React, { useEffect, useState } from "react";
import "./AddWaterSources.css";

function AddWaterSources() {
    const [selectedHousehold, setSelectedHousehold] = useState("");
    const [sources, setSources] = useState([{ name: "", type: "" }]);
    const [households, setHouseholds] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // Adăugat pentru mesaj de succes
    const [isMessageHidden, setIsMessageHidden] = useState(false); // Adăugat pentru ascunderea mesajului
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
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error(`Error: ${response.status}`);
                const data = await response.json();
                setHouseholds(data);
            } catch (error) {
                console.error("Error fetching households:", error);
            }
        }
        fetchHouseholds();
    }, []);

    const handleAddSource = () => {
        setSources([...sources, { name: "", type: "" }]);
        setErrorMessage(""); // Resetează mesajul de eroare
    };

    const handleRemoveSource = (index) => {
        setSources(sources.filter((_, i) => i !== index));
        setErrorMessage(""); // Resetează mesajul de eroare
    };

    const handleChangeSource = (index, field, value) => {
        const updatedSources = [...sources];
        updatedSources[index][field] = value;
        setSources(updatedSources);
        setErrorMessage(""); // Resetează mesajul de eroare la completarea câmpurilor
    };

    const handleChangeHousehold = (value) => {
        setSelectedHousehold(value);
        setErrorMessage(""); // Resetează mesajul de eroare la selectarea unei locuințe
    };

    const handleSubmitSources = async () => {
        setErrorMessage(""); // Resetează orice mesaj de eroare
        setSuccessMessage(""); // Resetează mesajul de succes
        setIsMessageHidden(false);

        // Validare: Verifică dacă este selectată o locuință
        if (!selectedHousehold) {
            setErrorMessage("Selectați o locuință!");
            return;
        }

        // Validare: Verifică dacă există cel puțin o sursă validă
        const hasValidSource = sources.some(source => source.name.trim() && source.type.trim());
        if (!hasValidSource) {
            setErrorMessage("Completați cel puțin o sursă cu nume și tip!");
            return;
        }

        try {
            const formattedSources = sources
                .filter(source => source.name.trim() && source.type.trim()) // Filtrare surse valide
                .map(source => ({
                    name: source.name,
                    householdId: parseInt(selectedHousehold, 10),
                    type: source.type,
                }));

            const response = await fetch("http://localhost:8080/sources/bulk", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formattedSources),
            });

            if (!response.ok) throw new Error(`Error: ${response.status}`);

            setSuccessMessage("Sursele au fost adăugate cu succes!"); // Mesaj de succes
            setTimeout(() => setIsMessageHidden(true), 4000); // Ascunde mesajul după 4 secunde
            setTimeout(() => setSuccessMessage(""), 5000); // Șterge mesajul după 5 secunde
            setSources([{ name: "", type: "" }]); // Reset form
            setSelectedHousehold(""); // Reset selected household
        } catch (error) {
            console.error("Error submitting sources:", error);
            setErrorMessage("Eroare la adăugarea surselor!");
        }
    };

    return (
        <div className="add-water-sources-container">
            <div className="form-section">
                <h2>Adaugă Surse de Apă</h2>

                <label>
                    Selectați locuința:
                    <select
                        value={selectedHousehold}
                        onChange={(e) => handleChangeHousehold(e.target.value)}
                    >
                        <option value="">Selectați</option>
                        {households.map((household) => (
                            <option key={household.id} value={household.id}>
                                {household.name}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="sources-list">
                    {sources.map((source, index) => (
                        <div className="source-row" key={index}>
                            <input
                                type="text"
                                placeholder="Nume"
                                value={source.name}
                                onChange={(e) => handleChangeSource(index, "name", e.target.value)}
                            />
                            <select
                                value={source.type}
                                onChange={(e) => handleChangeSource(index, "type", e.target.value)}
                            >
                                <option value="">Tip</option>
                                <option value="Baie">Baie</option>
                                <option value="Bucătărie">Bucătărie</option>
                            </select>
                            <button
                                className="delete-button-add-source"
                                onClick={() => handleRemoveSource(index)}
                            >
                                Șterge
                            </button>
                        </div>
                    ))}
                </div>

                <button className="add-source-button" onClick={handleAddSource}>
                    <span className="plus-sign">+</span>
                </button>

                {successMessage && (
                    <p className={`success-message ${isMessageHidden ? "hidden" : ""}`}>
                        {successMessage}
                    </p>
                )}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button className="submit-sources-button" onClick={handleSubmitSources}>
                    Adaugă Sursele
                </button>
            </div>
        </div>
    );
}

export default AddWaterSources;
