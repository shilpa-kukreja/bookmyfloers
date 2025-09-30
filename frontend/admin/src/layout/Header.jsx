import { useState, useRef, useEffect } from "react";
import { 
  UserCircleIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon, 
  ChevronDownIcon 
} from "@heroicons/react/24/solid";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // const handleLogout = () => {
  //   // Implement your logout logic here
  //   console.log("Logging out...");
  //   setDropdownOpen(false);
  // };

  const handleLogout = () => {
  localStorage.removeItem('adminToken');
  window.location.href = '/login';
};


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className=" p-1 px-4 flex items-center justify-between shadow-lg">
      {/* Logo/Title */}
      <div className="text-3xl font-extrabold tracking-wide  select-none">
        <img src="Logo.png" className="h-[60px]" alt="" />
      </div>

      {/* Profile Section */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-3 bg-slate-800 hover:bg-slate-700 focus:ring-2 focus:ring-slate-400 
            text-white font-semibold py-1 px-2 rounded-[100px] transition duration-300 ease-in-out"
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
          aria-label="User menu"
        >
          <img
            src="user.png" // Replace with user image if available
            alt="User avatar"
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="hidden sm:inline">User</span>
          <ChevronDownIcon className={`w-4 h-4 mr-1 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : "rotate-0"}`} />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-3 w-52 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-20">
            <ul className="divide-y divide-gray-200">
              {/* <li>
                <a
                  href="#profile"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                >
                  <UserCircleIcon className="w-5 h-5 mr-3 text-indigo-600" />
                  Profile
                </a>
              </li>
              <li>
                <a
                  href="#settings"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                >
                  <Cog6ToothIcon className="w-5 h-5 mr-3 text-indigo-600" />
                  Settings
                </a>
              </li> */}
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 font-semibold transition rounded-b-lg"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                  Log out
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;