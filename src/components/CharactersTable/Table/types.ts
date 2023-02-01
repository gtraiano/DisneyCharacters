import { DisneyCharacterData } from "../../../types/DisneyAPI"

export interface CharactersTableProps {
    columns: Array<{
        key: keyof DisneyCharacterData,                             // object property in DisneyCharacterData
        computedValue?: (item: DisneyCharacterData) => any,         // computed value to display (other than object[key])
        label: string,                                              // header label
        sortable?: boolean,                                         // is sortable field
        compareFn?: (a: any, b: any) => number                      // compare function to use in sorting
    }>,
    perPage: number                                                 // items per page
};
