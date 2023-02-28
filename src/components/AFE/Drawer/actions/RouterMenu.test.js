import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RouterMenu from './RouterMenu';
import { getCreatedStore } from '../../../../store';
import {ConfirmDialogProvider} from '../../../ConfirmDialog';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import actions from '../../../../actions';

const initialStore = getCreatedStore();
const mockGoback = jest.fn();
const mockDispatch = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockGoback,
  }),
}));
jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
function initRouterMenu(props = {}) {
  const mustateState = draft => {
    draft.session.editors = {
      'router-YP3Xa6': {
        editorType: 'router',
        flowId: '63a54e63d9e20c15d94da0f1',
        resourceType: 'flows',
        resourceId: 'YP3Xa6',
        router: {
          name: '',
          routeRecordsUsing: 'input_filters',
          id: 'YP3Xa6',
          routeRecordsTo: 'all_matching_branches',
          branches: [
            {
              name: 'Branch 1.0',
              pageProcessors: [
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  type: 'import',
                  _importId: '632950280dbc53086e899759',
                  id: '632950280dbc53086e899759',
                },
              ],
            },
            {
              name: 'Branch 1.1',
              pageProcessors: [
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  setupInProgress: true,
                  id: 'new-mKSbuS',
                },
              ],
            },
          ],
          script: {
            function: 'branching',
          },
        },
        fieldId: 'router',
        routerIndex: 0,
        branchNamingIndex: 1,
        stage: 'router',
        integrationId: '63433f87ba338228f2401609',
        rule: {
          name: '',
          routeRecordsUsing: 'input_filters',
          id: 'YP3Xa6',
          routeRecordsTo: 'all_matching_branches',
          branches: [
            {
              name: 'Branch 1.0',
              pageProcessors: [
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  type: 'import',
                  _importId: '632950280dbc53086e899759',
                  id: '632950280dbc53086e899759',
                },
              ],
              inputFilter: {},
            },
            {
              name: 'Branch 1.1',
              pageProcessors: [
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  setupInProgress: true,
                  id: 'new-mKSbuS',
                },
              ],
              inputFilter: {},
            },
          ],
          script: {
            function: 'branching',
          },
          activeProcessor: 'filter',
          fetchScriptContent: true,
          entryFunction: 'branching',
        },
        editorTitle: 'Edit branching',
        isEdit: true,
        autoEvaluate: false,
        insertStubKey: 'router',
        layout: 'jsonFormBuilder',
        originalRule: {
          name: '',
          routeRecordsUsing: 'input_filters',
          id: 'YP3Xa6',
          routeRecordsTo: 'all_matching_branches',
          branches: [
            {
              name: 'Branch 1.0',
              pageProcessors: [
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  type: 'import',
                  _importId: '632950280dbc53086e899759',
                  id: '632950280dbc53086e899759',
                },
              ],
              inputFilter: {},
            },
            {
              name: 'Branch 1.1',
              pageProcessors: [
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  setupInProgress: true,
                  id: 'new-mKSbuS',
                },
              ],
              inputFilter: {},
            },
          ],
          script: {
            function: 'branching',
          },
          activeProcessor: 'filter',
          fetchScriptContent: true,
          entryFunction: 'branching',
        },
        sampleDataStatus: 'received',
        data: {
          filter: '{\n  "record": {\n    "thirdpartyacct": "thirdpartyacct",\n    "thirdpartycarrier": {\n      "internalid": "thirdpartycarrier.internalid",\n      "name": "thirdpartycarrier.name"\n    },\n }\n}',
          isInvalid: false,
        },
      }};
    draft.session.flowbuilder = {
      '63a54e63d9e20c15d94da0f1': {
        elements: [
          {
            id: '63a55e08d9e20c15d94daca9',
            type: 'pg',
            data: {
              _exportId: '63a55e08d9e20c15d94daca9',
              skipRetries: false,
              id: '63a55e08d9e20c15d94daca9',
              path: '/pageGenerators/0',
              hideDelete: false,
            },
          },
        ],
        elementsMap: {
          '63a55e08d9e20c15d94daca9': {
            id: '63a55e08d9e20c15d94daca9',
            type: 'pg',
            data: {
              _exportId: '63a55e08d9e20c15d94daca9',
              skipRetries: false,
              id: '63a55e08d9e20c15d94daca9',
              path: '/pageGenerators/0',
              hideDelete: false,
            },
          },
          '63a55e08d9e20c15d94daca9-YP3Xa6': {
            id: '63a55e08d9e20c15d94daca9-YP3Xa6',
            source: '63a55e08d9e20c15d94daca9',
            target: 'YP3Xa6',
            data: {
              path: '/routers/-1/branches/-1',
              processorIndex: 0,
            },
            type: 'default',
          },
          YP3Xa6: {
            id: 'YP3Xa6',
            type: 'router',
            data: {
              name: '',
              path: '/routers/0',
              routeRecordsTo: 'all_matching_branches',
            },
          },
          'YP3Xa6-632950280dbc53086e899759': {
            id: 'YP3Xa6-632950280dbc53086e899759',
            source: 'YP3Xa6',
            target: '632950280dbc53086e899759',
            data: {
              path: '/routers/0/branches/0',
              processorIndex: 0,
              mergableTerminals: [
                'e9FCWF',
              ],
            },
            type: 'default',
          },
          'YP3Xa6-new-mKSbuS': {
            id: 'YP3Xa6-new-mKSbuS',
            source: 'YP3Xa6',
            target: 'new-mKSbuS',
            data: {
              path: '/routers/0/branches/1',
              processorIndex: 0,
              mergableTerminals: [
                'kALLlr',
              ],
            },
            type: 'default',
          },
        },
        flow: {
          _id: '63a54e63d9e20c15d94da0f1',
          lastModified: '2022-12-27T05:30:07.242Z',
          name: 'New flow',
          disabled: true,
          _integrationId: '63433f87ba338228f2401609',
          skipRetries: false,
          pageGenerators: [
            {
              _exportId: '63a55e08d9e20c15d94daca9',
              skipRetries: false,
              id: '63a55e08d9e20c15d94daca9',
            },
          ],
          createdAt: '2022-12-23T06:44:51.204Z',
          autoResolveMatchingTraceKeys: true,
          routers: [
            {
              name: '',
              routeRecordsUsing: 'input_filters',
              id: 'YP3Xa6',
              routeRecordsTo: 'all_matching_branches',
              branches: [
                {
                  name: 'Branch 1.0',
                  pageProcessors: [
                    {
                      responseMapping: {
                        fields: [],
                        lists: [],
                      },
                      type: 'import',
                      _importId: '632950280dbc53086e899759',
                      id: '632950280dbc53086e899759',
                    },
                  ],
                },
                {
                  name: 'Branch 1.1',
                  pageProcessors: [
                    {
                      responseMapping: {
                        fields: [],
                        lists: [],
                      },
                      setupInProgress: true,
                      id: 'new-mKSbuS',
                    },
                  ],
                },
              ],
              script: {
                function: 'branching',
              },
            },
          ],
        },
        isViewMode: false,
      },
    };
    draft.session.stage = {

      '63a54e63d9e20c15d94da0f1': {
        patch: [],
      },
    };

    draft.data.resources = {
      'transfers/invited': [],
      flows: [
        {
          _id: '63a54e63d9e20c15d94da0f1',
          lastModified: '2022-12-27T05:30:07.242Z',
          name: 'New flow',
          disabled: true,
          _integrationId: '63433f87ba338228f2401609',
          skipRetries: false,
          pageGenerators: [
            {
              _exportId: '63a55e08d9e20c15d94daca9',
              skipRetries: false,
            },
          ],
          createdAt: '2022-12-23T06:44:51.204Z',
          autoResolveMatchingTraceKeys: true,
          routers: [
            {
              name: '',
              routeRecordsUsing: 'input_filters',
              id: 'YP3Xa6',
              routeRecordsTo: 'all_matching_branches',
              branches: [
                {
                  name: 'Branch 1.0',
                  pageProcessors: [
                    {
                      responseMapping: {
                        fields: [],
                        lists: [],
                      },
                      type: 'import',
                      _importId: '632950280dbc53086e899759',
                    },
                  ],
                },
                {
                  name: 'Branch 1.1',
                  pageProcessors: [
                    {
                      responseMapping: {
                        fields: [],
                        lists: [],
                      },
                      setupInProgress: true,
                    },
                  ],
                },
              ],
              script: {
                function: 'branching',
              },
            },
          ],
        },
      ],
    };
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(<ConfirmDialogProvider><RouterMenu {...props} /></ConfirmDialogProvider>, {initialStore});
}

