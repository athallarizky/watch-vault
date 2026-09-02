export interface IPerson {
	id: number;
	name: string;
	profilePath: string | null;
	knownForDepartment: string;
	popularity: number;
	knownFor: Array<{
		id: number;
		title?: string;
		name?: string;
		mediaType: string;
		posterPath: string | null;
	}>;
}

export interface IPersonList {
	page: number;
	results: IPerson[];
	totalPages: number;
	totalResults: number;
}
