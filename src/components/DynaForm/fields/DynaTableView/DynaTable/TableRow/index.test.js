import React from 'react';
import {screen, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TableRow from './index';
import { renderWithProviders } from '../../../../../../test/test-utils';

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

function initTableRow(props = {}) {
  const ui = (
    <TableRow
      {...props}
    />
  );

  return renderWithProviders(ui);
}
const tableState = jest.fn();
const mockonFieldChange = jest.fn();
const onRowChange = jest.fn();

describe('Table Row UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should test rows data by providing type as input data and test updating the text', async () => {
    const props = {
      rowValue: {
        export: 'Id',
        import: 'id',
      },
      rowIndex: 0,
      optionsMap: [{id: 'export', label: 'Export field value', options: undefined, readOnly: false, required: false, supportsRefresh: false, type: 'input', multiline: false}, {id: 'import', label: 'Import field value', options: undefined, readOnly: false, required: false, supportsRefresh: false, type: 'input', multiline: false}],
      touched: true,
      setTableState: tableState,
      onRowChange: {onRowChange},
      onFieldChange: mockonFieldChange,
      ignoreEmptyRow: false,
      disableDeleteRows: false,
    };

    initTableRow(props);
    expect(screen.getByDisplayValue('id')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Id')).toBeInTheDocument();
    const inputs = screen.getAllByRole('combobox');

    await fireEvent.change(inputs[0], { target: { value: '' } });
    await userEvent.type(inputs[0], 'Name');
    expect(screen.getByDisplayValue('Name')).toBeInTheDocument();
    expect(tableState).toHaveBeenCalledWith({type: 'TABLE_ROW_UPDATE',
      rowIndex: 0,
      field: 'export',
      value: 'Name',
      invalidateParentFieldOnError: undefined,
      optionsMap: [
        {
          id: 'export',
          label: 'Export field value',
          options: undefined,
          readOnly: false,
          required: false,
          supportsRefresh: false,
          type: 'input',
          multiline: false,
        },
        {
          id: 'import',
          label: 'Import field value',
          options: undefined,
          readOnly: false,
          required: false,
          supportsRefresh: false,
          type: 'input',
          multiline: false,
        },
      ],
      onRowChange: {onRowChange} });
    fireEvent.change(inputs[1], { target: { value: '' } });
    await userEvent.type(inputs[1], 'name');
    expect(screen.getByDisplayValue('name')).toBeInTheDocument();
    expect(tableState).toHaveBeenCalledWith({type: 'TABLE_ROW_UPDATE',
      rowIndex: 0,
      field: 'import',
      value: 'name',
      invalidateParentFieldOnError: undefined,
      optionsMap: [
        {
          id: 'export',
          label: 'Export field value',
          options: undefined,
          readOnly: false,
          required: false,
          supportsRefresh: false,
          type: 'input',
          multiline: false,
        },
        {
          id: 'import',
          label: 'Import field value',
          options: undefined,
          readOnly: false,
          required: false,
          supportsRefresh: false,
          type: 'input',
          multiline: false,
        },
      ],
      onRowChange: {onRowChange} });
    const deleterow = document.querySelector('button[data-test="deleteTableRow-0"]');

    expect(deleterow).toBeInTheDocument();
    await userEvent.click(deleterow);
    expect(tableState).toHaveBeenCalledWith({type: 'TABLE_ROW_REMOVE', rowIndex: 0, invalidateParentFieldOnError: undefined, optionsMap: props.optionsMap});
  });

  test('should test rows data by providing type as number data and test updating the text', async () => {
    const props = {
      rowValue: {
        export: 35,
        import: 44,
      },
      rowIndex: 0,
      optionsMap: [{id: 'export', label: 'Export field value', options: undefined, readOnly: false, required: false, supportsRefresh: false, type: 'number', multiline: false}, {id: 'import', label: 'Import field value', options: undefined, readOnly: false, required: false, supportsRefresh: false, type: 'number', multiline: false}],
      touched: true,
      setTableState: tableState,
      onRowChange: {onRowChange},
      onFieldChange: mockonFieldChange,
      ignoreEmptyRow: false,
      disableDeleteRows: false,
    };

    initTableRow(props);
    expect(screen.getByDisplayValue('35')).toBeInTheDocument();
    expect(screen.getByDisplayValue('44')).toBeInTheDocument();
    const input = screen.getAllByRole('spinbutton');

    fireEvent.change(input[0], {target: { value: 110 }});
    fireEvent.change(input[1], {target: { value: 120 }});
    expect(tableState).toHaveBeenCalledWith({type: 'TABLE_ROW_UPDATE',
      rowIndex: 0,
      field: 'export',
      value: '110',
      invalidateParentFieldOnError: undefined,
      optionsMap: [
        {
          id: 'export',
          label: 'Export field value',
          options: undefined,
          readOnly: false,
          required: false,
          supportsRefresh: false,
          type: 'number',
          multiline: false,
        },
        {
          id: 'import',
          label: 'Import field value',
          options: undefined,
          readOnly: false,
          required: false,
          supportsRefresh: false,
          type: 'number',
          multiline: false,
        },
      ],
      onRowChange: {onRowChange} });
    expect(tableState).toHaveBeenCalledWith({type: 'TABLE_ROW_UPDATE',
      rowIndex: 0,
      field: 'import',
      value: '120',
      invalidateParentFieldOnError: undefined,
      optionsMap: [
        {
          id: 'export',
          label: 'Export field value',
          options: undefined,
          readOnly: false,
          required: false,
          supportsRefresh: false,
          type: 'number',
          multiline: false,
        },
        {
          id: 'import',
          label: 'Import field value',
          options: undefined,
          readOnly: false,
          required: false,
          supportsRefresh: false,
          type: 'number',
          multiline: false,
        },
      ],
      onRowChange: {onRowChange} });
    const deleterow = document.querySelector('button[data-test="deleteTableRow-0"]');

    expect(deleterow).toBeInTheDocument();
    await userEvent.click(deleterow);
    expect(tableState).toHaveBeenCalledWith({type: 'TABLE_ROW_REMOVE', rowIndex: 0, invalidateParentFieldOnError: undefined, optionsMap: props.optionsMap});
  });
  test('should test rows data by providing type as input data at export fields and and select at import fields test updating the text', async () => {
    const props = {
      rowValue: {
        export: 'text',
      },
      rowIndex: 0,
      optionsMap: [{id: 'export', label: 'Export field value', options: undefined, readOnly: false, required: false, supportsRefresh: false, type: 'input', multiline: false}, {id: 'import', label: 'Import field value', options: [{label: 'N', value: 'N'}, {label: 'X', value: 'X'}, {label: 'Y', value: 'Y'}], readOnly: false, required: false, supportsRefresh: false, type: 'select', multiline: false}],
      touched: true,
      setTableState: tableState,
      onRowChange: {onRowChange},
      onFieldChange: mockonFieldChange,
      ignoreEmptyRow: false,
      disableDeleteRows: false,
    };

    initTableRow(props);
    await userEvent.click(screen.getByText('Please select'));
    const menuItems = screen.getAllByRole('menuitem');
    const items = menuItems.map(each => each.textContent);

    expect(items).toEqual(
      [
        'Please select',
        'N',
        'X',
        'Y',
      ]
    );
    await userEvent.click(menuItems[2]);
    expect(tableState).toHaveBeenCalledWith({type: 'TABLE_ROW_UPDATE',
      rowIndex: 0,
      field: 'import',
      value: 'X',
      invalidateParentFieldOnError: undefined,
      optionsMap: [
        {
          id: 'export',
          label: 'Export field value',
          options: undefined,
          readOnly: false,
          required: false,
          supportsRefresh: false,
          type: 'input',
          multiline: false,
        },
        {
          id: 'import',
          label: 'Import field value',
          options: [{label: 'N', value: 'N'}, {label: 'X', value: 'X'}, {label: 'Y', value: 'Y'}],
          readOnly: false,
          required: false,
          supportsRefresh: false,
          type: 'select',
          multiline: false,
        },
      ],
      onRowChange: {onRowChange} });
    const moreJobActionMenuButtonNode = document.querySelector('button[data-test="deleteTableRow-0"]');

    expect(moreJobActionMenuButtonNode).toBeInTheDocument();
    await userEvent.click(moreJobActionMenuButtonNode);
    expect(tableState).toHaveBeenCalledWith({type: 'TABLE_ROW_REMOVE', rowIndex: 0, invalidateParentFieldOnError: undefined, optionsMap: props.optionsMap});
  });

  test('should test rows data by providing type as select options at export fields and and multiselect at import fields', async () => {
    const props = {
      rowValue: {
      },
      rowIndex: 0,
      optionsMap: [{id: 'export', label: 'Export field value', options: [{text: 'exportop1', id: 'op1'}, {text: 'exportop2', id: 'op2'}, {text: 'exportop3', id: 'op3'}], readOnly: false, required: false, supportsRefresh: false, type: 'select', multiline: false}, {id: 'import', label: 'Import field value', options: [{label: 'N', value: 'N'}, {label: 'X', value: 'X'}, {label: 'Y', value: 'Y'}], readOnly: false, required: false, supportsRefresh: false, type: 'multiselect', multiline: false}],
      touched: false,
      setTableState: tableState,
      onRowChange: {onRowChange},
      onFieldChange: mockonFieldChange,
      ignoreEmptyRow: false,
      disableDeleteRows: false,
    };

    initTableRow(props);
    await userEvent.click(screen.getAllByText('Please select')[0]);
    const menuItems = screen.getAllByRole('menuitem');
    const items = menuItems.map(each => each.textContent);

    expect(items).toEqual(
      [
        'Please select',
        'exportop1',
        'exportop2',
        'exportop3',
      ]
    );
    await userEvent.click(menuItems[2]);
    expect(tableState).toHaveBeenCalledWith({type: 'TABLE_ROW_UPDATE',
      rowIndex: 0,
      field: 'export',
      value: 'op2',
      invalidateParentFieldOnError: undefined,
      optionsMap: [
        {
          id: 'export',
          label: 'Export field value',
          options: [{text: 'exportop1', id: 'op1'}, {text: 'exportop2', id: 'op2'}, {text: 'exportop3', id: 'op3'}],
          readOnly: false,
          required: false,
          supportsRefresh: false,
          type: 'select',
          multiline: false,
        },
        {
          id: 'import',
          label: 'Import field value',
          options: [{label: 'N', value: 'N'}, {label: 'X', value: 'X'}, {label: 'Y', value: 'Y'}],
          readOnly: false,
          required: false,
          supportsRefresh: false,
          type: 'multiselect',
          multiline: false,
        },
      ],
      onRowChange: {onRowChange} });
    await userEvent.click(screen.getAllByText('Please select')[1]);
    const options = screen.getAllByRole('option');

    expect(options).toHaveLength(3);
    const Message = screen.getAllByRole('checkbox');

    fireEvent.click(Message[0]);
    await userEvent.click(screen.getByText('Done'));

    expect(tableState).toHaveBeenCalledWith({type: 'TABLE_ROW_UPDATE',
      rowIndex: 0,
      field: 'import',
      invalidateParentFieldOnError: undefined,
      value: ['N'],
      optionsMap: [
        {
          id: 'export',
          label: 'Export field value',
          options: [{text: 'exportop1', id: 'op1'}, {text: 'exportop2', id: 'op2'}, {text: 'exportop3', id: 'op3'}],
          readOnly: false,
          required: false,
          supportsRefresh: false,
          type: 'select',
          multiline: false,
        },
        {
          id: 'import',
          label: 'Import field value',
          options: [{label: 'N', value: 'N'}, {label: 'X', value: 'X'}, {label: 'Y', value: 'Y'}],
          readOnly: false,
          required: false,
          supportsRefresh: false,
          type: 'multiselect',
          multiline: false,
        },
      ],
      onRowChange: {onRowChange} });
    const deleterow = document.querySelector('button[data-test="deleteTableRow-0"]');

    expect(deleterow).toBeInTheDocument();
    await userEvent.click(deleterow);
    expect(tableState).toHaveBeenCalledWith({type: 'TABLE_ROW_REMOVE', rowIndex: 0, invalidateParentFieldOnError: undefined, optionsMap: props.optionsMap});
  });
  test('should test rows data by providing type as autosuggest at export fields and and multiselect at import fields', async () => {
    const props = {
      rowValue: {
      },
      rowIndex: 0,
      optionsMap: [{id: 'export', label: 'Export field value', options: [{text: 'exportop1', id: 'op1'}, {text: 'exportop2', id: 'op2'}, {text: 'exportop3', id: 'op3'}], readOnly: false, supportsRefresh: false, type: 'autosuggest', multiline: false}, {id: 'import', label: 'Import field value', options: [{label: 'N', value: 'N'}, {label: 'X', value: 'X'}, {label: 'Y', value: 'Y'}], readOnly: false, supportsRefresh: false, type: 'multiselect', multiline: false}],
      touched: false,
      setTableState: tableState,
      onRowChange: {onRowChange},
      onFieldChange: mockonFieldChange,
      ignoreEmptyRow: false,
      disableDeleteRows: false,
    };

    initTableRow(props);
    const input = screen.getAllByRole('combobox');

    fireEvent.change(input[0], {target: {value: 'exportop1'}});
    expect(screen.getByText('exportop1')).toBeInTheDocument();
    await userEvent.click(screen.getAllByText('Please select')[0]);
    const options = screen.getAllByRole('option');

    expect(options).toHaveLength(3);
    const Message = screen.getAllByRole('checkbox');

    fireEvent.click(Message[0]);
    await userEvent.click(screen.getByText('Done'));

    expect(tableState).toHaveBeenCalledWith({type: 'TABLE_ROW_UPDATE',
      rowIndex: 0,
      field: 'import',
      value: ['N'],
      invalidateParentFieldOnError: undefined,
      optionsMap: [
        {
          id: 'export',
          label: 'Export field value',
          options: [{text: 'exportop1', id: 'op1'}, {text: 'exportop2', id: 'op2'}, {text: 'exportop3', id: 'op3'}],
          readOnly: false,
          supportsRefresh: false,
          type: 'autosuggest',
          multiline: false,
        },
        {
          id: 'import',
          label: 'Import field value',
          options: [{label: 'N', value: 'N'}, {label: 'X', value: 'X'}, {label: 'Y', value: 'Y'}],
          readOnly: false,
          supportsRefresh: false,
          type: 'multiselect',
          multiline: false,
        },
      ],
      onRowChange: {onRowChange} });
    const deleterow = document.querySelector('button[data-test="deleteTableRow-0"]');

    expect(deleterow).toBeInTheDocument();
    await userEvent.click(deleterow);
    expect(tableState).toHaveBeenCalledWith({type: 'TABLE_ROW_REMOVE', rowIndex: 0, invalidateParentFieldOnError: undefined, optionsMap: props.optionsMap});
  });
});
