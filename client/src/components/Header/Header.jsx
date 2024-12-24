// Importing required modules
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, TextInput, Button, Dropdown, Avatar } from "flowbite-react";

// Importing the Icons
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaKey, FaSun } from "react-icons/fa";
import { HiLogout, HiViewGrid } from "react-icons/hi";

// Importing global states from Redux-Store
import { useDispatch, useSelector } from "react-redux"; 
import { toggleTheme } from "../../redux/theme/themeSlice";
import { signOutSuccess } from "../../redux/user/userSlice";

// Creating our Header component
const Header = () => {
  // Initialize the hooks
  const path = useLocation().pathname; // Get the current pathName (current EndPoint) of the active/open page
  const dispatch = useDispatch();
  
  // some variables
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

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
  };

  // JSX to render the component
  return (
    <Navbar className="sticky top-0 shadow-lg shadow-gray-300 dark:shadow-slate-800 z-[10000]">
      <Link to="/" className="self-center whitespace-nowrap text-lg sm:text-3xl font-bold" >
        {/* Logo */}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-600">
          TechTonic
        </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-l from-gray-400 to-gray-600 dark:from-orange-300 dark:to-pink-500">
          Times
        </span>
      </Link>

      {/* Search bar */}
      <form>
        <TextInput type="text" placeholder="Search..." rightIcon={AiOutlineSearch} sizing="sm" className="hidden lg:inline" />
      </form>

      {/* Search button */}
      <Button className="w-8 h-6 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>

      {/* Div container holding SignUp and themeToggle button */}
      <div className="flex gap-2 md:order-2 items-center justify-between">
        {/* Toggle theme button */}
        <Button className="hidden sm:inline self-center" color="gray" pill size="xs" onClick={() => dispatch(toggleTheme())} >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>

        {/* User dropdown menu */}
        {currentUser ? (
          // Show dropdown in form of a image if user is logged in
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="User" img={currentUser.profilePicture} rounded size="md" />}
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.userName}</span>
              <span className="block text-sm font-medium truncate">{currentUser.email}</span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item icon={HiViewGrid}>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item icon={HiLogout} onClick={handleSignOut}>
              Sign Out
            </Dropdown.Item>
          </Dropdown>
        ) : (
          // Sign-up button if user is not logged in
          <Link to="/signIn" className="hidden md:inline">
            <Button gradientDuoTone="greenToBlue" size="xs">
              Sign In
              <FaKey className="ml-2 h-3 w-3" />
            </Button>
          </Link>
        )}

        {/* Navbar toggle button */}
        <Navbar.Toggle className="w-10 h-8 self-center" />
      </div>

      {/* Collapsible Navbar links */}
      <Navbar.Collapse>
        {/* Home link */}
        <Navbar.Link as={"div"} className="flex items-center justify-center">
          <Link
            to="/"
            className={`text-sm ${
              path === "/" ? "text-green-400" : "dark:text-gray-100"
            } md:hover:text-green-400 transition-colors duration-300`}
          >
            Home
          </Link>
        </Navbar.Link>

        {/* About link */}
        <Navbar.Link as={"div"} className="flex items-center justify-center">
          <Link
            to="/about"
            className={`text-sm ${
              path === "/about" ? "text-green-400" : "dark:text-gray-100"
            } md:hover:text-green-400 transition-colors duration-300`}
          >
            About
          </Link>
        </Navbar.Link>

        {/* Projects link */}
        <Navbar.Link as={"div"} className="flex items-center justify-center">
          <Link
            to="/projects"
            className={`text-sm ${
              path === "/projects" ? "text-green-400" : "dark:text-gray-100"
            } md:hover:text-green-400 transition-colors duration-300`}
          >
            Projects
          </Link>
        </Navbar.Link>

        {/* Sign-up button and theme toggle button for mobile */}
        <Navbar.Link as={"div"} className="md:hidden min-w-full flex items-center justify-center">
          <div className="flex gap-2 items-center justify-between">
            {currentUser ? (
              <></>
            ) : (
              <Link to="/signIn">
                <Button gradientDuoTone="greenToBlue" size="xs">
                  Sign In
                  <FaKey className="ml-2 h-3 w-3" />
                </Button>
              </Link>
            )}
            <Button className="sm:hidden self-center" color="gray" pill size="xs" onClick={() => dispatch(toggleTheme())}>
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </Button>
          </div>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

// Exporting our Header
export default Header;
