import React from 'react';
import { render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LineGraph from '.';

describe('LineGraph', () => {
  const data = {
    values: [
      { x: 1, y: 10 },
      { x: 2, y: 20 },
      { x: 3, y: 30 },
    ],
    ids: {
      XAxis: 'x',
      Plots: ['y'],
    },
  };

  const color = ['#8884d8', '#82ca9d'];

  test('Tooltips are not visible by default', () => {
    const { container } = render(<LineGraph data={data} color={color} />);

    // eslint-disable-next-line jest/valid-expect
    expect(container.querySelector('recharts-tooltip-wrapper')).not.toBeVisible;
  });

  test('Can create a test snapshot', async () => {
    const { container } = render(<LineGraph data={data} color={color} />);

    expect(container).toMatchSnapshot();
  });

  test('A cursor does not exist', async () => {
    const { container } = render(<LineGraph data={data} color={color} />);

    expect(container.querySelector('recharts-tooltip-cursor')).toBeNull();
  });

  test('Correct values are displayed on tooltips', () => {
    const { container } = render(<LineGraph data={data} color={color} />);
    const element = container.querySelector('recharts-tooltip-wrapper');

    // eslint-disable-next-line jest/valid-expect-in-promise
    userEvent.hover(element)
      .then(() => {
        const tooltipElements = container.querySelectorAll('recharts-tooltip-item-value');

        expect(tooltipElements[0].props().value).toBe(100);
        expect(tooltipElements[1].props().value).toBe(70);
      });
  });
});
