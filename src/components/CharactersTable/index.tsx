import { SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCharactersPages, selectFetcherStatus } from '../../store';
import { addPageAsync } from '../../store/reducers/charactersPages';
import { FetchingStatus } from '../../store/types';
import { DisneyCharacterData } from '../../types/DisneyAPI';
import style from './style.module.css';
import { CharactersTableProps } from './types';
import { ShowOverlay } from './types';

// default table props
const defaultProps: CharactersTableProps = {
    columns: [
        // character avatar
        { key: 'imageUrl', label: '', computedValue: (item: DisneyCharacterData) => <img src={item.imageUrl} className={style['avatar']}/>},
        // character name
        { key: 'name', label: 'name', sortable: true, compareFn: (a: DisneyCharacterData, b: DisneyCharacterData) => a['name'].localeCompare(b['name']),
          computedValue: (item: DisneyCharacterData) =>
            <a
                className={style['name-link']} href=""
                onClick={(e) => { e.preventDefault(); ShowOverlay.dispatch(item._id)(e.currentTarget); }}
            >
                {item['name']}
            </a>
        },
        // # of tv show appearances
        { key: 'tvShows', label: 'tv shows appearances', sortable: true,
          compareFn: (a: DisneyCharacterData, b: DisneyCharacterData) => a['tvShows'].length - b['tvShows'].length,
          computedValue: (item: DisneyCharacterData) => item['tvShows'].length.toString()
        },
        // # of video games apearances
        { key: 'videoGames', label: 'video games appearances', sortable: true,
          computedValue: (item: DisneyCharacterData) => item['videoGames'].length.toString(),
          compareFn: (a: DisneyCharacterData, b: DisneyCharacterData) => a['videoGames'].length - b['videoGames'].length
        },
        // allies
        { key: 'allies', label: 'allies' },
        // enemies
        { key: 'enemies', label: 'enemies'}
    ],
    perPage: 50
};

const CharactersTable = ({ props = defaultProps }) => {
    // store state
    const charactersPages = useSelector(selectCharactersPages);
    const fetchingStatus = useSelector(selectFetcherStatus);
    // store dispatcher
    const dispatch = useDispatch<any>();
    // items per page
    const [itemsPerPage, setItemsPerPage] = useState<number>(props.perPage ?? 50);
    // current table page
    const [currentPage, setCurrentPage] = useState<number>(1);
    // columns to sort by
    const [sortBy, setSortBy] = useState<Array<{ colIndex: number, asc: boolean }>>([]);

    // handle left click on sortable column header
    const handleSortOnClick = (index: number) => (e: SyntheticEvent) => {
        // only for left click
        if((e.nativeEvent as MouseEvent).button !== 0) return;
        // lookup column entry in sortBy
        const found = sortBy.findIndex(s => s.colIndex === index);
        // and update
        setSortBy(s => found !== -1
            ? [...s.slice(0, found), { ...s[found], asc: !s[found].asc }, ...s.slice(found + 1)]
            : [...s, { colIndex: index, asc: true }]
        );
        // add sort order attribute
        e.currentTarget.setAttribute('order', sortBy.find(s => s.colIndex === index)?.asc ? 'asc' : 'desc');
    };

    // handle right click on sortable column header
    const handleSortFieldOnContext = (index: number) => (e: SyntheticEvent) => {
        e.preventDefault();
        if(!sortBy.length) return;
        // remove column entry
        const found = sortBy.findIndex(s => s.colIndex === index);
        setSortBy(s => !s.length
            ? [{ colIndex: index, asc: true }]
            : found !== -1
                ? [...s.slice(0, found), ...s.slice(found + 1)]
                : s
        );
        // clear sort order attribute
        e.currentTarget.removeAttribute('order');
    };

    // generates table header
    const generateTableHeader = () => {
        return (
            <thead>
                <tr>
                { props.columns.map(
                    (c, i) =>
                    <th
                        key={`col_${c.label}`}
                        className={c.sortable ? style['sortable'] : undefined}
                        onClick={c.sortable ? handleSortOnClick(i) : undefined }
                        onContextMenu={c.sortable ? handleSortFieldOnContext(i) : (e) => { e.preventDefault(); }}
                    >
                        {c.label}
                    </th>
                )}
                </tr>
            </thead>
        )
    };

    // generates table body
    const generateTabeBody = () => {
        return (
            <tbody>
                {
                    [...charactersPages.data]                                               // work on array copy
                    .sort(sortFunction)                                                     // sort
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)    // slice for current page
                    .map((row, i) =>                                                        // table row for each array row
                        <tr key={`row_${i}`}>
                            {/* table cells for each array row */}
                            { props.columns.map((c, j) => <td key={`col_${i}${j}`}>{ c.computedValue ? c.computedValue(row) : row[c.key].toString() } </td>) }
                        </tr>
                    )
                }
            </tbody>
        )
    };

    // sort function for table
    const sortFunction = (a: DisneyCharacterData, b: DisneyCharacterData) => {
        let result = 0;
        // run through each column in sortBy
        for(const col of sortBy) {
            // use custom comparison function or compare as strings when no function provided
            const comparison = props.columns[col.colIndex].compareFn !== undefined
                ? (props.columns[col.colIndex].compareFn as Function)(a, b)
                : String(a).localeCompare(String(b));
            result += comparison * (col.asc ? -1 : 1); // consider if order is ascending or descending
        }
        return result;
    };

    // generates table footer
    const generateTableFooter = () => {
        return (
            <tfoot>
                <tr>
                    <td colSpan={1}>
                        Items per page&nbsp;
                        <select defaultValue={itemsPerPage}>
                        {
                            // items per page options
                            [10, 20, 50, 100, 200, 500].map(val =>
                                <option
                                    key={`option_${val}`}
                                    value={val}
                                    label={val.toString()}
                                    onClick={e => { setItemsPerPage(Number.parseInt(e.currentTarget.value)); setCurrentPage(1); }}
                                />
                            )
                        }
                        </select>
                    </td>
                    {/* pagination */}
                    <td className={style['pagination']} colSpan={props.columns.length - 1}>
                        <ul>
                            {/* previous page caret */}
                            <li
                                className={style['prev-page']}
                                onClick={() => { setCurrentPage(p => p > 1 ? p - 1 : 1 ); }}
                            />
                            { // generate page numbers
                              new Array(Math.ceil(charactersPages.count / itemsPerPage))
                                .fill(0)
                                .map((_n, i) => i + 1)
                                .map(
                                    p =>
                                    <li
                                        key={`page_${p}`}
                                        className={currentPage === p ? style['current-page'] : undefined}
                                        onClick={() => { setCurrentPage(p); }}
                                    >
                                        {p}
                                    </li>
                                )
                            }
                            {/* next page caret */}
                            <li
                                className={style['next-page']}
                                onClick={() => {
                                    currentPage === Math.ceil(charactersPages.count / itemsPerPage) && dispatch(addPageAsync(charactersPages.currentPage+1));
                                    setCurrentPage(p => p + 1);
                                }}
                            />
                        </ul>
                    </td>
                </tr>
            </tfoot>
        )
    }

    return (
        <div
            className={style['characters-table-container']}
            loading={fetchingStatus.status === FetchingStatus.LOADING ? '1' : '0'}
        >
            {/* display overlay when fetching data*/
             fetchingStatus.status === FetchingStatus.LOADING && <div className={style['table-overlay']} />
            }
            <table className={style['characters-table']}>
                { generateTableHeader() }
                { generateTabeBody() }
                { generateTableFooter() }
            </table>
        </div>
    );
};

export default CharactersTable;