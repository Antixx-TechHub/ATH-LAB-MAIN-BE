

"use client";
import { useEffect, useState } from "react";
import { useProductContext } from "@/context/ProductContext";
import toast from "react-hot-toast";
import { useUser } from "@/context/UserContext";


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
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // 📍 NEW STATE
  const [hoverRequest, setHoverRequest] = useState(false); // 📍 NEW STATE
  const [notifications, setNotifications] = useState([]);
  const allRoles = ["admin", "project_admin", "enduser"];
  const { user, setUser } = useUser();
  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkScreen = () => setIsMobile(window.innerWidth <= 768);
  checkScreen();
  window.addEventListener("resize", checkScreen);
  return () => window.removeEventListener("resize", checkScreen);
}, []);

useEffect(() => {
  async function fetchNotifications() {
    if (!user?.id) return;  // wait until user is ready

    try {
      const res = await fetch(`/api/notifications?userId=${user.id}&role=${user.role}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Fetch notifications error:", error);
    }
  }

  fetchNotifications();
// Filter roles based on current user's role

}, [user]); // ✅ this effect runs only when user changes (after fetchUser sets it)


   const fetchNotifications = async () => {
      try {
        if (!user?.id) return;

        const res = await fetch(`/api/notifications?userId=${user.id}&role=${user.role}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok) {
          setNotifications(data.notifications || []);
        }
      } catch (error) {
        console.error("Fetch notifications error:", error);
      }
    };

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

const handleRoleRequest = async (roleRequested) => {
  try {
    if (!user?.id) {
      toast.error(`User not found. Please log in again`);
      return;
    }
    console.log(user.id);
    const payload = {
      fromUserId: user.id,  // current logged-in user
      toUserId: 4,           // fixed admin receiver
      roleRequested,         // selected role
    };

    console.log("Sending Request:", payload);

    const res = await fetch("http://localhost:3000/api/sendRequest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
        fetchNotifications();
      toast.success(`Request for "${roleRequested}" sent successfully!`);
    } else {
      toast.error(`Failed: ${data.message || "Something went wrong."}`);
    }

    // Close hover and dropdown
    setHoverRequest(false);
    setIsProfileOpen(false);
  } catch (error) {
    console.error("Error sending role request:", error);
    toast.error(`Error sending request. Please try again.`);
  }
};

const handleRemoveNotification = async (notificationId) => {
  try {
    console.log("Removing notification:", notificationId);

    const res = await fetch("/api/removeNotification", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId }),
    });

    const data = await res.json();

    if (res.ok) {
      // Optionally refresh notifications
      fetchNotifications();
      toast.success(`🗑️ Notification removed successfully!`);
    } else {
      toast.success(`❌ Failed to remove notification: ${data.message}`);
    }
  } catch (error) {
    console.error("Error removing notification:", error);
  }
};


  const handleAdminReply = async (toUserId,requestId,message) => {
    try {
      console.log(toUserId,user.id);

      const payload = {
        fromAdminId: user.id,
        toUserId,
        message,
        requestId,
      };

      const res = await fetch("/api/adminReply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        fetchNotifications();
        toast.success(`✅ Reply sent successfully!`);
        
      } else {
        toast.error(`❌ Failed to send reply: ${data.message}`);
      }
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

    const notifyDash=() => {
      console.log("clicked on dash");
          setIsNotificationOpen(!isNotificationOpen);
          if (!isNotificationOpen) fetchNotifications(); // fetch on open
          }
          // Filter roles based on current user's role
          const role_data = allRoles.filter((role) => role !== user?.role);


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

      {/* Profile + Notification Section */}
      <div className="relative flex items-center gap-5">
        {/* 📍 NEW: Notification Bell */}
        <div className="relative">
          <button
            onClick={notifyDash}
            className="relative text-gray-700 hover:text-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C8.67 6.165 8 7.388 8 9v5c0 .386-.146.735-.395 1.005L6 17h5m4 0a3 3 0 11-6 0h6z"
              />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              {notifications.length}
            </span>
          </button>


            {isNotificationOpen && (
  <div className={`absolute mt-4 w-72 bg-white rounded-xl shadow-lg p-3 z-50 ${isMobile ? "" : "right-0"}`}>
    <p className="font-semibold text-gray-700 mb-2">Notifications</p>

    <ul className="text-sm text-gray-600 space-y-1 max-h-60 overflow-y-auto">
      {notifications.length > 0 ? (
        notifications.map((n) => (
          <li
            key={n.id}
            className="group relative hover:bg-gray-100 p-2 rounded transition"
          >
            {/* Notification Message Based on Role */}
            {user.role === "admin" ? (
              <p>
                📩 {n.fromUser?.username || "Unknown"} requested{" "}
                <b>{n.roleRequested}</b>
              </p>
            ) : (
              <p>
                📩 {n.toUser?.username || "Admin"} has{" "}
                <b>{n.status}</b> your <b>{n.roleRequested}</b> request.
              </p>
            )}

            <p className="text-xs text-gray-400">
              {new Date(n.createdAt).toLocaleString()}
            </p>

            {/* Buttons Based on Role */}
            {user.role === "admin" ? (
              <div className="hidden group-hover:flex justify-end gap-2 mt-2">
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                  onClick={() => handleAdminReply(n.fromUserId, n.id, "Accepted")}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                  onClick={() => handleAdminReply(n.fromUserId, n.id, "Rejected")}
                >
                  Reject
                </button>
              </div>
            ) : (
              <div className="hidden group-hover:flex justify-end gap-2 mt-2">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                  onClick={() => handleRemoveNotification(n.id)}
                >
                  Remove
                </button>
              </div>
            )}
          </li>
        ))
      ) : (
        <li className="text-gray-400 text-center p-2">
          No notifications yet
        </li>
      )}
    </ul>
  </div>
)}
</div>

        {/* Profile Section */}
        <div className="relative">
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown */}
          {isProfileOpen && (
            <div  className={`absolute mt-4 w-72 bg-white rounded-xl shadow-lg p-3 z-50 ${isMobile ? "" : "right-0"} ${isMobile ? "w-[calc(var(--spacing)*63)]" : "w-72"}`}>
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
              <div className="p-2 relative">
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

                {user?.role === "enduser" || user?.role === "project_admin" ? (
                    <div
                      className="relative"
                      onMouseEnter={() => setHoverRequest(true)}
                      onMouseLeave={() => setHoverRequest(false)}
                    >
                      <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Send Request
                      </button>
                      {hoverRequest && (
                        <div className="absolute top-0 ml-2 w-full bg-white rounded-lg shadow-md w-40 text-sm">
                          {role_data.map((role) => (
                            <p
                              key={role}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleRoleRequest(role)}
                            >
                              {role}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                ) : null}
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
      </div>
    </header>
  );
};

export default Header;
