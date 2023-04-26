
import React from 'react';
import { screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import actions from '../../../../actions';
import {mutateStore, renderWithProviders} from '../../../../test/test-utils';
import WrappedContextConsumer from './DynaAssistantOptions';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

function initDynaDate(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.form = {'imports-5bf18b09294767270c62fad9': {
      fields: {
        'assistantMetadata.queryParams': {
          paramMeta: {fields: [{fieldId: 'value'}]},
          value: {id: 'fieldId'},
        },
        'assistantMetadata.adaptorType': {
          id: 'assistantMetadata.adaptorType',
          value: 'rest',
        },
        'assistantMetadata.assistant': {
          id: 'assistantMetadata.assistant',
          value: 'zendesk',
        },
        'assistantMetadata.version': {
          id: 'assistantMetadata.version',
          value: 'v2',
        },
        'assistantMetadata.resource': {
          id: 'assistantMetadata.resource',
          touched: props.touched,
          value: 'user_api',
        },
        'assistantMetadata.operation': {
          id: 'assistantMetadata.operation',
          value: '',
        },
        demofield: {
          id: 'demoId',
          touched: true,
          value: '',
        },
        'assistantMetadata.demoField': {
          id: 'assistantMetadata.demoField',
          touched: true,
          type: 'assistantoptions',
          value: '',
        },
      },
    }};
    draft.data.resources = {integrations: [{_id: '5ff579d745ceef7dcd797c15', name: 'integration1'}]};
    draft.user.preferences = {
      dateFormat: 'MM/DD/YYYY',
      ssConnectionIds: props.connections,
    };
    draft.user.profile = {
      timezone: 'Asia/Calcutta',
      _connectorId: '6aa579d745ceef7dcd797c15',
    };
    draft.session.metadata = {
      assistants: {
        rest: {
          zendesk: {
            export: {
              versions: [{
                resources: [
                  {
                    id: 'user_api',
                    operations: [{id: 'delta', name: 'option1'}, {id: 'create_automations', name: 'Create'},
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
                operations: [{id: 'deltaaaa', name: 'option0'}, {id: 'delta', name: 'option1'}, {id: 'create_automations', name: 'Create'},
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
  });

  renderWithProviders(<WrappedContextConsumer {...props} />, {initialStore});
}

describe('wrappedContextConsumer UI tests', () => {
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

  test('should pass the initial render and open the dropdown with options when clicked on it', async () => {
    initDynaDate(props);
    const dropdown = screen.getByText('Please select');

    expect(dropdown).toBeInTheDocument();
    await userEvent.click(dropdown);
    expect(screen.getByText('increment ticket')).toBeInTheDocument();
    expect(screen.getByText('increment user access')).toBeInTheDocument();
    expect(screen.getByText('increment ticket count')).toBeInTheDocument();
  });
  test('should display options for imports in the dropdown when resourcetype is sent as "imports"', async () => {
    initDynaDate({...props,
      resourceContext: {
        resourceId: '5bf18b09294767270c62fad9',
        resourceType: 'imports',
      }});
    const dropdown = screen.getByText('Please select');

    expect(dropdown).toBeInTheDocument();
    await userEvent.click(dropdown);
    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
  test('should display options for versions in the dropdown when assistantFieldType is "version"', async () => {
    initDynaDate({...props, assistantFieldType: 'version'});
    const dropdown = screen.getByText('Please select');

    expect(dropdown).toBeInTheDocument();
    await userEvent.click(dropdown);
    expect(screen.getByText('v2')).toBeInTheDocument();
    expect(screen.getByText('v3')).toBeInTheDocument();
  });
  test('should display options for resources in the dropdown when assistantFieldType is "resource"', async () => {
    initDynaDate({...props, assistantFieldType: 'resource'});
    const dropdown = screen.getByText('Please select');

    expect(dropdown).toBeInTheDocument();
    await userEvent.click(dropdown);
    expect(screen.getByText('resource1')).toBeInTheDocument();
    expect(screen.getByText('resource2')).toBeInTheDocument();
  });
  test('should display options passed as props in the dropdown when assistantFieldType is not passed', async () => {
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
    await userEvent.click(dropdown);
    expect(screen.getByText('option1')).toBeInTheDocument();
    expect(screen.getByText('option2')).toBeInTheDocument();
    expect(screen.getByText('option3')).toBeInTheDocument();
  });
  test('should make a dispatch call when the field value is changed by clicking on an option in the dropbox', async () => {
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

    initDynaDate({...props,
      id: 'fieldId',
      resourceContext: {
        resourceId: '5bf18b09294767270c62fad9',
        resourceType: 'imports',
      },
      flowId: '6bf18b09294767270c62fad9',
      resourceType: 'flows',
      resourceId: '5bf18b09294767270c62fad9' });
    const dropdown = screen.getByText('Please select');

    expect(dropdown).toBeInTheDocument();
    await userEvent.click(dropdown);
    const option = screen.getByText('Update');

    expect(option).toBeInTheDocument();
    await userEvent.click(option);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.patchStaged(
      '5bf18b09294767270c62fad9',
      patch,
    )));
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.resourceForm.init(
        'flows',
        '5bf18b09294767270c62fad9',
        false,
        false,
        '6bf18b09294767270c62fad9',
        [
          { id: 'demoId', value: '' },
          { id: 'assistantMetadata.demoField', value: '' },
          { id: 'fieldId', value: 'update_automations' },
        ]
      )
    ));
  });
  test('should make a dispatch call with a different patch array when the assistantFieldType is other than "operation"', async () => {
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

    initDynaDate({...props, id: 'fieldId', assistantFieldType: 'version', flowId: '6bf18b09294767270c62fad9', resourceType: 'flows', resourceId: '5bf18b09294767270c62fad9' });
    const dropdown = screen.getByText('Please select');

    expect(dropdown).toBeInTheDocument();
    await userEvent.click(dropdown);
    const option = screen.getByText('v2');

    expect(option).toBeInTheDocument();
    await userEvent.click(option);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.patchStaged(
      '5bf18b09294767270c62fad9',
      patch,
    )));
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.resourceForm.init(
        'flows',
        '5bf18b09294767270c62fad9',
        false,
        false,
        '6bf18b09294767270c62fad9',
        [
          { id: 'demoId', value: '' },
          { id: 'assistantMetadata.demoField', value: '' },
          { id: 'fieldId', value: 'v2' },
        ]
      )
    ));
  });
  test('should be able to click on any option from the dropdown', async () => {
    initDynaDate({...props,
      id: 'assistantMetadata.exportType',
      resourceContext: {
        resourceId: '5bf18b09294767270c62fad9',
        resourceType: 'imports',
      }});
    const dropdown = screen.getByText('Please select');

    expect(dropdown).toBeInTheDocument();
    await userEvent.click(dropdown);
    const option = screen.getByText('option1');

    await userEvent.click(option);

    await userEvent.click(option);

    waitFor(async () => { await userEvent.click(screen.getByText('option0')); });
  });
});
