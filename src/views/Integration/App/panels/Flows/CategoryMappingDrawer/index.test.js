import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders} from '../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../store';
import CategoryMappingDrawerRoute from '.';

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

jest.mock('../../../../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../../components/LoadResources'),
  default: props => <div>{props.children}</div>,
}));

describe('CategoryMappingDrawerRoute UI tests', () => {
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
      <MemoryRouter initialEntries={['/integrations/5ff579d745ceef7dcd797c15/5ea16c600e2fab71928a6152/utilitymapping/categoryId']}>
        <Route path="/integrations/:integrationId">
          <CategoryMappingDrawerRoute integrationId="5ff579d745ceef7dcd797c15" />
        </Route>
      </MemoryRouter>, {initialStore});
  }
  test('should test dispatch call made by use effect of InitializationComponent', () => {
    initStoreAndRender();
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'INTEGRATION_APPS_SETTINGS_REQUEST_CATEGORY_MAPPING_METADATA',
        integrationId: '5ff579d745ceef7dcd797c15',
        flowId: '5ea16c600e2fab71928a6152',
        categoryId: 'categoryId',
        options: undefined,
      }
    );
  });
  test('should test InitializationComp when metadata true', () => {
    initStoreAndRender(
      {
        filters: {attributes: {required: true}},
      });

    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/5ff579d745ceef7dcd797c15/5ea16c600e2fab71928a6152/utilitymapping/commonAttributes');
  });

  test('InitializationComp testing mapping save status close', () => {
    initStoreAndRender(
      {
        saveStatus: 'close',
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

    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/5ff579d745ceef7dcd797c15');
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_CLEAR',
        integrationId: '5ff579d745ceef7dcd797c15',
        flowId: '5ea16c600e2fab71928a6152',
      }
    );
  });
  test('InitializationComp testing mapping save status saved and category deleted', () => {
    initStoreAndRender(
      {
        saveStatus: 'saved',
        deleted: [['categoryId']],
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

    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/5ff579d745ceef7dcd797c15/5ea16c600e2fab71928a6152/utilitymapping/commonAttributes');
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_CLEAR_SAVE_STATUS',
        integrationId: '5ff579d745ceef7dcd797c15',
        flowId: '5ea16c600e2fab71928a6152',
      }
    );
  });
  test('should click on the expand all button', async () => {
    initStoreAndRender(
      {
        saveStatus: 'saved',
        deleted: [['categoryId']],
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

    expect(screen.getByText('NetSuite')).toBeInTheDocument();
    const expandbutton = screen.getByText('Expand All');

    await userEvent.click(expandbutton);

    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'INTEGRATION_APPS_CATEGORY_MAPPINGS_EXPAND_ALL',
        integrationId: '5ff579d745ceef7dcd797c15',
        flowId: '5ea16c600e2fab71928a6152',
      }
    );
  });
  test('should click on the collapse all button', async () => {
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

    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/5ff579d745ceef7dcd797c15/5ea16c600e2fab71928a6152/utilitymapping/commonAttributes');
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_CLEAR_SAVE_STATUS',
        integrationId: '5ff579d745ceef7dcd797c15',
        flowId: '5ea16c600e2fab71928a6152',
      }
    );
    expect(screen.getByText('NetSuite')).toBeInTheDocument();

    const collapseAll = screen.getByText('Collapse All');

    await userEvent.click(collapseAll);

    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'INTEGRATION_APPS_CATEGORY_MAPPINGS_COLLAPSE_ALL',
        integrationId: '5ff579d745ceef7dcd797c15',
        flowId: '5ea16c600e2fab71928a6152',
      }
    );
  });
  test('should test when CategoryMappingContent is loading', () => {
    initStoreAndRender();

    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should click on save button', async () => {
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

    const save = screen.getByText('Save');

    await userEvent.click(save);
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_SAVE',
        integrationId: '5ff579d745ceef7dcd797c15',
        flowId: '5ea16c600e2fab71928a6152',
        closeOnSave: undefined,
      }
    );
  });
  test('shoudl click on Save & close button', async () => {
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

    const close = screen.getByText('Save & close');

    await userEvent.click(close);

    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_CLEAR',
        integrationId: '5ff579d745ceef7dcd797c15',
        flowId: '5ea16c600e2fab71928a6152',
      }
    );
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/5ff579d745ceef7dcd797c15');
  });
  test('should click on restore and hide categories button', async () => {
    initStoreAndRender(
      {
        saveStatus: 'saved',
        deleted: [['categoryId']],
        collapseStatus: {collapseStatus: 'expanded'},
        generatesMetadata: [{
          id: 'categoryId',
          fields: [],
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

    await userEvent.click(screen.getByLabelText('Hide categories'));
    expect(screen.getByLabelText('Enable categories')).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('Restore category'));

    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_RESTORE_CATEGORY',
        integrationId: '5ff579d745ceef7dcd797c15',
        flowId: '5ea16c600e2fab71928a6152',
        sectionId: 'categoryId',
        depth: 0,
      }
    );
  });
  test('should test the Configure variation button', async () => {
    initStoreAndRender(
      {
        saveStatus: 'saved',
        collapseStatus: {collapseStatus: 'expanded'},
        generatesMetadata: [{
          id: 'categoryId',
          fields: [],
          variation_attributes: ['attribute'],
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

    await userEvent.click(screen.getAllByLabelText('Configure variations')[0]);
    expect(mockHistoryPush).toHaveBeenCalledWith(
      '/integrations/5ff579d745ceef7dcd797c15/5ea16c600e2fab71928a6152/utilitymapping/categoryId/depth/0/variations/categoryId'
    );
  });
  test('should click on Delete category button', async () => {
    initStoreAndRender(
      {
        saveStatus: 'saved',
        collapseStatus: {collapseStatus: 'expanded'},
        generatesMetadata: [{
          id: 'categoryId',
          fields: [],
          variation_attributes: ['attribute'],
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

    await userEvent.click(screen.getByLabelText('Delete category'));

    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_DELETE_CATEGORY',
        integrationId: '5ff579d745ceef7dcd797c15',
        flowId: '5ea16c600e2fab71928a6152',
        sectionId: 'categoryId',
        depth: 0,
      }
    );
  });
});

