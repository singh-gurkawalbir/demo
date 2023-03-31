
import React from 'react';
import { screen } from '@testing-library/react';
import {renderWithProviders, reduxStore, mutateStore} from '../../test/test-utils';
import KeyColumnsDeprecationNotification from '.';

describe('keyColumnsDeprecationNotification UI testing', () => {
  async function renderWithStore(file, adaptorType, mediaType) {
    const initialStore = reduxStore;

    mutateStore(initialStore, draft => {
      draft.data.resources.exports = [{
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
      }];
      draft.data.resources.connections = [{
        _id: '5d8339d00f4f5a567f0b6188',
        type: 'rest',
        rest: {mediaType},
      }];
    });

    const {utils} = renderWithProviders(<KeyColumnsDeprecationNotification resourceId="5e5f495a3a9b335b1a007b43" />, {initialStore});

    return utils.container;
  }
  test('should do test for showing notfication', async () => {
    await renderWithStore({csv: {keyColumns: [1, 2]}}, '', '');
    const message = screen.getByText('Learn more');

    expect(message).toHaveAttribute(
      'href',
      'https://docs.celigo.com/hc/en-us/articles/4405373029019-Sort-and-group-content-for-all-file-providers'
    );
  });
  test('should not show notification because of adaptor type', async () => {
    const container = await renderWithStore({csv: {keyColumns: [1, 2]}}, 'HTTPExport', '');

    expect(container).toBeEmptyDOMElement();
  });
  test('should not show notification because of key clumns length = 0', async () => {
    const container = await renderWithStore({csv: {keyColumns: []}}, 'something');

    expect(container).toBeEmptyDOMElement();
  });
  test('should not show notification because of csv media type', async () => {
    const container = await renderWithStore({csv: {keyColumns: [1, 2]}}, 'something', 'csv');

    expect(container).toBeEmptyDOMElement();
  });
});
