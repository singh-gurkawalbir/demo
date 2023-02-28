
import React from 'react';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {DrawerProvider} from '../../Right/DrawerContext/index';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import ViewRevisionDetails from '.';
import { getCreatedStore } from '../../../../store';

const mockHistoryReplace = jest.fn();
const mockHistoryPush = jest.fn();
const props = {integrationId: '_integrationId'};

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
    push: mockHistoryPush,
  }),
}));
jest.mock('../../Right', () => ({
  __esModule: true,
  ...jest.requireActual('../../Right'),
  default: ({children}) => children,
}));

async function initViewRevisionDetails(props = {}, mode = 'details', revisionId = '_revisionId') {
  const initialStore = getCreatedStore();

  mutateStore(initialStore, draft => {
    draft.session.lifeCycleManagement.revision._integrationId = {
      _revisionId: { errors: {status: 'completed'}},
    };
    draft.user = {
      profile: {
        _id: '_userId',
        name: '_userName',
        email: '_userEmail',
      },
      preferences: {
        defaultAShareId: 'aSharedId',
        accounts: {aSharedId: {}}},
      org: {
        accounts: [
          {
            _id: 'aSharedId',
            accepted: true,
            accessLevel: 'manage',
          },
        ],
      },
    };
    draft.data.integrationAShares = {
      _integrationId: [{
        _id: 'aSharedId',
        accepted: true,
        accessLevel: 'manage',
        sharedWithUser: {
          _id: '_userId',
        },
      }],
    };

    draft.data.revisions = {
      _integrationId: {
        data: [
          {
            _id: '_revisionId',
            description: 'Snapshot for testing',
            type: 'snapshot',
            _createdByUserId: '_userId',
            _integrationId: '_integrationId',
            status: 'completed',
          },
          {
            _id: '_revertRevId',
            description: 'Reverting to previous Snapshot',
            type: 'revert',
            _createdByUserId: '_userId',
            _integrationId: '_integrationId',
            _revertToRevisionId: '_revisionId',
            status: 'completed',
          },
        ],
      },
    };
  });

  const ui = (
    <MemoryRouter initialEntries={[{pathname: `parentURL/view/${revisionId}/mode/${mode}`}]}>
      <Route
        path="parentURL/view/:revisionId/mode/:mode"
        params={{revisionId, mode}}>
        <DrawerProvider>
          <ViewRevisionDetails {...props} />
        </DrawerProvider>
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
describe('ViewRevisionDetails tests', () => {
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
    mockHistoryReplace.mockClear();
    mockHistoryPush.mockClear();
  });

  test('Should able to test the initial render with mode details and type: snapshot', async () => {
    await initViewRevisionDetails(props);
    expect(screen.getByRole('heading', {name: 'Snapshot for testing'})).toBeInTheDocument();
    expect(screen.getByRole('tab', {name: 'View details'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'General'})).toBeInTheDocument();
    const closeDrawer = screen.getAllByRole('button').find(b => b.getAttribute('data-test') === 'closeRightDrawer');
    const cancelViewChanges = screen.getAllByRole('button').find(b => b.getAttribute('data-test') === 'cancelViewChanges');

    expect(closeDrawer).toBeEnabled();
    expect(cancelViewChanges).toBeEnabled();
    await userEvent.click(closeDrawer);
    expect(mockHistoryReplace).toHaveBeenCalledWith('parentURL/view/_revisionId/mode/details');
  });
  test('Should able to test the initial render with invalid revisionType', async () => {
    await initViewRevisionDetails(props, 'details', '_invalidRev');
    expect(mockHistoryReplace).toHaveBeenCalledWith('parentURL/view/_invalidRev/mode/details');
  });
  test('Should able to test the initial render with mode changes', async () => {
    await initViewRevisionDetails(props, 'changes', '_revertRevId');
    expect(screen.getByRole('button', {name: 'Expand all'})).toBeInTheDocument();
    expect(screen.getByRole('tabpanel', {name: 'View resources changed'})).toBeInTheDocument();
    const detailstab = screen.getByRole('tab', {name: 'View details'});

    expect(detailstab).toBeInTheDocument();
    await userEvent.click(detailstab);
    expect(mockHistoryPush).toHaveBeenCalledWith('parentURL/view/_revertRevId/mode/changes/view/_revertRevId/mode/details');
  });
});
