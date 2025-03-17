// AdminDashboard.js
import React, { useState, useEffect, useRef } from "react";
import "./AdminDashboard.css";
import userIcon from "./user-286.png";
import ModifyPersonTypes from "./ModifyPersonTypes";
import AddPersonTypes from "./AddPersonTypes";
import SetColorThresholds from "./SetColorThresholds";
import DemographicInfo from "./DemographicInfo";
import { useNavigate } from "react-router-dom";
import Messages from "../utils/Messages";
import SendNotifications from "./SendNotifications";

function Dashboard() {
    const [activeTab, setActiveTab] = useState("addPersonTypes");
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const navigate = useNavigate();

    const dropdownRef = useRef(null);
    const iconRef = useRef(null);

    useEffect(() => {
        localStorage.setItem("activeTab", activeTab);
    }, [activeTab]);

    const renderContent = () => {
        switch (activeTab) {
            case "addPersonTypes":
                return <AddPersonTypes />;
            case "modifyPersonTypes":
                return <ModifyPersonTypes />;
            case "setThresholds":
                return <SetColorThresholds />;
            case "demographicInfo":
                return <DemographicInfo />;
            case "messages":
                return <Messages userId={localStorage.getItem("userId")} />;
            case "notifications":
                return <SendNotifications />;
            default:
                return <AddPersonTypes />;
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

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-left">
                    <span>Administrators</span>
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
                                <li onClick={() => navigate('/admin-account')}>Informații cont</li>
                                <li onClick={handleLogout}>Delogare</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>
            <nav className="dashboard-nav">
                <ul>
                    <li onClick={() => setActiveTab("addPersonTypes")}>
                        Adauga categorii de persoane
                    </li>
                    <li onClick={() => setActiveTab("modifyPersonTypes")}>
                        Modifica categorii de persoane
                    </li>
                    <li onClick={() => setActiveTab("setThresholds")}>
                        Stabilește culorile pragurilor
                    </li>
                    <li onClick={() => setActiveTab("demographicInfo")}>
                        Centralizează informațiile demografice
                    </li>
                    <li onClick={() => setActiveTab("messages")}>
                        Trimite mesaje
                    </li>
                    <li onClick={() => setActiveTab("notifications")}>
                        Trimite notificări
                    </li>
                </ul>
            </nav>
            <main className="dashboard-content">{renderContent()}</main>
        </div>
    );
}

export default Dashboard;