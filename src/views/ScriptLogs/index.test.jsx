/* eslint-disable jest/max-expects */
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import moment from 'moment';
import ScriptLogs from '.';
import { renderWithProviders } from '../../test/test-utils';
import actions from '../../actions';
import { runServer } from '../../test/api/server';
import { getCreatedStore } from '../../store';

let initialStore;
const integrations = [{
  _id: '62e59dbf76ce554057c07abc',
  lastModified: '2022-08-10T14:15:32.569Z',
  name: 'test integration',
  description: 'test description',
  readme: 'test',
  install: [],
  mode: 'settings',
  sandbox: false,
  _registeredConnectionIds: [
    '5d4017fb5663022451fdf1ad',
    '5f573f1a87fe9d2ebedd30e5',
  ],
  _templateId: '5c261974e53d9a2ecf6adabc',
  installSteps: [
    {
      name: 'NetSuite Connection',
      completed: true,
      type: 'connection',
      sourceConnection: {
        type: 'netsuite',
        name: 'NetSuite Connection',
      },
    },
    {
      name: 'Salesforce Connection',
      completed: true,
      type: 'connection',
      sourceConnection: {
        type: 'salesforce',
        name: 'Salesforce Connection',
      },
    },
    {
      name: 'Integrator Bundle',
      description: 'Please install Integrator bundle in NetSuite account',
      completed: true,
      type: 'url',
      url: 'https://tstdrv1934805.app.netsuite.com/app/bundler/bundledetails.nl?sourcecompanyid=TSTDRV916910&domain=PRODUCTION&config=F&id=20038',
    },
    {
      name: 'Integrator Adaptor Package',
      description: 'Please install Integrator bundle in Salesforce account',
      completed: true,
      type: 'url',
      url: 'https://login.salesforce.com/packaging/installPackage.apexp?p0=04t3m000000Q89d',
    },
    {
      name: 'Copy resources now from template zip',
      completed: true,
      type: 'template_zip',
      templateZip: true,
      isClone: true,
    },
  ],
  uninstallSteps: [],
  flowGroupings: [],
  createdAt: '2022-07-30T21:08:16.091Z',
  _sourceId: '619249e805f85b2022e08abc',
}];
const flows = [
  {
    _id: '62e59e1176ce554057c07abc',
    lastModified: '2022-08-10T14:16:03.999Z',
    name: 'Test Flow',
    description: 'Test flow description',
    disabled: false,
    _integrationId: '62e59dbf76ce554057c07abc',
    skipRetries: false,
    pageProcessors: [
      {
        responseMapping: {
          fields: [

          ],
          lists: [

          ],
        },
        type: 'import',
        _importId: '5f86981618101578f8aceabc',
      },
    ],
    pageGenerators: [
      {
        _exportId: '62e59e0c76ce554057c07abc',
      },
    ],
    createdAt: '2022-07-30T21:09:37.376Z',
    free: false,
    _templateId: '5c261974e53d9a2ecf6adabc',
    _sourceId: '61924a4aaba738048023cabc',
    wizardState: 'done',
    lastExecutedAt: '2022-08-10T14:32:37.026Z',
    autoResolveMatchingTraceKeys: true,
  },
];
const scripts = [
  {
    _id: '62e59df376ce554057c07abc',
    lastModified: '2022-08-10T14:31:47.113Z',
    createdAt: '2022-07-30T21:09:07.396Z',
    name: 'Test Script',
    description: '',
    debugUntil: '2022-08-10T15:31:46.882Z',
    _sourceId: '61924a2caba738048023cabc',
    content: "function preSavePageFunction (options) {\n  var d = options.data;\n   for(var i = 0; i < d.length; i++){\n     var a = d[i].Attachments;\n     for(var j = 0; j < a.length; j++){\n       var n = a[j].Name;\n       var types = n.split(\".\");\n       var ty = types[1];\n       if(ty == 'PNG' || ty == 'png'){\n         a[j].content = \"image/png\";\n       }\n       else if(ty == 'jpg'){\n         a[j].content = \"image/jpeg\";\n       }\n       else if(ty == 'gif'){\n         a[j].content = \"image/gif\";\n       }\n       else if(ty == 'css'){\n         a[j].content = \"text/css\";\n       }\n       else if(ty == 'csv'){\n         a[j].content = \"text/csv\";\n       }\n       else if(ty == 'html'){\n         a[j].content = \"text/html\";\n       }\n       else if(ty == 'txt'){\n         a[j].content = \"text/plain\";\n       }\n       else if(ty == 'mp4'){\n         a[j].content = \"video/mp4\";\n       }\n     }\n   }\n  return {\n    data: options.data,\n    errors: options.errors\n  }\n}",
  },
];
const exports = [
  {
    _id: '62e59e0c76ce554057c07abc',
    createdAt: '2022-07-30T21:09:32.545Z',
    lastModified: '2022-08-10T09:25:21.236Z',
    name: 'Test Export',
    description: 'Test description',
    _connectionId: '5d4017fb5663022451fdfabc',
    _sourceId: '61924a46aba738048023cabc',
    apiIdentifier: 'e09281357a',
    asynchronous: true,
    type: 'delta',
    hooks: {
      preSavePage: {
        function: 'preSavePageFunction',
        _scriptId: '62e59df376ce554057c07abc',
      },
    },
    oneToMany: false,
    _templateId: '5c261974e53d9a2ecf6adabc',
    rawData: '5d4010e14cd24a7c773122ef73b2d2a40176444e8433f2bdfea2aceb',
    delta: {
      dateField: 'createddate',
    },
    netsuite: {
      type: 'restlet',
      skipGrouping: false,
      statsOnly: false,
      restlet: {
        recordType: 'task',
        searchId: '7724',
        useSS2Restlets: false,
      },
      distributed: {
        useSS2Framework: false,
      },
    },
    transform: {
      type: 'expression',
      expression: {
        rules: [
          [
            {
              extract: '*.id',
              generate: 'id',
            },
            {
              extract: '*.recordType',
              generate: 'recordType',
            },
            {
              extract: '*.[Internal ID]',
              generate: 'Internal ID',
            },
            {
              extract: '*.Insert',
              generate: 'Insert',
            },
            {
              extract: '*.[Task Title]',
              generate: 'Task Title',
            },
            {
              extract: '*.Priority',
              generate: 'Priority',
            },
            {
              extract: '*.Status',
              generate: 'Status',
            },
            {
              extract: '*.[Start Date]',
              generate: 'Start Date',
            },
            {
              extract: '*.[Due Date]',
              generate: 'Due Date',
            },
            {
              extract: '*.Private',
              generate: 'Private',
            },
            {
              extract: '*.[Assigned To]',
              generate: 'Assigned To',
            },
            {
              extract: '*.Company',
              generate: 'Company',
            },
            {
              extract: '*.Comment',
              generate: 'Comment',
            },
            {
              extract: '*.SFNSIO_Task_ID',
              generate: 'SFNSIO_Task_ID',
            },
            {
              extract: '*.OpportuniyId',
              generate: 'OpportuniyId',
            },
            {
              extract: '*.File_Name',
              generate: 'Attachments[*].Name',
            },
            {
              extract: '*.File_Internal_ID',
              generate: 'Attachments[*].File_Internal_ID',
            },
          ],
        ],
        version: '1',
      },
      version: '1',
      rules: [
        [
          {
            extract: '*.id',
            generate: 'id',
          },
        ],
      ],
    },
    filter: {
      type: 'expression',
      expression: {
        version: '1',
      },
      version: '1',
    },
    inputFilter: {
      type: 'expression',
      expression: {
        version: '1',
      },
      version: '1',
    },
    adaptorType: 'NetSuiteExport',
  },
];

