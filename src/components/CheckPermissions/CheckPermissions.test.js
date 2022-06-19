/* global describe, test, expect */
import React from 'react';
import { screen, waitFor} from '@testing-library/react';
import {renderWithProviders, mockGetRequestOnce} from '../../test/test-utils';
import CheckPermissions from '.';
import { runServer } from '../../test/api/server';
import actions from '../../actions';
import {PERMISSIONS} from '../../utils/constants';

describe('plz work', () => {
  runServer();
  test('when owner tries to see the content', async () => {
    const permission = PERMISSIONS &&
    PERMISSIONS.accesstokens &&
    PERMISSIONS.accesstokens.edit;

    const {store} = renderWithProviders(
      <CheckPermissions
        permission={
            permission
        }><div>You are allowed to see this content</div>
      </CheckPermissions>);

    store.dispatch(actions.user.preferences.request('..'));
    store.dispatch(actions.user.org.accounts.requestCollection('..'));
    store.dispatch(actions.user.profile.request('..'));
    await waitFor(() => expect(store?.getState()?.user?.profile?._id).toBeDefined());
    await waitFor(() => expect(store?.getState()?.user?.preferences?.environment).toBeDefined());
    await waitFor(() => expect(store?.getState()?.user?.org?.accounts.length).toBeGreaterThan[1]);

    store.dispatch(actions.user.profile.request('..'));
    await waitFor(() => expect(store?.getState()?.user?.profile?._id).toBeDefined());
    const message = screen.getByText('You are allowed to see this content');

    expect(message).toBeInTheDocument();
  });
  test('when monitor tries to see the content', async () => {
    const permission = PERMISSIONS &&
    PERMISSIONS.accesstokens &&
    PERMISSIONS.accesstokens.view;

    mockGetRequestOnce('/api/preferences', {
      environment: 'production',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: 'h:mm:ss a',
      scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
      lastLoginAt: '2021-02-23T10:57:09.194Z',
      defaultAShareId: '618cc96475f94b333a55bbd3',
      recentActivity: {
        production: {
          integration: '5cc9bd00581ace2bec7754eb',
          flow: '602d298186768419ca01101a',
        },
      },
      dashboard: {
        filters: {
          hideEmpty: true,
          status: '',
        },
        tilesOrder: [
          'none-sb',
          '5ea6afb3dedba94094c71d9a',
          '5ea7ad428922b87e3b2f25d5',
        ],
        view: 'tile',
      },
      pagination: {
        exports: {
          pageSize: 1000,
        },
        imports: {
          pageSize: 1000,
        },
        recyclebin: {
          pageSize: 1000,
        },
        jobErrors: {
          pageSize: 1000,
        },
      },
      showReactSneakPeekFromDate: '2019-11-05',
      showReactBetaFromDate: '2019-12-26',
      drawerOpened: true,
      expand: 'Tools',
      fbBottomDrawerHeight: 208,
    });
    const {store} = renderWithProviders(
      <CheckPermissions
        permission={
              permission
          }><div>You are allowed to see this content</div>
      </CheckPermissions>);

    store.dispatch(actions.user.preferences.request('..'));
    store.dispatch(actions.user.org.accounts.requestCollection('..'));
    store.dispatch(actions.user.profile.request('..'));
    await waitFor(() => expect(store?.getState()?.user?.profile?._id).toBeDefined());
    await waitFor(() => expect(store?.getState()?.user?.preferences?.environment).toBeDefined());
    await waitFor(() => expect(store?.getState()?.user?.org?.accounts.length).toBeGreaterThan[1]);
    const message = screen.getByText('You are allowed to see this content');

    expect(message).toBeInTheDocument();
  });
  test('when manage tries to see the content', async () => {
    mockGetRequestOnce('/api/preferences', {
      environment: 'production',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: 'h:mm:ss a',
      scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
      lastLoginAt: '2021-02-23T10:57:09.194Z',
      defaultAShareId: '61dc35f368a1f148356e9b5e',
      recentActivity: {
        production: {
          integration: '5cc9bd00581ace2bec7754eb',
          flow: '602d298186768419ca01101a',
        },
      },
      dashboard: {
        filters: {
          hideEmpty: true,
          status: '',
        },
        tilesOrder: [
          'none-sb',
          '5ea6afb3dedba94094c71d9a',
          '5ea7ad428922b87e3b2f25d5',
        ],
        view: 'tile',
      },
      pagination: {
        exports: {
          pageSize: 1000,
        },
        imports: {
          pageSize: 1000,
        },
        recyclebin: {
          pageSize: 1000,
        },
        jobErrors: {
          pageSize: 1000,
        },
      },
      showReactSneakPeekFromDate: '2019-11-05',
      showReactBetaFromDate: '2019-12-26',
      drawerOpened: true,
      expand: 'Tools',
      fbBottomDrawerHeight: 208,
    });
    const {store} = renderWithProviders(
      <CheckPermissions
        permission={PERMISSIONS.recyclebin.view}><div>You are allowed to see this content</div>
      </CheckPermissions>);

    store.dispatch(actions.user.preferences.request('..'));
    store.dispatch(actions.user.org.accounts.requestCollection('..'));
    store.dispatch(actions.user.profile.request('..'));
    await waitFor(() => expect(store?.getState()?.user?.profile?._id).toBeDefined());
    await waitFor(() => expect(store?.getState()?.user?.preferences?.environment).toBeDefined());
    await waitFor(() => expect(store?.getState()?.user?.org?.accounts.length).toBeGreaterThan[1]);
    const message = screen.getByText('You do not have permissions to access this page.');

    expect(message).toBeInTheDocument();
  });
});
