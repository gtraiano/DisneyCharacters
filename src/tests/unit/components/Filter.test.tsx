import { fireEvent, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, test, expect } from 'vitest';
import Filter from "../../../components/Filter";
import store from "../../../store";
import { setField, setQuery } from "../../../store/reducers/filter";
import React from "react";

describe('Filter', () => {
    test('empty filter query', () => {
        const wrapped = <Provider store={store}><Filter/></Provider>
        const { container } = render(wrapped);
        expect(container.querySelector('input')?.value).toMatch('');
        expect(container.querySelector('select')?.value).toMatch('name');
    });

    test('filter query with initial value', () => {
        const wrapped = <Provider store={store}><Filter/></Provider>
        
        store.dispatch(setQuery('query'));
        
        const { container } = render(wrapped);
        expect(container.querySelector('input')?.value).toMatch('query');
    });

    test('change event on input', () => {
        store.dispatch(setQuery(''));
        store.dispatch(setField('name'));
        
        const wrapped = <Provider store={store}><Filter/></Provider>
        const { container } = render(wrapped);
        
        expect(container.querySelector('input')?.value).toMatch('');
        expect(container.querySelector('select')?.value).toMatch('name');

        fireEvent.change(container.querySelector('input') as HTMLInputElement, { target: { value: 'query' }});
        
        expect(container.querySelector('input')?.value).toMatch('query');
    });

    test('change event on select', () => {
        store.dispatch(setQuery(''));
        store.dispatch(setField('name'));
        
        const wrapped = <Provider store={store}><Filter/></Provider>
        const { container } = render(wrapped);
        
        expect(container.querySelector('input')?.value).toMatch('');
        expect(container.querySelector('select')?.value).toMatch('name');

        fireEvent.change(container.querySelector('select') as HTMLSelectElement, { target: { value: 'tvShows' }});
        
        expect(container.querySelector('select')?.value).toMatch('tvShows');
    });
});