// Importing the required modules
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";

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
  const [collapsed, setCollapsed] = useState(true); // New state for sidebar collapse
  
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
      <button className="md:hidden self-start flex items-center justify-center h-6 w-10 text-lg border-2 border-gray-300 dark:border-gray-600 mx-1 my-2 rounded-lg" onClick={() => setCollapsed(!collapsed)}>
        <HiOutlineChevronDoubleRight />
      </button>
      {/* Dashboard SideBar */}
      <div className={`md:w-56 ${collapsed ? 'hidden md:block' : ''} `} >
        <DashSidebar />
      </div>

      {/* Content Container */}
      <div className="overflow-x-auto w-full h-full p-2">
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