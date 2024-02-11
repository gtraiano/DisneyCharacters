import { render } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import CharacterProfile from '../../../components/CharacterProfile';
import style from '../../../components/CharacterProfile/style.module.css';
import { DisneyCharacterData } from '../../../types/DisneyAPI';
import React from 'react';

describe('CharacterProfile', () => {
    test('undefined props renders nothing', async () => {
        const { container } = render(<CharacterProfile character={undefined as unknown as DisneyCharacterData}/>);
        expect(container.childElementCount).toBe(0);
    });

    test('defined character prop render proper profile', async () => {
        const content = {
                _id:308,
                films:["Tangled","Tangled: Before Ever After"],
                shortFilms:["Tangled Ever After","Hare Peace"],
                tvShows:["Once Upon a Time","Tangled: The Series"],
                videoGames:["Disney Princess Enchanting Storybooks","Hidden Worlds","Disney Crossy Road","Kingdom Hearts III"],
                parkAttractions:["Celebrate the Magic","Jingle Bell, Jingle BAM!"],
                allies:[],
                enemies:[],
                sourceUrl:"https://disney.fandom.com/wiki/Queen_Arianna",
                name:"Queen Arianna",
                imageUrl:"https://static.wikia.nocookie.net/disney/images/1/15/Arianna_Tangled.jpg/revision/latest?cb=20160715191802",
                createdAt:"2021-04-12T01:33:34.458Z",
                updatedAt:"2021-04-12T01:33:34.458Z",
                url:"https://api.disneyapi.dev/characters/308",
                __v:0
        };

        const { container } = render(<CharacterProfile character={content} />);
        expect(container.children[0].childElementCount).toBe(5);
        // avatar
        expect(container.children[0].querySelector('img')?.src).toMatch(content.imageUrl);
        // stats
        expect(container.querySelector(style['stats'])).toBeDefined();
        // name
        expect(container.querySelector(`.${style['stats']} > h2`)?.textContent).toMatch(content.name);
        // # of allies, enemies, park attractions
        expect(
            [...container.querySelectorAll(`.${style['stats']} > span`)]
                .map( sp => Number.parseInt( ((sp.textContent as string).match(/\d+/) as RegExpMatchArray)[0] ?? '') )
        )
        .toEqual([content.allies.length, content.enemies.length, content.parkAttractions.length]);
        // tv shows list
        expect(container.querySelector(`.${style['tv-shows']}`)?.childElementCount).toBe(content.tvShows.length);
        // video games list
        expect(container.querySelector(`.${style['video-games']}`)?.childElementCount).toBe(content.videoGames.length);
    });
    
});

