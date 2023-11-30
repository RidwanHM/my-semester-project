import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "./root.js";
import { RouterProvider } from "@tanstack/react-router";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
