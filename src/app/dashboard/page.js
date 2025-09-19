// ./app/dashboard/page.js (or ./pages/dashboard.js)
"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../component/Sidebar";
import Header from "../../component/Header";
import Card from "../../component/Card";
import Chatboat from "@/component/Chatboat";
import { useProductContext } from "@/context/ProductContext";
import { useRouter } from "next/navigation";
import Footer from "@/component/Footer";
import { LayoutGrid, Table as TableIcon } from "lucide-react";


const LandingDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
   const [viewMode, setViewMode] = useState("grid");
  const [user, setUser] = useState(null); 
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

    // Fetch data without client-side token check
    fetch("/api/projects", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Ensure cookies are sent
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login"); // Redirect if unauthorized
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
        console.log(
          "Domains from cards:",
          cardList.map((c) => c.projectdomain)
        );
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

  // const currentUserId = localStorage.getItem('userId');
  // console.log("Current User ID:", currentUserId);

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
      credentials: "include", // ✅ cookie sent
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || `Failed to delete: ${response.status} ${response.statusText}`);
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
        body: JSON.stringify(newProjectData),
        credentials: "include",
      });
      if (!response.ok)
        throw new Error(
          `Failed to create: ${response.status} ${response.statusText}`
        );
      const createdProject = await response.json();
      setCards([...cards, createdProject]);
    } catch (err) {
      setError(err.message);
    }
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
         <div className="flex gap-3">
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
                              {card.activeStatus}
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
                className={`px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
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
                className={`px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
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
