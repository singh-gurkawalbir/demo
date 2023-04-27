
import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaNetSuiteLookupFiltersafe from './DynaNetSuiteLookupFilters_afe';
import { renderWithProviders, reduxStore, mutateStore} from '../../../test/test-utils';
import actions from '../../../actions';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('../../AFE/Editor/panels/NetSuiteLookupFilter', () => ({
  __esModule: true,
  ...jest.requireActual('../../AFE/Editor/panels/NetSuiteLookupFilter'),
  default: props => {
    const id = `id: ${props.id}`;
    const editorId = `editorId: ${props.editorId}`;

    return (
      <>
        <div>{id}</div>
        <div>{editorId}</div>
        <button type="button" onClick={props.onFieldChange}>onFieldChangeButton</button>
      </>
    );
  },
}));

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.session.metadata = {application: {someconnectionId: {somePath: {
    data: [{name: 'someName', scriptId: 'once', doesNotSupportCreate: true}],
  }}}};
});

const mockOnFieldChange = jest.fn();

function initDynaNetSuiteLookupFiltersafe(extraProp = {
  options: {
    commMetaPath: 'somePath',
    disableFetch: false,
  },
}) {
  const ui = (
    <DynaNetSuiteLookupFiltersafe
      value="once" selectOptions={[]}
      defaultValue="someDefaultValue"
      id="someID"
      onFieldChange={mockOnFieldChange}
      connectionId="someconnectionId"
      filterKey="suitescript-searchFilters"
      data="someData"
      {...extraProp}
  />
  );

  return renderWithProviders(ui, {initialStore});
}

describe('dynaNetSuiteLookupFiltersafe UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should show spinner when data not loaded', () => {
    renderWithProviders(<DynaNetSuiteLookupFiltersafe />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should verify useEffect dispatch call', () => {
    initDynaNetSuiteLookupFiltersafe();
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.editor.init('ns-mappingLookupFilter', 'netsuiteLookupFilter', {
        fieldId: 'someID',
        rule: 'once',
        stage: 'importMappingExtract',
        data: 'someData',
        wrapData: true,
      })
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.metadata.request('someconnectionId', 'somePath')
    );
  });
  test('should make dispatch call for the metadata request when clicked on refresh icon', async () => {
    initDynaNetSuiteLookupFiltersafe();
    expect(screen.getByText('Refresh search filters')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.metadata.request('someconnectionId', 'somePath', {
        refreshCache: true,
      })
    );
  });
  test('should not call refresh dispatch when fetch is disabled', async () => {
    initDynaNetSuiteLookupFiltersafe({
      options: {
        commMetaPath: 'somePath',
        disableFetch: true,
      },
    });
    expect(screen.getByText('Refresh search filters')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    expect(mockDispatch).not.toHaveBeenCalledWith(
      actions.metadata.request('someconnectionId', 'somePath', {
        refreshCache: true,
      })
    );
  });
  test('should call onFieldChangeButton function when editor is initialised', async () => {
    mutateStore(initialStore, draft => {
      draft.session.editors = {'ns-mappingLookupFilter': {fieldId: 'someFieldID'}};
    });
    initDynaNetSuiteLookupFiltersafe({
      options: {
        commMetaPath: 'somePath',
        disableFetch: true,
      },
    });
    expect(screen.getByText('id: someID')).toBeInTheDocument();
    expect(screen.getByText('editorId: ns-mappingLookupFilter')).toBeInTheDocument();

    await userEvent.click(screen.getByText('onFieldChangeButton'));
    expect(mockOnFieldChange).toHaveBeenCalledTimes(1);
  });

  describe('dynaNetSuiteLookupFiltersafe with recordTypeFieldId', () => {
    test('should verify useEffect dispatch call when recordTypeFieldId is present', () => {
      mutateStore(initialStore, draft => {
        draft.session.form = {form_key_1: {fields: { field_1: {value: 'record_type_1'}}}};
      });
      initDynaNetSuiteLookupFiltersafe({
        recordTypeFieldId: 'field_1',
        formKey: 'form_key_1',
      });
      expect(mockDispatch).toHaveBeenCalledWith(
        actions.editor.init('ns-mappingLookupFilter', 'netsuiteLookupFilter', {
          fieldId: 'someID',
          rule: 'once',
          stage: 'importMappingExtract',
          data: 'someData',
          wrapData: true,
        })
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        actions.metadata.request('someconnectionId', 'netsuite/metadata/suitescript/connections/someconnectionId/recordTypes/record_type_1/searchFilters?includeJoinFilters=true')
      );
    });

    test('should verify useEffect dispatch call when recordTypeFieldId is not present', () => {
      mutateStore(initialStore, draft => {
        draft.session.form = {form_key_1: {fields: { field_1: {value: 'record_type_1'}}}};
      });
      initDynaNetSuiteLookupFiltersafe({
        formKey: 'form_key_1',
      });
      expect(mockDispatch).toHaveBeenCalledWith(
        actions.editor.init('ns-mappingLookupFilter', 'netsuiteLookupFilter', {
          fieldId: 'someID',
          rule: 'once',
          stage: 'importMappingExtract',
          data: 'someData',
          wrapData: true,
        })
      );
      expect(mockDispatch).not.toHaveBeenCalledWith(
        actions.metadata.request('someconnectionId', 'netsuite/metadata/suitescript/connections/someconnectionId/recordTypes/record_type_1/searchFilters?includeJoinFilters=true')
      );
    });
  });
});
