import { DisneyCharactersPage } from "../../types/DisneyAPI"

export interface CharactersPagesState extends DisneyCharactersPage {
    currentPage: number
}

export enum FetchingStatus {
    IDLE = 'idle',
    LOADING = 'loading',
    SUCCEEDED = 'succeeded',
    FAILED = 'failed'
}

export interface FetcherStatus {
    status: FetchingStatus
    error: string | null
}

export interface StoreState {
    charactersPages: CharactersPagesState,
    fetcherStatus: FetcherStatus
}