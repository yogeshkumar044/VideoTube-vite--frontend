import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { LoginContext } from "../Context/LoginContext";
import { SearchContext } from "../Context/SearchContext";
import logout from "../Utilis/Logout";

function Navbar({ onSidebarToggle }) {
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);
  const { setSearchquery } = useContext(SearchContext);
  const [localQuery, setLocalQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!localQuery.trim()) return; // Ignore empty search
    
    setIsSearching(true);
    
    // Update the global search query
    setSearchquery(localQuery);
    
    // Reset the searching state after a brief delay to show the spinner
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    
    // We no longer trigger search on input change
    // Only storing the local value for later use when button is clicked
  };

  return (
    <nav className="bg-black p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Sidebar Toggle Button */}
        <button
          onClick={onSidebarToggle}
          className="p-2 text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transform transition-transform duration-200 hover:scale-110"
            color="bg-black"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Logo */}
        <NavLink
          to="/"
          className="text-3xl font-serif text-red-500 hover:text-red-700 ml-6"
        >
          VideoTube
        </NavLink>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto">
          <div className="flex rounded-full bg-[#0d1829] px-2 w-full transition-all duration-200 hover:shadow-lg">
            <input
              type="text"
              className="w-full bg-transparent pl-2 text-[#cccccc] outline-0 py-2"
              placeholder="Search for videos"
              value={localQuery}
              onChange={handleSearchInput}
            />
            <button
              type="submit"
              className="p-2 rounded-full text-white hover:bg-[#ff5c5c] transition-colors duration-200 focus:outline-none"
              disabled={isSearching}
            >
              {isSearching ? (
                <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="#cccccc"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </nav>
  );
}

export default Navbar;