
import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import actions from '../../../actions';
import DynaHttpRequestBody from './DynaHttpRequestBody_afe';
import { EXPORT_FILTERED_DATA_STAGE } from '../../../utils/flowData';

const resourceId = 'import-123';
let mockSave = jest.fn();
const mockHistoryPush = jest.fn();
const mockDispatchFn = jest.fn(action => {
  switch (action.type) {
    case 'EDITOR_INIT':
      mockSave = action.options.onSave;
      break;

    default:
  }
});
let mockRouteMatch = {
  path: '/imports/:operation(add|edit)/:resourceType/:id',
  url: `/imports/edit/imports/${resourceId}`,
  isExact: true,
  params: {
    operation: 'edit',
    resourceType: 'imports',
    id: resourceId,
  },
};

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  useRouteMatch: () => mockRouteMatch,
}));

jest.mock('./DynaHandlebarPreview', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaHandlebarPreview'),
  default: ({label, value, onEditorClick}) => (
    <>
      <div data-testid="editorLabel">{label}</div>
      <div data-testid="requestBody">{value}</div>
      <button type="button" onClick={onEditorClick}>openEditor</button>
      <button type="button" onClick={() => mockSave({rule: 'SampleRule'})}>Save</button>
    </>
  ),
}));

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

describe('test suite for DynaTransformRules_afe', () => {
  afterEach(() => {
    mockHistoryPush.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should populate the saved HTTP request body', () => {
    const props = {
      id: 'http.body',
      value: '{type: "http"}',
      resourceId,
      resourceType: 'imports',
      arrayIndex: 0,
      formKey: `imports-${resourceId}`,
      label: 'HTTP request body',
      fieldId: 'http.body',
      name: '/http/body',
      isValid: true,
    };

    render(<DynaHttpRequestBody {...props} />);
    expect(screen.getByTestId('editorLabel')).toHaveTextContent(props.label);
    const requestBody = screen.getByTestId('requestBody');

    expect(requestBody).toHaveTextContent(props.value);
  });

  test('should open the editor on clicking Edit Icon', async () => {
    const props = {
      id: 'http.body',
      resourceId,
      resourceType: 'imports',
      arrayIndex: 0,
      formKey: `imports-${resourceId}`,
      label: 'HTTP request body',
      fieldId: 'http.body',
      name: '/http/body',
      isValid: true,
    };

    render(<DynaHttpRequestBody {...props} />);
    const openEditorBtn = screen.getByRole('button', {name: 'openEditor'});

    await userEvent.click(openEditorBtn);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.init('httpbody', 'handlebars', {
      formKey: props.formKey,
      flowId: props.flowId,
      resourceId,
      resourceType: props.resourceType,
      fieldId: props.id,
      stage: 'postMapOutput',
      onSave: expect.anything(),
      parentType: undefined,
      parentId: undefined,
      mapper2RowKey: props.mapper2RowKey,
    }));

    expect(mockHistoryPush).toHaveBeenCalledWith(`/imports/edit/imports/${resourceId}/editor/httpbody`);
  });

  test('should be able to save the modified code in editor', async () => {
    mockRouteMatch = {
      path: '/exports/:operation(add|edit)/:resourceType/:id',
      url: `/exports/edit/exports/${resourceId}`,
      isExact: true,
      params: {
        operation: 'edit',
        resourceType: 'exports',
        id: resourceId,
      },
    };
    const onFieldChange = jest.fn();
    const props = {
      id: 'http.body',
      resourceId,
      resourceType: 'exports',
      arrayIndex: 0,
      formKey: `exports-${resourceId}`,
      label: 'HTTP request body',
      fieldId: 'http.body',
      name: '/http/body',
      isValid: true,
      onFieldChange,
    };

    render(<DynaHttpRequestBody {...props} />);
    const openEditorBtn = screen.getByRole('button', {name: 'openEditor'});

    await userEvent.click(openEditorBtn);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.init('httpbody', 'handlebars', {
      formKey: props.formKey,
      flowId: props.flowId,
      resourceId,
      resourceType: props.resourceType,
      fieldId: props.id,
      stage: EXPORT_FILTERED_DATA_STAGE,
      onSave: expect.anything(),
      parentType: undefined,
      parentId: undefined,
      mapper2RowKey: props.mapper2RowKey,
    }));

    expect(mockHistoryPush).toHaveBeenCalledWith(`/exports/edit/exports/${resourceId}/editor/httpbody`);

    await userEvent.click(screen.getByRole('button', {name: 'Save'}));
    expect(onFieldChange).toHaveBeenCalledWith(props.id, 'SampleRule');
  });

  test('should save the modified code in editor corresponding to the correct list of requests', async () => {
    const onFieldChange = jest.fn();
    const props = {
      id: 'http.body',
      resourceId,
      resourceType: 'imports',
      arrayIndex: 1,
      formKey: `imports-${resourceId}`,
      label: 'HTTP request body',
      fieldId: 'http.body',
      name: '/http/body',
      value: ['{method: "POST"}', '{method: "GET"}', '{method: "PUT"}'],
      isValid: true,
      onFieldChange,
    };

    render(<DynaHttpRequestBody {...props} />);
    const openEditorBtn = screen.getByRole('button', {name: 'openEditor'});
    const saveBtn = screen.getByRole('button', {name: 'Save'});

    await userEvent.click(openEditorBtn);
    await userEvent.click(saveBtn);
    expect(onFieldChange).toHaveBeenCalledWith(props.id, ['{method: "POST"}', 'SampleRule', '{method: "PUT"}']);
  });
});
