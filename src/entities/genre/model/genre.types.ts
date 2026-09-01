export interface IGenre {
	id: number;
	name: string;
}

export interface IGenreListResponse {
	genres: IGenre[];
}
