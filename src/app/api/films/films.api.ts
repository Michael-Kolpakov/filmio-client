import Agent from "../agent.ts";
import Film, {FilmCreate, FilmPaginated, FilmUpdate} from "../../../models/films/films.model.ts";
import {API_ROUTES} from "../../common/constants/api-routes.constants.ts";

const FilmsApi = {
    getAll: (page?: number,  pageSize?: number) => {
        const params = Object.entries({
            page: page?.toString() ?? '',
            pageSize: pageSize?.toString() ?? '',
        });
        
        const queryParams = params.filter(p => !p[1]);
        const searchParams = new URLSearchParams(queryParams);
        
        return Agent.get<FilmPaginated>(`${API_ROUTES.FILMS.GET_ALL}`, searchParams);
    },

    getById: (id: number) => Agent.get<Film>(`${API_ROUTES.FILMS.GET_BY_ID}/${id}`),
    
    create: (film: FilmCreate) => Agent.post<Film>(`${API_ROUTES.FILMS.CREATE}`, film),
    
    update: (film: FilmUpdate) => Agent.put<Film>(`${API_ROUTES.FILMS.UPDATE}`, film),
    
    delete: (id: number) => Agent.delete(`${API_ROUTES.FILMS.DELETE}/${id}`),
}

export default FilmsApi;