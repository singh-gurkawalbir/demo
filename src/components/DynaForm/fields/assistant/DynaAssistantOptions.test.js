/* global describe, test, expect , jest, beforeEach, afterEach */
import React from 'react';
import { screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import actions from '../../../../actions';
import {renderWithProviders} from '../../../../test/test-utils';
import WrappedContextConsumer from './DynaAssistantOptions';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

function initDynaDate(props = {}) {
  initialStore.getState().session.form = {'imports-5bf18b09294767270c62fad9': {
    fields: [
      {
        id: 'assistantMetadata.adaptorType',
        value: 'rest',
      },
      {
        id: 'assistantMetadata.assistant',
        value: 'zendesk',
      },
      {
        id: 'assistantMetadata.version',
        value: 'v2',
      },
      {
        id: 'assistantMetadata.resource',
        touched: props.touched,
        value: 'user_api',
      },
      {
        id: 'assistantMetadata.operation',
        value: '',
      },
    ],
  }};
  initialStore.getState().data.resources = {integrations: [{_id: '5ff579d745ceef7dcd797c15', name: 'integration1'}]};
  initialStore.getState().user.preferences = {
    dateFormat: 'MM/DD/YYYY',
    ssConnectionIds: props.connections,
  };
  initialStore.getState().user.profile = {
    timezone: 'Asia/Calcutta',
    _connectorId: '6aa579d745ceef7dcd797c15',
  };
  initialStore.getState().session.metadata = {
    assistants: {
      rest: {
        zendesk: {
          export: {
            versions: [{
              resources: [
                {
                  id: 'user_api',
                  operations: [{id: 'create_automations', name: 'Create'},
                    {id: 'update_automations', name: 'Update'}, {id: 'delete_automations', name: 'Delete'},
                  ],
                  endpoints: [{id: 'operation1', name: 'increment ticket'},
                    {id: 'operation2', name: 'increment user access'},
                    {id: 'operation3', name: 'increment ticket count'}],
                  name: 'resource1',
                },
                { id: 'id2',
                  name: 'resource2',
                },
              ],
              version: 'v2',
            }, {
              resources: [],
              version: 'v3',
            }],
          },
          import: {versions: [{
            resources: [{id: 'user_api',
              operations: [{id: 'create_automations', name: 'Create'},
                {id: 'update_automations', name: 'Update'}, {id: 'delete_automations', name: 'Delete'},
              ],
              name: 'resource11'}, {id: 'id22', name: 'resource22'}],
            version: 'v2',
          }],
          },
        },
      },
    },
  };

  renderWithProviders(<WrappedContextConsumer {...props} />, {initialStore});
}

describe('WrappedContextConsumer UI tests', () => {
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
  test('should pass the initial render and open the dropdown with options when clicked on it', () => {
    const mockOnFieldChangeFn = jest.fn();
    const props = {
      assistantFieldType: 'operation',
      formKey: 'imports-5bf18b09294767270c62fad9',
      resourceContext: {
        resourceId: '5bf18b09294767270c62fad9',
        resourceType: 'exports',
      },
      onFieldChange: mockOnFieldChangeFn,
    };

    initDynaDate(props);
    const dropdown = screen.getByText('Please select');

    expect(dropdown).toBeInTheDocument();
    userEvent.click(dropdown);
    expect(screen.getByText('increment ticket')).toBeInTheDocument();
    expect(screen.getByText('increment user access')).toBeInTheDocument();
    expect(screen.getByText('increment ticket count')).toBeInTheDocument();
  });
  test('should display options for imports in the dropdown when resourcetype is sent as "imports"', () => {
    const mockOnFieldChangeFn = jest.fn();
    const props = {
      assistantFieldType: 'operation',
      formKey: 'imports-5bf18b09294767270c62fad9',
      resourceContext: {
        resourceId: '5bf18b09294767270c62fad9',
        resourceType: 'imports',
      },
      onFieldChange: mockOnFieldChangeFn,
    };

    initDynaDate(props);
    const dropdown = screen.getByText('Please select');

    expect(dropdown).toBeInTheDocument();
    userEvent.click(dropdown);
    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
  test('should display options for versions in the dropdown when assistantFieldType is "version"', () => {
    const mockOnFieldChangeFn = jest.fn();
    const props = {
      assistantFieldType: 'version',
      formKey: 'imports-5bf18b09294767270c62fad9',
      resourceContext: {
        resourceId: '5bf18b09294767270c62fad9',
        resourceType: 'exports',
      },
      onFieldChange: mockOnFieldChangeFn,
    };

    initDynaDate(props);
    const dropdown = screen.getByText('Please select');

    expect(dropdown).toBeInTheDocument();
    userEvent.click(dropdown);
    expect(screen.getByText('v2')).toBeInTheDocument();
    expect(screen.getByText('v3')).toBeInTheDocument();
  });
  test('should display options for resources in the dropdown when assistantFieldType is "resource"', () => {
    const mockOnFieldChangeFn = jest.fn();
    const props = {
      assistantFieldType: 'resource',
      formKey: 'imports-5bf18b09294767270c62fad9',
      resourceContext: {
        resourceId: '5bf18b09294767270c62fad9',
        resourceType: 'exports',
      },
      onFieldChange: mockOnFieldChangeFn,
    };

    initDynaDate(props);
    const dropdown = screen.getByText('Please select');

    expect(dropdown).toBeInTheDocument();
    userEvent.click(dropdown);
    expect(screen.getByText('resource1')).toBeInTheDocument();
    expect(screen.getByText('resource2')).toBeInTheDocument();
  });
  test('should display options passed as props in the dropdown when assistantFieldType is not passed', () => {
    const mockOnFieldChangeFn = jest.fn();
    const props = {
      formKey: 'imports-5bf18b09294767270c62fad9',
      resourceContext: {
        resourceId: '5bf18b09294767270c62fad9',
        resourceType: 'exports',
      },
      options: [{items: [{id: 'id1', value: 'option1'}, {id: 'id2', value: 'option2'}, {id: 'id3', value: 'option3'}]}],
      onFieldChange: mockOnFieldChangeFn,
    };

    initDynaDate(props);
    const dropdown = screen.getByText('Please select');

    expect(dropdown).toBeInTheDocument();
    userEvent.click(dropdown);
    expect(screen.getByText('option1')).toBeInTheDocument();
    expect(screen.getByText('option2')).toBeInTheDocument();
    expect(screen.getByText('option3')).toBeInTheDocument();
  });
  test('should make a dispatch call when the field value is changed by clicking on an option in the dropbox', async () => {
    const mockOnFieldChangeFn = jest.fn();
    const patch = [
      {
        op: 'replace',
        path: '/assistantMetadata/operation',
        value: 'update_automations',
      },
      {
        op: 'replace',
        path: '/assistantMetadata/operationChanged',
        value: true,
      },
    ];
    const props = {
      id: 'fieldId',
      assistantFieldType: 'operation',
      formKey: 'imports-5bf18b09294767270c62fad9',
      resourceContext: {
        resourceId: '5bf18b09294767270c62fad9',
        resourceType: 'imports',
      },
      onFieldChange: mockOnFieldChangeFn,
      flowId: '6bf18b09294767270c62fad9',
      resourceType: 'flows',
      resourceId: '5bf18b09294767270c62fad9',
    };

    initDynaDate(props);
    const dropdown = screen.getByText('Please select');

    expect(dropdown).toBeInTheDocument();
    userEvent.click(dropdown);
    const option = screen.getByText('Update');

    expect(option).toBeInTheDocument();
    userEvent.click(option);
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.resource.patchStaged(
      '5bf18b09294767270c62fad9',
      patch,
      'value'
    )));
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(
      actions.resourceForm.init(
        'flows',
        '5bf18b09294767270c62fad9',
        false,
        false,
        '6bf18b09294767270c62fad9',
        [{id: 'fieldId', value: 'update_automations'}]
      )
    ));
  });
  test('should make a dispatch call with a different patch array when the assistantFieldType is other than "operation"', async () => {
    const mockOnFieldChangeFn = jest.fn();
    const patch = [
      {
        op: 'replace',
        path: '/assistantMetadata/version',
        value: 'v2',
      },
      {
        op: 'replace',
        path: '/assistantMetadata/resource',
        value: '',
      },
      {
        op: 'replace',
        path: '/assistantMetadata/operation',
        value: '',
      },
      {
        op: 'replace',
        path: '/assistantMetadata/exportType',
        value: '',
      },
      {
        op: 'replace',
        path: '/assistantMetadata/dontConvert',
        value: true,
      },
    ];
    const props = {
      id: 'fieldId',
      assistantFieldType: 'version',
      formKey: 'imports-5bf18b09294767270c62fad9',
      resourceContext: {
        resourceId: '5bf18b09294767270c62fad9',
        resourceType: 'exports',
      },
      touched: true,
      onFieldChange: mockOnFieldChangeFn,
      flowId: '6bf18b09294767270c62fad9',
      resourceType: 'flows',
      resourceId: '5bf18b09294767270c62fad9',
    };

    initDynaDate(props);
    const dropdown = screen.getByText('Please select');

    expect(dropdown).toBeInTheDocument();
    userEvent.click(dropdown);
    const option = screen.getByText('v2');

    expect(option).toBeInTheDocument();
    userEvent.click(option);
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.resource.patchStaged(
      '5bf18b09294767270c62fad9',
      patch,
      'value'
    )));
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(
      actions.resourceForm.init(
        'flows',
        '5bf18b09294767270c62fad9',
        false,
        false,
        '6bf18b09294767270c62fad9',
        [{id: 'fieldId', value: 'v2'}]
      )
    ));
  });
});
