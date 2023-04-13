import React from 'react';
import {screen, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaTable from './index';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../test/test-utils';
import actionTypes from './actionTypes';

const initialStore = reduxStore;

const mockOnFieldChange = jest.fn();

function initDynaTable(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.form[props.formKey] = {
      showValidationBeforeTouched: true,
    };
  });
  const ui = (
    <DynaTable
      {...props}
    />
  );

  return renderWithProviders(ui, {initialStore});
}

describe('dynaTable UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should render the values accordingly in static mappings dynatable', async () => {
    const props = {
      label: '',
      value: [{export: 'Id', import: 'id'}, {export: 'Name', import: 'name'}, {export: 'Type', import: 'type'}, {export: 'Invoice', import: 'invoice'}],
      className: 'someclassName',
      optionsMap: [{
        id: 'export',
        label: 'Export field value',
        options: undefined,
        readOnly: false,
        required: false,
        supportsRefresh: false,
        type: 'input',
      }, {
        id: 'import',
        label: 'Import field value',
        options: undefined,
        readOnly: false,
        required: false,
        supportsRefresh: false,
        type: 'input',
      }],
      id: 'lookup.mapList',
      ignoreEmptyRow: () => {},
      onFieldChange: mockOnFieldChange,
      onRowChange: (rowValue, fieldId, value) => {
        // eslint-disable-next-line no-param-reassign
        rowValue[fieldId] = `${value}`;

        return rowValue;
      },
      handleCleanupHandler: () => {},
      disableDeleteRows: false,
      isVirtualizedTable: true,
      isLoggable: false,
      formKey: 'formKey',
    };

    await initDynaTable(props);
    expect(screen.getByDisplayValue('Id')).toBeInTheDocument();
    expect(screen.getByDisplayValue('id')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Type')).toBeInTheDocument();
    expect(screen.getByDisplayValue('type')).toBeInTheDocument();
  });
  test('for updating the text in a row in static map dynatable', async () => {
    const props = {
      label: '',
      rowIndex: 2,
      field: 'Type',
      value: [{export: 'Id', import: 'id'}, {export: 'Name', import: 'name'}, {export: 'Type', import: 'type'}, {export: 'Invoice', import: 'invoice'}],
      className: 'someclassName',
      type: actionTypes.UPDATE_TABLE_ROW,
      optionsMap: [{
        id: 'export',
        label: 'Export field value',
        options: undefined,
        readOnly: false,
        required: false,
        supportsRefresh: false,
        type: 'input',
      }, {
        id: 'import',
        label: 'Import field value',
        options: undefined,
        readOnly: false,
        required: false,
        supportsRefresh: false,
        type: 'input',
        formKey: 'form_key',
      }],
      id: 'lookup.mapList',
      ignoreEmptyRow: () => {},
      onFieldChange: mockOnFieldChange,
      onRowChange: (rowValue, fieldId, value) => {
        // eslint-disable-next-line no-param-reassign
        rowValue[fieldId] = `${value}`;

        return rowValue;
      },
      handleCleanupHandler: () => {},
      disableDeleteRows: false,
      isVirtualizedTable: false,
      isLoggable: false,
    };

    await initDynaTable(props);
    const inputs = screen.getAllByRole('combobox');

    expect(inputs[4]).toHaveValue('Type');
    await fireEvent.change(inputs[4], { target: { value: '' } });
    await userEvent.type(inputs[4], 'TextChanged');
    expect(inputs[4]).toHaveValue('TextChanged');
    expect(mockOnFieldChange).toHaveBeenCalledWith('lookup.mapList', [{export: 'Id', import: 'id'}, {export: 'Name', import: 'name'}, {export: 'TextChanged', import: 'type'}, {export: 'Invoice', import: 'invoice'}]);
  });
});
