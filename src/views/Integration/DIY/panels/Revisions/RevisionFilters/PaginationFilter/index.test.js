import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import * as ReactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RevisionFilters from '.';
import { mutateStore, renderWithProviders } from '../../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../../store';
import actions from '../../../../../../../actions';

let initialStore;

function initRevisionFilterForPagination({revisionsData, revisionsFilterData}) {
  mutateStore(initialStore, draft => {
    draft.data.revisions = revisionsData;
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

// Mocking Celigo Pagination as part of unit testing
jest.mock('../../../../../../../components/CeligoPagination', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../../../components/CeligoPagination'),
  default: props => (
    <>
      <div>Mocking Celigo Pagination</div>
      <div>rowsPerPageOptions = {props.rowsPerPageOptions}</div>
      <div>count = {props.count}</div>
      <div>page = {props.page}</div>
      <div>rowsPerPage = {props.rowsPerPage}</div>
      <div>resultPerPageLabel = {props.resultPerPageLabel}</div>
      <button
        type="button"
        onClick={() => props.onChangePage(undefined, 1)}
      >
        Page
      </button>
      <input
        onChange={props.onChangeRowsPerPage}
        placeholder="onChangeRowsPerPage"
      />
    </>
  ),
}));

describe('Testsuite for Revision Filters for pagination', () => {
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

  test('should test the revision pagination filter by clicking on page button', async () => {
    initRevisionFilterForPagination({
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
            preset: 'today',
          },
          status: 'all',
          user: 'all',
          type: 'all',
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
    expect(screen.getByText(/mocking celigo pagination/i)).toBeInTheDocument();
    expect(screen.getByText(/count = 1/i)).toBeInTheDocument();
    expect(screen.getByText(/page = 0/i)).toBeInTheDocument();
    expect(screen.getByText(/rowsperpage = 1/i)).toBeInTheDocument();
    expect(screen.getByText(/resultperpagelabel = results per page:/i)).toBeInTheDocument();
    const pageButtonNode = screen.getByRole('button', {
      name: /page/i,
    });

    expect(pageButtonNode).toBeInTheDocument();
    await userEvent.click(pageButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.patchFilter(
      '12345-revisions',
      { paging: { currPage: 1, rowsPerPage: 1 } }
    ));
  });
  test('should test the input of row per page section in revision paginaton', async () => {
    initRevisionFilterForPagination({
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
            preset: 'today',
          },
          status: 'all',
          user: 'all',
          type: 'all',
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
    const inputTextNode = screen.getByRole('textbox');

    expect(inputTextNode).toBeInTheDocument();
    await userEvent.type(inputTextNode, '1');
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.patchFilter('12345-revisions', {
      paging: {currPage: 0, rowsPerPage: 1},
    }));
  });
  test('should test the pagination when there is no filtered revisions', () => {
    const { utils } = initRevisionFilterForPagination({
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

    expect(utils.container).toBeEmptyDOMElement();
  });
});
