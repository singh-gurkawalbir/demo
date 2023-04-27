
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JobActionsMenu from './JobActionsMenu';
import { mutateStore, renderWithProviders } from '../../test/test-utils';
import { ConfirmDialogProvider } from '../ConfirmDialog';
import actions from '../../actions';
import { getCreatedStore } from '../../store';

let initialStore;
const mockOnActionClick = jest.fn();
const mockHistoryPush = jest.fn();

function initJobActionsMenu({
  job,
  onActionClick,
  userPermissionsOnIntegration,
  integrationName,
  isFlowBuilderView,
  networkCommsData,
}) {
  mutateStore(initialStore, draft => {
    draft.data.resources.integrations = [{
      _id: '123',
      disabled: false,
    }];
    draft.data.resources.flows = [{
      _id: '456',
      disabled: false,
      _integrationId: '123',
      pageGenerators: [
        {
          _exportId: '789',
          type: 'export',
          skipRetries: false,
        },
      ],
      pageProcessors: [
        {
          responseMapping: {
            fields: [],
            lists: [],
          },
          type: 'import',
          _importId: '9012',
        },
      ],
    }];
    draft.data.resources.exports = [{
      _id: '789',
    }];
    draft.data.resources.imports = [{
      _id: '9012',
    }];
    draft.comms.networkComms = networkCommsData;
  });

  const ui = (
    <ConfirmDialogProvider>
      <MemoryRouter>
        <JobActionsMenu
          job={job}
          onActionClick={onActionClick}
          userPermissionsOnIntegration={userPermissionsOnIntegration}
          integrationName={integrationName}
          isFlowBuilderView={isFlowBuilderView}
      />
      </MemoryRouter>
    </ConfirmDialogProvider>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
jest.mock('../RunFlowButton', () => ({
  __esModule: true,
  ...jest.requireActual('../RunFlowButton'),
  default: props => (
    <button
      onClick={props.onRunStart}
      type="button"
    >
      Run Flow
    </button>
  ),
}));
jest.mock('./JobFilesDownloadDialog', () => ({
  __esModule: true,
  ...jest.requireActual('./JobFilesDownloadDialog'),
  default: props => (
    <>
      <div>Mock Job Files Download Dialog</div>
      <button type="button" onClick={props.onCloseClick} data-test="jobfiledownload_close">close</button>
    </>
  ),
}));
jest.mock('./JobRetriesDialog', () => ({
  __esModule: true,
  ...jest.requireActual('./JobRetriesDialog'),
  default: props => (
    <>
      <div>Mock Job Retries Dialog</div>
      <button type="button" onClick={props.onCloseClick} data-test="jobretriesdialog_close">close</button>
    </>
  ),
}));

describe('testsuite for JobActionMenu', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
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
    mockHistoryPush.mockClear();
    mockOnActionClick.mockClear();
  });
  test('should test edit flow menu option when the flow builder view has set to false and when user permissions for flow edit is set to true', async () => {
    initJobActionsMenu({
      job: {
        numError: 3,
        numResolved: 1,
        numSuccess: 1,
        numIgnore: 0,
        numPagesGenerated: 1,
        numPagesProcessed: 0,
        _id: '321',
        type: 'flow',
        _integrationId: '123',
        _exportId: '789',
        _flowId: '456',
        startedAt: '2022-10-17T09:44:52.552Z',
        endedAt: '2022-10-17T09:45:59.879Z',
        lastExecutedAt: '2022-10-17T09:45:59.879Z',
        status: 'completed',
        numOpenError: 3,
        numExport: 0,
        doneExporting: true,
        createdAt: '2022-10-17T09:44:51.077Z',
        lastModified: '2022-10-17T09:45:59.915Z',
        uiStatus: 'completed',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: 0,
        children: [{
          _id: 839,
          uiStatus: 'completed',
        }],
      },
      isFlowBuilderView: false,
      onActionClick: mockOnActionClick,
      userPermissionsOnIntegration: {accessLevel: 'owner', flows: {create: true, edit: true, delete: true, clone: true, attach: true, detach: true}, connections: {create: true, edit: true, register: true}, edit: true, delete: true, clone: true},
      integrationName: 'Test Integration Name',
    });
    const jobActionmenuButton = document.querySelector('button[data-test="moreJobActionsMenu"]');

    expect(jobActionmenuButton).toBeInTheDocument();
    await userEvent.click(jobActionmenuButton);
    const editFlowButtonNode = screen.getByRole('menuitem', {name: /edit flow/i});

    expect(editFlowButtonNode).toBeInTheDocument();
    const retryAllButtonNode = screen.getByRole('menuitem', {name: /retry all/i});

    expect(retryAllButtonNode).toBeInTheDocument();
    const markResolvedButtonNode = screen.getByRole('menuitem', {name: /mark resolved/i});

    expect(markResolvedButtonNode).toBeInTheDocument();
    const downloadDiagnosticsButtonNode = screen.getByRole('menuitem', {name: /Download diagnostics/i});

    expect(downloadDiagnosticsButtonNode).toBeInTheDocument();
    await userEvent.click(editFlowButtonNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/123/flowBuilder/456');
  });
  test('should test view flow menu option when the flow builder view has set to false and when user permissions for flow edit is set to false', async () => {
    initJobActionsMenu({
      job: {
        numError: 3,
        numResolved: 1,
        numSuccess: 1,
        numIgnore: 0,
        numPagesGenerated: 1,
        numPagesProcessed: 0,
        _id: '321',
        type: 'flow',
        _integrationId: '123',
        _exportId: '789',
        _flowId: '456',
        startedAt: '2022-10-17T09:44:52.552Z',
        endedAt: '2022-10-17T09:45:59.879Z',
        lastExecutedAt: '2022-10-17T09:45:59.879Z',
        status: 'completed',
        numOpenError: 3,
        numExport: 0,
        doneExporting: true,
        createdAt: '2022-10-17T09:44:51.077Z',
        lastModified: '2022-10-17T09:45:59.915Z',
        uiStatus: 'completed',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: 0,
        children: [{
          _id: 839,
          uiStatus: 'completed',
        }],
      },
      isFlowBuilderView: false,
      onActionClick: mockOnActionClick,
      userPermissionsOnIntegration: {accessLevel: 'owner', flows: {create: true, edit: false, delete: true, clone: true, attach: true, detach: true}, connections: {create: true, edit: true, register: true}, edit: true, delete: true, clone: true},
      integrationName: 'Test Integration Name',
    });
    const jobActionmenuButton = document.querySelector('button[data-test="moreJobActionsMenu"]');

    expect(jobActionmenuButton).toBeInTheDocument();
    await userEvent.click(jobActionmenuButton);
    const viewFlowButtonNode = screen.getByRole('menuitem', {name: /view flow/i});

    expect(viewFlowButtonNode).toBeInTheDocument();
    const retryAllButtonNode = screen.getByRole('menuitem', {name: /retry all/i});

    expect(retryAllButtonNode).toBeInTheDocument();
    const markResolvedButtonNode = screen.getByRole('menuitem', {name: /mark resolved/i});

    expect(markResolvedButtonNode).toBeInTheDocument();
    const downloadDiagnosticsButtonNode = screen.getByRole('menuitem', {name: /Download diagnostics/i});

    expect(downloadDiagnosticsButtonNode).toBeInTheDocument();
    await userEvent.click(viewFlowButtonNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/123/flowBuilder/456');
  });
  test('should test the cancel menu option when the job status is in queued state', async () => {
    initJobActionsMenu({
      job: {
        numError: 3,
        numResolved: 1,
        numSuccess: 1,
        numIgnore: 0,
        numPagesGenerated: 1,
        numPagesProcessed: 0,
        _id: '321',
        type: 'flow',
        _integrationId: '123',
        _exportId: '789',
        _flowId: '456',
        startedAt: '2022-10-17T09:44:52.552Z',
        endedAt: '2022-10-17T09:45:59.879Z',
        lastExecutedAt: '2022-10-17T09:45:59.879Z',
        status: 'completed',
        numOpenError: 3,
        numExport: 0,
        doneExporting: true,
        createdAt: '2022-10-17T09:44:51.077Z',
        lastModified: '2022-10-17T09:45:59.915Z',
        uiStatus: 'queued',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: 0,
        children: [{
          _id: 839,
          uiStatus: 'queued',
        }],
      },
      isFlowBuilderView: true,
      onActionClick: mockOnActionClick,
      userPermissionsOnIntegration: {accessLevel: 'owner', flows: {create: true, edit: true, delete: true, clone: true, attach: true, detach: true}, connections: {create: true, edit: true, register: true}, edit: true, delete: true, clone: true},
      integrationName: 'Test Integration Name',
    });
    const jobActionmenuButton = document.querySelector('button[data-test="moreJobActionsMenu"]');

    expect(jobActionmenuButton).toBeInTheDocument();
    await userEvent.click(jobActionmenuButton);
    const cancelButtonNode = screen.getByRole('menuitem', {name: /cancel/i});

    expect(cancelButtonNode).toBeInTheDocument();
    await userEvent.click(cancelButtonNode);
    expect(screen.getByText(/confirm cancel/i)).toBeInTheDocument();
    const yesCancelButtonNode = screen.getByRole('button', {
      name: /yes, cancel/i,
      hidden: true,
    });

    expect(yesCancelButtonNode).toBeInTheDocument();
    const noGoBackButtonNode = screen.getByRole('button', {name: /No, go back/});

    expect(noGoBackButtonNode).toBeInTheDocument();
    await userEvent.click(yesCancelButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.cancel({ jobId: '321' }));
  });
  test('should test the cancel menu option when the job status is in retrying state', async () => {
    initJobActionsMenu({
      job: {
        numError: 3,
        numResolved: 1,
        numSuccess: 1,
        numIgnore: 0,
        numPagesGenerated: 1,
        numPagesProcessed: 0,
        _id: '321',
        type: 'flow',
        _integrationId: '123',
        _exportId: '789',
        _flowId: '456',
        startedAt: '2022-10-17T09:44:52.552Z',
        endedAt: '2022-10-17T09:45:59.879Z',
        lastExecutedAt: '2022-10-17T09:45:59.879Z',
        status: 'retrying',
        numOpenError: 3,
        numExport: 0,
        doneExporting: true,
        createdAt: '2022-10-17T09:44:51.077Z',
        lastModified: '2022-10-17T09:45:59.915Z',
        uiStatus: 'queued',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: 0,
        children: [{
          _id: 839,
          uiStatus: 'queued',
          status: 'retrying',
          retries: [{_id: 839, status: 'queued'}],
        }],
      },
      isFlowBuilderView: true,
      onActionClick: mockOnActionClick,
      userPermissionsOnIntegration: {accessLevel: 'owner', flows: {create: true, edit: true, delete: true, clone: true, attach: true, detach: true}, connections: {create: true, edit: true, register: true}, edit: true, delete: true, clone: true},
      integrationName: 'Test Integration Name',
    });
    const jobActionmenuButton = document.querySelector('button[data-test="moreJobActionsMenu"]');

    expect(jobActionmenuButton).toBeInTheDocument();
    await userEvent.click(jobActionmenuButton);
    const cancelButtonNode = screen.getByRole('menuitem', {name: /cancel/i});

    expect(cancelButtonNode).toBeInTheDocument();
    await userEvent.click(cancelButtonNode);
    expect(screen.getByText(/confirm cancel/i)).toBeInTheDocument();
    const yesCancelButtonNode = screen.getByRole('button', {
      name: /yes, cancel/i,
    });

    expect(yesCancelButtonNode).toBeInTheDocument();
    const noGoBackButtonNode = screen.getByRole('button', {name: /No, go back/});

    expect(noGoBackButtonNode).toBeInTheDocument();
    await userEvent.click(yesCancelButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.cancel({ jobId: 839 }));
  });
  test('should test the cancel menu option when the job status is in retrying state and job type is export', async () => {
    initJobActionsMenu({
      job: {
        numError: 3,
        numResolved: 1,
        numSuccess: 1,
        numIgnore: 0,
        numPagesGenerated: 1,
        numPagesProcessed: 0,
        _id: '321',
        type: 'export',
        _integrationId: '123',
        _exportId: '789',
        _flowId: '456',
        startedAt: '2022-10-17T09:44:52.552Z',
        endedAt: '2022-10-17T09:45:59.879Z',
        lastExecutedAt: '2022-10-17T09:45:59.879Z',
        status: 'retrying',
        numOpenError: 3,
        numExport: 0,
        doneExporting: true,
        createdAt: '2022-10-17T09:44:51.077Z',
        lastModified: '2022-10-17T09:45:59.915Z',
        uiStatus: 'queued',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: 0,
        retries: [
          {
            status: 'queued',
            _id: '789',
          },
        ],
      },
      isFlowBuilderView: true,
      onActionClick: mockOnActionClick,
      userPermissionsOnIntegration: {accessLevel: 'owner', flows: {create: true, edit: true, delete: true, clone: true, attach: true, detach: true}, connections: {create: true, edit: true, register: true}, edit: true, delete: true, clone: true},
      integrationName: 'Test Integration Name',
    });
    const jobActionmenuButton = document.querySelector('button[data-test="moreJobActionsMenu"]');

    expect(jobActionmenuButton).toBeInTheDocument();
    await userEvent.click(jobActionmenuButton);
    const cancelButtonNode = screen.getByRole('menuitem', {name: /cancel/i});

    expect(cancelButtonNode).toBeInTheDocument();
    await userEvent.click(cancelButtonNode);
    expect(screen.getByText(/confirm cancel/i)).toBeInTheDocument();
    const yesCancelButtonNode = screen.getByRole('button', {
      name: /yes, cancel/i,
    });

    expect(yesCancelButtonNode).toBeInTheDocument();
    const noGoBackButtonNode = screen.getByRole('button', {name: /No, go back/});

    expect(noGoBackButtonNode).toBeInTheDocument();
    await userEvent.click(yesCancelButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.cancel({ jobId: '789' }));
  });
  test('should test the Run Flow menu option', async () => {
    const url = 'POST:/flows/456/run';

    initJobActionsMenu({
      job: {
        numError: 3,
        numResolved: 1,
        numSuccess: 1,
        numIgnore: 0,
        numPagesGenerated: 1,
        numPagesProcessed: 0,
        _id: '321',
        type: 'flow',
        _integrationId: '123',
        _exportId: '789',
        _flowId: '456',
        startedAt: '2022-10-17T09:44:52.552Z',
        endedAt: '2022-10-17T09:45:59.879Z',
        lastExecutedAt: '2022-10-17T09:45:59.879Z',
        status: 'completed',
        numOpenError: 3,
        numExport: 0,
        doneExporting: true,
        createdAt: '2022-10-17T09:44:51.077Z',
        lastModified: '2022-10-17T09:45:59.915Z',
        uiStatus: 'completed',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: 0,
        children: [{
          _id: 839,
          uiStatus: 'completed',
        }],
      },
      isFlowBuilderView: true,
      onActionClick: mockOnActionClick,
      userPermissionsOnIntegration: {accessLevel: 'owner', flows: {create: true, edit: true, delete: true, clone: true, attach: true, detach: true}, connections: {create: true, edit: true, register: true}, edit: true, delete: true, clone: true},
      integrationName: 'Test Integration Name',
      networkCommsData: {[url]: {
        timestamp: 1668452892650,
        status: 'error',
        message: 'Testing error',
        hidden: false,
        refresh: false,
        method: 'POST',
      }},
    });
    const jobActionmenuButton = document.querySelector('button[data-test="moreJobActionsMenu"]');

    expect(jobActionmenuButton).toBeInTheDocument();
    await userEvent.click(jobActionmenuButton);
    const runFlowButtonNode = screen.getByRole('button', {name: /run flow/i});

    expect(runFlowButtonNode).toBeInTheDocument();
    await userEvent.click(runFlowButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.paging.setCurrentPage(0));
    expect(screen.getByText(/testing error/i)).toBeInTheDocument();
  });
  test('should test the Run Flow menu option when the network status is success', async () => {
    const url = 'POST:/flows/456/run';

    initJobActionsMenu({
      job: {
        numError: 3,
        numResolved: 1,
        numSuccess: 1,
        numIgnore: 0,
        numPagesGenerated: 1,
        numPagesProcessed: 0,
        _id: '321',
        type: 'flow',
        _integrationId: '123',
        _exportId: '789',
        _flowId: '456',
        startedAt: '2022-10-17T09:44:52.552Z',
        endedAt: '2022-10-17T09:45:59.879Z',
        lastExecutedAt: '2022-10-17T09:45:59.879Z',
        status: 'completed',
        numOpenError: 3,
        numExport: 0,
        doneExporting: true,
        createdAt: '2022-10-17T09:44:51.077Z',
        lastModified: '2022-10-17T09:45:59.915Z',
        uiStatus: 'completed',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: 0,
        children: [{
          _id: 839,
          uiStatus: 'completed',
        }],
      },
      isFlowBuilderView: true,
      onActionClick: mockOnActionClick,
      userPermissionsOnIntegration: {accessLevel: 'owner', flows: {create: true, edit: true, delete: true, clone: true, attach: true, detach: true}, connections: {create: true, edit: true, register: true}, edit: true, delete: true, clone: true},
      integrationName: 'Test Integration Name',
      networkCommsData: {[url]: {
        timestamp: 1668452892650,
        status: 'success',
        message: 'Testing success',
        hidden: false,
        refresh: false,
        method: 'POST',
      }},
    });
    const jobActionmenuButton = document.querySelector('button[data-test="moreJobActionsMenu"]');

    expect(jobActionmenuButton).toBeInTheDocument();
    await userEvent.click(jobActionmenuButton);
    const runFlowButtonNode = screen.getByRole('button', {name: /run flow/i});

    expect(runFlowButtonNode).toBeInTheDocument();
    await userEvent.click(runFlowButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.paging.setCurrentPage(0));
  });
  test('should test the view retries menu option', async () => {
    initJobActionsMenu({
      job: {
        numError: 0,
        numResolved: 1,
        numSuccess: 1,
        numIgnore: 0,
        numPagesGenerated: 1,
        numPagesProcessed: 0,
        _id: '321',
        type: 'flow',
        _integrationId: '123',
        _exportId: '789',
        _flowId: '456',
        startedAt: '2022-10-17T09:44:52.552Z',
        endedAt: '2022-10-17T09:45:59.879Z',
        lastExecutedAt: '2022-10-17T09:45:59.879Z',
        status: 'completed',
        numOpenError: 3,
        numExport: 0,
        doneExporting: true,
        createdAt: '2022-10-17T09:44:51.077Z',
        lastModified: '2022-10-17T09:45:59.915Z',
        uiStatus: 'completed',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: 0,
        children: [{
          _id: 839,
          uiStatus: 'completed',
        }],
        retries: [{
          _id: '321',
        }],
      },
      isFlowBuilderView: true,
      onActionClick: mockOnActionClick,
      userPermissionsOnIntegration: {accessLevel: 'owner', flows: {create: true, edit: true, delete: true, clone: true, attach: true, detach: true}, connections: {create: true, edit: true, register: true}, edit: true, delete: true, clone: true},
      integrationName: 'Test Integration Name',
    });
    const jobActionmenuButton = document.querySelector('button[data-test="moreJobActionsMenu"]');

    expect(jobActionmenuButton).toBeInTheDocument();
    await userEvent.click(jobActionmenuButton);
    const viewRetriesOptionNode = screen.getByRole('menuitem', {name: /view retries/i});

    expect(viewRetriesOptionNode).toBeInTheDocument();
    await userEvent.click(viewRetriesOptionNode);
    expect(screen.getByText(/Mock Job Retries Dialog/i)).toBeInTheDocument();
    const closeButtonNode = document.querySelector('button[data-test="jobretriesdialog_close"]');

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    expect(closeButtonNode).not.toBeInTheDocument();
  });
  test('should test the retry all job menu option and by clicking on undo button of snackbar', async () => {
    initJobActionsMenu({
      job: {
        numError: 2,
        numResolved: 1,
        numSuccess: 1,
        numIgnore: 0,
        numPagesGenerated: 1,
        numPagesProcessed: 0,
        _id: '321',
        type: 'flow',
        _integrationId: '123',
        _exportId: '789',
        _flowId: '456',
        startedAt: '2022-10-17T09:44:52.552Z',
        endedAt: '2022-10-17T09:45:59.879Z',
        lastExecutedAt: '2022-10-17T09:45:59.879Z',
        status: 'completed',
        numOpenError: 3,
        numExport: 0,
        doneExporting: true,
        createdAt: '2022-10-17T09:44:51.077Z',
        lastModified: '2022-10-17T09:45:59.915Z',
        uiStatus: 'completed',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: 0,
        children: [{
          _id: 839,
          uiStatus: 'completed',
        }],
      },
      isFlowBuilderView: true,
      onActionClick: mockOnActionClick,
      userPermissionsOnIntegration: {accessLevel: 'owner', flows: {create: true, edit: true, delete: true, clone: true, attach: true, detach: true}, connections: {create: true, edit: true, register: true}, edit: true, delete: true, clone: true},
      integrationName: 'Test Integration Name',
    });
    const jobActionmenuButton = document.querySelector('button[data-test="moreJobActionsMenu"]');

    expect(jobActionmenuButton).toBeInTheDocument();
    await userEvent.click(jobActionmenuButton);
    const retryallJobsOptionNode = screen.getByRole('menuitem', {name: /retry all/i});

    expect(retryallJobsOptionNode).toBeInTheDocument();
    await userEvent.click(retryallJobsOptionNode);
    expect(screen.getByText(/2 errors retried\./i)).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.retryFlowJob({
      jobId: '321',
      match: {
        isExact: true,
        params: {

        },
        path: '/',
        url: '/',

      },
    }));
    const undoButtonNode = screen.getByRole('button', {
      name: /undo/i,
    });

    expect(undoButtonNode).toBeInTheDocument();
    await userEvent.click(undoButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.retryUndo({parentJobId: '321', childJobId: null}));
    await waitFor(() => expect(undoButtonNode).not.toBeInTheDocument());
  });
  test('should test the retry all job menu option and by clicking on close button of snackbar', async () => {
    initJobActionsMenu({
      job: {
        numError: '1',
        numResolved: '1',
        numSuccess: '1',
        numIgnore: '0',
        numPagesGenerated: '1',
        numPagesProcessed: '0',
        _id: '321',
        type: 'flow',
        _integrationId: '123',
        _exportId: '789',
        _flowId: '456',
        startedAt: '2022-10-17T09:44:52.552Z',
        endedAt: '2022-10-17T09:45:59.879Z',
        lastExecutedAt: '2022-10-17T09:45:59.879Z',
        status: 'completed',
        numOpenError: 3,
        numExport: 0,
        doneExporting: true,
        createdAt: '2022-10-17T09:44:51.077Z',
        lastModified: '2022-10-17T09:45:59.915Z',
        uiStatus: 'completed',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: '0',
        children: [{
          _id: 839,
          uiStatus: 'completed',
        }],
      },
      isFlowBuilderView: true,
      onActionClick: mockOnActionClick,
      userPermissionsOnIntegration: {accessLevel: 'owner', flows: {create: true, edit: true, delete: true, clone: true, attach: true, detach: true}, connections: {create: true, edit: true, register: true}, edit: true, delete: true, clone: true},
      integrationName: 'Test Integration Name',
    });
    const jobActionmenuButton = document.querySelector('button[data-test="moreJobActionsMenu"]');

    expect(jobActionmenuButton).toBeInTheDocument();
    await userEvent.click(jobActionmenuButton);
    const retryallJobsOptionNode = screen.getByRole('menuitem', {name: /retry all/i});

    expect(retryallJobsOptionNode).toBeInTheDocument();
    await userEvent.click(retryallJobsOptionNode);
    expect(screen.getByText(/1 error retried\./i)).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.retryFlowJob({
      jobId: '321',
      match: {
        isExact: true,
        params: {

        },
        path: '/',
        url: '/',

      },
    }));
    const closeButtonNode = screen.getByRole('button', {
      name: /close/i,
    });

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.retryFlowJobCommit({jobId: '321'})));
    await waitFor(() => expect(closeButtonNode).not.toBeInTheDocument());
  });
  test('should test the retry job menu option and by clicking on undo button of snackbar when the job type is not equal to flow', async () => {
    initJobActionsMenu({
      job: {
        numError: '1',
        numResolved: '1',
        numSuccess: '1',
        numIgnore: '0',
        retriable: true,
        numPagesGenerated: '1',
        numPagesProcessed: '0',
        _id: '321',
        type: 'export',
        _integrationId: '123',
        _exportId: '789',
        _flowId: '456',
        _flowJobId: '734',
        startedAt: '2022-10-17T09:44:52.552Z',
        endedAt: '2022-10-17T09:45:59.879Z',
        lastExecutedAt: '2022-10-17T09:45:59.879Z',
        status: 'completed',
        numOpenError: 3,
        numExport: 0,
        doneExporting: true,
        createdAt: '2022-10-17T09:44:51.077Z',
        lastModified: '2022-10-17T09:45:59.915Z',
        uiStatus: 'completed',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: '0',
        children: [{
          _id: 839,
          uiStatus: 'completed',
        }],
      },
      isFlowBuilderView: true,
      onActionClick: mockOnActionClick,
      userPermissionsOnIntegration: {accessLevel: 'owner', flows: {create: true, edit: true, delete: true, clone: true, attach: true, detach: true}, connections: {create: true, edit: true, register: true}, edit: true, delete: true, clone: true},
      integrationName: 'Test Integration Name',
    });
    const jobActionmenuButton = document.querySelector('button[data-test="moreJobActionsMenu"]');

    expect(jobActionmenuButton).toBeInTheDocument();
    await userEvent.click(jobActionmenuButton);
    const retryJobsOptionNode = screen.getByRole('menuitem', {name: /retry/i});

    expect(retryJobsOptionNode).toBeInTheDocument();
    await userEvent.click(retryJobsOptionNode);
    expect(screen.getByText(/1 error retried\./i)).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.retrySelected({
      jobs: [{ _id: '321', _flowJobId: '734' }],
      match: {
        isExact: true,
        params: {

        },
        path: '/',
        url: '/',
      },
    }));
    const undoButtonNode = screen.getByRole('button', {
      name: /undo/i,
    });

    expect(undoButtonNode).toBeInTheDocument();
    await userEvent.click(undoButtonNode);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.retryUndo({parentJobId: '734', childJobId: '321'})));
    await waitFor(() => expect(undoButtonNode).not.toBeInTheDocument());
  });
  test('should test the retry job menu option and by clicking on close button of snackbar when the job type is not equal to flow', async () => {
    initJobActionsMenu({
      job: {
        numError: '1',
        numResolved: '1',
        numSuccess: '1',
        numIgnore: '0',
        retriable: true,
        numPagesGenerated: '1',
        numPagesProcessed: '0',
        _id: '321',
        type: 'export',
        _integrationId: '123',
        _exportId: '789',
        _flowId: '456',
        _flowJobId: '734',
        startedAt: '2022-10-17T09:44:52.552Z',
        endedAt: '2022-10-17T09:45:59.879Z',
        lastExecutedAt: '2022-10-17T09:45:59.879Z',
        status: 'completed',
        numOpenError: 3,
        numExport: 0,
        doneExporting: true,
        createdAt: '2022-10-17T09:44:51.077Z',
        lastModified: '2022-10-17T09:45:59.915Z',
        uiStatus: 'completed',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: '0',
        children: [{
          _id: 839,
          uiStatus: 'completed',
        }],
      },
      isFlowBuilderView: true,
      onActionClick: mockOnActionClick,
      userPermissionsOnIntegration: {accessLevel: 'owner', flows: {create: true, edit: true, delete: true, clone: true, attach: true, detach: true}, connections: {create: true, edit: true, register: true}, edit: true, delete: true, clone: true},
      integrationName: 'Test Integration Name',
    });
    const jobActionmenuButton = document.querySelector('button[data-test="moreJobActionsMenu"]');

    expect(jobActionmenuButton).toBeInTheDocument();
    await userEvent.click(jobActionmenuButton);
    const retryJobsOptionNode = screen.getByRole('menuitem', {name: /retry/i});

    expect(retryJobsOptionNode).toBeInTheDocument();
    await userEvent.click(retryJobsOptionNode);
    expect(screen.getByText(/1 error retried\./i)).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.retrySelected({
      jobs: [{ _id: '321', _flowJobId: '734' }],
      match: {
        isExact: true,
        params: {

        },
        path: '/',
        url: '/',
      },
    }));
    const closeButtonNode = screen.getByRole('button', {
      name: /close/i,
    });

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.retryCommit({parentJobId: '734', childJobId: '321'})));
    await waitFor(() => expect(closeButtonNode).not.toBeInTheDocument());
  });
  test('should test the mark resolved jobs option and by clicking on undo button of snackbar', async () => {
    initJobActionsMenu({
      job: {
        numError: '1',
        numResolved: '1',
        numSuccess: '1',
        numIgnore: '0',
        retriable: false,
        numPagesGenerated: '1',
        numPagesProcessed: '0',
        _id: '321',
        type: 'export',
        _integrationId: '123',
        _exportId: '789',
        _flowId: '456',
        _flowJobId: '734',
        startedAt: '2022-10-17T09:44:52.552Z',
        endedAt: '2022-10-17T09:45:59.879Z',
        lastExecutedAt: '2022-10-17T09:45:59.879Z',
        status: 'completed',
        numOpenError: 3,
        numExport: 0,
        doneExporting: true,
        createdAt: '2022-10-17T09:44:51.077Z',
        lastModified: '2022-10-17T09:45:59.915Z',
        uiStatus: 'completed',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: '0',
        children: [{
          _id: 839,
          uiStatus: 'completed',
        }],
      },
      isFlowBuilderView: true,
      onActionClick: mockOnActionClick,
      userPermissionsOnIntegration: {accessLevel: 'owner', flows: {create: true, edit: true, delete: true, clone: true, attach: true, detach: true}, connections: {create: true, edit: true, register: true}, edit: true, delete: true, clone: true},
      integrationName: 'Test Integration Name',
    });
    const jobActionmenuButton = document.querySelector('button[data-test="moreJobActionsMenu"]');

    expect(jobActionmenuButton).toBeInTheDocument();
    await userEvent.click(jobActionmenuButton);
    const markResolvedOptionNode = screen.getByRole('menuitem', {name: /mark resolved/i});

    expect(markResolvedOptionNode).toBeInTheDocument();
    await userEvent.click(markResolvedOptionNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.resolveSelected({jobs: [{ _id: '321', _flowJobId: '734' }], match: { path: '/', url: '/', params: {}, isExact: true }}));
    expect(screen.getByText(/1 errors marked as resolved\./i)).toBeInTheDocument();
    const undoButtonNode = screen.getByRole('button', {
      name: /undo/i,
    });

    expect(undoButtonNode).toBeInTheDocument();
    await userEvent.click(undoButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.resolveUndo({type: 'JOB_RESOLVE_UNDO', parentJobId: '734', childJobId: '321'}));
    await waitFor(() => expect(undoButtonNode).not.toBeInTheDocument());
  });
  test('should test the mark resolved jobs option and by clicking on close button of snackbar', async () => {
    initJobActionsMenu({
      job: {
        numError: '1',
        numResolved: '1',
        numSuccess: '1',
        numIgnore: '0',
        retriable: false,
        numPagesGenerated: '1',
        numPagesProcessed: '0',
        _id: '321',
        type: 'export',
        _integrationId: '123',
        _exportId: '789',
        _flowId: '456',
        _flowJobId: '734',
        startedAt: '2022-10-17T09:44:52.552Z',
        endedAt: '2022-10-17T09:45:59.879Z',
        lastExecutedAt: '2022-10-17T09:45:59.879Z',
        status: 'completed',
        numOpenError: 3,
        numExport: 0,
        doneExporting: true,
        createdAt: '2022-10-17T09:44:51.077Z',
        lastModified: '2022-10-17T09:45:59.915Z',
        uiStatus: 'completed',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: '0',
        children: [{
          _id: 839,
          uiStatus: 'completed',
        }],
      },
      isFlowBuilderView: true,
      onActionClick: mockOnActionClick,
      userPermissionsOnIntegration: {accessLevel: 'owner', flows: {create: true, edit: true, delete: true, clone: true, attach: true, detach: true}, connections: {create: true, edit: true, register: true}, edit: true, delete: true, clone: true},
      integrationName: 'Test Integration Name',
    });
    const jobActionmenuButton = document.querySelector('button[data-test="moreJobActionsMenu"]');

    expect(jobActionmenuButton).toBeInTheDocument();
    await userEvent.click(jobActionmenuButton);
    const markResolvedOptionNode = screen.getByRole('menuitem', {name: /mark resolved/i});

    expect(markResolvedOptionNode).toBeInTheDocument();
    await userEvent.click(markResolvedOptionNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.resolveSelected({jobs: [{ _id: '321', _flowJobId: '734' }], match: { path: '/', url: '/', params: {}, isExact: true }}));
    expect(screen.getByText(/1 errors marked as resolved\./i)).toBeInTheDocument();
    const closeButtonNode = screen.getByRole('button', {
      name: /close/i,
    });

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.resolveCommit({jobs: [{_id: '321', _flowJobId: '734'}]}));
    await waitFor(() => expect(closeButtonNode).not.toBeInTheDocument());
  });
  test('should test the download files menu option when there are files of more than 1', async () => {
    initJobActionsMenu({
      job: {
        numError: '1',
        numResolved: '1',
        numSuccess: '1',
        numIgnore: '0',
        numPagesGenerated: '1',
        numPagesProcessed: '0',
        _id: '321',
        type: 'flow',
        _integrationId: '123',
        _exportId: '789',
        _flowId: '456',
        _flowJobId: '734',
        startedAt: '2022-10-17T09:44:52.552Z',
        endedAt: '2022-10-17T09:45:59.879Z',
        lastExecutedAt: '2022-10-17T09:45:59.879Z',
        status: 'completed',
        numOpenError: 3,
        numExport: 0,
        doneExporting: true,
        createdAt: '2022-10-17T09:44:51.077Z',
        lastModified: '2022-10-17T09:45:59.915Z',
        uiStatus: 'completed',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: '0',
        children: [{
          _id: 839,
          uiStatus: 'completed',
        }],
        files: [{
          _id: 1,
        },
        {
          _id: 2,
        },
        ],
      },
      isFlowBuilderView: true,
      onActionClick: mockOnActionClick,
      userPermissionsOnIntegration: {accessLevel: 'owner', flows: {create: true, edit: true, delete: true, clone: true, attach: true, detach: true}, connections: {create: true, edit: true, register: true}, edit: true, delete: true, clone: true},
      integrationName: 'Test Integration Name',
    });
    const jobActionmenuButton = document.querySelector('button[data-test="moreJobActionsMenu"]');

    expect(jobActionmenuButton).toBeInTheDocument();
    await userEvent.click(jobActionmenuButton);
    const downloadFilesOptionNode = screen.getByRole('menuitem', {name: /download files/i});

    expect(downloadFilesOptionNode).toBeInTheDocument();
    await userEvent.click(downloadFilesOptionNode);
    expect(screen.getByText(/Mock Job Files Download Dialog/i)).toBeInTheDocument();
    const closeButtonNode = document.querySelector('button[data-test="jobfiledownload_close"]');

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    expect(closeButtonNode).not.toBeInTheDocument();
  });
  test('should test the download file menu option when there is only 1 file', async () => {
    initJobActionsMenu({
      job: {
        numError: '1',
        numResolved: '1',
        numSuccess: '1',
        numIgnore: '0',
        numPagesGenerated: '1',
        numPagesProcessed: '0',
        _id: '321',
        type: 'flow',
        _integrationId: '123',
        _exportId: '789',
        _flowId: '456',
        _flowJobId: '734',
        startedAt: '2022-10-17T09:44:52.552Z',
        endedAt: '2022-10-17T09:45:59.879Z',
        lastExecutedAt: '2022-10-17T09:45:59.879Z',
        status: 'completed',
        numOpenError: 3,
        numExport: 0,
        doneExporting: true,
        createdAt: '2022-10-17T09:44:51.077Z',
        lastModified: '2022-10-17T09:45:59.915Z',
        uiStatus: 'completed',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: '0',
        children: [{
          _id: 839,
          uiStatus: 'completed',
        }],
        files: [{
          _id: 1,
        },
        ],
      },
      isFlowBuilderView: true,
      onActionClick: mockOnActionClick,
      userPermissionsOnIntegration: {accessLevel: 'owner', flows: {create: true, edit: true, delete: true, clone: true, attach: true, detach: true}, connections: {create: true, edit: true, register: true}, edit: true, delete: true, clone: true},
      integrationName: 'Test Integration Name',
    });
    const jobActionmenuButton = document.querySelector('button[data-test="moreJobActionsMenu"]');

    expect(jobActionmenuButton).toBeInTheDocument();
    await userEvent.click(jobActionmenuButton);
    const downloadFileOptionNode = screen.getByRole('menuitem', {name: /download file/i});

    expect(downloadFileOptionNode).toBeInTheDocument();
    await userEvent.click(downloadFileOptionNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.downloadFiles({ jobId: '321' }));
  });
  test('should test the Download diagnostics menu option', async () => {
    initJobActionsMenu({
      job: {
        numError: '1',
        numResolved: '1',
        numSuccess: '1',
        numIgnore: '0',
        numPagesGenerated: '1',
        numPagesProcessed: '0',
        _id: '321',
        type: 'flow',
        _integrationId: '123',
        _exportId: '789',
        _flowId: '456',
        _flowJobId: '734',
        startedAt: '2022-10-17T09:44:52.552Z',
        endedAt: '2022-10-17T09:45:59.879Z',
        lastExecutedAt: '2022-10-17T09:45:59.879Z',
        status: 'completed',
        numOpenError: 3,
        numExport: 0,
        doneExporting: true,
        createdAt: '2022-10-17T09:44:51.077Z',
        lastModified: '2022-10-17T09:45:59.915Z',
        uiStatus: 'completed',
        duration: '00:01:07',
        name: 'Test Integration',
        flowDisabled: false,
        percentComplete: '0',
        children: [{
          _id: 839,
          uiStatus: 'completed',
        }],
      },
      isFlowBuilderView: true,
      onActionClick: mockOnActionClick,
      userPermissionsOnIntegration: {accessLevel: 'owner', flows: {create: true, edit: true, delete: true, clone: true, attach: true, detach: true}, connections: {create: true, edit: true, register: true}, edit: true, delete: true, clone: true},
      integrationName: 'Test Integration Name',
    });
    const jobActionmenuButton = document.querySelector('button[data-test="moreJobActionsMenu"]');

    expect(jobActionmenuButton).toBeInTheDocument();
    await userEvent.click(jobActionmenuButton);
    const downloadDiagnosticsOptionNode = screen.getByRole('menuitem', {name: /Download diagnostics/i});

    expect(downloadDiagnosticsOptionNode).toBeInTheDocument();
    await userEvent.click(downloadDiagnosticsOptionNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.downloadFiles({ jobId: '321', fileType: 'diagnostics' }));
  });
});
