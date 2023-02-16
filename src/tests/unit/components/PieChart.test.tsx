import { createEvent, render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux';
import PieChart from '../../../components/PieChart';
import { VisibleCharacters } from '../../../eventbus/events/VisibleCharacters';
import store from '../../../store';
import { addPage } from '../../../store/reducers/charactersPages';


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
    "count": 2,
    "previousPage": "https://api.disneyapi.dev/characters?page=3",
    "nextPage": "https://api.disneyapi.dev/characters?page=5",
};

describe('PieChart', () => {
    test('by default renders empty chart', async () => {
        const { container } = render(<Provider store={store}><PieChart /></Provider>);
        expect(container.querySelector('.highcharts-series-0')).toBeDefined();
        expect(container.querySelector('.highcharts-series-0')?.childElementCount).toBe(1);
    });

    test(`${VisibleCharacters} event fired`, () => {
        const wrapped = <Provider store={store}><PieChart/></Provider>;
        const { container, rerender } = render(wrapped);
        
        expect(container.querySelector('.highcharts-series-0')).toBeDefined();
        expect(container.querySelector('.highcharts-series-0')?.childElementCount).toBe(1);
        expect(container.querySelector('.highcharts-data-label')?.childElementCount).toBeUndefined();
        
        store.dispatch(addPage(page))
        expect(store.getState().charactersPages.data.length).toBe(page.data.length);
        
        // visibleCharacters event
        const event = createEvent(
            VisibleCharacters,
            document,
            {
              detail: store.getState().charactersPages.data.map(c => c._id),
            },
            { EventType: 'CustomEvent' }
        );
        //fire event
        fireEvent(document, event);
        rerender(wrapped);
        expect(container.querySelector('.highcharts-data-label')).toBeDefined();
        // check against number of chart labels
        expect(container.querySelectorAll('.highcharts-data-label').length).toBe(store.getState().charactersPages.data.filter(c => c.films.length > 0).length);
        // check against chart labels content
        expect([...container.querySelectorAll('.highcharts-data-label')].map(l => (l.textContent?.match(/^[^:]+/) as RegExpMatchArray)[0]).sort())
          .toEqual(store.getState().charactersPages.data.filter(c => c.films.length > 0).map(c => c.name).sort())
    })
});
