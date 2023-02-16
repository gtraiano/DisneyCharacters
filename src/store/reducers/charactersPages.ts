import { createSlice, Dispatch } from "@reduxjs/toolkit";
import DisneyAPI from "../../controllers/DisneyAPI";
import { DisneyCharacterData, DisneyCharactersPage } from "../../types/DisneyAPI";
import { CharactersPagesState, FetchingStatus, StoreState } from "../types";
import { setStatus, setError } from "./fetcherStatus";

// holds Disney characters pages

const initialState: CharactersPagesState = {
    data: [],
    count: 0,
    pageCount: 0,
    totalPages: 0
}

const characterPagesSlice = createSlice({
    name: 'charactersPages',
    initialState,
    reducers: {
        addPage: (state, action) => {
            state.data.push(...action.payload.data);
            state.previousPage = action.payload.previousPage;
            state.nextPage = action.payload.nextPage;
            state.count += action.payload.count;
            state.pageCount++;
            state.totalPages = action.payload.totalPages;
        },

        clear: (state) => {
            state.data = [];
            state.previousPage = undefined;
            state.nextPage = undefined;
            state.count = 0;
            state.pageCount = 0;
            state.totalPages = 0;
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
            .filter(pn => pn <= getState().charactersPages.totalPages);     // make sure we don't exceed max page number
                                                                            // (alternatively, we could check the nextPage property after the API request)

        pageNums.forEach(async (p) => {
            await dispatch(addPageAsync(p));
        });
    };
};

export default characterPagesSlice.reducer;