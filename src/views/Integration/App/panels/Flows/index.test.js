import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Router } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { act } from 'react-dom/test-utils';
import {renderWithProviders, mockGetRequestOnce} from '../../../../../test/test-utils';
import actions from '../../../../../actions';
import { runServer } from '../../../../../test/api/server';
import FlowsPanel, {ActionsPanel, IAFormStateManager} from '.';

jest.mock('../../../../../components/ResourceFormFactory', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/ResourceFormFactory'),
  FormStateManager: props => (
    <>
      <button type="button" onClick={props.handleInitForm} data-testid="text_button">
        Form state manager button
      </button>
    </>
  ),
}));

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

const profile = {
  _id: '5ca5c855ec5c172792285f53',
  name: 'Celigo 123',
  email: 'Celigo@celigo.com',
  role: 'io-qa intern',
  company: 'Amazon Central',
  phone: '',
  auth_type_google: {},
  timezone: 'Asia/Calcutta',
  developer: true,
  allowedToPublish: true,
  agreeTOSAndPP: true,
  createdAt: '2019-04-04T09:03:18.208Z',
  useErrMgtTwoDotZero: true,
  authTypeSSO: null,
  emailHash: '1c8eb6f416e72a5499283b56f2663fe1',
};

const commonIntegration = [{
  _id: '5ff579d745ceef7dcd797c15',
  lastModified: '2021-01-19T06:34:17.222Z',
  _connectorId: 'connectorId',
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
  settings: {supportsMultiStore: false, sections: [{id: '1111111', label: '11', title: 'title1'}, {id: '2', label: '22', title: 'title2'}]},
}];

const formState = {initComplete: true};

const fieldMeta = {
  fieldMap: {
    name: {
      id: 'name',
      name: 'name',
      type: 'text',
      helpKey: 'flow.name',
      label: 'Name',
      defaultValue: 'Clone - Clone - 4. NS Blob to Zendesk(Duplicate)',
      required: true,
    },
    description: {
      id: 'description',
      name: 'description',
      type: 'text',
      helpKey: 'flow.description',
      label: 'Description',
      multiline: true,
    },
    _runNextFlowIds: {
      id: '_runNextFlowIds',
      name: '_runNextFlowIds',
      type: 'multiselect',
      placeholder: 'Please select flow',
      helpKey: 'flow._runNextFlowIds',
      label: 'Next integration flow:',
      displayEmpty: true,
      defaultValue: [],
      options: [
        {
          items: [
            {
              label: 'Basic',
              value: '608d414313f75b39c5a09fe9',
            },
            {
              label: 'New flow',
              value: '627de3c921a7a4020a50539d',
            },
          ],
        },
      ],
    },
    notifyOnFlowError: {
      id: 'notifyOnFlowError',
      name: 'notifyOnFlowError',
      type: 'radiogroup',
      defaultValue: 'false',
      options: [
        {
          items: [
            {
              value: 'true',
              label: 'Yes',
            },
            {
              value: 'false',
              label: 'No',
            },
          ],
        },
      ],
      label: 'Notify me of flow errors',
    },
    autoResolveMatchingTraceKeys: {
      id: 'autoResolveMatchingTraceKeys',
      name: 'autoResolveMatchingTraceKeys',
      type: 'radiogroup',
      defaultValue: 'true',
      options: [
        {
          items: [
            {
              value: 'true',
              label: 'Yes',
            },
            {
              value: 'false',
              label: 'No',
            },
          ],
        },
      ],
      helpKey: 'flow.autoResolveMatchingTraceKeys',
      label: 'Auto-resolve errors with matching trace key',
    },
    settings: {
      id: 'settings',
      name: 'settings',
      type: 'settings',
      label: 'Custom',
    },
  },
  layout: {
    type: 'tabIA',
    containers: [
      {
        collapsed: true,
        label: 'Label1',
        fields: [
          'name',
        ],
      },
      {
        collapsed: true,
        label: 'Label2',
        fields: [
          'name',
        ],
      },
    ],
  },
};
const layout = {
  containers: [
    {
      type: 'collapse',
      containers: [
        {
          collapsed: true,
          label: 'General',
          fields: [
            'name',
            'description',
            'notifyOnFlowError',
            'autoResolveMatchingTraceKeys',
            '_runNextFlowIds',
          ],
        },
      ],
    },
    {
      fields: [
        'settings',
      ],
    },
  ],
};

