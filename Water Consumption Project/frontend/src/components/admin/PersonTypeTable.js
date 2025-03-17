import React from "react";
import './PersonTypeTable.css'; // Optional for styling

function PersonTypeTable({ data, onRowSelect }) {
    if (!data || data.length === 0) {
        return <p>No data available</p>;
    }

    // Handle row click and notify the parent
    const handleRowClick = (personType) => {
        onRowSelect(personType); // Call the passed function to notify parent
    };

    // Render table inside a div
    return (
        <div className="table-wrapper">
            <h2>Categoriile de vârstă</h2>
            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Vârsta inferioară</th>
                        <th>Vârsta superioară</th>
                        <th>Genul</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((item) => (
                        <tr key={item.id} onClick={() => handleRowClick(item)} style={{ cursor: "pointer" }}>
                            <td>{item.lowerAge}</td>
                            <td>{item.upperAge}</td>
                            <td>{item.gender}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PersonTypeTable;
