import * as React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DestinationTree from './DestinationTree';
import { renderWithProviders, mutateStore, reduxStore} from '../../../../../../../test/test-utils';
import actions from '../../../../../../../actions';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.session.mapping = {mapping: {
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
      {
        key: 'GAGcQO8TyyQ32',
        generate: 'BillToAddress2',
        jsonPath: 'BillToAddress2',
        title: '',
        dataType: 'object',
        isRequired: true,
        children: [
          {
            key: 'IlMs9QCwdCp',
            generate: 'id',
            jsonPath: 'BillToAddress.id',
            parentKey: 'GAGcQO8TyyQ',
            title: '',
            dataType: 'string',
            isRequired: true,
            disabled: true,
          },
        ],
      },
    ],
  }};
});

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const setIsFocused = jest.fn();

describe('DestinationTree test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should show empty dom when trre data is not provided', () => {
    mutateStore(initialStore);
    const {utils} = renderWithProviders(<DestinationTree
      propValue="id"
      destDataType="string"
      setIsFocused={setIsFocused}
        />);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should verify the various label in the field', async () => {
    mutateStore(initialStore);
    renderWithProviders(<DestinationTree
      propValue="id"
      destDataType="string"
      setIsFocused={setIsFocused}
    />, {initialStore});

    expect(screen.getByText('Type or select destination field')).toBeInTheDocument();

    const tree = screen.getByRole('tree');

    expect(tree.textContent).toBe('BillToAddressobjectidstringBillToAddress2 * (required)objectid * (required)string');

    await userEvent.click(screen.getByText('BillToAddress'));

    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.v2.addSelectedDestination('GAGcQO8TyyQ')
    );
    expect(setIsFocused).toHaveBeenCalledWith(false);
  });
});
