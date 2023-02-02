import { ReactElement, useEffect, useRef } from 'react';
import style from './style.module.css';

interface ModalProps {
    children?: ReactElement,
    toggleModal: (toggle: boolean) => void
}

const Modal = ({ children, toggleModal }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const toggleOnEsc = (e: Event) => {
        e.stopPropagation();
        if((e as KeyboardEvent).code === 'Escape') toggleModal(false);
    };
    
    useEffect(() => {    
        modalRef.current?.addEventListener('keydown', toggleOnEsc);
        modalRef.current?.focus();
        return () => {
            modalRef.current?.removeEventListener('keydown', toggleOnEsc);
        }
    }, []);

    return (
        <div className={`${style['modal-overlay']}`} id='modal-overlay' tabIndex={0}>
            <div className={`${style['modal']}`} id='modal' tabIndex={1} ref={modalRef}>
                <span className={style['close-button']} onClick={() => { toggleModal(false); }} id='close-button' />
                <div className={style['modal-content']}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;