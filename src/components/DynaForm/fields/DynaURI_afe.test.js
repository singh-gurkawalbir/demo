import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import DynaURI from './DynaURI_afe';
import actions from '../../../actions';
import { EXPORT_FILTERED_DATA_STAGE } from '../../../utils/flowData';

const resourceId = 'export-123';
let mockSave = jest.fn();
const mockDispatchFn = jest.fn(action => {
  switch (action.type) {
    case 'EDITOR_INIT':
      mockSave = action.options.onSave;
      break;

    default:
  }
});
const mockHistoryPush = jest.fn();
let mockRouteMatch = {
  path: '/exports/:operation(add|edit)/:resourceType/:id',
  url: `/exports/edit/exports/${resourceId}`,
  isExact: true,
  params: {
    operation: 'edit',
    resourceType: 'exports',
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

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

describe('test suite for DynaURI_afe field', () => {
  afterEach(() => {
    mockHistoryPush.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should populate the saved values', () => {
    const props = {
      formKey: `exports-${resourceId}`,
      id: 'ftp.fileNameStartsWith',
      type: 'uri',
      label: 'File name starts with',
      value: 'TC_C12345',
      description: 'File name should start with this value',
      resourceType: 'exports',
      resourceId,
      isValid: true,
    };

    renderWithProviders(<DynaURI {...props} />);
    const label = document.querySelector('label');

    expect(label).toHaveTextContent(props.label);
    expect(screen.getByRole('textbox')).toHaveValue(props.value);
    expect(screen.getByText(props.description)).toBeInTheDocument();
  });

  test('should open handlebars editor on clicking AFE Icon', async () => {
    const props = {
      formKey: `exports-${resourceId}`,
      id: 'ftp.fileNameStartsWith',
      type: 'uri',
      label: 'File name starts with',
      resourceType: 'exports',
      resourceId,
      isValid: true,
    };

    renderWithProviders(<DynaURI {...props} />);
    const openAfeBtn = screen.getByRole('button');

    await userEvent.hover(openAfeBtn);
    await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('Open handlebars editor'));

    await userEvent.click(openAfeBtn);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.init('ftpfileNameStartsWith', 'handlebars', {
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
    expect(mockHistoryPush).toHaveBeenCalledWith(`/exports/edit/exports/${resourceId}/editor/ftpfileNameStartsWith`);
  });

  test('should be able to save the changes in AFE', async () => {
    const onFieldChange = jest.fn();

    mockRouteMatch = {
      path: '/imports/:operation(add|edit)/:resourceType/:id',
      url: `/imports/edit/imports/${resourceId}`,
      isExact: true,
      params: {
        operation: 'edit',
        resourceType: 'imports',
        id: resourceId,
      },
    };
    const props = {
      formKey: `imports-${resourceId}`,
      id: 'ftp.fileNameStartsWith',
      type: 'uri',
      label: 'File name starts with',
      resourceType: 'imports',
      resourceId,
      onFieldChange,
      isValid: true,
    };

    renderWithProviders(
      <>
        <DynaURI {...props} />
        <button type="button" onClick={() => mockSave({ rule: 'SampleRule' })}>Save</button>
      </>
    );
    const openAfeBtn = screen.getByRole('button', { name: 'Open handlebars editor' });

    await userEvent.click(openAfeBtn);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.init('ftpfileNameStartsWith', 'handlebars', {
      formKey: props.formKey,
      flowId: props.flowId,
      resourceId,
      resourceType: props.resourceType,
      fieldId: props.id,
      stage: 'importMappingExtract',
      onSave: expect.anything(),
      parentType: undefined,
      parentId: undefined,
      mapper2RowKey: props.mapper2RowKey,
    }));
    expect(mockHistoryPush).toHaveBeenCalledWith(`/imports/edit/imports/${resourceId}/editor/ftpfileNameStartsWith`);

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onFieldChange).toHaveBeenCalledWith(props.id, 'SampleRule');
  });
});
