import "./App.styles.css";
import "react-toastify/dist/ReactToastify.css";
import HeaderBlock from "../header/HeaderBlock.component";
import FooterBlock from "../footer/Footer.component";
import { ToastContainer } from "react-toastify";
import FilmsList from "../../../features/FilmsList/FilmsList.component";
import ModalWrapper from "../ModelWrapper.component";
import { Outlet, useLocation } from "react-router-dom";
import { FRONTEND_ROUTES } from "../../common/constants/frontend-routes.constants";
import { observer } from "mobx-react-lite";
import React from "react";

const App: React.FC = observer(() => {
  const location = useLocation();

  return (
    <div className="app">
      <ToastContainer position="bottom-right" hideProgressBar limit={3} />
      <ModalWrapper />
      <HeaderBlock />
      <div className="content">
        {location.pathname === FRONTEND_ROUTES.BASE ? (
          <div>
            <h1>Films List</h1>
            <FilmsList />
          </div>
        ) : (
          <Outlet />
        )}
      </div>
      <FooterBlock />
    </div>
  );
});

export default App;
