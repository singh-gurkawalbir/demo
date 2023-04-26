
import React from 'react';
import { screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {mutateStore, renderWithProviders} from '../../../../test/test-utils';
import { ConfirmDialogProvider } from '../../../ConfirmDialog';
import DynaSemiAssistantOperationSelect from './DynaSemiAssistantOperationSelect';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

function initDynaSemiAssistantOperationSelect(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.form = {'imports-5bf18b09294767270c62fad9': {
      fields: {
        'http.fields': [
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
            id: 'http.assistantMetadata.operation',
            value: '',
          },
        ],
        type: {},
        'once.once': {},
        'delta.delta': {},
      },
    }};
    draft.data.resources = {
      imports: [{_id: '5bf18b09294767270c62fad9', _connectionId: '5ff579d745ceef7dcd797c26', assistant: 'http', name: 'import1'}],
      connections: [{_id: '5ff579d745ceef7dcd797c26', name: 'connection1', assistant: props.assistant}],
    };
    draft.session.metadata = {
      assistants: {
        http: {
          openair: {
            export: {
              config: {},
              endpoints: [{id: 'operation1', children: [{key: 'key1', name: 'child1'}], name: 'increment ticket'},
                {id: 'operation2', children: [{key: 'key2', name: 'child2'}], name: 'increment user access'},
                {id: 'operation3', children: [{key: 'key3', name: 'child3'}], name: 'increment ticket count'}, {key: ''}],
              versions: [{
                resources: [
                  {
                    id: 'user_api',
                    operations: [{id: 'create_automations', name: 'Create'},
                      {id: 'update_automations', name: 'Update'}, {id: 'delete_automations', name: 'Delete'},
                    ],
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
  });

  return renderWithProviders(<ConfirmDialogProvider><DynaSemiAssistantOperationSelect {...props} /></ConfirmDialogProvider>, {initialStore});
}

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

describe('dynaAssistantSearchParams UI tests', () => {
  const mockOnFieldChangeFn = jest.fn();

  test('should pass the initial render', () => {
    const props = {
      assistantFieldType: 'operation',
      formKey: 'imports-5bf18b09294767270c62fad9',
      resourceId: '5bf18b09294767270c62fad9',
      resourceType: 'imports',
      label: 'demo label',
      onFieldChange: mockOnFieldChangeFn,
      assistant: 'openair',
      flowId: '6bf18b09294767270c62fad9',
    };

    initDynaSemiAssistantOperationSelect(props);
    expect(screen.getByText('demo label')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Please select'})).toBeInTheDocument();
  });

  test('should display the dropdown options when clicked on dropdown', async () => {
    const props = {
      assistantFieldType: 'operation',
      formKey: 'imports-5bf18b09294767270c62fad9',
      resourceId: '5bf18b09294767270c62fad9',
      resourceType: 'imports',
      label: 'demo label',
      onFieldChange: mockOnFieldChangeFn,
      assistant: 'openair',
      flowId: '6bf18b09294767270c62fad9',
    };

    initDynaSemiAssistantOperationSelect(props);
    const dropdown = screen.getByRole('button', {name: 'Please select'});

    await userEvent.click(dropdown);
    expect(screen.getByText('child1')).toBeInTheDocument();
    expect(screen.getByText('child2')).toBeInTheDocument();
    expect(screen.getByText('child3')).toBeInTheDocument();
  });
  test('should display the confirmDialog clicked on an option from the dropdown', async () => {
    const props = {
      assistantFieldType: 'operation',
      formKey: 'imports-5bf18b09294767270c62fad9',
      resourceId: '5bf18b09294767270c62fad9',
      resourceType: 'imports',
      label: 'demo label',
      onFieldChange: mockOnFieldChangeFn,
      assistant: 'openair',
      flowId: '6bf18b09294767270c62fad9',
    };

    initDynaSemiAssistantOperationSelect(props);
    const dropdown = screen.getByRole('button', {name: 'Please select'});

    await userEvent.click(dropdown);
    const option = screen.getByText('child1');

    await userEvent.click(option);
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('This will clear some of the http field values and populate them with the default values for the selected operation. Are you sure want to proceed?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
  test('should call the onFieldChange function when "Yes" is clicked in the confirm dialog', async () => {
    const props = {
      assistantFieldType: 'operation',
      formKey: 'imports-5bf18b09294767270c62fad9',
      resourceId: '5bf18b09294767270c62fad9',
      resourceType: 'imports',
      onFieldChange: mockOnFieldChangeFn,
      assistant: 'openair',
      flowId: '6bf18b09294767270c62fad9',
    };

    initDynaSemiAssistantOperationSelect(props);
    const dropdown = screen.getByRole('button', {name: 'Please select'});

    await userEvent.click(dropdown);
    const option = screen.getByText('child1');

    await userEvent.click(option);
    await userEvent.click(screen.getByText('Yes'));
    expect(mockOnFieldChangeFn).toHaveBeenCalled();
  });
  test('should render the dropdown only when assistant is "openair', () => {
    const props = {
      assistantFieldType: 'operation',
      formKey: 'imports-5bf18b09294767270c62fad9',
      resourceId: '5bf18b09294767270c62fad9',
      resourceType: 'imports',
      label: 'demo label',
      onFieldChange: mockOnFieldChangeFn,
      assistant: 'zendesk',
      flowId: '6bf18b09294767270c62fad9',
    };

    const {utils} = initDynaSemiAssistantOperationSelect(props);

    expect(utils.container).toBeEmptyDOMElement();
  });
});
