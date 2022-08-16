/* global describe, test, expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createMemoryHistory } from 'history';
import { renderWithProviders} from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';
import SettingsPanel from './index';

const integration = [
  {
    _id: '5a2e4cc68147dd5f5cf8d6f8',
    lastModified: '2022-01-16T14:56:27.331Z',
    name: 'BigCommerce - NetSuite',
    _connectorId: '56fbb1176691821844de2721',
    mode: 'settings',
    settings: {
      commonresources: {
        netsuiteConnectionId: '5a2e4cc751fe9e2d7c1c3bac',
        nsUtilImportAdaptorId: '5a2e4cc78147dd5f5cf8d6fa',
        nsUtilImportAdaptorApiIdentifier: 'i156aefd90',
      },
      storemap: [
        {
          shopname: 'QA_Store',
          email: 'demostore@netsuite.com',
          apiIdentifier: '',
          bigcommerceConnection: '5de5137307f3ae41e0ebd4d4',
          shopInstallComplete: 'true',
          shopid: 'g3uzz5c7jx',
          massUpdateImportAdaptorId: '5de5139d07f3ae41e0ebd4e4',
          apiIdentifierCustomerImport: 'ifdc3cc202',
          genericExportApiIdentifier: 'e9b9955ccf',
          productVariantsExportApiIdentifier: 'e1b6f03c6a',
          genericv3ExportApiIdentifier: 'e2fc3a0e2c',
          productIdsExportId: '5f13e3502e38dc1d31c377ec',
        },
      ],
      sections: [
        {
          shopInstallComplete: 'true',
          title: 'QA_Store',
          id: 'g3uzz5c7jx',
          sections: [
            {
              title: 'Fulfillment',
              columns: 1,
              flows: [
                {
                  _id: '5de513a007f3ae41e0ebd501',
                  showMapping: true,
                  showSchedule: true,
                },
              ],
              fields: [
                {
                  label: 'NetSuite Saved Search for syncing item fulfillments',
                  required: true,
                  value: '79256',
                  type: 'select',
                  name: 'exports_5de513a00bce564542847e2e_savedSearch_listSavedSearches',
                  supportsRefresh: true,
                  options: [
                    [
                      '79256',
                      'Celigo BigCommerce Fulfillment Export Search [QA Team1] Store',
                    ],
                  ],
                  properties: {
                    yieldValueAndLabel: true,
                  },
                },
              ],
            },
          ],
        },
      ],
      supportsMultiStore: true,
      storeLabel: 'BigCommerce Store',
      connectorEdition: 'standard',
      editionMigrated: 'true',
      defaultSectionId: 'defaultstoreid',
      general: [
        {
          id: 'g3uzz5c7jx',
          title: 'General',
          fields: [
            {
              label: 'Your store',
              value: 'g3uzz5c7jx',
              type: 'select',
              name: 'general_g3uzz5c7jx_storeName_updateStoreName',
              tooltip: 'TooltipText',
              options: [
                [
                  'g3uzz5c7jx',
                  'Option1',
                ],
              ],
              disabled: true,
              supportsRefresh: true,
              properties: {
                yieldValueAndLabel: true,
              },
            },
          ],
        },
      ],
    },
  },
  {
    _id: '5ff579d745ceef7dcd797c15',
    lastModified: '2021-01-19T06:34:17.222Z',
    name: " AFE 2.0 refactoring for DB's",
    install: [],
    sandbox: false,
    _registeredConnectionIds: [
      '5cd51efd3607fe7d8eda9c97',
      '5ff57a8345ceef7dcd797c21',
    ],
    installSteps: [],
    uninstallSteps: [],
    flowGroupings: [],
    createdAt: '2021-01-06T08:50:31.935Z',
  },
  {
    _id: '5a2e4cc68147dd5f5cf8d6f9',
    lastModified: '2022-01-16T14:56:27.331Z',
    name: 'BigCommerce - NetSuite',
    _connectorId: '56fbb1176691821844de2721',
    mode: 'settings',
    settings: {
      commonresources: {
        netsuiteConnectionId: '5a2e4cc751fe9e2d7c1c3bac',
        nsUtilImportAdaptorId: '5a2e4cc78147dd5f5cf8d6fa',
        nsUtilImportAdaptorApiIdentifier: 'i156aefd90',
      },
      storemap: [
        {
          shopname: 'QA_Store',
          email: 'demostore@netsuite.com',
          apiIdentifier: '',
          bigcommerceConnection: '5de5137307f3ae41e0ebd4d4',
          shopInstallComplete: 'true',
          shopid: 'g3uzz5c7jx',
          massUpdateImportAdaptorId: '5de5139d07f3ae41e0ebd4e4',
          apiIdentifierCustomerImport: 'ifdc3cc202',
          genericExportApiIdentifier: 'e9b9955ccf',
          productVariantsExportApiIdentifier: 'e1b6f03c6a',
          genericv3ExportApiIdentifier: 'e2fc3a0e2c',
          productIdsExportId: '5f13e3502e38dc1d31c377ec',
        },
      ],
      sections: [
        {
          shopInstallComplete: 'true',
          title: 'QA_Store',
          id: 'g3uzz5c7jx',
          sections: [
            {
              title: 'Fulfillment',
              columns: 1,
              flows: [
                {
                  _id: '5de513a007f3ae41e0ebd501',
                  showMapping: true,
                  showSchedule: true,
                },
              ],
              fields: [
                {
                  label: 'NetSuite Saved Search for syncing item fulfillments',
                  required: true,
                  value: '79256',
                  type: 'select',
                  name: 'exports_5de513a00bce564542847e2e_savedSearch_listSavedSearches',
                  supportsRefresh: true,
                  options: [
                    [
                      '79256',
                      'Celigo BigCommerce Fulfillment Export Search [QA Team1] Store',
                    ],
                  ],
                  properties: {
                    yieldValueAndLabel: true,
                  },
                },
              ],
            },
          ],
        },
      ],
      supportsMultiStore: true,
      storeLabel: 'BigCommerce Store',
      connectorEdition: 'standard',
      editionMigrated: 'true',
      defaultSectionId: 'defaultstoreid',
      general: [
        {
          id: 'g3uzz5c7jx',
          title: 'General',
          fields: [
            {
              label: 'Your store',
              value: 'g3uzz5c7jx',
              type: 'select',
              name: 'general_g3uzz5c7jx_storeName_updateStoreName',
              tooltip: 'TooltipText',
              options: [
                [
                  'g3uzz5c7jx',
                  'Option1',
                ],
              ],
              disabled: true,
              supportsRefresh: true,
              properties: {
                yieldValueAndLabel: true,
              },
            },
          ],
        },
      ],
    },
  },
];

describe('SettingsPanel UI tests', () => {
  function initStoreAndRender(integrationId, childId, path) {
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.integrations = integration;
    renderWithProviders(
      <MemoryRouter initialEntries={[path]}>
        <Route path="/:sectionId">
          <SettingsPanel integrationId={integrationId} childId={childId} />
        </Route>
      </MemoryRouter>, {initialStore});
  }
  test('should test the panel and links', () => {
    initStoreAndRender('5a2e4cc68147dd5f5cf8d6f8', 'g3uzz5c7jx', '/Fulfillment');

    const fulfillment = screen.getByText('Fulfillment');
    const general = screen.getByText('General');

    expect(fulfillment).toHaveAttribute('href', '/Fulfillment');
    expect(general).toHaveAttribute('href', '/common');

    expect(screen.getByText('Configure all Fulfillment flows')).toBeInTheDocument();

    userEvent.click(screen.getByText('General'));
    expect(screen.getByText('Your store')).toBeInTheDocument();
    expect(screen.getByText('Option1')).toBeInTheDocument();
  });

  test('should test when flow section is not in integration', () => {
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.integrations = integration;
    renderWithProviders(
      <MemoryRouter >
        <Route>
          <SettingsPanel integrationId="5ff579d745ceef7dcd797c15" childId="g3uzz5c7jx" />
        </Route>
      </MemoryRouter>, {initialStore});

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText("You don 't have any custom settings for this integration.")).toBeInTheDocument();

    screen.debug();
  });
  test('should test when isparent view is true', () => {
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.integrations = [{
      _id: '5ff579d745ceef7dcd797c16',
      lastModified: '2021-01-19T06:34:17.222Z',
      name: " AFE 2.0 refactoring for DB's",
      install: [],
      sandbox: false,
      _registeredConnectionIds: [
        '5cd51efd3607fe7d8eda9c97',
        '5ff57a8345ceef7dcd797c21',
      ],
      settings: {supportsMultiStore: true, storeLabel: 'someStoreLabel'},
      installSteps: [],
      uninstallSteps: [],
      flowGroupings: [],
      createdAt: '2021-01-06T08:50:31.935Z',
    },
    ];
    renderWithProviders(
      <MemoryRouter >
        <Route>
          <SettingsPanel integrationId="5ff579d745ceef7dcd797c16" />
        </Route>
      </MemoryRouter>, {initialStore});

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Choose a someStoreLabel from the someStoreLabel drop-down to view settings.')).toBeInTheDocument();

    screen.debug();
  });
  test('shoudl test the history.replace call', () => {
    const history = createMemoryHistory({ initialEntries: ['/wrongsectionId'] });

    history.replace = jest.fn();
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.integrations = integration;
    renderWithProviders(
      <Router history={history}>
        <Route path="/:sectionId">
          <SettingsPanel integrationId="5a2e4cc68147dd5f5cf8d6f9" />
        </Route>
      </Router>, {initialStore});
    expect(history.replace).toHaveBeenCalledWith('/Fulfillment');
  });
});
