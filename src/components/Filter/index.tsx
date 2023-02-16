import style from './style.module.css';
import { selectFilter } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { setQuery, clearQuery, setField } from "../../store/reducers/filter";
import { DisneyCharacterData } from "../../types/DisneyAPI";

interface FilterProps {
    styling?: React.CSSProperties
}

const Filter = ({ styling }: FilterProps) => {
    const filter = useSelector(selectFilter);
    const dispatch = useDispatch<any>();
    const fields: Array<{
        key: keyof DisneyCharacterData,         // CharacterData object property name
        label: string                           // label to display in option
    }> = [
        { key: 'name', label: 'character'},
        { key: 'tvShows', label: 'tv show' }
    ];
    
    return (
        <div className={style['filter-container']} style={styling}>
            <label>Filter</label>
            <input
                type='text'
                value={filter.query ?? ''}
                onChange={e => { dispatch(setQuery(e.currentTarget.value)); }}
            />
            <span title='clear query' onClick={() => { dispatch(clearQuery()); } } />
            <select title='filter by' value={filter.key} onChange={e => { dispatch(setField(e.target.value)); }}>
                { fields.map(({ key, label }) => <option key={`field_${key}`} value={key} label={label} />) }
            </select>
        </div>
    );
};

export default Filter;