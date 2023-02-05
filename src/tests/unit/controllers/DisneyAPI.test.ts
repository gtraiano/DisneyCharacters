import { describe, test, expect } from 'vitest';
import DisneyAPI from '../../../controllers/DisneyAPI';
import { DisneyCharacterData } from '../../../types/DisneyAPI';

describe('DinseyAPI controller', () => {
    describe('DisneyAPI.fetchers.byPage', () => {
        test('undefined page number brings page #1', async () => {
            const res = await DisneyAPI.fetchers.byPage();
            expect(res.count).toBeGreaterThan(0);
            expect(res.data).toBeInstanceOf(Array);
            expect(res.previousPage).toBeUndefined();
            expect(res.nextPage).toBeDefined();
            expect(res.nextPage).toMatch('?page=2');
        });

        test('defined page number brings correct page number', async () => {
            const pageNum = 2;
            const res = await DisneyAPI.fetchers.byPage(pageNum);
            expect(res.count).toBeGreaterThan(0);
            expect(res.data).toBeInstanceOf(Array);
            expect(res.previousPage).toBeDefined();
            expect(res.previousPage).toMatch(`?page=${pageNum - 1}`);
            expect(res.nextPage).toBeDefined();
            expect(res.nextPage).toMatch(`?page=${pageNum + 1}`);
        });

        test('invalid page number brings throws error', async () => {
            try {
                const pageNum = 9999;
                await DisneyAPI.fetchers.byPage(pageNum);
            }
            catch(e: any) {
                expect(e.message).toBeDefined();
            }
        });
    });

    describe('DisneyAPI.fetchers.byId', () => {
        test('undefined id throws error', async () => {
            try {
                await DisneyAPI.fetchers.byId;
            }
            catch(e: any) {
                expect(e.message).toBeDefined();
            }
        });

        test('defined id brings correct character page', async () => {
            const id = 308;
            const orig: DisneyCharacterData = await (await fetch(`https://api.disneyapi.dev/characters/${id}`)).json();
            const res = await DisneyAPI.fetchers.byId(id);
            expect(res._id).toEqual(orig._id);
            expect(res.name).toEqual(orig.name);
        });

        test('invalid id throws error', async () => {
            try {
                const id = 9999;
                await DisneyAPI.fetchers.byId(id);
            }
            catch(e: any) {
                expect(e.message).toBeDefined();
            }
        });
    });

    describe('DisneyAPI.fetchers.byQuery', () => {
        test('defined query with valid parameter fetches character pages matching query', async () => {
            const name = 'Mickey Mouse';
            const res = await DisneyAPI.fetchers.byQuery({ name });
            // check if name matches all
            expect(res.data.reduce((ok, char) => ok && char.name.includes(name), true)).toBeTruthy();
        });

        test('valid query with parameter that does not match any character fetches no character pages', async () => {
            const name = 'abcdefgh';
            const res = await DisneyAPI.fetchers.byQuery({ name });
            expect(res.data.length).toBe(0);
        });
    });
})