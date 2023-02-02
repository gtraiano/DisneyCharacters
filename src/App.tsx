import './style.css';
import { useEffect, useState } from "react";
import { addPageAsync } from "./store/reducers/charactersPages";
import { useDispatch } from 'react-redux';
import CharactersTable from './components/CharactersTable/Table';
import { ShowOverlay } from './events/ShowOverlay';
import Filter from './components/Filter';
import Modal from './components/Modal';
import store from './store';
import CharacterProfile from './components/ChracterProfile';

function App() {
    const dispatch = useDispatch<any>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<JSX.Element>();

    const lookupCharacter = (id: number) => store.getState().charactersPages.data.find(c => c._id === id);

    const onShowOverlay = (e: Event) => {
        e.stopPropagation();
        const character = lookupCharacter(Number.parseInt((e as CustomEvent).detail));
        if(!character) return;
        setModalContent(
            <CharacterProfile character={character} />
        );
        setShowModal(true);
    };

    useEffect(() => {  
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
            <Filter />
            { showModal && <Modal toggleModal={setShowModal} children={modalContent} />}
        </div>
    )
};

export default App;
