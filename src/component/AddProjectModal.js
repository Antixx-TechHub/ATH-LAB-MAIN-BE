// "use client";
// import React, { useState } from "react";

// const AddProjectModal = ({ isOpen, onClose, onCreate, user }) => {
//   const [formData, setFormData] = useState({
//     title: "",
//     projectdomain: "",
//     description: "",
//     liveUrl: "",
//     GitHubUrl: "",
//     UserAccess: [],
//     activeStatus: true,
//   });
//   const [formError, setFormError] = useState("");

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.title || !formData.projectdomain) {
//       setFormError("Title and domain are required.");
//       return;
//     }
//     setFormError("");
//     onCreate({
//       ...formData,
//       ownership: user.id,
//       lastUpdatedAt: new Date().toISOString(),
//       updatedBy: user.username,
//     });
//     setFormData({
//       title: "",
//       projectdomain: "",
//       description: "",
//       liveUrl: "",
//       GitHubUrl: "",
//       UserAccess: [],
//       activeStatus: true,
//     });
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold text-gray-800">
//             Add New Project
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             ✕
//           </button>
//         </div>
//         <form onSubmit={handleFormSubmit}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Title *
//             </label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Domain *
//             </label>
//             <input
//               type="text"
//               name="projectdomain"
//               value={formData.projectdomain}
//               onChange={handleInputChange}
//               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Description
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
//               rows="4"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Live URL
//             </label>
//             <input
//               type="url"
//               name="liveUrl"
//               value={formData.liveUrl}
//               onChange={handleInputChange}
//               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               GitHub URL
//             </label>
//             <input
//               type="url"
//               name="GitHubUrl"
//               value={formData.GitHubUrl}
//               onChange={handleInputChange}
//               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
//             />
//           </div>
//           {/* <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               User Access (comma separated)
//             </label>
//             <input
//               type="text"
//               name="UserAccess"
//               value={formData.UserAccess.join(",")}
//               onChange={(e) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   UserAccess: e.target.value
//                     ? e.target.value.split(",").map((s) => s.trim())
//                     : [],
//                 }))
//               }
//               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
//             />
//           </div>/ */}
//           <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 User Access
//               </label>
//               <select
//                 multiple
//                 name="UserAccess"
//                 value={formData.UserAccess}
//                 onChange={(e) => {
//                   const selected = Array.from(e.target.selectedOptions, (option) => option.value);
//                   setFormData((prev) => ({ ...prev, UserAccess: selected }));
//                 }}
//                 className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
//               >
//                 <option value="Super Admin">Super Admin</option>
//                 <option value="Project Admin">Project Admin</option>
//                 <option value="End User">End User</option>
//               </select>
//               <p className="text-xs text-gray-500 mt-1">
//                 Hold Ctrl (Windows) or Cmd (Mac) to select multiple.
//               </p>
//             </div>

//           <div className="mb-4">
//             <label className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="activeStatus"
//                 checked={formData.activeStatus}
//                 onChange={handleInputChange}
//                 className="mr-2"
//               />
//               Active Status
//             </label>
//           </div>
//           {formError && (
//             <p className="text-red-600 text-sm mb-4">{formError}</p>
//           )}
//           <div className="flex justify-end gap-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//             >
//               Create Project
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddProjectModal;


"use client";
import React, { useState, useEffect, useRef } from "react";

const ROLE_OPTIONS = ["Super Admin", "Project Admin", "End User"];

const AddProjectModal = ({ isOpen, onClose, onCreate, user }) => {
  const [formData, setFormData] = useState({
    title: "",
    projectdomain: "",
    description: "",
    liveUrl: "",
    GitHubUrl: "",
    UserAccess: [],
    activeStatus: true,
  });
  const [formError, setFormError] = useState("");
  const [accessOpen, setAccessOpen] = useState(false);
  const accessRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accessRef.current && !accessRef.current.contains(e.target)) {
        setAccessOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleRole = (role) => {
    setFormData((prev) => {
      const exists = prev.UserAccess.includes(role);
      const next = exists
        ? prev.UserAccess.filter((r) => r !== role)
        : [...prev.UserAccess, role];
      return { ...prev, UserAccess: next };
    });
  };

  const removeRole = (role) => {
    setFormData((prev) => ({
      ...prev,
      UserAccess: prev.UserAccess.filter((r) => r !== role),
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.projectdomain) {
      setFormError("Title and domain are required.");
      return;
    }
    setFormError("");
    onCreate({
      ...formData,
      ownership: user.id,
      lastUpdatedAt: new Date().toISOString(),
      updatedBy: user.username,
    });
    setFormData({
      title: "",
      projectdomain: "",
      description: "",
      liveUrl: "",
      GitHubUrl: "",
      UserAccess: [],
      activeStatus: true,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add New Project</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Domain *</label>
            <input
              type="text"
              name="projectdomain"
              value={formData.projectdomain}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="4"
              style={{height:"77px"}}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Live URL</label>
            <input
              type="url"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
            <input
              type="url"
              name="GitHubUrl"
              value={formData.GitHubUrl}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* ---------- NEW User Access dropdown (fixed nested button issue) ---------- */}
            <div className="mb-4" ref={accessRef}>
              <label className="block text-sm font-medium text-gray-700">User Access</label>

              <div className="relative mt-1">
                <button
                  type="button"
                  onClick={() => setAccessOpen((v) => !v)}
                  className="w-full text-left px-3 py-2 border border-gray-300 rounded-md flex items-center justify-between gap-3"
                >
                  <div className="flex flex-wrap gap-2 items-center">
                    {formData.UserAccess.length === 0 ? (
                      <span className="text-gray-400">Select roles...</span>
                    ) : (
                      formData.UserAccess.map((role) => (
                        <span
                          key={role}
                          className="text-xs flex items-center gap-2 bg-gray-100 px-2 py-1 rounded"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {role}
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeRole(role);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") removeRole(role);
                            }}
                            className="text-gray-500 hover:text-gray-700 text-xs cursor-pointer"
                          >
                            ✕
                          </span>
                        </span>
                      ))
                    )}
                  </div>

                  <svg
                    className={`w-4 h-4 transform ${accessOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M6 8l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {accessOpen && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow max-h-44 overflow-auto">
                    {ROLE_OPTIONS.map((role) => (
                      <label
                        key={role}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.UserAccess.includes(role)}
                          onChange={() => toggleRole(role)}
                        />
                        <span className="select-none">{role}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-1">Select one or more roles.</p>
            </div>
            {/* ---------- end User Access dropdown ---------- */}


          <div className="mb-4">
            <label className="flex items-center">
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

          {formError && <p className="text-red-600 text-sm mb-4">{formError}</p>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
