import Film, {FilmCreate, FilmUpdate} from "../../models/films/films.model.ts";
import {makeAutoObservable} from "mobx";
import {PaginationInfo} from "../../models/pagination/pagination.model.ts";
import filmsApi from "../api/films/films.api.ts";

export default class FilmsStore {
    public FilmsMap = new Map<number,  Film>();

    private defaultPageSize = 10;

    private paginationInfo: PaginationInfo = {
        PageSize: this.defaultPageSize,
        TotalPages: 1,
        TotalItems: 1,
        CurrentPage: 1,
    }
    
    public constructor() {
        makeAutoObservable(this);
    }

    public setItem = (film: Film) => {
        this.FilmsMap.set(film.id, film);
    }

    public setInternalMap(films: Film[]) {
        this.FilmsMap.clear();
        films.forEach(this.setItem);
    }
    
    public setCurrentPage(currentPage: number) {
        this.paginationInfo.CurrentPage = currentPage;
    }
    
    public set PaginatioInfo(paginationInfo: PaginationInfo) {
        this.paginationInfo = paginationInfo;
    }
    
    public get PaginationInfo() : PaginationInfo {
        return this.paginationInfo;
    }
    
    public getFilmsArray() {
        return Array.from(this.FilmsMap.values());
    }
    
    public getAllFilms = async (pageSize?: number) => {
        await filmsApi.getAll(this.PaginationInfo.CurrentPage, pageSize ?? this.paginationInfo.PageSize)
            .then((response) => {
                this.PaginatioInfo.TotalItems = response.totalAmount;
                this.setInternalMap(response.films);
            })
            .catch((error) => console.log(error));
    }
    
    public createFilm = async (film: FilmCreate) => {
        const createdFilm = await filmsApi.create(film);
        this.setItem(createdFilm);

        return createdFilm;
    }
    
    public updateFilm = async (film: FilmUpdate) => {
        await filmsApi.update(film).then((updatedFilm) => {
            this.setItem(updatedFilm);
        });
    }
    
    public static deleteFilm = async (filmId: number) => {
        await filmsApi.delete(filmId);
    }
}