import { createSlice } from "@reduxjs/toolkit";
import { FetcherStatus, FetchingStatus } from "../types";

// Holds fetching status and error status for Disney API calls

const initialState: FetcherStatus = {
    status: FetchingStatus.IDLE,
    error: null
}

const fetcherStatusSlice = createSlice({
    name: 'fetcherStatus',
    initialState,
    reducers: {
        setStatus: (state, action: { type: string, payload: FetchingStatus }) => {
            state.status = action.payload;
        },
        setError: (state, action) => {
            state.status = FetchingStatus.FAILED;
            state.error = action.payload;
        }
    }
});

export const { setStatus, setError } = fetcherStatusSlice.actions;

export default fetcherStatusSlice.reducer;