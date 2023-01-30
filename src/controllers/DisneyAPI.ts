import { AvailableEndpoints, FilterCharacterParams, AllCharactersParams, SingleCharacterParams, DisneyCharactersPage, DisneyCharacterData, DisneyQueryPage } from "../types/DisneyAPI";

// API base URL
const baseUrl = 'https://api.disneyapi.dev/';

// configuration object for url generation
interface ConfigParams {
    endpoint?: AvailableEndpoints,  // endpoint
    query?: FilterCharacterParams | AllCharactersParams | SingleCharacterParams
}

/**
 * Generates a URL for a Disney API call
 * @param config configuration object (incl. endpoint and query parameters)
 * @returns string representation of URL
 */
const generateURL = (config: ConfigParams) => {
    let url: URL = new URL(`${config?.endpoint ?? ''}`, baseUrl);
    // add id after endpoint
    if((config.query as SingleCharacterParams).id !== undefined) {
        url.pathname = `${url.pathname}/${(config.query as SingleCharacterParams).id}`
    }
    // add query parameters
    if(config.query) {
        Object.entries(config.query).forEach(([key, value]) => {
            url.searchParams.append(key, value)
        });
    }
    return url.toString();
};

/**
 * Fetches data from Disney API
 * @param config configuration for url generation (incl. endpoint and query parameters)
 * @param signal abort controller signal
 * @returns reponse as JSON
 */
const fetcher = async (config: ConfigParams, signal?: AbortSignal | undefined) => {
    const response = await fetch(
        generateURL(config),
        {
            signal: signal
        }
    );
    if(!response.ok) throw new Error(`Request ${response.url} failed with "${response.statusText} [${response.status}]"`);
    return await response.json();
}

/**
 * Fetches specific page number from /characters endpoint
 * @param pageNum page number
 * @returns response as JSON
 */
const fetchCharactersPage = async (pageNum: number | string = 1 ): Promise<DisneyCharactersPage> => {
    const response = await fetcher({
        endpoint: AvailableEndpoints.getAllCharacters,
        query: {
            page: pageNum.toString()
        } as AllCharactersParams
    });
    return response;
};

/**
 * Fetches single character by id
 * @param id character id
 * @returns response as JSON
 */
const fetchCharacterById = async (id: number | string): Promise<DisneyCharacterData> => {
    const response = await fetcher({
        endpoint: AvailableEndpoints.getOneCharacter,
        query: { id: id.toString() } as SingleCharacterParams
    });
    return response;
}

/**
 * Fetches characters according to query
 * @param query query parameters
 * @returns character pages matching to query
 */
const fetchCharactersByQuery = async (query: FilterCharacterParams): Promise<DisneyQueryPage> => {
    const response = await fetcher({
        endpoint: AvailableEndpoints.filterCharacter,
        query
    });
    return response;
};

const DisneyAPI = {
    baseUrl,
    fetchers: {
        byPage: fetchCharactersPage,
        byId: fetchCharacterById,
        byQuery: fetchCharactersByQuery
    }
};

export default DisneyAPI;