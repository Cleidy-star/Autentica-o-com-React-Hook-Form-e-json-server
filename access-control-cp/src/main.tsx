import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./globails.css";

import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import App from "./App";
import Login from "./routes/Home";       
import Cadastro from "./routes/Cadastro"; 
import ErrorPage from "./routes/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      
      { index: true, element: <Navigate to="/login" replace /> },

      { path: "login", element: <Login /> },
      { path: "cadastro", element: <Cadastro /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
