import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import DynaSoqlQuery from './DynaSoqlQuery';
import * as useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
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
  draft.session.metadata = {application: {someconnectionId: {'salesforce/metadata/connections/someconnectionId/query/columns': {
    data: [{entityName: 'someName', scriptId: 'once', doesNotSupportCreate: true}],
  }}}};
});

const mockOnFieldChange = jest.fn();

function initDynaSoqlQuery(value = undefined) {
  renderWithProviders(
    <MemoryRouter initialEntries={['/integrations/none/flowBuilder/new-DOsWPJry5/edit/exports/new-NNW5LX']}>
      <Route path="/integrations/none/flowBuilder/new-DOsWPJry5/edit/exports/new-NNW5LX">
        <DynaSoqlQuery
          name="somename"
          defaultValue="someDefaultValue"
          label="ProvidedLabel"
          id="someID"
          onFieldChange={mockOnFieldChange}
          connectionId="someconnectionId"
          filterKey="suitescript-recordTypes"
          errorMessages="someErrorMessage"
          formKey="someFormKey"
          flowId="someflowId"
          resourceId="SomeresourceId"
          resourceType="resourceType"
          placeholder="someplaceholder"
          value={value}
      />
      </Route>
    </MemoryRouter>, {initialStore});
}

describe('DynaSoqlQuery test cases', () => {
  let mockDispatchFn;
  let useDispatchSpy;
  let saveFunction;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      if (action.type === 'EDITOR_INIT') { saveFunction = action.options.onSave; }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should call on field change function with id and empty string when savefunction is called with empty array rule', async () => {
    initDynaSoqlQuery();
    const actionButton = screen.getByRole('button');

    await userEvent.click(actionButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.editor.init('someID', 'sql', {
        formKey: 'someFormKey',
        flowId: 'someflowId',
        resourceId: 'SomeresourceId',
        resourceType: 'resourceType',
        fieldId: 'someID',
        onSave: saveFunction,
        stage: 'preMap',
      })
    );
    saveFunction({rule: []});
    expect(mockOnFieldChange).toHaveBeenCalledWith('someID', {query: []});
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/none/flowBuilder/new-DOsWPJry5/edit/exports/new-NNW5LX/editor/someID');
  });
  test('should call onField change function when value is changed and make dispatch call when field is blurred', async () => {
    initDynaSoqlQuery({query: 'somequery'});
    const textbox = screen.getByRole('textbox');

    await userEvent.type(textbox, 'c');
    expect(mockOnFieldChange).toHaveBeenCalledWith('someID', {query: 'somequeryc'});
    await fireEvent.blur(textbox);
    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.metadata.request(
        'someconnectionId',
        'salesforce/metadata/connections/someconnectionId/query/columns',
        {query: 'somequery'}
      )
    );
  });
  test('should make dispatch call for request of metadata when when data option has entityName', async () => {
    jest.spyOn(useSelectorMemo, 'default').mockReturnValue({data: {entityName: 'somename'}});
    initDynaSoqlQuery({query: 'somequery'});
    const textbox = screen.getByRole('textbox');

    await userEvent.type(textbox, 'c');
    expect(mockOnFieldChange).toHaveBeenCalledWith('someID', {query: 'somequeryc'});
    await fireEvent.blur(textbox);
    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.metadata.request(
        'someconnectionId',
        'salesforce/metadata/connections/someconnectionId/query/columns',
        {query: 'somequery'}
      )
    );
    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.metadata.request(
        'someconnectionId',
        'salesforce/metadata/connections/someconnectionId/sObjectTypes/somename'
      )
    );
  });
});
