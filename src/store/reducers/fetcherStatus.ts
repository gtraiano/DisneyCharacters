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
        // set status (other than error)
        setStatus: (state, action: { type: string, payload: Exclude<FetchingStatus, FetchingStatus.FAILED> }) => {
            state.status = action.payload;
            state.error = null;
        },
        // set status to error with error message as payload
        setError: (state, action: { type: string, payload: string }) => {
            state.status = FetchingStatus.FAILED;
            state.error = action.payload;
        }
    }
});

export const { setStatus, setError } = fetcherStatusSlice.actions;

export default fetcherStatusSlice.reducer;