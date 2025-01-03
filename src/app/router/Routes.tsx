import App from "../layout/app/App.component.tsx";
import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom";
import ViewFilm from "../../features/ViewFilm/ViewFilm.component.tsx";
import NotFound from "../../features/Errors/NotFound/NotFound.component.tsx";
import ServerError from "../../features/Errors/ServerError/ServerError.component.tsx";
import { FRONTEND_ROUTES } from "../common/constants/frontend-routes.constants.ts";
import Login from "../../features/Login/Login.component.tsx";
import Registration from "../../features/Registration/Registration.component.tsx";
import ProtectedComponent from "../common/components/ProtectedComponent.component.tsx";
import FilmsList from "../../features/FilmsList/FilmsList.component.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={FRONTEND_ROUTES.BASE} element={<App />}>
      <Route path={FRONTEND_ROUTES.MAIN.REGISTRATION} element={<Registration />} />
      <Route path={FRONTEND_ROUTES.MAIN.LOGIN} element={<Login />} />
      <Route
        path={FRONTEND_ROUTES.BASE}
        element={
          <ProtectedComponent>
            <FilmsList />
          </ProtectedComponent>
        }
      />
      <Route
        path={`${FRONTEND_ROUTES.MAIN.VIEW_FILM}/:id`}
        element={
          <ProtectedComponent>
            <ViewFilm />
          </ProtectedComponent>
        }
      />
      <Route path={FRONTEND_ROUTES.OTHER_PAGER.NOT_FOUND} element={<NotFound />} />
      <Route path={FRONTEND_ROUTES.OTHER_PAGER.SERVER_ERROR} element={<ServerError />} />
      <Route path={FRONTEND_ROUTES.ANY} element={<Navigate replace to={FRONTEND_ROUTES.OTHER_PAGER.NOT_FOUND} />} />
    </Route>
  )
);

export default router;
