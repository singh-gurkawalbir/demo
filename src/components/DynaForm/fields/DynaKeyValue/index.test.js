
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaKeyValue from './index';
import { renderWithProviders } from '../../../../test/test-utils';

jest.mock('../../../Sortable/SortableList', () => ({
  __esModule: true,
  ...jest.requireActual('../../../Sortable/SortableList'),
  default: props => (
    <div>
      {props.children}
      <button type="button" onClick={() => props.onSortEnd({ oldIndex: 0, newIndex: 1 })} >Sort</button>
    </div>
  ),
}));

jest.mock('../../../Sortable/SortableItem', () => ({
  __esModule: true,
  ...jest.requireActual('../../../Sortable/SortableItem'),
  default: props => (
    <div>
      {props.value}
    </div>
  ),
}));

describe('dynaKeyValue UI tests', () => {
  const mockhandleEditorClick = jest.fn();
  const mockOnUpdate = jest.fn();
  const mockOnFieldChange = jest.fn();
  const props = {
    value: [{ key: 'id1', value: 'key1' }],
    onUpdate: mockOnUpdate,
    label: 'demo label',
    dataTest: 'demotest',
    suggestionConfig: {},
    classes: {},
    showDelete: true,
    isInlineClose: true,
    enableSorting: true,
    onFieldChange: mockOnFieldChange,
    keyLabel: 'key label',
    valueLabel: 'value label',
    isLoggable: true,
    handleEditorClick: mockhandleEditorClick,
    required: true,
    isValid: true,
    removeHelperText: true,
    isEndSearchIcon: true,
    keyPlaceholder: 'placeholder',
  };

  test('should pass the initial render', () => {
    renderWithProviders(<DynaKeyValue {...props} />);
    expect(screen.getByText('demo label')).toBeInTheDocument();

    const fields = screen.getAllByRole('textbox');

    expect(fields).toHaveLength(4);
    const buttons = screen.getAllByRole('button');

    expect(buttons).toHaveLength(5);
  });
  test('should call the handleKeyUpdate and handleUpdate function when a key field is edited', async () => {
    const newprops = {
      ...props,
      enableSorting: undefined,
      keyName: 'newKey',
      value: undefined,
    };

    renderWithProviders(<DynaKeyValue {...newprops} />);
    const fields = screen.getAllByRole('textbox');

    await userEvent.type(fields[0], 'a');
    await waitFor(() => expect(mockOnFieldChange).toHaveBeenCalled());
  });
  test('should call the handleValueUpdate and handleUpdate functions when a value field is edited', async () => {
    renderWithProviders(<DynaKeyValue {...props} />);
    const fields = screen.getAllByRole('textbox');

    await userEvent.type(fields[1], 'a');

    await waitFor(() => expect(mockOnFieldChange).toHaveBeenCalled());
  });
  test('should call the mockOnUpdate function passed in props when clicked on the openHandlebars button', async () => {
    renderWithProviders(<DynaKeyValue {...props} />);
    const handlebarButton = document.querySelector('#handleBar-0');

    await userEvent.click(handlebarButton);
    await waitFor(() => expect(mockhandleEditorClick).toHaveBeenCalled());
  });
  test('should call the onFieldChange function when clicked on the delete button', async () => {
    renderWithProviders(<DynaKeyValue {...props} />);
    const deleteButton = document.querySelector('[title="Delete"]');

    await userEvent.click(deleteButton);
    await waitFor(() => expect(mockOnFieldChange).toHaveBeenCalled());
  });
  test('should call the onSortEnd function when attempted to sort', async () => {
    renderWithProviders(<DynaKeyValue {...props} />);
    expect(screen.getByText('Sort')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Sort'));
    await waitFor(() => expect(mockOnFieldChange).toHaveBeenCalled());
  });
});
