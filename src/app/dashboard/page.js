
// // ./app/dashboard/page.js
// "use client";
// import React, { useEffect, useState } from "react";
// import Sidebar from "../../component/Sidebar";
// import Header from "../../component/Header";
// import Card from "../../component/Card";
// import Chatboat from "@/component/Chatboat";
// import { useProductContext } from "@/context/ProductContext";
// import { useRouter } from "next/navigation";
// import Footer from "@/component/Footer";
// import { LayoutGrid, Table as TableIcon } from "lucide-react";

// const LandingDashboard = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [cards, setCards] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [viewMode, setViewMode] = useState("grid");
//   const [user, setUser] = useState(null);
//   const [cardsPerPage] = useState(6);
//   const {
//     selectedDomains,
//     setSelectedDomains,
//     availableDomains,
//     setAvailableDomains,
//   } = useProductContext();
//   const router = useRouter();

//   useEffect(() => {
//     // Fetch logged-in user
//     fetch("/api/me", { credentials: "include" })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.user) setUser(data.user);
//       });

//     // Fetch data without client-side token check
//     fetch("/api/projects", {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include", // Ensure cookies are sent
//     })
//       .then((response) => {
//         if (!response.ok) {
//           if (response.status === 401) {
//             router.push("/login"); // Redirect if unauthorized
//             return;
//           }
//           throw new Error(
//             `Failed to fetch data: ${response.status} ${response.statusText}`
//           );
//         }
//         return response.json();
//       })
//       .then((data) => {
//         const cardList = data;
//         console.log("Processed Card List:", cardList);
//         console.log(
//           "Domains from cards:",
//           cardList.map((c) => c.projectdomain)
//         );
//         setCards(cardList);
//         const uniqueDomains = [
//           "All",
//           ...new Set(
//             cardList.map((card) => card.projectdomain).filter(Boolean)
//           ),
//         ];
//         setAvailableDomains(uniqueDomains);
//         setSelectedDomains(["All"]);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Fetch error:", err);
//         setError(err.message);
//         if (err.message.includes("401")) router.push("/login");
//         setLoading(false);
//       });
//   }, [router]);

//   // const currentUserId = localStorage.getItem('userId');
//   // console.log("Current User ID:", currentUserId);

//   const filteredCards = selectedDomains.includes("All")
//     ? cards
//     : cards.filter((card) => selectedDomains.includes(card.projectdomain));

//   const indexOfLastCard = currentPage * cardsPerPage;
//   const indexOfFirstCard = indexOfLastCard - cardsPerPage;
//   const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);
//   const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

//   const paginate = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await fetch("/api/projects", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//         credentials: "include", // cookie sent
//       });

//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(
//           data.error ||
//             `Failed to delete: ${response.status} ${response.statusText}`
//         );
//       }

//       setCards(cards.filter((card) => card.id !== id));
//     } catch (err) {
//       console.error("Delete Error:", err.message);
//       alert(err.message);
//     }
//   };

//   const handleUpdate = async (id, updatedData) => {
//     try {
//       console.log("Sending update for project:", { id, updatedData });
//       const token = localStorage.getItem("token");
//       const response = await fetch("/api/projects", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ id, ...updatedData }),
//         credentials: "include",
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Server error:", errorData);
//         throw new Error(
//           errorData.error ||
//             `Failed to update: ${response.status} ${response.statusText}`
//         );
//       }
//       const updatedProject = await response.json();
//       console.log("Received updated project:", updatedProject);
//       setCards(
//         cards.map((card) => (card.id === id.toString() ? updatedProject : card))
//       );
//     } catch (err) {
//       console.error("Update error:", err);
//       setError(err.message);
//       if (err.message.includes("403")) {
//         alert("Only the owner can edit this project.");
//       } else {
//         alert(`Error: ${err.message}`);
//       }
//     }
//   };

