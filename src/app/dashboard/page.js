

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
import AddProjectModal from "@/component/AddProjectModal";
import { initSocket } from "@/lib/socketClient";
import toast from "react-hot-toast";
import { useUser } from "@/context/UserContext";

const LandingDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, setUser } = useUser();

  const [cardsPerPage] = useState(6);
  const {
    selectedDomains,
    setSelectedDomains,
    availableDomains,
    setAvailableDomains,
  } = useProductContext();
  const router = useRouter();


//  useEffect(() => {
//     if (!user?.id) return;

//     console.log("🔌 Connecting socket for user:", user.id);
//     const socket = initSocket(user.id);

//     // 🧭 Listen for events coming to this user
//     socket.on("connect", () => {
//       console.log("✅ Connected to Socket.IO server as user:", user.id);
//     });

//     // ✅ When a normal user sends a request to admin
//     socket.on("newRequest", (request) => {
//       console.log("📩 New request received:", request);

//       if (user.role === "admin") {
//         toast.success(`New1 request from User ${request.fromUserId} for role ${request.roleRequested}`);
//       }

//     });

//     // ✅ When admin replies to a specific user
//     socket.on("adminReply", async (reply) => {
//       console.log("📬 Reply from Admin:", reply);

//       if (user.role !== "admin") {
//          toast(`Admin replied: ${reply.message}`, { icon: "💬" });
//       }

//           if (reply.message === "Accepted") {
//       try {
//         const res = await fetch("/api/me", { credentials: "include" });
//         const data = await res.json();
//         if (data.user) {
//           setUser(data.user); // update role in state/context instantly
//           toast.success(`🎉 Your role has been updated to ${data.user.role}`);
//         }
//       } catch (error) {
//         console.error("Error refreshing user role:", error);
//       }
//     }



//       // Example: setNotifications((prev) => [...prev, reply]);
//     });

//     // ✅ Optional: handle disconnects
//     socket.on("disconnect", () => {
//       console.log("❌ Disconnected from socket server");
//     });

//     // ✅ Cleanup on component unmount
//     return () => {
//       socket.off("connect");
//       socket.off("newRequest");
//       socket.off("adminReply");
//       socket.off("disconnect");
//       socket.disconnect();
//     };
//   }, [user?.id, user?.role]);
  


//   //  Fetch User + Projects
//   useEffect(() => {
//     if (!user?.id) return;
//     // Fetch projects
//     fetch("/api/projects", {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//     })
//       .then((response) => {
//         if (!response.ok) {
//           if (response.status === 401) {
//             router.push("/login");
//             return;
//           }
//           throw new Error(
//             `Failed to fetch data: ${response.status} ${response.statusText}`
//           );
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setCards(data);
//         const uniqueDomains = [
//           "All",
//           ...new Set(data.map((card) => card.projectdomain).filter(Boolean)),
//         ];
//         setAvailableDomains(uniqueDomains);
//         setSelectedDomains(["All"]);
//         setLoading(false);
//         console.log("Fetched projects:", data);
//       })
//       .catch((err) => {
//         console.error("Fetch error:", err);
//         setError(err.message);
//         if (err.message.includes("401")) router.push("/login");
//         setLoading(false);
//       });
//   }, [router, setAvailableDomains, setSelectedDomains]);

//   //  Filtering & Pagination
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

//   //  Delete Project
//   const handleDelete = async (id) => {
//     try {
//       const response = await fetch("/api/projects", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//         credentials: "include",
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
//       toast.error(`${err.message}`);
//     }
//   };

//   //  Update Project
//   const handleUpdate = async (id, updatedData) => {
//     try {
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
//         throw new Error(
//           errorData.error ||
//             `Failed to update: ${response.status} ${response.statusText}`
//         );
//       }
//       const updatedProject = await response.json();
//       setCards(
//         cards.map((card) => (card.id === id.toString() ? updatedProject : card))
//       );
//     } catch (err) {
//       console.error("Update error:", err);
//       if (err.message.includes("403")) {
//         toast.success(`Only the owner can edit this project.`);
//       } else {
        
//         toast.error(`Error: ${err.message}`);
//       }
//     }
//   };

//   //  Create Project
//   const handleCreate = async (newProjectData) => {
//     try {
//       const response = await fetch("/api/projects", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newProjectData),
//         credentials: "include",
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           errorData.error ||
//             `Failed to create: ${response.status} ${response.statusText}`
//         );
//       }
//       const createdProject = await response.json();
//       setCards([...cards, createdProject]);
//       setIsModalOpen(false);
//       toast.success(`Project created successfully!`);
//     } catch (err) {
//       console.error("Create Error:", err.message);
//       toast.error(`${err.message}`);
//     }
//   };

