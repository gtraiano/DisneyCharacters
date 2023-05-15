import { createSlice, Dispatch } from "@reduxjs/toolkit";
import DisneyAPI from "../../controllers/DisneyAPI";
import { CharactersPagesState, FetchingStatus, StoreState } from "../types";
import { setStatus, setError } from "./fetcherStatus";

// holds Disney characters pages

const initialState: CharactersPagesState = {
    data: [],
    info: {
        count: 0,
        totalPages: 0,
        previousPage: null,
        nextPage: null
    },
    pageCount: 0,
    
}

const characterPagesSlice = createSlice({
    name: 'charactersPages',
    initialState,
    reducers: {
        addPage: (state, action) => {
            state.data.push(...action.payload.data);
            state.info.previousPage = action.payload.info?.previousPage ?? null;
            state.info.nextPage = action.payload.info?.nextPage ?? null;
            state.info.count += action.payload.info.count;
            state.pageCount++;
            state.info.totalPages = action.payload.info.totalPages;
        },

        clear: (state) => {
            state.data = [];
            state.info.previousPage = null;
            state.info.nextPage = null;
            state.info.count = 0;
            state.pageCount = 0;
            state.info.totalPages = 0;
        }
    }
});

export const { addPage, clear } = characterPagesSlice.actions;

// async call to Disney API by page number
export const addPageAsync = (pageNum: number | string = 1) => {
    return async (dispatch: Dispatch<any>) => {
        try {
            // show we are busy
            dispatch(setStatus(FetchingStatus.LOADING));
            // fetch data from API
            const data = await DisneyAPI.fetchers.byPage(pageNum);
            dispatch(addPage(data));
            // show we are finished
            dispatch(setStatus(FetchingStatus.SUCCEEDED));
        }
        catch (err: any) {
            // show fetching failed and error
            dispatch(setError(err.message));
            console.error(err);
        }
    };
};

// append count pages after state current page number
export const appendMultiplePagesAsync = (count: number = 1) => {
    return async (dispatch: Dispatch<any>, getState: () => StoreState) => {
        // page numbers to be fetched
        const pageNums = new Array(count).fill(0)
            .map((_n, i) => getState().charactersPages.pageCount + i + 1)
            .filter(pn => pn <= getState().charactersPages.info.totalPages);     // make sure we don't exceed max page number
                                                                            // (alternatively, we could check the nextPage property after the API request)
        // sequential processing of thunks (source: https://medium.com/swlh/sequential-and-parallel-asynchronous-functions-35b6d0a0d0f9)
        await pageNums.reduce(async (_p, n) => {
            await dispatch(addPageAsync(n));
        }, Promise.resolve());
    };
};

export default characterPagesSlice.reducer;