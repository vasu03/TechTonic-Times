// Importing required modules
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importing custom modules
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

// Importing our custom components
import Header from "./components/Header/Header";

// Creating our App
const App = () => {
  return (
    // Define a BrowserRouter to be able to route through diff endpoints
    <BrowserRouter>
      <Header />                                {/* placed under BrowserRouter.. so, that is shown on all pages */}      
      {/* Define the Routes of diff pages */}
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/signIn' element={<SignIn/>} />
        <Route path='/signUp' element={<SignUp/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/projects' element={<Projects/>} />
      </Routes>
    </BrowserRouter>  
  );
};

// Exporting our App
export default App;