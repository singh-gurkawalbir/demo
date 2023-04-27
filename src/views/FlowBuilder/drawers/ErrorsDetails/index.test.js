
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorDetailsDrawer from '.';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';

async function initErrorDetailsDrawer({
  props = {
    flowId: 'flow_id',
  },
  errortType = 'open',
  resourceId = 'export_id',
} = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.errorManagement.errorDetails = {
      flow_id: {
        export_id: {
          open: {
            errors: [{
              _id: 'job_id_1',
            }],
            status: 'received',
          },
        },
        export_id_1: {
          open: {
            errors: [],
            status: 'received',
          },
        },
        export_id_2: {
          open: {
            errors: [{
              _id: 'job_id_3',
            }],
            status: 'received',
          },
        },
      },
    };
    draft.session.filters = {
      'flow_id-flow_job_id-export_id_1': {
        numOpenError: 1,
        endedAt: Date.now(),
      },
      'flow_id-flow_job_id-export_id_2': {
        numOpenError: 1001,
        endedAt: Date.now(),
      },
    };
    draft.data.resources = {
      exports: [
        {
          _id: 'export_id',
        },
        {
          _id: 'export_id_1',
          name: 'export name 1',
        },
      ],
    };
  });

  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/flow_id/errors/${resourceId}${errortType ? `/${errortType}` : ''}`}]}
    >
      <Route path="/flow_id">
        <ErrorDetailsDrawer {...props} />
      </Route>
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

const mockReplaceFn = jest.fn();
const mockGoBackFn = jest.fn();
const mockLengthFn = jest.fn().mockReturnValue(1);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockReplaceFn,
    goBack: mockGoBackFn,
    length: mockLengthFn(),
  }),
}));

describe('ErrorDetailsDrawer test cases', () => {
  window.HTMLElement.prototype.scrollTo = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  runServer();

  afterEach(() => {
    mockReplaceFn.mockClear();
    mockGoBackFn.mockClear();
  });

  test('should pass the initial render with default value', async () => {
    await initErrorDetailsDrawer();

    const closeRightDrawer = screen.getAllByRole('button').find(eachButton => eachButton.getAttribute('data-test') === 'closeRightDrawer');
    const openError = screen.getByRole('tab', {name: /Open errors/i});
    const ResolvedError = screen.getByRole('tab', {name: /Resolved errors/i});

    expect(openError).toBeInTheDocument();
    expect(ResolvedError).toBeInTheDocument();
    expect(closeRightDrawer).toBeInTheDocument();

    await userEvent.click(closeRightDrawer);
    expect(mockReplaceFn).toBeCalledWith('/flow_id');

    await userEvent.click(ResolvedError);
    expect(mockReplaceFn).toBeCalledWith('/flow_id/errors/export_id/resolved');
  });

  test('should pass the initial render with filters & export name', async () => {
    mockLengthFn.mockReturnValue(5);
    await initErrorDetailsDrawer({
      errortType: 'filter/flow_job_id/open',
      resourceId: 'export_id_1',
    });

    const closeRightDrawer = screen.getAllByRole('button').find(eachButton => eachButton.getAttribute('data-test') === 'closeRightDrawer');
    const openError = screen.getByRole('tab', {name: /Open errors/i});
    const ResolvedError = screen.getByRole('tab', {name: /Resolved errors/i});

    expect(closeRightDrawer).toBeInTheDocument();
    expect(openError).toBeInTheDocument();
    expect(ResolvedError).toBeInTheDocument();
    expect(screen.queryByText(/1 error in this run/)).toBeInTheDocument();

    await userEvent.click(closeRightDrawer);
    expect(mockGoBackFn).toBeCalled();

    await userEvent.click(ResolvedError);
    expect(mockReplaceFn).toBeCalledWith('/flow_id/errors/export_id_1/filter/flow_job_id/resolved');
  });

  test('should pass the initial render with more than 1000 open errors', async () => {
    mockLengthFn.mockReturnValue(5);
    await initErrorDetailsDrawer({
      errortType: 'filter/flow_job_id/open',
      resourceId: 'export_id_2',
    });

    const openError = screen.getByRole('tab', {name: /Open errors/i});
    const ResolvedError = screen.getByRole('tab', {name: /Resolved errors/i});

    expect(screen.queryByText(/1001 errors in this run/)).toBeInTheDocument();
    expect(openError).toBeInTheDocument();
    expect(ResolvedError).toBeInTheDocument();
  });

  test('should pass the initial render with filters & export', async () => {
    mockLengthFn.mockReturnValue(1); // replacing with default value
    const { utils } = await initErrorDetailsDrawer({
      errortType: 'filter/flow_job_id/open',
    });

    expect(mockReplaceFn).toBeCalled();
    expect(utils.container).toBeEmptyDOMElement();
  });

  test('should pass the initial render with no error type', async () => {
    const { utils } = await initErrorDetailsDrawer({
      errortType: null,
    });

    expect(mockReplaceFn).toBeCalledWith('/flow_id/errors/export_id/open');
    expect(utils.container).toBeEmptyDOMElement();
  });
});
