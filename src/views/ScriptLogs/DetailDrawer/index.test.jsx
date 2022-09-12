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
import { integrations, flows, exports, imports, scripts } from '../index.test';

let initialStore;

function store(logs, scriptlogs) {
  initialStore.getState().data.resources.integrations = integrations;
  initialStore.getState().data.resources.flows = flows;
  initialStore.getState().data.resources.scripts = scripts;
  initialStore.getState().data.resources.exports = exports;
  initialStore.getState().data.resources.imports = imports;
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
    userEvent.click(closeButtonNode);
    expect(mockHistoryBack).toHaveBeenCalledTimes(1);
  });
  test('Should able to test the Script logs drawer with no logs and with no name', async () => {
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
