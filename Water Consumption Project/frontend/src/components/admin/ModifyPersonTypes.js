import React, { useState, useEffect } from "react";
import './ModifyPersonTypes.css';
import PersonTypeTable from "./PersonTypeTable";

function ModifyPersonTypes() {
    const [data, setData] = useState([]); // State for storing data
    const [id, setId] = useState(0);
    const [lowerAge, setLowerAge] = useState(0);
    const [upperAge, setUpperAge] = useState(0);
    const [gender, setGender] = useState("");
    const [lowerBracket, setLowerBracket] = useState(0);
    const [upperBracket, setUpperBracket] = useState(0);
    const [colorUnder, setColorUnder] = useState("#ffffff");
    const [colorBetween, setColorBetween] = useState("#ffffff");
    const [colorOver, setColorOver] = useState("#ffffff");
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const token = localStorage.getItem("authToken");

    // Fetch data for the table
    const fetchData = async () => {
        const url = "http://localhost:8080/personTypes"; // Replace with your API endpoint
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
            setData(result); // Store the fetched data in state
        } catch (err) {
            setErrorMessage(err.message);
        }
    };

    // Use effect to fetch data when component mounts
    useEffect(() => {
        fetchData();
    }, []);

    // Clears all form fields
    function clearFormFields() {
        setId(0);
        setLowerAge(0);
        setUpperAge(0);
        setGender("");
        setLowerBracket(0);
        setUpperBracket(0);
        setColorUnder("#ffffff");
        setColorBetween("#ffffff");
        setColorOver("#ffffff");
    }

    const handleRowSelect = (personType) => {
        setId(personType.id);
        setLowerAge(personType.lowerAge);
        setUpperAge(personType.upperAge);
        setGender(personType.gender);
        setLowerBracket(personType.lowerBracket);
        setUpperBracket(personType.upperBracket);
        setColorUnder(personType.colorUnder);
        setColorBetween(personType.colorBetween);
        setColorOver(personType.colorOver);
    };

    const handleInputChange = (setter, field) => (e) => {
        setter(e.target.value);
        setErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
        setErrorMessage("");
    };

    async function modifyPersonType() {
        const newErrors = {};
        if (!id) newErrors.id = true;
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

        const url = `http://localhost:8080/personTypes/${id}`;
        try {
            const response = await fetch(url, {
                method: "PUT",
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
                    colorOver
                })
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            await response.json();
            alert("Modificare cu succes!");
            fetchData(); // Trigger re-fetch after modification
        } catch (error) {
            console.error(error.message);
            alert("A apărut o eroare!");
        }
    }

    async function deletePersonType() {
        const newErrors = {};
        if (!id) newErrors.id = true;
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

        const url = `http://localhost:8080/personTypes/${id}`;
        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            alert("Ștergere efectuată cu succes!");

            // 1) Refresh the table data so the deleted item is removed
            await fetchData();

            // 2) Clear the form fields so the deleted record is no longer shown
            clearFormFields();
        } catch (error) {
            console.error(error.message);
            alert("A apărut o eroare!");
        }
    }

    return (
        <div className="dashboard-form-lateral">
            <div>
                <PersonTypeTable data={data} onRowSelect={handleRowSelect} />
            </div>
            <div className="form-wrapper">
                <div className="dashboard-form-lateral">
                    <div className={`input-container ${errors.lowerBracket ? 'error' : ''}`}>
                        <input
                            type="number"
                            value={lowerBracket}
                            onChange={handleInputChange(setLowerBracket, 'lowerBracket')}
                            placeholder=" "
                            required
                        />
                        <label>Limita inferioară de apă</label>
                    </div>
                    <div className={`input-container ${errors.upperBracket ? 'error' : ''}`}>
                        <input
                            type="number"
                            value={upperBracket}
                            onChange={handleInputChange(setUpperBracket, 'upperBracket')}
                            placeholder=" "
                            required
                        />
                        <label>Limita superioară de apă</label>
                    </div>
                </div>
                <div className="dashboard-form-lateral">
                    <div className={`input-container ${errors.gender ? 'error' : ''}`}>
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
                    <div className={`input-container ${errors.gender ? 'error' : ''}`}>
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
                    <div className={`input-container ${errors.lowerAge ? 'error' : ''}`}>
                        <input
                            type="number"
                            value={lowerAge}
                            onChange={handleInputChange(setLowerAge, 'lowerAge')}
                            placeholder=" "
                            required
                        />
                        <label>Vârsta minimă</label>
                    </div>
                    <div className={`input-container ${errors.upperAge ? 'error' : ''}`}>
                        <input
                            type="number"
                            value={upperAge}
                            onChange={handleInputChange(setUpperAge, 'upperAge')}
                            placeholder=" "
                            required
                        />
                        <label>Vârsta maximă</label>
                    </div>
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button
                    className="btn"
                    onClick={modifyPersonType}
                    disabled={id === 0} // Disable button if no row is selected
                >
                    Modifică categoria de persoană
                </button>

                <button
                    className="btn"
                    style={{ marginTop: 10 }}
                    onClick={deletePersonType}
                    disabled={id === 0} // Disable button if no row is selected
                >
                    Șterge categoria de persoană
                </button>
            </div>
        </div>
    );
}

export default ModifyPersonTypes;
