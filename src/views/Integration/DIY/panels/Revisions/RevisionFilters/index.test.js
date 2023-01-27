import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import * as ReactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import RevisionFilters from '.';
import { renderWithProviders } from '../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../store';
import actions from '../../../../../../actions';

let initialStore;

function initRevisionFilters({revisionsData, revisionsFilterData}) {
  initialStore.getState().data.revisions = revisionsData;
  initialStore.getState().session.filters = revisionsFilterData;
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

// Mocking Action Group as part of unit testing
jest.mock('../../../../../../components/ActionGroup', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../../components/ActionGroup'),
  default: props => (
    <>
      <div>Mock Action Group</div>
      <div>position = {props.position}</div>
      <div>{props.children}</div>
    </>
  ),
}));

// Mocking CreatedAtFilter as part of unit testing
jest.mock('./CreatedAtFilter', () => ({
  __esModule: true,
  ...jest.requireActual('./CreatedAtFilter'),
  default: () => (
    <>
      <div>Mock CreatedAtFilter</div>
    </>
  ),
}));

// Mocking RevisionStatusFilter as part of unit testing
jest.mock('./RevisionStatusFilter', () => ({
  __esModule: true,
  ...jest.requireActual('./RevisionStatusFilter'),
  default: () => (
    <>
      <div>Mock RevisionStatusFilter</div>
    </>
  ),
}));

// Mocking RevisionStatusFilter as part of unit testing
jest.mock('./RevisionTypeFilter', () => ({
  __esModule: true,
  ...jest.requireActual('./RevisionTypeFilter'),
  default: () => (
    <>
      <div>Mock RevisionTypeFilter</div>
    </>
  ),
}));

// Mocking RevisionStatusFilter as part of unit testing
jest.mock('./UserFilter', () => ({
  __esModule: true,
  ...jest.requireActual('./UserFilter'),
  default: () => (
    <>
      <div>Mock UserFilter</div>
    </>
  ),
}));

// Mocking PaginationFilter as part of unit testing
jest.mock('./PaginationFilter', () => ({
  __esModule: true,
  ...jest.requireActual('./PaginationFilter'),
  default: () => (
    <>
      <div>Mock PaginationFilter</div>
    </>
  ),
}));

describe('Testsuite for Revision filters', () => {
  let mockDispatchFn;
  let useDispatchFn;

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
    mockDispatchFn.mockClear();
    useDispatchFn.mockClear();
  });
  test('should test the revision filters when there is empty filters and has revisions data', () => {
    initRevisionFilters({
      revisionsData: {
        12345: {
          status: 'received',
          data: [
            {
              _id: 'rev-1',
              name: 'rev1',
              type: 'pull',
              _createdByUserId: 'user1',
              status: 'completed',
              installSteps: [
                {
                  type: 'connection',
                  _connectionId: 'con-1234',

                },
                {
                  type: 'merge',
                },
              ],
            },
          ],
        },
      },
      revisionsFilterData: {},
    });
    expect(screen.getByText(/mock createdatfilter/i)).toBeInTheDocument();
    expect(screen.getByText(/mock revisionstatusfilter/i)).toBeInTheDocument();
    expect(screen.getByText(/mock revisiontypefilter/i)).toBeInTheDocument();
    expect(screen.getByText(/mock userfilter/i)).toBeInTheDocument();
    expect(screen.getByText(/position = right/i)).toBeInTheDocument();
    expect(screen.getByText(/mock paginationfilter/i)).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.patchFilter('12345-revisions', {
      createdAt: { preset: null },
      status: 'all',
      user: 'all',
      type: 'all',
      paging: { currPage: 0, rowsPerPage: 50 },
      sort: { order: 'desc', orderBy: 'createdAt' },
    }));
  });
  test('should test the revision filters when there are filters and has revisions data then it should not call the patch filter action call', () => {
    initRevisionFilters({
      revisionsData: {
        12345: {
          status: 'received',
          data: [
            {
              _id: 'rev-1',
              name: 'rev1',
              type: 'pull',
              _createdByUserId: 'user1',
              status: 'completed',
              installSteps: [
                {
                  type: 'connection',
                  _connectionId: 'con-1234',

                },
                {
                  type: 'merge',
                },
              ],
            },
          ],
        },
      },
      revisionsFilterData: {
        '12345-revisions': {
          createdAt: {
            preset: null,
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
    expect(mockDispatchFn).not.toHaveBeenCalledWith(actions.patchFilter('12345-revisions', {
      createdAt: { preset: null },
      status: 'all',
      user: 'all',
      type: 'snapshot',
      paging: { currPage: 0, rowsPerPage: 1 },
      sort: { order: 'desc', orderBy: 'createdAt' },
    }));
  });
  test('should test the revision filters when there are no revisions data', () => {
    const { utils } = initRevisionFilters({
      revisionsData: {
        12345: {
          status: 'received',
          data: [],
        },
      },
      revisionsFilterData: {},
    });

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should test the revision filters when there are no revisions in state', () => {
    const { utils } = initRevisionFilters({
      revisionsData: {
      },
      revisionsFilterData: {},
    });

    expect(utils.container).toBeEmptyDOMElement();
  });
});
