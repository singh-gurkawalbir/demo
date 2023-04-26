import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import DynaSelectLookup from '.';
import { renderWithProviders } from '../../../../test/test-utils';
import * as FormContext from '../../../Form/FormContext';
import * as LookupDrawer from './Lookup/Drawer';

const mockOnFieldChange = jest.fn();
const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();

function initDynaSelectLookup({props}) {
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/test'}]}
    >
      <Route
        path="/test"
      >
        <DynaSelectLookup {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

jest.mock('../DynaSelect', () => ({
  __esModule: true,
  ...jest.requireActual('../DynaSelect'),
  default: props => (
    <div>
      Mocking Dyna Select
      <div>options = {JSON.stringify(props.options)}</div>
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
jest.mock('../../../EllipsisActionMenu', () => ({
  __esModule: true,
  ...jest.requireActual('../../../EllipsisActionMenu'),
  default: props => (
    <div>
      Mock EllipsisActionMenu
      <div>actionmenu = {props.actionmenu}</div>
      <button onClick={props.onAction} type="button">Action Button</button>
    </div>
  ),
}));
jest.mock('../../../drawer/Lookup', () => ({
  __esModule: true,
  ...jest.requireActual('../../../drawer/Lookup'),
  default: props => (
    <div>
      Mock ManageLookupDrawer
      <div>id = {props.id}</div>
      <button disabled={props.disabled} onClick={() => props.onSave('lookups')} type="button">save</button>
      <div>Lookups = {JSON.stringify(props.lookups)}</div>
      <div>resourceId = {props.resourceId}</div>
      <div>resourceType = {props.resourceType}</div>
      <div>flowId = {props.flowId}</div>
      <div>hideBackButton = {props.hideBackButton}</div>
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
    replace: mockHistoryReplace,
  }),
}));

jest.mock('../../../../utils/lookup', () => ({
  getLookupFromFormContext: jest.fn().mockReturnValue([{name: 'value_123'}]),
  getLookupFieldId: jest.fn().mockReturnValue('lookupField_id'),
}));

describe('Testsuite for Dyna Select Lookup', () => {
  afterEach(() => {
    mockHistoryPush.mockClear();
    mockOnFieldChange.mockClear();
    mockHistoryReplace.mockClear();
  });
  test('should test the Dyna Select Lookup when the disabled is set to true', () => {
    jest.spyOn(FormContext, 'default').mockReturnValue('mock formcontext');
    jest.spyOn(LookupDrawer, 'default').mockImplementationOnce(props => (
      <div>
        Mock Lookup Drawer
        <button disabled={props.disabled} onClick={props.onSave} type="button">lookup drawer save</button>
        <div>Lookups = {JSON.stringify(props.lookups)}</div>
        <div>flowId = {props.flowId}</div>
        <div>importId = {props.importId}</div>
      </div>
    ));
    const props = {
      id: 'test_id',
      value: '',
      importId: 'import_id',
      flowId: 'flow_id',
      disabled: true,
      onFieldChange: mockOnFieldChange,
      adaptorType: 'adaptor_type',
      formKey: 'form_key',
    };

    initDynaSelectLookup({props});
    expect(screen.getByText(/mocking dyna select/i)).toBeInTheDocument();
    expect(screen.getByText(/options = \[\{"items":\[\{"label":"value_123","value":"value_123"\}\]\}\]/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit lookup click/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit lookup click/i })).toBeDisabled();
    expect(screen.getByRole('button', {name: 'save'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'save'})).toBeDisabled();
    expect(screen.getByRole('button', { name: /lookup drawer save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lookup drawer save/i })).toBeDisabled();
  });
  test('should test the Dyna Select Lookup add lookup button', async () => {
    jest.spyOn(FormContext, 'default').mockReturnValue('mock formcontext');
    jest.spyOn(LookupDrawer, 'default').mockImplementationOnce(props => (
      <div>
        Mock Lookup Drawer
        <button disabled={props.disabled} onClick={props.onSave} type="button">lookup drawer save</button>
        <div>Lookups = {JSON.stringify(props.lookups)}</div>
        <div>flowId = {props.flowId}</div>
        <div>importId = {props.importId}</div>
      </div>
    ));
    const props = {
      id: 'test_id',
      value: 'value_123',
      importId: 'import_id',
      flowId: 'flow_id',
      disabled: false,
      onFieldChange: mockOnFieldChange,
      adaptorType: 'adaptor_type',
      formKey: 'form_key',
    };

    initDynaSelectLookup({props});
    expect(screen.getByText(/mocking dyna select/i)).toBeInTheDocument();
    expect(screen.getByText(/options = \[\{"items":\[\{"label":"value_123","value":"value_123"\}\]\}\]/i)).toBeInTheDocument();
    const addLookupButtonNode = screen.getByRole('button', {
      name: /add lookup click/i,
    });

    expect(addLookupButtonNode).toBeInTheDocument();
    await userEvent.click(addLookupButtonNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/test/lookups/add');
  });
  test('should test the Dyna Select Lookup edit lookup button', async () => {
    jest.spyOn(FormContext, 'default').mockReturnValue('mock formcontext');
    jest.spyOn(LookupDrawer, 'default').mockImplementationOnce(props => (
      <div>
        Mock Lookup Drawer
        <button disabled={props.disabled} onClick={props.onSave} type="button">lookup drawer save</button>
        <div>Lookups = {JSON.stringify(props.lookups)}</div>
        <div>flowId = {props.flowId}</div>
        <div>importId = {props.importId}</div>
      </div>
    ));
    const props = {
      id: 'test_id',
      value: 'value_123',
      importId: 'import_id',
      flowId: 'flow_id',
      disabled: false,
      onFieldChange: mockOnFieldChange,
      adaptorType: 'adaptor_type',
      formKey: 'form_key',
    };

    initDynaSelectLookup({props});
    expect(screen.getByText(/mocking dyna select/i)).toBeInTheDocument();
    expect(screen.getByText(/mock edit icon/i)).toBeInTheDocument();
    expect(screen.getByText(/options = \[\{"items":\[\{"label":"value_123","value":"value_123"\}\]\}\]/i)).toBeInTheDocument();
    const editLookupButtonNode = screen.getByRole('button', {
      name: /edit lookup click/i,
    });

    expect(editLookupButtonNode).toBeInTheDocument();
    await userEvent.click(editLookupButtonNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/test/lookups/edit/value_123');
  });
  test('should test the Dyna Select Lookup manage lookup button', async () => {
    jest.spyOn(FormContext, 'default').mockReturnValue('mock formcontext');
    jest.spyOn(LookupDrawer, 'default').mockImplementationOnce(props => (
      <div>
        Mock Lookup Drawer
        <button disabled={props.disabled} onClick={props.onSave} type="button">lookup drawer save</button>
        <div>Lookups = {JSON.stringify(props.lookups)}</div>
        <div>flowId = {props.flowId}</div>
        <div>importId = {props.importId}</div>
      </div>
    ));
    const props = {
      id: 'test_id',
      value: 'value_123',
      importId: 'import_id',
      flowId: 'flow_id',
      disabled: false,
      onFieldChange: mockOnFieldChange,
      adaptorType: 'adaptor_type',
      formKey: 'form_key',
    };

    initDynaSelectLookup({props});
    expect(screen.getByText(/mock ellipsisactionmenu/i)).toBeInTheDocument();
    const actionButtonNode = screen.getByRole('button', {
      name: /action button/i,
    });

    expect(actionButtonNode).toBeInTheDocument();
    await userEvent.click(actionButtonNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/test/lookup');
  });
  test('should test the Dyna Select Lookup manage lookup save button', async () => {
    jest.spyOn(FormContext, 'default').mockReturnValue('mock formcontext');
    jest.spyOn(LookupDrawer, 'default').mockImplementationOnce(props => (
      <div>
        Mock Lookup Drawer
        <button disabled={props.disabled} onClick={props.onSave} type="button">lookup drawer save</button>
        <div>Lookups = {JSON.stringify(props.lookups)}</div>
        <div>flowId = {props.flowId}</div>
        <div>importId = {props.importId}</div>
      </div>
    ));
    const props = {
      id: 'test_id',
      value: 'value_123',
      importId: 'import_id',
      flowId: 'flow_id',
      disabled: false,
      onFieldChange: mockOnFieldChange,
      adaptorType: 'adaptor_type',
      formKey: 'form_key',
    };

    initDynaSelectLookup({props});
    expect(screen.getByText(/mock managelookupdrawer/i)).toBeInTheDocument();
    const manageLookupSaveButtonNode = screen.getByRole('button', {
      name: 'save',
    });

    expect(manageLookupSaveButtonNode).toBeInTheDocument();
    await userEvent.click(manageLookupSaveButtonNode);
    expect(mockOnFieldChange).toHaveBeenCalledWith('lookupField_id', 'lookups');
  });
  test('should test the Dyna Select lookup drawer and click on save option', async () => {
    jest.spyOn(FormContext, 'default').mockReturnValue('mock formcontext');
    jest.spyOn(LookupDrawer, 'default').mockImplementationOnce(props => (
      <div>
        Mock Lookup Drawer
        <button disabled={props.disabled} onClick={() => props.onSave(true, {name: 'new_value'})} type="button">lookup drawer save</button>
        <div>Lookups = {JSON.stringify(props.lookups)}</div>
        <div>flowId = {props.flowId}</div>
        <div>importId = {props.importId}</div>
      </div>
    ));
    const props = {
      id: 'test_id',
      value: 'value_123',
      importId: 'import_id',
      flowId: 'flow_id',
      disabled: false,
      onFieldChange: mockOnFieldChange,
      adaptorType: 'adaptor_type',
      formKey: 'form_key',
    };

    initDynaSelectLookup({props});
    expect(screen.getByText(/mock lookup drawer/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lookup drawer save/i })).toBeInTheDocument();
    const lookupDrawerSaveButtonNode = screen.getByRole('button', {
      name: /lookup drawer save/i,
    });

    expect(lookupDrawerSaveButtonNode).toBeInTheDocument();
    await userEvent.click(lookupDrawerSaveButtonNode);
    expect(mockOnFieldChange).toBeCalled();
    expect(mockHistoryReplace).toHaveBeenCalledWith('/test/lookups/edit/new_value');
  });
  test('should test the Dyna Select lookup drawer and click on save option when the isEdit is false', async () => {
    jest.spyOn(FormContext, 'default').mockReturnValue('mock formcontext');
    jest.spyOn(LookupDrawer, 'default').mockImplementationOnce(props => (
      <div>
        Mock Lookup Drawer
        <button disabled={props.disabled} onClick={() => props.onSave(false, {name: 'new_value'})} type="button">lookup drawer save</button>
        <div>Lookups = {JSON.stringify(props.lookups)}</div>
        <div>flowId = {props.flowId}</div>
        <div>importId = {props.importId}</div>
      </div>
    ));
    const props = {
      id: 'test_id',
      value: 'value_123',
      importId: 'import_id',
      flowId: 'flow_id',
      disabled: false,
      onFieldChange: mockOnFieldChange,
      adaptorType: 'adaptor_type',
      formKey: 'form_key',
    };

    initDynaSelectLookup({props});
    expect(screen.getByText(/mock lookup drawer/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lookup drawer save/i })).toBeInTheDocument();
    const lookupDrawerSaveButtonNode = screen.getByRole('button', {
      name: /lookup drawer save/i,
    });

    expect(lookupDrawerSaveButtonNode).toBeInTheDocument();
    await userEvent.click(lookupDrawerSaveButtonNode);
    expect(mockOnFieldChange).toBeCalled();
    expect(mockHistoryReplace).toHaveBeenCalledWith('/test/lookups/edit/new_value');
  });
  test('should test the Dyna Select lookup drawer and click on save option when the isEdit is true and when no value is passed', async () => {
    jest.spyOn(FormContext, 'default').mockReturnValue('mock formcontext');
    jest.spyOn(LookupDrawer, 'default').mockImplementationOnce(props => (
      <div>
        Mock Lookup Drawer
        <button disabled={props.disabled} onClick={() => props.onSave(true, {name: 'new_value'})} type="button">lookup drawer save</button>
        <div>Lookups = {JSON.stringify(props.lookups)}</div>
        <div>flowId = {props.flowId}</div>
        <div>importId = {props.importId}</div>
      </div>
    ));
    const props = {
      id: 'test_id',
      value: '',
      importId: 'import_id',
      flowId: 'flow_id',
      disabled: false,
      onFieldChange: mockOnFieldChange,
      adaptorType: 'adaptor_type',
      formKey: 'form_key',
    };

    initDynaSelectLookup({props});
    expect(screen.getByText(/mock lookup drawer/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lookup drawer save/i })).toBeInTheDocument();
    const lookupDrawerSaveButtonNode = screen.getByRole('button', {
      name: /lookup drawer save/i,
    });

    expect(lookupDrawerSaveButtonNode).toBeInTheDocument();
    await userEvent.click(lookupDrawerSaveButtonNode);
    expect(mockOnFieldChange).not.toBeCalled();
    expect(mockHistoryReplace).not.toBeCalled();
  });
});
