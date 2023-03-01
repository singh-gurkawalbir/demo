/* global */
import React from 'react';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';
import actions from '../../../actions';
import errorMessageStore from '../../../utils/errorStore';
import DynaMockResponse from './DynaMockResponse';

jest.mock('../../CodeEditor', () => ({
  __esModule: true,
  ...jest.requireActual('../../CodeEditor'),
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
const onFieldChange = jest.fn();
let initialStore = getCreatedStore();
const formKey = 'newForm';
const fieldId = 'mockResponse';
const id = 'mockResponse';
const resourceType = 'exports';
const resourceId = 'export123';
const flowId = 'flow123';
const mockResponse = [{
  id: '123',
  _json: {name: 'name'},
}];
const value = JSON.stringify(mockResponse);
const mockRouteMatch = {
  path: '/imports/:operation(add|edit)/:resourceType/:id',
  url: `/imports/edit/imports/${resourceId}`,
  isExact: true,
  params: {
    operation: 'edit',
    resourceType: 'imports',
    id: resourceId,
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

function initmockResponseEditorField(inputProps) {
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
        fields: {
          mockResponse: {
            label: 'Mock response',
            helpKey: 'mockResponse',
            type: 'mockResponse',
            fieldId,
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
            id,
            formKey,
            resourceType,
            resourceId,
            flowId,
            value,
          },
        },
      },
    };
  });
  const props = {
    id,
    formKey,
    resourceType,
    resourceId,
    flowId,
    value,
    label: 'Mock response',
    onFieldChange,
    ...inputProps,
  };

  return renderWithProviders(<DynaMockResponse {...props} />, {initialStore});
}

describe('DynaMockResponse UI tests', () => {
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
    initmockResponseEditorField();

    // Mock response field label
    expect(screen.getByText('Mock response')).toBeInTheDocument();

    // Code editor
    expect(screen.getByText(value)).toBeInTheDocument();

    // Expand button
    const expandButton = screen.getByRole('button');

    expect(expandButton).toBeInTheDocument();

    expect(expandButton).toBeEnabled();
  });
  test('should dispatch correct action for invalid mock response', () => {
    initmockResponseEditorField({value: 'abc', errorMessages: errorMessageStore('MOCK_RESPONSE_INVALID_JSON') });

    expect(screen.getByText('abc')).toBeInTheDocument();

    expect(screen.getByText(errorMessageStore('MOCK_RESPONSE_INVALID_JSON'))).toBeInTheDocument();

    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.form.forceFieldState(formKey)(id, {isValid: false, errorMessages: errorMessageStore('MOCK_RESPONSE_INVALID_JSON')})
    );
  });
  test('should dispatch correct action for valid mock response', () => {
    initmockResponseEditorField();

    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.form.forceFieldState(formKey)(id, {isValid: true})
    );
  });
});
