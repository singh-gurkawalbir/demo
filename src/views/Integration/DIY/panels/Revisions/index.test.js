import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import * as ReactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import Revisions from '.';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';
import actions from '../../../../../actions';

let initialStore;
const mockUseOpenRevisionWhenValid = jest.fn();

function initRevisions({integrationId, userData, revisionsData, revisionsFilterData, rerender}) {
  mutateStore(initialStore, draft => {
    draft.user = userData;
    draft.data.revisions = revisionsData;
    draft.session.filters = revisionsFilterData;
  });
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/test'}]}
    >
      <Route
        path="/test"
      >
        <Revisions integrationId={integrationId} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore, rerender});
}

// Mocking generateId as part of unit testing
jest.mock('../../../../../utils/string', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../utils/string'),
  generateId: () => 'someGeneratedId',
}));
// Mocking InfoText as part of unit testing
jest.mock('../infoText', () => ({
  __esModule: true,
  ...jest.requireActual('../infoText'),
  default: {
    Revisions: 'mocked test',
  },
}));

// Mocking AddIcon as part of unit testing
jest.mock('../../../../../components/icons/AddIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/icons/AddIcon'),
  default: () => <div>Mocking Add Icon</div>,
}));

// Mocking useOpenRevisionWhenValid as part of unit testing
jest.mock('../../../../../components/drawer/Revisions/hooks/useOpenRevisionWhenValid', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/drawer/Revisions/hooks/useOpenRevisionWhenValid'),
  default: props => () => mockUseOpenRevisionWhenValid(props),
}));

// Mocking Panel Header as part of unit testing
jest.mock('../../../../../components/PanelHeader', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/PanelHeader'),
  default: props => (
    <>
      <div>Mocking Panel Header</div>
      <div>title = {props.title}</div>
      <div>infoText = {props.infoText}</div>
      <div>{props.children}</div>
    </>
  ),
}));

// Mocking LoadResources as part of unit testing
jest.mock('../../../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/LoadResources'),
  default: props => (
    <>
      <div>Mocking LoadResources</div>
      <div>integrationId = {props.integrationId}</div>
      <div>resources = {props.resources}</div>
      <div>{props.children}</div>
    </>
  ),
}));

// Mocking Spinner as part of unit testing
jest.mock('@celigo/fuse-ui', () => ({
  __esModule: true,
  ...jest.requireActual('@celigo/fuse-ui'),
  Spinner: () => <div>Mocking Spinner</div>,
}));

// Mocking Celigo Table as part of unit testing
jest.mock('../../../../../components/CeligoTable', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/CeligoTable'),
  default: props => (
    <>
      <div>Mocking Celigo table</div>
      <div>filterKey = {props.filterKey}</div>
      <div>data = {JSON.stringify(props.data)}</div>
    </>
  ),
}));

// Mocking RevisionFilters as part of unit testing
jest.mock('./RevisionFilters', () => ({
  __esModule: true,
  ...jest.requireActual('./RevisionFilters'),
  default: () => (
    <>
      <div>Mocking Revision Filters</div>
    </>
  ),
}));

// Mocking Action Group as part of unit testing
jest.mock('../../../../../components/ActionGroup', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/ActionGroup'),
  default: props => (
    <>
      <div>Mocking Action Group</div>
      <div>{props.children}</div>
    </>
  ),
}));

// Mocking Text Button as part of unit testing
jest.mock('@celigo/fuse-ui', () => ({
  __esModule: true,
  ...jest.requireActual('@celigo/fuse-ui'),
  TextButton: props => {
    const mockDataTest = 'data-test';

    return (
      <>
        <div>{props.startIcon}</div>
        <div>
          <button
            disabled={props.disabled}
            type="button"
            onClick={props.onClick}
            data-test={props[mockDataTest]}
            >
            {props.children}
          </button>
        </div>
      </>
    );
  },
}));

// Mocking ViewDetailsDrawer as part of unit testing
jest.mock('../../../../../components/drawer/Revisions/ViewDetails', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/drawer/Revisions/ViewDetails'),
  default: props => (
    <>
      <div>Mocking View Detail Drawer</div>
      <div>integrationId = {props.integrationId}</div>
    </>
  ),
}));

// Mocking OpenPullDrawer as part of unit testing
jest.mock('../../../../../components/drawer/Revisions/Pull/Open', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/drawer/Revisions/Pull/Open'),
  default: props => (
    <>
      <div>Mocking OpenPullDrawer</div>
      <div>integrationId = {props.integrationId}</div>
    </>
  ),
}));

