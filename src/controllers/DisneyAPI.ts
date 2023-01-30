import { AvailableEndpoints, FilterCharacterParams, AllCharactersParams, SingleCharacterParams, DisneyCharactersPage, DisneyCharacterData, DisneyQueryPage } from "../types/DisneyAPI";

// API base URL
export const baseUrl = 'https://api.disneyapi.dev/';

// configuration object for url generation
interface ConfigParams {
    endpoint?: AvailableEndpoints,  // endpoint
    query?: FilterCharacterParams | AllCharactersParams | SingleCharacterParams
}

// generate url for API call
const generateURL = (config: ConfigParams) => {
    // add id after endpoint
    let url: URL = new URL(`${config?.endpoint ?? ''}${(config.query as SingleCharacterParams).id ?? ''}`, baseUrl);
    // add query parameters
    config.query && Object.entries(config.query).forEach(([key, value]) => {
        url.searchParams.append(key, value)
    });
    return url.toString();
};

/**
 * Fetches data from API
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

const fetchCharactersByFilter = async (filter: FilterCharacterParams): Promise<DisneyQueryPage> => {
    const response = await fetcher({
        endpoint: AvailableEndpoints.filterCharacter,
        query: filter
    });
    return response;
};

const DisneyAPI = {
    baseUrl,
    fetchers: {
        byPage: fetchCharactersPage,
        byId: fetchCharacterById,
        byFilter: fetchCharactersByFilter
    }
};

export default DisneyAPI;