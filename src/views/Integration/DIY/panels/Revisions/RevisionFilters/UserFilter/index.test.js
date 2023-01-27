import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import * as ReactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import UserFilter from '.';
import { getCreatedStore } from '../../../../../../../store';
import { renderWithProviders } from '../../../../../../../test/test-utils';
import actions from '../../../../../../../actions';

let initialStore;

function initUserFilter({userData, revisionsData, revisionsFilterData}) {
  initialStore.getState().user = userData;
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
        <UserFilter />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Testsuite for RevisionTypeFilter', () => {
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
  test('should test the user filter by selecting a admin access user from the drop-down', async () => {
    initUserFilter({
      userData: {
        profile: {},
        preferences: { defaultAShareId: 'aShare1' },
        org: {
          users: [],
          accounts: [
            {
              _id: 'aShare1',
              accessLevel: 'administrator',
            },
          ],
        },
      },
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
    const selectUserButtonNode = screen.getByRole('button', {
      name: /select user/i,
    });

    expect(selectUserButtonNode).toBeInTheDocument();
    await userEvent.click(selectUserButtonNode);

    const userOptionNode = screen.getByRole('option', {
      name: /user1/i,
    });

    expect(userOptionNode).toBeInTheDocument();
    await userEvent.click(userOptionNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.patchFilter('12345-revisions',
      { user: 'user1', paging: { currPage: 0, rowsPerPage: 1 } }
    ));
  });
  test('should test the user filter by selecting a non admin access user from the drop-down', async () => {
    initUserFilter({
      userData: {
        profile: {},
        preferences: { defaultAShareId: 'aShare1' },
        org: {
          users: [
            {
              _id: 'user_id',
              accepted: true,
              integrationAccessLevel: [
                {
                  _integrationId: '12345',
                  accessLevel: 'manage',
                },
              ],
              sharedWithUser: {
                _id: 'shared_user_1',
                email: 'ui-test@test.com',
                name: 'UI Test',
                allowedToResetMFA: false,
                accountSSOLinked: 'not_linked',
              },
            },
          ],
          accounts: [
            {
              _id: 'aShare1',
              accessLevel: 'administrator',
            },
          ],
        },
      },
      revisionsData: {
        12345: {
          status: 'received',
          data: [
            {
              _id: 'rev-1',
              name: 'rev1',
              type: 'pull',
              _createdByUserId: 'shared_user_1',
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
    const selectuserButtonNode = screen.getByRole('button', {
      name: /select user/i,
    });

    expect(selectuserButtonNode).toBeInTheDocument();
    await userEvent.click(selectuserButtonNode);
    const uiTestOptionNode = screen.getByRole('option', {
      name: /ui test/i,
    });

    expect(uiTestOptionNode).toBeInTheDocument();
    await userEvent.click(uiTestOptionNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.patchFilter(
        '12345-revisions',
        {
          user: 'shared_user_1',
          paging: {
            currPage: 0,
            rowsPerPage: 1,
          },
        }
      ));
  });
  test('should test the user filter by selecting a non admin access user who has only email id instead of name from the drop-down', async () => {
    initUserFilter({
      userData: {
        profile: {},
        preferences: { defaultAShareId: 'aShare1' },
        org: {
          users: [
            {
              _id: 'user_id',
              accepted: true,
              integrationAccessLevel: [
                {
                  _integrationId: '12345',
                  accessLevel: 'manage',
                },
              ],
              sharedWithUser: {
                _id: 'shared_user_1',
                email: 'ui-test@test.com',
                allowedToResetMFA: false,
                accountSSOLinked: 'not_linked',
              },
            },
          ],
          accounts: [
            {
              _id: 'aShare1',
              accessLevel: 'administrator',
            },
          ],
        },
      },
      revisionsData: {
        12345: {
          status: 'received',
          data: [
            {
              _id: 'rev-1',
              name: 'rev1',
              type: 'pull',
              _createdByUserId: 'shared_user_1',
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
    const selectuserButtonNode = screen.getByRole('button', {
      name: /select user/i,
    });

    expect(selectuserButtonNode).toBeInTheDocument();
    await userEvent.click(selectuserButtonNode);
    const uiTestOptionNode = screen.getByRole('option', {
      name: /ui-test@test.com/i,
    });

    expect(uiTestOptionNode).toBeInTheDocument();
    await userEvent.click(uiTestOptionNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.patchFilter(
        '12345-revisions',
        {
          user: 'shared_user_1',
          paging: {
            currPage: 0,
            rowsPerPage: 1,
          },
        }
      ));
  });
});
