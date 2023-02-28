import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaSelectScopes from './DynaSelectScopes';
import {mutateStore, renderWithProviders} from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';

let initialStore;
const mockOnFieldChange = jest.fn();

function initDynaSelectScopes({props, resourcesData}) {
  mutateStore(initialStore, draft => {
    draft.user.preferences = {
      environment: 'production',
      defaultAShareId: 'own',
    };
    draft.data.resources = resourcesData;
  });

  const ui = (
    <DynaSelectScopes {...props} />
  );

  return renderWithProviders(ui, {initialStore});
}
// Mocking Field help child component as part of unit testing
jest.mock('../FieldHelp', () => ({
  __esModule: true,
  ...jest.requireActual('../FieldHelp'),
  default: jest.fn().mockReturnValue(<div>Mocking Field help</div>),
}));
// Mocking Help Link child component as part of unit testing
jest.mock('../../HelpLink', () => ({
  __esModule: true,
  ...jest.requireActual('../../HelpLink'),
  default: props => (
    <div>
      <div>Mocking Help Link</div>
      <div>HelpLink = {props.helpLink}</div>
    </div>
  )}));
// Mocking Field Message child component as part of unit testing
jest.mock('./FieldMessage', () => ({
  __esModule: true,
  ...jest.requireActual('./FieldMessage'),
  default: jest.fn().mockReturnValue(<div>Mocking Field Message</div>),
}));
// Mocking Modal Dialog child component as part of unit testing
jest.mock('../../ModalDialog', () => ({
  __esModule: true,
  ...jest.requireActual('../../ModalDialog'),
  default: props => (
    <div>
      <div>Mocking Modal Dialog</div>
      <button type="button" onClick={props.onClose} >Close</button>
      <div>{props.children}</div>
    </div>
  )}));
// Mocking TransferList child component as part of unit testing
jest.mock('../../TransferList', () => ({
  __esModule: true,
  ...jest.requireActual('../../TransferList'),
  default: jest.fn().mockReturnValue(<div>Mocking TransferList</div>),
}));
// Mocking Outlined Button child component as part of unit testing
jest.mock('../../Buttons/OutlinedButton', () => ({
  __esModule: true,
  ...jest.requireActual('../../Buttons/OutlinedButton'),
  default: props => (
    <div>
      <div>Mocking Outlined Button</div>
      <button type="button" onClick={props.onClick} data-test="outlined_button">{props.children}</button>
    </div>
  )}));
// Mocking FilledButton child component as part of unit testing
jest.mock('../../Buttons/FilledButton', () => ({
  __esModule: true,
  ...jest.requireActual('../../Buttons/FilledButton'),
  default: props => (
    <div>
      <div>Mocking Filled Button</div>
      <button type="button" onClick={props.onClick} data-test="Filled_button">{props.children}</button>
    </div>
  )}));
