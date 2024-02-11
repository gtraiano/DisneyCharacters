import { render, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import Modal from '../../../components/Modal'
import style from '../../../components/Modal/style.module.css'
import React from 'react';

describe('Modal', () => {
    test('empty content renders no content', async () => {
        const { container } = render(<Modal toggleModal={() => {}} />);
        expect(container.getElementsByClassName(`${style['modal-content']}`)[0].childElementCount).toBe(0);
    });

    test('provided content renders properly', () => {
        const { container } = render(<Modal toggleModal={() => {}} ><div id="provided-content"><h1>Content</h1></div></Modal>);
        expect(container.querySelector('#provided-content')).toBeDefined();
        expect(container.querySelector(`.${style['modal-content']} > *`)?.id).toBe('provided-content');
    });

    test('click on close button executes toggleModal callback', () => {
        let show = true;
        const toggleModal = () => { show = !show; };
        const spy = vi.fn().mockImplementation(toggleModal);
        const modal = <Modal toggleModal={spy} />;
        
        let { container, rerender } = render(show ? modal : <></>);
        fireEvent.click(container.querySelector('#close-button') as Element);
        rerender(show ? modal : <></>);
        
        expect(container.childElementCount).toBe(0);
        expect(spy).toHaveBeenCalledTimes(1);
    })
});