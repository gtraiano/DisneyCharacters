import { FilterStatus } from "../../../store/types";
import { DisneyCharacterData } from "../../../types/DisneyAPI";
import { CharactersTableProps } from "./types";

// sort function for table
export const sortFunction =
    ({ columns }: Pick<CharactersTableProps, 'columns'>, sortBy: Array<{ colIndex: number, asc: boolean }>) =>
    (a: DisneyCharacterData, b: DisneyCharacterData) =>
{
    let result = 0;
    // run through each column in sortBy
    for(const col of sortBy) {
        // use custom comparison function or compare as strings when no function provided
        const comparison = columns[col.colIndex].compareFn instanceof Function
            ? (columns[col.colIndex].compareFn as Function)(a, b)
            : String(a).localeCompare(String(b));
        result += comparison * (col.asc ? -1 : 1); // consider if order is ascending or descending
    }
    return result;
};

// filter function for table
export const filterFunction = (filter: FilterStatus) => (c: DisneyCharacterData): boolean => {
    if(!filter.query || !filter.query.length) return true;
    const re = new RegExp(filter.query.trim(), 'gi');
    // treat everything as string
    return c[filter.field] instanceof Array
        ? (c[filter.field] as Array<any>).reduce((truth, value) => truth || re.test(value.toString()), false)   // compare against each array element
        : re.test(c[filter.field].toString());
};