//   if (loading && !error) return <p className="text-gray-600">Loading...</p>;
//   if (error) return <p className="text-red-600">Error: {error}</p>;

 
  // --- Ensure user data is loaded on mount / reload
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (!res.ok) {
          // not authenticated -> send to login
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("User fetch failed:", err);
        router.push("/login");
      }
    };

    // fetch user only if not set
    if (!user?.id) {
      fetchUser();
    }
  }, [user?.id, router, setUser]);
  const handleSates = () => {
    console.log("useStae",user);
  }

  // --- Socket setup (only after user available)
  useEffect(() => {
    if (!user?.id) return;

    console.log("🔌 Connecting socket for user:", user.id);
    const socket = initSocket(user.id);

    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server as user:", user.id);
    });

    socket.on("newRequest", (request) => {

      console.log("📩 New request received:", request);
      if (user.role === "admin") {
        toast.success(
          `New request from User ${request.fromUserId} for role ${request.roleRequested}`
        );
      }
    });

    socket.on("adminReply", async (reply) => {
      console.log("📬 Reply from Admin:", reply);

      if (user.role !== "admin") {
        // toast(`Admin replied: ${reply.message}`, { icon: "💬" });
      }

      if (reply.message === 'Accepted') {
        try {
          // console.log("Fetching updated user role...",reply);
          const res = await fetch("/api/me", { credentials: "include" });
          const data = await res.json();
          console.log("Updated user data:", data);
          if (data.user) {
            setUser(data.user); // update role in state/context instantly
            toast.success(`🎉 Your role has been updated to ${data.user.role}`);
          }
        } catch (error) {
          console.error("Error refreshing user role:", error);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from socket server");
    });

    // cleanup
    return () => {
      try {
        socket.off("connect");
        socket.off("newRequest");
        socket.off("adminReply");
        socket.off("disconnect");
        socket.disconnect();
      } catch (err) {
        // ignore if socket already cleaned
      }
    };
  }, [user?.id]);

  // --- Fetch projects (only after user is available)
  const fetchProjects = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await fetch("/api/projects", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error(
          `Failed to fetch data: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setCards(data);
      const uniqueDomains = [
        "All",
        ...new Set(data.map((card) => card.projectdomain).filter(Boolean)),
      ];
      setAvailableDomains(uniqueDomains);
      setSelectedDomains(["All"]);
      setLoading(false);
      console.log("Fetched projects:", data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch projects");
      if (err.message && err.message.includes("401")) {
        router.push("/login");
      }
      setLoading(false);
    }
  }; 

  useEffect(() => {
    // call fetchProjects only when user becomes available
    if (user?.id) {
      fetchProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // --- Filtering & Pagination
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

  // --- Delete Project
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

      setCards((prev) => prev.filter((card) => card.id !== id));
      toast.success("Project deleted");
    } catch (err) {
      console.error("Delete Error:", err.message);
      toast.error(`${err.message}`);
    }
  };

  // --- Update Project
  const handleUpdate = async (id, updatedData) => {
    try {
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
        throw new Error(
          errorData.error ||
            `Failed to update: ${response.status} ${response.statusText}`
        );
      }
      const updatedProject = await response.json();
      setCards((prev) =>
        prev.map((card) =>
          card.id === id.toString() ? updatedProject : card
        )
      );
      toast.success("Project updated");
    } catch (err) {
      console.error("Update error:", err);
      if (err.message.includes("403")) {
        toast.success(`Only the owner can edit this project.`);
      } else {
        toast.error(`Error: ${err.message}`);
      }
    }
  };

  // --- Create Project (opens modal)
  const handleCreate = () => {
    setIsModalOpen(true);
  };

  // called by modal after successful creation
  const handleProjectAdded = async () => {
    setIsModalOpen(false);
    toast.success("Project created successfully!");
    await fetchProjects();
  };

  // --- loading / error display
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
          onLogout={() => router.push("/login")}
        />

        {/* Top Controls */}
        <div className="flex items-center justify-end px-6 pt-4">
          {user?.role !== "enduser" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="w-5 h-5" />
              Add New Project
            </button>
          )}
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

        {/* Main Content */}
        <main className="p-6">
          {/*  Add Project Modal */}
          <AddProjectModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreate={handleCreate}
            user={user}
          />

          {/*  Grid View */}
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
                  currentUserId={user?.id}
                  currentUserRole={user?.role}
                  ownership={card.ownership}
                />
              ))}
            </div>
          )}

          {/*  Table View */}
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
                            card.activeStatus
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

          {/*  Pagination */}
          {filteredCards.length > cardsPerPage && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
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
                    }`}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
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


