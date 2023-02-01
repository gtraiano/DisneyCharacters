import { configureStore } from '@reduxjs/toolkit'
import charactersPageReducer from './reducers/charactersPages'
import fetcherStatusReducer from './reducers/fetcherStatus'
import filterStatusReducer from './reducers/filter'
import { StoreState } from './types';

const store = configureStore({
    reducer: {
        charactersPages: charactersPageReducer,
        fetcherStatus: fetcherStatusReducer,
        filter: filterStatusReducer
    }
});

// Can still subscribe to the store
//store.subscribe(() => console.log(store.getState()));

export const selectCharactersPages = (state: StoreState) => state.charactersPages
export const selectFetcherStatus = (state: StoreState) => state.fetcherStatus
export const selectFilter = (state: StoreState) => state.filter

export default store;