describe('Flows index file UI tests', () => {
  describe('should test AcctionsPanel', () => {
    test('should test when no action is provided', () => {
      const {utils} = renderWithProviders(<MemoryRouter><ActionsPanel actions={[]} /></MemoryRouter>);

      expect(utils.container.textContent).toBe('');
    });
    test('should test when action is provided', () => {
      renderWithProviders(<MemoryRouter><ActionsPanel actions={[{id: 'integrationsettings'}]} /></MemoryRouter>);
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Close')).toBeInTheDocument();
    });
  });

  describe('should test IAFormStateManager', () => {
    runServer();
    beforeEach(() => {
      jest.resetAllMocks();
    });
    test('should test for layout type tabia', async () => {
      renderWithProviders(
        <MemoryRouter>
          <IAFormStateManager
            integrationId="5ff579d745ceef7dcd797c15" flowId="5ea16c600e2fab71928a6152"
            onCancel={jest.fn()} fieldMeta={fieldMeta}
            formState={formState}
            isDrawer
          />
        </MemoryRouter>
      );
      const tabs = screen.getAllByRole('tab');

      await userEvent.click(tabs[0]);

      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    });

    test('should test when isDrawer is set as false and some action id is provided', async () => {
      renderWithProviders(
        <MemoryRouter>
          <IAFormStateManager
            integrationId="5ff579d745ceef7dcd797c15" flowId="5ea16c600e2fab71928a6152"
            onCancel={jest.fn()} fieldMeta={{...fieldMeta, layout, actions: [{id: 'integrationsettings'}]}}
            formState={formState}
            isDrawer={false}
          />
        </MemoryRouter>
      );
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Close')).toBeInTheDocument();
    });
    test('should test when isDrawer is set as false and no action Id is provided', async () => {
      const {utils} = renderWithProviders(
        <MemoryRouter>
          <IAFormStateManager
            integrationId="5ff579d745ceef7dcd797c15" flowId="5ea16c600e2fab71928a6152"
            onCancel={jest.fn()} fieldMeta={{...fieldMeta, layout}}
            formState={formState}
            isDrawer={false}
          />
        </MemoryRouter>
      );

      expect(utils.container.textContent).toBe('Form state manager button');
    });
    test('should test handle init form function in RegularIAForm', async () => {
      const mockDispatch = jest.fn();

      jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

      renderWithProviders(
        <MemoryRouter>
          <IAFormStateManager
            integrationId="5ff579d745ceef7dcd797c15" flowId="5ea16c600e2fab71928a6152"
            onCancel={jest.fn()} fieldMeta={{...fieldMeta, layout}}
            formState={formState}
            isDrawer
          />
        </MemoryRouter>
      );
      const handleInitbutton = screen.getByText('Form state manager button');

      await userEvent.click(handleInitbutton);
      expect(mockDispatch).toHaveBeenCalledWith(
        {flowId: '5ea16c600e2fab71928a6152',
          integrationId: '5ff579d745ceef7dcd797c15',
          sectionId: undefined,
          type: 'INTEGRATION_APPS_SETTINGS_INIT_COMPLETE'});
    });
  });

  describe('should test FlowsPanel', () => {
    runServer();
    beforeEach(() => {
      jest.resetAllMocks();
    });

    async function prepareStore(store) {
      act(() => { store.dispatch(actions.resource.requestCollection('integrations')); });
      act(() => { store.dispatch(actions.resource.requestCollection('flows')); });
      act(() => { store.dispatch(actions.resource.requestCollection('connections')); });
      act(() => { store.dispatch(actions.resource.requestCollection('exports')); });
      act(() => { store.dispatch(actions.user.profile.request()); });

      await waitFor(() => expect(store?.getState()?.data?.resources?.integrations).toBeDefined());
      await waitFor(() => expect(store?.getState()?.data?.resources?.connections).toBeDefined());
      await waitFor(() => expect(store?.getState()?.data?.resources?.exports).toBeDefined());
      await waitFor(() => expect(store?.getState()?.data?.resources?.flows).toBeDefined());
      await waitFor(() => expect(store?.getState()?.user.profile.useErrMgtTwoDotZero).toBeDefined());
    }

    test('should test the table contents', async () => {
      const mockDispatch = jest.fn();

      jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);
      mockGetRequestOnce('/api/exports', [{}]);
      mockGetRequestOnce('/api/integrations', [{
        _id: '5e9bf6c9edd8fa3230149fbd',
        lastModified: '2021-01-19T06:34:17.222Z',
        _connectorId: 'connectorId',
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
        settings: {supportsMultiStore: true,
          sections: [
            {id: '1111111',
              label: '11',
              title: 'title1',
              sections: [{id: 'someID',
                title: 'somesectionId',
                flows: [
                  {
                    _id: '5ea16c600e2fab71928a6152',
                    lastModified: '2021-08-13T08:02:49.712Z',
                    name: ' Bulk insert with harcode and mulfield mapping settings',
                    disabled: true,
                    _integrationId: '5e9bf6c9edd8fa3230149fbd',
                    skipRetries: false,
                    pageProcessors: [
                      {
                        responseMapping: {
                          fields: [],
                          lists: [],
                        },
                        type: 'import',
                        _importId: '5ea16cd30e2fab71928a6166',
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
                  },
                ],
              }]},
            {id: '2', label: '22', title: 'title2'}]},
      }]);
      mockGetRequestOnce('/api/profile', profile);
      const {store} = renderWithProviders(
        <MemoryRouter initialEntries={['/somesectionId']}>
          <Route path="/:sectionId/">
            <FlowsPanel
              integrationId="5e9bf6c9edd8fa3230149fbd" childId="1111111"
          />
          </Route>
        </MemoryRouter>
      );

      await prepareStore(store);

      const row = screen.getAllByRole('row');

      expect(row[0].textContent).toBe('NameErrorsLast updatedLast runMappingScheduleSettingsRunOff/OnActions');
      expect(row[1].textContent).toBe(' Bulk insert with harcode and mulfield mapping settingsSuccess08/13/2021 8:02:49 am04/23/2020 11:08:41 am');
    });
    test('should test all the use-efftects function', async () => {
      const mockDispatch = jest.fn();

      jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);
      const history = createMemoryHistory();

      history.replace = jest.fn();
      mockGetRequestOnce('/api/exports', [{}]);
      mockGetRequestOnce('/api/integrations', commonIntegration);
      mockGetRequestOnce('/api/profile', profile);
      const {store} = renderWithProviders(
        <Router history={history}>
          <FlowsPanel
            integrationId="5ff579d745ceef7dcd797c15" childId="1111111"
          />
        </Router>
      );

      await prepareStore(store);
      expect(screen.getByText('title1')).toBeInTheDocument();
      expect(screen.getByText('title2')).toBeInTheDocument();
      expect(history.replace).toHaveBeenCalledWith('//sections/title1');
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'INTEGRATION_LATEST_JOBS_REQUEST_FOR_POLL',
        integrationId: '5ff579d745ceef7dcd797c15',
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'INTEGRATION_ERRORS_REQUEST_FOR_POLL',
        integrationId: '5ff579d745ceef7dcd797c15',
      });
    });
  });
});
