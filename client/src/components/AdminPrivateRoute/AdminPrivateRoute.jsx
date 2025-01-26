// Import required modules
import React from "react"
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

// Creating our Private Route
const AdminPrivateRoute = ({children}) => {
    const { currentUser } = useSelector((state) => state.user);
    return  currentUser && currentUser.isAdmin ? <Outlet /> : <Navigate to="/signIn" />;
};

// Exporting our Private Component
export default AdminPrivateRoute;