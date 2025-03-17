import React, { useState } from "react";
import "./AddHousehold.css";

function AddHousehold() {
    const [householdName, setHouseholdName] = useState("");
    const [address, setAddress] = useState("");
    const [type, setType] = useState("");
    const [area, setArea] = useState("");
    const [surfaceArea, setSurfaceArea] = useState("");
    const [persons, setPersons] = useState([{ name: "", birthDate: "", gender: "" }]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("authToken");

    const handleAddPerson = () => {
        setPersons([...persons, { name: "", birthDate: "", gender: "" }]);
    };

    const handleRemovePerson = (index) => {
        const updatedPersons = persons.filter((_, i) => i !== index);
        setPersons(updatedPersons);
    };

    const handleChangePerson = (index, field, value) => {
        const updatedPersons = [...persons];
        updatedPersons[index][field] = value;
        setPersons(updatedPersons);
    };

    const handleSubmitHousehold = async () => {
        if (!householdName || !address || !type || !area || !surfaceArea) {
            setError("Toate câmpurile trebuie completate.");
            setSuccess("");
            return;
        }

        const isAnyPersonValid = persons.some(
            (person) => person.name && person.birthDate && person.gender
        );

        if (!isAnyPersonValid) {
            setError("Trebuie să adăugați cel puțin un locuitor.");
            setSuccess("");
            return;
        }

        setError("");

        const householdData = {
            name: householdName,
            address,
            type,
            area,
            surface: parseFloat(surfaceArea),
            persons,
        };

        try {
            if (!userId) {
                setError("User ID is not available.");
                setSuccess("");
                return;
            }

            const response = await fetch(`http://localhost:8080/households/addWithPeople/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(householdData),
            });

            if (response.ok) {
                setSuccess("Locuință adăugată cu succes!");
                setHouseholdName("");
                setAddress("");
                setType("");
                setArea("");
                setSurfaceArea("");
                setPersons([{ name: "", birthDate: "", gender: "" }]);
            } else {
                const errorMessage = await response.text();
                setError(`Error saving: ${errorMessage}`);
                setSuccess("");
            }
        } catch (error) {
            console.error("Error submitting request:", error);
            setError("An error occurred while connecting to the server.");
            setSuccess("");
        }
    };

    return (
        <div className="add-household-container">
            <div className="form-section-add-household household-form">
                <h2>Adaugă Locuință</h2>
                <label className="add-household-label">
                    Nume locuință:
                    <input
                        type="text"
                        value={householdName}
                        onChange={(e) => setHouseholdName(e.target.value)}
                        placeholder="Introduceți numele locuinței"
                    />
                </label>
                <label className="add-household-label">
                    Adresă:
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Introduceți adresa"
                    />
                </label>
                <label className="add-household-label">
                    Tip locuință:
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="">Selectați</option>
                        <option value="casa">Casă</option>
                        <option value="apartament">Apartament</option>
                    </select>
                </label>
                <label className="add-household-label">
                    Mediu:
                    <select
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                    >
                        <option value="">Selectați</option>
                        <option value="rural">Rural</option>
                        <option value="urban">Urban</option>
                    </select>
                </label>
                <label className="add-household-label">
                    Suprafața locuinței (mp):
                    <input
                        type="number"
                        value={surfaceArea}
                        onChange={(e) => setSurfaceArea(e.target.value)}
                        placeholder="Introduceți suprafața"
                    />
                </label>
                <button
                    className="submit-household-button"
                    onClick={handleSubmitHousehold}
                >
                    Adaugă Locuința
                </button>
                {error && <p className="error-message-addHousehold">{error}</p>}
                {success && <p className="success-message-addHousehold">{success}</p>}
            </div>
            <div className="form-section-add-household persons-section">
                <h2>Persoane care locuiesc:</h2>
                <div className="persons-list">
                    {persons.map((person, index) => (
                        <div className="person-row" key={index}>
                            <input
                                type="text"
                                placeholder="Nume"
                                value={person.name}
                                onChange={(e) =>
                                    handleChangePerson(index, "name", e.target.value)
                                }
                            />
                            <input
                                type="date"
                                value={person.birthDate}
                                onChange={(e) =>
                                    handleChangePerson(index, "birthDate", e.target.value)
                                }
                            />
                            <select
                                value={person.gender}
                                onChange={(e) =>
                                    handleChangePerson(index, "gender", e.target.value)
                                }
                            >
                                <option value="">Gen</option>
                                <option value="masculin">Masculin</option>
                                <option value="feminin">Feminin</option>
                            </select>
                            <button
                                className="delete-button"
                                onClick={() => handleRemovePerson(index)}
                            >
                                Șterge
                            </button>
                        </div>
                    ))}
                </div>
                <button className="add-person-button" onClick={handleAddPerson}>
                    <span className="plus-sign">+</span>
                </button>
            </div>
        </div>
    );
}

export default AddHousehold;