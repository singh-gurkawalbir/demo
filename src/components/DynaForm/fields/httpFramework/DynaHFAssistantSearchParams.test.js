
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
  value: { role: 'something' },
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
        id: 'role[]',
        name: 'Multiple role selection',
        type: 'array',
      },
      {
        id: 'permission_set',
        name: 'Permission set',
        required: true,
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
describe('dynaHFAssistantSearchParams UI tests', () => {
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

  test('should pass the initial render with required field set', () => {
    initDynaHFAssistantSearchParams({ ...props, required: true });
    expect(screen.getByText('demo label')).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState(props.formKey)(props.id, { isValid: false, errorMessages: 'A value must be provided' }));
    expect(screen.getAllByRole('button', { name: 'tooltip' })[0]).toBeInTheDocument();
    userEvent.click(screen.getAllByRole('button', { name: 'tooltip' })[1]);
    expect(mockDispatchFn).toHaveBeenCalled();
    expect(mockHistoryPush).toHaveBeenCalledWith('//editor/formId');
  });
  test('should pass the initial render with empty label', () => {
    initDynaHFAssistantSearchParams({ ...props, required: true, label: null });
    expect(screen.getByText('Query parameters')).toBeInTheDocument();
    userEvent.click(screen.getAllByRole('button', { name: 'tooltip' })[2]); // delete button
    expect(mockOnFieldChangeFn).toHaveBeenCalledWith('formId', {role: 'something'});
  });
  test('should pass the initial render with key-value provided using props', () => {
    initDynaHFAssistantSearchParams({ ...props, required: true, keyName: 'name', valueName: 'updated_permission_set', showDelete: true });
    userEvent.click(screen.getAllByRole('button', { name: 'tooltip' })[2]); // delete button
    expect(mockOnFieldChangeFn).toHaveBeenCalledWith('formId', {role: 'something'});
  });
  test('should pass the initial render with paramLocation as "query"', () => {
    props.paramMeta.paramLocation = 'body';
    initDynaHFAssistantSearchParams({ ...props, label: null, value: {}, resourceType: 'imports' });
    expect(screen.getByText('Configure body parameters')).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenNthCalledWith(1, actions.form.forceFieldState(props.formKey)(props.id, { isValid: true }));
  });
});