// Mocking ReviewPullChangesDrawer as part of unit testing
jest.mock('../../../../../components/drawer/Revisions/Pull/ReviewChanges', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/drawer/Revisions/Pull/ReviewChanges'),
  default: props => (
    <>
      <div>Mocking ReviewPullChangesDrawer</div>
      <div>integrationId = {props.integrationId}</div>
    </>
  ),
}));

// Mocking MergePullDrawer as part of unit testing
jest.mock('../../../../../components/drawer/Revisions/Pull/Merge', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/drawer/Revisions/Pull/Merge'),
  default: props => (
    <>
      <div>Mocking MergePullDrawer</div>
      <div>integrationId = {props.integrationId}</div>
    </>
  ),
}));

// Mocking OpenRevertDrawer as part of unit testing
jest.mock('../../../../../components/drawer/Revisions/Revert/Open', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/drawer/Revisions/Revert/Open'),
  default: props => (
    <>
      <div>Mocking OpenRevertDrawer</div>
      <div>integrationId = {props.integrationId}</div>
    </>
  ),
}));

// Mocking ReviewRevertChangesDrawer as part of unit testing
jest.mock('../../../../../components/drawer/Revisions/Revert/ReviewChanges', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/drawer/Revisions/Revert/ReviewChanges'),
  default: props => (
    <>
      <div>Mocking ReviewRevertChangesDrawer</div>
      <div>integrationId = {props.integrationId}</div>
    </>
  ),
}));

// Mocking FinalRevertDrawer as part of unit testing
jest.mock('../../../../../components/drawer/Revisions/Revert/Final', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/drawer/Revisions/Revert/Final'),
  default: props => (
    <>
      <div>Mocking FinalRevertDrawer</div>
      <div>integrationId = {props.integrationId}</div>
    </>
  ),
}));

// Mocking CreateSnapshotDrawer as part of unit testing
jest.mock('../../../../../components/drawer/Revisions/CreateSnapshot', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/drawer/Revisions/CreateSnapshot'),
  default: props => (
    <>
      <div>Mocking Create Snapshot Drawer</div>
      <div>integrationId = {props.integrationId}</div>
    </>
  ),
}));

