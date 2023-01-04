
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import DragContainer from '.';

const props = {
  onDrop: '',
  disabled: false,
  SortableItemComponent: jest.fn().mockReturnValue('mock1'),
  LastRowSortableItemComponent: jest.fn().mockReturnValue('mock2'),
  onSortEnd: jest.fn(),
};

describe('drag Container', () => {
  test('should able to test the Drag Container with the list of items which have keys', async () => {
    renderWithProviders(
      <MemoryRouter>
        <DragContainer
          {...{...props,
            items: [
              {
                key: 'bPV_fPAkA',
                extract: 'ResourceList',
                generate: 'test',
              },
              {
                key: 'TiiIbfTd-r',
                extract: '_links',
                generate: 'test1',
              },
            ] }} />
      </MemoryRouter>
    );
    const mock1 = await screen.findAllByText('mock1');

    expect(mock1).toHaveLength(2);
    const mock2 = screen.getByText('mock2');

    expect(mock2).toBeInTheDocument();
  });
  test('should able to test the Drag Container with the empty list of items', () => {
    renderWithProviders(
      <MemoryRouter>
        <DragContainer {...props} />
      </MemoryRouter>
    );
    const mock2 = screen.getByText('mock2');

    expect(mock2).toBeInTheDocument();
  });
  test('should able to test the Drag Container with the list of items which has section id', async () => {
    renderWithProviders(
      <MemoryRouter>
        <DragContainer
          {...{...props,
            items: [
              {
                sectionId: 'bPV_fPAkA',
                extract: 'ResourceList',
                generate: 'test',
              },
              {
                sectionId: 'TiiIbfTd-r',
                extract: '_links',
                generate: 'test1',
              },
            ] }} />
      </MemoryRouter>
    );
    const mock1 = await screen.findAllByText('mock1');

    expect(mock1).toHaveLength(2);
    const mock2 = screen.getByText('mock2');

    expect(mock2).toBeInTheDocument();
  });
  test('should able to test the Drag Container with the list of items which has section id and disabled as true', async () => {
    renderWithProviders(
      <MemoryRouter>
        <DragContainer
          {...{...props,
            items: [
              {
                sectionId: 'bPV_fPAkA',
                extract: 'ResourceList',
                generate: 'test',
              },
              {
                sectionId: 'TiiIbfTd-r',
                extract: '_links',
                generate: 'test1',
              },
            ],
            disabled: true }} />
      </MemoryRouter>
    );
    const mock1 = await screen.findAllByText('mock1');

    expect(mock1).toHaveLength(2);
    const mock2 = screen.getByText('mock2');

    expect(mock2).toBeInTheDocument();
  });
});
