/* eslint-disable jest/no-commented-out-tests */
import React from 'react';
import { screen } from '@testing-library/react';
import Content from './Content';
import { renderWithProviders } from '../../../../../test/test-utils';

describe('Content Component', () => {
  test('renders loading message when layoutData is undefined', () => {
    const colsize = 4;
    const id = 'sampleId';
    const data = {
      connections: [],
      imports: [],
      flows: [],
    };

    renderWithProviders(<Content colsize={colsize} id={id} data={data} layoutData={undefined} />);

    const loadingMessage = screen.getByText('Loading...');

    expect(loadingMessage).toBeInTheDocument();
  });

  // test('renders child components based on layouts', () => {
  //   const colsize = 2;
  //   const id = '0';
  //   const data = {
  //     connections: [],
  //     imports: [],
  //     flows: [],
  //   };
  //   const layoutData = {
  //     lg: [
  //       {
  //         i: '1',
  //         x: 0,
  //         y: 2,
  //         w: 1,
  //         h: 4,
  //         minW: 1,
  //         minH: 4,
  //         moved: false,
  //         static: false,
  //       },
  //       {
  //         i: '2',
  //         x: 1,
  //         y: 2,
  //         w: 1,
  //         h: 4,
  //         minW: 1,
  //         minH: 4,
  //         moved: false,
  //         static: false,
  //       },
  //       {
  //         i: '0',
  //         x: 2,
  //         y: 1,
  //         w: 1,
  //         h: 4,
  //         minW: 1,
  //         minH: 4,
  //         moved: false,
  //         static: false,
  //       },
  //     ],
  //     md: [
  //       {
  //         i: '1',
  //         x: 0,
  //         y: 2,
  //         w: 1,
  //         h: 4,
  //         minW: 1,
  //         minH: 4,
  //         moved: false,
  //         static: false,
  //       },
  //       {
  //         i: '2',
  //         x: 1,
  //         y: 2,
  //         w: 1,
  //         h: 4,
  //         minW: 1,
  //         minH: 4,
  //         moved: false,
  //         static: false,
  //       },
  //       {
  //         i: '0',
  //         x: 2,
  //         y: 1,
  //         w: 1,
  //         h: 4,
  //         minW: 1,
  //         minH: 4,
  //         moved: false,
  //         static: false,
  //       },
  //     ],
  //     sm: [
  //       {
  //         i: '1',
  //         x: 0,
  //         y: 2,
  //         w: 1,
  //         h: 4,
  //         minW: 1,
  //         minH: 4,
  //         moved: false,
  //         static: false,
  //       },
  //       {
  //         i: '2',
  //         x: 1,
  //         y: 2,
  //         w: 1,
  //         h: 4,
  //         minW: 1,
  //         minH: 4,
  //         moved: false,
  //         static: false,
  //       },
  //       {
  //         i: '0',
  //         x: 2,
  //         y: 1,
  //         w: 1,
  //         h: 4,
  //         minW: 1,
  //         minH: 4,
  //         moved: false,
  //         static: false,
  //       },
  //     ],
  //     xs: [
  //       {
  //         i: '1',
  //         x: 0,
  //         y: 2,
  //         w: 1,
  //         h: 4,
  //         minW: 1,
  //         minH: 4,
  //         moved: false,
  //         static: false,
  //       },
  //       {
  //         i: '2',
  //         x: 1,
  //         y: 2,
  //         w: 1,
  //         h: 4,
  //         minW: 1,
  //         minH: 4,
  //         moved: false,
  //         static: false,
  //       },
  //       {
  //         i: '0',
  //         x: 2,
  //         y: 1,
  //         w: 1,
  //         h: 4,
  //         minW: 1,
  //         minH: 4,
  //         moved: false,
  //         static: false,
  //       },
  //     ],
  //     xxs: [
  //       {
  //         i: '1',
  //         x: 0,
  //         y: 2,
  //         w: 1,
  //         h: 4,
  //         minW: 1,
  //         minH: 4,
  //         moved: false,
  //         static: false,
  //       },
  //       {
  //         i: '2',
  //         x: 1,
  //         y: 2,
  //         w: 1,
  //         h: 4,
  //         minW: 1,
  //         minH: 4,
  //         moved: false,
  //         static: false,
  //       },
  //       {
  //         i: '0',
  //         x: 2,
  //         y: 1,
  //         w: 1,
  //         h: 4,
  //         minW: 1,
  //         minH: 4,
  //         moved: false,
  //         static: false,
  //       },
  //     ],
  //   };

  //   renderWithProviders(<Content colsize={colsize} id={id} data={data} layoutData={layoutData} />);

  //   // Assert the presence of child components based on the provided layouts
  //   // Example assertion:
  //   const widgetElement = screen.getByTestId('0');

  //   expect(widgetElement).toBeInTheDocument();
  // });
});
