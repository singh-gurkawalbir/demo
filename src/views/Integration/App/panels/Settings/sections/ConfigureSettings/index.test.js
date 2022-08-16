/* global describe, test, expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import * as reactredux from 'react-redux';
import { renderWithProviders} from '../../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../../store';
import ConfigureSettings from './index';

jest.mock('../../../../../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../../../components/LoadResources'),
  default: props => <div>{props.children}</div>,
}));

const integration = [{
  _id: '5a2e4cc68147dd5f5cf8d6f8',
  name: 'BigCommerce - NetSuite',
  settings: {
    sections: [
      {
        shopInstallComplete: 'true',
        title: 'QA_Store',
        id: 'someChildId',
        sections: [
          {
            title: 'SomeTitle',
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
                label: 'SomeLabel',
                required: true,
                value: '79256',
                type: 'select',
                name: 'exports_5de513a00bce564542847e2e_savedSearch_listSavedSearches',
                supportsRefresh: true,
                options: [
                  [
                    '79256',
                    'SomeOption1',
                  ],
                  [
                    '79257',
                    'SomeOption2',
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
  },
}];

describe('ConfigureSettings UI tests', () => {
  test('should test the form based on field provided', () => {
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.integrations = integration;

    renderWithProviders(
      <MemoryRouter>
        <ConfigureSettings integrationId="5a2e4cc68147dd5f5cf8d6f8" childId="someChildId" sectionId="SomeTitle" />
      </MemoryRouter>, {initialStore});
    expect(screen.getByText('SomeLabel')).toBeInTheDocument();
    const option1 = screen.getByText('SomeOption1');

    expect(option1).toBeInTheDocument();
    userEvent.click(option1);
    expect(screen.getByText('SomeOption2')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
  test('should test when thqewdee form status is loading ', () => {
    const initialStore = getCreatedStore();
    const mockDispatch = jest.fn();

    jest.spyOn(reactredux, 'useDispatch').mockReturnValue(mockDispatch);

    initialStore.getState().session.integrationApps.settings['5a2e4cc68147dd5f5cf8d6f8-SomeTitle'] = {formSaveStatus: 'loading'};

    initialStore.getState().data.resources.integrations = integration;

    renderWithProviders(
      <MemoryRouter>
        <ConfigureSettings integrationId="5a2e4cc68147dd5f5cf8d6f8" childId="someChildId" sectionId="SomeTitle" />
      </MemoryRouter>, {initialStore});

    expect(screen.getAllByText('Saving...')[0]).toBeInTheDocument();
  });
});
