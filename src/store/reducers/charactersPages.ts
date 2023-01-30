import { createSlice } from "@reduxjs/toolkit";
import DisneyAPI from "../../controllers/DisneyAPI";
import { CharactersPagesState, FetchingStatus } from "../types";
import { setStatus, setError } from "./fetcherStatus";

// holds Disney characters pages

const initialState: CharactersPagesState = {
    data: [],
    count: 0,
    currentPage: 0
}

const characterPagesSlice = createSlice({
    name: 'charactersPages',
    initialState,
    reducers: {
        addPage: (state, action) => ({
            ...action.payload,
            currentPage: state.currentPage + 1,
            count: state.count + action.payload.count,
            data: [...state.data, ...action.payload.data]
        })
    }
});

export const { addPage } = characterPagesSlice.actions;

// async call to Disney API
export const addPageAsync = (pageNum: number | string = 1) => {
    return async (dispatch) => {
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
            dispatch(setStatus(FetchingStatus.FAILED));
            dispatch(setError(err.message));
            console.error(err);
        }
    }
};

export default characterPagesSlice.reducer;