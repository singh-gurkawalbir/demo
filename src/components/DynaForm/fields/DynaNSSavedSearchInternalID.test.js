
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import DynaNSSavedSearchInternalID from './DynaNSSavedSearchInternalID';
import { getCreatedStore } from '../../../store';

const mockOpenExternalUrl = jest.fn();

jest.mock('../../../utils/window', () => ({
  __esModule: true,
  ...jest.requireActual('../../../utils/window'),
  default: jest.fn(arg => mockOpenExternalUrl(arg)),
}));

describe('test suite for saved search internal id field', () => {
  afterEach(() => {
    mockOpenExternalUrl.mockClear();
  });

  test('should render the field accordingly', () => {
    const onFieldChange = jest.fn();
    const props = {
      id: 'dynaNssaved',
      label: 'Search internal ID',
      connectionId: 'conection123',
      placeholder: 'Enter search id',
      required: true,
      onFieldChange,
    };
    const value = '1234567';
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.connections = [{
      _id: props.connectionId,
    }];

    renderWithProviders(<DynaNSSavedSearchInternalID {...props} />, {initialStore});
    expect(document.querySelector('label')).toHaveTextContent('Search internal ID *');
    const inputEle = screen.getByRole('textbox');

    expect(inputEle).toHaveAttribute('placeholder', props.placeholder);
    expect(inputEle).toBeEnabled();
    userEvent.type(inputEle, value);
    Array.from(value).forEach(key => expect(onFieldChange).toHaveBeenCalledWith(props.id, key));
  });

  test('should show the error message in case of invalid data', () => {
    const props = {
      id: 'openResource',
      isValid: false,
      errorMessages: 'Please provide a valid id',
    };

    renderWithProviders(<DynaNSSavedSearchInternalID {...props} />);
    expect(screen.getByText(props.errorMessages)).toBeInTheDocument();
    const openSavedSearchBtn = document.querySelector('[data-test="openResource"]');

    //  should not be able to open saved search if no saved search id entered
    expect(openSavedSearchBtn).not.toBeInTheDocument();
  });

  test('should be able to open netsuite saved search', () => {
    const domain = 'https://tstdrv.netsuite.com';
    const connectionId = 'connection123';
    const props = {
      value: '5152',
      id: 'openResource',
      connectionId,
    };
    const url = `${domain}/app/common/search/search.nl?id=${props.value}`;
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.connections = [{
      _id: connectionId,
      netsuite: {
        dataCenterURLs: {
          systemDomain: domain,
        },
      },
    }];
    renderWithProviders(<DynaNSSavedSearchInternalID {...props} />, {initialStore});
    const openSavedSearchBtn = document.querySelector('[data-test="openResource"]');

    userEvent.click(openSavedSearchBtn);
    expect(mockOpenExternalUrl).toHaveBeenCalledWith({url});
  });

  test('should not be able to open saved search if netsuite domain does not exist', () => {
    const connectionId = 'connection123';
    const props = {
      value: '5152',
      id: 'openResource',
      connectionId,
    };

    renderWithProviders(<DynaNSSavedSearchInternalID {...props} />);
    const openSavedSearchBtn = document.querySelector('[data-test="openResource"]');

    userEvent.click(openSavedSearchBtn);
    expect(mockOpenExternalUrl).not.toHaveBeenCalled();
  });
});
