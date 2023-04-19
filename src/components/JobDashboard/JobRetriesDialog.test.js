
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JobRetriesDialog from './JobRetriesDialog';
import { renderWithProviders } from '../../test/test-utils';
import { ConfirmDialogProvider } from '../ConfirmDialog';

async function initJobDialog({job, integrationName, onCloseClick}) {
  const ui = (
    <MemoryRouter>
      <ConfirmDialogProvider>
        <JobRetriesDialog job={job} integrationName={integrationName} onCloseClick={onCloseClick} />
      </ConfirmDialogProvider>
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

const mockClose = jest.fn();

jest.mock('../DateTimeDisplay', () => ({
  __esModule: true,
  ...jest.requireActual('../DateTimeDisplay'),
  default: jest.fn().mockReturnValue('mockdate'),
}));
describe('testsuite for JobDialog', () => {
  test('should render the job dialog with the job data', async () => {
    await initJobDialog({
      job: {
        _id: 123,
        name: 'test job name',
        numIgnore: 0,
        numSuccess: 1,
        numError: 0,
        retries: [{
          _id: '098',
          name: 'test job name',
          status: 'completed',
          duration: '30 sec',
          endedAt: '2020-01-17T06:56:03.401Z',
        }],
      },
      integrationName: 'test integration name',
      onCloseClick: mockClose,
    });
    expect(screen.getByRole('heading', { name: 'test integration name > test job name', hidden: true })).toBeInTheDocument();
    expect(screen.getByText(/success: 1 ignore: 0 error: 0/i)).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /retry #/i, hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /duration/i, hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /completed/i, hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: /1/i, hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /30 sec/i, hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /mockdate/i, hidden: true })).toBeInTheDocument();
    const closeButtonNode = screen.getAllByRole('button').find(eachOptions => eachOptions.getAttribute('data-test') === 'closeJobRetriesDialog');

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    expect(mockClose).toHaveBeenCalled();
  });
  test('should render the job dialog with the job data with no job name', async () => {
    await initJobDialog({
      job: {
        _id: 123,
        numIgnore: 0,
        numSuccess: 1,
        numError: 0,
        retries: [{
          _id: '098',
          status: 'completed',
          duration: '30 sec',
          endedAt: '2020-01-17T06:56:03.401Z',
        }],
      },
      onCloseClick: mockClose,
    });
    expect(screen.getByRole('heading', {
      name: 'undefined > undefined',
      hidden: true,
    })).toBeInTheDocument();
  });
});
