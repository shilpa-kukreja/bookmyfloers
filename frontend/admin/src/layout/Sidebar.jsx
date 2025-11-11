import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  HomeIcon,
  RectangleStackIcon,
  Squares2X2Icon,
  ShoppingBagIcon,
  TicketIcon,
  BookOpenIcon,
  EnvelopeIcon,
  TagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronUpIcon 
} from "@heroicons/react/24/solid";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Navigation items with icons
 const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: <HomeIcon className="w-5 h-5 mr-2 inline-block" /> },
  { name: "Manage Banner", path: "/banner", icon: <HomeIcon className="w-5 h-5 mr-2 inline-block" /> },
  { name: "Manage Category", path: "/category", icon: <RectangleStackIcon className="w-5 h-5 mr-2 inline-block" /> },
  { name: "Manage Sub Category", path: "/subcategory", icon: <Squares2X2Icon className="w-5 h-5 mr-2 inline-block" /> },
  { name: "Manage Products", path: "/product", icon: <ShoppingBagIcon className="w-5 h-5 mr-2 inline-block" /> },
  { name: "Manage Orders", path: "/orders", icon: <TicketIcon className="w-5 h-5 mr-2 inline-block" /> },
  { name: "Manage Coupons", path: "/coupons", icon: <TagIcon className="w-5 h-5 mr-2 inline-block" /> },
  { name: "Manage Blogs", path: "/blogs", icon: <BookOpenIcon className="w-5 h-5 mr-2 inline-block" /> },
  { name: "Manage Enquiry", path: "/contacts", icon: <EnvelopeIcon className="w-5 h-5 mr-2 inline-block" /> },
  { name: "Manage Users", path: "/users", icon: <UserCircleIcon className="w-5 h-5 mr-2 inline-block" /> },
  // { name: "Settings", path: "/settings", icon: <Cog6ToothIcon className="w-5 h-5 mr-2 inline-block" /> },
];

  return (
    <aside className="bg-black w-64 p-2 h-screen sticky top-0 flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center mb-8">
        {/* Sample Logo - replace with your own */}
       
     
      </div>

     <nav id="sidebar-navigation" className="mt-3">
            <ul>
              {navItems.map(({ name, path, icon }) => {
                const isActive = location.pathname === path;
                return (
                  <li key={name} className="mb-1">
                    <Link
                      to={path}
                      className={`flex items-center p-3 rounded-md font-medium transition
                        ${
                          isActive
                            ? "bg-slate-800 text-indigo-100"
                            : "text-white hover:bg-slate-700 hover:text-white"
                        }
                      `}
                    >
                      {icon}
                      {name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

      {/* Optional: More sections or footer here */}
      <div className="mt-auto text-indigo-400 text-sm select-none text-center">
        {/* © 2024 CRM Inc. */}
      </div>
    </aside>
  );
};

export default Sidebar;