//   const handleCreate = async (newProjectData) => {
//     try {
//       const response = await fetch("/api/projects", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newProjectData),
//         credentials: "include",
//       });
//       if (!response.ok)
//         throw new Error(
//           `Failed to create: ${response.status} ${response.statusText}`
//         );
//       const createdProject = await response.json();
//       setCards([...cards, createdProject]);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   if (loading && !error) return <p className="text-gray-600">Loading...</p>;
//   if (error) return <p className="text-red-600">Error: {error}</p>;

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Sidebar isOpen={isSidebarOpen} />
//       <div
//         className={`transition-all duration-300 ${
//           isSidebarOpen ? "ml-64" : "ml-0"
//         }`}
//       >
//         <Header
//           toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
//           isSidebarOpen={isSidebarOpen}
//           onLogout={() => {
//             router.push("/login");
//           }}
//         />
//         <div className="flex items-center justify-between px-6 pt-4">
//           <div>
//             <button>
//               <span
//                 className="mr-2 font-medium 
//             bg-blue-500 text-white px-3 py-2 rounded-lg shadow hover:bg-blue-400
//             text-gray-700"
//               >
//                 + New Project
//               </span>
//             </button>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={() => setViewMode("grid")}
//               className={`p-2 rounded-lg transition ${
//                 viewMode === "grid"
//                   ? "bg-blue-500 text-white shadow-md"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//             >
//               <LayoutGrid className="w-5 h-5" />
//             </button>
//             <button
//               onClick={() => setViewMode("table")}
//               className={`p-2 rounded-lg transition ${
//                 viewMode === "table"
//                   ? "bg-blue-500 text-white shadow-md"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//             >
//               <TableIcon className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//         <main className="p-6">
//           {viewMode === "grid" && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {currentCards.map((card) => (
//                 <Card
//                   key={card.id}
//                   title={card.title}
//                   url={card.GitHubUrl}
//                   liveUrl={card.liveUrl}
//                   description={card.description}
//                   activeStatus={card.activeStatus}
//                   lastUpdatedAt={card.lastUpdatedAt}
//                   updatedBy={card.updatedBy}
//                   UserAccess={card.UserAccess}
//                   onDelete={() => handleDelete(card.id)}
//                   onUpdate={(updatedData) => handleUpdate(card.id, updatedData)}
//                   onCreate={handleCreate}
//                   ownership={card.ownership}
//                   currentUserId={user.id}
//                 />
//               ))}
//             </div>
//           )}

