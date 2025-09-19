"use client";
import Link from "next/link";
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include", // ensures cookies are sent/cleared
      });

      if (res.ok) {
        window.location.href = "/login"; // redirect after logout
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  return (
    <div
      className={`fixed inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-800 text-white w-64 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="p-4">
        <h2 className="text-xl font-bold">Menu</h2>
      
       
            <div className="mt-6 space-y-2">
        <Link href="/dashboard" className="block p-2 hover:bg-blue-700 rounded">
          Dashboard
        </Link>
        <Link href="" className="block p-2 hover:bg-blue-700 rounded">
          Settigs
        </Link>
        <Link href="" className="block p-2 hover:bg-blue-700 rounded">
          View
        </Link>
        <button
          onClick={handleLogout}
          className="block p-2 hover:bg-blue-700 rounded text-left w-full"
        >
          Logout
        </button>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
