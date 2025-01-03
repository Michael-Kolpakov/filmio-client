import "./styles.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { store, StoreContext } from "./app/stores/root-store.ts";
import { RouterProvider } from "react-router-dom";
import router from "./app/router/Routes.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <RouterProvider router={router} />
    </StoreContext.Provider>
  </React.StrictMode>
);
