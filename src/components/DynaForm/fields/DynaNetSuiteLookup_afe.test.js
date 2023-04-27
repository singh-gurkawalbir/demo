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

const mockOnFieldChange = jest.fn();

function initDynaNetSuiteLookupafe(props) {
  mutateStore(initialStore, draft => {
    draft.session.form.someFormKey = {
      fields: {
        'netsuite_da.recordType': { value: props?.noRecordType ? '' : 'account' },
      },
    };
  });

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
          options={props?.options}
          filterKey="suitescript-recordTypes"
          errorMessages="someErrorMessage"
          formKey="someFormKey"
          flowId="someflowId"
          resourceId="SomeresourceId"
          resourceType="resourceType"
          placeholder="someplaceholder"
      />
      </Route>
    </MemoryRouter>, { initialStore });
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
  test('should call on field change function with json stringify value', async () => {
    initDynaNetSuiteLookupafe();

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
      actions.editor.init('someID', 'netsuiteLookupFilter', {
        formKey: 'someFormKey',
        flowId: 'someflowId',
        resourceId: 'SomeresourceId',
        resourceType: 'resourceType',
        fieldId: 'someID',
        onSave: saveFunction,
        stage: 'importMappingExtract',
        customOptions: {
          disableFetch: false,
          commMetaPath: 'netsuite/metadata/suitescript/connections/undefined/recordTypes/account/searchFilters?includeJoinFilters=true',
          resetValue: [],
        },
      })
    );
    saveFunction({rule: 'somestring'});
    expect(mockOnFieldChange).toHaveBeenCalledWith('someID', JSON.stringify('somestring'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/none/flowBuilder/new-DOsWPJry5/edit/exports/new-NNW5LX/editor/someID');
  });
  test('should work as expected when the record type options are passed through options instead of fetching from form state', async () => {
    const options = {
      disableFetch: false,
      commMetaPath: 'custom_options_path',
      resetValue: [],
    };

    initDynaNetSuiteLookupafe({ options });

    const actionButton = screen.getByRole('button');

    await userEvent.click(actionButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.editor.init('someID', 'netsuiteLookupFilter', {
        formKey: 'someFormKey',
        flowId: 'someflowId',
        resourceId: 'SomeresourceId',
        resourceType: 'resourceType',
        fieldId: 'someID',
        onSave: saveFunction,
        stage: 'importMappingExtract',
        customOptions: options,
      })
    );
  });
  test('should call on field change function with id and empty string when save function is called with empty array rule', async () => {
    initDynaNetSuiteLookupafe();
    const actionButton = screen.getByRole('button');

    await userEvent.click(actionButton);
    saveFunction({rule: []});
    expect(mockOnFieldChange).toHaveBeenCalledWith('someID', '');
  });
  test('should not be able to open filter AFE if recordTypeField is not selected', () => {
    initDynaNetSuiteLookupafe({ noRecordType: true });
    const actionButton = screen.getByRole('button');

    expect(actionButton).toBeDisabled();
  });
});
