import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import Filters from './Filters';
import {renderWithProviders, reduxStore, mutateStore} from '../../test/test-utils';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.data.audit = {
    integrations: {
      '6253af74cddb8a1ba550a010': [
        {
          _id: '62c6f1aea2f4a703c3dee3fd',
          resourceType: 'flow',
          _resourceId: '62c6f122a2f4a703c3dee3d0',
          source: 'ui',
          fieldChanges: [
            {
              oldValue: true,
              newValue: false,
              fieldPath: 'disabled',
            },
          ],
          event: 'update',
          time: '2022-07-07T14:46:06.187Z',
          byUser: {
            _id: '62386a5fed961b5e22e992c7',
            email: 'testUser@celigo.com',
            name: 'test user',
          },
        },
      ],
    },
  };
  draft.session.filters = {
    'integrations-6253af74cddb8a1ba550a010-auditLogs': {
      paging: {
        rowsPerPage: 50,
        currPage: 0,
      },
      byUser: 'all',
      event: 'all',
      resourceType: 'all',
      source: 'all',
      _resourceId: 'all',
    },
  };
});
const propsObj = {
  resourceDetails: {
    ssoclients: {},
    integrations: {
      integration_id_1: {
        name: 'integration_one',
      },
      integration_id_2: {
        name: 'integration_two',
      },
    },
    transfers: {},
    imports: {
      import_id_1: {
        name: 'import_one',
      },
      import_id_2: {
        name: 'import_two',
      },
    },
    'ui/assistants': {},
    exports: {
      export_id_1: {
        name: 'export_one',
      },
      export_id_2: {
        name: 'export_two',
      },
    },
    flows: {
      flow_id_1: {
        name: 'flow_one',
        _integrationId: 'integration_id_1',
        numImports: 1,
        disabled: true,
      },
      flow_id_2: {
        name: 'flow_two',
        _integrationId: 'integration_id_1',
        numImports: 4,
        disabled: true,
      },
    },
    scripts: {
      script_id_1: {
        name: 'script_one',
      },
      script_id_2: {
        name: 'script_two',
      },
    },
    'shared/sshares': {},
    connections: {
      connection_id_1: {
        name: 'connection_one',
      },
      connection_id_2: {
        name: 'connection_two',
      },
    },
    filedefinitions: {},
  },
  resourceType: 'integrations',
  resourceId: '6253af74cddb8a1ba550a010',
  totalCount: 1,
};

jest.mock('../DateRangeSelector', () => ({
  __esModule: true,
  ...jest.requireActual('../DateRangeSelector'),
  default: props => (

    // eslint-disable-next-line react/button-has-type
    <div><button onClick={props.onSave}>Download</button></div>
  ),
}));
describe('uI test cases for Audit Log Filter', () => {
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

    renderWithProviders(<Filters {... propsObj} />, {initialStore});
  });
  afterEach(() => {
    useDispatchSpy.mockClear();
  });

  test('should display the download button in the DOM', () => {
    expect(screen.getByRole('button', {name: /download/i})).toBeInTheDocument();
  });

  test('should display 7 options on clicking the select source dropdown', async () => {
    const sourceType = screen.getByText(/Select source/i);

    expect(sourceType).toBeInTheDocument();
    await userEvent.click(sourceType);

    const allSourceOptions = screen.getAllByRole('option');

    expect(allSourceOptions).toHaveLength(7);
    const defaultType = await screen.findByRole('option', {name: /Select source/i});

    expect(defaultType).toBeInTheDocument();
    expect(screen.getByText('UI')).toBeInTheDocument();
    expect(screen.getByText('API')).toBeInTheDocument();
    expect(screen.getByText('Stack')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
    expect(screen.getByText('SSO')).toBeInTheDocument();
    expect(screen.getByText('Integration app')).toBeInTheDocument();
  });

  test('should display the available users on clicking the Select user dropdown', async () => {
    const selectUser = screen.getByText(/Select user/i);

    expect(selectUser).toBeInTheDocument();
    await userEvent.click(selectUser);
    const users = screen.getAllByRole('option');

    expect(users).toHaveLength(2);
    expect(screen.getByText('test user')).toBeInTheDocument();
    const defaultType = screen.getByRole('option', {name: /Select user/i});

    expect(defaultType).toBeInTheDocument();
  });

  test('should display 12 options on clicking the "Select resources type" drop down', async () => {
    const resourceType = screen.getByText('Select resource type');

    expect(resourceType).toBeInTheDocument();

    await userEvent.click(resourceType);

    const resourceOptions = screen.getAllByRole('option');

    expect(resourceOptions).toHaveLength(13);
    const defaultType = screen.getByRole('option', {name: /Select resource type/i});

    expect(defaultType).toBeInTheDocument();
  });
  test('should run the onSave function on clicking the mocked download button', async () => {
    await userEvent.click(screen.getByText('Download'));
    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
  });
  test('should able to pass initial render with default values having logs > 0 and navigate to next and previous Page', () => {
    expect(screen.getByText(/1 - 1 of 1+/i)).toBeInTheDocument();
    const rowsTextNode = screen.getByText(/Results per page:/i);

    expect(rowsTextNode).toBeInTheDocument();
    const prevPageButtonNode = screen.getByTestId(/prevPage/i);

    expect(prevPageButtonNode).toBeInTheDocument();
    const nextPageButtonNode = screen.getByTestId(/nextPage/i);

    expect(nextPageButtonNode).toBeInTheDocument();
  });
});
describe('filters test cases', () => {
  test('should display the user emailId under select users tab when name is not present', async () => {
    const tempStore = reduxStore;

    mutateStore(tempStore, draft => {
      draft.data.audit = {
        integrations: {
          '6253af74cddb8a1ba550a010': [
            {
              _id: '62c6f1aea2f4a703c3dee3fd',
              resourceType: 'flow',
              _resourceId: '62c6f122a2f4a703c3dee3d0',
              source: 'ui',
              fieldChanges: [
                {
                  oldValue: true,
                  newValue: false,
                  fieldPath: 'disabled',
                },
              ],
              event: 'update',
              time: '2022-07-07T14:46:06.187Z',
              byUser: {
                _id: '62386a5fed961b5e22e992c7',
                email: 'testUser@celigo.com',
              },
            },
          ],
        },
      };
      draft.session.filters = {
        'integrations-6253af74cddb8a1ba550a010-auditLogs': {
          paging: {
            rowsPerPage: 50,
            currPage: 0,
          },
          byUser: 'all',
          event: 'all',
          resourceType: 'all',
          source: 'all',
          _resourceId: 'all',
        },
      };
    });
    renderWithProviders(<Filters {...propsObj} />, {initialStore: tempStore});
    await userEvent.click(screen.getByText(/Select user/i));
    waitFor(() => expect(screen.getByText(/testUser@celigo.com/i)).toBeInTheDocument());
  });
});

