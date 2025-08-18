"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../component/Sidebar";
import Header from "../../component/Header";
import Card from "../../component/Card";
import Chatboat from "@/component/Chatboat";
import { useProductContext } from "@/context/ProductContext";

const LandingDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(6);
  const {
    selectedDomains,
    setSelectedDomains,
    availableDomains,
    setAvailableDomains,
  } = useProductContext();

useEffect(() => {
  const token = localStorage.getItem("token"); // Retrieve token from localStorage
  fetch("/api/projects", {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "", // Include token if available
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      const cardList = data;
      console.log("Processed Card List:", cardList);
      console.log("Domains from cards:", cardList.map((c) => c.projectdomain));
      setCards(cardList);
      const uniqueDomains = [
        "All",
        ...new Set(cardList.map((card) => card.projectdomain).filter(Boolean)),
      ];
      setAvailableDomains(uniqueDomains);
      setSelectedDomains(["All"]);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      setError(err.message);
      setLoading(false);
    });
}, []);
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

  // CRUD Functions
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await fetch("/api/projects", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!response.ok) throw new Error("Failed to delete");
        setCards(cards.filter((card) => card.id !== id.toString()));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const response = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updatedData }),
      });
      if (!response.ok) throw new Error("Failed to update");
      const updatedProject = await response.json();
      setCards(cards.map((card) => (card.id === id.toString() ? updatedProject : card)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreate = async (newProjectData) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProjectData),
      });
      if (!response.ok) throw new Error("Failed to create");
      const createdProject = await response.json();
      setCards([...cards, createdProject]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <Header
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="p-6">
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-red-600">Error: {error}</p>
          ) : (
            <>
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
                  />
                ))}
              </div>
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
            </>
          )}
          <Chatboat />
        </main>
      </div>
    </div>
  );
};

export default LandingDashboard;
// "use client";
// import React, { useEffect, useState } from "react";
// import Sidebar from "../../component/Sidebar"; // Adjust the import path as necessary
// import Header from "../../component/Header"; // Adjust the import path as necessary
// import Card from "../../component/Card";
// import Chatboat from "@/component/Chatboat";
// import { useProductContext } from "@/context/ProductContext";

// const LandingDashboard = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [cards, setCards] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [cardsPerPage] = useState(6);
//   const {
//     selectedDomains,
//     setSelectedDomains,
//     availableDomains,
//     setAvailableDomains,
//   } = useProductContext();

//   useEffect(() => {
//     fetch("/api/dashboard")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to fetch data");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         const cardList = data; 
//       //  const cardList = Array.isArray(data) ? data : data.cards || [];

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

//         // const uniqueDomains = [
//         //   "All",
//         //   ...new Set(cardList.map((card) => card.projectdomain)),
//         // ];

//         setAvailableDomains(uniqueDomains);
//         setSelectedDomains(["All"]);

//         // Push to context

//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   const filteredCards = selectedDomains.includes("All")
//     ? cards
//     : cards.filter((card) => selectedDomains.includes(card.projectdomain));



//   // Calculate the index of the first and last card for the current page
//   const indexOfLastCard = currentPage * cardsPerPage;
//   const indexOfFirstCard = indexOfLastCard - cardsPerPage;
//   const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);
//   const totalPages = Math.ceil(filteredCards.length / cardsPerPage);



//   // Handle page change
//   const paginate = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

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
//         />
//         <main className="p-6">
//           {/* <h1 className="text-2xl font-bold mb-4">Dashboard Content</h1> */}
//           {loading ? (
//             <p className="text-gray-600">Loading...</p>
//           ) : error ? (
//             <p className="text-red-600">Error: {error}</p>
//           ) : (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {currentCards.map((card) => (
//                   <Card
//                     key={card.id} // Assuming each card has a unique 'id' from the API
//                     title={card.title}
//                     url={card.GitHubUrl} // Mapping GitHubUrl to url prop as per Card component
//                     liveUrl={card.liveUrl}
//                     description={card.description}
//                     activeStatus={card.activeStatus}
//                     lastUpdatedAt={card.lastUpdatedAt}
//                     updatedBy={card.updatedBy} //
//                     UserAccess={card.UserAccess}
//                   />
//                 ))}
//               </div>
//               {/* Pagination Controls */}
//               {filteredCards.length > cardsPerPage && (
//                 <div className="mt-6 flex items-center justify-center gap-2">
//                   <button
//                     className={`px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
//                     onClick={() => paginate(currentPage - 1)}
//                     disabled={currentPage === 1}
//                   >
//                     Previous
//                   </button>
//                   <div className="flex gap-1">
//                     {Array.from({ length: totalPages }, (_, index) => (
//                       <button
//                         key={index + 1}
//                         className={`px-3 py-1 rounded-md ${
//                           currentPage === index + 1
//                             ? "bg-blue-600 text-white"
//                             : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//                         } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
//                         onClick={() => paginate(index + 1)}
//                       >
//                         {index + 1}
//                       </button>
//                     ))}
//                   </div>
//                   <button
//                     className={`px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
//                     onClick={() => paginate(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                   >
//                     Next
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//           <Chatboat />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default LandingDashboard;
