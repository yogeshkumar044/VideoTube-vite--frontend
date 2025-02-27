import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  UserCircle,
  Video,
  LogOut,
  History,
  Film,
} from "lucide-react";
import logout from "../Utilis/Logout";
import { LoginContext } from "../Context/LoginContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { setIsLoggedIn } = useContext(LoginContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();

    if (result.success) {
      setIsLoggedIn(false); // Update the login state
      navigate("/login"); // Redirect to the login page
      onClose(); // Close the sidebar
    } else {
      alert("Logout failed, please try again.");
    }
  };

  return (
    <div
      className={`bg-[rgb(15,15,15)] flex flex-col fixed left-0  h-screen w-1/8 bg-transparent  text-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Sidebar Content */}
      <div className="h-[calc(100vh-8rem)] overflow-y-auto px-4 py-6">
        <nav className="space-y-4">
          {/* Navigation Links */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 text-lg font-medium transition-all duration-200 hover:pl-2 ${
                isActive ? "text-orange-400" : "text-gray-400"
              } hover:text-orange-400`
            }
            onClick={onClose}
          >
            <Home size={20} />
            Home
          </NavLink>

          <NavLink
            to="/userprofile"
            className={({ isActive }) =>
              `flex items-center gap-3 text-lg font-medium transition-all duration-200 hover:pl-2 ${
                isActive ? "text-orange-400" : "text-gray-400"
              } hover:text-orange-400`
            }
            onClick={onClose}
          >
            <UserCircle size={20} />
            Profile
          </NavLink>

          <NavLink
            to="/addvideo"
            className={({ isActive }) =>
              `flex items-center gap-3 text-lg font-medium transition-all duration-200 hover:pl-2 ${
                isActive ? "text-orange-400" : "text-gray-400"
              } hover:text-orange-400`
            }
            onClick={onClose}
          >
            <Video size={20} />
            Add Video
          </NavLink>
          

          

          <NavLink
            to="channel/History"
            className={({ isActive }) =>
              `flex items-center gap-3 text-lg font-medium transition-all duration-200 hover:pl-2 ${
                isActive ? "text-orange-400" : "text-gray-400"
              } hover:text-orange-400`
            }
            onClick={onClose}
          >
            <History size={20} />
            History
          </NavLink>
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className=" left-0 w-full p-2  ">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors duration-200 focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
