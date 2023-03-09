import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ViewLogDetailDrawer from './index';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import { runServer } from '../../../test/api/server';
import { getCreatedStore } from '../../../store';

let initialStore;

function store(logs, scriptlogs) {
  mutateStore(initialStore, draft => {
    draft.data.resources.integrations = [];
    draft.data.resources.flows = [];
    draft.data.resources.scripts = [
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
    draft.data.resources.exports = [];
    draft.data.resources.imports = [];
    draft.session.logs = scriptlogs;
    draft.session.logs.scripts.scripts[scriptlogs.id].logs[logs.index] = logs;
  });
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
describe('script Logs Drawer Route', () => {
  runServer();

  beforeEach(done => {
    initialStore = getCreatedStore();
    done();
  });
  test('should able to test the Script logs drawer by clicking on close button', async () => {
    store({
      time: new Date('2022-08-13'),
      _resourceId: '62e59e0c76ce554057c07abc',
      functionType: 'Function type',
      logLevel: 'debug',
      message: 'test message',
      index: 76,
      name: 'Test Script',
    }, {
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
    });
    initViewLogDetailDrawer();

    expect(screen.getByRole('heading', {name: 'View execution log details: Test Script'})).toBeInTheDocument();

    expect(screen.getByText(/Timestamp:/i)).toBeInTheDocument();

    expect(screen.getByText(/Type: debug/i)).toBeInTheDocument();

    expect(screen.getByText(/Function type: Function type/i)).toBeInTheDocument();

    expect(screen.getByText(/Message:/i)).toBeInTheDocument();

    expect(screen.getByText(/test message/i)).toBeInTheDocument();
    const closeButtonNode = screen.getByRole('button', {name: 'Close'});

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    expect(mockHistoryBack).toHaveBeenCalledTimes(1);
  });
  test('should able to test the Script logs drawer with no logs and with no name', async () => {
    store({}, {
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
    });
    initViewLogDetailDrawer();
    expect(screen.getByText(/View execution log details:/i)).toBeInTheDocument();
  });
});
