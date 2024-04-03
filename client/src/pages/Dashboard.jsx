// Importing the required modules
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Importing our custom components
import DashSidebar from "../components/DashSidebar/DashSidebar";
import DashProfile from "../components/DashProfile/DashProfile";

// Creating our Dashboard
const Dashboard = () => {
  const location = useLocation();
  const [ tab, setTab ] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if(tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search] );

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Dashboard SideBar */}
      <div className="md:w-56">
        <DashSidebar />
      </div>

      {/* Content Container */}
      <div className="w-full h-full p-1">
        { tab === "profile" && <DashProfile /> }
      </div>
    </div>
  );
};

// Exporting our Dashboard
export default Dashboard;