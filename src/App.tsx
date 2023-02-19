import './style.css';
import { useEffect, useState } from "react";
import { addPageAsync } from "./store/reducers/charactersPages";
import { useDispatch } from 'react-redux';
import CharactersTable from './components/CharactersTable/Table';
import Filter from './components/Filter';
import Modal from './components/Modal';
import store from './store';
import CharacterProfile from './components/ChracterProfile';
import PieChart from './components/PieChart';
import { ShowModal } from './eventbus/events/ShowModal';
import eventBus from './eventbus';

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
        eventBus.on(ShowModal, onShowOverlay);
        // fetch first page
        dispatch(addPageAsync(1));
        
        return () => {
            eventBus.off(ShowModal, onShowOverlay);
        };
    }, []);
    
    return (
        <div className="App">
            <Filter styling={{ marginBottom: '1em' }} />
            <CharactersTable />
            <PieChart width='500px' height='300px' containerStyling={{ marginTop: '1em' }} />
            { showModal && <Modal toggleModal={setShowModal} children={modalContent} />}
            <span className='attribution'>
                Powered by <a href='https://disneyapi.dev/' target='_blank' referrerPolicy='no-referrer'>Disney API</a>
            </span>
        </div>
    )
};

export default App;
