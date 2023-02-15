import React from 'react';
import {screen, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaStaticMap from './DynaStaticMap';
import { renderWithProviders } from '../../../../test/test-utils';

const mockonFieldChange = jest.fn();

function initDynaStaticMap(props = {}) {
  const ui = (
    <DynaStaticMap
      {...props}
    />
  );

  return renderWithProviders(ui);
}

describe('DynaStaticMap UI test cases', () => {
  test('should test static mapping by modifying the data inside the rows and deleting', () => {
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
    };

    initDynaStaticMap(genralProps);
    expect(screen.getByText('Export field value')).toBeInTheDocument();
    expect(screen.getByText('Import field value')).toBeInTheDocument();
    expect(screen.getByDisplayValue('id')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Id')).toBeInTheDocument();
    expect(screen.getByDisplayValue('name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('samplename')).toBeInTheDocument();
    const input = screen.getAllByRole('textbox');

    fireEvent.change(input[0], { target: { value: '' } });
    userEvent.type(input[0], 'Idexport');
    fireEvent.change(input[1], { target: { value: '' } });
    userEvent.type(input[1], 'Idimport');
    expect(screen.queryByText('id')).not.toBeInTheDocument();
    expect(screen.queryByText('Id')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('Idexport')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Idimport')).toBeInTheDocument();
    expect(screen.getByDisplayValue('name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('samplename')).toBeInTheDocument();
    const deleteButton = document.querySelector('button[data-test="deleteTableRow-0"]');

    expect(deleteButton).toBeInTheDocument();
    userEvent.click(deleteButton);
    expect(screen.queryByText('Idexport')).not.toBeInTheDocument();
    expect(screen.queryByText('Idimport')).not.toBeInTheDocument();
    const deleteButtontest = document.querySelector('button[data-test="deleteTableRow-0"]');

    expect(deleteButtontest).toBeInTheDocument();
    userEvent.click(deleteButtontest);
    expect(screen.queryByText('name')).not.toBeInTheDocument();
    expect(screen.queryByText('samplename')).not.toBeInTheDocument();
    expect(mockonFieldChange).toBeCalled();
  });
  test('should display data for provided mappings', () => {
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
    const textBox = screen.getAllByRole('textbox');

    expect(textBox[0]).toHaveDisplayValue(1350);
    expect(textBox[1]).toHaveDisplayValue(2500);
    expect(textBox[2]).toHaveDisplayValue(3000);
    expect(textBox[3]).toHaveDisplayValue(4000);
    expect(mockonFieldChange).toHaveBeenCalledWith('lookup.mapList', [{export: '1350', import: '2500'}, {export: '3000', import: '4000'}], true);
  });
  test('should test static lookup for provided numeric data with valueoptions', () => {
    const genralProps = {
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
    const textBox = screen.getAllByRole('textbox');

    expect(textBox[0]).toHaveDisplayValue(1350);
    expect(textBox[1]).toHaveDisplayValue(2500);
    expect(textBox[2]).toHaveDisplayValue(3000);
    expect(textBox[3]).toHaveDisplayValue(4000);
    expect(mockonFieldChange).toHaveBeenCalledWith('lookup.mapList', [{export: '1350', import: '2500'}, {export: '3000', import: '4000'}], true);
  });
  test('should test the static mappings provided before saved', () => {
    const genralProps = {
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
    const textBox = screen.getAllByRole('textbox');

    expect(textBox[0]).toHaveDisplayValue(1350);
    expect(textBox[1]).toHaveDisplayValue(2500);
    expect(textBox[2]).toHaveDisplayValue(3000);
    expect(textBox[3]).toHaveDisplayValue(4000);
  });
});
