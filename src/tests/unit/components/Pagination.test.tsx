import { render, screen, fireEvent } from '@testing-library/react'
import { SyntheticEvent } from 'react';
import { vi } from 'vitest';
import Pagination from '../../../components/CharactersTable/Pagination'


describe('Pagination', () => {
    let currentPage = 1;
    let totalItems = 100;
    let itemsPerPage = 50;

    const onClickNextPage = () => { ++currentPage; };
    const onClickPrevPage = () => { --currentPage; };
    const onChangeItemsPerPage = (e: SyntheticEvent) => { itemsPerPage = Number.parseInt((e.currentTarget as HTMLSelectElement).value); }
    const onGoToPage = (e: SyntheticEvent) => { currentPage = Number.parseInt((e.currentTarget as HTMLInputElement).value); }

    const pagination =
      <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          currentPage={currentPage}
          onClickNextPage={onClickNextPage}
          onClickPrevPage={onClickPrevPage}
          onChangeItemsPerPage={onChangeItemsPerPage}
          onGoToPage={onGoToPage}
      />;

    
    describe('pagination indicator', () => {
        test('displays current page & total pages correctly', () => {
            const { container } = render(pagination);
        
            const carets = [...container.querySelectorAll('li')].filter(li => /page/i.test(li.className));
            const display = container.querySelector('li:nth-child(2)');
            
            expect(carets).toBeDefined();
            expect(carets).toHaveLength(2);
            expect(display).toBeDefined();
            expect(display?.textContent).toMatch(`${currentPage} / ${Math.ceil(totalItems / itemsPerPage)}`);
        });

        test('click on next page caret executes onClickNextPage callback and updates page display', async () => {
            const spy = vi.fn().mockImplementation(onClickNextPage);
            const { container, rerender } = render({ ...pagination, props: { ...pagination.props, onClickNextPage: spy } });
            const expected = currentPage + 1;
        
            const [nextPageCaret] = [...container.querySelectorAll('li')].filter(li => /next-page/i.test(li.className));
            //const display = container.querySelector('li:nth-child(2)');

            fireEvent.click(nextPageCaret);

            rerender({ ...pagination, props: { ...pagination.props, currentPage } });
            
            expect(spy).toHaveBeenCalledTimes(1);
            expect(currentPage).toBe(expected);
            //expect(display?.textContent).toMatch(`${expected} / ${Math.ceil(totalItems / itemsPerPage)}`);
            expect((await screen.findByText(/\d+ \/ \d+/)).textContent).toMatch(`${expected} / ${Math.ceil(totalItems / itemsPerPage)}`);
        });

        test('click on previous page caret executes onClickPrevPage callback and updates page dsiplay', async () => {
            const spy = vi.fn().mockImplementation(onClickPrevPage);
            const { container, rerender } = render({ ...pagination, props: { ...pagination.props, onClickPrevPage: spy } });
            const expected = currentPage - 1;
        
            const [prevPageCaret] = [...container.querySelectorAll('li')].filter(li => /prev-page/gi.test(li.className));

            fireEvent.click(prevPageCaret);
            rerender({ ...pagination, props: { ...pagination.props, currentPage } });
            //const display = container.querySelector('li:nth-child(2)');
            
            expect(spy).toHaveBeenCalledTimes(1);
            expect(currentPage).toBe(expected);
            expect((await screen.findByText(/\d+ \/ \d+/)).textContent).toMatch(`${expected} / ${Math.ceil(totalItems / itemsPerPage)}`)
            //expect(display?.textContent).toMatch(`${expected} / ${Math.ceil(totalItems / itemsPerPage)}`);
        });
    });

    describe('items per page select', () => {
        const defaultsOptions = [10, 20, 50, 100, 200, 500];
        
        test('displays items per page options', () => {
            const { container } = render(pagination);
          
            const options = [...container.querySelectorAll('select > option')];
            
            expect(options.map(op => Number.parseInt((op as HTMLOptionElement).value))).toHaveLength(defaultsOptions.length);
            expect(options.map(op => Number.parseInt((op as HTMLOptionElement).value))).toEqual(defaultsOptions);
            expect(options.map(op => (op as HTMLOptionElement).label)).toEqual(defaultsOptions.map(op => op.toString()));
        });
    
        test('change items per page executes onChangeItemsPerPage callback', () => {
            const spy = vi.fn().mockImplementation(onChangeItemsPerPage);
            const { container } = render({ ...pagination, props: { ...pagination.props, onChangeItemsPerPage: spy } });
          
            const select = container.querySelector('select');
            fireEvent.change(select as HTMLSelectElement, { target: { value: defaultsOptions[0] } });
            
            expect(spy).toHaveBeenCalledTimes(1);
            expect(itemsPerPage).toBe(defaultsOptions[0]);
        });
    });
})

