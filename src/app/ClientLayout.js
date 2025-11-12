// "use client";

// import { ProductProvider } from "../context/ProductContext";
// import { Toaster } from "react-hot-toast";

// export default function ClientLayout({ children }) {
//   return (
//     <ProductProvider>
//       {children}
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 4000,
//           style: {
//             background: "#1e293b",
//             color: "#fff",
//             borderRadius: "8px",
//             fontSize: "14px",
//           },
//           success: {
//             style: { background: "#16a34a" },
//           },
//           error: {
//             style: { background: "#dc2626" },
//           },
//         }}
//       />
//     </ProductProvider>
//   );
// }



"use client";

import { ProductProvider } from "../context/ProductContext";
import { UserProvider } from "../context/UserContext";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children }) {
  return (
    <UserProvider>
      <ProductProvider>
        {children}

        {/* ✅ Global Toast Notification */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1e293b",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "14px",
            },
            success: {
              style: { background: "#16a34a" },
            },
            error: {
              style: { background: "#dc2626" },
            },
          }}
        />
      </ProductProvider>
    </UserProvider>
  );
}
