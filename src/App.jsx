import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppRoutes from "./routes/index";
import { FormModalProvider } from "./context/FormModalContext";
import FormModal from "./components/FormModal";

import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <FormModalProvider>
        <Routes>
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
        <FormModal />
      </FormModalProvider>
    </BrowserRouter>
  );
}

export default App;