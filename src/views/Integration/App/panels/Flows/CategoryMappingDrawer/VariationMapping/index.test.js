import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders} from '../../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../../store';
import VariationMappingDrawerRoute from '.';

jest.mock('../../../../../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../../../components/LoadResources'),
  default: props => <div>{props.children}</div>,
}));

const mockDispatch = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('VariationMappingDrawerRoute UI tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  function initStoreAndRender(settings) {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.integrations = [{
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
      }];
      draft.data.resources.flows = [{
        _id: '5ea16c600e2fab71928a6152',
        lastModified: '2021-08-13T08:02:49.712Z',
        name: 'Name of the flow',
        disabled: true,
        _integrationId: '5ff579d745ceef7dcd797c15',
        skipRetries: false,
        pageProcessors: [
          {
            responseMapping: {
              fields: [],
              lists: [],
            },
            type: 'import',
            _importId: '5ac5e4d706bd2615df9fba44',
          },
        ],
        pageGenerators: [
          {
            _exportId: '5d00b9f0bcd64414811b2396',
          },
        ],
        createdAt: '2020-04-23T10:22:24.290Z',
        lastExecutedAt: '2020-04-23T11:08:41.093Z',
        autoResolveMatchingTraceKeys: true,
      }];
      draft.session.integrationApps.settings['5ea16c600e2fab71928a6152-5ff579d745ceef7dcd797c15'] = settings;
    });

    renderWithProviders(
      <MemoryRouter initialEntries={['/integrations/5ff579d745ceef7dcd797c15/depth/5/variations/subCategoryId/variation']}>
        <Route path="/integrations/:integrationsId">
          <VariationMappingDrawerRoute
            integrationId="5ff579d745ceef7dcd797c15" flowId="5ea16c600e2fab71928a6152"
            categoryId="categoryId"
          />
        </Route>
      </MemoryRouter>,
      {initialStore}
    );
  }
  test('should test when deta is not loaded', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/integrations/5ff579d745ceef7dcd797c15/depth/5/variations/subCategoryId/variation']}>
        <Route path="/integrations/:integrationsId">
          <VariationMappingDrawerRoute
            integrationId="1234" flowId="flowId"
            categoryId="categoryId"
          />
        </Route>
      </MemoryRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should test save button', async () => {
    initStoreAndRender(
      {
        saveStatus: 'saved',
        deleted: [['categoryId']],
        collapseStatus: {collapseStatus: 'expanded'},
        response: [
          { operation: 'mappingData',
            data: {
              mappingData: {
                basicMappings: {
                  recordMappings: [{
                    id: 'categoryId',
                  },
                  ],
                },
              },
            },
          }],
      }
    );

    const savebutton = screen.getByText('Save');

    await userEvent.click(savebutton);

    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_SAVE_VARIATION_MAPPINGS',
        integrationId: '5ff579d745ceef7dcd797c15',
        flowId: '5ea16c600e2fab71928a6152',
        id: '5ea16c600e2fab71928a6152-subCategoryId-5-variation',
        data: {
          categoryId: 'categoryId',
          subCategoryId: 'subCategoryId',
          isVariationAttributes: false,
          depth: '5',
        },
      }
    );
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/5ff579d745ceef7dcd797c15');
  });
  test('should test close button', async () => {
    initStoreAndRender(
      {
        saveStatus: 'saved',
        deleted: [['categoryId']],
        collapseStatus: {collapseStatus: 'expanded'},
        response: [
          { operation: 'mappingData',
            data: {
              mappingData: {
                basicMappings: {
                  recordMappings: [{
                    id: 'categoryId',
                  },
                  ],
                },
              },
            },
          }],
      }
    );
    const closebutton = screen.getByText('Close');

    await userEvent.click(closebutton);

    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_CLEAR_VARIATION_MAPPINGS',
        integrationId: '5ff579d745ceef7dcd797c15',
        flowId: '5ea16c600e2fab71928a6152',
        id: '5ea16c600e2fab71928a6152-subCategoryId-5-variation',
      }
    );
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/5ff579d745ceef7dcd797c15');
  });
  test('should test close when variation atrributes is provided', async () => {
    initStoreAndRender(
      {
        saveStatus: 'saved',
        deleted: [['categoryId']],
        collapseStatus: {collapseStatus: 'expanded'},
        generatesMetadata: [{
          id: 'subCategoryId',
          variation_attributes: [{id: 'variation_theme', variation_attributes: ['attribute']}],
          variation_themes: [{id: 'variation_theme', variation_attributes: ['attribute']}],
        }],
        response: [
          { operation: 'mappingData',
            data: {
              mappingData: {
                basicMappings: {
                  recordMappings: [{
                    id: 'categoryId',
                  },
                  ],
                },
              },
            },
          }],
      }
    );

    const closebutton = screen.getByText('Close');

    await userEvent.click(closebutton);

    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_CLEAR_VARIATION_MAPPINGS',
        integrationId: '5ff579d745ceef7dcd797c15',
        flowId: '5ea16c600e2fab71928a6152',
        id: '5ea16c600e2fab71928a6152-subCategoryId-5-variation',
      }
    );
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/5ff579d745ceef7dcd797c15');
  });
});
