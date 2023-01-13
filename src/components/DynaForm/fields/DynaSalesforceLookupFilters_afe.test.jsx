
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {screen} from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import DynaSalesforceLookupFiltersAfe from './DynaSalesforceLookupFilters_afe';
import { renderWithProviders, reduxStore} from '../../../test/test-utils';
import actions from '../../../actions';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('../../AFE/Editor/panels/SalesforceLookupFilter', () => ({
  __esModule: true,
  ...jest.requireActual('../../AFE/Editor/panels/SalesforceLookupFilter'),
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

initialStore.getState().session.metadata = {application: {someconnectionId: {somePath: {
  data: [{name: 'someName', value: 12, type: 'Type'}],
}}}};

const mockOnFieldChange = jest.fn();

function initDynaNetSuiteLookupFiltersafe(disableFetch = false) {
  const ui = (
    <DynaSalesforceLookupFiltersAfe
      id="salesforce.operation"
      value="(CreatedById = 5)"
      connectionId="someconnectionId"
      filterKey="salesforce-recordType"
      onFieldChange={mockOnFieldChange}
      options={{
        disableFetch,
        commMetaPath: 'somePath',
        resetValue: [],
      }}
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
    renderWithProviders(<DynaSalesforceLookupFiltersAfe />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should verify useEffect dispatch call', () => {
    initDynaNetSuiteLookupFiltersafe();
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.editor.init('sf-mappingLookupFilter', 'salesforceLookupFilter', {
        fieldId: 'salesforce.operation',
        rule: '(CreatedById = 5)',
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
    initialStore.getState().session.editors = {'sf-mappingLookupFilter': {fieldId: 'someFieldID'}};
    initDynaNetSuiteLookupFiltersafe(true, initialStore);
    expect(screen.getByText('id: salesforce.operation')).toBeInTheDocument();
    expect(screen.getByText('editorId: sf-mappingLookupFilter')).toBeInTheDocument();

    userEvent.click(screen.getByText('onFieldChangeButton'));
    expect(mockOnFieldChange).toHaveBeenCalledTimes(1);
  });
});
