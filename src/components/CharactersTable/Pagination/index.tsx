import { SyntheticEvent } from 'react';
import style from './style.module.css';

interface PaginationProps {
    itemsPerPage: number,                                   // items per page
    totalItems: number,                                     // total items
    currentPage: number,                                    // current page number
    onChangeItemsPerPage: (e: SyntheticEvent) => any,       // onChange handler when changing items per page
    onClickNextPage: (e: SyntheticEvent) => any,            // onClick handler for next page caret
    onClickPrevPage: (e: SyntheticEvent) => any,            // onClick handler for previous page caret
    onGoToPage: (e: SyntheticEvent) => any                  // onKeyDown handler for go to page input field
}

const Pagination = ({
    itemsPerPage,
    totalItems,
    currentPage,
    onChangeItemsPerPage,
    onClickNextPage,
    onClickPrevPage,
    onGoToPage

}: PaginationProps) => {
    return (
        <div className={style['pagination']}>
            <div className={style['items-per-page']}>
                <label>Items per page</label>
                <select value={itemsPerPage} onChange={onChangeItemsPerPage}>
                {
                    // items per page options
                    [10, 20, 50, 100, 200, 500].map(val =>
                        <option
                            key={`option_${val}`}
                            value={val}
                            label={val.toString()}
                        />
                    )
                }
                </select>
            </div>
            <ul>
                {/* previous page caret */}
                <li
                    className={style['prev-page']}
                    onClick={onClickPrevPage}
                />
                {/* current page / total pages display */}
                <li>{currentPage} / {Math.ceil(totalItems / itemsPerPage)}</li>
                {/* next page caret */}
                <li
                    className={style['next-page']}
                    onClick={onClickNextPage}
                />
            </ul>
            {/* go to page */}
            <div className={style['go-to-page']}>
                <label>Go to page</label>
                <input
                    type='text'
                    onKeyDown={onGoToPage}
                    onBlur={e => { e.target.value = '' }}
                />
            </div>
        </div>
    );
}

export default Pagination;