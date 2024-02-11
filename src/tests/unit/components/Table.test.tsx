import { render, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, test, expect, beforeEach } from 'vitest';
import store from '../../../store';
import Table from '../../../components/CharactersTable/Table'
import { addPage, clear } from '../../../store/reducers/charactersPages';
import { setQuery } from '../../../store/reducers/filter';
import style from '../../../components/CharactersTable/Table/style.module.css';
import React from 'react';

const page = {
    "data": [
      {
        "_id":308,
        "films":["Tangled","Tangled: Before Ever After"],
        "shortFilms":["Tangled Ever After","Hare Peace"],
        "tvShows":["Once Upon a Time","Tangled: The Series"],
        "videoGames":["Disney Princess Enchanting Storybooks","Hidden Worlds","Disney Crossy Road","Kingdom Hearts III"],
        "parkAttractions":["Celebrate the Magic","Jingle Bell, Jingle BAM!"],
        "allies":[],
        "enemies":[],
        "sourceUrl":"https://disney.fandom.com/wiki/Queen_Arianna",
        "name":"Queen Arianna",
        "imageUrl":"https://static.wikia.nocookie.net/disney/images/1/15/Arianna_Tangled.jpg/revision/latest?cb=20160715191802",
        "createdAt":"2021-04-12T01:33:34.458Z",
        "updatedAt":"2021-04-12T01:33:34.458Z",
        "url":"https://api.disneyapi.dev/characters/308",
        "__v":0
      },
      {
        "_id":10,
        "films":["Film"],
        "shortFilms":[],
        "tvShows":[],
        "videoGames":[],
        "parkAttractions":[],
        "allies":[],
        "enemies":[],
        "sourceUrl":"https://disney.fandom.com/wiki/Queen_Arianna",
        "name":"Nameless",
        "imageUrl":"https://static.wikia.nocookie.net/disney/images/1/15/Arianna_Tangled.jpg/revision/latest?cb=20160715191802",
        "createdAt":"2021-04-12T01:33:34.458Z",
        "updatedAt":"2021-04-12T01:33:34.458Z",
        "url":"https://api.disneyapi.dev/characters/308",
        "__v":0
      }
    ],
    "info": {
      "count": 2,
      "previousPage": "https://api.disneyapi.dev/characters?page=3",
      "nextPage": "https://api.disneyapi.dev/characters?page=5"
    }
};



