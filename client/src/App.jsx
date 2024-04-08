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
import CreatePost from './pages/CreatePost';

// Importing our custom components
import Header from "./components/Header/Header";
import FooterSection from './components/Footer/Footer';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AdminPrivateRoute from "./components/AdminPrivateRoute/AdminPrivateRoute";

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
        <Route element={<PrivateRoute/>}>          {/* make the dashboard private  */} 
          <Route path='/dashboard' element={<Dashboard/>} />
        </Route>
        <Route element={<AdminPrivateRoute/>}>          {/* make the create post page private  */}
          <Route path='/createPost' element={<CreatePost/>} />
        </Route>
        <Route path='/projects' element={<Projects/>} />
      </Routes>
      <FooterSection />                                {/* placed under BrowserRouter.. so, that is shown on all pages */}
    </BrowserRouter>  
  );
};

// Exporting our App
export default App;