describe('RouterMenu UI tests', () => {
  test('Should able to test the initial render with RouterMenuButton with only ellipses icon', () => {
    initRouterMenu({editorId: 'router-YP3Xa6'});
    expect(screen.queryByText('Delete branching')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  test('Should able to test MoreActionsButton with action options provided', async () => {
    initRouterMenu({editorId: 'router-YP3Xa6'});
    // for delete banching
    await userEvent.click(screen.getByRole('button'));
    const deleteOption = screen.getByRole('menuitem', {name: 'Delete branching'});

    expect(deleteOption).toBeInTheDocument();
    await userEvent.click(deleteOption);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Confirm delete')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this branching?')).toBeInTheDocument();
    expect(screen.getByText('All other branches and all steps/branching routers inside (0 configured steps, 1 unconfigured steps) will be removed.')).toBeInTheDocument();
    const Delete = screen.getByRole('button', {name: 'Delete'});
    const Cancel = screen.getByRole('button', {name: 'Cancel'});

    expect(Delete).toBeEnabled();
    expect(Cancel).toBeEnabled();
    await userEvent.click(Delete);
    expect(mockDispatch).toHaveBeenCalledWith(actions.flow.deleteRouter('63a54e63d9e20c15d94da0f1', 'YP3Xa6'));
    expect(mockGoback).toHaveBeenCalledWith();
  });
});
