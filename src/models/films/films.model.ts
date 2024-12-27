export default interface Film {
    id: number, 
    title: string,
    genre: string,
    director: string,
    releaseDate: string,
    rating: number,
    description: string,
}

export interface FilmCreate extends FilmCreateUpdate {}

export interface FilmUpdate extends FilmCreateUpdate {
    id: number,
}

export interface FilmPaginated {
    totalAmount: number,
    films: Film[],
}

interface FilmCreateUpdate {
    title: string,
    genre: string,
    director: string,
    releaseDate: string,
    rating: number,
    description: string,
}