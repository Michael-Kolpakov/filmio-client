import "./App.styles.css";
import "react-toastify/dist/ReactToastify.css";
import HeaderBlock from "../header/HeaderBlock.component";
import FooterBlock from "../footer/Footer.component";
import { ToastContainer } from "react-toastify";
import ModalWrapper from "../ModelWrapper.component";
import { Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";
import React from "react";

const App: React.FC = observer(() => {
  return (
    <div className="app">
      <ToastContainer position="bottom-right" hideProgressBar limit={3} />
      <ModalWrapper />
      <HeaderBlock />
      <div className="content">
        <Outlet />
      </div>
      <FooterBlock />
    </div>
  );
});

export default App;
