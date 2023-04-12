import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../test/test-utils';
import DynaHFAssistantPathParams from './DynaHFAssistantPathParams';
import actions from '../../../../actions';
import { EXPORT_FILTERED_DATA_STAGE } from '../../../../utils/flowData';

const onFieldChange = jest.fn();
const props = {
  formKey: 'exports-export-123',
  id: 'assistantMetadata.pathParams.pathField',
  type: 'hfpathparams',
  label: 'Path field',
  value: 'value1',
  description: 'Any helper text related to path param',
  resourceType: 'exports',
  resourceId: 'export-123',
  isValid: true,
  showLookup: false,
  onFieldChange,
};
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
  url: '/exports/edit/exports/export-123',
  isExact: true,
  params: {
    operation: 'edit',
    resourceType: 'exports',
    id: 'export-123',
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

describe('DynaHFAssistantPathParams UI tests', () => {
  afterEach(() => {
    mockHistoryPush.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should render input field when options is not provided', () => {
    renderWithProviders(<DynaHFAssistantPathParams {...props} />);
    const label = document.querySelector('label');

    expect(label).toHaveTextContent(props.label);
    expect(screen.getByRole('textbox')).toHaveValue(props.value);
    expect(screen.getByText(props.description)).toBeInTheDocument();
  });

  test('should render dropdown field when options are provided', async () => {
    const extraProps = {
      labelName: 'name',
      valueName: 'value',
      value: undefined,
      options: { suggestions: [{ name: 'option1', value: 'value1' }] },
    };

    renderWithProviders(<DynaHFAssistantPathParams {...props} {...extraProps} />);
    const label = document.querySelector('label');

    expect(label).toHaveTextContent(props.label);
    await userEvent.click(screen.getByRole('textbox'));
    expect(screen.getByRole('option', { name: 'option1' })).toBeInTheDocument();
  });

  test('should open handlebars editor on clicking AFE Icon', async () => {
    renderWithProviders(<DynaHFAssistantPathParams {...props} />);
    const openAfeBtn = screen.getByRole('button', { name: 'Open handlebars editor' });

    await userEvent.hover(openAfeBtn);
    await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('Open handlebars editor'));

    await userEvent.click(openAfeBtn);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.init('assistantMetadatapathParamspathField', 'handlebars', {
      formKey: props.formKey,
      flowId: props.flowId,
      resourceId: props.resourceId,
      resourceType: props.resourceType,
      fieldId: props.id,
      stage: EXPORT_FILTERED_DATA_STAGE,
      onSave: mockSave,
      parentType: undefined,
      parentId: undefined,
      connectionId: undefined,
    }));
    expect(mockHistoryPush).toHaveBeenCalledWith('/exports/edit/exports/export-123/editor/assistantMetadatapathParamspathField');
  });

  test('should be able to save the changes in AFE', async () => {
    mockRouteMatch = {
      path: '/exports/:operation(add|edit)/:resourceType/:id',
      url: '/exports/edit/exports/export-123',
      isExact: true,
      params: {
        operation: 'edit',
        resourceType: 'exports',
        id: 'export-123',
      },
    };
    renderWithProviders(
      <>
        <DynaHFAssistantPathParams {...props} />
        <button type="button" onClick={() => mockSave({ rule: 'SampleRule' })}>Save</button>
      </>
    );
    const openAfeBtn = screen.getByRole('button', { name: 'Open handlebars editor' });

    await userEvent.click(openAfeBtn);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onFieldChange).toHaveBeenCalledWith(props.id, 'SampleRule');
  });
});
