import { render } from '@testing-library/react'
import PieChart from '../../../components/PieChart';


describe('PieChart', () => {
    test('by default renders empty chart', async () => {
        const { container } = render(<PieChart />);
        expect(container.querySelector('.highcharts-series-0')).toBeDefined();
        expect(container.querySelector('.highcharts-series-0')?.childElementCount).toBe(1);
    });
});

