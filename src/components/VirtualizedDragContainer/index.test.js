/* global describe, test, jest, expect */
import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import VirtualizedDragContainer from '.';
import { renderWithProviders } from '../../test/test-utils';

async function initVirtualizedDragContainer({disabled, items, onSortEnd = jest.fn(), importId = '123', flowId = '456', subRecordMappingId = '987' } = {}) {
  const ui = (
    <MemoryRouter>
      <VirtualizedDragContainer
        disabled={disabled}
        items={items}
        onSortEnd={onSortEnd}
        importId={importId}
        flowId={flowId}
        subRecordMappingId={subRecordMappingId}
        />
    </MemoryRouter>
  );
  const { utils } = renderWithProviders(ui);

  return (
    utils
  );
}
jest.mock('../Mapping/MappingRow', () => ({
  __esModule: true,
  ...jest.requireActual('../Mapping/MappingRow'),
  default: ({children}) => <div>{children}</div>,
}
));
describe('Test suite for VirtualizedDragContainer', () => {
  test('Should test the virtualized drag container with empty items list', async () => {
    await initVirtualizedDragContainer();
    expect(document.querySelector('div > ul > div > div > div > div')).toBeEmptyDOMElement();
  });
  test('Should test the virtualized drag container with items list without keys', async () => {
    await initVirtualizedDragContainer({
      disabled: false,
      items: Array.from(Array(102),
        (_, x) => ({
          extract: `Column${x}`,
          generate: 'test',
        })),
      onSortEnd: jest.fn(),
      importId: '123',
      flowId: '456',
      subRecordMappingId: '987',
    });
    expect(document.querySelectorAll('div > ul > div > div')).toHaveLength(1);
    expect(screen.getAllByRole('list')).toHaveLength(1);
  });
  test('Should test the virtualized drag container with items list with keys', async () => {
    await initVirtualizedDragContainer({
      disabled: false,
      items: Array.from(Array(102),
        (_, x) => ({
          key: x,
          extract: `Column${x}`,
          generate: 'test',
        })),
      onSortEnd: jest.fn(),
      importId: '123',
      flowId: '456',
      subRecordMappingId: '987',
    });
    expect(document.querySelectorAll('div > ul > div > div')).toHaveLength(1);
    expect(screen.getAllByRole('list')).toHaveLength(1);
  });
});

