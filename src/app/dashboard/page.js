'use client'
import React, { useEffect, useState } from 'react';
import Sidebar from '../../component/Sidebar'; // Adjust the import path as necessary
import Header from '../../component/Header'; // Adjust the import path as necessary
import Card from '../../component/Card'; 
import Chatboat from '@/component/Chatboat';


const LandingDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(6); // Adjust this number as needed

  useEffect(() => {
    fetch('/api/dashboard')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        setCards(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Calculate the index of the first and last card for the current page
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);

  // Calculate total pages
  const totalPages = Math.ceil(cards.length / cardsPerPage);

  // Handle page change
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        <main className="p-6">
          {/* <h1 className="text-2xl font-bold mb-4">Dashboard Content</h1> */}
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-red-600">Error: {error}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentCards.map(card => (
                  <Card
                    key={card.id} // Assuming each card has a unique 'id' from the API
                    title={card.title}
                    url={card.GitHubUrl} // Mapping GitHubUrl to url prop as per Card component
                    liveUrl={card.liveUrl}
                    description={card.description} 
                    activeStatus= {card.activeStatus}
                    lastUpdatedAt={card.lastUpdatedAt}
                    updatedBy={card.updatedBy} //
                    UserAccess={card.UserAccess} 
                  />
                ))}
              </div>
              {/* Pagination Controls */}
              {cards.length > cardsPerPage && (
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
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
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
          <Chatboat/>
        </main>
      </div>
    </div>
  );
};

export default LandingDashboard;

