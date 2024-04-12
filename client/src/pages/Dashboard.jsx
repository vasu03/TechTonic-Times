// Importing the required modules
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Importing our custom components
import DashSidebar from "../components/DashSidebar/DashSidebar";
import DashProfile from "../components/DashProfile/DashProfile";
import DashPost from "../components/DashPost/DashPost";

// Creating our Dashboard
const Dashboard = () => {
  // Initializing the hooks
  const location = useLocation();
  
  // States to handle the Tabs
  const [ tab, setTab ] = useState("");
  
  // Effect to handle the change in the URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if(tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search] );

  // JSX to render our page
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      
      {/* Dashboard SideBar */}
      <div className="md:w-56">
        <DashSidebar />
      </div>

      {/* Content Container */}
      <div className="w-full h-full p-1">
        {/* Profile Tab */}
        { tab === "profile" && <DashProfile /> }
        {/* Posts Tab */}
        { tab === "posts" && <DashPost /> }
      </div>

    </div>
  );
};

// Exporting our Dashboard
export default Dashboard;