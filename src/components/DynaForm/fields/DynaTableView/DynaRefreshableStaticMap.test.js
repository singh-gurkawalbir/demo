import React from 'react';
import {screen, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaRefreshableStaticMap from './DynaRefreshableStaticMap';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import actions from '../../../../actions';
import * as mockEnqueSnackbar from '../../../../hooks/enqueueSnackbar';

const formKey = 'form_key';
const mockDispatchFn = jest.fn();
const enqueueSnackbar = jest.fn();
const mockOnFieldChange = jest.fn();
const initialStore = reduxStore;

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    location: {pathname: '/'},
  }),
}));
mutateStore(initialStore, draft => {
  draft.data.resources = {
    integrations: [{
      _id: '_integrationId',
      _connectionId: '_connectionId',
      _connectorId: '_connectorId',
    }],
  };
  draft.session.metadata = {
    application: {
      _connectionId: {
        somepath: {
          status: 'refreshed',
          data: {
            name: 'asd',
            scriptId: 'xyz',
            url: 'https:://sampleURL.com',
          },
          changeIdentifier: 'somechangeidentifier',
        },
      },
    },
  };

  draft.session.form[formKey] = {
    showValidationBeforeTouched: true,
  };
});
function initDynaRefreshableStaticMap(props = {}) {
  const ui = (
    <DynaRefreshableStaticMap {...props} />
  );

  return renderWithProviders(ui, {initialStore});
}

describe('DynaRefreshableStaticMap UI test cases', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(mockEnqueSnackbar, 'default').mockReturnValue([enqueueSnackbar]);
  });
  afterEach(() => {
    enqueueSnackbar.mockClear();
    jest.clearAllMocks();
  });
  test('should call enquesnackbar if there are errors and test refresh buttons and update the text in the rows', async () => {
    mutateStore(initialStore, draft => {
      draft.session.exportData = {
        '-916382817':
        {status: 'refreshed',
          data: ['somedata', 'somedatatext'],
          error: 'someerror'},
        '-307590762': {
          status: 'requested',
          data: ['somedata1', 'somedata2'],
          error: 'someerror1',
        },
      };
    });
    const genralProps = {
      connectionId: '_connectionId',
      field: 'Type',
      id: 'someId',
      valueOptions: ['Id', 'Name'],
      map: {name: 'samplename'},
      value: [{extract: 'id', generate: 'Id'}, {extract: 'name', generate: 'samplename'}],
      commMetaPath: 'somepath',
      ignoreEmptyRow: () => {},
      onFieldChange: mockOnFieldChange,
      resourceContext: {resourceId: '_integrationId', resourceType: 'integrations'},
      keyResource: {virtual: { key: '_resourcekey'}},
      valueResource: {virtual: { key: '_valuekey'}},
      filterKey: 'suitescript-recordTypes',
      disableFetch: true,
      formKey: 'form_key',
    };

    initDynaRefreshableStaticMap(genralProps);
    expect(enqueueSnackbar).toHaveBeenCalledWith({message: 'someerror', variant: 'error'});
    expect(enqueueSnackbar).toHaveBeenCalledWith({message: 'someerror1', variant: 'error'});
    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByText('Import')).toBeInTheDocument();
    expect(screen.getByDisplayValue('id')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Id')).toBeInTheDocument();
    expect(screen.getByDisplayValue('name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('samplename')).toBeInTheDocument();
    const input = screen.getAllByRole('combobox');

    fireEvent.change(input[0], {target: {value: ''}});

    fireEvent.change(input[0], {target: {value: 'export'}});
    fireEvent.change(input[1], {target: {value: ''}});
    fireEvent.change(input[1], {target: {value: 'import'}});
    expect(screen.queryByText('id')).not.toBeInTheDocument();
    expect(screen.queryByText('Id')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('export')).toBeInTheDocument();
    expect(screen.getByDisplayValue('import')).toBeInTheDocument();
    expect(mockOnFieldChange).toHaveBeenCalledWith('someId', [
      { extract: 'export', generate: 'import' },
      { extract: 'name', generate: 'samplename' },
    ]);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.exportData.request({kind: 'virtual', identifier: '-916382817', resource: {_connectionId: '_connectionId', _connectorId: '_connectorId', key: '_resourcekey'}, resourceContext: {_integrationId: '_integrationId', container: 'integration', type: 'settings'}}));
    await userEvent.click(document.querySelector('svg[class="MuiSvgIcon-root makeStyles-refreshIcon-11"]'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.exportData.request({kind: 'virtual', identifier: '-916382817', resource: {_connectionId: '_connectionId', _connectorId: '_connectorId', key: '_resourcekey'}, resourceContext: {_integrationId: '_integrationId', container: 'integration', type: 'settings'}}));
  });
  test('should test static map with number data by setting prefered value as num to true', () => {
    mutateStore(initialStore, draft => {
      draft.session.exportData = {
        '-916382817':
        {status: 'refreshed',
          data: ['somedata', 'somedatatext'],
          error: 'someerror'},
        '-307590762': {
          status: 'requested',

        },
      };
    });
    const genralProps = {
      field: 'Type',
      id: 'someId',
      valueOptions: ['2', '3'],
      map: {7: '3'},
      commMetaPath: 'somepath',
      ignoreEmptyRow: () => {},
      preferMapValueAsNum: true,
      onFieldChange: mockOnFieldChange,
      resourceContext: {resourceId: '_integrationId', resourceType: 'integrations'},
      filterKey: 'suitescript-recordTypes',
      disableFetch: false,
      formKey: 'form_key',
    };

    initDynaRefreshableStaticMap(genralProps);
    expect(screen.getByDisplayValue('7')).toBeInTheDocument();
    expect(screen.getByDisplayValue('3')).toBeInTheDocument();
    const input = screen.getAllByRole('combobox');

    fireEvent.change(input[0], {target: {value: '8'}});
    fireEvent.change(input[1], {target: {value: '2'}});
    expect(screen.queryByText('7')).not.toBeInTheDocument();
    expect(screen.queryByText('3')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('8')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    expect(mockDispatchFn).toBeCalledWith(
      actions.metadata.request(
        undefined,
        'somepath'
      )
    );
  });
});
