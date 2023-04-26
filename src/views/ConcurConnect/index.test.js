import { screen } from '@testing-library/react';
import React from 'react';
import * as RouteMatch from 'react-router-dom';
import * as ReactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import ConcurConnect from '.';
import { renderWithProviders, mutateStore } from '../../test/test-utils';
import * as UseQuery from '../../hooks/useQuery';
import { getCreatedStore } from '../../store';
import actions from '../../actions';

let initialStore;
const mockHistoryPush = jest.fn();
const mockWindowClose = jest.fn();

window.close = mockWindowClose;

function initConcurConnect({isLoadingStatus, errorStatus, mockModule}) {
  jest.spyOn(RouteMatch, 'useRouteMatch').mockReturnValue({
    params: {
      module: mockModule,
    },
  });
  const mutateState = draft => {
    draft.session.concur = {
      isLoading: isLoadingStatus,
      error: errorStatus,
    };
  };

  mutateStore(initialStore, mutateState);
  const ui = (
    <ConcurConnect />
  );

  return renderWithProviders(ui, {initialStore});
}

// Mocking Loader as part of unit testing
jest.mock('../../components/Loader', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/Loader'),
  default: props => (
    <>
      <div>Mocked Loader</div>
      <div>{props.children}</div>
    </>
  ),
}));

// Mocking Get Image URL as part of unit testing
jest.mock('../../utils/image', () => ({
  __esModule: true,
  ...jest.requireActual('../../utils/image'),
  default: jest.fn(
    props => props
  ),
}));

// Mocking Spinner as part of unit testing
jest.mock('@celigo/fuse-ui', () => ({
  __esModule: true,
  ...jest.requireActual('@celigo/fuse-ui'),
  Spinner: jest.fn().mockReturnValue(<div>Mocked Spinner</div>),
}));

// Mocking message store as part of unit testing
jest.mock('../../utils/messageStore', () => ({
  __esModule: true,
  ...jest.requireActual('../../utils/messageStore'),
  default: (a, b) => {
    if (a === 'SEND_SAP_CONCUR_MODULE' && (JSON.stringify(b) === JSON.stringify({module: 'expense reports'}))) {
      return 'mock expense reports message store';
    }

    return 'mock expense invoices message store';
  },
}));

// Mocking useRouteMatch as part of unit testing
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('Testsuite for ConcurConnect', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(ReactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(actions => {
      switch (actions.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    jest.spyOn(UseQuery, 'default').mockReturnValue(
      {
        get: jest.fn(props => {
          if (props === 'id') {
            return 'test_id';
          }

          return 'test_request_token';
        }),
      }
    );
  });

  afterEach(() => {
    mockDispatchFn.mockClear();
    useDispatchSpy.mockClear();
    mockHistoryPush.mockClear();
    mockWindowClose.mockClear();
  });

  test('should test the spinner when the concur data is in loading state', () => {
    initConcurConnect({isLoadingStatus: true, mockModule: 'expense'});
    expect(screen.getByText(/mocked loader/i)).toBeInTheDocument();
    expect(screen.getByText(/mocked spinner/i)).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.concur.connect({module: 'expense', id: 'test_id', requestToken: 'test_request_token'}));
  });
  test('should test the ConcurConnect when there are no errors and module is equal to expense', async () => {
    initConcurConnect({isLoadingStatus: false, mockModule: 'expense'});
    expect(screen.getByText(/congratulations - you're linked!/i)).toBeInTheDocument();
    expect(screen.getByText(/mock expense reports message store/i)).toBeInTheDocument();
    const startIntegratingButton = await screen.findByRole('button', {
      name: /start integrating/i,
    });

    expect(startIntegratingButton).toBeInTheDocument();
    await userEvent.click(startIntegratingButton);
    expect(mockHistoryPush).toHaveBeenCalledWith('/marketplace/concurexpense');
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.concur.connect({module: 'expense', id: 'test_id', requestToken: 'test_request_token'}));
  });
  test('should test the ConcurConnect when there are no errors and module is equal to invoice', async () => {
    initConcurConnect({isLoadingStatus: false, mockModule: 'invoice'});
    expect(screen.getByText(/congratulations - you're linked!/i)).toBeInTheDocument();
    expect(screen.getByText(/mock expense invoices message store/i)).toBeInTheDocument();
    const startIntegratingButton = await screen.findByRole('button', {
      name: /start integrating/i,
    });

    expect(startIntegratingButton).toBeInTheDocument();
    await userEvent.click(startIntegratingButton);
    expect(mockHistoryPush).toHaveBeenCalledWith('/marketplace/concurinvoice');
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.concur.connect({module: 'invoice', id: 'test_id', requestToken: 'test_request_token'}));
  });
  test('should test the ConcurConnect when there are errors', async () => {
    initConcurConnect({isLoadingStatus: false, errorStatus: ['testing error message'], mockModule: 'invoice'});
    expect(screen.getByText(/testing error message/i)).toBeInTheDocument();
    const closeButtonNode = await screen.findByRole('button', {
      name: /close/i,
    });

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    expect(mockWindowClose).toHaveBeenCalledTimes(1);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.concur.connect({module: 'invoice', id: 'test_id', requestToken: 'test_request_token'}));
  });
  test('should test the ConcurConnect when there are no errors and no module', async () => {
    initConcurConnect({isLoadingStatus: false, mockModule: ''});
    expect(screen.getByText(/congratulations - you're linked!/i)).toBeInTheDocument();
    expect(screen.queryByText(/mock expense invoices message store/i)).not.toBeInTheDocument();

    const startIntegratingButton = await screen.findByRole('button', {
      name: /start integrating/i,
    });

    expect(startIntegratingButton).toBeInTheDocument();
    await userEvent.click(startIntegratingButton);
    expect(mockHistoryPush).toHaveBeenCalledWith('/marketplace/concur');
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.concur.connect({module: '', id: 'test_id', requestToken: 'test_request_token'}));
  });
  test('should test the ConcurConnect when there are errors with no error message', async () => {
    initConcurConnect({isLoadingStatus: false, errorStatus: [''], mockModule: 'invoice'});
    expect(screen.queryByText(/testing error message/i)).not.toBeInTheDocument();
    const closeButtonNode = await screen.findByRole('button', {
      name: /close/i,
    });

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    expect(mockWindowClose).toHaveBeenCalledTimes(1);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.concur.connect({module: 'invoice', id: 'test_id', requestToken: 'test_request_token'}));
  });
});
