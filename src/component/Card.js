'use client';
import { useState } from "react";

const Card = ({ title, liveUrl, GitHubUrl, description, activeStatus, lastUpdatedAt, updatedBy, UserAccess}) => {
 const isDisabled = activeStatus !== true;
 const isLiveUrlDisabled = activeStatus !== true || !UserAccess || !(UserAccess.includes("developer") || UserAccess.includes("admin"));

 const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="mt-2 text-gray-600 line-clamp-2">{description}..</p>
       <button
          className="mt-2 text-blue-600 hover:underline focus:outline-none"
          onClick={openModal}
        >
          Know More
        </button>
      <div className="mt-4 flex gap-6">
        <button
          className={`px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            isDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => !isDisabled && (window.location.href = liveUrl)}
          disabled={isDisabled}
        >
          Open Live Demo
        </button>
        <button
            className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
              isLiveUrlDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => !isLiveUrlDisabled && (window.location.href = GitHubUrl)}
            disabled={isLiveUrlDisabled}
          >
          Source Code
        </button>
      </div>
      <div className="mt-4">
       <p className="card-text"><small className="text-muted text-gray-600">Last Updated By {updatedBy},  On {lastUpdatedAt}</small></p>
    </div>
    </div>


     {/* Modal for full description */}
      {isModalOpen && (
        <div
  className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50"
  onClick={closeModal}
>
  <div
    className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto relative"
    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
  >
    {/* Close Button */}
    <button
      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1 transition-colors"
      onClick={closeModal}
      aria-label="Close modal"
    >
      ✕
    </button>

    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    <p className="text-gray-600">{description}</p>
    <button
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      onClick={closeModal}
    >
      Ok
    </button>
  </div>
</div>
        // <div
        //   className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50"
        //   onClick={closeModal}
        // >
        //   <div
        //     className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto"
        //     onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        //   >
        //     <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        //     <p className="text-gray-600">{description}</p>
        //     <button
        //       className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        //       onClick={closeModal}
        //     >
        //       Ok
        //     </button>
        //   </div>
        // </div>
      )}
    </>
  );
};
export default Card;
