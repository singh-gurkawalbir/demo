
import React from 'react';
import { screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import actions from '../../../../actions';
import {mutateStore, renderWithProviders} from '../../../../test/test-utils';
import DynaChildLicense from './index';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

function initDynaChildLicense(props = {}) {
  mutateStore(initialStore, draft => {
    draft.data.resources.connectorLicenses = [
      {
        _id: '631f34e4798cc1729e8b5118',
        expires: '2023-09-13T06:59:59.999Z',
        created: '2022-09-12T13:32:20.066Z',
        sandbox: false,
        user: {
          email: 'johnwick86@celigo.com',
        },
        type: 'integrationApp',
        _connectorId: '62667711385b5c5d57b88224',
      },
      {
        _id: '636c8902b09587796065061a',
        created: '2022-11-10T05:15:46.535Z',
        user: {
          email: 'johnwick86@celigo.com',
        },
        type: 'integrationAppChild',
        _parentId: '631f34e4798cc1729e8b5118',
        _connectorId: '62667711385b5c5d57b88224',
      },
      {
        _id: '636c8931b095877960650638',
        created: '2022-11-10T05:16:33.595Z',
        user: {
          email: 'johnwick86@celigo.com',
        },
        type: 'integrationAppChild',
        _parentId: '631f34e4798cc1729e8b5118',
        _connectorId: '62667711385b5c5d57b88224',
      },
      {
        _id: '636c8cabc2158f10a5f13ef8',
        created: '2022-11-10T05:31:23.117Z',
        opts: {
          id: 'license',
        },
        user: {
          email: 'johnwick86@celigo.com',
        },
        type: 'integrationAppChild',
        _parentId: '631f34e4798cc1729e8b5118',
        _connectorId: '62667711385b5c5d57b88224',
      },
    ];

    draft.data.resources.connectors = [
      {
        _id: '62667711385b5c5d57b88224',
        name: 'aaa',
        contactEmail: 'johnwick86@celigo.com',
        handle: 'c6a012f3',
        published: false,
        managed: false,
        _integrationId: '62613797dd4afe56b599a2d1',
        lastModified: '2022-04-25T12:09:29.152Z',
        _sharedImportIds: [],
        _sharedExportIds: [],
        _iClientIdMap: [],
        applications: [
          'accelo',
        ],
        framework: 'twoDotZero',
        twoDotZero: {
          _integrationId: '62613797dd4afe56b599a2d1',
          editions: [],
          isParentChild: true,
        },
        trialEnabled: false,
      },
    ];
    draft.session.filters = {
      connectorChildLicenses: {
        sort: {
          order: 'asc',
          orderBy: 'status',
        },
        selected: {},
        isAllSelected: false,
      },
    };
  });
  const ui = (
    <MemoryRouter initialEntries={[{pathname: 'connectors/62667711385b5c5d57b88224/connectorLicenses/edit/connectorLicenses/631f34e4798cc1729e8b5118'}]}>
      <Route path="connectors/62667711385b5c5d57b88224/connectorLicenses/edit/connectorLicenses/631f34e4798cc1729e8b5118">
        <DynaChildLicense {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('../../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../LoadResources'),
  default: props => (
    props.children
  ),
}));

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('../../../../utils/resource', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../utils/resource'),
  generateNewId: () => 'new-Id',
}));

describe('dynaChildLicense UI tests', () => {
  const props = { connectorId: '62667711385b5c5d57b88224', resourceId: '631f34e4798cc1729e8b5118', id: 'demoId', formKey: 'demo-formKey'};
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    done();
  });
  afterEach(async () => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should pass the initial render', () => {
    initDynaChildLicense(props);
    expect(screen.getByText('Create child license')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Integration ID')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();           // Table headers //

    expect(screen.getByText('11/10/2022 5:15:46 am')).toBeInTheDocument();           // value for one of the table row //
  });
  test('should make 2 dispatch calls on initial render', async () => {
    initDynaChildLicense(props);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.patchFilter('connectorChildLicenses', { sort: { order: 'asc', orderBy: 'status' }})));
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('demo-formKey')('demoId', { visible: false})));
  });
  test('should make a dipatch call and URL redirection when "Create child license" is clicked', async () => {
    const patchSet = [
      {
        op: 'add',
        path: '/_connectorId',
        value: '62667711385b5c5d57b88224',
      },
      {
        op: 'add',
        path: '/type',
        value: 'integrationAppChild',
      },
      {
        op: 'add',
        path: '/email',
        value: 'johnwick86@celigo.com',
      },
      {
        op: 'add',
        path: '/_parentId',
        value: '631f34e4798cc1729e8b5118',
      },
    ];

    initDynaChildLicense(props);
    const createButton = screen.getByText('Create child license');

    expect(createButton).toBeInTheDocument();
    await userEvent.click(createButton);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.patchStaged('new-Id', patchSet)));
    await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledWith('connectors/62667711385b5c5d57b88224/connectorLicenses/edit/connectorLicenses/631f34e4798cc1729e8b5118/add/connectorLicenses/new-Id'));
  });
});
