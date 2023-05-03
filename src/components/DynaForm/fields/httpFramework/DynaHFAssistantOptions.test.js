/* eslint-disable jest/expect-expect */

import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import actions from '../../../../actions';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import WrappedContextConsumer from './DynaHFAssistantOptions';
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

const mockOnFieldChangeFn = jest.fn();
const resourceId = '_exportId';
const resourceType = 'exports';
const props = {
  assistantFieldType: 'operation',
  formKey: 'exports-_exportId',
  label: 'Form view',
  resourceId,
  resourceType,
  resourceContext: {
    resourceId,
    resourceType,
  },
  onFieldChange: mockOnFieldChangeFn,
};
const endpoints = [
  { id: 'ep1', children: [{ key: 'key1', name: 'child1' }], hidden: false, name: 'increment ticket' },
  { id: 'ep2', children: [{ key: 'key2', name: 'child2' }], hidden: false, name: 'increment user access' },
  { id: 'ep3', children: [{ key: 'key3', name: 'child3' }], hidden: false, name: 'increment ticket count' },
];
const operations = [
  { id: 'create_automations', name: 'Create' },
  { id: 'update_automations', name: 'Update' },
  { id: 'delete_automations', name: 'Delete' },
];
const versions = [
  {
    label: 'V2',
    version: 'v2',
  },
  {
    label: 'V3',
    version: 'v3',
  },
];

