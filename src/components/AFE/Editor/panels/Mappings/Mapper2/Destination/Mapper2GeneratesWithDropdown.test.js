import * as React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Mapper2GeneratesWithDropdown from './Mapper2GeneratesWithDropdown';
import { renderWithProviders, mutateStore, reduxStore} from '../../../../../../../test/test-utils';
import actions from '../../../../../../../actions';

window.HTMLElement.prototype.scrollIntoView = jest.fn();

const initialStore = reduxStore;

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

mutateStore(initialStore, draft => {
  draft.session.mapping = {mapping: {
    newRowKey: 'newRowKey',
    finalDestinationTree: [
      {
        key: 'GAGcQO8TyyQ',
        generate: 'BillToAddress',
        jsonPath: 'BillToAddress',
        title: '',
        dataType: 'object',
        isRequired: false,
        children: [
          {
            key: 'IlMs9QCwdCp',
            generate: 'id',
            jsonPath: 'BillToAddress.id',
            parentKey: 'GAGcQO8TyyQ',
            title: '',
            dataType: 'string',
            isRequired: false,
            disabled: true,
          },
        ],
      },
    ],
  }};
});

const onBlur = jest.fn();

describe('Mapper2GeneratesWithDropdown ui test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should select a field', async () => {
    mutateStore(initialStore);
    renderWithProviders(<Mapper2GeneratesWithDropdown id="randomID" />, {initialStore});
    userEvent.type(
      screen.getByRole('textbox'),
      'BillToAddress'
    );

    userEvent.click(screen.getAllByText('BillToAddress')[0]);
    await waitFor(() => expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.v2.patchDestinationFilter('BillToAddress', '')
    ));
  });
  test('should ciclk outide the field and call onBlur function', () => {
    mutateStore(initialStore);
    const {utils} = renderWithProviders(<Mapper2GeneratesWithDropdown onBlur={onBlur} id="randomID" />, {initialStore});

    userEvent.type(
      screen.getByRole('textbox'),
      'BillToAddress'
    );
    userEvent.click(utils.container);

    expect(onBlur).toHaveBeenCalledWith('BillToAddress');
  });
  test('should delete the new row key', () => {
    mutateStore(initialStore);
    renderWithProviders(<Mapper2GeneratesWithDropdown onBlur={jest.fn()} id="newRowKey" />, {initialStore});

    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.v2.deleteNewRowKey()
    );
  });
});
