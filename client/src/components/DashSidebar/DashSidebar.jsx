// Importing the required modules
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar } from "flowbite-react";

// Importing the Icons
import { HiArrowSmRight, HiDocumentText, HiUser } from "react-icons/hi";

// Importing global states from Redux-Store
import { useDispatch, useSelector } from "react-redux"; 
import { signOutSuccess } from "../../redux/user/userSlice";

// Creating our Dashboard SideBar component
const DashSidebar = () => {
    // Initialize the hooks
    const dispatch = useDispatch();
    const location = useLocation();
    
    const { currentUser } = useSelector((state) => state.user);
    // States to manage the tabs of the sidebar
    const [tab, setTab] = useState("");

    // Effect to update tab state when the URL query parameter changes
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    // Function to handle user sign-out
    const handleSignOut = async (e) => {
        try {
            const res = await fetch("/api/auth/signOut", {
                method: "POST",
            });

            const data = res.json();
            if (!res.ok) {
                console.log(data, message);
            } else {
                dispatch(signOutSuccess());
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    // JSX to render the component
    return (
        <Sidebar className="w-full md:w-56">
            <Sidebar.Items>
                <Sidebar.ItemGroup className="flex flex-col gap-3">

                {/* User profile link */}
                    <Link to="/dashboard?tab=profile"> 
                        <Sidebar.Item 
                            active={tab === "profile"} 
                            icon={HiUser} 
                            label={ currentUser.isAdmin ? "Admin" : "User" } 
                            labelColor="dark" 
                            className="cursor-pointer" 
                            as="div"
                        >
                            Profile
                        </Sidebar.Item>
                    </Link>

                {/* Posts button */}
                    { currentUser.isAdmin && (
                        <Link to="/dashboard?tab=posts"> 
                            <Sidebar.Item 
                                active={tab === "posts"} 
                                icon={HiDocumentText} 
                                labelColor="dark" 
                                className="cursor-pointer" 
                                as="div"
                            >
                                Posts
                            </Sidebar.Item>
                        </Link>
                    )}

                </Sidebar.ItemGroup>

                {/* Sign-out button */}
                <Sidebar.ItemGroup>
                    <Sidebar.Item 
                        icon={HiArrowSmRight} 
                        className="cursor-pointer" 
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
};

// Exporting Dashboard Sidebar
export default DashSidebar;
