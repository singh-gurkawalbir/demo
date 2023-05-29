import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BarGraph from '.';

global.ResizeObserver = require('resize-observer-polyfill');

jest.mock < typeof import('recharts') > ('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');

  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => (
      <OriginalModule.ResponsiveContainer width={300} height={300}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('BarGraph', () => {
  const data = {
    ids: {
      XAxis: 'xaxis',
      Plots: ['plot1', 'plot2'],
    },
    values: [
      {
        xaxis: 'Jan',
        plot1: 100,
        plot2: 50,
      },
      {
        xaxis: 'Feb',
        plot1: 70,
        plot2: 90,
      },
    ],
  };

  const color = ['#8884d8', '#82ca9d'];

  test('Tooltips are not visible by default', () => {
    const { container } = render(<BarGraph data={data} color={color} />);

    // eslint-disable-next-line jest/valid-expect
    expect(container.querySelector('recharts-tooltip-wrapper')).not.toBeVisible;
  });

  test('Can create a test snapshot', async () => {
    const { container } = render(<BarGraph data={data} color={color} />);

    expect(container).toMatchSnapshot();
  });

  test('A cursor does not exist', async () => {
    const { container } = render(<BarGraph data={data} color={color} />);

    expect(container.querySelector('recharts-tooltip-cursor')).toBeNull();
  });

  test('Correct values are displayed on tooltips', () => {
    const { container } = render(<BarGraph data={data} color={color} />);
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
