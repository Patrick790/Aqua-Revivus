import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";
import AddHousehold from "./AddHousehold";
import AddWaterSources from "./AddWaterSources";
import MeterValue from "./MeterValue";
import RecyclingInfo from "./RecyclingInfo";
import ConsumptionHistory from "./ConsumptionHistory";
import userIcon from "./user-286.png";
import logo from "./Logo.png";
import Messages from "../utils/Messages";
import Notifications from "./Notifications";

function Dashboard() {
    const [activeTab, setActiveTab] = useState(
        () => localStorage.getItem("activeTab") || ""
    );
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
    const navigate = useNavigate();

    const dropdownRef = useRef(null);
    const iconRef = useRef(null);

    useEffect(() => {
        localStorage.setItem("activeTab", activeTab);
    }, [activeTab]);

    const renderContent = () => {
        if (showWelcomeMessage) {
            return (
                <div className="welcome-message">
                    Aqua Revivus
                    <div className="welcome-message2">- water consumption management -</div>
                </div>
            );
        }
        switch (activeTab) {
            case "addHousehold":
                return <AddHousehold />;
            case "addWaterSources":
                return <AddWaterSources />;
            case "meterValue":
                return <MeterValue />;
            case "recyclingInfo":
                return <RecyclingInfo />;
            case "consumptionHistory":
                return <ConsumptionHistory />;
            case "messages":
                return <Messages userId={localStorage.getItem("userId")}/>;
            case "notifications":
                return <Notifications />
            default:
                return null;
        }
    };

    const handleMouseEnter = () => {
        setIsDropdownVisible(true);
    };

    const handleMouseLeave = () => {
        setIsDropdownVisible(false);
    };

    const handleClickOutside = (e) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(e.target) &&
            iconRef.current &&
            !iconRef.current.contains(e.target)
        ) {
            setIsDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("activeTab");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userId");
        navigate('/login', { replace: true });
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setShowWelcomeMessage(false);
    };

    return (
        <div className="dashboard animated-dashboard">
            <header className="dashboard-header">
                <div className="header-left">
                    <img src={logo} alt="Aqua Revivus Logo" className="logo" />
                    <span>Clients</span>
                </div>
                <div
                    className="header-right"
                    ref={iconRef}
                    onMouseEnter={handleMouseEnter}
                >
                    <img
                        src={userIcon}
                        alt="User Icon"
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/40";
                            console.error("Imaginea nu a fost găsită!");
                        }}
                    />
                    <div
                        className="dropdown-container"
                        ref={dropdownRef}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div
                            className={`dropdown-menu ${
                                isDropdownVisible ? "show" : ""
                            }`}
                        >
                            <ul>
                                <li onClick={() => navigate("/account")}>
                                    Informații cont
                                </li>
                                <li onClick={() => navigate("/householdDetails")}>
                                    Locuințe
                                </li>
                                <li onClick={() => navigate("/ranking")}>
                                    Clasament
                                </li>
                                <li onClick={handleLogout}>Delogare</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>
            <nav className="dashboard-nav">
                <ul>
                    <li
                        onClick={() => handleTabClick("addHousehold")}
                        className={activeTab === "addHousehold" ? "active" : ""}
                    >
                        Adaugă locuință
                    </li>
                    <li
                        onClick={() => handleTabClick("addWaterSources")}
                        className={activeTab === "addWaterSources" ? "active" : ""}
                    >
                        Adaugă surse de apă
                    </li>
                    <li
                        onClick={() => handleTabClick("meterValue")}
                        className={activeTab === "meterValue" ? "active" : ""}
                    >
                        Valoarea contorului
                    </li>
                    <li
                        onClick={() => handleTabClick("recyclingInfo")}
                        className={activeTab === "recyclingInfo" ? "active" : ""}
                    >
                        Informații reciclare
                    </li>
                    <li
                        onClick={() => handleTabClick("consumptionHistory")}
                        className={
                            activeTab === "consumptionHistory" ? "active" : ""
                        }
                    >
                        Istoric consum
                    </li>
                    <li
                        onClick={() => handleTabClick("messages")}
                        className={
                            activeTab === "messages" ? "active" : ""
                        }
                    >
                        Mesaje
                    </li>
                    <li
                        onClick={() => handleTabClick("notifications")}
                        className={
                            activeTab === "notifications" ? "active" : ""
                        }
                    >
                        Notificări
                    </li>
                </ul>
            </nav>
            <main className="dashboard-content">{renderContent()}</main>
        </div>
    );
}

export default Dashboard;