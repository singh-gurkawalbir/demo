
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import DynaNSSavedSearch from './DynaNSSavedSearch';
import { getCreatedStore } from '../../../store';

jest.mock('./DynaRefreshableSelect', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaRefreshableSelect'),
  default: ({label, placeholder, urlToOpen}) => (
    <div data-testid="DynaRefreshableSelect">
      <span data-testid="label">{label}</span>
      <span data-testid="placeholder">{placeholder}</span>
      <span data-testid="savedSearchUrl">{urlToOpen}</span>
    </div>
  ),
}));

jest.mock('./DynaNSSavedSearchInternalID', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaNSSavedSearchInternalID'),
  default: ({label, value, urlToOpen}) => (
    <div data-testid="DynaNSSavedSearchInternalID">
      <span data-testid="label">{label}</span>
      <span data-testid="value">{value}</span>
      <span data-testid="savedSearchUrl">{urlToOpen}</span>
    </div>
  ),
}));

describe('test suite for netsuite saved search field', () => {
  test('saved search type should be public by default', () => {
    const props = {
      value: '54466',
      connectionId: 'connection123',
    };
    const domain = 'https://tstdr.netsuite.com';
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.connections = [{
        _id: props.connectionId,
        type: 'netsuite',
        netsuite: {
          dataCenterURLs: { systemDomain: domain },
        },
      }];
    });

    renderWithProviders(<DynaNSSavedSearch {...props} />, {initialStore});
    expect(document.querySelector('legend')).toHaveTextContent('Saved search type:');
    expect(screen.getByRole('radio', {name: 'Public'})).toBeChecked();
    expect(screen.getByRole('radio', {name: 'Private'})).toBeInTheDocument();
    expect(screen.getByTestId('DynaRefreshableSelect')).toBeInTheDocument();
    expect(screen.getByTestId('label')).toHaveTextContent('Saved searches');
    expect(screen.getByTestId('placeholder')).toHaveTextContent('Please select a saved search');
    expect(screen.getByTestId('savedSearchUrl')).toHaveTextContent(`${domain}/app/common/search/search.nl?id=${props.value}`);
  });

  test('should be able to switch between public and private search types', async () => {
    const onFieldChange = jest.fn();
    const props = {
      id: 'netsuite.dynanssavedsearch',
      value: '54466',
      connectionId: 'connection123',
      onFieldChange,
    };
    const domain = 'https://tstdr.netsuite.com';
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.connections = [{
        _id: props.connectionId,
        type: 'netsuite',
        netsuite: {
          dataCenterURLs: { systemDomain: domain },
        },
      }];
    });

    renderWithProviders(<DynaNSSavedSearch {...props} />, {initialStore});
    const privateSearch = screen.getByRole('radio', {name: 'Private'});

    await userEvent.click(privateSearch);

    //  should reset value on changing the search type
    expect(onFieldChange).toHaveBeenCalledWith(props.id, '');

    expect(screen.getByRole('radio', {name: 'Private'})).toBeChecked();
    expect(screen.getByTestId('DynaNSSavedSearchInternalID')).toBeInTheDocument();
    expect(screen.getByTestId('label')).toHaveTextContent('Search internal ID');
    expect(screen.getByTestId('value')).toHaveTextContent(props.value);
    expect(screen.getByTestId('savedSearchUrl')).toHaveTextContent(`${domain}/app/common/search/search.nl?id=${props.value}`);
  });

  test('should be able to disable the option to change search type', () => {
    const props = {
      value: '54466',
      connectionId: 'connection123',
      disabled: true,
      required: true,
    };

    renderWithProviders(<DynaNSSavedSearch {...props} />);
    const selectSearchType = document.querySelector('input[name="searchType"]');

    expect(selectSearchType).toBeDisabled();
    expect(document.querySelector('legend')).toHaveTextContent('Saved search type: *');
  });

  test('should show public search type if default value matches with any in the list of public search type', () => {
    const props = {
      resourceId: 'export123',
      connectionId: 'connection123',
      defaultValue: '5178',
      commMetaPath: 'netsuite/metadata/suitescript/connections/connection123/savedSearches',
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.metadata = {
        application: {
          [props.connectionId]: {
            [props.commMetaPath]: {
              data: [{
                id: props.defaultValue,
                name: 'Bin Search',
              }],
            },
          },
        },
      };
    });
    renderWithProviders(<DynaNSSavedSearch {...props} />, {initialStore});
    expect(screen.getByRole('radio', {name: 'Public'})).toBeChecked();
  });

  test('should show private search type if default value does not match with any in the list of public search type', () => {
    const props = {
      resourceId: 'export123',
      connectionId: 'connection123',
      defaultValue: '5178',
      commMetaPath: 'netsuite/metadata/suitescript/connections/connection123/savedSearches',
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.metadata = {
        application: {
          [props.connectionId]: {
            [props.commMetaPath]: {
              data: [{
                id: '7630',
                name: 'Bin Search',
              }],
            },
          },
        },
      };
    });
    renderWithProviders(<DynaNSSavedSearch {...props} />, {initialStore});
    expect(screen.getByRole('radio', {name: 'Private'})).toBeChecked();
  });
});
