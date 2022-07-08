/* global describe, test, expect */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import {renderWithProviders, mockGetRequestOnce} from '../../test/test-utils';
import { runServer } from '../../test/api/server';
import actions from '../../actions';
import KeyColumnsDeprecationNotification from '.';

describe('KeyColumnsDeprecationNotification UI testing', () => {
  runServer();
  async function renderWithStore(file, adaptorType, mediaType) {
    mockGetRequestOnce('/api/exports', [{
      _id: '5e5f495a3a9b335b1a007b43',
      createdAt: '2020-03-04T06:23:22.828Z',
      lastModified: '2020-03-04T06:23:22.896Z',
      name: 'Get data',
      file,
      _connectionId: '5d8339d00f4f5a567f0b6188',
      apiIdentifier: 'eaf2563b24',
      asynchronous: true,
      type: 'distributed',
      oneToMany: false,
      sandbox: false,
      parsers: [],
      distributed: {
        bearerToken: '******',
      },
      salesforce: {
        sObjectType: 'Account',
        distributed: {
          qualifier: null,
          relatedLists: [],
        },
      },
      adaptorType,
    }]);
    mockGetRequestOnce('/api/connections', [{
      _id: '5d8339d00f4f5a567f0b6188',
      type: 'rest',
      rest: {mediaType},
    }]);

    const {store, utils} = renderWithProviders(<KeyColumnsDeprecationNotification resourceId="5e5f495a3a9b335b1a007b43" />);

    store.dispatch(actions.resource.requestCollection('connections'));

    await waitFor(() => expect(store?.getState()?.data?.resources?.connections).toBeDefined());

    store.dispatch(actions.resource.requestCollection('exports'));

    await waitFor(() => expect(store?.getState()?.data?.resources?.exports).toBeDefined());

    return utils.container;
  }
  test('Should do test for showing notfication', async () => {
    await renderWithStore({csv: {keyColumns: [1, 2]}}, '', '');
    const message = screen.getByText('Learn more');

    expect(message).toHaveAttribute(
      'href', 'https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/articles/4405373029019-Sort-and-group-content-for-all-file-providers'
    );
  });
  test('Should not show notification because of adaptor type', async () => {
    const container = await renderWithStore({csv: {keyColumns: [1, 2]}}, 'HTTPExport', '');

    expect(container).toBeEmptyDOMElement();
  });
  test('Should not show notification because of key clumns length = 0', async () => {
    const container = await renderWithStore({csv: {keyColumns: []}}, 'something');

    expect(container).toBeEmptyDOMElement();
  });
  test('Should not show notification because of csv media type', async () => {
    const container = await renderWithStore({csv: {keyColumns: [1, 2]}}, 'something', 'csv');

    expect(container).toBeEmptyDOMElement();
  });
});
