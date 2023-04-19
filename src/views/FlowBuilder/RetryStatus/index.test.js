
import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import {mutateStore, reduxStore, renderWithProviders} from '../../../test/test-utils';
import RetryStatus from '.';

const initialStore = reduxStore;

function initRetryStatus(props) {
  const flows = [
    {
      _id: 'f1',
      _exportId: 'e1',
      _importId: 'i1',
      p1: 1,
      p2: 2,
      _integrationId: 'i1',
    },
    {
      _id: 'f2',
      pageGenerators: [{ _exportId: 'e1', type: 'export' }, { _exportId: 'e2', type: 'export' }],
      _integrationId: 'i1',
    },
    {
      _id: 'f3',
      pageProcessors: [
        { _exportId: 'e1', type: 'export' },
        { _importId: 'i1', type: 'import' },
        { _exportId: 'e2', type: 'export' },
      ],
      _integrationId: 'i1',
    },
    {
      _id: 'f4',
      pageGenerators: [{ _exportId: 'e1', type: 'export' }, { _exportId: 'e2', type: 'export' }],
      pageProcessors: [
        { _exportId: 'e3', type: 'export' },
        { _importId: 'i1', type: 'import' },
        { _exportId: 'e4', type: 'export' },
        { _importId: 'i2', type: 'import' },
      ],
      _integrationId: 'i1',
    },
    {
      _id: 'f5',
      pageGenerators: [{ _exportId: 'e1', type: 'export' }],
      pageProcessors: [
        { _importId: 'i1', type: 'import' },
      ],
      _integrationId: 'i1',
    },
  ];
  const exports = [{
    _id: 'e1',
    name: 'e1',
    _connectionId: 'c1',
  },
  {
    _id: 'e2',
    name: 'e2',
    _connectionId: 'c2',
  }, {
    _id: 'e3',
    name: 'e3',
    _connectionId: 'c3',
  }];
  const imports = [{
    _id: 'i1',
    name: 'i1',
    _connectionId: 'c1',
  }, {
    _id: 'i2',
    name: 'i2',
    _connectionId: 'c4',
  }];

  mutateStore(initialStore, draft => {
    draft.data.resources = {
      flows,
      exports,
      imports,
    };
    draft.session.errorManagement.retryData.retryStatus = {
      f1: {},
      f2: {
        e1: 'inProgress',
        e2: 'requested',
      },
      f3: {
        e1: 'inProgress',
        i1: 'completed',
      },
      f4: {
        e1: 'completed',
        i1: 'completed',
      },
      f5: {
        e1: 'completed',
      },
    };
  });

  return renderWithProviders(<MemoryRouter><RetryStatus {...props} /></MemoryRouter>, {initialStore});
}
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
describe('RetryStatus UI tests', () => {
  test('should display empty DOM when there are no retries in a flow', () => {
    const props = {flowId: 'f1'};
    const {utils} = renderWithProviders(<MemoryRouter><RetryStatus {...props} /></MemoryRouter>);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should pass the initial render if a flow has retry in progress', () => {
    const props = {flowId: 'f2'};

    initRetryStatus(props);
    expect(screen.getByText('Retrying errors...')).toBeInTheDocument();
  });
  test('should show retrying errors message if a flow has retry in progress and even if a retry is completed', () => {
    const props = {flowId: 'f3'};

    initRetryStatus(props);
    expect(screen.getByText('Retrying errors...')).toBeInTheDocument();
  });
  test('should show retrying completed message if a flow has no retry in progress and also if a retry is completed', () => {
    const props = {flowId: 'f5'};

    initRetryStatus(props);
    expect(screen.getByText('Retry completed.')).toBeInTheDocument();
  });
  test('should run the onClick function when clicked on view results', async () => {
    const props = {flowId: 'f5'};

    initRetryStatus(props);
    await userEvent.click(screen.getByText('View results'));
    expect(mockHistoryPush).toBeCalled();
  });
  test('should open a dropdown when clicked on view results and a user retried a error for more than one step', async () => {
    const props = {flowId: 'f4'};

    initRetryStatus(props);
    await userEvent.click(screen.getByText('View results'));
    // On clicking the View results, a dropdown containing resources for which retry is completed are shown
    await userEvent.click(screen.getByText('e1'));
    expect(mockHistoryPush).toBeCalled();
  });
});
