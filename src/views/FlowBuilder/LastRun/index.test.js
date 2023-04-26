
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import {mutateStore, reduxStore, renderWithProviders} from '../../../test/test-utils';
import LastRun from '.';

const initialStore = reduxStore;

function initLastRun(props) {
  mutateStore(initialStore, draft => {
    draft.user.profile.useErrMgtTwoDotZero = true;
    draft.session.errorManagement.latestFlowJobs = {
      '6253af74cddb8a1ba550a010': {
        data: [
          {
            _id: '62c6f1bcae93a81493321aa1',
            lastModified: '2022-07-07T14:46:57.191Z',
            lastExecutedAt: props.last,
            status: props.status,
            endedAt: props.date,
          },
        ],
      },
    };
  });

  return renderWithProviders(<LastRun {...props} />, {initialStore});
}
jest.mock('@celigo/fuse-ui', () => ({
  __esModule: true,
  ...jest.requireActual('@celigo/fuse-ui'),
  Spinner: () =>
    (
      <div>Spinner</div>
    )
  ,
}));
describe('LastRun UI tests', () => {
  test('should display empty DOM,when flow status is completed', () => {
    const props = {status: 'completed'};

    const {utils} = initLastRun(props);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should display the spinner when flow status is running or waiting in a queue', () => {
    const props = {flowId: '6253af74cddb8a1ba550a010', status: 'running'};

    initLastRun(props);
    waitFor(() => expect(screen.getByText('Spinner')).toBeInTheDocument());
  });
  test('should display the spinner when flow status is queued or waiting in a queue', () => {
    const props = {flowId: '6253af74cddb8a1ba550a010', status: 'queued'};

    initLastRun(props);
    waitFor(() => expect(screen.getByText('Spinner')).toBeInTheDocument());
  });
  test('should display the last run time when a flow contains lastExecuted time', () => {
    const props = {flowId: '6253af74cddb8a1ba550a010', status: 'completed', last: '2022-07-07T14:46:57.185Z'};

    initLastRun(props);
    waitFor(() => expect(screen.getByText('Last run:')).toBeInTheDocument());
    waitFor(() => expect(screen.getByText('07/07/2022 2:46:57 pm')).toBeInTheDocument());
  });
  test('should display the endTime of the flow when lastExecuted time is not present', () => {
    const props = {flowId: '6253af74cddb8a1ba550a010', status: 'completed', date: '2022-07-07T14:46:57.185Z'};

    initLastRun(props);
    waitFor(() => expect(screen.getByText('Last run:')).toBeInTheDocument());
    waitFor(() => expect(screen.getByText('07/07/2022 2:46:57 pm')).toBeInTheDocument());
  });
});
