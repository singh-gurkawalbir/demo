/* eslint-disable react/jsx-handler-names */
import { screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import DynaTreeModal from './DynaTreeModal';
import { renderWithProviders } from '../../../../test/test-utils';

const mockOnFieldChange = jest.fn();

jest.mock('../DynaText', () => ({
  __esModule: true,
  ...jest.requireActual('../DynaText'),
  default: props => (
    <div>
      <div>Testing Dyna Text</div>
      <div>id = {props.id}</div>
      <div>value = {props.value}</div>
      <div>helpText = {props.helpText}</div>
      <div>label = {props.label}</div>
      <div>delimiter = {props.delimiter}</div>
      <div>isValid = {props.isValid}</div>
      <div>errorMessages = {props.errorMessages}</div>
    </div>
  ),
}));

jest.mock('../../../ActionButton', () => ({
  __esModule: true,
  ...jest.requireActual('../../../ActionButton'),
  default: props => (
    <div>
      <button type="button" data-test="openReferencedFieldsDialog" onClick={props.onClick} >
        Mock Action Button
      </button>
    </div>
  ),
}));
jest.mock('../../../icons/AddIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../icons/AddIcon'),
  default: () => (
    <div>Mock Add Icon</div>
  ),
}));
jest.mock('../../../ModalDialog', () => ({
  __esModule: true,
  ...jest.requireActual('../../../ModalDialog'),
  default: props => (
    <div>
      <div>Mock Modal Dialog</div>
      <button type="button" onClick={props.onClose}>
        Mock Modal Dialog OnClose
      </button>
      <div>{props.children}</div>
    </div>
  ),
}));
jest.mock('../DynaRefreshableSelect/RefreshableTreeComponent', () => ({
  __esModule: true,
  ...jest.requireActual('../DynaRefreshableSelect/RefreshableTreeComponent'),
  default: props => (
    <div>
      <button type="submit" onClick={props.setSelectedValues}>
        Mock RefreshableTreeComponent
      </button>
      <div>selectedValues = {props.selectedValues}</div>
    </div>
  ),
}));
jest.mock('../../../ActionGroup', () => ({
  __esModule: true,
  ...jest.requireActual('../../../ActionGroup'),
  default: props => (
    <div>
      <div>Mock Action Group</div>
      <div>{props.children}</div>
    </div>
  ),
}));
describe('Testsuite for Dyna Tree Modal', () => {
  beforeEach(() => {
    mockOnFieldChange.mockClear();
  });
  test('should test the Dyna Tree Modal initial render and the error message should load empty', () => {
    const props = {
      id: 'test_id',
      onFieldChange: mockOnFieldChange,
      value: 'test value',
      label: 'test label',
      helpText: 'test help text',
      disabled: true,
      errorMsg: 'test error message',
      options: {
        referenceTo: 'Test reference to',
        relationshipName: 'Test RelationShip Name',
      },
    };

    renderWithProviders(
      <DynaTreeModal {...props} />
    );
    expect(screen.getByText(/testing dyna text/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {
      name: /mock action button/i,
    })).toBeInTheDocument();
    expect(screen.getByText(/errorMessages =/i)).toBeInTheDocument();
  });
  test('should test the Dyna Tree Modal by clicking the action button the it should show the error message when the disabled is set to true', async () => {
    const props = {
      id: 'test_id',
      onFieldChange: mockOnFieldChange,
      value: 'test value',
      label: 'test label',
      helpText: 'test help text',
      disabled: true,
      errorMsg: 'test error message',
      options: {
        referenceTo: 'Test reference to',
        relationshipName: 'Test RelationShip Name',
      },
    };

    renderWithProviders(
      <DynaTreeModal {...props} />
    );
    expect(screen.getByText(/testing dyna text/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {
      name: /mock action button/i,
    })).toBeInTheDocument();
    expect(screen.getByText(/errorMessages =/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {
      name: /mock action button/i,
    }));
    expect(screen.getByText(/errorMessages = test error message/i)).toBeInTheDocument();
  });
  test('should test the Dyna Tree Modal by clicking the action button the it should show the ReferencedFieldsModal when the disabled is set to false and test the modal close button', async () => {
    const props = {
      id: 'test_id',
      onFieldChange: mockOnFieldChange,
      value: 'test value',
      label: 'test label',
      helpText: 'test help text',
      disabled: false,
      errorMsg: 'test error message',
      options: {
        referenceTo: 'Test reference to',
        relationshipName: 'Test RelationShip Name',
      },
    };

    renderWithProviders(
      <DynaTreeModal {...props} />
    );
    expect(screen.getByText(/testing dyna text/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {
      name: /mock action button/i,
    })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {
      name: /mock action button/i,
    }));
    expect(screen.getByText('Mock Modal Dialog')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Mock Modal Dialog OnClose'})).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: 'Mock Modal Dialog OnClose'}));
    expect(screen.queryByText('Mock Modal Dialog')).not.toBeInTheDocument();
  });
  test('should test the Dyna Tree Modal by clicking the action button the it should show the ReferencedFieldsModal when the disabled is set to false and test the Add selected button', async () => {
    const props = {
      id: 'test_id',
      onFieldChange: mockOnFieldChange,
      value: ['test value'],
      label: 'test label',
      helpText: 'test help text',
      disabled: false,
      errorMsg: 'test error message',
      options: {
        referenceTo: 'Test reference to',
        relationshipName: 'Test RelationShip Name',
      },
    };

    renderWithProviders(
      <DynaTreeModal {...props} />
    );
    expect(screen.getByText(/testing dyna text/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {
      name: /mock action button/i,
    })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {
      name: /mock action button/i,
    }));
    expect(screen.getByText('Mock Modal Dialog')).toBeInTheDocument();
    expect(screen.getByText('Mock Action Group')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Add Selected'})).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: 'Add Selected'}));
    expect(mockOnFieldChange).toHaveBeenCalledWith('test_id', ['test value']);
    expect(screen.queryByText('Mock Modal Dialog')).not.toBeInTheDocument();
  });
  test('should test the Dyna Tree Modal by clicking the action button the it should show the ReferencedFieldsModal when the disabled is set to false and test the cancel button when the no value is passed', async () => {
    const props = {
      id: 'test_id',
      onFieldChange: mockOnFieldChange,
      value: '',
      label: 'test label',
      helpText: 'test help text',
      disabled: false,
      errorMsg: 'test error message',
      options: {
        referenceTo: 'Test reference to',
        relationshipName: 'Test RelationShip Name',
      },
    };

    renderWithProviders(
      <DynaTreeModal {...props} />
    );
    expect(screen.getByText(/testing dyna text/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {
      name: /mock action button/i,
    })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {
      name: /mock action button/i,
    }));
    expect(screen.getByText('Mock Modal Dialog')).toBeInTheDocument();
    expect(screen.getByText('Mock Action Group')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Cancel'})).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: 'Cancel'}));
    expect(screen.queryByText('Mock Modal Dialog')).not.toBeInTheDocument();
  });
  test('should test the Dyna Tree Modal by clicking the action button the it should show the ReferencedFieldsModal when the disabled is set to false and test the Add selected button when the value type is number', async () => {
    const props = {
      id: 'test_id',
      onFieldChange: mockOnFieldChange,
      value: 123,
      label: 'test label',
      helpText: 'test help text',
      disabled: false,
      errorMsg: 'test error message',
      options: {
        referenceTo: 'Test reference to',
        relationshipName: 'Test RelationShip Name',
      },
    };

    renderWithProviders(
      <DynaTreeModal {...props} />
    );
    expect(screen.getByText(/testing dyna text/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {
      name: /mock action button/i,
    })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {
      name: /mock action button/i,
    }));
    expect(screen.getByText('Mock Modal Dialog')).toBeInTheDocument();
    expect(screen.getByText('Mock Action Group')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Add Selected'})).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: 'Add Selected'}));
    expect(mockOnFieldChange).toHaveBeenCalledWith('test_id', 123);
    expect(screen.queryByText('Mock Modal Dialog')).not.toBeInTheDocument();
  });
});
