
import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import moment from 'moment';
import userEvent from '@testing-library/user-event';
import RunHistoryDrawer from '.';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import actions from '../../../actions';
import { getCreatedStore } from '../../../store';

let initialStore;
const mockHistoryPush = jest.fn();

function initRunHistoryDrawer({range, filterKey, flowId}, renderFun, store) {
  if (store) { initialStore = store; } else {
    mutateStore(initialStore, draft => {
      draft.session.filters = {
        [filterKey]: range,
      };
    });
  }
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/dashboard/completedFlows/${flowId}/runHistory`}]}
    >
      <Route
        path="/dashboard/completedFlows"
        params={{flowId: `${flowId}`}}
        >
        <RunHistoryDrawer />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore, renderFun});
}

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
jest.mock('../RunHistory', () => ({
  __esModule: true,
  ...jest.requireActual('../RunHistory'),
  default: () => (
    <div>Mock RunHistory</div>
  ),
}));

describe('testsuite for Run History Drawer', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    // jest.useFakeTimers('modern').setSystemTime(new Date('2022-01-30'));
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
  test('should test the Run History Drawer heading and click on close button node', async () => {
    initRunHistoryDrawer({range: '', filterKey: 'completedFlows', flowId: '123'});
    expect(screen.getByRole('heading', {name: /run history: 123/i})).toBeInTheDocument();
    const closeButtonNode = screen.getByRole('button', {name: /close/i});

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/dashboard/completedFlows');
  });
  test('should test the patch filter action on mount and test the filter action when flow id is modified', () => {
    const {utils, store} = initRunHistoryDrawer({
      range: {
        range: {
          preset: 'custom',
          startDate: moment(new Date()).startOf('day').toDate(),
          endDate: moment(new Date()).endOf('day').toDate(),
        }},
      filterKey: 'completedFlows',
      flowId: '123',
    });

    expect(mockDispatchFn).toHaveBeenCalledWith(actions.patchFilter('runHistory', {range: {
      preset: 'custom',
      startDate: moment(new Date()).startOf('day').toDate(),
      endDate: moment(new Date()).endOf('day').toDate(),
    }}));
    utils.unmount();
    mutateStore(store, draft => {
      draft.session.filters.completedFlows = {range: ''};
    });
    initRunHistoryDrawer({range: '', flowId: '234'}, undefined, store);
    expect(screen.getByRole('heading', { name: /run history: 234/i })).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.patchFilter('runHistory', {range: {
      preset: 'custom',
      startDate: moment(new Date()).startOf('day').toDate(),
      endDate: moment(new Date()).endOf('day').toDate(),
    }}));
  });
  test('should test the clear filter action on unmount', async () => {
    const { utils } = initRunHistoryDrawer({
      range: '',
      filterKey: 'completedFlows',
      flowId: '123',
    });

    expect(screen.getByRole('heading', { name: /run history: 123/i })).toBeInTheDocument();
    expect(screen.getByText(/mock runhistory/i)).toBeInTheDocument();
    utils.unmount();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.clearFilter('runHistory'));
  });
});
