
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';
import DynaNSWSSavedSearch from './DynaNSWSSavedSearch';

jest.mock('./DynaRefreshableSelect', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaRefreshableSelect'),
  default: ({urlToOpen}) => (<div data-testid="savedSearchUrl">{urlToOpen === null ? 'NULL' : urlToOpen}</div>),
}));

describe('test suite for DynaNSWSSavedSearch field', () => {
  test('should point to correct url corresponding to a saved search', () => {
    const domain = 'https://tstdrv.app.netsuite.com';
    const props = {
      connectionId: 'connection123',
      value: '5123',
    };
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.connections = [{
      _id: props.connectionId,
      netsuite: {
        dataCenterURLs: {
          systemDomain: domain,
        },
      },
    }];
    renderWithProviders(<DynaNSWSSavedSearch {...props} />, {initialStore});
    expect(screen.getByTestId('savedSearchUrl')).toHaveTextContent(`${domain}/app/common/search/search.nl?id=${props.value}`);
  });

  test('should not point to any url if value corresponding to a saved search does not exist', () => {
    const props = { connectionId: 'connection123' };
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.connections = [{
      _id: props.connectionId,
      netsuite: {
        dataCenterURLs: {
          systemDomain: 'https://tstdrv.app.netsuite.com',
        },
      },
    }];
    renderWithProviders(<DynaNSWSSavedSearch {...props} />, {initialStore});
    expect(screen.getByTestId('savedSearchUrl')).toHaveTextContent('NULL');
  });

  test('should not point to any url if netsuite system domain does not exist', () => {
    const props = {
      connectionId: 'connection123',
      value: '5123',
    };
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.connections = [{
      _id: props.connectionId,
      netsuite: {
        dataCenterURLs: {},
      },
    }];
    renderWithProviders(<DynaNSWSSavedSearch {...props} />, {initialStore});
    expect(screen.getByTestId('savedSearchUrl')).toHaveTextContent('NULL');
  });
});
