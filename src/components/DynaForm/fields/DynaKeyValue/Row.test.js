/* global describe, test, expect, jest */
import React from 'react';
import { screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KeyValueRow from './Row';
import {renderWithProviders} from '../../../../test/test-utils';

jest.mock('../DynaAutoSuggest', () => ({
  __esModule: true,
  ...jest.requireActual('../DynaAutoSuggest'),
  default: props => (
    <button type="button" onClick={() => props.onFieldChange()}>AutoSuggest Component</button>
  ),
}));

describe('KeyValueRow UI tests', () => {
  const mockhandleUpdate = jest.fn();
  const mockhandleKeyUpdate = jest.fn();
  const mockhandleValueUpdate = jest.fn();
  const mockhandleDelete = jest.fn();
  const mockhandleEditorClick = jest.fn();
  const props = {
    suggestionConfig: {
      keyConfig: {},
      valueConfig: {},
    },
    isDragInProgress: true,
    isRowDragged: false,
    keyName: 'key1',
    valueName: 'value1',
    index: 0,
    handleUpdate: mockhandleUpdate,
    rowInd: 0,
    handleKeyUpdate: mockhandleKeyUpdate,
    handleValueUpdate: mockhandleValueUpdate,
    showDelete: true,
    isInlineClose: true,
    handleDelete: mockhandleDelete,
    isKey: false,
    r: {key1: 'key'},
    enableSorting: true,
    classes: {},
    showSortOrder: true,
    isLoggable: true,
    handleEditorClick: mockhandleEditorClick,
    isEndSearchIcon: false,
    keyPlaceholder: 'placeholder',
  };

  test('should pass the initial render', () => {
    renderWithProviders(<KeyValueRow {...props} />);
    expect(screen.getByText('AutoSuggest Component')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(4);
    const sortableHandle = document.querySelector('[id="dragHandle"]');

    expect(sortableHandle).toBeInTheDocument();
    screen.debug(undefined, Infinity);
  });
  test('should display the dropdown only when showSortOrder prop is false', () => {
    const newprops = {...props,
      suggestionConfig: {
        keyConfig: {},
      },
      showSortOrder: false};

    renderWithProviders(<KeyValueRow {...newprops} />);
    expect(screen.getByText('AutoSuggest Component')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
  test('should call the handledelete function when clicked on the delete button', async () => {
    renderWithProviders(<KeyValueRow {...props} />);
    const deleteButtons = screen.getAllByRole('button');

    userEvent.click(deleteButtons[1]);
    await waitFor(() => expect(mockhandleDelete).toBeCalled());
  });
  test('should call the handleEditorClick function when clicked on openHandlebars button', async () => {
    renderWithProviders(<KeyValueRow {...props} />);
    const deleteButtons = screen.getAllByRole('button');

    userEvent.click(deleteButtons[2]);
    await waitFor(() => expect(mockhandleEditorClick).toBeCalled());
  });
  test('should open the dropdown when clicked on the dropdown', () => {
    renderWithProviders(<KeyValueRow {...props} />);
    expect(screen.queryByText('Descending')).toBeNull();
    userEvent.click(screen.getByText('Ascending'));
    expect(screen.getByText('Descending')).toBeInTheDocument();
    screen.debug(undefined, Infinity);
  });
  test('should call the handleValueUpdate function when the dropdown value is changed', async () => {
    renderWithProviders(<KeyValueRow {...props} />);
    userEvent.click(screen.getByText('Ascending'));
    expect(screen.getByText('Descending')).toBeInTheDocument();
    userEvent.click(screen.getByText('Descending'));
    await waitFor(() => expect(mockhandleValueUpdate).toBeCalled());
  });
  test('should call the handleValueUpdate when the textField is edited', async () => {
    const newprops = {...props,
      suggestionConfig: {
        keyConfig: {},
      },
      showSortOrder: false};

    renderWithProviders(<KeyValueRow {...newprops} />);

    const field = screen.getByRole('textbox');

    expect(field).toBeInTheDocument();
    userEvent.type(field, 'a');
    await waitFor(() => expect(mockhandleValueUpdate).toBeCalled());
  });
  test('should call the handleKeyUpdate function passed in props when the field that appears when suggestKeyConfig prop is undefined is updated', async () => {
    const newprops = {...props,
      suggestionConfig: {
        valueConfig: {},
      },
      showSortOrder: false};

    renderWithProviders(<KeyValueRow {...newprops} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    const field = screen.getByRole('textbox');

    userEvent.type(field);
    await waitFor(() => expect(mockhandleKeyUpdate).toBeCalled());
  });
  test('should display the sortable handle only when enableSorting and showGripper are true', () => {
    const newprops = {
      ...props,
      enableSorting: true,
      isRowDragged: true,
    };

    renderWithProviders(<KeyValueRow {...newprops} />);
    const sortableHandle = document.querySelector('[id="dragHandle"]');

    expect(sortableHandle).toBeInTheDocument();
  });
  test('should render the inLineClose button additionally when r.disableRowKey is true', () => {
    const newprops = {
      ...props,
      keyName: 'key',
      keyPlaceholder: undefined,
      r: {
        key1: 'key',
        isSelect: true,
        disableRowKey: true,
      },
      isInlineClose: false,
    };

    renderWithProviders(<KeyValueRow {...newprops} />);
    const buttons = screen.getAllByRole('button');

    expect(buttons).toHaveLength(4);
  });
  test('function wbcefv', async () => {
    renderWithProviders(<KeyValueRow {...props} />);
    expect(screen.getByText('AutoSuggest Component')).toBeInTheDocument();
    userEvent.click(screen.getByText('AutoSuggest Component'));
    await waitFor(() => expect(mockhandleUpdate).toBeCalled());
  });
});