describe('Testsuite for Revisions', () => {
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
    useDispatchFn.mockClear();
    mockDispatchFn.mockClear();
    mockUseOpenRevisionWhenValid.mockClear();
  });
  test('should test the revisions when the access is not equal to monitor and status of the revision is requested and test the disabled buttons when the revisions are in loading state', async () => {
    initRevisions(
      {
        integrationId: '12345',
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
            status: 'requested',
          },
        },
      }
    );
    expect(screen.getByText(/mocking panel header/i)).toBeInTheDocument();
    expect(screen.getByText(/title = revisions/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking action group/i)).toBeInTheDocument();

    const createPullButtonNode = screen.getByRole('button', {
      name: /create pull/i,
    });

    expect(createPullButtonNode).toBeInTheDocument();
    expect(createPullButtonNode).toBeDisabled();
    const createSnapShotButtonNode = screen.getByRole('button', {
      name: /create snapshot/i,
    });

    expect(createSnapShotButtonNode).toBeInTheDocument();
    expect(createSnapShotButtonNode).toBeDisabled();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationLCM.cloneFamily.request('12345'));
  });
  test('should test the create pull button when there is monitor level access and when the revisions are loaded', async () => {
    initRevisions(
      {
        integrationId: '12345',
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
          },
        },
      }
    );
    expect(screen.getByText(/mocking action group/i)).toBeInTheDocument();
    const createPullButtonNode = screen.getByRole('button', {
      name: /create pull/i,
    });

    expect(createPullButtonNode).toBeInTheDocument();
    await userEvent.click(createPullButtonNode);
    expect(mockUseOpenRevisionWhenValid).toHaveBeenCalledWith({drawerURL: '/test/pull/someGeneratedId/open', integrationId: '12345', isCreatePull: true});
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationLCM.cloneFamily.request('12345'));
  });
  test('should test the create snapshot button when there is monitor level access and when the revisions are loaded', async () => {
    initRevisions(
      {
        integrationId: '12345',
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
          },
        },
      }
    );
    expect(screen.getByText(/mocking action group/i)).toBeInTheDocument();
    const createSnapshotButtonNode = screen.getByRole('button', {
      name: /create snapshot/i,
    });

    expect(createSnapshotButtonNode).toBeInTheDocument();
    await userEvent.click(createSnapshotButtonNode);
    expect(mockUseOpenRevisionWhenValid).toHaveBeenCalledWith({drawerURL: '/test/snapshot/someGeneratedId/open', integrationId: '12345'});
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationLCM.cloneFamily.request('12345'));
  });
  test('should test the spinner when the revisions are being loaded', () => {
    initRevisions(
      {
        integrationId: '12345',
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
          },
        },
      }
    );
    expect(screen.getByText(/mocking revision filters/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking spinner/i)).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationLCM.revisions.request('12345'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationLCM.cloneFamily.request('12345'));
  });
  test('should not render the create pull and create snapshot when the access is set to monitor', () => {
    initRevisions(
      {
        integrationId: '12345',
        userData: {
          profile: {},
          preferences: { defaultAShareId: 'aShare1' },
          org: {
            users: [],
            accounts: [
              {
                _id: 'aShare1',
                accessLevel: 'monitor',
              },
            ],
          },
        },
        revisionsData: {
          12345: {
          },
        },
      }
    );
    expect(screen.queryByText(/mocking action group/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /create pull/i })).not.toBeInTheDocument();
  });
  test('Should test the cleanup function when the integration id is modified in the changed after a reversion loaded', () => {
    const { utils } = initRevisions(
      {
        integrationId: '12345',
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
          },
          67890: {
            status: 'received',
          },
        },
      }
    );

    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationLCM.cloneFamily.request('12345'));
    initRevisions(
      {
        integrationId: '67890',
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
          },
          67890: {
            status: 'received',
          },
        },
        rerender: utils.rerender(),
      }
    );
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationLCM.cloneFamily.clear('12345'));
  });
  test('should test the data of revision when the loading status is completed', () => {
    initRevisions(
      {
        integrationId: '12345',
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
              preset: null,
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
      }
    );
    expect(screen.getByText(/mocking celigo table/i)).toBeInTheDocument();
    expect(screen.getByText(/filterkey = 12345-revisions/i)).toBeInTheDocument();
    expect(screen.getByText(
      /data = \[\{"_id":"rev-1","name":"rev1","type":"pull","_createdbyuserid":"user1","status":"completed","installsteps":\[\{"type":"connection","_connectionid":"con-1234"\},\{"type":"merge"\}\]\}\]/i
    )).toBeInTheDocument();
    screen.debug(null, Infinity);
  });
  test('should test the no revision info text when there is no revision data', () => {
    initRevisions(
      {
        integrationId: '12345',
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
            data: [],
          },
        },
        revisionsFilterData: {
          '12345-revisions': {
            createdAt: {
              preset: null,
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
      }
    );
    expect(screen.getByText(/mocking celigo table/i)).toBeInTheDocument();
    expect(screen.getByText(/filterkey = 12345-revisions/i)).toBeInTheDocument();
    expect(screen.getByText(/data = \[\]/i)).toBeInTheDocument();
    expect(screen.getByText(/you don't have any revisions/i)).toBeInTheDocument();
  });
  test('should test the info text when there is no filter revisions rendered when the filter type is set to snapshot', () => {
    initRevisions(
      {
        integrationId: '12345',
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
      }
    );
    expect(screen.getByText(/mocking celigo table/i)).toBeInTheDocument();
    expect(screen.getByText(/filterkey = 12345-revisions/i)).toBeInTheDocument();
    expect(screen.getByText(/data = \[\]/i)).toBeInTheDocument();
    expect(screen.getByText(
      /your selection didn't return any matching results\. try expanding your filter criteria\./i
    )).toBeInTheDocument();
  });
  test('should test the drawer declaration when the revisions are loaded and has no monitor access', () => {
    initRevisions(
      {
        integrationId: '12345',
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
              preset: null,
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
      }
    );
    expect(screen.getByText(/mocking loadresources/i)).toBeInTheDocument();
    expect(screen.getByText(/resources = flows,integrations/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking view detail drawer/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking openpulldrawer/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking reviewpullchangesdrawer/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking mergepulldrawer/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking openrevertdrawer/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking reviewrevertchangesdrawer/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking finalrevertdrawer/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking create snapshot drawer/i)).toBeInTheDocument();
  });
  test('should test the drawer declaration when the revisions are not loaded and has no monitor access', () => {
    initRevisions(
      {
        integrationId: '12345',
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
            status: 'requested',
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
      }
    );
    expect(screen.queryByText(/Mocking View Detail Drawer/i)).not.toBeInTheDocument();
  });
  test('should test the drawer declaration when the revisions are loaded and has monitor access', () => {
    initRevisions(
      {
        integrationId: '12345',
        userData: {
          profile: {},
          preferences: { defaultAShareId: 'aShare1' },
          org: {
            users: [],
            accounts: [
              {
                _id: 'aShare1',
                accessLevel: 'monitor',
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
              preset: null,
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
      }
    );
    expect(screen.getByText(/Mocking View Detail Drawer/i)).toBeInTheDocument();
  });
});
