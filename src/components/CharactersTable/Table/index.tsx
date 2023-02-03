import style from './style.module.css';
import { FormEvent, SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCharactersPages, selectFetcherStatus, selectFilter } from '../../../store';
import { addPageAsync } from '../../../store/reducers/charactersPages';
import { FetchingStatus } from '../../../store/types';
import { DisneyCharacterData } from '../../../types/DisneyAPI';
import { CharactersTableProps } from '../Table/types';
import { ShowOverlay } from '../../../events/ShowOverlay';
import Pagination from '../Pagination';
import { sortFunction, filterFunction, selectRows } from './helpers';
import { VisibleCharacters } from '../../../events/VisibleCharacters';
import DisneyAPI from '../../../controllers/DisneyAPI';

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
        { key: 'tvShows', label: 'tv shows', sortable: true,
          compareFn: (a: DisneyCharacterData, b: DisneyCharacterData) => a['tvShows'].length - b['tvShows'].length,
          computedValue: (item: DisneyCharacterData) => item['tvShows'].length.toString()
        },
        // # of video games apearances
        { key: 'videoGames', label: 'video games', sortable: true,
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
    const filter = useSelector(selectFilter);
    // store dispatcher
    const dispatch = useDispatch<any>();

    // items per page
    const [itemsPerPage, setItemsPerPage] = useState<number>(props.perPage ?? 50);
    // current table page
    const [currentPage, setCurrentPage] = useState<number>(1);
    // columns to sort by
    const [sortBy, setSortBy] = useState<Array<{ colIndex: number, asc: boolean }>>([]);

    // container div reference
    const containerRef = useRef<HTMLDivElement>(null);

    // select rows from characters table according to criteria
    const selectTableRows = useCallback(() =>
        selectRows({
            array: charactersPages.data,
            filtering: { filter, filterFunction },
            sorting: { columns: { columns: props }, sortBy, sortFunction },
            pagination: { currentPage, itemsPerPage }
        })
    , [charactersPages.data, filter, sortBy, currentPage, itemsPerPage]);
    // local copy of characters table rows
    const [tableRows, setTableRows] = useState<DisneyCharacterData[]>(() => selectTableRows());

    useEffect(() => {
        if(containerRef.current) {
            window.addEventListener('resize', setTableBodyWidth);
            return () => {
                window.removeEventListener('resize', setTableBodyWidth);
            }
        }
    }, []);

    useEffect(() => {
        setTableBodyWidth();
    }, [props.columns, tableRows.length]);

    // update table view
    useEffect(() => {
        setTableRows(selectTableRows());
    }, [charactersPages.data, filter, sortBy, currentPage, itemsPerPage]);

    // dispatch visible characters id's on table rows change
    useEffect(() => {
        VisibleCharacters.dispatch(tableRows.map(c => c._id))();
    }, [tableRows]);

    // scroll container to top on table page change
    useEffect(() => {
        containerRef.current?.scrollTo(0, 0);
    }, [currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    // set tbody and tbody > td width
    const setTableBodyWidth = () => {
        const tbody = (containerRef.current as HTMLDivElement).querySelector('tbody');
        (containerRef.current as HTMLDivElement).style.overflowX = 'hidden';
        if(!tbody || !tbody.childElementCount) return;
        tbody.style.width = `${(containerRef.current as HTMLDivElement).clientWidth}px`;
        const tdWidth = (containerRef.current as HTMLDivElement).clientWidth / props.columns.length;
        tbody.querySelectorAll('tr > td').forEach(td => {
            (td as HTMLTableCellElement).style.width = `${tdWidth}px`;
        });
        (containerRef.current as HTMLDivElement).style.overflowX = '';
    };

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

    // pagination next page click handler
    const onClickNextPage = async () => {
        // fetch next page from API if last current page is reached
        if(currentPage === Math.ceil(charactersPages.count / itemsPerPage)) {
            const fetchPagesCount = Math.ceil(itemsPerPage / DisneyAPI.paginationItemsPerPage);
            for(let i = 1; i <= fetchPagesCount; i++) {
                await dispatch(addPageAsync(charactersPages.pageCount + 1));
            }
            setCurrentPage(Math.ceil(charactersPages.count / itemsPerPage) + 1);
        }
        else setCurrentPage(p => p + 1);
    };

    // pagination previous page click handler
    const onClickPrevPage = () => { setCurrentPage(p => p > 1 ? p - 1 : 1 ); };

    // pagination items per page change handler
    const onChangeItemsPerPage = (e: SyntheticEvent) => {
        const value = Number.parseInt(((e as FormEvent).target as HTMLSelectElement).value);
        // calculate new current page according to items
        let newCurrPage = Math.ceil((currentPage * itemsPerPage) / value);
        newCurrPage = newCurrPage > Math.ceil(charactersPages.count / value) ? Math.ceil(charactersPages.count / value) : newCurrPage;
        // update respective state
        setItemsPerPage(value);
        setCurrentPage(newCurrPage);
    };

    // go to page input handler
    const onGoToPage = (e: SyntheticEvent) => {
        // prevent arrow keys up/down default behaviour
        if((e.nativeEvent as KeyboardEvent).code === 'ArrowDown' || (e.nativeEvent as KeyboardEvent).code === 'ArrowUp') {
            return e.preventDefault();
        }
        // process value on Enter
        if((e.nativeEvent as KeyboardEvent).code === 'Enter' || (e.nativeEvent as KeyboardEvent).code === 'NumpadEnter') {
            let value = Number.parseInt((e.currentTarget as HTMLInputElement).value);
            // not a number or invalid range
            if(
                Number.isNaN(value)
                || value > Math.ceil(charactersPages.count / itemsPerPage)
                || value < 1
            ) {
                (e.currentTarget as HTMLInputElement).blur();
            }
            // ok, proceed
            else {
                setCurrentPage(value);
            }
            (e.currentTarget as HTMLInputElement).value = '';
        }
    };

    // generates table header
    const generateTableHeader = () => {
        return (
            <thead>
                <tr>
                    <td colSpan={2}></td>
                    <td colSpan={2}>Appearances</td>
                    <td colSpan={props.columns.length - 4}></td>
                </tr>
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
                    tableRows
                    .map((row, i) =>    // table row for each array row
                        <tr key={`row_${i}`}>
                            {/* table cells for each array row */}
                            { props.columns.map((c, j) =>
                                <td key={`col_${i}${j}`}>
                                    { c.computedValue ? c.computedValue(row) : row[c.key].toString() }
                                </td>
                            )}
                        </tr>
                    )
                }
            </tbody>
        )
    };

    // generates table footer
    const generateTableFooter = () => {
        return (
            <tfoot>
                <tr>
                    <td colSpan={props.columns.length}>
                        <Pagination
                            totalItems={
                                !filter.query?.trim()?.length
                                    ? charactersPages.count
                                    : tableRows.length
                            }
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onChangeItemsPerPage={onChangeItemsPerPage}
                            onClickNextPage={
                                !filter.query?.trim()?.length
                                    ? onClickNextPage
                                    : () => { setCurrentPage(p => p + 1 > Math.ceil(tableRows.length / itemsPerPage) ? p : p + 1); }
                            }
                            onClickPrevPage={onClickPrevPage}
                            onGoToPage={onGoToPage}
                        />
                    </td>
                </tr>
            </tfoot>
        )
    }

    return (
        <div
            className={style['characters-table-container']}
            data-loading={fetchingStatus.status === FetchingStatus.LOADING ? '' : undefined}
            ref={containerRef}
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