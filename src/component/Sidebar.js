'use client';
const Sidebar = ({ isOpen, toggleSidebar }) => {
      return (
        <div className={`fixed inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-800 text-white w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
          <div className="p-4">
            <h2 className="text-xl font-bold">Menu</h2>
            {/* <button onClick={toggleSidebar} className="mt-4 text-gray-300 hover:text-white">
              {isOpen ? 'Close' : 'Open'} 
            </button> */}
            <ul className="mt-6 space-y-2">
              <li><a href="" className="block p-2 hover:bg-blue-700 rounded">Dashboard</a></li>
              <li><a href="" className="block p-2 hover:bg-blue-700 rounded">Analytics</a></li>
              <li><a href="" className="block p-2 hover:bg-blue-700 rounded">Settings</a></li>
              <li><a href="" className="block p-2 hover:bg-blue-700 rounded">Logout</a></li>
            </ul>
          </div>
        </div> 
        );
    };
export default Sidebar;