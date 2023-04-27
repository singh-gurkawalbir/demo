
import React from 'react';
import { screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { mutateStore, reduxStore, renderWithProviders} from '../../../../../test/test-utils';
import MultiSelectUsersFilter from '.';
import { FILTER_KEYS } from '../../../../../utils/errorManagement';
import { JOB_STATUS, JOB_TYPES } from '../../../../../constants';

const initialStore = reduxStore;

function initMultiSelectUsersFilter({
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
      <MultiSelectUsersFilter {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('multiSelectUsersFilter UI tests', () => {
  test('should return null when there are no retries', () => {
    const props = {
      flowId: 'flow1',
      resourceId: 'res2',
      filterKey: FILTER_KEYS.RETRIES,
    };
    const {utils} = renderWithProviders(<MemoryRouter><MultiSelectUsersFilter {...props} /></MemoryRouter>);

    expect(utils.container).toBeEmptyDOMElement();
  });

  test('should pass the initial render with default value', () => {
    initMultiSelectUsersFilter({
      props: {
        flowId: 'flow1',
        resourceId: 'res1',
        filterKey: FILTER_KEYS.RETRIES,
      },
    });

    expect(screen.queryByText(/Retry started by:/i)).toBeInTheDocument();
    expect(screen.queryByText(/Select/i)).toBeInTheDocument();
  });

  test('should pass the initial render when a user is selected', async () => {
    initMultiSelectUsersFilter({
      props: {
        flowId: 'flow1',
        resourceId: 'res1',
        filterKey: FILTER_KEYS.RETRIES,
      },
    });

    await userEvent.click(screen.getByText('Select'));
    const checkboxes = screen.getAllByRole('checkbox');

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
    expect(checkboxes[3]).not.toBeChecked();

    await userEvent.click(checkboxes[0]);

    const cancelButton = screen.getByText('Cancel');

    expect(cancelButton).toBeInTheDocument();
    await userEvent.click(cancelButton);
    expect(screen.getByText(/Select/i)).toBeInTheDocument();
  });

  test('should pass the initial render when a user is selected duplicate', async () => {
    initMultiSelectUsersFilter({
      props: {
        flowId: 'flow1',
        resourceId: 'res1',
        filterKey: FILTER_KEYS.RETRIES,
      },
    });

    await userEvent.click(screen.getByText('Select'));
    const checkboxes = screen.getAllByRole('checkbox');

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
    expect(checkboxes[3]).not.toBeChecked();

    await userEvent.click(checkboxes[1]);

    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
    expect(checkboxes[3]).not.toBeChecked();
    const applyButton = screen.getByText('Apply');

    expect(applyButton).toBeInTheDocument();
    await userEvent.click(applyButton);
    expect(screen.getByText(/Shared user 1/i)).toBeInTheDocument();
  });
  test('should pass the initial render when multiple users are selected', async () => {
    initMultiSelectUsersFilter({
      props: {
        flowId: 'flow1',
        resourceId: 'res1',
        filterKey: FILTER_KEYS.RETRIES,
      },
    });

    await userEvent.click(screen.getByText('Select'));
    const checkboxes = screen.getAllByRole('checkbox');

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
    expect(checkboxes[3]).not.toBeChecked();

    await userEvent.click(checkboxes[1]);
    await userEvent.click(checkboxes[2]);

    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).toBeChecked();
    expect(checkboxes[3]).not.toBeChecked();
    const applyButton = screen.getByText('Apply');

    expect(applyButton).toBeInTheDocument();
    await userEvent.click(applyButton);
    expect(screen.getByText(/2 users selected/i)).toBeInTheDocument();
  });
  test('should pass the initial render when there are default users', async () => {
    initMultiSelectUsersFilter({
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

    await userEvent.click(checkboxes[0]);
    await userEvent.click(checkboxes[1]);

    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
    expect(checkboxes[3]).not.toBeChecked();
    const applyButton = screen.getByText('Apply');

    expect(applyButton).toBeInTheDocument();
    await userEvent.click(applyButton);
    expect(screen.getByText(/Shared user 1/i)).toBeInTheDocument();
  });
});
