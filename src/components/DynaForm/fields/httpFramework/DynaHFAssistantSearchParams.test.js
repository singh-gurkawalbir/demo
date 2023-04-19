
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import actions from '../../../../actions';
import { renderWithProviders } from '../../../../test/test-utils';
import DynaHFAssistantSearchParams from './DynaHFAssistantSearchParams';

const mockOnFieldChangeFn = jest.fn();
const mockHistoryPush = jest.fn();
const props = {
  assistantFieldType: 'operation',
  id: 'formId',
  formKey: 'imports-5bf18b09294767270c62fad9',
  value: { status: 'HOLD', levels: '3' },
  resourceId: '5bf18b09294767270c62fad9',
  resourceType: 'exports',
  paramMeta: {
    paramLocation: 'query',
    fields: [
      {
        id: 'role',
        name: 'Role',
        fieldType: 'select',
        required: true,
        options: [
          'end-user',
          'agent',
          'admin',
        ],
      },
      {
        id: 'status',
        name: 'status',
        fieldType: 'array',
      },
      {
        id: 'permission_set',
        name: 'Permission set',
        required: true,
        fieldType: 'input',
      },
      {
        id: 'levels',
        name: 'Levels',
        fieldType: 'multiselect',
        options: [
          '1',
          '2',
          '3',
          '5',
        ],
      },
    ],
    isDeltaExport: false,
    defaultValuesForDeltaExport: {},
  },
  resourceContext: {
    resourceId: '5bf18b09294767270c62fad9',
    resourceType: 'exports',
  },
  label: 'demo label',
  disabled: false,
  onFieldChange: mockOnFieldChangeFn,
};

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

function initDynaHFAssistantSearchParams(props = {}) {
  return renderWithProviders(<MemoryRouter><DynaHFAssistantSearchParams {...props} /></MemoryRouter>);
}
describe('DynaHFAssistantSearchParams UI tests', () => {
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
    mockHistoryPush.mockClear();
  });

  test('should pass the initial render with required field set', async () => {
    initDynaHFAssistantSearchParams({ ...props, required: true });
    expect(screen.getByText('demo label')).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState(props.formKey)(props.id, { isValid: false, errorMessages: 'A value must be provided' }));
    expect(screen.getAllByRole('button', { name: 'Open handlebars editor' })[0]).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('button', { name: 'Open handlebars editor' })[1]);
    expect(mockDispatchFn).toHaveBeenCalled();
    expect(mockHistoryPush).toHaveBeenCalledWith('//editor/formId');
  });
  test('should pass the initial render with empty label', async () => {
    initDynaHFAssistantSearchParams({ ...props, required: true, label: null });
    expect(screen.getByText('Query parameters')).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('button', { name: 'Open handlebars editor' })[2]); // delete button
    expect(mockOnFieldChangeFn).toHaveBeenCalledWith('formId', {role: undefined, status: 'HOLD', levels: '3'});
  });
  test('should pass the initial render with key-value provided using props', async () => {
    initDynaHFAssistantSearchParams({ ...props, required: true, keyName: 'name', valueName: 'value', showDelete: true });
    await userEvent.click(screen.getAllByRole('button', { name: 'Open handlebars editor' })[2]); // delete button
    expect(mockOnFieldChangeFn).toHaveBeenCalledWith('formId', {role: undefined, status: 'HOLD', levels: '3'});
  });
  test('should pass the initial render with paramLocation as "body"', () => {
    props.paramMeta.paramLocation = 'body';
    initDynaHFAssistantSearchParams({ ...props, label: null, value: {}, resourceType: 'imports' });
    expect(screen.getByText('Configure body parameters')).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenNthCalledWith(1, actions.form.forceFieldState(props.formKey)(props.id, { isValid: true }));
  });
});