describe('Testsuite for DynaSelectScopes', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  afterEach(() => {
    mockOnFieldChange.mockClear();
  });
  test('should test the rendered selected scopes Form label and Form help when required is set to true', () => {
    const props = {
      label: 'Test Scope Label',
      scopes: ['testscope1', 'testscope2', 'testscope3'],
      onFieldChange: mockOnFieldChange,
      id: 'test_id',
      helpLink: 'test_help_link',
      required: true,
      options: {
        resourceType: 'connections',
        resourceId: 'conn_id',
      },
    };
    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        offline: true,
        name: 'test connection',
      }],
    };

    initDynaSelectScopes({props, resourcesData});
    expect(document.querySelector('label[for="test_id"]')).toHaveTextContent('Test Scope Label');
    expect(document.querySelector('label[for="test_id"]').className).toEqual(expect.stringContaining('Mui-required'));
    expect(screen.getByText(/mocking field help/i)).toBeInTheDocument();
  });
  test('should test the rendered scope button and field message when the required is set to false', () => {
    const props = {
      label: 'Test Scope Label',
      scopes: ['testscope1', 'testscope2', 'testscope3'],
      onFieldChange: mockOnFieldChange,
      id: 'test_id',
      helpLink: 'test_help_link',
      required: false,
      options: {
        resourceType: 'connections',
        resourceId: 'conn_id',
      },
    };
    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        offline: true,
        name: 'test connection',
      }],
    };

    initDynaSelectScopes({props, resourcesData});
    expect(document.querySelector('label[for="test_id"]')).toHaveTextContent('Test Scope Label');
    expect(document.querySelector('label[for="test_id"]').className).not.toEqual(expect.stringContaining('Mui-required'));
    expect(screen.getByText(/mocking outlined button/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {
      name: /test scope label/i,
    })).toBeInTheDocument();
    expect(screen.getByText(/mocking field message/i)).toBeInTheDocument();
  });
  test('should test the modal dialog when we click on scope button and close the modal dialog', async () => {
    const props = {
      label: 'Test Scope Label',
      scopes: ['testscope1', 'testscope2', 'testscope3'],
      onFieldChange: mockOnFieldChange,
      id: 'test_id',
      helpLink: 'test_help_link',
      required: false,
      options: {
        resourceType: 'connections',
        resourceId: 'conn_id',
      },
    };
    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        offline: true,
        name: 'test connection',
      }],
    };

    initDynaSelectScopes({props, resourcesData});
    expect(screen.queryByText(/mocking modal dialog/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {
      name: /test scope label/i,
    }));
    expect(screen.queryByText(/mocking modal dialog/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {
      name: /close/i,
    }));
    expect(screen.queryByText(/mocking modal dialog/i)).not.toBeInTheDocument();
  });
  test('should test the scope transfer list and help link when we click on scope button and save it', async () => {
    const props = {
      label: 'Test Scope Label',
      scopes: ['testscope1', 'testscope2', 'testscope3'],
      onFieldChange: mockOnFieldChange,
      id: 'test_id',
      helpLink: 'test_help_link',
      required: false,
      options: {
        resourceType: 'connections',
        resourceId: 'conn_id',
      },
    };
    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        offline: true,
        name: 'test connection',
      }],
    };

    initDynaSelectScopes({props, resourcesData});
    expect(screen.queryByText(/mocking modal dialog/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {
      name: /test scope label/i,
    }));
    expect(screen.queryByText(/mocking modal dialog/i)).toBeInTheDocument();
    expect(screen.getByText(/scopes editor/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking help link/i)).toBeInTheDocument();
    expect(screen.getByText(/helplink = test_help_link/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking transferlist/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking filled button/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {
      name: /save/i,
    }));
    expect(mockOnFieldChange).toHaveBeenCalledWith('test_id', []);
    expect(screen.queryByText(/mocking modal dialog/i)).not.toBeInTheDocument();
  });
  test('should test the scopes when there are default scopes set and click on save', async () => {
    const props = {
      label: 'Test Scope Label',
      scopes: ['testscope1', 'testscope2', 'testscope3'],
      onFieldChange: mockOnFieldChange,
      id: 'test_id',
      helpLink: 'test_help_link',
      required: false,
      options: {
        resourceType: 'connections',
        resourceId: 'conn_id',
      },
      defaultValue: ['testscope1'],
    };
    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        offline: true,
        name: 'test connection',
      }],
    };

    initDynaSelectScopes({props, resourcesData});
    expect(screen.queryByText(/mocking modal dialog/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {
      name: /test scope label/i,
    }));
    expect(screen.queryByText(/mocking modal dialog/i)).toBeInTheDocument();
    expect(screen.getByText(/scopes editor/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking help link/i)).toBeInTheDocument();
    expect(screen.getByText(/helplink = test_help_link/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking transferlist/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking filled button/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {
      name: /save/i,
    }));
    expect(mockOnFieldChange).toHaveBeenCalledWith('test_id', ['testscope1']);
    expect(screen.queryByText(/mocking modal dialog/i)).not.toBeInTheDocument();
  });
  test('should test the scopes when the value is already selected', async () => {
    const props = {
      label: 'Test Scope Label',
      scopes: ['testscope1', 'testscope2', 'testscope3'],
      onFieldChange: mockOnFieldChange,
      id: 'test_id',
      helpLink: 'test_help_link',
      required: false,
      options: {
        resourceType: 'connections',
        resourceId: 'conn_id',
      },
      value: ['testscope1'],
    };
    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        offline: true,
        name: 'test connection',
      }],
    };

    initDynaSelectScopes({props, resourcesData});
    expect(screen.queryByText(/mocking modal dialog/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {
      name: /test scope label/i,
    }));
    expect(screen.queryByText(/mocking modal dialog/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {
      name: /save/i,
    }));
    expect(mockOnFieldChange).toHaveBeenCalledWith('test_id', ['testscope1']);
    expect(screen.queryByText(/mocking modal dialog/i)).not.toBeInTheDocument();
  });
  test('should test the scopes when there is no resourceType and resourceId', async () => {
    const props = {
      label: 'Test Scope Label',
      scopes: ['testscope1', 'testscope2', 'testscope3'],
      onFieldChange: mockOnFieldChange,
      id: 'test_id',
      helpLink: 'test_help_link',
      required: false,
      value: ['testscope1'],
    };

    initDynaSelectScopes({props});
    expect(screen.queryByText(/mocking modal dialog/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {
      name: /test scope label/i,
    }));
    expect(screen.queryByText(/mocking modal dialog/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {
      name: /save/i,
    }));
    expect(mockOnFieldChange).toHaveBeenCalledWith('test_id', ['testscope1']);
    expect(screen.queryByText(/mocking modal dialog/i)).not.toBeInTheDocument();
  });
  test('should test the scope when the type of scopes is an array of objects', async () => {
    const props = {
      label: 'Test Scope Label',
      scopes: [{scopes: ['test1'], subHeader: 'test_sub_header_1'}, {scopes: ['test2'], subHeader: 'test_sub_header_2'}],
      onFieldChange: mockOnFieldChange,
      id: 'test_id',
      helpLink: 'test_help_link',
      required: false,
      options: {
        resourceType: 'connections',
        resourceId: 'conn_id',
      },
    };
    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        offline: true,
        name: 'test connection',
      }],
    };

    initDynaSelectScopes({props, resourcesData});
    expect(screen.queryByText(/mocking modal dialog/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {
      name: /test scope label/i,
    }));
    expect(screen.queryByText(/mocking modal dialog/i)).toBeInTheDocument();
    expect(screen.getByText(/scopes editor/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking help link/i)).toBeInTheDocument();
    expect(screen.getByText(/helplink = test_help_link/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking transferlist/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking filled button/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {
      name: /save/i,
    }));
    expect(mockOnFieldChange).toHaveBeenCalledWith('test_id', []);
    expect(screen.queryByText(/mocking modal dialog/i)).not.toBeInTheDocument();
  });
  test('should test the scope when the pathToScopeField has been set to fetch the scopes from store', async () => {
    const props = {
      label: 'Test Scope Label',
      scopes: ['test1', 'test2'],
      onFieldChange: mockOnFieldChange,
      pathToScopeField: 'scopes',
      id: 'test_id',
      helpLink: 'test_help_link',
      required: false,
      options: {
        resourceType: 'connections',
        resourceId: 'conn_id',
      },
    };
    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        offline: true,
        name: 'test connection',
        scopes: ['test3'],
      }],
    };

    initDynaSelectScopes({props, resourcesData});
    expect(screen.queryByText(/mocking modal dialog/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {
      name: /test scope label/i,
    }));
    expect(screen.queryByText(/mocking modal dialog/i)).toBeInTheDocument();
    expect(screen.getByText(/scopes editor/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking help link/i)).toBeInTheDocument();
    expect(screen.getByText(/helplink = test_help_link/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking transferlist/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking filled button/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {
      name: /save/i,
    }));
    expect(mockOnFieldChange).toHaveBeenCalledWith('test_id', ['test3']);
    expect(screen.queryByText(/mocking modal dialog/i)).not.toBeInTheDocument();
  });
  test('should test the scope when the pathToScopeField has been set to fetch the empty scopes from store', async () => {
    const props = {
      label: 'Test Scope Label',
      scopes: ['test1', 'test2'],
      onFieldChange: mockOnFieldChange,
      pathToScopeField: 'scopes',
      id: 'test_id',
      helpLink: 'test_help_link',
      required: false,
      options: {
        resourceType: 'connections',
        resourceId: 'conn_id',
      },
    };
    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        offline: true,
        name: 'test connection',
        scopes: [],
      }],
    };

    initDynaSelectScopes({props, resourcesData});
    expect(screen.queryByText(/mocking modal dialog/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {
      name: /test scope label/i,
    }));
    expect(screen.queryByText(/mocking modal dialog/i)).toBeInTheDocument();
    expect(screen.getByText(/scopes editor/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking help link/i)).toBeInTheDocument();
    expect(screen.getByText(/helplink = test_help_link/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking transferlist/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking filled button/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {
      name: /save/i,
    }));
    expect(mockOnFieldChange).toHaveBeenCalledWith('test_id', []);
    expect(screen.queryByText(/mocking modal dialog/i)).not.toBeInTheDocument();
  });
});
