import App from "../layout/app/App.tsx";
import {createBrowserRouter, createRoutesFromElements, Navigate, Route} from "react-router";
import ViewFilm from "../../features/ViewFilm/ViewFilm.tsx";
import NotFound from "../../features/Errors/NotFound.tsx";
import ServerError from "../../features/Errors/ServerError.tsx";
import {FRONTEND_ROUTES} from "../common/constants/frontend-routes.constants.ts";

const router = createBrowserRouter(createRoutesFromElements(
    <Route path={FRONTEND_ROUTES.BASE} element={<App />}>
        <Route
            path={`${FRONTEND_ROUTES.MAIN.VIEW_FILM}/:id`}
            element={<ViewFilm />}
        />
        <Route
            path={FRONTEND_ROUTES.OTHER_PAGER.NOT_FOUND}
            element={<NotFound />}
        />
        <Route
            path={FRONTEND_ROUTES.OTHER_PAGER.SERVER_ERROR}
            element={<ServerError />}
        />
        <Route
            path={FRONTEND_ROUTES.ANY}
            element={<Navigate replace to={FRONTEND_ROUTES.OTHER_PAGER.NOT_FOUND} />}
        />
    </Route>
));

export default router;