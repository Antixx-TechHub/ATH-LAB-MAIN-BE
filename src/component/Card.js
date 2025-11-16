// "use client";
// import { useState } from "react";
// import { FaEdit } from "react-icons/fa";

// const Card = ({
//   id,
//   title,
//   liveUrl,
//   GitHubUrl,
//   description,
//   activeStatus,
//   lastUpdatedAt,
//   updatedBy,
//   UserAccess,
//   onDelete,
//   onUpdate,
//   currentUserId,
//   ownership,
// }) => {
//   const isDisabled = activeStatus !== true;
//   const isLiveUrlDisabled =
//     activeStatus !== true ||
//     !UserAccess ||
//     !(UserAccess.includes("developer") || UserAccess.includes("admin"));
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [formData, setFormData] = useState({
//     title,
//     GitHubUrl,
//     liveUrl,
//     description,
//     projectdomain: UserAccess?.[0] || "",
//     activeStatus,
//     updatedBy,
//     lastUpdatedAt: new Date(lastUpdatedAt).toISOString().slice(0, 16),
//   });

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Form data before update:", formData);
//     try {
//       const updatedData = {
//         ...formData,
//         lastUpdatedAt: formData.lastUpdatedAt
//           ? new Date(formData.lastUpdatedAt)
//           : undefined,
//       };
//       await onUpdate(updatedData); // Pass only updatedData
//       setIsEditing(false);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//       console.error("Update error:", err);
//     }
//   };

  

//   return (
//     <>
//       <div className="relative bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
//         {/* Vertical Dots Menu */}
//         {ownership === currentUserId && (
//   <div className="absolute top-2 right-2">
//     <button
//       onClick={() => setIsMenuOpen(!isMenuOpen)}
//       className="text-gray-600 hover:text-gray-800 focus:outline-none"
//       aria-label="Open menu"
//     >
//       <svg
//         className="w-5 h-5"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth="2"
//           d="M12 6v.01M12 12v.01M12 18v.01"
//         />
//       </svg>
//     </button>
//     {isMenuOpen && (
//       <div className="absolute right-0 mt-2 w-24 bg-gray-100 shadow-lg z-10">
//         <button
//           onClick={() => {
//             setIsEditing(true);
//             setIsMenuOpen(false);
//           }}
//           className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//         >
//           Edit
//         </button>
//         <button
//           onClick={() => onDelete(id)}
//           disabled={loading}
//           className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//         >
//           {loading ? "Deleting..." : "Delete"}
//         </button>
//       </div>
//     )}
//   </div>
// )}


//         {/* Card Content or Edit Form */}
//         {isEditing ? (
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Title
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 GitHub URL
//               </label>
//               <input
//                 type="url"
//                 name="GitHubUrl"
//                 value={formData.GitHubUrl}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Live URL
//               </label>
//               <input
//                 type="url"
//                 name="liveUrl"
//                 value={formData.liveUrl}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Project Domain
//               </label>
//               <input
//                 type="text"
//                 name="projectdomain"
//                 value={formData.projectdomain}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 <input
//                   type="checkbox"
//                   name="activeStatus"
//                   checked={formData.activeStatus}
//                   onChange={handleInputChange}
//                   className="mr-2"
//                 />
//                 Active Status
//               </label>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Last Updated
//               </label>
//               <input
//                 type="datetime-local"
//                 name="lastUpdatedAt"
//                 value={formData.lastUpdatedAt}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Updated By
//               </label>
//               <input
//                 type="text"
//                 name="updatedBy"
//                 value={formData.updatedBy}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             {error && <p className="text-red-600 text-sm">{error}</p>}
//             <div className="flex space-x-2">
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 Save
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setIsEditing(false)}
//                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         ) : (
//           <>
//             <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
//             <p className="mt-2 text-gray-600 line-clamp-2">{description}..</p>
//             <button
//               className="mt-2 text-blue-600 hover:underline focus:outline-none"
//               onClick={openModal}
//             >
//               Know More
//             </button>
//             <div className="mt-4 flex gap-6">
//               <button
//                 className={`px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
//                   isDisabled ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//                 onClick={() => !isDisabled && (window.location.href = liveUrl)}
//                 disabled={isDisabled}
//               >
//                 Open Live Demo
//               </button>
//               <button
//                 className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
//                   isLiveUrlDisabled ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//                 onClick={() =>
//                   !isLiveUrlDisabled && (window.location.href = GitHubUrl)
//                 }
//                 disabled={isLiveUrlDisabled}
                
//               >
//                 Source Code
//               </button>
//             </div>
//             <div className="mt-4">
//               <p className="card-text">
//                 <small className="text-muted text-gray-600">
//                   Last Updated By {updatedBy}, On{" "}
//                   {new Date(lastUpdatedAt).toLocaleString()}
//                 </small>
//               </p>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Modal for full description */}
//       {isModalOpen && (
//         <div
//           className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50"
//           onClick={closeModal}
//         >
//           <div
//             className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto relative"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1 transition-colors"
//               onClick={closeModal}
//               aria-label="Close modal"
//             >
//               ✕
//             </button>
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">
//               {title}
//             </h3>
//             <p className="text-gray-600">{description}</p>
//             <button
//               className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
//               onClick={closeModal}
//             >
//               Ok
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Card;

"use client";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";

const Card = ({
  id,
  title,
  liveUrl,
  GitHubUrl,
  description,
  activeStatus,
  lastUpdatedAt,
  updatedBy,
  UserAccess,
  onDelete,
  onUpdate,
  currentUserId,
  currentUserRole,
  ownership,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Permission Logic
  const role = currentUserRole?.toLowerCase();
  const isAdmin = role === "admin";
  const isProjectAdmin = role === "project_admin";
  const isOwner = String(currentUserId) === String(ownership);

  const canEditOrDelete = isAdmin || (isProjectAdmin && isOwner);
  const canViewSource = isAdmin || isProjectAdmin;
  const canViewLive = isAdmin || isProjectAdmin;; // Everyone can view live
  // console.log("Card Render - canEditOrDelete:", canEditOrDelete, "canViewSource:", canViewSource, "canViewLive:", canViewLive);

  const [formData, setFormData] = useState({
    title,
    GitHubUrl,
    liveUrl,
    description,
    projectdomain: UserAccess?.[0] || "",
    activeStatus,
    updatedBy,
    lastUpdatedAt: new Date(lastUpdatedAt).toISOString().slice(0, 16),
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        lastUpdatedAt: formData.lastUpdatedAt
          ? new Date(formData.lastUpdatedAt)
          : undefined,
      };
      await onUpdate(updatedData);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Update error:", err);
    }
  };

  return (
    <>
      <div className="relative bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
        {/* --- Permission Menu --- */}
        {canEditOrDelete && (
          <div className="absolute top-2 right-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
              aria-label="Open menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v.01M12 12v.01M12 18v.01"
                />
              </svg>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-24 bg-gray-100 shadow-lg z-10">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(id)}
                  disabled={loading}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- Card Content / Edit Form --- */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                GitHub URL
              </label>
              <input
                type="url"
                name="GitHubUrl"
                value={formData.GitHubUrl}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Live URL
              </label>
              <input
                type="url"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Project Domain
              </label>
              <input
                type="text"
                name="projectdomain"
                value={formData.projectdomain}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  name="activeStatus"
                  checked={formData.activeStatus}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Active Status
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Updated
              </label>
              <input
                type="datetime-local"
                name="lastUpdatedAt"
                value={formData.lastUpdatedAt}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Updated By
              </label>
              <input
                type="text"
                name="updatedBy"
                value={formData.updatedBy}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="mt-2 text-gray-600 line-clamp-2">{description}..</p>
            <button
              className="mt-2 text-blue-600 hover:underline focus:outline-none"
              onClick={openModal}
            >
              Know More
            </button>

            <div className="mt-4 flex gap-6">
              {/* Live Demo Button */}
              <button
                className={`px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 ${
                  !canViewLive ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() =>
                  canViewLive && (window.location.href = liveUrl)
                }
                disabled={!canViewLive}
              >
                Open Live Demo
              </button>

              {/* Source Code Button */}
              <button
                className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
                  !canViewSource ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() =>
                  canViewSource && (window.location.href = GitHubUrl)
                }
                disabled={!canViewSource}
              >
                Source Code
              </button>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Last Updated By {updatedBy}, On{" "}
                {new Date(lastUpdatedAt).toLocaleString()}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Modal for Full Description */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {title}
            </h3>
            <p className="text-gray-600">{description}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={closeModal}
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
