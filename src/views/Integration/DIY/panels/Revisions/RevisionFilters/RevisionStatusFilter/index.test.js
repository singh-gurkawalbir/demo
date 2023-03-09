import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import * as ReactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RevisionStatusFilter from '.';
import { getCreatedStore } from '../../../../../../../store';
import { mutateStore, renderWithProviders } from '../../../../../../../test/test-utils';
import actions from '../../../../../../../actions';

let initialStore;

function initRevisionStatusFilter({revisionsData, revisionsFilterData}) {
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
        <RevisionStatusFilter />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Testsuite for RevisionStatusFilter', () => {
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
  test('should test Revision Status Filter', async () => {
    initRevisionStatusFilter({
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
    const buttonNode = screen.getByRole('button', {
      name: /select status/i,
    });

    expect(buttonNode).toBeInTheDocument();
    await userEvent.click(buttonNode);
    const completedMenuOption = screen.getByRole('option', {
      name: /completed/i,
    });

    expect(completedMenuOption).toBeInTheDocument();
    await userEvent.click(completedMenuOption);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.patchFilter(
      '12345-revisions',
      {
        paging: {
          currPage: 0,
          rowsPerPage: 1,
        },
        status: 'completed',
      },
    ));
  });
});

