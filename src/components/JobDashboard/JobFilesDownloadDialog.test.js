
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JobFilesDownloadDialog from './JobFilesDownloadDialog';
import { ConfirmDialogProvider } from '../ConfirmDialog';
import { renderWithProviders } from '../../test/test-utils';

const mockReact = React;

jest.mock('@mui/material/IconButton', () => ({
  __esModule: true,
  ...jest.requireActual('@mui/material/IconButton'),
  default: props => {
    const mockProps = {...props};

    delete mockProps.autoFocus;

    return mockReact.createElement('IconButton', mockProps, mockProps.children);
  },
}));

async function initJobFilesDownloadDialog({job, onCloseClick, initialStore}) {
  const ui = (
    <MemoryRouter>
      <ConfirmDialogProvider>
        <JobFilesDownloadDialog job={job} onCloseClick={onCloseClick} />
      </ConfirmDialogProvider>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
describe('testsuite for Job Files Download Dialog', () => {
  const closeMock = jest.fn();

  test('should test the download button by selecting a file', async () => {
    const job = {
      files: [
        {
          id: 123,
          name: 'test file name 1',
        },
        {
          id: 234,
          name: 'test file name 2',
        },
      ],
    };

    await initJobFilesDownloadDialog({job, onCloseClick: closeMock});
    waitFor(() => {
      expect(screen.getByText(/download files/i)).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /name/i, hidden: true })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: /test file name 1/i, hidden: true })).toBeInTheDocument();
      expect(screen.getByRole('cell', {
        name: /test file name 2/i,
        hidden: true,
      })).toBeInTheDocument();
    });
    let file1CheckBoxNode;

    waitFor(() => {
      file1CheckBoxNode = document.querySelector('div:nth-child(2) > div:nth-child(3) > div > div:nth-child(2) > div > div > table > tbody > tr > td > span > span > input');

      // expect(file1CheckBoxNode).toBeInTheDocument();
      // expect(file1CheckBoxNode).not.toBeChecked();
    });
    await userEvent.click(file1CheckBoxNode);
    waitFor(() => expect(file1CheckBoxNode).toBeChecked());
    waitFor(async () => {
      const downloadButtonNode = screen.getByRole('button', {
        name: /download/i,
      });

      expect(downloadButtonNode).toBeInTheDocument();
      await userEvent.click(downloadButtonNode);
      expect(closeMock).toHaveBeenCalled();
    });
  });
});
