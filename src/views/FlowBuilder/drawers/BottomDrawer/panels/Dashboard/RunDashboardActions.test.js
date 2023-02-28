import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RunDashboardActions from './RunDashboardActions';
import { runServer } from '../../../../../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../../test/test-utils';
import actions from '../../../../../../actions';
import { ConfirmDialogProvider } from '../../../../../../components/ConfirmDialog';

async function initMarketplace({
  props = {
    flowId: 'flow_id_1',
    integrationId: 'integration_id_1',
  },
} = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.errorManagement = {
      latestFlowJobs: {
        flow_id_1: {
          status: 'received',
          data: [
            {
              _id: 'job_id_1',
              status: 'completed',
            },
            {
              _id: 'job_id_2',
              status: 'running',
            },
          ],
        },
        flow_id_2: {
          status: 'received',
          data: [
            {
              _id: 'job_id_3',
              status: 'completed',
              files: [{}],
            },
          ],
        },
        flow_id_3: {
          status: 'received',
          data: [
            {
              _id: 'job_id_4',
              status: 'completed',
              files: [{id: 'file_1'}, {id: 'file_2'}],
            },
          ],
        },
      },
    };
  });

  const ui = (
    <MemoryRouter>
      <ConfirmDialogProvider>
        <RunDashboardActions {...props} />
      </ConfirmDialogProvider>
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

jest.mock('../../../../../../components/EllipsisActionMenu', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../../components/EllipsisActionMenu'),
  default: props => {
    const handleAction = event => {
      props.onAction(event.target.name);
    };

    return (
      <>
        {props?.actionsMenu.map(eachAction => (
          <button type="button" key={eachAction.label} onClick={handleAction} name={eachAction.action}>{eachAction.label}</button>
        ))}
      </>
    );
  },
}));

describe('RunDashboardActions test cases', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should pass the initial render with default value', async () => {
    await initMarketplace();
    const refresshIcon = screen.getByRole('button', { name: /Refresh/i});
    const cancelIcon = screen.getByRole('button', { name: /Cancel run/i});
    const downloadDiagnostics = screen.getByRole('button', { name: /Download diagnostics/i});

    expect(screen.queryByText(/Run/)).toBeInTheDocument();
    expect(refresshIcon).toBeInTheDocument();
    expect(cancelIcon).toBeInTheDocument();
    expect(downloadDiagnostics).toBeInTheDocument();

    // refresh icon
    await userEvent.click(refresshIcon);
    expect(mockDispatchFn).toBeCalledWith(actions.errorManager.latestFlowJobs.request({ flowId: 'flow_id_1', refresh: true }));

    // cancelicon
    await userEvent.click(cancelIcon);
    expect(screen.queryByText(/Confirm cancel run/i)).toBeInTheDocument();
    const cancelRunButton = screen.getByRole('button', { name: 'Cancel run'});

    expect(cancelRunButton).toBeInTheDocument();
    await userEvent.click(cancelRunButton);
    expect(mockDispatchFn).toBeCalledWith(actions.errorManager.latestFlowJobs.cancelLatestJobs({flowId: 'flow_id_1', jobIds: ['job_id_2'] }));

    // download diagnostics
    await userEvent.click(downloadDiagnostics);
    expect(mockDispatchFn).toBeCalledWith(actions.job.downloadFiles({ jobId: 'job_id_1', fileType: 'diagnostics' }));
  });

  test('should pass the initial render with invalid id', async () => {
    await initMarketplace({
      props: {
        flowId: 'flow_id_0',
      },
    });
    expect(screen.queryByText(/Run/)).toBeInTheDocument();
    expect(screen.queryByText(/Refresh/i)).toBeInTheDocument();
    expect(screen.queryByText(/Cancel run/i)).toBeInTheDocument();
  });

  test('should pass the initial render with only completed jobs', async () => {
    await initMarketplace({
      props: {
        flowId: 'flow_id_2',
      },
    });
    const downloadFiles = screen.getByRole('button', { name: /Download files/i});

    expect(screen.queryByText(/Run/)).toBeInTheDocument();
    expect(screen.queryByText(/Refresh/i)).toBeInTheDocument();
    expect(screen.queryByText(/Cancel run/i)).toBeInTheDocument();
    expect(downloadFiles).toBeInTheDocument();

    await userEvent.click(downloadFiles);
    expect(mockDispatchFn).toBeCalledWith(actions.job.downloadFiles({ jobId: 'job_id_3' }));
  });

  test('should pass the initial render with only completed jobs duplicate', async () => {
    await initMarketplace({
      props: {
        flowId: 'flow_id_3',
      },
    });
    const downloadFiles = screen.getByRole('button', { name: /Download files/i});

    expect(screen.queryByText(/Run/)).toBeInTheDocument();
    expect(screen.queryByText(/Refresh/i)).toBeInTheDocument();
    expect(screen.queryByText(/Cancel run/i)).toBeInTheDocument();
    expect(downloadFiles).toBeInTheDocument();

    await userEvent.click(downloadFiles);
    const downloadButton = screen.getByRole('button', {name: /Download/i});
    const buttonRef = screen.getAllByRole('button').find(eachButton => !eachButton.hasAttribute('data-test'));

    expect(downloadButton).toBeInTheDocument();
    expect(buttonRef).toBeInTheDocument();
    await userEvent.click(buttonRef);
  });
});