//           {/* Table View */}
//           {viewMode === "table" && (
//             <div className="overflow-x-auto rounded-xl shadow bg-white">
//               <table className="min-w-full border-collapse">
//                 <thead className="bg-blue-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
//                       Title
//                     </th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
//                       Domain
//                     </th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
//                       Status
//                     </th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
//                       Last Updated
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {currentCards.map((card, idx) => (
//                     <tr
//                       key={card.id}
//                       className={`${
//                         idx % 2 === 0 ? "bg-white" : "bg-gray-50"
//                       } hover:bg-blue-50 transition`}
//                     >
//                       <td className="px-4 py-3 text-gray-800 font-medium">
//                         {card.title}
//                       </td>
//                       <td className="px-4 py-3 text-gray-600">
//                         {card.projectdomain}
//                       </td>
//                       <td className="px-4 py-3">
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-medium ${
//                             card.activeStatus === true
//                               ? "bg-green-400 text-green-700"
//                               : "bg-red-400 text-red-700"
//                           }`}
//                         >
//                           {card.activeStatus}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-gray-500 text-sm">
//                         {new Date(card.lastUpdatedAt).toLocaleDateString()}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {filteredCards.length > cardsPerPage && (
//             <div className="mt-6 flex items-center justify-center gap-2">
//               <button
//                 className={`px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
//                 onClick={() => paginate(currentPage - 1)}
//                 disabled={currentPage === 1}
//               >
//                 Previous
//               </button>
//               <div className="flex gap-1">
//                 {Array.from({ length: totalPages }, (_, index) => (
//                   <button
//                     key={index + 1}
//                     className={`px-3 py-1 rounded-md ${
//                       currentPage === index + 1
//                         ? "bg-blue-600 text-white"
//                         : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//                     } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
//                     onClick={() => paginate(index + 1)}
//                   >
//                     {index + 1}
//                   </button>
//                 ))}
//               </div>
//               <button
//                 className={`px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
//                 onClick={() => paginate(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//           <Chatboat />
//         </main>
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default LandingDashboard;




"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../component/Sidebar";
import Header from "../../component/Header";
import Card from "../../component/Card";
import Chatboat from "@/component/Chatboat";
import { useProductContext } from "@/context/ProductContext";
import { useRouter } from "next/navigation";
import Footer from "@/component/Footer";
import { LayoutGrid, Table as TableIcon, Plus } from "lucide-react";

const LandingDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
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
  const [cardsPerPage] = useState(6);
  const {
    selectedDomains,
    setSelectedDomains,
    availableDomains,
    setAvailableDomains,
  } = useProductContext();
  const router = useRouter();

  useEffect(() => {
    // Fetch logged-in user
    fetch("/api/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      });

    // Fetch projects
    fetch("/api/projects", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error(
            `Failed to fetch data: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        const cardList = data;
        console.log("Processed Card List:", cardList);
        // console.log(
        //   "Domains from cards:",
        //   cardList.map((c) => c.projectdomain)
        // );
        setCards(cardList);
        const uniqueDomains = [
          "All",
          ...new Set(
            cardList.map((card) => card.projectdomain).filter(Boolean)
          ),
        ];
        setAvailableDomains(uniqueDomains);
        setSelectedDomains(["All"]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
        if (err.message.includes("401")) router.push("/login");
        setLoading(false);
      });
  }, [router]);

  const filteredCards = selectedDomains.includes("All")
    ? cards
    : cards.filter((card) => selectedDomains.includes(card.projectdomain));

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error ||
            `Failed to delete: ${response.status} ${response.statusText}`
        );
      }

      setCards(cards.filter((card) => card.id !== id));
    } catch (err) {
      console.error("Delete Error:", err.message);
      alert(err.message);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      console.log("Sending update for project:", { id, updatedData });
      const token = localStorage.getItem("token");
      const response = await fetch("/api/projects", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, ...updatedData }),
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(
          errorData.error ||
            `Failed to update: ${response.status} ${response.statusText}`
        );
      }
      const updatedProject = await response.json();
      console.log("Received updated project:", updatedProject);
      setCards(
        cards.map((card) => (card.id === id.toString() ? updatedProject : card))
      );
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
      if (err.message.includes("403")) {
        alert("Only the owner can edit this project.");
      } else {
        alert(`Error: ${err.message}`);
      }
    }
  };

  const handleCreate = async (newProjectData) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newProjectData,
          ownership: user.id, // Set the current user as the owner
          lastUpdatedAt: new Date().toISOString(),
          updatedBy: user.username,
        }),
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to create: ${response.status} ${response.statusText}`
        );
      }
      const createdProject = await response.json();
      setCards([...cards, createdProject]);
      setIsModalOpen(false); // Close modal on success
      setFormData({
        title: "",
        projectdomain: "",
        description: "",
        liveUrl: "",
        GitHubUrl: "",
        UserAccess: [],
        activeStatus: true,
      });
      alert("Project created successfully!");
    } catch (err) {
      console.error("Create Error:", err.message);
      setFormError(err.message);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.projectdomain) {
      setFormError("Title and domain are required.");
      return;
    }
    setFormError("");
    handleCreate(formData);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUserAccessChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      UserAccess: prev.UserAccess.includes(value)
        ? prev.UserAccess.filter((user) => user !== value)
        : [...prev.UserAccess, value],
    }));
  };

  if (loading && !error) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} />
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Header
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          onLogout={() => {
            router.push("/login");
          }}
        />
        <div className="flex items-center justify-end px-6 pt-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="w-5 h-5" />
            Add New Project
          </button>
          <div className="flex gap-3 ml-4">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition ${
                viewMode === "grid"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg transition ${
                viewMode === "table"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <TableIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        <main className="p-6">
          {/* Modal for Adding New Project */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Add New Project
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Domain *
                    </label>
                    <input
                      type="text"
                      name="projectdomain"
                      value={formData.projectdomain}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Live URL
                    </label>
                    <input
                      type="url"
                      name="liveUrl"
                      value={formData.liveUrl}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      name="GitHubUrl"
                      value={formData.GitHubUrl}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      User Access (usernames, comma-separated)
                    </label>
                    <input
                      type="text"
                      name="UserAccess"
                      value={formData.UserAccess.join(",")}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          UserAccess: e.target.value
                            ? e.target.value.split(",").map((s) => s.trim())
                            : [],
                        }))
                      }
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="activeStatus"
                        checked={formData.activeStatus}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Active Status
                      </span>
                    </label>
                  </div>
                  {formError && (
                    <p className="text-red-600 text-sm mb-4">{formError}</p>
                  )}
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                    >
                      Create Project
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Cards Section */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentCards.map((card) => (
                <Card
                  key={card.id}
                  title={card.title}
                  url={card.GitHubUrl}
                  liveUrl={card.liveUrl}
                  description={card.description}
                  activeStatus={card.activeStatus}
                  lastUpdatedAt={card.lastUpdatedAt}
                  updatedBy={card.updatedBy}
                  UserAccess={card.UserAccess}
                  onDelete={() => handleDelete(card.id)}
                  onUpdate={(updatedData) => handleUpdate(card.id, updatedData)}
                  onCreate={handleCreate}
                  ownership={card.ownership}
                  currentUserId={user.id}
                />
              ))}
            </div>
          )}
          {/* Table View */}
          {viewMode === "table" && (
            <div className="overflow-x-auto rounded-xl shadow bg-white">
              <table className="min-w-full border-collapse">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Domain
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentCards.map((card, idx) => (
                    <tr
                      key={card.id}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="px-4 py-3 text-gray-800 font-medium">
                        {card.title}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {card.projectdomain}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            card.activeStatus === true
                              ? "bg-green-400 text-green-700"
                              : "bg-red-400 text-red-700"
                          }`}
                        >
                          {card.activeStatus ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {new Date(card.lastUpdatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {filteredCards.length > cardsPerPage && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                className={`px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                className={`px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
          <Chatboat />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default LandingDashboard;
