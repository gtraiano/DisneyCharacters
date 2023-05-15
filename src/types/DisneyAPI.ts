// API available endpoints
export enum AvailableEndpoints {
    filterCharacter = 'character',
    getAllCharacters = 'character',
    getOneCharacter = 'character'
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
    data: DisneyCharacterData[],    // characters data
    info: {
        count: number,                  // number of characters fetched
        previousPage: string | null,          // previous page url
        nextPage: string | null,              // next page url
        totalPages: number              // end page number (i.e. the max page number the API will serve)
    }
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