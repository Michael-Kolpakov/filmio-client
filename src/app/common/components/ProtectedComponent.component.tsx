import { observer } from "mobx-react-lite";
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useMobx from "../../stores/root-store";
import { FRONTEND_ROUTES } from "../constants/frontend-routes.constants";

const ProtectedComponent: React.FC<{ children: ReactNode }> = observer(({ children }) => {
  const { usersStore } = useMobx();
  const isLoggedIn = usersStore.getIsUserLoggedIn();

  if (!isLoggedIn) {
    return <Navigate to={FRONTEND_ROUTES.MAIN.REGISTRATION} />;
  }

  return <>{children}</>;
});

export default ProtectedComponent;
