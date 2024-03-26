// Importing required modules
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, TextInput, Button } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaKey } from "react-icons/fa";

// Creating out Header
const Header = () => {
  const path = useLocation().pathname;                      // to get the current pathName (current EndPoint) of the active/open page

  return (
    <Navbar className="border-b-2" >
      <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-bold' >
        <span className='text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-600'>
          TechTonic 
        </span>
        <span className='dark:text-white'> Times</span>
      </Link>

      <form>
        <TextInput 
            type='text'
            placeholder='Search...'
            rightIcon={AiOutlineSearch}
            className='hidden lg:inline'
        />
      </form>

      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch />
      </Button>

      <div className='flex gap-2 md:order-2 items-center justify-between'>
        <Button className='w-12 h-10 hidden sm:inline self-center' color='gray' pill >
          <FaMoon />
        </Button>

        <Link to="/signIn" >
        <Button 
            gradientDuoTone='greenToBlue'
            size='sm'
            className='self-center rounded-lg flex items-center content-center'
        >
          Sign In
          <FaKey className='ml-2 h-3 w-3'/>
        </Button>     
        </Link>
        <Navbar.Toggle className='w-10 h-8 self-center'/>
      </div>

        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={'div'}>
            <Link to='/'>Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/about"} as={'div'}>
            <Link to='/about'>About</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/projects"} as={'div'}>
            <Link to='/projects'>Projects</Link>
          </Navbar.Link>
        </Navbar.Collapse>
    </Navbar>
  )
}

// Exporting our Header
export default Header;