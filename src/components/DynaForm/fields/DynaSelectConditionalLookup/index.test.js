import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import DynaSelectConditionalLookup from '.';
import { getCreatedStore } from '../../../../store';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import * as ConditionalLookupDrawer from './ConditionalLookup/Drawer';
import actions from '../../../../actions';

let initialStore;
const mockOnFieldChange = jest.fn();
const mockHistoryPush = jest.fn();

function initDynaSelectConditionalLookup({props, mappingData}) {
  mutateStore(initialStore, draft => {
    draft.session.mapping = mappingData;
  });
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/test'}]}
    >
      <Route
        path="/test"
      >
        <DynaSelectConditionalLookup {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('../DynaSelect', () => ({
  __esModule: true,
  ...jest.requireActual('../DynaSelect'),
  default: props => (
    <div>
      <div>Mocking Dyna Select</div>
      <div>options = {JSON.stringify(props.options)}</div>
      <div>{props.children}</div>
    </div>
  ),
}));
jest.mock('../../../icons/AddIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../icons/AddIcon'),
  default: () => (
    <div>
      Mock Add Icon
    </div>
  ),
}));
jest.mock('../../../icons/EditIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../icons/EditIcon'),
  default: () => (
    <div>
      Mock Edit Icon
    </div>
  ),
}));

