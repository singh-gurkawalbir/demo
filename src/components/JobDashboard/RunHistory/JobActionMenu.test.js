/* eslint-disable react/button-has-type */

import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import JobActionsMenu from './JobActionsMenu';
import {renderWithProviders} from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';
import { ConfirmDialogProvider } from '../../ConfirmDialog';
import actions from '../../../actions';

let initialStore;

function initJobActionMenu({job}) {
  const ui = (
    <ConfirmDialogProvider>
      <JobActionsMenu job={job} />
    </ConfirmDialogProvider>
  );

  return renderWithProviders(ui, {initialStore});
}
jest.mock('../JobFilesDownloadDialog', () => ({
  __esModule: true,
  ...jest.requireActual('../JobFilesDownloadDialog'),
  default: props =>
    (
      <>
        <div>Clicked on Downloads Button</div>
        <button data-test="closeJobFilesDownloadDialog" onClick={props.onCloseClick}>
          Close
        </button>
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
  });
  test('should test the download diagnostics button', async () => {
    const job = {
      _id: '12345',
      files: [{
        host: 's3',
        id: '67890',
      }],
    };

    initJobActionMenu({job});
    const moreJobActionMenuButtonNode = document.querySelector('button[data-test="moreJobActionsMenu"]');

    expect(moreJobActionMenuButtonNode).toBeInTheDocument();
    await userEvent.click(moreJobActionMenuButtonNode);
    const downloadDiagnosticsButtonNode = screen.getByRole('menuitem', {
      name: /download diagnostics/i,
    });

    expect(downloadDiagnosticsButtonNode).toBeInTheDocument();
    const downloadFileButtonNode = screen.getByRole('menuitem', {
      name: /download file/i,
    });

    expect(downloadFileButtonNode).toBeInTheDocument();
    await userEvent.click(downloadDiagnosticsButtonNode);
    await waitFor(() => expect(downloadFileButtonNode).not.toBeInTheDocument());
    expect(mockDispatchFn).toHaveBeenCalledWith({fileIds: undefined, fileType: 'diagnostics', jobId: '12345', type: 'JOB_DOWNLOAD_FILES'});
  });
  test('should test the download file button when the file length is not greater than 1', async () => {
    const job = {
      _id: '12345',
      files: [{
        host: 's3',
        id: '67890',
      }],
    };

    initJobActionMenu({job});
    const moreJobActionMenuButtonNode = document.querySelector('button[data-test="moreJobActionsMenu"]');

    expect(moreJobActionMenuButtonNode).toBeInTheDocument();
    await userEvent.click(moreJobActionMenuButtonNode);
    const downloadDiagnosticsButtonNode = screen.getByRole('menuitem', {
      name: /download diagnostics/i,
    });

    expect(downloadDiagnosticsButtonNode).toBeInTheDocument();
    const downloadFileButtonNode = screen.getByRole('menuitem', {
      name: /download file/i,
    });

    expect(downloadFileButtonNode).toBeInTheDocument();
    await userEvent.click(downloadFileButtonNode);
    await waitFor(() => expect(downloadFileButtonNode).not.toBeInTheDocument());
    expect(mockDispatchFn).toHaveBeenCalledWith({fileIds: undefined, fileType: undefined, jobId: '12345', type: 'JOB_DOWNLOAD_FILES'});
  });
  test('should test the download file button when the file length is not greater than 1 duplicate', async () => {
    const job = {
      _id: '12345',
      files: [
        {
          host: 's3',
          id: '67890',
        },
        {
          host: 's3',
          id: '76543',
        },
      ],
    };

    initJobActionMenu({job});
    const moreJobActionMenuButtonNode = document.querySelector('button[data-test="moreJobActionsMenu"]');

    expect(moreJobActionMenuButtonNode).toBeInTheDocument();
    await userEvent.click(moreJobActionMenuButtonNode);
    const downloadDiagnosticsButtonNode = screen.getByRole('menuitem', {
      name: /download diagnostics/i,
    });

    expect(downloadDiagnosticsButtonNode).toBeInTheDocument();
    const downloadFilesButtonNode = screen.getByRole('menuitem', {
      name: /download files/i,
    });

    expect(downloadFilesButtonNode).toBeInTheDocument();
    await userEvent.click(downloadFilesButtonNode);
    await waitFor(() => expect(downloadFilesButtonNode).not.toBeInTheDocument());
    expect(screen.getByText(/Clicked on Downloads Button/i)).toBeInTheDocument();
    const modalCloseButtonNode = document.querySelector('button[data-test="closeJobFilesDownloadDialog"]');

    expect(modalCloseButtonNode).toBeInTheDocument();
    await userEvent.click(modalCloseButtonNode);
    await waitFor(() => expect(modalCloseButtonNode).not.toBeInTheDocument());
  });
  test('should test the purge file button when the files are present', async () => {
    const job = {
      _id: '12345',
      files: [{
        host: 's3',
        id: '67890',
      }],
    };

    initJobActionMenu({job});
    const moreJobActionMenuButtonNode = document.querySelector('button[data-test="moreJobActionsMenu"]');

    expect(moreJobActionMenuButtonNode).toBeInTheDocument();
    await userEvent.click(moreJobActionMenuButtonNode);
    const downloadDiagnosticsButtonNode = screen.getByRole('menuitem', {
      name: /download diagnostics/i,
    });

    expect(downloadDiagnosticsButtonNode).toBeInTheDocument();
    const downloadFileButtonNode = screen.getByRole('menuitem', {
      name: /download file/i,
    });

    expect(downloadFileButtonNode).toBeInTheDocument();
    const purgeFileButtonNode = screen.getByRole('menuitem', {
      name: /purge file/i,
    });

    expect(purgeFileButtonNode).toBeInTheDocument();
    await userEvent.click(purgeFileButtonNode);
    const purgeFileConfirmButtonNode = screen.getByRole('button', {
      name: /purge files/i,
    });

    expect(purgeFileConfirmButtonNode).toBeInTheDocument();
    const cancelButtonNode = screen.getByRole('button', {
      name: /Cancel/i,
    });

    expect(cancelButtonNode).toBeInTheDocument();
    await userEvent.click(purgeFileConfirmButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.job.purge.request({ jobId: job._id }));
  });
});
