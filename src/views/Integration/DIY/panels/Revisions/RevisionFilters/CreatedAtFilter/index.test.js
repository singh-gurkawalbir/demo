import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import * as ReactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import RevisionFilters from '.';
import { mutateStore, renderWithProviders } from '../../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../../store';
import actions from '../../../../../../../actions';

let initialStore;

function initRevisionFilters({revisionsFilterData}) {
  mutateStore(initialStore, draft => {
    draft.session.filters = revisionsFilterData;
  });
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/test/12345'}]}
    >
      <Route
        path="/test/:integrationId"
        params={{integrationId: '12345'}}
      >
        <RevisionFilters />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

// Mocking Date Range Selector as part of unit testing
jest.mock('../../../../../../../components/DateRangeSelector', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../../../components/DateRangeSelector'),
  default: props => (
    <>
      <div>Mocking Date Range Selector</div>
      <div>clearable = {props.clearable}</div>
      <div>placement = {props.placement}</div>
      <div>placeholder = {props.placeholder}</div>
      <div>clearValue = {JSON.stringify(props.clearValue)}</div>
      <button
        type="button"
        onClick={() => props.onSave('mockDateFilter')}
      >
        Save
      </button>
      <div>value = {JSON.stringify(props.value)}</div>
      <div>showCustomRangeValue = {props.showCustomRangeValue}</div>
    </>
  ),
}));

// Mocking getSelectedRange as part of unit testing
jest.mock('../../../../../../../utils/flowMetrics', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../../../utils/flowMetrics'),
  getSelectedRange: dateFilter => dateFilter,
}));

describe('Testsuite for Revision Filters', () => {
  let useDispatchFn;
  let mockDispatchFn;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchFn = jest.spyOn(ReactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(
      action => {
        switch (action.type) {
          default:
        }
      }
    );
    useDispatchFn.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    useDispatchFn.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should test the Revision filter by clicking on the save button', async () => {
    initRevisionFilters({
      revisionsFilterData: {
        '12345-revisions': {
          createdAt: {
            preset: 'today',
          },
          status: 'all',
          user: 'all',
          type: 'snapshot',
          paging: {
            currPage: 0,
            rowsPerPage: 1,
          },
          sort: {
            order: 'desc',
            orderBy: 'createdAt',
          },
        },
      },
    });
    expect(screen.getByText(/mocking date range selector/i)).toBeInTheDocument();
    expect(screen.getByText(/clearable =/i)).toBeInTheDocument();
    expect(screen.getByText(/placement = right/i)).toBeInTheDocument();
    expect(screen.getByText(/placeholder = select date created/i)).toBeInTheDocument();
    expect(screen.getByText(/clearvalue = \{"preset":null\}/i)).toBeInTheDocument();
    expect(screen.getByText(/value = \{"preset":"today"\}/i)).toBeInTheDocument();
    const saveButtonNode = screen.getByRole('button', {
      name: /save/i,
    });

    await userEvent.click(saveButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.patchFilter('12345-revisions', {createdAt: 'mockDateFilter',
      paging: { currPage: 0, rowsPerPage: 1 }}));
  });
});