jest.mock('../../../ActionButton', () => ({
  __esModule: true,
  ...jest.requireActual('../../../ActionButton'),
  default: props => {
    const datatest = 'data-test';

    if (props[datatest] === 'addNewConditionalLookup') {
      return (
        <div>
          <div>Mocking Action Button</div>
          <button type="button" data-test="addNewConditionalLookup" onClick={props.onClick} >Add Lookup Click</button>
          <div>{props.children}</div>
        </div>
      );
    }

    return (
      <div>
        <div>Mocking Action Button</div>
        <button type="button" data-test="addEditConditionalLookup" disabled={props.disabled} onClick={props.onClick} >Edit Lookup Click</button>
        <div>{props.children}</div>
      </div>
    );
  },
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
describe('Testsuite for DynaSelectConditionalLookup', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    mockOnFieldChange.mockClear();
    mockHistoryPush.mockClear();
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should test the disabled edit lookup click button when the value is not passed', () => {
    jest.spyOn(ConditionalLookupDrawer, 'default').mockImplementationOnce(props => (
      <div>
        <div>Mocking ConditionalLookupDrawer</div>
        <div>importId = {props.importId}</div>
        <div>flowId = {props.flowId}</div>
        <button type="button" onClick={props.onSave} disabled={props.disabled}>Save</button>
        <div>staticLookupCommMetaPath = {props.staticLookupCommMetaPath}</div>
        <div>extractFields = {props.extractFields}</div>
        <div>picklistOptions = {props.picklistOptions}</div>
      </div>
    ));
    const props = {
      id: '123',
      value: '',
      importId: '345',
      flowId: '234',
      disabled: true,
      onFieldChange: mockOnFieldChange,
      staticLookupCommMetaPath: 'test staticLookupCommMetaPath',
      extractFields: 'test extractFields',
      picklistOptions: 'test picklistOptions',
    };

    initDynaSelectConditionalLookup({props});
    const editLookUpClick = screen.getByRole('button', {
      name: /edit lookup click/i,
    });

    expect(editLookUpClick).toBeInTheDocument();
    expect(editLookUpClick).toBeDisabled();

    const saveButtonNode = screen.getByRole('button', {name: 'Save'});

    expect(saveButtonNode).toBeInTheDocument();
    expect(saveButtonNode).toBeDisabled();
  });
  test('should test the edit lookup click button when the value is passed', async () => {
    jest.spyOn(ConditionalLookupDrawer, 'default').mockImplementationOnce(props => (
      <div>
        <div>Mocking ConditionalLookupDrawer</div>
        <div>importId = {props.importId}</div>
        <div>flowId = {props.flowId}</div>
        <button type="button" onClick={props.onSave} disabled={props.disabled}>Save</button>
        <div>staticLookupCommMetaPath = {props.staticLookupCommMetaPath}</div>
        <div>extractFields = {props.extractFields}</div>
        <div>picklistOptions = {props.picklistOptions}</div>
      </div>
    ));
    const props = {
      id: '123',
      value: 'test_value',
      importId: '345',
      flowId: '234',
      disabled: true,
      onFieldChange: mockOnFieldChange,
      staticLookupCommMetaPath: 'test staticLookupCommMetaPath',
      extractFields: 'test extractFields',
      picklistOptions: 'test picklistOptions',
    };

    initDynaSelectConditionalLookup({props});
    const editLookUpClick = document.querySelector('button[data-test="addEditConditionalLookup"]');

    expect(editLookUpClick).toBeInTheDocument();
    await userEvent.click(editLookUpClick);
    expect(mockHistoryPush).toHaveBeenCalledWith('/test/conditionalLookup/edit/test_value');
  });
  test('should test the add lookup click button when the value is passed', async () => {
    jest.spyOn(ConditionalLookupDrawer, 'default').mockImplementationOnce(props => (
      <div>
        <div>Mocking ConditionalLookupDrawer</div>
        <div>importId = {props.importId}</div>
        <div>flowId = {props.flowId}</div>
        <button type="button" onClick={props.onSave} disabled={props.disabled}>Save</button>
        <div>staticLookupCommMetaPath = {props.staticLookupCommMetaPath}</div>
        <div>extractFields = {props.extractFields}</div>
        <div>picklistOptions = {props.picklistOptions}</div>
      </div>
    ));
    const props = {
      id: '123',
      value: 'test_value',
      importId: '345',
      flowId: '234',
      disabled: true,
      onFieldChange: mockOnFieldChange,
      staticLookupCommMetaPath: 'test staticLookupCommMetaPath',
      extractFields: 'test extractFields',
      picklistOptions: 'test picklistOptions',
    };

    initDynaSelectConditionalLookup({props});
    const addLookupButtonNode = screen.getByRole('button', {name: 'Add Lookup Click'});

    expect(addLookupButtonNode).toBeInTheDocument();
    await userEvent.click(addLookupButtonNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/test/conditionalLookup/add');
  });
  test('should test the select conditional lookup save button when the isEdit is set to true', async () => {
    jest.spyOn(ConditionalLookupDrawer, 'default').mockImplementationOnce(props => (
      <div>
        <div>Mocking ConditionalLookupDrawer</div>
        <div>importId = {props.importId}</div>
        <div>flowId = {props.flowId}</div>
        <button type="button" onClick={() => props.onSave(true, 'oldValue', {name: 'newValue'})} disabled={props.disabled}>Save</button>
        <div>staticLookupCommMetaPath = {props.staticLookupCommMetaPath}</div>
        <div>extractFields = {props.extractFields}</div>
        <div>picklistOptions = {props.picklistOptions}</div>
      </div>
    ));
    const props = {
      id: '123',
      value: 'test_value',
      importId: '345',
      flowId: '234',
      disabled: false,
      onFieldChange: mockOnFieldChange,
      staticLookupCommMetaPath: 'test staticLookupCommMetaPath',
      extractFields: 'test extractFields',
      picklistOptions: 'test picklistOptions',
    };

    initDynaSelectConditionalLookup({props});
    const saveButtonNode = screen.getByRole('button', {name: 'Save'});

    expect(saveButtonNode).toBeInTheDocument();
    await userEvent.click(saveButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.updateLookup({isConditionalLookup: true, newValue: {name: 'newValue'}, oldValue: 'oldValue'}));
    expect(mockOnFieldChange).toHaveBeenCalledWith('123', 'newValue');
  });
  test('should test the select conditional lookup save button when the isEdit is set to false', async () => {
    jest.spyOn(ConditionalLookupDrawer, 'default').mockImplementationOnce(props => (
      <div>
        <div>Mocking ConditionalLookupDrawer</div>
        <div>importId = {props.importId}</div>
        <div>flowId = {props.flowId}</div>
        <button type="button" onClick={() => props.onSave(false, 'oldValue', {name: 'newValue'})} disabled={props.disabled}>Save</button>
        <div>staticLookupCommMetaPath = {props.staticLookupCommMetaPath}</div>
        <div>extractFields = {props.extractFields}</div>
        <div>picklistOptions = {props.picklistOptions}</div>
      </div>
    ));
    const props = {
      id: '123',
      value: 'test_value',
      importId: '345',
      flowId: '234',
      disabled: false,
      onFieldChange: mockOnFieldChange,
      staticLookupCommMetaPath: 'test staticLookupCommMetaPath',
      extractFields: 'test extractFields',
      picklistOptions: 'test picklistOptions',
    };

    initDynaSelectConditionalLookup({props});
    const saveButtonNode = screen.getByRole('button', {name: 'Save'});

    expect(saveButtonNode).toBeInTheDocument();
    await userEvent.click(saveButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.addLookup({isConditionalLookup: true, value: {name: 'newValue'}}));
    expect(mockOnFieldChange).toHaveBeenCalledWith('123', 'newValue');
  });
  test('should test the select conditional lookup when there existing lookup options', () => {
    jest.spyOn(ConditionalLookupDrawer, 'default').mockImplementationOnce(props => (
      <div>
        <div>Mocking ConditionalLookupDrawer</div>
        <div>importId = {props.importId}</div>
        <div>flowId = {props.flowId}</div>
        <button type="button" onClick={() => props.onSave(false, 'oldValue', {name: 'newValue'})} disabled={props.disabled}>Save</button>
        <div>staticLookupCommMetaPath = {props.staticLookupCommMetaPath}</div>
        <div>extractFields = {props.extractFields}</div>
        <div>picklistOptions = {props.picklistOptions}</div>
      </div>
    ));
    const props = {
      id: '123',
      value: 'test_value',
      importId: '345',
      flowId: '234',
      disabled: false,
      onFieldChange: mockOnFieldChange,
      staticLookupCommMetaPath: 'test staticLookupCommMetaPath',
      extractFields: 'test extractFields',
      picklistOptions: 'test picklistOptions',
    };

    initDynaSelectConditionalLookup({props, mappingData: {mapping: {lookups: [{isConditionalLookup: true, name: 'testLookupName'}]}}});
    expect(screen.getByText(
      /options = \[\{"items":\[\{"label":"testlookupname","value":"testlookupname"\}\]\}\]/i
    )).toBeInTheDocument();
  });
});
