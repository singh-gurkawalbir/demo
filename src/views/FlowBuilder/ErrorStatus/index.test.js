
import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import {mutateStore, reduxStore, renderWithProviders} from '../../../test/test-utils';
import ErrorStatus from '.';

const initialStore = reduxStore;

function initErrorStatus(props) {
  mutateStore(initialStore, draft => {
    draft.user.profile.useErrMgtTwoDotZero = true;
    draft.session.errorManagement.latestFlowJobs = {
      '6253af74cddb8a1ba550a010': {
        status: 'received',
        data: [
          {
            _id: '62c6f1bcae93a81493321aa1',
            lastModified: '2022-07-07T14:46:57.191Z',
          },
        ],
      },
    };
  });

  return renderWithProviders(<MemoryRouter><ErrorStatus {...props} /></MemoryRouter>, {initialStore});
}
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
describe('ErrorStatus UI tests', () => {
  test('should pass the initial render for no errors', () => {
    const props = {isNew: false, flowId: '6253af74cddb8a1ba550a010'};

    initErrorStatus(props);
    expect(screen.getByText('Success')).toBeInTheDocument();
  });
  test('should pass the initial render for given number of errors', () => {
    const props = {isNew: false, flowId: '6253af74cddb8a1ba550a010', count: 2};

    initErrorStatus(props);
    expect(screen.getByText('2 errors')).toBeInTheDocument();
  });
  test('should display empty DOM when flow is run for the first time', () => {
    const props = {isNew: true};
    const {utils} = renderWithProviders(<MemoryRouter><ErrorStatus {...props} /></MemoryRouter>);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should run the onClick function when clicked on number of errors', async () => {
    const props = {isNew: false, flowId: '6253af74cddb8a1ba550a010', count: 2};

    initErrorStatus(props);
    await userEvent.click(screen.getByText('2 errors'));
    expect(mockHistoryPush).toBeCalled();
  });
});
