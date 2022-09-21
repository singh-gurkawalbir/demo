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
      items: [
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
        {
          extract: 'Column5',
          generate: 'test',
        },
      ],
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
      items: [
        {
          key: 'Column8',
          extract: 'Column8',
          generate: 'test',
        },
        {
          key: '88',
          extract: 'Column78',
          generate: 'test',
        },
        {
          key: '72',
          extract: 'Column25',
          generate: 'test',
        },
        {
          key: '100',
          extract: 'Column60',
          generate: 'test',
        },
        {
          key: '106',
          extract: 'Column90',
          generate: 'test',
        },
        {
          key: '85',
          extract: 'Column20',
          generate: 'test',
        },
        {
          key: '22',
          extract: 'Column20',
          generate: 'test',
        },
        {
          key: '70',
          extract: 'Column54',
          generate: 'test',
        },
        {
          key: '74',
          extract: 'Column5',
          generate: 'test',
        },
        {
          key: '1111',
          extract: 'Column72',
          generate: 'test',
        },
        {
          key: '140',
          extract: 'Column32',
          generate: 'test',
        },
        {
          key: '61',
          extract: 'Column98',
          generate: 'test',
        },
        {
          key: '11',
          extract: 'Column57',
          generate: 'test',
        },
        {
          key: '101',
          extract: 'Column106',
          generate: 'test',
        },
        {
          key: '88',
          extract: 'Column6',
          generate: 'test',
        },
        {
          key: '37',
          extract: 'Column98',
          generate: 'test',
        },
        {
          key: '104',
          extract: 'Column82',
          generate: 'test',
        },
        {
          key: '36',
          extract: 'Column89',
          generate: 'test',
        },
        {
          key: '1234',
          extract: 'Column77',
          generate: 'test',
        },
        {
          key: '33',
          extract: 'Column2',
          generate: 'test',
        },
        {
          key: '107',
          extract: 'Column34',
          generate: 'test',
        },
        {
          key: '89',
          extract: 'Column63',
          generate: 'test',
        },
        {
          key: '20',
          extract: 'Column2',
          generate: 'test',
        },
        {
          key: '27',
          extract: 'Column20',
          generate: 'test',
        },
        {
          key: '57',
          extract: 'Column53',
          generate: 'test',
        },
        {
          key: '67',
          extract: 'Column8',
          generate: 'test',
        },
        {
          key: '40',
          extract: 'Column6',
          generate: 'test',
        },
        {
          key: '29',
          extract: 'Column80',
          generate: 'test',
        },
        {
          key: '49',
          extract: 'Column96',
          generate: 'test',
        },
        {
          key: '72',
          extract: 'Column43',
          generate: 'test',
        },
        {
          key: '8',
          extract: 'Column28',
          generate: 'test',
        },
        {
          key: '81',
          extract: 'Column72',
          generate: 'test',
        },
        {
          key: '59',
          extract: 'Column33',
          generate: 'test',
        },
        {
          key: '107',
          extract: 'Column73',
          generate: 'test',
        },
        {
          key: '21',
          extract: 'Column43',
          generate: 'test',
        },
        {
          key: '79',
          extract: 'Column79',
          generate: 'test',
        },
        {
          key: '20',
          extract: 'Column33',
          generate: 'test',
        },
        {
          key: '74',
          extract: 'Column12',
          generate: 'test',
        },
        {
          key: '15',
          extract: 'Column21',
          generate: 'test',
        },
        {
          key: '108',
          extract: 'Column38',
          generate: 'test',
        },
        {
          key: '83',
          extract: 'Column59',
          generate: 'test',
        },
        {
          key: '96',
          extract: 'Column92',
          generate: 'test',
        },
        {
          key: '12',
          extract: 'Column13',
          generate: 'test',
        },
        {
          key: '22',
          extract: 'Column79',
          generate: 'test',
        },
        {
          key: '57',
          extract: 'Column69',
          generate: 'test',
        },
        {
          key: '42',
          extract: 'Column5',
          generate: 'test',
        },
        {
          key: '76',
          extract: 'Column11',
          generate: 'test',
        },
        {
          key: '99',
          extract: 'Column11',
          generate: 'test',
        },
        {
          key: '102',
          extract: 'Column6',
          generate: 'test',
        },
        {
          key: '59',
          extract: 'Column54',
          generate: 'test',
        },
        {
          key: '82',
          extract: 'Column70',
          generate: 'test',
        },
        {
          key: '78',
          extract: 'Column83',
          generate: 'test',
        },
        {
          key: '13',
          extract: 'Column101',
          generate: 'test',
        },
        {
          key: '93',
          extract: 'Column16',
          generate: 'test',
        },
        {
          key: '26',
          extract: 'Column37',
          generate: 'test',
        },
        {
          key: '7',
          extract: 'Column85',
          generate: 'test',
        },
        {
          key: '8',
          extract: 'Column57',
          generate: 'test',
        },
        {
          key: '68',
          extract: 'Column2',
          generate: 'test',
        },
        {
          key: '2',
          extract: 'Column98',
          generate: 'test',
        },
        {
          key: '31',
          extract: 'Column11',
          generate: 'test',
        },
        {
          key: '95',
          extract: 'Column16',
          generate: 'test',
        },
        {
          key: '17',
          extract: 'Column91',
          generate: 'test',
        },
        {
          key: '56',
          extract: 'Column25',
          generate: 'test',
        },
        {
          key: '11',
          extract: 'Column9',
          generate: 'test',
        },
        {
          key: '103',
          extract: 'Column56',
          generate: 'test',
        },
        {
          key: '98',
          extract: 'Column109',
          generate: 'test',
        },
        {
          key: '78',
          extract: 'Column55',
          generate: 'test',
        },
        {
          key: '82',
          extract: 'Column12',
          generate: 'test',
        },
        {
          key: '72',
          extract: 'Column89',
          generate: 'test',
        },
        {
          key: '39',
          extract: 'Column53',
          generate: 'test',
        },
        {
          key: '57',
          extract: 'Column86',
          generate: 'test',
        },
        {
          key: '84',
          extract: 'Column47',
          generate: 'test',
        },
        {
          key: '57',
          extract: 'Column35',
          generate: 'test',
        },
        {
          key: '104',
          extract: 'Column5',
          generate: 'test',
        },
        {
          key: '81',
          extract: 'Column42',
          generate: 'test',
        },
        {
          key: '109',
          extract: 'Column16',
          generate: 'test',
        },
        {
          key: '104',
          extract: 'Column2',
          generate: 'test',
        },
        {
          key: '104',
          extract: 'Column63',
          generate: 'test',
        },
        {
          key: '18',
          extract: 'Column6',
          generate: 'test',
        },
        {
          key: '97',
          extract: 'Column38',
          generate: 'test',
        },
        {
          key: '78',
          extract: 'Column91',
          generate: 'test',
        },
        {
          key: '103',
          extract: 'Column57',
          generate: 'test',
        },
        {
          key: '91',
          extract: 'Column53',
          generate: 'test',
        },
        {
          key: '77',
          extract: 'Column14',
          generate: 'test',
        },
        {
          key: '65',
          extract: 'Column72',
          generate: 'test',
        },
        {
          key: '34',
          extract: 'Column75',
          generate: 'test',
        },
        {
          key: '99',
          extract: 'Column61',
          generate: 'test',
        },
        {
          key: '61',
          extract: 'Column44',
          generate: 'test',
        },
        {
          key: '40',
          extract: 'Column35',
          generate: 'test',
        },
        {
          key: '34',
          extract: 'Column89',
          generate: 'test',
        },
        {
          key: '98',
          extract: 'Column30',
          generate: 'test',
        },
        {
          key: '48',
          extract: 'Column69',
          generate: 'test',
        },
        {
          key: '50',
          extract: 'Column2',
          generate: 'test',
        },
        {
          key: '1',
          extract: 'Column78',
          generate: 'test',
        },
        {
          key: '50',
          extract: 'Column11',
          generate: 'test',
        },
        {
          key: '60',
          extract: 'Column7',
          generate: 'test',
        },
        {
          key: '2',
          extract: 'Column91',
          generate: 'test',
        },
        {
          key: '87',
          extract: 'Column20',
          generate: 'test',
        },
        {
          key: '30',
          extract: 'Column58',
          generate: 'test',
        },
        {
          key: '92',
          extract: 'Column27',
          generate: 'test',
        },
        {
          key: '98',
          extract: 'Column29',
          generate: 'test',
        },
        {
          key: '96',
          extract: 'Column99',
          generate: 'test',
        },
        {
          key: '91',
          extract: 'Column106',
          generate: 'test',
        },
        {
          key: '56',
          extract: 'Column12',
          generate: 'test',
        },
        {
          key: '73',
          extract: 'Column49',
          generate: 'test',
        },
        {
          key: '29',
          extract: 'Column37',
          generate: 'test',
        },
        {
          key: '21',
          extract: 'Column4',
          generate: 'test',
        },
        {
          key: '87',
          extract: 'Column102',
          generate: 'test',
        },
        {
          key: '38',
          extract: 'Column82',
          generate: 'test',
        },
        {
          key: '99',
          extract: 'Column90',
          generate: 'test',
        },
      ],
      onSortEnd: jest.fn(),
      importId: '123',
      flowId: '456',
      subRecordMappingId: '987',
    });
    expect(document.querySelectorAll('div > ul > div > div')).toHaveLength(1);
    expect(screen.getAllByRole('list')).toHaveLength(1);
  });
});

