/* global describe, test, expect, jest, afterEach */
import React from 'react';
import {screen, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders, reduxStore} from '../../../../../../test/test-utils';
import MappingRow from './MappingRow';
import actions from '../../../../../../actions';

jest.mock('../../../../../icons/TrashIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../icons/TrashIcon'),
  default: () => (
    <div>Trash Icon</div>
  ),
}));

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const initialStore = reduxStore;

initialStore.getState().session.responseMapping = { mapping: {
  mappings: [
    {
      extract: 'i',
      generate: 'responseID',
      key: '54eajgANHf',
    },
  ],
  flowId: '62f0bdfaf8b63672312bbe36',
  resourceId: '62e6897976ce554057c0f28f',
  resourceType: 'imports',
  status: 'received',
  mappingsCopy: [
    {
      extract: 'i',
      generate: 'responseID',
      key: '54eajgANHf',
    },
  ],
}};
initialStore.getState().data.resources.flows = [
  {
    _id: '62f0bdfaf8b63672312bbe36',
    pageProcessors: [
      {
        responseMapping: {
          fields: [
            {
              extract: 'id',
              generate: 'responseID',
            },
          ],
          lists: [],
        },
        type: 'import',
        _importId: '62e6897976ce554057c0f28f',
      },
    ],
  },
];
initialStore.getState().data.resources.imports = [
  {
    _id: '62e6897976ce554057c0f28f',
  },
];
describe('Response Mapping MappingRow test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should change the extract field', () => {
    renderWithProviders(
      <MappingRow mappingKey="54eajgANHf" flowId="62f0bdfaf8b63672312bbe36" resourceId="62e6897976ce554057c0f28f" />, {initialStore});
    fireEvent.focusIn(screen.getByText('i'));
    userEvent.click(screen.getByText('id'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.responseMapping.patchField('extract', '54eajgANHf', 'id')
    );
  });

  test('should change the generate field', () => {
    renderWithProviders(
      <MappingRow mappingKey="54eajgANHf" flowId="62f0bdfaf8b63672312bbe36" resourceId="62e6897976ce554057c0f28f" />, {initialStore});
    const generateField = screen.getByText('responseID');

    fireEvent.change(generateField, {target: {value: 'ChangedValue'}});
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.responseMapping.patchField('generate', '54eajgANHf', 'ChangedValue')
    );
  });
  test('should click on trash icon for deleting the mapping', () => {
    renderWithProviders(
      <MappingRow mappingKey="54eajgANHf" flowId="62f0bdfaf8b63672312bbe36" resourceId="62e6897976ce554057c0f28f" />, {initialStore});
    userEvent.click(screen.getByText('Trash Icon'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.responseMapping.delete('54eajgANHf')
    );
  });
});
