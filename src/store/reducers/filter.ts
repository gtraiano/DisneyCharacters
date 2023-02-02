import { createSlice } from "@reduxjs/toolkit";
import { FilterStatus } from "../types";

// Holds filter query value

const initialState: FilterStatus = {
    query: null,    // query
    key: 'name'     // key to filter by
}

const filterStatusSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setQuery: (state, action) => {
            state.query = action.payload;
        },
        clearQuery: (state) => {
            state.query = null;
        },
        setField: (state, action) => {
            state.key = action.payload
        }
    }
});

export const { setQuery, clearQuery, setField } = filterStatusSlice.actions;

export default filterStatusSlice.reducer;