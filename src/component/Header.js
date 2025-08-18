'use client';
import { useState } from 'react';
import { useProductContext } from '@/context/ProductContext';

const domainOptions = ['ServiceNow', 'BMC Helix', 'DevOps', 'SAP', 'Salesforce'];

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const { selectedDomains, setSelectedDomains } = useProductContext();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleDomainChange = (domain) => {
    if (domain === "All") {
      setSelectedDomains(["All"]);
    } else {
      const updated = selectedDomains.includes(domain)
        ? selectedDomains.filter((d) => d !== domain)
        : [...selectedDomains.filter((d) => d !== "All"), domain];

      setSelectedDomains(updated.length > 0 ? updated : ["All"]);
    }
  };

  return (
    <header className="bg-gradient-to-r from-gray-50 to-slate-100 shadow p-4 flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
      {/* Sidebar toggle + logo */}
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="text-gray-800 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
        <img src="/asset/company_logo.svg" alt="Company Logo" className="h-8 w-auto" />
      </div>

      {/* Multi-select domain filter */}
      <div className="flex flex-wrap items-center gap-2">
        {/* <label className="font-semibold text-gray-700">Filter by Domain:</label> */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleDomainChange("All")}
            className={`px-3 py-1 rounded border ${
              selectedDomains.includes("All") ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
            }`}
          >
            All
          </button>
          {domainOptions.map((domain) => (
            <button
              key={domain}
              onClick={() => handleDomainChange(domain)}
              className={`px-3 py-1 rounded border ${
                selectedDomains.includes(domain) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {/* Profile */}
      <div className="relative">
        <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="focus:outline-none">
          <img src="/asset/user_1.png" alt="Profile" className="w-10 h-10 rounded-full" />
        </button>
        {isProfileOpen && (
          <div className="absolute top-14 right-0 bg-white shadow-lg rounded-lg p-4 w-48 z-50">
            <p className="text-gray-800">User Name</p>
            <p className="text-gray-600 text-sm">user@example.com</p>
            <button className="mt-2 w-full text-left text-blue-600 hover:underline">View Profile</button>
            <button className="mt-2 w-full text-left text-red-600 hover:underline">Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
// "use client";
// import { useState } from "react";
// import { useProductContext } from "@/context/ProductContext";

// const Header = ({ toggleSidebar, isSidebarOpen }) => {
//   const { selectedCategory, setSelectedCategory, categories } =
//     useProductContext();

//   const [isProfileOpen, setIsProfileOpen] = useState(false);

//   return (
//     <header className="bg-white shadow p-4 flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
//       <div className="flex items-center space-x-4 flex-wrap">
//         <button
//           onClick={toggleSidebar}
//           className="text-gray-800 hover:text-gray-600 focus:outline-none"
//         >
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d={
//                 isSidebarOpen
//                   ? "M6 18L18 6M6 6l12 12"
//                   : "M4 6h16M4 12h16M4 18h16"
//               }
//             ></path>
//           </svg>
//         </button>
//         <img
//           src="/asset/company_logo.svg"
//           alt="Company Logo"
//           className="h-8 w-auto"
//         />
//         {/* <h1 className="text-xl font-semibold text-gray-800">AntixxTechHub</h1> */}
//       </div>
//     <div className="flex items-center gap-4 flex-wrap">
//         {/* Project Domain Filter */}
//         <select
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//           className="border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           {categories.map((domain) => (
//             <option key={domain} value={domain}>
//               {domain}
//             </option>
//           ))}
//         </select>

//         {/* Search Input */}
//         <input
//           type="text"
//           placeholder="Search..."
//           className="border rounded-lg px-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         <div className="relative w-full md:w-auto">
//           <button
//             onClick={() => setIsProfileOpen(!isProfileOpen)}
//             className="focus:outline-none"
//           >
//             <img
//               src="/asset/user_1.png"
//               alt="Profile"
//               className="w-10 h-10 rounded-full mx-auto md:mx-0"
//             />
//           </button>

//           {isProfileOpen && (
//             <div className="absolute top-14 right-0 md:right-0 bg-white shadow-lg rounded-lg p-4 w-48 z-50">
//               <p className="text-gray-800">User Name</p>
//               <p className="text-gray-600 text-sm">user@example.com</p>
//               <button className="mt-2 w-full text-left text-blue-600 hover:underline">
//                 View Profile
//               </button>
//               <button className="mt-2 w-full text-left text-red-600 hover:underline">
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
