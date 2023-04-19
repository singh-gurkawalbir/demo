/* eslint-disable react/jsx-handler-names */
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Lookup from '.';

const mockOnSave = jest.fn();

function initLookUp({onSave, disabled, importId, flowId, lookups, props}) {
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/test/lookup_name/lookups/edit'}]}
    >
      <Route
        path="/test/:lookupName/lookups/edit"
        params={{lookupName: 'lookup_name'}}
        >
        <Lookup
          onSave={onSave} disabled={disabled} importId={importId} flowId={flowId}
          lookups={lookups} {...props} />
      </Route>
    </MemoryRouter>
  );

  return render(ui);
}

jest.mock('../../../../drawer/Right/DrawerContent', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../drawer/Right/DrawerContent'),
  default: props => (
    <div>
      Mock Drawer Content
      {props.children}
    </div>
  ),
}));
jest.mock('../../../../drawer/Right/DrawerFooter', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../drawer/Right/DrawerFooter'),
  default: props => (
    <div>
      Mock Drawer Footer
      {props.children}
    </div>
  ),
}));
jest.mock('../../../../drawer/Lookup/Manage', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../drawer/Lookup/Manage'),
  default: props => (
    <div>
      Mock Manage lookup
      <div>value = {JSON.stringify(props.value)}</div>
      <button type="button" onClick={props.onCancel} disabled={props.disabled}>Cancel</button>
      <div>Resource Id = {props.resourceId}</div>
      <div>resourceType = {props.resourceType}</div>
      <div>flowId = {props.flowId}</div>
      <div>formKey = {props.formKey}</div>
      <div>remountCount = {props.remountCount}</div>
    </div>
  ),
}));
jest.mock('../../../../drawer/Lookup/Manage/SaveButtonGroup', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../drawer/Lookup/Manage/SaveButtonGroup'),
  default: props => (
    <div>
      Mock Save Button Group
      <div>value = {JSON.stringify(props.value)}</div>
      <button type="button" onClick={() => props.parentOnSave(true, 'test_val')} disabled={props.disabled}>Save</button>
      <button type="button" onClick={props.onCancel} disabled={props.disabled}>Manage Cancel</button>
      <div>Resource Id = {props.resourceId}</div>
      <div>resourceType = {props.resourceType}</div>
      <div>formKey = {props.formKey}</div>
    </div>
  ),
}));
const mockHistoryGoBack = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    location: {
      pathname: '/test/lookup_name/lookups/edit',
    },
    goBack: mockHistoryGoBack,
  }),
}));
describe('Testsuite for Lookup', () => {
  afterEach(() => {
    mockHistoryGoBack.mockClear();
  });
  test('should test the manage lookup disabled cancel button', () => {
    initLookUp({onSave: mockOnSave, disabled: true, importId: 'import_id', flowId: 'flow_id', lookups: [{name: 'lookup_name'}], props: {test: 'test1'}});
    expect(screen.getByText(/mock drawer content/i)).toBeInTheDocument();
    expect(screen.getByText(/mock manage lookup/i)).toBeInTheDocument();
    const cancelButtonNode = screen.getByRole('button', { name: 'Cancel' });

    expect(cancelButtonNode).toBeInTheDocument();
    expect(cancelButtonNode).toBeDisabled();
  });
  test('should test the manage lookup cancel button', async () => {
    initLookUp({onSave: mockOnSave, disabled: false, importId: 'import_id', flowId: 'flow_id', lookups: [{name: 'lookup_name'}], props: {test: 'test1'}});
    expect(screen.getByText(/mock drawer content/i)).toBeInTheDocument();
    expect(screen.getByText(/mock manage lookup/i)).toBeInTheDocument();
    const cancelButtonNode = screen.getByRole('button', { name: 'Cancel' });

    expect(cancelButtonNode).toBeInTheDocument();
    await userEvent.click(cancelButtonNode);
    expect(mockHistoryGoBack).toBeCalled();
  });
  test('should test the emply dom when there is no lookup', () => {
    const { container } = initLookUp({onSave: mockOnSave, disabled: false, importId: 'import_id', flowId: 'flow_id', lookups: [], props: {test: 'test1'}});

    expect(container).toBeEmptyDOMElement();
  });
  test('should test the manage lookup save button', async () => {
    initLookUp({onSave: mockOnSave, disabled: false, importId: 'import_id', flowId: 'flow_id', lookups: [{name: 'lookup_name'}], props: {test: 'test1'}});
    expect(screen.getByText(/mock drawer footer/i)).toBeInTheDocument();
    expect(screen.getByText(/mock save button group/i)).toBeInTheDocument();
    const saveButtonNode = screen.getByRole('button', {
      name: /save/i,
    });

    expect(saveButtonNode).toBeInTheDocument();
    await userEvent.click(saveButtonNode);
    expect(mockOnSave).toHaveBeenCalledWith(true, 'test_val');
  });
});