const profile = {
  _id: '5d4010e14cd24a7c77312abc',
  name: 'Test User',
  email: 'testuser@celigo.com',
  role: '',
  company: 'test',
  phone: '1234567890',
  auth_type_google: {},
  timezone: 'Asia/Calcutta',
  developer: true,
  allowedToPublish: true,
  agreeTOSAndPP: true,
  createdAt: '2019-07-30T09:41:54.435Z',
  useErrMgtTwoDotZero: false,
  authTypeSSO: null,
  emailHash: '8a859a6cc8996b65d364a1ce1e7a3820',
};

function store(sessionLogs) {
  initialStore.getState().data.resources.integrations = integrations;
  initialStore.getState().data.resources.flows = flows;
  initialStore.getState().data.resources.scripts = scripts;
  initialStore.getState().data.resources.exports = exports;
  initialStore.getState().session.logs = sessionLogs;
  initialStore.getState().user.profile = profile;
}

async function initScriptLogs(props) {
  const ui = (
    <MemoryRouter>
      <Route>
        <ScriptLogs {...props} />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}
describe('script logs', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;
  const mockDate = new Date('2022-08-13');
  let dateSpy;

  beforeEach(done => {
    initialStore = getCreatedStore();
    jest.useFakeTimers();
    jest.setTimeout(100000);
    dateSpy = jest.spyOn(global.Date, 'now').mockImplementation(() => mockDate);
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    jest.clearAllMocks();
    done();
  });
  afterEach(async () => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllTimers();
    dateSpy.mockRestore();
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    cleanup();
  });

  test('should able to test the run now button', async () => {
    store({});
    await initScriptLogs({
      flowId: '62e59e1176ce554057c07abc',
      scriptId: '62e59df376ce554057c07abc',
    });
    const runNode = screen.getByText('Run now');

    expect(runNode).toBeInTheDocument();
  });
  test('should able to test the start debug button', async () => {
    store({});
    await initScriptLogs({
      flowId: '62e59e1176ce554057c07abc',
      scriptId: '62e59df376ce554057c07abc',
    });
    const startDebugButton = screen.getByText('Start debug');

    expect(startDebugButton).toBeInTheDocument();
  });
  test('should able to test the today date range select button', async () => {
    store({});
    await initScriptLogs({
      flowId: '62e59e1176ce554057c07abc',
      scriptId: '62e59df376ce554057c07abc',
    });

    const last15ButtonNode = screen.queryByRole('button', { name: 'Last 15 minutes' });

    expect(last15ButtonNode).toBeInTheDocument();
    userEvent.click(last15ButtonNode);

    const applyButtonNode = screen.queryByRole('button', { name: 'Apply' });

    expect(applyButtonNode).toBeInTheDocument();
    const clearButtonNode = screen.queryByRole('button', { name: 'Clear' });

    expect(clearButtonNode).toBeInTheDocument();
    const cancelButtonNode = screen.queryByRole('button', { name: 'Cancel' });

    expect(cancelButtonNode).toBeInTheDocument();
    const todayButtonNode = screen.queryByRole('button', { name: 'Today' });

    expect(todayButtonNode).toBeInTheDocument();
    userEvent.click(todayButtonNode);
    userEvent.click(applyButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.scripts.patchFilter({
      scriptId: '62e59df376ce554057c07abc',
      flowId: '62e59e1176ce554057c07abc',
      field: 'dateRange',
      value: {
        endDate: null,
        preset: 'today',
        startDate: moment(new Date('2022-08-13')).startOf('day').toDate(),
      },
    }));
    expect(applyButtonNode).not.toBeInTheDocument();
  }, 30000);
  test('should able to test the last 15 minutes date range select button with no execution logs', async () => {
    store({});
    await initScriptLogs({
      flowId: '62e59e1176ce554057c07abc',
      scriptId: '62e59df376ce554057c07abc',
    });

    const last15ButtonNode = screen.queryByRole('button', { name: 'Last 15 minutes' });

    expect(last15ButtonNode).toBeInTheDocument();
    userEvent.click(last15ButtonNode);

    const applyButtonNode = screen.queryByRole('button', { name: 'Apply' });

    expect(applyButtonNode).toBeInTheDocument();
    const clearButtonNode = screen.queryByRole('button', { name: 'Clear' });

    expect(clearButtonNode).toBeInTheDocument();
    const cancelButtonNode = screen.queryByRole('button', { name: 'Cancel' });

    expect(cancelButtonNode).toBeInTheDocument();
    userEvent.click(applyButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.scripts.patchFilter({
      scriptId: '62e59df376ce554057c07abc',
      flowId: '62e59e1176ce554057c07abc',
      field: 'dateRange',
      value: {
        endDate: null,
        preset: 'last15minutes',
        startDate: moment(new Date('2022-08-13')).subtract(15, 'minutes').toDate(),
      },
    }));
    expect(applyButtonNode).not.toBeInTheDocument();
  }, 30000);
  test('should able to test the last 24 hours date range select button', async () => {
    store({});
    await initScriptLogs({
      flowId: '62e59e1176ce554057c07abc',
      scriptId: '62e59df376ce554057c07abc',
    });

    const last15ButtonNode = screen.queryByRole('button', { name: 'Last 15 minutes' });

    expect(last15ButtonNode).toBeInTheDocument();
    userEvent.click(last15ButtonNode);

    const applyButtonNode = screen.queryByRole('button', { name: 'Apply' });

    expect(applyButtonNode).toBeInTheDocument();
    const clearButtonNode = screen.queryByRole('button', { name: 'Clear' });

    expect(clearButtonNode).toBeInTheDocument();
    const cancelButtonNode = screen.queryByRole('button', { name: 'Cancel' });

    expect(cancelButtonNode).toBeInTheDocument();
    const last24HoursButtonNode = screen.queryByRole('button', { name: 'Last 24 hours' });

    expect(last24HoursButtonNode).toBeInTheDocument();
    userEvent.click(last24HoursButtonNode);
    userEvent.click(applyButtonNode);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.scripts.patchFilter({
      scriptId: '62e59df376ce554057c07abc',
      flowId: '62e59e1176ce554057c07abc',
      field: 'dateRange',
      value: {
        endDate: null,
        preset: 'last24hours',
        startDate: moment(new Date('2022-08-13')).subtract(24, 'hours').toDate(),
      },
    })));
    expect(applyButtonNode).not.toBeInTheDocument();
  }, 30000);
  test('should able to test the last 30 minutes date range select button', async () => {
    store({});
    await initScriptLogs({
      flowId: '62e59e1176ce554057c07abc',
      scriptId: '62e59df376ce554057c07abc',
    });

    const last15ButtonNode = screen.queryByRole('button', { name: 'Last 15 minutes' });

    expect(last15ButtonNode).toBeInTheDocument();
    userEvent.click(last15ButtonNode);

    const applyButtonNode = screen.queryByRole('button', { name: 'Apply' });

    expect(applyButtonNode).toBeInTheDocument();
    const clearButtonNode = screen.queryByRole('button', { name: 'Clear' });

    expect(clearButtonNode).toBeInTheDocument();
    const cancelButtonNode = screen.queryByRole('button', { name: 'Cancel' });

    expect(cancelButtonNode).toBeInTheDocument();
    const last30minutesButtonNode = screen.queryByRole('button', { name: 'Last 30 minutes' });

    expect(last30minutesButtonNode).toBeInTheDocument();
    userEvent.click(last30minutesButtonNode);
    userEvent.click(applyButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.scripts.patchFilter({
      scriptId: '62e59df376ce554057c07abc',
      flowId: '62e59e1176ce554057c07abc',
      field: 'dateRange',
      value: {
        endDate: null,
        preset: 'last30minutes',
        startDate: moment(new Date('2022-08-13')).subtract(30, 'minutes').toDate(),
      },
    }));
    expect(applyButtonNode).not.toBeInTheDocument();
  }, 30000);
  test('should able to test the last hour date range select button', async () => {
    store({});
    await initScriptLogs({
      flowId: '62e59e1176ce554057c07abc',
      scriptId: '62e59df376ce554057c07abc',
    });

    const last15ButtonNode = screen.queryByRole('button', { name: 'Last 15 minutes' });

    expect(last15ButtonNode).toBeInTheDocument();
    userEvent.click(last15ButtonNode);

    const applyButtonNode = screen.queryByRole('button', { name: 'Apply' });

    expect(applyButtonNode).toBeInTheDocument();
    const clearButtonNode = screen.queryByRole('button', { name: 'Clear' });

    expect(clearButtonNode).toBeInTheDocument();
    const cancelButtonNode = screen.queryByRole('button', { name: 'Cancel' });

    expect(cancelButtonNode).toBeInTheDocument();
    const lastHourButtonNode = screen.queryByRole('button', { name: 'Last hour' });

    expect(lastHourButtonNode).toBeInTheDocument();
    userEvent.click(lastHourButtonNode);
    userEvent.click(applyButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.scripts.patchFilter({
      scriptId: '62e59df376ce554057c07abc',
      flowId: '62e59e1176ce554057c07abc',
      field: 'dateRange',
      value: {
        endDate: null,
        preset: 'last1hour',
        startDate: moment(new Date('2022-08-13')).subtract(1, 'hours').toDate(),
      },
    }));
    expect(applyButtonNode).not.toBeInTheDocument();
  }, 30000);
  test('should able to test the yesterday date range select button', async () => {
    store({});
    await initScriptLogs({
      flowId: '62e59e1176ce554057c07abc',
      scriptId: '62e59df376ce554057c07abc',
    });

    const last15ButtonNode = screen.queryByRole('button', { name: 'Last 15 minutes' });

    expect(last15ButtonNode).toBeInTheDocument();
    userEvent.click(last15ButtonNode);

    const applyButtonNode = screen.queryByRole('button', { name: 'Apply' });

    expect(applyButtonNode).toBeInTheDocument();
    const clearButtonNode = screen.queryByRole('button', { name: 'Clear' });

    expect(clearButtonNode).toBeInTheDocument();
    const cancelButtonNode = screen.queryByRole('button', { name: 'Cancel' });

    expect(cancelButtonNode).toBeInTheDocument();
    const yesterdayButtonNode = screen.queryByRole('button', { name: 'Yesterday' });

    expect(yesterdayButtonNode).toBeInTheDocument();
    userEvent.click(yesterdayButtonNode);
    userEvent.click(applyButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.scripts.patchFilter({
      scriptId: '62e59df376ce554057c07abc',
      flowId: '62e59e1176ce554057c07abc',
      field: 'dateRange',
      value: {
        endDate: moment(new Date('2022-08-13')).subtract(1, 'days').endOf('day').toDate(),
        preset: 'yesterday',
        startDate: moment(new Date('2022-08-13')).subtract(1, 'days').startOf('day').toDate(),
      },
    }));
    expect(applyButtonNode).not.toBeInTheDocument();
  }, 30000);
  test('should able to test the last 4 hours date range select button', async () => {
    store({});
    await initScriptLogs({
      flowId: '62e59e1176ce554057c07abc',
      scriptId: '62e59df376ce554057c07abc',
      logs: [],
    });

    const last15ButtonNode = screen.queryByRole('button', { name: 'Last 15 minutes' });

    expect(last15ButtonNode).toBeInTheDocument();
    userEvent.click(last15ButtonNode);

    const applyButtonNode = screen.queryByRole('button', { name: 'Apply' });

    expect(applyButtonNode).toBeInTheDocument();
    const clearButtonNode = screen.queryByRole('button', { name: 'Clear' });

    expect(clearButtonNode).toBeInTheDocument();
    const cancelButtonNode = screen.queryByRole('button', { name: 'Cancel' });

    expect(cancelButtonNode).toBeInTheDocument();
    const last4HoursButtonNode = screen.queryByRole('button', { name: 'Last 4 hours' });

    expect(last4HoursButtonNode).toBeInTheDocument();
    userEvent.click(last4HoursButtonNode);
    userEvent.click(applyButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.scripts.patchFilter({
      scriptId: '62e59df376ce554057c07abc',
      flowId: '62e59e1176ce554057c07abc',
      field: 'dateRange',
      value: {
        endDate: null,
        preset: 'last4hours',
        startDate: moment(new Date('2022-08-13')).subtract(4, 'hours').toDate(),
      },
    }));
    expect(applyButtonNode).not.toBeInTheDocument();
  }, 30000);
  test('should able to test the step button drop-down by selecting a flow', async () => {
    store({
      connections: {},
      scripts: {
        scripts: {
          '62e59df376ce554057c07abc-62e59e1176ce554057c07abc': {
            scriptId: '62e59df376ce554057c07abc',
            flowId: '62e59e1176ce554057c07abc',
            dateRange: {
              startDate: new Date('2022-08-13'),
              preset: 'last15minutes',
            },
            resourceReferences: [
              {
                type: 'export',
                id: '62e59e0c76ce554057c07abc',
                name: 'Test Export',
              },
              {
                type: 'flow',
                id: '62e59e1176ce554057c07abc',
                name: 'Test Flow',
              },
              {
                type: 'integration',
                id: '62e59dbf76ce554057c07abc',
                name: 'Test Integration',
              },
            ],
            status: 'requested',
          },
        },
      },
      flowStep: {},
    });
    await initScriptLogs({
      flowId: '62e59e1176ce554057c07abc',
      scriptId: '62e59df376ce554057c07abc',
    });

    const stepDropDownNode = screen.getByRole('button', { name: 'Step' });

    expect(stepDropDownNode).toBeInTheDocument();
    userEvent.click(stepDropDownNode);
    const typeCheckBoxNode = screen.getByRole('checkbox', {name: 'Type'});

    expect(typeCheckBoxNode).toBeInTheDocument();
    const exportCheckBoxNode = screen.getByRole('checkbox', {name: 'export'});

    expect(exportCheckBoxNode).toBeInTheDocument();
    const flowCheckBoxNode = screen.getByRole('checkbox', {name: 'flow'});

    expect(flowCheckBoxNode).toBeInTheDocument();
    const integrationCheckBoxNode = screen.getByRole('checkbox', {name: 'integration'});

    expect(integrationCheckBoxNode).toBeInTheDocument();
    userEvent.click(exportCheckBoxNode);
    const applyButtonNode = screen.getByRole('button', {name: 'Apply'});

    expect(applyButtonNode).toBeInTheDocument();
    const cancelButtonNode = screen.getByRole('button', {name: 'Cancel'});

    expect(cancelButtonNode).toBeInTheDocument();
    userEvent.click(applyButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.scripts.patchFilter({scriptId: '62e59df376ce554057c07abc', flowId: '62e59e1176ce554057c07abc', field: 'selectedResources', value: [{id: '62e59e0c76ce554057c07abc', name: 'Test Export', type: 'export' }]}));
    expect(applyButtonNode).not.toBeInTheDocument();
  });
  test('should able to test the function type button drop-down', async () => {
    store({});
    await initScriptLogs({
      flowId: '62e59e1176ce554057c07abc',
      scriptId: '62e59df376ce554057c07abc',
    });
    const functionTypeDropDownNode = screen.getByRole('button', { name: 'Function type' });

    expect(functionTypeDropDownNode).toBeInTheDocument();
    userEvent.click(functionTypeDropDownNode);
    const optionNode = document.querySelectorAll('[role="option"]');

    expect(optionNode).toHaveLength(11);
    const preSavePageOptionDate = screen.getByRole('option', {name: 'preSavePage'});

    expect(preSavePageOptionDate).toBeInTheDocument();
    const preMapOptionNode = screen.getByRole('option', {name: 'preMap'});

    expect(preMapOptionNode).toBeInTheDocument();
    const postMapOptionNode = screen.getByRole('option', {name: 'postMap'});

    expect(postMapOptionNode).toBeInTheDocument();
    const postSubmitOptionNode = screen.getByRole('option', {name: 'postSubmit'});

    expect(postSubmitOptionNode).toBeInTheDocument();
    const postAggregateOptionNode = screen.getByRole('option', {name: 'postAggregate'});

    expect(postAggregateOptionNode).toBeInTheDocument();
    const postResponseMapOptionNode = screen.getByRole('option', {name: 'postResponseMap'});

    expect(postResponseMapOptionNode).toBeInTheDocument();
    const filterOptionNode = screen.getByRole('option', {name: 'filter'});

    expect(filterOptionNode).toBeInTheDocument();
    const transformOptionNode = screen.getByRole('option', {name: 'transform'});

    expect(transformOptionNode).toBeInTheDocument();
    const initFormOptionNode = screen.getByRole('option', {name: 'initForm'});

    expect(initFormOptionNode).toBeInTheDocument();
    const preSaveOptionNode = screen.getByRole('option', {name: 'preSave'});

    expect(preSaveOptionNode).toBeInTheDocument();
    userEvent.click(preSavePageOptionDate);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.scripts.patchFilter({
      scriptId: '62e59df376ce554057c07abc',
      flowId: '62e59e1176ce554057c07abc',
      field: 'functionType',
      value: 'preSavePage',
    }));

    await waitFor(() => expect(preMapOptionNode).not.toBeInTheDocument());
    const preSavePageButtonNode = await waitFor(() => screen.getByRole('button', {name: 'preSavePage'}));

    expect(preSavePageButtonNode).toBeInTheDocument();
  }, 30000);
  test('should able to test the log level button drop-down', async () => {
    store({});
    await initScriptLogs({
      flowId: '62e59e1176ce554057c07abc',
      scriptId: '62e59df376ce554057c07abc',
    });
    const logLevelDropDownNode = screen.getByRole('button', { name: 'Log level' });

    expect(logLevelDropDownNode).toBeInTheDocument();
    userEvent.click(logLevelDropDownNode);
    const debugOption = screen.getByRole('option', {name: 'debug'});

    expect(debugOption).toBeInTheDocument();
    const infoOption = screen.getByRole('option', {name: 'info'});

    expect(infoOption).toBeInTheDocument();
    const warnOption = screen.getByRole('option', {name: 'warn'});

    expect(warnOption).toBeInTheDocument();
    const errorOption = screen.getByRole('option', {name: 'error'});

    expect(errorOption).toBeInTheDocument();
    userEvent.click(debugOption);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.scripts.patchFilter({
      scriptId: '62e59df376ce554057c07abc',
      flowId: '62e59e1176ce554057c07abc',
      field: 'logLevel',
      value: 'DEBUG',
    }));
    await waitFor(() => expect(infoOption).not.toBeInTheDocument());
    const debugButtonNode = screen.getByRole('button', {name: 'debug'});

    expect(debugButtonNode).toBeInTheDocument();
  });
  test('should able to test the purge logs action', async () => {
    store({
      connections: {},
      scripts: {
        scripts: {
          '62e59df376ce554057c07abc-62e59e1176ce554057c07abc': {
            scriptId: '62e59df376ce554057c07abc',
            flowId: '62e59e1176ce554057c07abc',
            dateRange: {
              startDate: new Date('2022-08-13'),
              preset: 'last15minutes',
            },
            status: 'received',
            logs: [
              {
                time: new Date('2022-08-13'),
                _resourceId: '62e59e0c76ce554057c07abc',
                functionType: 'Function type',
                logLevel: 'debug',
                message: 'test message',
              },
            ],
            isPurgeAvailable: true,
          },
        },
      },
      flowStep: {},
    });
    await initScriptLogs({
      flowId: '62e59e1176ce554057c07abc',
      scriptId: '62e59df376ce554057c07abc',
    });
    const moreActions = screen.getAllByRole('button', {name: /more/i});

    userEvent.click(moreActions[0]);
    const purgeLogs = screen.getByText(/Purge all logs of this script/i);

    expect(purgeLogs).toBeInTheDocument();
    expect(purgeLogs.getAttribute('aria-disabled')).toBe('false');
  });
  test('should able to test the refresh button', async () => {
    store({
      connections: {},
      scripts: {
        scripts: {
          '62e59df376ce554057c07abc-62e59e1176ce554057c07abc': {
            scriptId: '62e59df376ce554057c07abc',
            flowId: '62e59e1176ce554057c07abc',
            dateRange: {
              startDate: new Date('2022-08-13'),
              preset: 'last15minutes',
            },
            status: 'received',
            logs: [
              {
                time: new Date('2022-08-13'),
                _resourceId: '62e59e0c76ce554057c07abc',
                functionType: 'Function type',
                logLevel: 'debug',
                message: 'test message',
              },
            ],
          },
        },
      },
      flowStep: {},
    });
    await initScriptLogs({
      flowId: '62e59e1176ce554057c07abc',
      scriptId: '62e59df376ce554057c07abc',
    });
    const refreshButtonNode = screen.getByRole('button', {name: 'Refresh'});

    expect(refreshButtonNode).toBeInTheDocument();
    userEvent.click(refreshButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.scripts.refresh({
      flowId: '62e59e1176ce554057c07abc',
      scriptId: '62e59df376ce554057c07abc',
    }));
  });
  test('should able to test the rows button with no execution logs', async () => {
    store({
      connections: {},
      scripts: {
        scripts: {
          '62e59df376ce554057c07abc-62e59e1176ce554057c07abc': {
            scriptId: '62e59df376ce554057c07abc',
            flowId: '62e59e1176ce554057c07abc',
            dateRange: {
              startDate: new Date('2022-08-13'),
              preset: 'last15minutes',
            },
            status: 'received',
            logs: [
            ],
          },
        },
      },
      flowStep: {},
    });
    await initScriptLogs({
      flowId: '62e59e1176ce554057c07abc',
      scriptId: '62e59df376ce554057c07abc',
    });
    const rowsTextNode = screen.getByText(/Rows/i);

    expect(rowsTextNode).toBeInTheDocument();
    const rowsNode = screen.getByRole('button', {name: '50'});

    expect(rowsNode).toBeInTheDocument();
    userEvent.click(rowsNode);
    const tenOptionNode = screen.getByRole('option', {name: '10'});

    expect(tenOptionNode).toBeInTheDocument();
    const twentyFiveOptionNode = screen.getByRole('option', {name: '25'});

    expect(twentyFiveOptionNode).toBeInTheDocument();
    const fiftyOptionNode = screen.getByRole('option', {name: '50'});

    expect(fiftyOptionNode).toBeInTheDocument();
    userEvent.click(tenOptionNode);
    await waitFor(() => expect(twentyFiveOptionNode).not.toBeInTheDocument());
    const noExecutionLogsNode = screen.getByText("You don't have any execution logs in the selected time frame.");

    expect(noExecutionLogsNode).toBeInTheDocument();
  });
  test('should able to test the pagination button', async () => {
    store({
      connections: {},
      scripts: {
        scripts: {
          '62e59df376ce554057c07abc-62e59e1176ce554057c07abc': {
            scriptId: '62e59df376ce554057c07abc',
            flowId: '62e59e1176ce554057c07abc',
            dateRange: {
              startDate: new Date('2022-08-13'),
              preset: 'last15minutes',
            },
            status: 'received',

            logs: [
              {
                time: '08/13/2022 5:30:00 am',
                _resourceId: '62e59e0c76ce554057c07abc',
                functionType: 'Function type',
                logLevel: 'debug',
                message: 'test message',
              },
              {
                time: '08/13/2022 5:31:00 am',
                _resourceId: '62e59e0c76ce554057c07abc',
                functionType: 'Function type',
                logLevel: 'debug',
                message: 'test message 1',
              },
              {
                time: '08/13/2022 5:32:00 am',
                _resourceId: '62e59e0c76ce554057c07abc',
                functionType: 'Function type',
                logLevel: 'debug',
                message: 'test message 2',
              },
              {
                time: '08/13/2022 5:33:00 am',
                _resourceId: '62e59e0c76ce554057c07abc',
                functionType: 'Function type',
                logLevel: 'debug',
                message: 'test message 3',
              },
              {
                time: '08/13/2022 5:34:00 am',
                _resourceId: '62e59e0c76ce554057c07abc',
                functionType: 'Function type',
                logLevel: 'debug',
                message: 'test message 4',
              },
              {
                time: '08/13/2022 5:35:00 am',
                _resourceId: '62e59e0c76ce554057c07abc',
                functionType: 'Function type',
                logLevel: 'debug',
                message: 'test message 5',
              },
              {
                time: '08/13/2022 5:36:00 am',
                _resourceId: '62e59e0c76ce554057c07abc',
                functionType: 'Function type',
                logLevel: 'debug',
                message: 'test message 6',
              },
              {
                time: '08/13/2022 5:37:00 am',
                _resourceId: '62e59e0c76ce554057c07abc',
                functionType: 'Function type',
                logLevel: 'debug',
                message: 'test message 7',
              },
              {
                time: '08/13/2022 5:38:00 am',
                _resourceId: '62e59e0c76ce554057c07abc',
                functionType: 'Function type',
                logLevel: 'debug',
                message: 'test message 8',
              },
              {
                time: '08/13/2022 5:39:00 am',
                _resourceId: '62e59e0c76ce554057c07abc',
                functionType: 'Function type',
                logLevel: 'debug',
                message: 'test message 9',
              },
              {
                time: '08/13/2022 5:40:00 am',
                _resourceId: '62e59e0c76ce554057c07abc',
                functionType: 'Function type',
                logLevel: 'debug',
                message: 'test message 10',
              },
            ],
          },
        },
      },
      flowStep: {},
    });
    await initScriptLogs({
      flowId: '62e59e1176ce554057c07abc',
      scriptId: '62e59df376ce554057c07abc',
    });

    const rowsTextNode = screen.getByText(/Rows/i);

    expect(rowsTextNode).toBeInTheDocument();
    const rowsNode = screen.getByRole('button', {name: '50'});

    expect(rowsNode).toBeInTheDocument();
    userEvent.click(rowsNode);
    const tenOptionNode = screen.getByRole('option', {name: '10'});

    expect(tenOptionNode).toBeInTheDocument();
    const twentyFiveOptionNode = screen.getByRole('option', {name: '25'});

    expect(twentyFiveOptionNode).toBeInTheDocument();
    const fiftyOptionNode = screen.getByRole('option', {name: '50'});

    expect(fiftyOptionNode).toBeInTheDocument();
    userEvent.click(tenOptionNode);
    await waitFor(() => expect(twentyFiveOptionNode).not.toBeInTheDocument());
    const prevPageButtonNode = screen.getByTestId(/prevPage/i);

    expect(prevPageButtonNode).toBeInTheDocument();
    const nextPageButtonNode = screen.getByTestId(/nextPage/i);

    expect(nextPageButtonNode).toBeInTheDocument();
    userEvent.click(nextPageButtonNode);
    const pageNode = screen.getByText(/11 - 11 of 11/i);

    expect(pageNode).toBeInTheDocument();
  }, 30000);
  test('should able to test the logs when the status is inprogress and clicking on pause and resume button', async () => {
    store({
      connections: {},
      scripts: {
        scripts: {
          '62e59df376ce554057c07abc-62e59e1176ce554057c07abc': {
            scriptId: '62e59df376ce554057c07abc',
            flowId: '62e59e1176ce554057c07abc',
            dateRange: {
              startDate: new Date('2022-08-13'),
              preset: 'last15minutes',
            },
            status: 'requested',
            fetchStatus: 'inProgress',
            nextPageURL: true,
            logs: [],
          },
        },
      },
      flowStep: {},
    });
    await initScriptLogs({
      flowId: '62e59e1176ce554057c07abc',
      scriptId: '62e59df376ce554057c07abc',
    });
    const fetchingLogsNode = screen.getByText(/Fetching logs... 0% completed/i);

    expect(fetchingLogsNode).toBeInTheDocument();
    const pauseButtonNode = screen.getByRole('button', {name: 'Pause'});

    userEvent.click(pauseButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.scripts.setFetchStatus({scriptId: '62e59df376ce554057c07abc', flowId: '62e59e1176ce554057c07abc', fetchStatus: 'paused'}));
    const resumeButtonNode = screen.getByRole('button', {name: 'Resume'});

    expect(resumeButtonNode).toBeInTheDocument();
    userEvent.click(resumeButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.scripts.loadMore({scriptId: '62e59df376ce554057c07abc', flowId: '62e59e1176ce554057c07abc', fetchNextPage: true}));
  });
  test('should able to test the function type drop-down button when there is no flow id', async () => {
    store({});
    await initScriptLogs({
      flowId: '',
      scriptId: '62e59df376ce554057c07abc',
    });
    const functionTypeButtonNode = screen.getByRole('button', {name: 'Function type'});

    expect(functionTypeButtonNode).toBeInTheDocument();
    userEvent.click(functionTypeButtonNode);
    const optionsNode = screen.getAllByRole('option');

    expect(optionsNode).toHaveLength(15);
    const functionTypeOptionNode = screen.getByRole('option', {name: 'Function type'});

    expect(functionTypeOptionNode).toBeInTheDocument();
    const preSavePageOptionNode = screen.getByRole('option', {name: 'preSavePage'});

    expect(preSavePageOptionNode).toBeInTheDocument();
    const preMapPageOptionNode = screen.getByRole('option', {name: 'preMap'});

    expect(preMapPageOptionNode).toBeInTheDocument();
    const postMapPageOptionNode = screen.getByRole('option', {name: 'postMap'});

    expect(postMapPageOptionNode).toBeInTheDocument();
    const postSubmitOptionNode = screen.getByRole('option', {name: 'postSubmit'});

    expect(postSubmitOptionNode).toBeInTheDocument();
    const postAggregateOptionNode = screen.getByRole('option', {name: 'postAggregate'});

    expect(postAggregateOptionNode).toBeInTheDocument();
    const postResponseMapOptionNode = screen.getByRole('option', {name: 'postResponseMap'});

    expect(postResponseMapOptionNode).toBeInTheDocument();
    const filterOptionNode = screen.getByRole('option', {name: 'filter'});

    expect(filterOptionNode).toBeInTheDocument();
    const transformOptionNode = screen.getByRole('option', {name: 'transform'});

    expect(transformOptionNode).toBeInTheDocument();
    const initFormOptionNode = screen.getByRole('option', {name: 'initForm'});

    expect(initFormOptionNode).toBeInTheDocument();
    const preSaveOptionNode = screen.getByRole('option', {name: 'preSave'});

    expect(preSaveOptionNode).toBeInTheDocument();
    const updateOptionNode = screen.getByRole('option', {name: 'update'});

    expect(updateOptionNode).toBeInTheDocument();
    const stepOptionNode = screen.getByRole('option', {name: 'step'});

    expect(stepOptionNode).toBeInTheDocument();
    const initChildOptionNode = screen.getByRole('option', {name: 'initChild'});

    expect(initChildOptionNode).toBeInTheDocument();
    const changeEditionOptionNode = screen.getByRole('option', {name: 'changeEdition'});

    expect(changeEditionOptionNode).toBeInTheDocument();
    userEvent.click(filterOptionNode);
    await waitFor(() => expect(functionTypeOptionNode).not.toBeInTheDocument());
  }, 30000);
});
