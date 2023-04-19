import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ConditionalLookup from '.';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';

let initialStore;
const mockOnSave = jest.fn();
const mockHistoryGoBack = jest.fn();

function initConditionalLookup({onSave, disabled, importId, flowId, props, paramsData, pathData, pathnameData, mappingData}) {
  mutateStore(initialStore, draft => {
    draft.session.mapping = mappingData;
  });
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: pathnameData}]}
    >
      <Route
        path={pathData}
        params={paramsData}
      >
        <ConditionalLookup
          onSave={onSave} disabled={disabled} importId={importId} flowId={flowId}
          {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('../../../../Lookup/Manage', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../Lookup/Manage'),
  default: props => (
    <div>
      <div>Mock Manage Lookup</div>
      <div>value = {JSON.stringify(props.value)}</div>
      <div>resourceId = {props.resourceId}</div>
      <div>resourceType = {props.resourceType}</div>
      <div>flowId = {props.flowId}</div>
      <button type="button" onClick={props.onSave} disabled={props.disabled}>On Save</button>
      <button type="button" onClick={props.onCancel} disabled={props.disabled} >On Cancel</button>
    </div>
  ),
}));
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
  }),
}));
describe('Testsuite for Conditional Lookup', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  afterEach(() => {
    mockOnSave.mockClear();
    mockHistoryGoBack.mockClear();
  });
  test('should test the Manage lookup as it should render an empty DOM when there is lookup name and no value name', () => {
    const { utils } = initConditionalLookup({onSave: mockOnSave, disabled: true, importId: '123', flowId: '234', props: {test: 'test1'}, paramsData: {lookupName: 'testLookupName'}, pathData: '/test/:lookupName', pathnameData: '/test/testLookupName'});

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should test the Manage lookup as it should render the empty set value when there is no lookup name and value name and should test the disabled save and close button', () => {
    initConditionalLookup({onSave: mockOnSave, disabled: true, importId: '123', flowId: '234', props: {test: 'test1'}, paramsData: '', pathData: '/test', pathnameData: '/test'});
    expect(screen.getByText(/mock manage lookup/i)).toBeInTheDocument();
    expect(screen.getByText(/value = \{\}/i)).toBeInTheDocument();
    expect(screen.getByText(/resourceid = 123/i)).toBeInTheDocument();
    expect(screen.getByText(/resourcetype = imports/i)).toBeInTheDocument();
    expect(screen.getByText(/flowid = 234/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /on save/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /on cancel/i })).toBeDisabled();
  });
  test('should test the Manage lookup as it should render the value with data when there is lookup name and value name and should test the save and close button', async () => {
    initConditionalLookup({onSave: mockOnSave, disabled: false, importId: '123', flowId: '234', props: {test: 'test1'}, paramsData: {lookupName: 'testLookupName'}, pathData: '/test/:lookupName', pathnameData: '/test/testLookupName', mappingData: {mapping: {lookups: [{isConditionalLookup: true, name: 'testLookupName'}]}}});
    expect(screen.getByText(/mock manage lookup/i)).toBeInTheDocument();
    expect(screen.getByText(/value = \{"isconditionallookup":true,"name":"testlookupname"\}/i)).toBeInTheDocument();
    expect(screen.getByText(/resourceid = 123/i)).toBeInTheDocument();
    expect(screen.getByText(/resourcetype = imports/i)).toBeInTheDocument();
    expect(screen.getByText(/flowid = 234/i)).toBeInTheDocument();
    const onSaveButtonNode = screen.getByRole('button', {
      name: /on save/i,
    });

    expect(onSaveButtonNode).toBeInTheDocument();
    await userEvent.click(onSaveButtonNode);
    expect(mockOnSave).toHaveBeenCalledWith(true, {isConditionalLookup: true, name: 'testLookupName'}, undefined);
    expect(mockHistoryGoBack).toHaveBeenCalled();
    mockHistoryGoBack.mockClear();

    const onCancelButtonNode = screen.getByRole('button', {
      name: /on cancel/i,
    });

    expect(onCancelButtonNode).toBeInTheDocument();
    await userEvent.click(onCancelButtonNode);
    expect(mockHistoryGoBack).toHaveBeenCalled();
  });
});
