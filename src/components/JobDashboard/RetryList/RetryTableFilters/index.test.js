
import React from 'react';
import * as reactRedux from 'react-redux';
import { screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { mutateStore, reduxStore, renderWithProviders} from '../../../../test/test-utils';
import RetryTableFilters from '.';
import { FILTER_KEYS } from '../../../../utils/errorManagement';
import { JOB_STATUS, JOB_TYPES } from '../../../../constants';
import actions from '../../../../actions';

const initialStore = reduxStore;

function initRetryTableFilters({
  props = {},
  filters,
} = {}) {
  mutateStore(initialStore, draft => {
    draft.session.filters = filters;
    draft.user.preferences = {
      environment: 'production',
      defaultAShareId: 'own',
    };
    draft.user.profile = {
      _id: '5cadc8b42b10347a2708bf29',
      name: 'Owner name',
      email: 'owner@celigo.com',
      allowedToPublish: true,
      developer: true,
    };
    draft.user.org = {
      users: [
        {
          _id: '5f7011605b2e3244837309f9',
          accepted: true,
          accessLevel: 'monitor',
          integrationAccessLevel: [
            {
              _integrationId: '5e44efa28015c9464272256f',
              accessLevel: 'manage',
            },
          ],
          sharedWithUser: {
            _id: '5f6882679daecd32740e2c38',
            email: 'sharedUser1@celigo.com',
            name: 'Shared user 1',
          },
        },
        {
          _id: '5f72fae75b2e32448373575e',
          accepted: true,
          accessLevel: 'monitor',
          integrationAccessLevel: [
            {
              _integrationId: '5e44ee816fb284424f693b43',
              accessLevel: 'manage',
            },
          ],
          sharedWithUser: {
            _id: '5f686ef49daecd32740e2710',
            email: 'shareduser2@celigo.com',
            name: 'Shared user 2',
          },
        },
        {
          _id: '5f770d4b96ae3b4bf0fdd8f1',
          accepted: true,
          accessLevel: 'monitor',
          integrationAccessLevel: [],
          sharedWithUser: {
            _id: '5f770d4b96ae3b4bf0fdd8ee',
            email: 'shareduser3@celigo.com',
            name: 'Shared user 3',
          },
        },
      ],
      accounts: [
        {
          _id: 'own',
          accessLevel: 'owner',
        },
      ],
    };
    draft.data.resources.flow = [{
      _id: 'flow1',
      _integrationId: '5e44ee816fb284424f693b43',
      name: 'test flow',
    }];
    draft.data.integrationAShares = {
      '5e44ee816fb284424f693b43': [
        {
          _id: '5f7011605b2e3244837309f9',
          accepted: true,
          accessLevel: 'monitor',
          sharedWithUser: {
            _id: '5f6882679daecd32740e2c38',
            email: 'sharedUser1@celigo.com',
            name: 'Shared user 1',
          },
        },
        {
          _id: '5f72fae75b2e32448373575e',
          accepted: true,
          sharedWithUser: {
            _id: '5f686ef49daecd32740e2710',
            email: 'shareduser2@celigo.com',
            name: 'Shared user 2',
          },
          accessLevel: 'monitor',
        },
        {
          _id: '5f770d4b96ae3b4bf0fdd8f1',
          accepted: true,
          accessLevel: 'monitor',
          sharedWithUser: {
            _id: '5f770d4b96ae3b4bf0fdd8ee',
            email: 'shareduser3@celigo.com',
            name: 'Shared user 3',
          },
        },
      ],
    };
    draft.session.errorManagement.retries = {
      flow1: {
        res1: {
          status: 'received',
          data: [
            {
              _id: 'j1',
              type: JOB_TYPES.RETRY,
              status: JOB_STATUS.COMPLETED,
              startedAt: '2019-08-11T10:50:00.000Z',
              numError: 1,
              numIgnore: 2,
              numPagesGenerated: 10,
              numResolved: 0,
              numSuccess: 20,
              triggeredBy: '5f6882679daecd32740e2c38',
            },
            {
              _id: 'j2',
              type: JOB_TYPES.RETRY,
              status: JOB_STATUS.RUNNING,
              startedAt: '2019-08-11T10:50:00.000Z',
              numError: 1,
              numIgnore: 2,
              numPagesGenerated: 10,
              numResolved: 0,
              numSuccess: 20,
              triggeredBy: '5f686ef49daecd32740e2710',
            },
            {
              _id: 'j3',
              type: JOB_TYPES.RETRY,
              status: JOB_STATUS.CANCELED,
              startedAt: '2019-08-11T10:50:00.000Z',
              numError: 1,
              numIgnore: 2,
              numPagesGenerated: 10,
              numResolved: 0,
              numSuccess: 20,
              triggeredBy: '5f770d4b96ae3b4bf0fdd8ee',
            },
          ],
        },
      },
    };
  });

  const ui = (
    <MemoryRouter>
      <RetryTableFilters {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('retryTableFilters UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
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

  test('should show refresh button when there are no retries', () => {
    initRetryTableFilters({
      props: {
        flowId: 'flow1',
        resourceId: 'res1',
        filterKey: FILTER_KEYS.RETRIES,
      },
    });

    expect(screen.queryByText(/Refresh/i)).toBeInTheDocument();
  });
  test('should pass the initial render when there are default users', async () => {
    initRetryTableFilters({
      props: {
        flowId: 'flow1',
        resourceId: 'res1',
        filterKey: FILTER_KEYS.RETRIES,
      },
      filters: {
        retries: {
          selectedUsers: ['5f770d4b96ae3b4bf0fdd8ee'],
        },
      },
    });

    expect(screen.getByText(/Shared user 3/i)).toBeInTheDocument();
    await userEvent.click(screen.getByText('Shared user 3'));
    const checkboxes = screen.getAllByRole('checkbox');

    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
    expect(checkboxes[3]).toBeChecked();
  });

  test('should pass the intial render onClicking refresh', async () => {
    await initRetryTableFilters({
      props: {
        flowId: 'flow1',
        resourceId: 'res1',
        filterKey: FILTER_KEYS.RETRIES,
      },
    });
    const buttonRef = screen.getByText('Refresh');

    await userEvent.click(buttonRef);

    await expect(mockDispatchFn).toHaveBeenCalledWith(actions.errorManager.retries.request({flowId: 'flow1', resourceId: 'res1'}));
  });
});
