import './style.css';
import { useEffect } from "react";
import { addPageAsync } from "./store/reducers/charactersPages";
import { useDispatch } from 'react-redux';
import CharactersTable from './components/CharactersTable';
import { ShowOverlay } from './components/CharactersTable/types';

function App() {
    const dispatch = useDispatch<any>();

    useEffect(() => {
        const onShowOverlay = (e: Event) => {
            e.stopPropagation();
            console.log(e);
        };
        window.addEventListener(ShowOverlay.eventName, onShowOverlay);
        // fetch first page
        dispatch(addPageAsync(1));
        
        return () => {
            window.removeEventListener(ShowOverlay.eventName, onShowOverlay);
        };
    }, []);
    
    return (
        <div className="App">
            <CharactersTable />
        </div>
    )
};

export default App;
