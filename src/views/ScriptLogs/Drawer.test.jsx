/* global describe, test, expect, jest, beforeEach, afterEach */
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { cleanup, screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import ScriptLogsDrawerRoute from './Drawer';
import { renderWithProviders } from '../../test/test-utils';
import actions from '../../actions';
import { runServer } from '../../test/api/server';
import { getCreatedStore } from '../../store';
import { integrations, flows, exports, imports } from './index.test';

let initialStore;

function store(scriptname) {
  initialStore.getState().data.resources.integrations = integrations;
  initialStore.getState().data.resources.flows = flows;
  initialStore.getState().data.resources.scripts = [
    {
      _id: '62e59df376ce554057c07abc',
      lastModified: '2022-08-10T14:31:47.113Z',
      createdAt: '2022-07-30T21:09:07.396Z',
      name: scriptname,
      description: '',
      debugUntil: '2022-08-10T15:31:46.882Z',
      _sourceId: '61924a2caba738048023cabc',
      content: "function preSavePageFunction (options) {\n  var d = options.data;\n   for(var i = 0; i < d.length; i++){\n     var a = d[i].Attachments;\n     for(var j = 0; j < a.length; j++){\n       var n = a[j].Name;\n       var types = n.split(\".\");\n       var ty = types[1];\n       if(ty == 'PNG' || ty == 'png'){\n         a[j].content = \"image/png\";\n       }\n       else if(ty == 'jpg'){\n         a[j].content = \"image/jpeg\";\n       }\n       else if(ty == 'gif'){\n         a[j].content = \"image/gif\";\n       }\n       else if(ty == 'css'){\n         a[j].content = \"text/css\";\n       }\n       else if(ty == 'csv'){\n         a[j].content = \"text/csv\";\n       }\n       else if(ty == 'html'){\n         a[j].content = \"text/html\";\n       }\n       else if(ty == 'txt'){\n         a[j].content = \"text/plain\";\n       }\n       else if(ty == 'mp4'){\n         a[j].content = \"video/mp4\";\n       }\n     }\n   }\n  return {\n    data: options.data,\n    errors: options.errors\n  }\n}",
    },
  ];
  initialStore.getState().data.resources.exports = exports;
  initialStore.getState().data.resources.imports = imports;
  initialStore.getState().session.logs = {
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
  };
}
async function initScriptLogsDrawerRoute() {
  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/scripts/viewLogs/62e59df376ce554057c07abc'}]}>
      <Route
        path="/scripts"
          >
        <ScriptLogsDrawerRoute />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

jest.mock('../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/LoadResources'),
  default: children => (
    <div>
      {children.children}
    </div>
  ),
}
));

const mockHistoryBack = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Redirect: jest.fn(({ to }) => <>Redirected to {to}</>),
  useHistory: () => ({
    goBack: mockHistoryBack,
  }),
}));
describe('Script Logs Drawer Route', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
    initialStore = getCreatedStore();
    jest.useFakeTimers();
    jest.setTimeout(100000);
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
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    cleanup();
  });
  test('Should able to test the Script logs drawer header text', async () => {
    const scriptname = 'Test Script';

    store(scriptname);
    initScriptLogsDrawerRoute();
    const headerTextNode = screen.getByRole('heading', {name: 'Execution log: Test Script'});

    expect(headerTextNode).toBeInTheDocument();
  });
  test('Should able to test the Script logs drawer close button', async () => {
    const scriptname = 'Test Script';

    store(scriptname);
    initScriptLogsDrawerRoute();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.scripts.request({scriptId: '62e59df376ce554057c07abc', isInit: true}));
    const closeButtonNode = screen.getByRole('button', {name: 'Close'});

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    expect(mockHistoryBack).toHaveBeenCalledTimes(1);
  });
  test('Should able to test the Script logs drawer header with empty script name', async () => {
    const scriptname = '';

    store(scriptname);
    initScriptLogsDrawerRoute();
    const headerTextNode = screen.getByRole('heading', {name: 'Execution log:'});

    expect(headerTextNode).toBeInTheDocument();
  });
});
