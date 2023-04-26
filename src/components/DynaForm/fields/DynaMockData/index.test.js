/* global */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';
import actions from '../../../../actions';
import errorMessageStore from '../../../../utils/errorStore';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';
import MockDataEditorField from '.';

jest.mock('../../../CodeEditor', () => ({
  __esModule: true,
  ...jest.requireActual('../../../CodeEditor'),
  default: props => {
    let value;

    if (typeof props.value === 'string') {
      value = props.value;
    } else {
      value = JSON.stringify(props.value);
    }
    const handleUpdate = event => {
      props.onChange(props.id, event.target.value);
    };

    return (
      <textarea name="codeEditor" data-test="code-editor" value={value} onChange={handleUpdate} />
    );
  },
}
));
let initialStore = getCreatedStore();
const mockOutput = {
  page_of_records: [
    {
      record: {
        id: 'name',
      },
    },
  ],
};
const mockResponse = [{
  id: '123',
  _json: {name: 'name'},
}];
const resourceId = 'export123';
const formKey = 'newForm';
const mockRouteMatch = {
  path: '/exports/:operation(add|edit)/:resourceType/:id',
  url: `/exports/edit/exports/${resourceId}`,
  isExact: true,
  params: {
    operation: 'edit',
    resourceType: 'imports',
    id: resourceId,
  },
};
const mockOutputFieldProps = {
  onFieldChange: jest.fn(),
  formKey,
  fieldId: 'mockOutput',
  id: 'mockOutput',
  resourceType: 'exports',
  resourceId,
  flowId: 'flow123',
  label: 'Mock output',
  value: JSON.stringify(mockOutput),
};
const mockOutputField = {
  mockOutput: {
    label: 'Mock output',
    helpKey: 'mockOutput',
    type: 'mockoutput',
    name: '/mockOutput',
    defaultValue: '',
    touched: false,
    visible: true,
    required: false,
    disabled: false,
    options: {},
    isValid: true,
    isDiscretelyInvalid: false,
    errorMessages: '',
    ...mockOutputFieldProps,
  },
};
const mockResponseFieldProps = {
  onFieldChange: jest.fn(),
  formKey,
  fieldId: 'mockResponse',
  id: 'mockResponse',
  resourceType: 'exports',
  resourceId,
  flowId: 'flow123',
  value: JSON.stringify(mockResponse),
  label: 'Mock response',
};
const mockResponseField = {
  mockResponse: {
    label: 'Mock response',
    helpKey: 'mockResponse',
    type: 'mockResponse',
    name: '/mockResponse',
    defaultValue: '',
    touched: false,
    visible: true,
    required: false,
    disabled: false,
    options: {},
    isValid: true,
    isDiscretelyInvalid: false,
    errorMessages: '',
    ...mockResponseFieldProps,
  },
};
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
    location: {pathname: 'initialpath'},
  }),
  useRouteMatch: () => mockRouteMatch,
}));

function initMockDataEditorField(inputProps = {}) {
  mutateStore(initialStore, draft => {
    draft.data.resources = {
      exports: [
        {
          _id: resourceId,
          adaptorType: 'HTTPExport',
        },
      ],
    };
    draft.session.form = {
      [formKey]: {
        fields: inputProps.resourceType === 'imports' ? mockResponseField : mockOutputField,
      },
    };
  });

  let props = inputProps.resourceType === 'imports' ? mockResponseFieldProps : mockOutputFieldProps;

  props = {...props, ...inputProps};

  return renderWithProviders(<MockDataEditorField {...props} />, {initialStore});
}

describe('Mock output editor field UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');

    mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should initialize editor field with field value', () => {
    initMockDataEditorField();

    // Mock output field label
    expect(screen.getByText('Mock output')).toBeInTheDocument();

    // Code editor
    expect(screen.getByText(mockOutputFieldProps.value)).toBeInTheDocument();

    // Expand button
    const expandButton = screen.getByRole('button');

    expect(expandButton).toBeInTheDocument();

    expect(expandButton).toBeEnabled();
  });
  test('should dispatch correct action for invalid mock output', () => {
    initMockDataEditorField({value: 'abc', errorMessages: errorMessageStore('MOCK_OUTPUT_INVALID_JSON') });

    expect(screen.getByText('abc')).toBeInTheDocument();

    expect(screen.getByText(errorMessageStore('MOCK_OUTPUT_INVALID_JSON'))).toBeInTheDocument();

    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.form.forceFieldState(formKey)(mockOutputFieldProps.id, {isValid: false, errorMessages: errorMessageStore('MOCK_OUTPUT_INVALID_JSON')})
    );
  });
  test('should dispatch correct action for valid mock output', () => {
    initMockDataEditorField();

    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.form.forceFieldState(formKey)(mockOutputFieldProps.id, {isValid: true})
    );
  });
  test('should push correct drawer url when clicked on expand button if preview panel is available for the resource', () => {
    initMockDataEditorField();

    waitFor(async () => {
      const expandButton = screen.getByRole('button');

      expect(expandButton).toBeInTheDocument();

      expect(expandButton).toBeEnabled();

      await userEvent.click(expandButton);

      expect(mockHistoryPush).toHaveBeenCalledTimes(1);

      expect(mockHistoryPush).toHaveBeenCalledWith(`${buildDrawerUrl({
        path: drawerPaths.RESOURCE_MOCK_DATA,
        baseUrl: mockRouteMatch.url,
        params: { formKey, fieldId: mockOutputFieldProps.id },
      })}`);
    });
  });
});

describe('Mock response editor field UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');

    mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should initialize editor field with field value', () => {
    initMockDataEditorField({resourceType: 'imports'});

    // Mock response field label
    expect(screen.getByText('Mock response')).toBeInTheDocument();

    // Code editor
    expect(screen.getByText(mockResponseFieldProps.value)).toBeInTheDocument();

    // Expand button
    const expandButton = screen.getByRole('button');

    expect(expandButton).toBeInTheDocument();

    expect(expandButton).toBeEnabled();
  });
  test('should dispatch correct action for invalid mock response', () => {
    initMockDataEditorField({resourceType: 'imports', value: 'abc', errorMessages: errorMessageStore('MOCK_RESPONSE_INVALID_JSON') });

    expect(screen.getByText('abc')).toBeInTheDocument();

    expect(screen.getByText(errorMessageStore('MOCK_RESPONSE_INVALID_JSON'))).toBeInTheDocument();

    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.form.forceFieldState(formKey)(mockResponseFieldProps.id, {isValid: false, errorMessages: errorMessageStore('MOCK_RESPONSE_INVALID_JSON')})
    );
  });
  test('should dispatch correct action for valid mock response', () => {
    initMockDataEditorField({resourceType: 'imports'});

    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.form.forceFieldState(formKey)(mockResponseFieldProps.id, {isValid: true})
    );
  });
});
