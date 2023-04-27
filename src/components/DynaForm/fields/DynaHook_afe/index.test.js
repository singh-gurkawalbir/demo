
import React from 'react';
import {
  waitFor, screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import {MemoryRouter} from 'react-router-dom';
import actions from '../../../../actions';
import DynaHookAFE from './index';
import { renderWithProviders} from '../../../../test/test-utils';

jest.mock('../../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../LoadResources'),
  default: props => (
    <div>{props.children}</div>
  ),
}));

jest.mock('../../../../utils/resource', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../utils/resource'),
  generateNewId: () => 'new-scriptId',
}));

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('dynaHook_afe UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    done();
  });
  afterEach(async () => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  const mockOnFieldChange = jest.fn();
  const props = {
    id: 'id',
    flowId: '67r912e45gferb4378900r5ef374',
    disabled: false,
    name: 'test name',
    onFieldChange: mockOnFieldChange,
    placeholder: 'function field',
    required: true,
    value: {},
    label: 'demo label',
    formKey: 'imports-56r912e45gferb43r5ef374',
    hookType: 'script',
    hookStage: 'preSavePage',
    resourceType: 'imports',
    resourceId: '56r912e45gferb4378900r5ef374',
    helpKey: 'propsHelpKey',
    isLoggable: true,
    isValid: true,
  };

  test('should pass the initial render for hookType "scripts"', () => {
    props.hookType = 'script';
    renderWithProviders(<MemoryRouter><DynaHookAFE {...props} /></MemoryRouter>);
    expect(screen.getByText('Script')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('function field')).toBeInTheDocument();
    expect(document.querySelector('[id="scriptId"]')).toBeInTheDocument();           // function dropdown  //
    expect(screen.getByLabelText('Create script')).toBeInTheDocument();
    expect(screen.getByLabelText('Edit script')).toBeInTheDocument();
  });
  test('should call the onFieldChange passed in props when function field is edited', async () => {
    props.hookType = 'script';
    renderWithProviders(<MemoryRouter><DynaHookAFE {...props} /></MemoryRouter>);
    const functionField = screen.getByPlaceholderText('function field');

    await userEvent.type(functionField, 'a');
    await waitFor(() => expect(mockOnFieldChange).toHaveBeenCalledWith('id', {function: 'a'}));
  });
  test('should make a url redirection when a new script is added', async () => {
    props.hookType = 'script';
    renderWithProviders(<MemoryRouter><DynaHookAFE {...props} /></MemoryRouter>);
    const buttons = screen.getAllByRole('button');
    const n = buttons.length;

    await userEvent.click(buttons[n - 2]);
    await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledWith('//add/scripts/new-scriptId'));
  });
  test('should make a dispatch call for resourceType "apis" and value prop contains both a function and scriptId', async () => {
    const newprops = {...props, value: {function: 'function', _scriptId: 'scriptId'}, resourceType: 'apis'};

    renderWithProviders(<MemoryRouter><DynaHookAFE {...newprops} /></MemoryRouter>);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('imports-56r912e45gferb43r5ef374')('id', {isValid: true})));
  });
  test('should make a different dispatch call when value prop does not contain both function and scriptId', async () => {
    const newprops = {...props, resourceType: 'apis'};

    renderWithProviders(<MemoryRouter><DynaHookAFE {...newprops} /></MemoryRouter>);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('imports-56r912e45gferb43r5ef374')('id', {isValid: false, errorMessages: 'A value must be provided'})));
  });
  test('should pass the initial render for hookType "stack"', () => {
    props.hookType = 'stack';
    renderWithProviders(<MemoryRouter><DynaHookAFE {...props} /></MemoryRouter>);
    expect(screen.getByText('Stack')).toBeInTheDocument();
    expect(screen.getByText('None')).toBeInTheDocument();   // function dropdown initial value  //
    expect(screen.getByPlaceholderText('function field')).toBeInTheDocument();
    expect(document.querySelector('[id="stackId"]')).toBeInTheDocument();
  });
  test('should render the ScriptView component by default when no hookType is passed in props', () => {
    const newprops = {};

    renderWithProviders(<MemoryRouter><DynaHookAFE {...newprops} /></MemoryRouter>);
    expect(screen.getByText('Script')).toBeInTheDocument();
    expect(document.querySelector('[id="scriptId"]')).toBeInTheDocument();
    expect(screen.getByLabelText('Create script')).toBeInTheDocument();
    expect(screen.getByLabelText('Edit script')).toBeInTheDocument();
  });
});
