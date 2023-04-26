
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import { ConfirmDialogProvider } from '../../../ConfirmDialog';
import DynaSemiHFAssistantOperationSelect from './DynaSemiHFAssistantOperationSelect';
import { getCreatedStore } from '../../../../store';

const mockOnFieldChangeFn = jest.fn();
const initialStore = getCreatedStore();
const props = {
  assistantFieldType: 'operation',
  formKey: 'exports-_exportId',
  resourceId: '_exportId',
  resourceType: 'exports',
  onFieldChange: mockOnFieldChangeFn,
  assistant: 'openair',
  flowId: '_flowId',
};

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

function initDynaSemiHFAssistantOperationSelect(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.form = {
      'exports-_exportId': {
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
          ],
          type: {},
          'once.once': {},
          'delta.delta': {},
          'random.field': {},
        },
      },
    };
    draft.data = {
      resources: {
        exports: [
          { _id: '_exportId', _connectionId: '_connId', assistant: 'http', name: 'export1' },
        ],
        connections: [{ _id: '_connId', name: 'connection1', assistant: props.assistant, http: {_httpConnectorId: 'ConnectorId', _httpConnectorVersionId: 'ConnectorVersionId', _httpConnectorApiId: 'ConnectorApiId'} }],
      },
      httpConnectors: {
        httpConnectorMetadata: {
          ConnectorIdConnectorVersionIdConnectorApiId: {
            export: {
              config: {},
              endpoints: [
                { id: 'operation1', children: [{ key: 'key1', name: 'child1' }], name: 'increment ticket' },
                { id: 'operation2', children: [{ key: 'key2', name: 'child2' }], name: 'increment user access' },
                { id: 'operation3', children: [{ key: 'key3', name: 'child3' }], name: 'increment ticket count' },
                { key: '' },
              ],
              versions: [
                {
                  resources: [
                    {
                      id: 'user_api',
                      operations: [
                        { id: 'create_automations', name: 'Create' },
                        { id: 'update_automations', name: 'Update' },
                        { id: 'delete_automations', name: 'Delete' },
                      ],
                      name: 'resource1',
                    },
                    {
                      id: 'id2',
                      name: 'resource2',
                    },
                  ],
                  version: 'v2',
                }, {
                  resources: [],
                  version: 'v3',
                }],
            },
          },
        },
      },
    };
  });

  return renderWithProviders(<ConfirmDialogProvider><DynaSemiHFAssistantOperationSelect {...props} /></ConfirmDialogProvider>, { initialStore });
}

describe('dynaSemiHFAssistantOperationSelect UI tests', () => {
  test('should pass the initial render with openair assistant in exports', async () => {
    initDynaSemiHFAssistantOperationSelect(props);
    expect(screen.getByText('Select an operation')).toBeInTheDocument();
    const dropdown = screen.getByRole('button', { name: 'Please select' });

    expect(dropdown).toBeInTheDocument();
    await userEvent.click(dropdown);
    const option = screen.getByText('child1');

    expect(option).toBeInTheDocument();
    await userEvent.click(option);
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('This will clear some of the http field values and populate them with the default values for the selected operation. Are you sure want to proceed?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Yes'));
    expect(mockOnFieldChangeFn).toHaveBeenNthCalledWith(1, undefined, '.key1');
    expect(mockOnFieldChangeFn).toHaveBeenNthCalledWith(2, 'http.fields', '');
    expect(mockOnFieldChangeFn).toHaveBeenNthCalledWith(3, 'type', 'all');
    expect(mockOnFieldChangeFn).toHaveBeenNthCalledWith(4, 'once.once', '');
    expect(mockOnFieldChangeFn).toHaveBeenNthCalledWith(5, 'delta.delta', '');
  });

  test('should not render the dropdown when assistant is not "openair', () => {
    const { utils } = initDynaSemiHFAssistantOperationSelect({...props, assistant: 'zendesk', resourceId: '_exp2'});

    expect(utils.container).toBeEmptyDOMElement();
  });
});
