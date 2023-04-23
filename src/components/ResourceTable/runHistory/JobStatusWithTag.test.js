
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import JobStatusWithTag from './JobStatusWithTag';
import { getCreatedStore } from '../../../store';

function initJobStatusWithTag(props, initialStore) {
  const ui = (
    <JobStatusWithTag {...props} />
  );

  return renderWithProviders(ui, {initialStore});
}

describe('jobStatusWithTag test cases', () => {
  test('should show completed message with errors', () => {
    initJobStatusWithTag({job: {status: 'completedWithErrors'}});
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
  test('should show completed message without errors', () => {
    initJobStatusWithTag({job: {status: 'completed'}});
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
  test('should show canceled message', () => {
    initJobStatusWithTag({job: {status: 'canceled'}});
    expect(screen.getByText('Canceled')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
  test('should show failed message', () => {
    initJobStatusWithTag({job: {status: 'failed'}});
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });
  test('should show Random message', () => {
    initJobStatusWithTag({job: {status: 'random'}});
    expect(screen.getByText('random')).toBeInTheDocument();
  });
  test('should show complete with errors and error', () => {
    initJobStatusWithTag({job: {status: 'completed', numOpenError: 1}});
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
  test('should show complete with errors and error duplicate', () => {
    initJobStatusWithTag({job: {status: 'completed', numOpenError: 1}});
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
  test('should show empty dom when no props are provided', () => {
    const {utils} = initJobStatusWithTag({});

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should be able to view who canceled the flow', () => {
    const job = {
      status: 'canceled',
      type: 'flow',
      _integrationId: '60036fsj7',
      canceledBy: '6245ad1673',
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.integrationAShares[job._integrationId] = [{
        _id: 'sampleId',
        sharedWithUser: {
          _id: job.canceledBy,
          name: 'lorem ipsum dolor sit amet',
          email: 'sample@e.mail',
        },
      }];
    });

    initJobStatusWithTag({job}, initialStore);
    expect(screen.getByText('Canceled')).toBeInTheDocument();
    const infoButton = screen.getByRole('button');

    userEvent.click(infoButton);
    const canceledByInfo = screen.getByRole('tooltip');

    expect(canceledByInfo).toHaveTextContent('Canceled by lorem ipsum dolor sit amet');
  });
});
