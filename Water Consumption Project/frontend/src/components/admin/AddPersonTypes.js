import React, { useState, useEffect } from "react";
import './AddPersonTypes.css';

function AddPersonTypes() {
    const [lowerAge, setLowerAge] = useState(0);
    const [upperAge, setUpperAge] = useState(0);
    const [gender, setGender] = useState("");
    const [lowerBracket, setLowerBracket] = useState(0);
    const [upperBracket, setUpperBracket] = useState(0);

    const [colorUnder, setColorUnder] = useState("");
    const [colorBetween, setColorBetween] = useState("");
    const [colorOver, setColorOver] = useState("");

    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    const token = localStorage.getItem("authToken");

    useEffect(() => {
        async function fetchPersonTypes() {
            try {
                const response = await fetch("http://localhost:8080/personTypes", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch existing person types");
                }
                const data = await response.json();

                if (Array.isArray(data) && data.length > 0) {
                    setColorUnder(data[0].colorUnder);
                    setColorBetween(data[0].colorBetween);
                    setColorOver(data[0].colorOver);
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchPersonTypes();
    }, []);

    const handleInputChange = (setter, field) => (e) => {
        setter(e.target.value);
        setErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
        setErrorMessage("");
    };

    async function addPersonType() {
        const newErrors = {};
        if (!lowerAge) newErrors.lowerAge = true;
        if (!upperAge) newErrors.upperAge = true;
        if (!lowerBracket) newErrors.lowerBracket = true;
        if (!upperBracket) newErrors.upperBracket = true;
        if (!gender) newErrors.gender = true;
        if (!colorUnder) newErrors.colorUnder = true;
        if (!colorBetween) newErrors.colorBetween = true;
        if (!colorOver) newErrors.colorOver = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setErrorMessage("Toate câmpurile sunt obligatorii!");
            return;
        }

        const url = "http://localhost:8080/personTypes";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    lowerAge,
                    upperAge,
                    lowerBracket,
                    upperBracket,
                    gender,
                    colorUnder,
                    colorBetween,
                    colorOver,
                }),
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            try {
                const json = await response.json();
                console.log(json);
                alert("Adăugare cu succes!");
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
                <div className={`input-container ${errors.lowerBracket ? "error" : ""}`}>
                    <input
                        type="number"
                        value={lowerBracket}
                        onChange={handleInputChange(setLowerBracket, "lowerBracket")}
                        placeholder=" "
                        required
                    />
                    <label>Limita inferioară de apă</label>
                </div>
                <div className={`input-container ${errors.upperBracket ? "error" : ""}`}>
                    <input
                        type="number"
                        value={upperBracket}
                        onChange={handleInputChange(setUpperBracket, "upperBracket")}
                        placeholder=" "
                        required
                    />
                    <label>Limita superioară de apă</label>
                </div>
            </div>
            <div className="dashboard-form-lateral">
                <div className={`input-container ${errors.gender ? "error" : ""}`}>
                    <input
                        type="radio"
                        name="gender"
                        value="masculin"
                        checked={gender === "masculin"}
                        onChange={(e) => setGender(e.target.value)}
                        required
                    />
                    <label>Bărbat</label>
                </div>
                <div className={`input-container ${errors.gender ? "error" : ""}`}>
                    <input
                        type="radio"
                        name="gender"
                        value="feminin"
                        checked={gender === "feminin"}
                        onChange={(e) => setGender(e.target.value)}
                        required
                    />
                    <label>Femeie</label>
                </div>
                <div className={`input-container ${errors.lowerAge ? "error" : ""}`}>
                    <input
                        type="number"
                        value={lowerAge}
                        onChange={handleInputChange(setLowerAge, "lowerAge")}
                        placeholder=" "
                        required
                    />
                    <label>Vârsta minimă</label>
                </div>
                <div className={`input-container ${errors.upperAge ? "error" : ""}`}>
                    <input
                        type="number"
                        value={upperAge}
                        onChange={handleInputChange(setUpperAge, "upperAge")}
                        placeholder=" "
                        required
                    />
                    <label>Vârsta maximă</label>
                </div>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="btn" onClick={addPersonType}>
                Adaugă categorie de persoană
            </button>
        </div>
    );
}

export default AddPersonTypes;