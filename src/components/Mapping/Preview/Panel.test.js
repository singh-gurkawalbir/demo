
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import Panel from './Panel';
import { runServer } from '../../../test/api/server';
import { renderWithProviders, reduxStore, mockGetRequestOnce, mutateStore } from '../../../test/test-utils';
import actions from '../../../actions';
import customCloneDeep from '../../../utils/customCloneDeep';

async function initPanel({props = {}, adaptorType = 'SalesforceImport', initialStore, searchLayoutable = true } = {}) {
  mutateStore(initialStore, draft => {
    draft.data.resources = {
      imports: [{
        _id: props.importId,
        _connectionId: 'connection_id_1',
        _integrationId: '_integration_id',
        adaptorType,
        mappings: {
          fields: [{
            generate: 'generate_1',
          }, {
            generate: 'generate_2',
            lookupName: 'lookup_name',
          }],
          lists: [{
            generate: 'item',
            fields: [],
          }],
        },
        salesforce: {
          sObjectType: 'sObjectType',
        },
      }],
      connections: [{
        _id: 'connection_id_1',
        http: {

        },
      }],
    };
    if (adaptorType !== 'RDBMSImport') {
      draft.data.resources.imports[0].http = {
        requestMediaType: 'xml',
        body: ['GET'],
      };
    }
    draft.session.metadata = {
      application: {
        connection_id_1: {
          'salesforce/metadata/connections/connection_id_1/sObjectTypes/sObjectType': {
            changeIdentifier: 1,
            data: {
              fields: {},
              recordTypeInfos: [
                {
                  recordTypeId: 'record_type_id',
                },
              ],
              searchLayoutable,
            },
            status: 'received',
          },
          'netsuite/metadata/suitescript/connections/connection_id_1/recordTypes': {
            status: 'received',
            data: [],
          },
        },
      },
    };
  });
  const ui = (
    <MemoryRouter>
      <Panel {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}
const mockHandleSFNSAssistantFieldClick = jest.fn().mockReturnValue({
  meta: {
    id: 'id',
    sublistName: 'sublistName',
  },
});

jest.mock('../../NetSuiteMappingAssistant', () => ({
  __esModule: true,
  ...jest.requireActual('../../NetSuiteMappingAssistant'),
  default: props => {
    const OnClick = () => {
      const { meta } = mockHandleSFNSAssistantFieldClick();

      props.onFieldClick(meta);
    };

    return (
      <>
        <button type="button" onClick={OnClick}>
          Missing connection configuration.
        </button>
      </>
    );
  },
}));

jest.mock('../../SalesforceMappingAssistant', () => ({
  __esModule: true,
  ...jest.requireActual('../../SalesforceMappingAssistant'),
  default: props => {
    const OnClick = () => {
      const { meta } = mockHandleSFNSAssistantFieldClick();

      props.onFieldClick(meta);
    };

    return (
      <>
        <button type="button" onClick={OnClick}>
          sObjectType is a non-layoutable entity.
        </button>
      </>
    );
  },
}));

jest.mock('./HttpMappingAssistant_afe', () => ({
  __esModule: true,
  ...jest.requireActual('./HttpMappingAssistant_afe'),
  default: () => (
    <>
      <button type="button">
        HttpMappingAssistant_afe component
      </button>
    </>
  ),
}));

describe('Panel component test cases', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;
  let initialStore;

  beforeEach(() => {
    initialStore = customCloneDeep(reduxStore);
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case 'MAPPING_PATCH_GENERATE_THROUGH_ASSISTANT':
          break;
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    mockDispatchFn.mockClear();
    useDispatchSpy.mockClear();
  });

  test('should pass the Panel component for Salesforce import', async () => {
    await initPanel({
      props: {
        importId: 'import_id',
      },
      initialStore,
    });

    expect(screen.queryByText(/sObjectType is a non-layoutable entity./i)).toBeInTheDocument();
    await userEvent.click(screen.queryByText(/sObjectType is a non-layoutable entity./i));
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockDispatchFn).toBeCalledWith(actions.mapping.patchGenerateThroughAssistant('id'));
  });

  test('should pass the Panel component for Salesforce import searchLayoutable false', async () => {
    await initPanel({
      props: {
        importId: 'import_id',
      },
      initialStore,
      searchLayoutable: false,
    });

    expect(screen.queryByText(/sObjectType is a non-layoutable entity./i)).not.toBeInTheDocument();
  });

  test('should pass the Panel component for Salesforce import with disable true', async () => {
    await initPanel({
      props: {
        importId: 'import_id',
        disabled: true,
      },
      initialStore,
    });

    expect(screen.queryByText(/sObjectType is a non-layoutable entity./i)).toBeInTheDocument();
    await userEvent.click(screen.queryByText(/sObjectType is a non-layoutable entity./i));
    expect(mockDispatchFn).toBeCalledTimes(0);
  });

  test('should pass the Panel component for NetSuite import', async () => {
    mockGetRequestOnce('api/netsuite/metadata/suitescript/connections/connection_id_1/recordTypes', {
      data: [],
    });
    await initPanel({
      props: {
        importId: 'import_id',
      },
      adaptorType: 'NetSuiteImport',
      initialStore,
    });

    await expect(screen.queryByText(/Missing connection configuration./i)).toBeInTheDocument();
    await userEvent.click(screen.queryByText(/Missing connection configuration./i));
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockDispatchFn).toBeCalledWith(actions.mapping.patchGenerateThroughAssistant('sublistName[*].id'));
  });

  test('should pass the Panel component for NetSuite import without sublist', async () => {
    mockHandleSFNSAssistantFieldClick.mockReturnValue({
      meta: {
        id: 'id',
      },
    });
    mockGetRequestOnce('api/netsuite/metadata/suitescript/connections/connection_id_1/recordTypes', {
      data: [],
    });
    await initPanel({
      props: {
        importId: 'import_id',
      },
      adaptorType: 'NetSuiteImport',
      initialStore,
    });

    await expect(screen.queryByText(/Missing connection configuration./i)).toBeInTheDocument();
    await userEvent.click(screen.queryByText(/Missing connection configuration./i));
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockDispatchFn).toBeCalledWith(actions.mapping.patchGenerateThroughAssistant('id'));
  });

  test('should pass the Panel component for HTTP import', async () => {
    mockGetRequestOnce('api/processors', {
      data: [],
    });
    await initPanel({
      props: {
        importId: 'import_id',
      },
      adaptorType: 'HTTPImport',
      initialStore,
    });

    expect(screen.queryByText(/sObjectType is a non-layoutable entity./i)).not.toBeInTheDocument();
    expect(screen.queryByText(/HttpMappingAssistant_afe component/i)).toBeInTheDocument();
  });

  test('should pass the Panel component for RDBMSImport', async () => {
    await initPanel({
      props: {
        importId: 'import_id',
      },
      adaptorType: 'RDBMSImport',
      initialStore,
    });

    expect(screen.queryByText(/sObjectType is a non-layoutable entity./i)).not.toBeInTheDocument();
    expect(screen.queryByText(/HttpMappingAssistant_afe component/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Missing connection configuration./i)).not.toBeInTheDocument();
  });
});
