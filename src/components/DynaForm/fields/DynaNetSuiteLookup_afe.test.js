import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import DynaNetSuiteLookupafe from './DynaNetSuiteLookup_afe';
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

function initDynaNetSuiteLookupafe() {
  renderWithProviders(
    <MemoryRouter initialEntries={['/integrations/none/flowBuilder/new-DOsWPJry5/edit/exports/new-NNW5LX']}>
      <Route path="/integrations/none/flowBuilder/new-DOsWPJry5/edit/exports/new-NNW5LX">
        <DynaNetSuiteLookupafe
          value="providedValue"
          defaultValue="someDefaultValue"
          label="ProvidedLabel"
          id="someID"
          onFieldChange={mockOnFieldChange}
          connectionId="someconnectionId"
          selectOptions={[{}]}
          options={[]}
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

describe('DynaNetSuiteLookupafe test cases', () => {
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
  test('should call on field change function with json stringify value', () => {
    initDynaNetSuiteLookupafe();

    expect(screen.getByText('ProvidedLabel')).toBeInTheDocument();
    const input = screen.getByPlaceholderText('someplaceholder');
    const value = input.getAttribute('value');
    const classOfInput = input.getAttribute('class');

    expect(classOfInput.indexOf('Mui-disabled')).toBeGreaterThan(-1);
    expect(value).toBe('providedValue');
    expect(screen.getByText('someErrorMessage')).toBeInTheDocument();

    const actionButton = screen.getByRole('button');

    userEvent.click(actionButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.editor.init('someID', 'netsuiteLookupFilter', {
        formKey: 'someFormKey',
        flowId: 'someflowId',
        resourceId: 'SomeresourceId',
        resourceType: 'resourceType',
        fieldId: 'someID',
        onSave: saveFunction,
        stage: 'importMappingExtract',
        customOptions: [],
      })
    );
    saveFunction({rule: 'somestring'});
    expect(mockOnFieldChange).toHaveBeenCalledWith('someID', JSON.stringify('somestring'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/none/flowBuilder/new-DOsWPJry5/edit/exports/new-NNW5LX/editor/someID');
  });
  test('should call on field change function with id and empty string when savefunction is called with empty array rule', () => {
    initDynaNetSuiteLookupafe();
    const actionButton = screen.getByRole('button');

    userEvent.click(actionButton);
    saveFunction({rule: []});
    expect(mockOnFieldChange).toHaveBeenCalledWith('someID', '');
  });
});
