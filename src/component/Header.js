"use client";
import { useEffect, useState } from "react";
import { useProductContext } from "@/context/ProductContext";

// const domainOptions = ['ServiceNow', 'BMC Helix', 'DevOps', 'SAP', 'Salesforce'];
const domainOptions = [
  { name: "ServiceNow", logo: "/asset/domains/snow.png" },
  { name: "BMC Helix", logo: "/asset/domains/bmc.png" },
  { name: "DevOps", logo: "/asset/domains/devops.png" },
  { name: "SAP", logo: "/asset/domains/sap.png" },
  { name: "Salesforce", logo: "/asset/domains/salesforce.png" },
];
const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const { selectedDomains, setSelectedDomains } = useProductContext();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/me", {
          method: "GET",
          credentials: "include", // <-- IMPORTANT
        });
        const data = await res.json();
        console.log("Fetched user:", data);
        if (data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Fetch user error:", err);
      }
    }
    fetchUser();
  }, []);

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
    <header className="bg-white shadow p-4 flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
      {/* Sidebar toggle + logo */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-800 hover:text-gray-600"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isSidebarOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
        <img
          src="/asset/company_logo.svg"
          alt="Company Logo"
          className="h-8 w-auto"
        />
      </div>

      {/* Multi-select domain filter */}
      <div className="flex flex-wrap items-center gap-2">
        {/* <label className="font-semibold text-gray-700">Filter by Domain:</label> */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleDomainChange("All")}
            className={`px-2 py-1 rounded border ${
              selectedDomains.includes("All")
                ? "bg-cyan-800 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            All
          </button>
          {domainOptions.map((domain) => (
            <button
              key={domain.name}
              onClick={() => handleDomainChange(domain.name)}
              className={`flex items-center gap-2 px-3 py-1 rounded border transition ${
                selectedDomains.includes(domain.name)
                  ? "bg-cyan-800 text-white border-cyan-800"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              <img src={domain.logo} alt={domain.name} className="w-10 h-5" />
              <span className="font-normal">{domain.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Profile */}
    <div className="relative">
  {/* Profile Button */}
  <button
    onClick={() => setIsProfileOpen(!isProfileOpen)}
    className="focus:outline-none flex items-center gap-2"
  >
    <img
      src="/asset/user_1.png"
      alt="Profile"
      className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-blue-500 transition"
    />
    <svg
      className={`w-4 h-4 text-gray-600 transition-transform ${
        isProfileOpen ? "rotate-180" : "rotate-0"
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {/* Dropdown */}
  {isProfileOpen && (
    <div className="absolute top-14 right-0 w-60 bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
      
      {/* User Info */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <img
          src="/asset/user_1.png"
          alt="Profile"
          className="w-12 h-12 rounded-full border border-gray-300"
        />
        <div>
          <p className="text-gray-800 font-semibold">
            {user ? user.username : "Loading..."}
          </p>
          <p className="text-gray-500 text-sm">example@gmail.com</p>
        </div>
      </div>

      {/* Menu Options */}
      <div className="p-2">
        <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M5.121 17.804A9.004 9.004 0 0112 15c2.485 0 4.735.998 6.364 2.621M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          View Profile
        </button>

        <hr className="my-2 border-gray-200" />

        <button
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
          onClick={async () => {
            try {
              const res = await fetch("/api/logout", {
                method: "POST",
                credentials: "include",
              });

              if (res.ok) {
                setUser(null);
                setIsProfileOpen(false);
                window.location.href = "/login";
              }
            } catch (err) {
              console.error("Logout error:", err);
            }
          }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M17 16l4-4m0 0l-4-4m4 4H7" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  )}
</div>

    </header>
  );
};

export default Header;
