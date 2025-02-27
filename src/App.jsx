import React, { useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import { LoginContext } from './Context/LoginContext';
import Spotlight from "./Context/Spotlight";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoggedIn } = useContext(LoginContext);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      {isLoggedIn && (
        <div className="fixed top-0 left-0 right-0 z-10 w-full bg-black shadow-md" >
          <Navbar onSidebarToggle={toggleSidebar} />
        </div>
      )}
      <div className={`flex w-full ${isLoggedIn ? "pt-16" : "h-screen"}`}>
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="w-[12.5%] min-w-maxb top-16">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          </div>
        )}

        {/* Content Area */}
        <div
          className={`transition-all duration-300 ease-in-out flex-grow ${
            isSidebarOpen ? " w-[87.5%]" : "w-full"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App; 
