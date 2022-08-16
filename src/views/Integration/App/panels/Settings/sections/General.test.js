/* global describe, test, expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import * as reactredux from 'react-redux';
import { renderWithProviders} from '../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../store';
import GeneralPanel from './General';

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
              label: 'Some Lable for general',
              value: 'g3uzz5c7jx',
              type: 'select',
              name: 'general_g3uzz5c7jx_storeName_updateStoreName',
              tooltip: 'SomeToolTipText',
              options: [
                [
                  'g3uzz5c7jx',
                  'Option1',
                ],
                [
                  'g3uzz5c7jy',
                  'Option2',
                ],
              ],
            },
          ],
        },
      ],
    },
    version: '1.15.1',
    tag: 'IO-20802',
    updateInProgress: false,
    _registeredConnectionIds: [],
    installSteps: [],
    uninstallSteps: [],
    flowGroupings: [],
    createdAt: '2017-12-11T09:15:50.903Z',
  },
];

describe('GeneralPanel UI tests', () => {
  test('should the form generated', () => {
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.integrations = integration;

    renderWithProviders(
      <MemoryRouter>
        <GeneralPanel integrationId="5a2e4cc68147dd5f5cf8d6f8" childId="g3uzz5c7jx" sectionId="SomeTitle" />
      </MemoryRouter>, {initialStore});
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Some Lable for general')).toBeInTheDocument();
    const option1 = screen.getByText('Option1');

    expect(option1).toBeInTheDocument();
    userEvent.click(option1);
    expect(screen.getByText('Option2')).toBeInTheDocument();
  });
  test('should when form sattus is loading', () => {
    const initialStore = getCreatedStore();
    const mockDispatch = jest.fn();

    jest.spyOn(reactredux, 'useDispatch').mockReturnValue(mockDispatch);

    initialStore.getState().session.integrationApps.settings['5a2e4cc68147dd5f5cf8d6f8'] = {formSaveStatus: 'loading'};

    initialStore.getState().data.resources.integrations = integration;

    renderWithProviders(
      <MemoryRouter>
        <GeneralPanel integrationId="5a2e4cc68147dd5f5cf8d6f8" childId="g3uzz5c7jx" sectionId="SomeTitle" />
      </MemoryRouter>, {initialStore});
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getAllByText('Saving...')[0]).toBeInTheDocument();
    screen.debug();
  });
});
