import { selectFilter } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { setQuery, setField } from "../../store/reducers/filter";
import { DisneyCharacterData } from "../../types/DisneyAPI";

const Filter = () => {
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
        <div>
            <label>Search</label>
            <input
                type='text'
                value={filter.query ?? ''}
                onChange={e => { dispatch(setQuery(e.currentTarget.value)); }}
            />
            <select onChange={e => { dispatch(setField(e.target.value)); }}>
                { fields.map(({ key, label }) => <option key={`field_${key}`} value={key} label={label} />) }
            </select>
        </div>
    );
};

export default Filter;