function initDynaHFAssistantOptions(props = {}, extraFields = {}) {
  mutateStore(initialStore, draft => {
    draft.session.form = {
      'exports-_exportId': {
        fields: {
          ...extraFields,
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
            value: 'create',
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
      },
    };
    draft.session.form = {
      'exports-_exportId': {
        fields: {
          ...extraFields,
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
            value: 'create',
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
      },
    };
    draft.session.resourceForm = {
      'imports-_importId': {
        initData: [{ id: 'id1', value: 'v1' }],
      },
    };
    draft.data.resources = {
      exports: [
        { _id: '_exportId', _connectionId: '_connId', assistant: 'http', name: 'export1' },
      ],
      imports: [
        { _id: '_importId', _connectionId: '_connId', assistant: 'http', name: 'import1' },
      ],
      connections: [{ _id: '_connId', name: 'connection1', assistant: 'zendesk', http: { _httpConnectorId: 'ConnectorId', _httpConnectorVersionId: 'ConnectorVersionId', _httpConnectorApiId: 'ConnectorApiId' } }],
    };
    draft.data.httpConnectors = {
      httpConnectorMetadata: {
        ConnectorIdConnectorVersionIdConnectorApiId: {
          export: {
            config: {},
            endpoints,
            versions,
            resources: [
              {
                id: 'user_api',
                operations,
                endpoints,
                name: 'resource1',
                hidden: false,
                versions,
              },
            ],
          },
          import: {
            versions: [
              {
                label: 'V2',
                version: 'v2',
              },
            ],
            resources: [
              {
                id: 'user_api',
                operations,
                endpoints,
                name: 'resource1',
                hidden: false,
              },
            ],
          },
        },
      },
    };
  });
  renderWithProviders(<WrappedContextConsumer {...props} />, { initialStore });
}

describe('dynaHFAssistantOptions UI tests', () => {
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
  test('should pass the initial render and open the dropdown with options when clicked on it', async () => {
    const extendedPatch = [
      {
        op: 'replace',
        path: '/assistantMetadata/operation',
        value: 'ep3',
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
      {
        op: 'replace',
        path: '/assistantMetadata/operationChanged',
        value: true,
      },
      {
        op: 'replace',
        path: '/assistantMetadata/resource',
        value: undefined,
      },
      {
        op: 'replace',
        path: '/assistantMetadata/version',
        value: 'v2',
      },
      {
        op: 'replace',
        path: '/settingsForm',
        value: {},
      },
    ];

    initDynaHFAssistantOptions({ ...props, id: endpoints[2].id });
    waitFor(() => { expect(screen.getByText('Form view')).toBeInTheDocument(); });
    let dropdown;

    waitFor(async () => {
      dropdown = screen.getByText('Please select');
      expect(dropdown).toBeInTheDocument();
      await userEvent.click(dropdown);
    });

    // import operations are operations while for exports these are endpoints
    waitFor(async () => {
      expect(screen.getByRole('menuitem', { name: 'increment ticket' })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'increment user access' })).toBeInTheDocument();
      await userEvent.click(screen.getByRole('menuitem', { name: 'increment ticket count' }));
      expect(mockOnFieldChangeFn).toHaveBeenCalledWith('ep3', 'ep3');
      expect(mockDispatchFn).toHaveBeenNthCalledWith(1, actions.resource.patchStaged(
        '_exportId',
        extendedPatch,
      ));
    });
  });
  test('should display options for versions in the dropdown when assistantFieldType is "version"', async () => {
    const patch = [
      {
        op: 'replace',
        path: '/assistantMetadata/version',
        value: 'v3',
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
      {
        op: 'replace',
        path: '/assistantMetadata/resource',
        value: undefined,
      },
      {
        op: 'replace',
        path: '/assistantMetadata/operation',
        value: undefined,
      },
    ];

    initDynaHFAssistantOptions({ ...props, assistantFieldType: 'version' });
    waitFor(async () => { await userEvent.click(screen.getByText('Please select')); });
    waitFor(() => { expect(screen.getByText('v2')).toBeInTheDocument(); });
    waitFor(async () => {
      const option = screen.getByText('v3');

      expect(option).toBeInTheDocument();
      await userEvent.click(option);
      expect(mockDispatchFn).toHaveBeenNthCalledWith(1, actions.resource.patchStaged(
        '_exportId',
        patch,
      ));
    });
  });
  test('should display options for resources in the dropdown when assistantFieldType is "resource"', async () => {
    initDynaHFAssistantOptions({ ...props, assistantFieldType: 'resource' });
    waitFor(async () => { await userEvent.click(screen.getByText('Please select')); });
    waitFor(() => { expect(screen.getByText('resource1')).toBeInTheDocument(); });
  });
  test('should display options passed as props in the dropdown when assistantFieldType is exportType', async () => {
    const props = {
      formKey: 'exports-_exportId',
      id: 'assistantMetadata.exportType',
      assistantFieldType: 'exportType',
      resourceContext: {
        resourceId: '_exportId',
        resourceType: 'exports',
      },
      options: [{ items: [{ id: 'id1', value: 'delta' }, { id: 'id2', value: 'option2' }] }],
      onFieldChange: mockOnFieldChangeFn,
    };
    const extraFields = {
      'assistantMetadata.queryParams': {
        paramMeta: { fields: [{ fieldId: 'value' }] },
        value: { id: 'fieldId' },
      },
      'assistantMetadata.bodyParams': {
        paramMeta: { fields: [{ fieldId: 'value' }] },
        value: { id: 'fieldId', lastExportDateTime: 'lastExportDateTime' },
      },
    };

    initDynaHFAssistantOptions(props, extraFields);
    waitFor(async () => { await userEvent.click(screen.getByText('Please select')); });
    waitFor(async () => {
      expect(screen.getByText('delta')).toBeInTheDocument();
      expect(screen.getByText('option2')).toBeInTheDocument();
      await userEvent.click(screen.getByText('option2'));
      expect(mockOnFieldChangeFn).toHaveBeenCalledWith('assistantMetadata.exportType', 'option2');
      expect(mockDispatchFn).toHaveBeenNthCalledWith(2, actions.resourceForm.init(
        undefined,
        undefined,
        false,
        false,
        undefined,
        [{ id: 'demoId', value: '' }, { id: 'assistantMetadata.exportType', value: 'option2' }, { id: 'assistantMetadata.queryParams', value: { id: 'fieldId' } }, { id: 'assistantMetadata.bodyParams', value: { id: 'fieldId'} }]
      ));
    });
    waitFor(async () => {
      await userEvent.click(screen.getByText('delta'));
      expect(mockOnFieldChangeFn).toHaveBeenCalledWith('assistantMetadata.exportType', 'delta');
      expect(mockDispatchFn).toHaveBeenNthCalledWith(4, actions.resourceForm.init(
        undefined,
        undefined,
        false,
        false,
        undefined,
        [{ id: 'demoId', value: '' }, { id: 'assistantMetadata.exportType', value: 'delta' }, { id: 'assistantMetadata.queryParams', value: { id: 'fieldId' } }, { id: 'assistantMetadata.bodyParams', value: { id: 'fieldId', lastExportDateTime: 'lastExportDateTime' } }]
      ));
    });
  });
  test('should display options for resources with resourceType "imports" and perform form init', async () => {
    const resourceContext = { resourceType: 'imports', resourceId: '_importId' };

    initDynaHFAssistantOptions({
      ...props,
      isHTTPFramework: true,
      assistantFieldType: 'resource',
      resourceContext,
      ...resourceContext,
      fieldId: 'fieldId',
    });
    waitFor(async () => {
      await userEvent.click(screen.getByText('Please select'));
      await userEvent.click(screen.getByRole('menuitem', { name: 'resource1' }));
    });
  });
  test('should display no options for resources with invalid resourceType', async () => {
    const resourceContext = { resourceType: 'imports', resourceId: '_importId' };

    initDynaHFAssistantOptions({
      onFieldChange: mockOnFieldChangeFn,
      resourceContext,
      fields: {},
    });
    waitFor(async () => {
      await userEvent.click(screen.getByText('Please select'));
      await userEvent.click(screen.getByRole('menuitem'));
    });
    expect(mockOnFieldChangeFn).toHaveBeenCalledWith(undefined, '', true);
  });
});
