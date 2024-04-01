// Importing required modules
import React from "react";
import { Link } from "react-router-dom";
import { Footer } from "flowbite-react";
import { BsFacebook, BsGithub, BsInstagram, BsTwitterX } from "react-icons/bs"


// Creating our footer
const FooterSection = () => {
  return (
    <Footer 
        container 
        className="border-1 border-t-8 p-3 md:p-5" 
        style={{ 
        borderImage: 'linear-gradient(to left, #bcf0da, #31c48d, #0891b2)',
        borderImageSlice: 1 
      }}>
        <div className="w-full">
            <div className="w-full flex flex-col md:flex-row md:items-center items-start justify-between">
                {/* Container for Logo */}
                <div className="">
                    <Link to="/" className="self-center whitespace-nowrap text-lg sm:text-2xl font-bold" >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-600">TechTonic</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-l from-gray-400 to-gray-600 dark:from-orange-300 dark:to-pink-500"> Times</span>
                    </Link>
                </div>

                {/* Links Sections container*/}
                <div className="grid grid-cols-2 gap-5 mt-2 sm:mt-4 sm:grid-cols-3 sm:gap-6 ">
                    <div className="">
                        <Footer.Title title="About" />
                        <Footer.LinkGroup col className="-mt-3">
                            <Footer.Link href="#" rel="noopener noreferrer">
                                About Us
                            </Footer.Link>
                            <Footer.Link href="#" rel="noopener noreferrer">
                                Feedback
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div className="">
                    <Footer.Title title="Follow Us" />
                        <Footer.LinkGroup col className="-mt-3">
                            <Footer.Link href="#" rel="noopener noreferrer">
                                Github
                            </Footer.Link>
                            <Footer.Link href="#" rel="noopener noreferrer">
                                Discord
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div className="">
                    <Footer.Title title="Legals" />
                        <Footer.LinkGroup col className="-mt-3">
                            <Footer.Link href="#" rel="noopener noreferrer">
                                Privacy Policy
                            </Footer.Link>
                            <Footer.Link href="#" rel="noopener noreferrer">
                                Terms & Contditions
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                </div>
            </div>
            {/* Social Icons container */}
            <Footer.Divider />
            <div className="w-full h-full sm:flex sm:items-center sm:justify-between">
                <Footer.Copyright href="#" by="TechTonic Times" year={new Date().getFullYear()} />
                <div className="mt-3 flex items-center gap-6">
                    <Footer.Icon href="#" icon={BsFacebook}/>
                    <Footer.Icon href="#" icon={BsInstagram}/>
                    <Footer.Icon href="#" icon={BsTwitterX}/>
                    <Footer.Icon href="#" icon={BsGithub}/>
                </div>
            </div>
        </div>
    </Footer>
  );
};

// Exporting our Footer
export default FooterSection;