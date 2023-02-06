
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

function initDynaNetSuiteLookupFiltersafe(disableFetch = false) {
  const ui = (
    <DynaNetSuiteLookupFiltersafe
      value="once" selectOptions={[]}
      defaultValue="someDefaultValue"
      id="someID"
      onFieldChange={mockOnFieldChange}
      connectionId="someconnectionId"
      options={{commMetaPath: 'somePath', disableFetch}}
      filterKey="suitescript-searchFilters"
      data="someData"
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
  test('should make dispatch call for the metadata request when clicked on refresh icon', () => {
    initDynaNetSuiteLookupFiltersafe();
    expect(screen.getByText('Refresh search filters')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.metadata.request('someconnectionId', 'somePath', {
        refreshCache: true,
      })
    );
  });
  test('should not call refresh dispatch when fetch is disabled', () => {
    initDynaNetSuiteLookupFiltersafe(true);
    expect(screen.getByText('Refresh search filters')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button'));
    expect(mockDispatch).not.toHaveBeenCalledWith(
      actions.metadata.request('someconnectionId', 'somePath', {
        refreshCache: true,
      })
    );
  });
  test('should call onFieldChangeButton function when editor is initialised', () => {
    mutateStore(initialStore, draft => {
      draft.session.editors = {'ns-mappingLookupFilter': {fieldId: 'someFieldID'}};
    });
    initDynaNetSuiteLookupFiltersafe(true, initialStore);
    expect(screen.getByText('id: someID')).toBeInTheDocument();
    expect(screen.getByText('editorId: ns-mappingLookupFilter')).toBeInTheDocument();

    userEvent.click(screen.getByText('onFieldChangeButton'));
    expect(mockOnFieldChange).toHaveBeenCalledTimes(1);
  });
});
