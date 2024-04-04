// Importing the required modules
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";

// Creating our Dashboard SideBar
const DashSidebar = () => {
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
        <Sidebar className="w-full md:w-56">
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Link to="/dashboard?tab=profile"> 
                        <Sidebar.Item active={ tab === "profile" } icon={HiUser} label={"User"} labelColor="dark" className="cursor-pointer" as="div" >Profile</Sidebar.Item>
                    </Link>
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup>
                    <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer">Sign Out</Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
};

// Exporting Dashboard Sidebar
export default DashSidebar;