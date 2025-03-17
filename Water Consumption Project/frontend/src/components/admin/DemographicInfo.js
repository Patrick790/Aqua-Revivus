import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

function DemographicInfo() {
    // 1) HouseholdDTO array and filtered version
    const [households, setHouseholds] = useState([]);
    const [filteredHouseholds, setFilteredHouseholds] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    // 2) Filters for min/max surface
    const [minSurface, setMinSurface] = useState("");
    const [maxSurface, setMaxSurface] = useState("");

    // 3) Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const token = localStorage.getItem("authToken");

    // 4) Fields for Excel export
    // NEW: "ConsumUltimaLuna" checkbox
    const [selectedFields, setSelectedFields] = useState({
        Nume: true,
        Adresa: true,
        Proprietar: true,
        Venit: true,
        NumarRezidenti: true,
        Tip: true,
        Arie: true,
        Suprafata: true,
        ConsumUltimaLuna: false // default un-checked
    });

    // 5) Hover logic for the "Exportă în Excel" button
    const [isHovering, setIsHovering] = useState(false);

    // 6) We store owners in a map: { [householdId]: { id, name, income } }
    const [ownerMap, setOwnerMap] = useState({});

    // 7) We'll store "last month consumption" for each household in a map
    //    { [householdId]: float totalInLastMonth }
    const [lastMonthMap, setLastMonthMap] = useState({});

    // On mount, fetch households => fetch owners => etc.
    useEffect(() => {
        fetchHouseholds();
    }, []);

    async function fetchHouseholds() {
        try {
            const response = await fetch("http://localhost:8080/households/dto", {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`Nu se pot prelua datele: ${response.status}`);
            }
            const data = await response.json();
            setHouseholds(data);
            setFilteredHouseholds(data);

            // Once loaded, fetch owners for each household in parallel
            const fetchedOwners = await fetchAllOwners(data);
            setOwnerMap(fetchedOwners);

            // Then fetch the last month usage for *all* households
            fetchLastMonthForAllHouseholds();
        } catch (error) {
            console.error(error);
            setErrorMessage(error.message);
        }
    }

    // fetchAllOwners loads GET /households/{id}/owner for each household
    async function fetchAllOwners(householdArray) {
        const promises = householdArray.map(async (h) => {
            try {
                const res = await fetch(`http://localhost:8080/households/${h.id}/owner`, {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!res.ok) {
                    return { householdId: h.id, owner: null };
                }
                const owner = await res.json();
                return { householdId: h.id, owner };
            } catch (err) {
                return { householdId: h.id, owner: null };
            }
        });

        const results = await Promise.all(promises);
        const map = {};
        results.forEach(({ householdId, owner }) => {
            map[householdId] = owner; // or null if no owner
        });
        return map;
    }

    // GET /consumptions/lastMonthAll once, store the results in lastMonthMap
    async function fetchLastMonthForAllHouseholds() {
        try {
            const resp = await fetch("http://localhost:8080/consumptions/lastMonthAll", {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!resp.ok) {
                throw new Error(`Nu se pot prelua datele: ${resp.status}`);
            }
            const data = await resp.json();
            // data is an array of {householdId, lastMonthTotal}
            const map = {};
            data.forEach((item) => {
                map[item.householdId] = item.lastMonthTotal;
            });
            setLastMonthMap(map);
        } catch (err) {
            console.error(err);
            setErrorMessage(err.message);
        }
    }

    // Re-apply filters whenever minSurface, maxSurface, or households change
    useEffect(() => {
        applyFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minSurface, maxSurface, households]);

    function applyFilters() {
        let temp = [...households];
        if (minSurface) {
            const minVal = parseFloat(minSurface);
            temp = temp.filter((h) => h.surface != null && h.surface >= minVal);
        }
        if (maxSurface) {
            const maxVal = parseFloat(maxSurface);
            temp = temp.filter((h) => h.surface != null && h.surface <= maxVal);
        }
        setFilteredHouseholds(temp);
        setCurrentPage(1);
    }

    // Pagination
    const totalPages = Math.ceil(filteredHouseholds.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredHouseholds.slice(startIndex, endIndex);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    // Toggle checkboxes
    function handleCheckboxChange(fieldName) {
        setSelectedFields((prev) => ({
            ...prev,
            [fieldName]: !prev[fieldName],
        }));
    }

    // Style for "Exportă în Excel" button
    const buttonStyle = {
        margin: "1rem",
        padding: "10px",
        border: "none",
        borderRadius: "5px",
        fontSize: "16px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
        backgroundColor: isHovering ? "#0056b3" : "#007bff",
        color: "white",
    };

    function exportToExcel() {
        const fieldsSelected = Object.keys(selectedFields).filter(
            (f) => selectedFields[f]
        );

        // If literally no field is selected, and ConsumUltimaLuna is also false, we show an alert
        if (fieldsSelected.length === 0 && !selectedFields.ConsumUltimaLuna) {
            alert("Trebuie să selectați cel puțin un câmp pentru export!");
            return;
        }

        const mappedRows = filteredHouseholds.map((h) => {
            const rowData = {};
            const owner = ownerMap[h.id];
            const ownerName = owner?.name || "N/A";
            const ownerIncome = owner?.income != null ? owner.income : "N/A";

            // Conditionals for each field
            if (selectedFields.Nume) {
                rowData["Nume"] = h.name || "N/A";
            }
            if (selectedFields.Adresa) {
                rowData["Adresa"] = h.address || "N/A";
            }
            if (selectedFields.Proprietar) {
                rowData["Proprietar"] = ownerName;
            }
            if (selectedFields.Venit) {
                rowData["Venit"] = ownerIncome;
            }
            if (selectedFields.NumarRezidenti) {
                rowData["NrRezidenti"] = h.numberOfResidents;
            }
            if (selectedFields.Tip) {
                rowData["Tip"] = h.type || "N/A";
            }
            if (selectedFields.Arie) {
                rowData["Arie"] = h.area || "N/A";
            }
            if (selectedFields.Suprafata) {
                rowData["Suprafata"] = h.surface != null ? h.surface : "N/A";
            }

            // Conditionally include lastMonth usage
            if (selectedFields.ConsumUltimaLuna) {
                const val = lastMonthMap[h.id] || 0;
                rowData["Consum Ultima Luna"] = val;
            }

            return rowData;
        });

        const worksheet = XLSX.utils.json_to_sheet(mappedRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Locuințe");
        XLSX.writeFile(workbook, "locuinte_filtrate.xlsx");
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "2rem",
            }}
        >
            {errorMessage && (
                <p style={{ color: "red", textAlign: "center" }}>
                    <strong>Eroare:</strong> {errorMessage}
                </p>
            )}

            {/* FILTERS */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", minWidth: "200px" }}>
                    <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
                        Suprafață Minimă:
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        style={{
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid #ddd",
                            fontSize: "16px",
                            width: "170px",
                        }}
                        value={minSurface}
                        onChange={(e) => setMinSurface(e.target.value)}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", minWidth: "200px" }}>
                    <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
                        Suprafață Maximă:
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        style={{
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid #ddd",
                            fontSize: "16px",
                            width: "170px",
                        }}
                        value={maxSurface}
                        onChange={(e) => setMaxSurface(e.target.value)}
                    />
                </div>
            </div>

            {/* CHECKBOXES for columns */}
            <div style={{ textAlign: "center" }}>
                <div
                    style={{
                        display: "flex",
                        gap: "1rem",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        marginTop: "10px",
                    }}
                >
                    <h3 style={{ color: "#0056b3" }}>
                        Selectați câmpurile pentru export:
                    </h3>

                    <label
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        Nume
                        <input
                            type="checkbox"
                            checked={selectedFields.Nume}
                            onChange={() => handleCheckboxChange("Nume")}
                        />
                    </label>

                    <label
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        Adresa
                        <input
                            type="checkbox"
                            checked={selectedFields.Adresa}
                            onChange={() => handleCheckboxChange("Adresa")}
                        />
                    </label>

                    <label
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        Proprietar
                        <input
                            type="checkbox"
                            checked={selectedFields.Proprietar}
                            onChange={() => handleCheckboxChange("Proprietar")}
                        />
                    </label>

                    <label
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        Venit
                        <input
                            type="checkbox"
                            checked={selectedFields.Venit}
                            onChange={() => handleCheckboxChange("Venit")}
                        />
                    </label>

                    <label
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        NumarRezidenti
                        <input
                            type="checkbox"
                            checked={selectedFields.NumarRezidenti}
                            onChange={() => handleCheckboxChange("NumarRezidenti")}
                        />
                    </label>

                    <label
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        Tip
                        <input
                            type="checkbox"
                            checked={selectedFields.Tip}
                            onChange={() => handleCheckboxChange("Tip")}
                        />
                    </label>

                    <label
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        Arie
                        <input
                            type="checkbox"
                            checked={selectedFields.Arie}
                            onChange={() => handleCheckboxChange("Arie")}
                        />
                    </label>

                    <label
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        Suprafata
                        <input
                            type="checkbox"
                            checked={selectedFields.Suprafata}
                            onChange={() => handleCheckboxChange("Suprafata")}
                        />
                    </label>

                    {/* NEW CHECKBOX for lastMonth usage */}
                    <label
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        Consum Ultima Lună
                        <input
                            type="checkbox"
                            checked={selectedFields.ConsumUltimaLuna}
                            onChange={() => handleCheckboxChange("ConsumUltimaLuna")}
                        />
                    </label>
                </div>
            </div>

            {/* TABLE: always show the "Consum Ultima Lună" column in the UI */}
            <table
                border="1"
                cellPadding="5"
                cellSpacing="0"
                style={{ width: "100%", maxWidth: "1000px", marginTop: "10px" }}
            >
                <thead>
                <tr style={{ backgroundColor: "#f7f7f7" }}>
                    <th>Nume</th>
                    <th>Adresa</th>
                    <th>Proprietar</th>
                    <th>Venit</th>
                    <th>Nr. Rezidenți</th>
                    <th>Tip</th>
                    <th>Arie</th>
                    <th>Suprafată</th>
                    <th>Consum Ultima Lună</th>
                </tr>
                </thead>
                <tbody>
                {pageData.map((h) => {
                    // Get the owner from the map
                    const owner = ownerMap[h.id];
                    const ownerName = owner?.name || "N/A";
                    const ownerIncome = owner?.income != null ? owner.income : "N/A";

                    // The last-month total usage from the map
                    const lastMonthTotal = lastMonthMap[h.id] || 0;

                    return (
                        <tr key={h.id}>
                            <td>{h.name || "N/A"}</td>
                            <td>{h.address || "N/A"}</td>
                            <td>{ownerName}</td>
                            <td>{ownerIncome}</td>
                            <td>{h.numberOfResidents}</td>
                            <td>{h.type || "N/A"}</td>
                            <td>{h.area || "N/A"}</td>
                            <td>{h.surface != null ? h.surface : "N/A"}</td>
                            {/* always visible in UI */}
                            <td>{lastMonthTotal}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            {/* PAGINATION + EXPORT (centered) */}
            <div style={{ margin: "1rem 0", textAlign: "center" }}>
                <button
                    style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        fontSize: "16px",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease",
                        marginRight: "5px",
                        padding: "10px",
                    }}
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                >
                    Înapoi
                </button>
                <span style={{ margin: "0 1rem" }}>
          Pagina {currentPage} din {totalPages || 1}
        </span>
                <button
                    style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        fontSize: "16px",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease",
                        marginRight: "5px",
                        padding: "10px",
                    }}
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    Înainte
                </button>

                <button
                    style={buttonStyle}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onClick={exportToExcel}
                    disabled={filteredHouseholds.length === 0}
                >
                    Exportă în Excel
                </button>
            </div>
        </div>
    );
}

export default DemographicInfo;
