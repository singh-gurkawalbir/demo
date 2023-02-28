import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import DynaNetSuiteQualifieafe from './DynaNetSuiteQualifier_afe';
import { renderWithProviders, reduxStore, mutateStore} from '../../../test/test-utils';
import actions from '../../../actions';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.session.metadata = {application: {someconnectionId: {somePath: {
    data: [{name: 'someName', scriptId: 'once', doesNotSupportCreate: true}],
  }}}};
});

const mockOnFieldChange = jest.fn();

function initDynaNetSuiteQualifieafe(options = {}, value = 'providedValue') {
  renderWithProviders(
    <MemoryRouter initialEntries={['/integrations/none/flowBuilder/new-DOsWPJry5/edit/exports/new-NNW5LX']}>
      <Route path="/integrations/none/flowBuilder/new-DOsWPJry5/edit/exports/new-NNW5LX">
        <DynaNetSuiteQualifieafe
          value={value}
          defaultValue="someDefaultValue"
          label="ProvidedLabel"
          id="someID"
          onFieldChange={mockOnFieldChange}
          connectionId="someconnectionId"
          selectOptions={[{}]}
          options={options}
          filterKey="suitescript-recordTypes"
          errorMessages="someErrorMessage"
          formKey="someFormKey"
          flowId="someflowId"
          resourceId="SomeresourceId"
          resourceType="resourceType"
          placeholder="someplaceholder"
      />
      </Route>
    </MemoryRouter>);
}

describe('DynaNetSuiteQualifieafe test cases', () => {
  let mockDispatchFn;
  let useDispatchSpy;
  let saveFunction;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      saveFunction = action.options.onSave;
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should call on field change function with json stringify value', async () => {
    initDynaNetSuiteQualifieafe();

    expect(screen.getByText('ProvidedLabel')).toBeInTheDocument();
    const input = screen.getByPlaceholderText('someplaceholder');
    const value = input.getAttribute('value');
    const classOfInput = input.getAttribute('class');

    expect(classOfInput.indexOf('Mui-disabled')).toBeGreaterThan(-1);
    expect(value).toBe('providedValue');
    expect(screen.getByText('someErrorMessage')).toBeInTheDocument();

    const actionButton = screen.getByRole('button');

    await userEvent.click(actionButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.editor.init('someID', 'netsuiteQualificationCriteria', {
        formKey: 'someFormKey',
        flowId: 'someflowId',
        resourceId: 'SomeresourceId',
        resourceType: 'resourceType',
        fieldId: 'someID',
        data: 'dummy data',
        onSave: saveFunction,
        customOptions: {},
      })
    );
    saveFunction({rule: 'somestring'});
    expect(mockOnFieldChange).toHaveBeenCalledWith('someID', 'somestring');
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/none/flowBuilder/new-DOsWPJry5/edit/exports/new-NNW5LX/editor/someID');
  });
  test('should call on field change function with id and empty string when savefunction is called with empty array rule', async () => {
    initDynaNetSuiteQualifieafe();
    const actionButton = screen.getByRole('button');

    await userEvent.click(actionButton);
    saveFunction({rule: ['arraydata']});
    expect(mockOnFieldChange).toHaveBeenCalledWith('someID', JSON.stringify(['arraydata']));
  });
  test('should call on field change function with id and resetValue from useEffect when reset value is provided in options', async () => {
    initDynaNetSuiteQualifieafe({commMetaPath: 'somepath', resetValue: 'someresetvalue'});
    expect(mockOnFieldChange).toHaveBeenCalledWith('someID', [], true);
    const actionButton = screen.getByRole('button');

    await userEvent.click(actionButton);
    saveFunction({rule: ['arraydata']});
    expect(mockOnFieldChange).toHaveBeenCalledWith('someID', JSON.stringify(['arraydata']));
  });
  test('should call on field change function with id and default value from useEffect when reset value is not provided in options', () => {
    initDynaNetSuiteQualifieafe({commMetaPath: 'somepath'});
    expect(mockOnFieldChange).toHaveBeenCalledWith('someID', 'someDefaultValue', true);
  });
  test('should show stringified value when value is provided as an array', () => {
    const array = [];

    initDynaNetSuiteQualifieafe({commMetaPath: 'somepath'}, []);
    const textbox = screen.getByPlaceholderText('someplaceholder');
    const value = textbox.getAttribute('value');

    expect(value).toEqual(JSON.stringify(array));
  });
  test('should show placeholder as value when value is null', () => {
    initDynaNetSuiteQualifieafe({commMetaPath: 'somepath'}, null);
    const textbox = screen.getByPlaceholderText('someplaceholder');
    const value = textbox.getAttribute('value');

    expect(value).toBe('someplaceholder');
  });
  test('should show placeholder as "Define criteria" as a default placeholder', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/integrations/none/flowBuilder/new-DOsWPJry5/edit/exports/new-NNW5LX']}>
        <Route path="/integrations/none/flowBuilder/new-DOsWPJry5/edit/exports/new-NNW5LX">
          <DynaNetSuiteQualifieafe
            onFieldChange={mockOnFieldChange}
            selectOptions={[{}]}
            options={{}}
        />
        </Route>
      </MemoryRouter>);
    const textbox = screen.getByPlaceholderText('Define criteria');

    expect(textbox).toBeInTheDocument();
  });
});
