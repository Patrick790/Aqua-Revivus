import React, {useEffect, useState} from "react";
import './ConsumptionHistory.css';
import {getAverageOfList, getMissingPeriods} from "../../utils/utils";

const fetchPersonTypesData = async () => {
    const url = "http://localhost:8080/personTypes";
    const token = localStorage.getItem("authToken");
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
        return result;
    } catch (err) {
        console.error("Error fetching data:", err);
    }
};

const fetchPeopleOfLoggedInUser = async () => {
    const userId = localStorage.getItem("userId");
    const url = `http://localhost:8080/persons/user/${userId}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        console.error("Error fetching data:", err);
    }
}

const fetchHouseholdsOfLoggedInUser = async () => {
    const userId = localStorage.getItem("userId");
    const url = `http://localhost:8080/households/user/${userId}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        console.error("Error fetching data:", err);
    }
}

function getColoursOfConumption(consumption, person) {
    let personData = fetchPersonTypesData();
    let colourLower='#00ff00', colourMiddle='#ffcc00', colourUpper='#ff0000';

    //valoarea returnata va fi o lista de 3 stringuri, fiecare string reprezentand o culoare
    return [colourLower, colourMiddle, colourUpper];
}

function getLimitsOfConumption(consumption, person) {
    let personData = fetchPersonTypesData();
    let limitLower=32, limitUpper=45;

    //valoarea returnata va fi o lista de 2 numere, fiecare numar reprezentand o limita
    return [limitLower, limitUpper];
}

function getAmountColor(amount)
{
    let limits = getLimitsOfConumption();
    let colours = getColoursOfConumption();
    if (amount < limits[0])
    {
        return colours[0];
    }
    else if (amount < limits[1])
    {
        return colours[1];
    }
    else
    {
        return colours[2];
    }
}

function DivMissingPeriods(missingPeriods)
{
    return (
        missingPeriods.length > 0 ?

            <div>
                <a style={{color: "red"}}>Nu ati raportat consum in perioadele:</a>
                <ul>
                    {missingPeriods.map((period, index) => {
                        return <li key={index}>{period}</li>;
                    })}
                </ul>
            </div> : null
    )
}

function DivConsumptionHistory(periods, data, average, households)
{
    console.log(periods);
    return (
        periods.length > 0 ?
            <div>

                <h1>Istoric consum</h1>

                <a style={{fontWeight: "bold", alignContent: "center"}}>Medie consum lunar:<br></br></a>
                <a style={{color: getAmountColor(average), fontWeight: "bold", alignContent: "center"}}>{average} m3</a>
                <br></br>

                <select>
                    <option value="all">Toate locuintele</option>
                    <option value="current">Locuinta curenta</option>
                </select>

                <a style={{fontWeight: "bold", alignContent: "center"}}>Medie consum lunar pentru aceasta locuinta:<br></br></a>
                <a style={{color: getAmountColor(average), fontWeight: "bold", alignContent: "center"}}>{average} m3</a>
                <br></br>

                <DivMissingPeriods
                    missingPeriods={getMissingPeriods(periods)}
                />

                <table>
                    <thead>
                    <tr>
                        <th>De la</th>
                        <th>Pana la</th>
                        <th>Sursa</th>
                        <th>Locuință</th>
                        <th>Consum</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((row, index) => {
                        return <tr key={index}>
                            <td>{row.createdAt.substr(0, 10)}</td>
                            <td>{row.untilAt.substr(0, 10)}</td>
                            <td>{row.sourceName}</td>
                            <td>{row.householdName}</td>
                            <td style={{color: getAmountColor(row.amount)}}><b>{row.amount}</b>m3</td>
                        </tr>;
                    })}
                    </tbody>
                </table>

            </div>

            : <div><h2>Niciun consum raportat.<br></br>Adaugati consumul de apa folosind sectiunea "Valoarea
                contorului".</h2></div>
    );
}

function ConsumptionHistory() {

    const [data, setData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("authToken");

    async function getConsumptionHistory () {
        const response = await fetch('http://localhost:8080/consumptions/history/' + userId, {
            method: 'GET',
            headers: {
                // "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        setIsLoaded(true);
        return await response.json();
    }

    useEffect(() => {
        async function getData() {
            const res = await getConsumptionHistory();
            setData(res);
        }
        getData();
    }, []);

    let consumptions = data.map((row) => row.amount);
    let average = getAverageOfList(consumptions);
    let periods = data.map((row) => [row.createdAt, row.untilAt]);
    console.log(data);

    return (
        isLoaded ?
            <div className="water-consumption-history">
                {DivConsumptionHistory(periods, data, average)}
            </div>
            : <div><h2>Se incarca...</h2></div>
    );
}

export default ConsumptionHistory;
