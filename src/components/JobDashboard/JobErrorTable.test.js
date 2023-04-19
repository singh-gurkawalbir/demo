
import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { getCreatedStore } from '../../store';
import { mutateStore, renderWithProviders } from '../../test/test-utils';
import JobErrorTable from './JobErrorTable';
import actions from '../../actions';
import * as utils from '../../utils/resource';
import { ConfirmDialogProvider } from '../ConfirmDialog';

let initialStore;
const mockOnCloseClick = jest.fn();
const someValues = [{ name: 'teresa teng' }];

function initJobErrorTable({
  rowsPerPage,
  jobErrors,
  errorCount,
  job,
  onCloseClick,
  jobErrorsPreviewStatus,
}) {
  mutateStore(initialStore, draft => {
    draft.session.jobErrorsPreview = {
      123: {
        status: jobErrorsPreviewStatus,
      },
    };
    draft.data.jobs = {
      flowJobs: [{
        _id: '234',
        status: 'completed',
        children: [
          {
            _id: '123',
            errorFile: {
              id: 'somegeneratedID',
            },
          },
        ],
      }],
      bulkRetryJobs: [],
      paging: {
        rowsPerPage: 10,
        currentPage: 0,
      },
    };
  });

  const ui = (
    <ConfirmDialogProvider>
      <MemoryRouter>
        <JobErrorTable
          rowsPerPage={rowsPerPage}
          jobErrors={jobErrors}
          errorCount={errorCount}
          job={job}
          onCloseClick={onCloseClick}
      />
      </MemoryRouter>
    </ConfirmDialogProvider>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('../DateTimeDisplay', () => ({
  __esModule: true,
  ...jest.requireActual('../DateTimeDisplay'),
  default: () => (
    <div>Test mock date time display</div>
  ),
}));

describe('testsuite for JobErrorTable', () => {
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
  });
  test('should test the uploading spinner when the job error preview status is requested', () => {
    initJobErrorTable({
      job: {
        _id: 123,
        _parentJobId: 234,
        _flowJobId: 345,
        duration: 'Test Duration',
        status: 'retrying',
        numError: 1,
        numIgnore: 0,
        numSuccess: 1,
        numResolved: 0,
        endedAt: '2022-10-17T09:45:08.516Z',
        flowDisabled: false,
      },
      jobErrors: [{
        resolved: false,
        _retryId: 987,
        retryObject: {
          isRetriable: true,
        },
      }],
      onCloseClick: mockOnCloseClick,
      jobErrorsPreviewStatus: 'requested',
    });
    const spinnerNode = screen.getByRole('progressbar');

    expect(spinnerNode.className).toEqual(expect.stringContaining('MuiCircularProgress-'));
    expect(screen.getByText('Uploading...')).toBeInTheDocument();
  });
  test('should test the loading job error spinner when the job error length is 0', () => {
    initJobErrorTable({
      job: {
        _id: 123,
        _parentJobId: 234,
        _flowJobId: 345,
        duration: 'Test Duration',
        status: 'retrying',
        numError: 1,
        numIgnore: 0,
        numSuccess: 1,
        numResolved: 0,
        endedAt: '2022-10-17T09:45:08.516Z',
        flowDisabled: false,
      },
      jobErrors: [],
      errorCount: 1,
      onCloseClick: mockOnCloseClick,
      jobErrorsPreviewStatus: 'requested',
    });
    const loadingJoBErrorsSpinner = document.querySelector('svg');

    expect(loadingJoBErrorsSpinner).toBeInTheDocument();
    expect(screen.getByText(/Loading job errors/i)).toBeInTheDocument();
  });
  test('should test the disabled button when there are job errors and the job status is retrying', () => {
    initJobErrorTable({
      job: {
        _id: 123,
        _parentJobId: 234,
        _flowJobId: 345,
        duration: 'Test Duration',
        status: 'retrying',
        numError: 1,
        numIgnore: 0,
        numSuccess: 1,
        numResolved: 0,
        endedAt: '2022-10-17T09:45:08.516Z',
        flowDisabled: false,
      },
      jobErrors: [{
        resolved: false,
        _retryId: 987,
        retryObject: {
          isRetriable: true,
        },
      }],
      errorCount: 1,
      onCloseClick: mockOnCloseClick,
      jobErrorsPreviewStatus: 'success',
    });
    const retryingButtonNode = screen.getByRole('button', {
      name: /retrying/i,
    });

    expect(retryingButtonNode).toBeInTheDocument();
    expect(retryingButtonNode).toBeDisabled();
    const markResolvedButtonNode = screen.getByRole('button', {
      name: /mark resolved/i,
    });

    expect(markResolvedButtonNode).toBeInTheDocument();
    expect(markResolvedButtonNode).toBeDisabled();
    const downloadAllErrorsButtonNode = screen.getByRole('button', {
      name: /download all errors/i,
    });

    expect(downloadAllErrorsButtonNode).toBeInTheDocument();
    expect(downloadAllErrorsButtonNode).toBeDisabled();
    const uploadProcessedErrorsButtonNode = screen.getByRole('button', {
      name: /upload processed errors/i,
    });

    expect(uploadProcessedErrorsButtonNode).toBeInTheDocument();
    expect(uploadProcessedErrorsButtonNode).toBeDisabled();
  });
  // eslint-disable-next-line jest/no-commented-out-tests
  //   test('should test the retry all button when there are job errors and the job status is success when number of errors is 1', () => {
  //     initJobErrorTable({
  //       job: {
  //         _id: 123,
  //         _parentJobId: 234,
  //         _flowJobId: 345,
  //         duration: 'Test Duration',
  //         status: 'success',
  //         numError: 1,
  //         numIgnore: 0,
  //         numSuccess: 1,
  //         numResolved: 0,
  //         endedAt: '2022-10-17T09:45:08.516Z',
  //         flowDisabled: false,
  //       },
  //       jobErrors: [{
  //         resolved: false,
  //         _retryId: 987,
  //         retryObject: {
  //           isRetriable: true,
  //         },
  //       }],
  //       errorCount: 1,
  //       onCloseClick: mockOnCloseClick,
  //       jobErrorsPreviewStatus: 'success',
  //     });
  //     const retryAllButtonNode = screen.getByRole('button', {
  //       name: /retry all/i,
  //     });

  //     expect(retryAllButtonNode).toBeInTheDocument();
  //     await userEvent.click(retryAllButtonNode);
  //     expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.retrySelected({
  //       jobs: [{ _flowJobId: 234, _id: 123 }],
  //       match: { path: '/', url: '/', params: {}, isExact: true },
  //     }));
  //     expect(screen.getByText(/1 errors retried\./i)).toBeInTheDocument();
  //     const undoButtonNode = screen.getByRole('button', {
  //       name: /undo/i,
  //     });

  //     expect(undoButtonNode).toBeInTheDocument();
  //     await userEvent.click(undoButtonNode);
  //     expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.retryUndo({ parentJobId: 234, childJobId: 123 }));
  //   });
  test('should test the retry all button when there are job errors and the job status is success when number of errors is 1', async () => {
    initJobErrorTable({
      job: {
        _id: '123',
        _parentJobId: '234',
        _flowJobId: '345',
        duration: 'Test Duration',
        status: 'success',
        numError: '1',
        numIgnore: '0',
        numSuccess: '1',
        numResolved: '0',
        endedAt: '2022-10-17T09:45:08.516Z',
        flowDisabled: false,
      },
      jobErrors: [{
        resolved: false,
        _retryId: '987',
        retryObject: {
          isRetriable: true,
        },
      }],
      errorCount: '1',
      onCloseClick: mockOnCloseClick,
      jobErrorsPreviewStatus: 'success',
    });
    const retryAllButtonNode = screen.getByRole('button', {
      name: /retry all/i,
    });

    expect(retryAllButtonNode).toBeInTheDocument();
    await userEvent.click(retryAllButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.retrySelected({
      jobs: [{ _flowJobId: '234', _id: '123' }],
      match: { path: '/', url: '/', params: {}, isExact: true },
    }));
    expect(screen.getByText(/1 error retried\./i)).toBeInTheDocument();
    const undoButtonNode = screen.getByRole('button', {
      name: /undo/i,
    });

    expect(undoButtonNode).toBeInTheDocument();
    await userEvent.click(undoButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.retryUndo({ parentJobId: '234', childJobId: '123' }));
    await waitFor(() => expect(undoButtonNode).not.toBeInTheDocument());
  });
  test('should test the retry all button when there are job errors and the job status is success when number of errors is greater than 1', async () => {
    initJobErrorTable({
      job: {
        _id: '123',
        _parentJobId: '234',
        _flowJobId: '345',
        duration: 'Test Duration',
        status: 'success',
        numError: '2',
        numIgnore: '0',
        numSuccess: '1',
        numResolved: '0',
        endedAt: '2022-10-17T09:45:08.516Z',
        flowDisabled: false,
      },
      jobErrors: [{
        resolved: false,
        _retryId: '987',
        retryObject: {
          isRetriable: true,
        },
      },
      {
        resolved: false,
        _retryId: 765,
        retryObject: {
          isRetriable: true,
        },
      }],
      errorCount: '2',
      onCloseClick: mockOnCloseClick,
      jobErrorsPreviewStatus: 'success',
    });
    const retryAllButtonNode = screen.getByRole('button', {
      name: /retry all/i,
    });

    expect(retryAllButtonNode).toBeInTheDocument();
    await userEvent.click(retryAllButtonNode);
    expect(screen.getByText(/2 errors retried\./i)).toBeInTheDocument();
    const closeButtonNode = screen.getByRole('button', {
      name: /close/i,
    });

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.retryCommit({jobs: [{_flowJobId: '234'}]}));
    await waitFor(() => expect(closeButtonNode).not.toBeInTheDocument());
  });
  test('should test the retry all button after selecting an error', async () => {
    initJobErrorTable({
      job: {
        _id: '123',
        _parentJobId: '234',
        _flowJobId: '345',
        duration: 'Test Duration',
        status: 'success',
        numError: '2',
        numIgnore: '0',
        numSuccess: '1',
        numResolved: '0',
        endedAt: '2022-10-17T09:45:08.516Z',
        flowDisabled: false,
      },
      jobErrors: [{
        _id: '1',
        resolved: false,
        _retryId: '987',
        retryObject: {
          isRetriable: true,
        },
      },
      {
        _id: '2',
        resolved: false,
        _retryId: '765',
        retryObject: {
          isRetriable: true,
        },
      }],
      errorCount: '2',
      onCloseClick: mockOnCloseClick,
      jobErrorsPreviewStatus: 'success',
    });
    const retryAllButtonNode = screen.getByRole('button', {
      name: 'Retry all',
    });

    expect(retryAllButtonNode).toBeInTheDocument();
    const checkboxButtonNode = screen.getAllByRole('checkbox');

    expect(checkboxButtonNode[0]).toBeInTheDocument();
    await userEvent.click(checkboxButtonNode[0]);
    const retry2errorsButtonNode = screen.getByRole('button', {name: 'Retry 2 errors'});

    expect(retry2errorsButtonNode).toBeInTheDocument();
    await userEvent.click(retry2errorsButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.retrySelectedRetries({jobId: '123',
      flowJobId: '234',
      selectedRetryIds: ['987', '765'],
      match: { path: '/', url: '/', params: {}, isExact: true }}));
  });
  test('should test the retry all button after selecting a single error', async () => {
    initJobErrorTable({
      job: {
        _id: '123',
        _parentJobId: '234',
        _flowJobId: '345',
        duration: 'Test Duration',
        status: 'success',
        numError: '1',
        numIgnore: '0',
        numSuccess: '1',
        numResolved: '0',
        endedAt: '2022-10-17T09:45:08.516Z',
        flowDisabled: false,
      },
      jobErrors: [{
        _id: '1',
        resolved: false,
        _retryId: '987',
        retryObject: {
          isRetriable: true,
        },
      }],
      errorCount: '1',
      onCloseClick: mockOnCloseClick,
      jobErrorsPreviewStatus: 'success',
    });
    const retryAllButtonNode = screen.getByRole('button', {
      name: 'Retry all',
    });

    expect(retryAllButtonNode).toBeInTheDocument();
    const checkboxButtonNode = screen.getAllByRole('checkbox');

    expect(checkboxButtonNode[0]).toBeInTheDocument();
    await userEvent.click(checkboxButtonNode[0]);
    const retry1errorButtonNode = screen.getByRole('button', {name: 'Retry 1 error'});

    expect(retry1errorButtonNode).toBeInTheDocument();
    await userEvent.click(retry1errorButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.retrySelectedRetries({jobId: '123',
      flowJobId: '234',
      selectedRetryIds: ['987'],
      match: { path: '/', url: '/', params: {}, isExact: true }}));
  });
  test('should test the disabled mark resolved button when there are resolved jobs', () => {
    initJobErrorTable({
      job: {
        _id: '123',
        _parentJobId: '234',
        _flowJobId: '345',
        duration: 'Test Duration',
        status: 'success',
        numError: '1',
        numIgnore: '0',
        numSuccess: '1',
        numResolved: '0',
        endedAt: '2022-10-17T09:45:08.516Z',
        flowDisabled: false,
      },
      jobErrors: [{
        _id: '1',
        resolved: true,
        _retryId: '987',
        retryObject: {
          isRetriable: true,
        },
      }],
      errorCount: '1',
      onCloseClick: mockOnCloseClick,
      jobErrorsPreviewStatus: 'success',
    });
    const markResolvedButtonNode = screen.getByRole('button', {name: /mark resolved/i});

    expect(markResolvedButtonNode).toBeInTheDocument();
    expect(markResolvedButtonNode).toBeDisabled();
  });
  test('should test the mark resolved button when there are no resolved jobs and only 1 job error', async () => {
    initJobErrorTable({
      job: {
        _id: '123',
        _parentJobId: '234',
        _flowJobId: '345',
        duration: 'Test Duration',
        status: 'success',
        numError: '1',
        numIgnore: '0',
        numSuccess: '1',
        numResolved: '0',
        endedAt: '2022-10-17T09:45:08.516Z',
        flowDisabled: false,
      },
      jobErrors: [{
        _id: '1',
        resolved: false,
        _retryId: '987',
        retryObject: {
          isRetriable: true,
        },
      }],
      errorCount: '1',
      onCloseClick: mockOnCloseClick,
      jobErrorsPreviewStatus: 'success',
    });
    const markResolvedButtonNode = screen.getByRole('button', {name: /mark resolved/i});

    expect(markResolvedButtonNode).toBeInTheDocument();
    const checkboxNode = screen.getAllByRole('checkbox');

    expect(checkboxNode[0]).toBeInTheDocument();
    await userEvent.click(checkboxNode[0]);
    expect(markResolvedButtonNode.textContent).toBe('Mark resolved 1 error');
    await userEvent.click(markResolvedButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.resolveSelectedErrors({jobId: '123',
      flowJobId: '234',
      selectedErrorIds: ['1'],
      match: { path: '/', url: '/', params: {}, isExact: true }}));
  });
  test('should test the mark resolved button when there are no resolved jobs and more than more than 1 job error', async () => {
    initJobErrorTable({
      job: {
        _id: '123',
        _parentJobId: '234',
        _flowJobId: '345',
        duration: 'Test Duration',
        status: 'success',
        numError: '1',
        numIgnore: '0',
        numSuccess: '1',
        numResolved: '0',
        endedAt: '2022-10-17T09:45:08.516Z',
        flowDisabled: false,
      },
      jobErrors: [{
        _id: '1',
        resolved: false,
        _retryId: '987',
        retryObject: {
          isRetriable: true,
        },
      },
      {
        _id: '2',
        resolved: false,
        _retryId: '986',
        retryObject: {
          isRetriable: true,
        },
      }],
      errorCount: '1',
      onCloseClick: mockOnCloseClick,
      jobErrorsPreviewStatus: 'success',
    });
    const markResolvedButtonNode = screen.getByRole('button', {name: /mark resolved/i});

    expect(markResolvedButtonNode).toBeInTheDocument();
    const checkboxNode = screen.getAllByRole('checkbox');

    expect(checkboxNode[0]).toBeInTheDocument();
    await userEvent.click(checkboxNode[0]);
    expect(markResolvedButtonNode.textContent).toBe('Mark resolved 2 errors');
    await userEvent.click(markResolvedButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.resolveSelectedErrors({
      jobId: '123',
      flowJobId: '234',
      selectedErrorIds: ['1', '2'],
      match: { path: '/', url: '/', params: {}, isExact: true },
    }));
  });
  test('should test the mark resolved button without selecting a job and by clicking on undo button of snackbar', async () => {
    initJobErrorTable({
      job: {
        _id: '123',
        _parentJobId: '234',
        _flowJobId: '345',
        duration: 'Test Duration',
        status: 'success',
        numError: '1',
        numIgnore: '0',
        numSuccess: '1',
        numResolved: '0',
        endedAt: '2022-10-17T09:45:08.516Z',
        flowDisabled: false,
      },
      jobErrors: [{
        _id: '1',
        resolved: false,
        _retryId: '987',
        retryObject: {
          isRetriable: false,
        },
      }],
      errorCount: '1',
      onCloseClick: mockOnCloseClick,
      jobErrorsPreviewStatus: 'success',
    });
    const markResolvedButtonNode = screen.getByRole('button', {name: /mark resolved/i});

    expect(markResolvedButtonNode).toBeInTheDocument();
    await userEvent.click(markResolvedButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.resolveSelected({
      jobs: [{ _flowJobId: '234', _id: '123' }],
      match: { path: '/', url: '/', params: {}, isExact: true },
    }));
    expect(screen.getByText(/1 errors marked as resolved\./i)).toBeInTheDocument();
    const undoButtonNode = screen.getByRole('button', {
      name: /undo/i,
    });

    expect(undoButtonNode).toBeInTheDocument();
    await userEvent.click(undoButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.resolveUndo({ parentJobId: '234', childJobId: '123' }));
  });
  test('should test the mark resolved button without selecting a job and by clicking on close button of snackbar', async () => {
    initJobErrorTable({
      job: {
        _id: '123',
        _parentJobId: '234',
        _flowJobId: '345',
        duration: 'Test Duration',
        status: 'success',
        numError: '1',
        numIgnore: '0',
        numSuccess: '1',
        numResolved: '0',
        endedAt: '2022-10-17T09:45:08.516Z',
        flowDisabled: false,
      },
      jobErrors: [{
        _id: '1',
        resolved: false,
        _retryId: '987',
        retryObject: {
          isRetriable: false,
        },
      }],
      errorCount: '1',
      onCloseClick: mockOnCloseClick,
      jobErrorsPreviewStatus: 'success',
    });
    const markResolvedButtonNode = screen.getByRole('button', {name: /mark resolved/i});

    expect(markResolvedButtonNode).toBeInTheDocument();
    await userEvent.click(markResolvedButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.resolveSelected({
      jobs: [{ _flowJobId: '234', _id: '123' }],
      match: { path: '/', url: '/', params: {}, isExact: true },
    }));
    expect(screen.getByText(/1 errors marked as resolved\./i)).toBeInTheDocument();
    const closeButtonNode = screen.getByRole('button', {
      name: /close/i,
    });

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.resolveCommit({ parentJobId: '234', childJobId: '123' }));
  });
  test('should test the download all errors button', async () => {
    initJobErrorTable({
      job: {
        _id: '123',
        _parentJobId: '234',
        _flowJobId: '345',
        duration: 'Test Duration',
        status: 'success',
        numError: '1',
        numIgnore: '0',
        numSuccess: '1',
        numResolved: '0',
        endedAt: '2022-10-17T09:45:08.516Z',
        flowDisabled: false,
      },
      jobErrors: [{
        _id: '1',
        resolved: false,
        _retryId: '987',
        retryObject: {
          isRetriable: false,
        },
      }],
      errorCount: '1',
      onCloseClick: mockOnCloseClick,
      jobErrorsPreviewStatus: 'success',
    });
    const downloadAllErrorsButtonNode = screen.getByRole('button', {name: /download all errors/i});

    expect(downloadAllErrorsButtonNode).toBeInTheDocument();
    await userEvent.click(downloadAllErrorsButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.downloadFiles({jobId: '123',
      fileType: 'errors'}));
  });
  test('should test the Upload processed errors button and upload the non csv file', async () => {
    jest.spyOn(utils, 'generateNewId').mockReturnValue('somegeneratedID');
    initJobErrorTable({
      job: {
        _id: '123',
        _parentJobId: '234',
        _flowJobId: '345',
        duration: 'Test Duration',
        status: 'success',
        numError: '1',
        numIgnore: '0',
        numSuccess: '1',
        numResolved: '0',
        endedAt: '2022-10-17T09:45:08.516Z',
        flowDisabled: false,
      },
      jobErrors: [{
        _id: '1',
        resolved: false,
        _retryId: '987',
        retryObject: {
          isRetriable: false,
        },
      }],
      errorCount: '1',
      onCloseClick: mockOnCloseClick,
      jobErrorsPreviewStatus: 'success',
    });
    const uploadProcessedErrorsButtonNode = screen.getByRole('button', {name: 'Upload processed errors'});

    expect(uploadProcessedErrorsButtonNode).toBeInTheDocument();
    const str = JSON.stringify(someValues);
    const blob = new Blob([str]);
    const file = new File([blob], 'values.json', {
      type: 'application/JSON',
    });

    File.prototype.text = jest.fn().mockResolvedValueOnce(str);
    const input = document.querySelector('input[data-test="uploadFile"]');

    await userEvent.click(uploadProcessedErrorsButtonNode);

    // userEvent.upload(input, file);
    fireEvent.change(input, { target: { files: { item: () => file, length: 1, 0: file } } });
    expect(screen.getByText(/confirm upload/i)).toBeInTheDocument();
    const uploadButtonNode = screen.getByRole('button', {name: 'Upload'});

    expect(uploadButtonNode).toBeInTheDocument();
    await userEvent.click(uploadButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.file.processFile({
      fileId: 'somegeneratedID',
      file,
      fileType: 'csv',
    }));
  });
  test('should test the Upload processed errors button and upload the csv file', async () => {
    jest.spyOn(utils, 'generateNewId').mockReturnValue('somegeneratedID');
    initJobErrorTable({
      job: {
        _id: '123',
        _parentJobId: '234',
        _flowJobId: '345',
        duration: 'Test Duration',
        status: 'success',
        numError: '1',
        numIgnore: '0',
        numSuccess: '1',
        numResolved: '0',
        endedAt: '2022-10-17T09:45:08.516Z',
        flowDisabled: false,
      },
      jobErrors: [{
        _id: '1',
        resolved: false,
        _retryId: '987',
        retryObject: {
          isRetriable: false,
        },
      }],
      errorCount: '1',
      onCloseClick: mockOnCloseClick,
      jobErrorsPreviewStatus: 'success',
    });
    const uploadProcessedErrorsButtonNode = screen.getByRole('button', {name: 'Upload processed errors'});

    expect(uploadProcessedErrorsButtonNode).toBeInTheDocument();
    const str = JSON.stringify(someValues);
    const blob = new Blob([str]);
    const file = new File([blob], 'somegeneratedID.csv', {
      type: 'application/csv',
    });

    File.prototype.text = jest.fn().mockResolvedValueOnce(str);
    const input = document.querySelector('input[data-test="uploadFile"]');

    await userEvent.click(uploadProcessedErrorsButtonNode);

    // userEvent.upload(input, file);
    fireEvent.change(input, { target: { files: { item: () => file, length: 1, 0: file } } });
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.file.processFile({
      fileId: 'somegeneratedID',
      file,
      fileType: 'csv',
    }));
  });
  test('should test the Upload processed errors button when we not select a file', async () => {
    initJobErrorTable({
      job: {
        _id: '123',
        _parentJobId: '234',
        _flowJobId: '345',
        duration: 'Test Duration',
        status: 'success',
        numError: '1',
        numIgnore: '0',
        numSuccess: '1',
        numResolved: '0',
        endedAt: '2022-10-17T09:45:08.516Z',
        flowDisabled: false,
      },
      jobErrors: [{
        _id: '1',
        resolved: false,
        _retryId: '987',
        retryObject: {
          isRetriable: false,
        },
      }],
      errorCount: '1',
      onCloseClick: mockOnCloseClick,
      jobErrorsPreviewStatus: 'success',
    });
    const uploadProcessedErrorsButtonNode = screen.getByRole('button', {name: 'Upload processed errors'});

    expect(uploadProcessedErrorsButtonNode).toBeInTheDocument();
    const input = document.querySelector('input[data-test="uploadFile"]');

    await userEvent.click(uploadProcessedErrorsButtonNode);

    // userEvent.upload(input, '');
    fireEvent.change(input, { target: { files: { item: () => '', length: 1, 0: '' } } });
    expect(mockDispatchFn).not.toHaveBeenCalledWith(actions.file.processFile({}));
    expect(screen.queryByText(/confirm upload/i)).not.toBeInTheDocument();
  });
});
