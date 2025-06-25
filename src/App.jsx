import React, { useState } from "react";  
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import './App.css'

// Import the pages
import Dashboard from "./Components/DashBoard/DashBoard";
import Billing from "./Components/Bill/Billing";
import Uploads from "./Components/Uploads/Uploads";
import History from "./Components/History/History";

const App = () => {
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarActive(!isSidebarActive);
  };

  // Close sidebar when a link is clicked
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {  // If it's mobile size
      setIsSidebarActive(false);  // Close sidebar
    }
  };

  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`sidebar ${isSidebarActive ? "active" : ""}`}>
          <div className="logo">
            <h1>Vi-Tec Solutions</h1>
            <p>Billing System</p>
          </div>
          <nav>
            {/* Add handleLinkClick to each Link to close sidebar when clicked */}
            <Link to="/" className="sidebar-link" onClick={handleLinkClick}>🏠 Dashboard</Link>
            <Link to="/billing" className="sidebar-link" onClick={handleLinkClick}>💳 Billing</Link>
            <Link to="/uploads" className="sidebar-link" onClick={handleLinkClick}>📤 Uploads</Link>
            <Link to="/History" className="sidebar-link" onClick={handleLinkClick}>📤 History</Link>

          </nav>
        </div>

        {/* Sidebar Toggle Button */}
        <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
          ☰
        </button>

        {/* Main content area */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/uploads" element={<Uploads />} />
            <Route path="/History" element={<History />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
