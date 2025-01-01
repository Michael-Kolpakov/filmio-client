export default interface Film {
  id: number;
  title: string;
  genre: string;
  director: string;
  releaseDate: string;
  rating: number;
  description: string;
}

export interface FilmPaginated {
  totalAmount: number;
  films: Film[];
}

export interface FilmCreateUpdate extends Film {}