describe('CharactersTable', () => {
    beforeEach(() => {
        store.dispatch(clear());
        store.dispatch(setQuery(''));
    });
    
    test('no characters provided, renders empty body', () => {
        const wrapped = <Provider store={store}><Table/></Provider>
        const { container } = render(wrapped);

        expect(container.querySelector('tbody')?.childElementCount).toBe(0);
    });

    test('characters provided, renders correct number of rows and cells', () => {
        store.dispatch(addPage(page));
        const wrapped = <Provider store={store}><Table/></Provider>
        const { container } = render(wrapped);

        expect(container.querySelector('tbody')?.childElementCount).toBe(store.getState().charactersPages.info.count);
        // name column
        expect([...container.querySelectorAll('tbody > tr > td:nth-child(2)')].map(td => td.textContent)).toEqual(store.getState().charactersPages.data.map(c => c.name));
    });

    test('update characters in store', () => {
        const wrapped = <Provider store={store}><Table/></Provider>
        const { container, rerender } = render(wrapped);

        expect(container.querySelector('tbody')?.childElementCount).toBe(store.getState().charactersPages.info.count);

        act(() => { store.dispatch(addPage(page)) });
        rerender(wrapped);

        expect(container.querySelector('tbody')?.childElementCount).toBe(store.getState().charactersPages.info.count);
        // name column
        expect([...container.querySelectorAll('tbody > tr > td:nth-child(2) > a')].map(td => td.textContent)).toEqual(store.getState().charactersPages.data.map(c => c.name));
    });

    test('change filter value in store', () => {
        act(() => { store.dispatch(addPage(page)) });
        const wrapped = <Provider store={store}><Table/></Provider>
        const { container, rerender } = render(wrapped);

        expect(container.querySelector('tbody')?.childElementCount).toBe(store.getState().charactersPages.info.count);

        //store.dispatch(addPage(page));
        act(() => { store.dispatch(setQuery(page.data[0].name)) });
        rerender(wrapped);

        const re = new RegExp(page.data[0].name, 'gi');
        expect(container.querySelector('tbody')?.childElementCount).toBe(store.getState().charactersPages.data.filter(c => re.test(c.name)).length);
        // name column
        expect([...container.querySelectorAll('tbody > tr > td:nth-child(2) > a')].map(td => td.textContent))
          .toEqual(store.getState().charactersPages.data.filter(c => re.test(c.name)).map(c => c.name));
    });

    describe('sort by column', () => {
        test('single column, asc > desc > none', () => {
            act(() => { store.dispatch(addPage(page)) });
            const wrapped = <Provider store={store}><Table/></Provider>
            const { container } = render(wrapped);
        
            // asc
            fireEvent.click(container.querySelectorAll(`.${style['sortable']}`)[0])
            expect([...container.querySelectorAll('tbody > tr > td:nth-child(2)')].map(tr => tr.textContent))
              .toEqual(store.getState().charactersPages.data.map(c => c.name).sort((a,b) => - a.localeCompare(b)));
        
            // desc
            fireEvent.click(container.querySelectorAll(`.${style['sortable']}`)[0])
            expect([...container.querySelectorAll('tbody > tr > td:nth-child(2)')].map(tr => tr.textContent))
              .toEqual(store.getState().charactersPages.data.map(c => c.name).sort((a,b) => a.localeCompare(b)));
        
            // no sorting
            fireEvent.contextMenu(container.querySelectorAll(`.${style['sortable']}`)[0]);
            expect([...container.querySelectorAll('tbody > tr > td:nth-child(2)')].map(tr => tr.textContent))
              .toEqual(store.getState().charactersPages.data.map(c => c.name));
      });

      test('multiple columns, asc > desc > none', () => {
          act(() => { store.dispatch(addPage(page)) });
          const wrapped = <Provider store={store}><Table/></Provider>
          const { container } = render(wrapped);

          // asc
          fireEvent.click(container.querySelectorAll(`.${style['sortable']}`)[0])
          fireEvent.click(container.querySelectorAll(`.${style['sortable']}`)[1])
          // check name column against respective column from sorted store data
          expect([...container.querySelectorAll('tbody > tr > td:nth-child(2)')].map(tr => tr.textContent))
            .toEqual(
              store.getState().charactersPages.data
              .map(c => c)
              .sort((a, b) => b.name.localeCompare(a.name))
              .sort((a, b) => b.tvShows.length - a.tvShows.length)
              .map(c => c.name)
            );

          // desc
          fireEvent.click(container.querySelectorAll(`.${style['sortable']}`)[0])
          fireEvent.click(container.querySelectorAll(`.${style['sortable']}`)[1])
          // check name column against respective column from sorted store data
          expect([...container.querySelectorAll('tbody > tr > td:nth-child(2)')].map(tr => tr.textContent))
            .toEqual(
              store.getState().charactersPages.data
              .map(c => c)
              .sort((a, b) => a.name.localeCompare(b.name))
              .sort((a, b) => a.tvShows.length - b.tvShows.length)
              .map(c => c.name)
            );

          // no sorting
          fireEvent.contextMenu(container.querySelectorAll(`.${style['sortable']}`)[0]);
          fireEvent.click(container.querySelectorAll(`.${style['sortable']}`)[1])
          expect([...container.querySelectorAll('tbody > tr > td:nth-child(2)')].map(tr => tr.textContent))
            .toEqual(store.getState().charactersPages.data.map(c => c.name));
        })
    });
});