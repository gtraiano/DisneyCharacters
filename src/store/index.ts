import { configureStore } from '@reduxjs/toolkit'
import charactersPageReducer from './reducers/charactersPages'
import fetcherStatusReducer from './reducers/fetcherStatus'
import { StoreState } from './types';

const store = configureStore({
    reducer: {
        charactersPages: charactersPageReducer,
        fetcherStatus: fetcherStatusReducer
    }
});

// Can still subscribe to the store
//store.subscribe(() => console.log(store.getState()));

export const selectCharactersPages = (state: StoreState) => state.charactersPages
export const selectFetcherStatus = (state: StoreState) => state.fetcherStatus

export default store;