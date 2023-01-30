// API available endpoints
export enum AvailableEndpoints {
    filterCharacter = 'character',
    getAllCharacters = 'characters',
    getOneCharacter = 'characters'
};

// types of API responses

// single character data
export interface DisneyCharacterData {
    _id: number,
    films: string[],
    shortFilms: string[],
    tvShows: string[],
    videoGames: string[],
    parkAttractions: string[],
    allies: string[],
    enemies: string[],
    sourceUrl: string,
    name: string,
    imageUrl: string,
    createdAt: string,
    updatedAt: string,
    url: string,
    __v: number
};

// characters page data
export interface DisneyCharactersPage {
    data: DisneyCharacterData[],
    count: number,
    previousPage?: string,
    nextPage?: string,
};

// filter page data
export interface DisneyQueryPage {
    count: number,
    length: number,
    data: DisneyCharacterData[]
}

// filter query parameters
export type FilterCharacterParams = {
    [key in keyof Partial<DisneyCharacterData>]: string
};

// page query
export type AllCharactersParams = {
    page: string
};

// single character page query
export type SingleCharacterParams = {
    id: string
};