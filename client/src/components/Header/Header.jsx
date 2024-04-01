// Importing required modules
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, TextInput, Button, Dropdown, Avatar } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaKey, FaSun } from "react-icons/fa";
import { HiLogout, HiViewGrid } from "react-icons/hi";

// Importing global states from Redux-Store
import { useDispatch, useSelector } from "react-redux"; 
import { toggleTheme } from '../../redux/theme/themeSlice';

// Creating out Header
const Header = () => {
  // Some variables
  const path = useLocation().pathname;                      // to get the current pathName (current EndPoint) of the active/open page
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  return (
    <Navbar className="border-b-2 shadow-md">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-3xl font-bold"
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-600">
          TechTonic
        </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-l from-gray-400 to-gray-600 dark:from-orange-300 dark:to-pink-500">
          Times
        </span>
      </Link>

      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          sizing="sm"
          className="hidden lg:inline"
        />
      </form>

      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-2 md:order-2 items-center justify-between">
        <Button
          className="hidden sm:inline self-center"
          color="gray"
          pill
          size="xs"
          onClick={ () => dispatch(toggleTheme()) }
        >
          { theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>

        {/* Creating a User specific menu */}
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="User" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.userName}</span>
              <span className="block text-sm font-medium truncate">{currentUser.email}</span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item icon={HiViewGrid}>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item icon={HiLogout}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/signUp">
            <Button gradientDuoTone="greenToBlue" size="xs">
              Sign Up
              <FaKey className="ml-2 h-3 w-3" />
            </Button>
          </Link>
        )}

        <Navbar.Toggle className="w-10 h-8 self-center" />
      </div>

      <Navbar.Collapse>
        <Navbar.Link as={"div"}>
          <Link
            to="/"
            className={`text-sm ${
              path === "/" ? "text-green-400" : "dark:text-gray-100"
            } md:hover:text-green-400 transition-colors duration-300`}
          >
            Home
          </Link>
        </Navbar.Link>
        <Navbar.Link as={"div"}>
          <Link
            to="/about"
            className={`text-sm ${
              path === "/about" ? "text-green-400" : "dark:text-gray-100"
            } md:hover:text-green-400 transition-colors duration-300`}
          >
            About
          </Link>
        </Navbar.Link>
        <Navbar.Link as={"div"}>
          <Link
            to="/projects"
            className={`text-sm ${
              path === "/projects" ? "text-green-400" : "dark:text-gray-100"
            } md:hover:text-green-400 transition-colors duration-300`}
          >
            Projects
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

// Exporting our Header
export default Header;