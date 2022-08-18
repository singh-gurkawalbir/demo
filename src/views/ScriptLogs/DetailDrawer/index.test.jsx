/* global describe, test, expect, jest, beforeEach */
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import ViewLogDetailDrawer from './index';
import { renderWithProviders } from '../../../test/test-utils';
import { runServer } from '../../../test/api/server';
import { getCreatedStore } from '../../../store';

let initialStore;
let logs;
let scriptlogs;

function store(logs, scriptlogs) {
  initialStore.getState().data.resources.integrations = [
    {
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
    },
  ];
  initialStore.getState().data.resources.flows = [
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
  initialStore.getState().data.resources.scripts = [
    {
      _id: '62e59df376ce554057c07abc',
      lastModified: '2022-08-10T14:31:47.113Z',
      createdAt: '2022-07-30T21:09:07.396Z',
      name: logs.name,
      description: '',
      debugUntil: '2022-08-10T15:31:46.882Z',
      _sourceId: '61924a2caba738048023cabc',
      content: "function preSavePageFunction (options) {\n  var d = options.data;\n   for(var i = 0; i < d.length; i++){\n     var a = d[i].Attachments;\n     for(var j = 0; j < a.length; j++){\n       var n = a[j].Name;\n       var types = n.split(\".\");\n       var ty = types[1];\n       if(ty == 'PNG' || ty == 'png'){\n         a[j].content = \"image/png\";\n       }\n       else if(ty == 'jpg'){\n         a[j].content = \"image/jpeg\";\n       }\n       else if(ty == 'gif'){\n         a[j].content = \"image/gif\";\n       }\n       else if(ty == 'css'){\n         a[j].content = \"text/css\";\n       }\n       else if(ty == 'csv'){\n         a[j].content = \"text/csv\";\n       }\n       else if(ty == 'html'){\n         a[j].content = \"text/html\";\n       }\n       else if(ty == 'txt'){\n         a[j].content = \"text/plain\";\n       }\n       else if(ty == 'mp4'){\n         a[j].content = \"video/mp4\";\n       }\n     }\n   }\n  return {\n    data: options.data,\n    errors: options.errors\n  }\n}",
    },
  ];
  initialStore.getState().data.resources.exports = [
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
  initialStore.getState().data.resources.imports = [
    {
      _id: '5f86981618101578f8aceabc',
      createdAt: '2020-10-14T06:17:58.418Z',
      lastModified: '2021-03-23T17:19:54.431Z',
      name: 'FTP Import',
      _connectionId: '5d529bfbdb0c7b14a6011abc',
      distributed: false,
      apiIdentifier: 'i6fc36de7e',
      oneToMany: false,
      sandbox: false,
      file: {
        fileName: 'xyz.json',
        type: 'json',
      },
      ftp: {
        directoryPath: '/Test',
        fileName: 'xyz.json',
      },
      adaptorType: 'FTPImport',
    },
  ];
  initialStore.getState().session.logs = scriptlogs;
  initialStore.getState().session.logs.scripts.scripts[scriptlogs.id].logs[logs.index] = logs;
}
async function initViewLogDetailDrawer() {
  const ui = (
    <MemoryRouter initialEntries={[{pathname: 'scriptLog/62e59df376ce554057c07abc/62e59e1176ce554057c07abc/76a7xtas8'}]}>
      <Route
        path=""
      >
        <ViewLogDetailDrawer />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

const mockHistoryBack = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryBack,
  }),
}));
describe('Script Logs Drawer Route', () => {
  runServer();

  beforeEach(done => {
    initialStore = getCreatedStore();
    done();
  });
  test('Should able to test the Script logs drawer by clicking on close button', async () => {
    logs = {
      time: new Date('2022-08-13'),
      _resourceId: '62e59e0c76ce554057c07abc',
      functionType: 'Function type',
      logLevel: 'debug',
      message: 'test message',
      index: 76,
      name: 'Test Script',
    };
    scriptlogs = {
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
            logs: [],
          },
        },
      },
      flowStep: {},
      id: '62e59df376ce554057c07abc-62e59e1176ce554057c07abc',
    };
    store(logs, scriptlogs);
    initViewLogDetailDrawer();
    const headingNode = screen.getByRole('heading', {name: 'View execution log details: Test Script'});

    expect(headingNode).toBeInTheDocument();
    const TimestampLabelNode = screen.getByText(/Timestamp:/i);

    expect(TimestampLabelNode).toBeInTheDocument();
    const typeNode = screen.getByText(/Type: debug/i);

    expect(typeNode).toBeInTheDocument();
    const functionTypeNode = screen.getByText(/Function type: Function type/i);

    expect(functionTypeNode).toBeInTheDocument();
    const messageLabelNode = screen.getByText(/Message:/i);

    expect(messageLabelNode).toBeInTheDocument();
    const testMessageNode = screen.getByText(/test message/i);

    expect(testMessageNode).toBeInTheDocument();
    const closeButtonNode = screen.getByRole('button', {name: 'Close'});

    expect(closeButtonNode).toBeInTheDocument();
    userEvent.click(closeButtonNode);
    expect(mockHistoryBack).toHaveBeenCalledTimes(1);
  });
  test('Should able to test the Script logs drawer with no logs and with no name', async () => {
    logs = {
    };
    scriptlogs = {
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
            logs: [],
          },
        },
      },
      flowStep: {},
      id: '62e59df376ce554057c07abc-62e59e1176ce554057c07abc',
    };
    store(logs, scriptlogs);
    initViewLogDetailDrawer();
    const headingNode = screen.getByText(/View execution log details:/i);

    expect(headingNode).toBeInTheDocument();
  });
});
