import React from 'react';
import {screen, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaStaticMap from './DynaStaticMap';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';

const initialStore = reduxStore;
const mockonFieldChange = jest.fn();

function initDynaStaticMap(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.form[props.formKey] = {
      showValidationBeforeTouched: true,
    };
  });
  const ui = (
    <DynaStaticMap
      {...props}
    />
  );

  return renderWithProviders(ui, {initialStore});
}

describe('DynaStaticMap UI test cases', () => {
  test('should test static mapping by modifying the data inside the rows and deleting', async () => {
    const genralProps = {
      keyName: 'export',
      keyLabel: 'Export field value',
      valueLabel: 'Import field value',
      valueName: 'import',
      map: {id: 'Id', name: 'samplename'},
      value: [{export: 'name', import: 'samplename'}],
      id: 'lookup.mapList',
      disabled: false,
      onFieldChange: mockonFieldChange,
      keyOptions: undefined,
      valueOptions: undefined,
      formKey: 'form_key',
    };

    initDynaStaticMap(genralProps);
    expect(screen.getByText('Export field value')).toBeInTheDocument();
    expect(screen.getByText('Import field value')).toBeInTheDocument();
    expect(screen.getByDisplayValue('id')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Id')).toBeInTheDocument();
    expect(screen.getByDisplayValue('name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('samplename')).toBeInTheDocument();
    waitFor(async () => {
      const input = screen.getAllByRole('textbox');

      await fireEvent.change(input[0], { target: { value: '' } });
      await userEvent.type(input[0], 'Idexport');
      await fireEvent.change(input[1], { target: { value: '' } });
      await userEvent.type(input[1], 'Idimport');
      expect(screen.queryByText('id')).not.toBeInTheDocument();
      expect(screen.queryByText('Id')).not.toBeInTheDocument();
      expect(screen.getByDisplayValue('Idexport')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Idimport')).toBeInTheDocument();
      expect(screen.getByDisplayValue('name')).toBeInTheDocument();
      expect(screen.getByDisplayValue('samplename')).toBeInTheDocument();
      const deleteButton = document.querySelector('button[data-test="deleteTableRow-0"]');

      expect(deleteButton).toBeInTheDocument();
      await userEvent.click(deleteButton);
      expect(screen.queryByText('Idexport')).not.toBeInTheDocument();
      expect(screen.queryByText('Idimport')).not.toBeInTheDocument();
      const deleteButtontest = document.querySelector('button[data-test="deleteTableRow-0"]');

      expect(deleteButtontest).toBeInTheDocument();
      await userEvent.click(deleteButtontest);
      expect(screen.queryByText('name')).not.toBeInTheDocument();
      expect(screen.queryByText('samplename')).not.toBeInTheDocument();
      expect(mockonFieldChange).toBeCalled();
    });
  });
  test('should display data for provided mappings', () => {
    const genralProps = {
      formKey: 'form_key',
      keyName: 'export',
      keyLabel: 'Export field value',
      valueLabel: 'Import field value',
      valueName: 'import',
      map: {id: 'Id', name: 'samplename'},
      value: [{export: 'name', import: 'samplename'}],
      id: 'lookup.mapList',
      disabled: false,
      onFieldChange: mockonFieldChange,
      keyOptions: [{id: 'export', label: 'Export field value', options: undefined, readOnly: false, supportsRefresh: false, required: true, type: 'input', multiline: false}, {id: 'import', label: 'Import field value', options: undefined, readOnly: false, required: true, supportsRefresh: false, type: 'input', multiline: false}],
    };

    initDynaStaticMap(genralProps);
    expect(screen.getByDisplayValue('id')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Id')).toBeInTheDocument();
    expect(screen.getByDisplayValue('name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('samplename')).toBeInTheDocument();
  });
  test('should test static lookup for provided numeric data with keyoptions', () => {
    const genralProps = {
      formKey: 'form_key',
      keyName: 'export',
      keyLabel: 'Export field value',
      valueLabel: 'Import field value',
      valueName: 'import',
      map: {1350: '2500', 3000: '4000'},
      value: [{export: '1350', import: '2500'}, {export: '3000', import: '4000'}],
      id: 'lookup.mapList',
      disabled: false,
      onFieldChange: mockonFieldChange,
      keyOptions: [{id: 'export', label: 'Export field value', options: undefined, readOnly: false, supportsRefresh: false, required: true, type: 'input', multiline: false}, {id: 'import', label: 'Import field value', options: undefined, readOnly: false, required: true, supportsRefresh: false, type: 'input', multiline: false}],
    };

    initDynaStaticMap(genralProps);
    const textBox = screen.getAllByRole('combobox');

    expect(textBox[0]).toHaveDisplayValue(1350);
    expect(textBox[1]).toHaveDisplayValue(2500);
    expect(textBox[2]).toHaveDisplayValue(3000);
    expect(textBox[3]).toHaveDisplayValue(4000);
    expect(mockonFieldChange).toHaveBeenCalledWith('lookup.mapList', [{export: '1350', import: '2500'}, {export: '3000', import: '4000'}], true);
  });
  test('should test static lookup for provided numeric data with valueoptions', () => {
    const genralProps = {
      formKey: 'form_key',
      keyName: 'export',
      keyLabel: 'Export field value',
      valueLabel: 'Import field value',
      valueName: 'import',
      map: {1350: '2500', 3000: '4000'},
      value: [{export: '1350', import: '2500'}, {export: '3000', import: '4000'}],
      id: 'lookup.mapList',
      disabled: false,
      onFieldChange: mockonFieldChange,
      valueOptions: [{id: 'export', label: 'Export field value', options: undefined, readOnly: false, supportsRefresh: false, required: true, type: 'input', multiline: false}, {id: 'import', label: 'Import field value', options: undefined, readOnly: false, required: true, supportsRefresh: false, type: 'input', multiline: false}],
    };

    initDynaStaticMap(genralProps);
    const textBox = screen.getAllByRole('combobox');

    expect(textBox[0]).toHaveDisplayValue(1350);
    expect(textBox[1]).toHaveDisplayValue(2500);
    expect(textBox[2]).toHaveDisplayValue(3000);
    expect(textBox[3]).toHaveDisplayValue(4000);
    expect(mockonFieldChange).toHaveBeenCalledWith('lookup.mapList', [{export: '1350', import: '2500'}, {export: '3000', import: '4000'}], true);
  });
  test('should test the static mappings provided before saved', () => {
    const genralProps = {
      formKey: 'form_key',
      keyName: 'export',
      keyLabel: 'Export field value',
      valueLabel: 'Import field value',
      valueName: 'import',
      value: [{export: '1350', import: '2500'}, {export: '3000', import: '4000'}],
      id: 'lookup.mapList',
      disabled: false,
      onFieldChange: mockonFieldChange,
      valueOptions: [{id: 'export', label: 'Export field value', options: undefined, readOnly: false, supportsRefresh: false, required: true, type: 'input', multiline: false}, {id: 'import', label: 'Import field value', options: undefined, readOnly: false, required: true, supportsRefresh: false, type: 'input', multiline: false}],
    };

    initDynaStaticMap(genralProps);
    const textBox = screen.getAllByRole('combobox');

    expect(textBox[0]).toHaveDisplayValue(1350);
    expect(textBox[1]).toHaveDisplayValue(2500);
    expect(textBox[2]).toHaveDisplayValue(3000);
    expect(textBox[3]).toHaveDisplayValue(4000);
  });
});
