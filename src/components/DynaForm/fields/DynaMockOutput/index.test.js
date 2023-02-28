/* global */
import React from 'react';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';
import MockOutputEditorField from '.';
import actions from '../../../../actions';
import errorMessageStore from '../../../../utils/errorStore';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';

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
const onFieldChange = jest.fn();
let initialStore = getCreatedStore();
const formKey = 'newForm';
const fieldId = 'mockOutput';
const id = 'mockOutput';
const resourceType = 'exports';
const resourceId = 'export123';
const flowId = 'flow123';
const mockOutput = {
  page_of_records: [
    {
      record: {
        id: 'name',
      },
    },
  ],
};
const value = JSON.stringify(mockOutput);
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

function initMockOutputEditorField(inputProps) {
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
          mockOutput: {
            label: 'Mock output',
            helpKey: 'mockOutput',
            type: 'mockoutput',
            fieldId,
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
    label: 'Mock output',
    onFieldChange,
    ...inputProps,
  };

  return renderWithProviders(<MockOutputEditorField {...props} />, {initialStore});
}

describe('MockOutputEditorField UI tests', () => {
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
    initMockOutputEditorField();

    // Mock output field label
    expect(screen.getByText('Mock output')).toBeInTheDocument();

    // Code editor
    expect(screen.getByText(value)).toBeInTheDocument();

    // Expand button
    const expandButton = screen.getByRole('button');

    expect(expandButton).toBeInTheDocument();

    expect(expandButton).toBeEnabled();
  });
  test('should dispatch correct action for invalid mock output', () => {
    initMockOutputEditorField({value: 'abc', errorMessages: errorMessageStore('MOCK_OUTPUT_INVALID_JSON') });

    expect(screen.getByText('abc')).toBeInTheDocument();

    expect(screen.getByText(errorMessageStore('MOCK_OUTPUT_INVALID_JSON'))).toBeInTheDocument();

    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.form.forceFieldState(formKey)(id, {isValid: false, errorMessages: errorMessageStore('MOCK_OUTPUT_INVALID_JSON')})
    );
  });
  test('should dispatch correct action for valid mock output', () => {
    initMockOutputEditorField();

    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.form.forceFieldState(formKey)(id, {isValid: true})
    );
  });
  test('should push correct drawer url when clicked on expand button if preview panel is available for the resource', async () => {
    initMockOutputEditorField();

    const expandButton = screen.getByRole('button');

    expect(expandButton).toBeInTheDocument();

    expect(expandButton).toBeEnabled();

    await userEvent.click(expandButton);

    expect(mockHistoryPush).toHaveBeenCalledTimes(1);

    expect(mockHistoryPush).toHaveBeenCalledWith(`${buildDrawerUrl({
      path: drawerPaths.EXPORT_MOCK_OUTPUT,
      baseUrl: mockRouteMatch.url,
      params: { formKey, fieldId: id },
    })}`);
  });
});
