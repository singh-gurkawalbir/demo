import React from 'react';
import {screen, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VirtualizedTable from './index';
import { renderWithProviders } from '../../../../../../test/test-utils';

function initVirtualizedTable(props = {}) {
  const ui = (
    <VirtualizedTable
      {...props}
    />
  );

  return renderWithProviders(ui);
}

jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  debounce: fn => fn,
}));
describe('virtualizedTable UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should test items length is lesser than number of rows provided valid item in all the rows', async () => {
    const props = {
      items: [{key: 'new-wgqeyV1KO--1899857161', value: {export: 'id', import: 'Id'}},
        {key: 'new-wgqeyV1KO--1899857161', value: {export: 'name', import: 'Name'}},
        {key: 'new-wgqeyV1KO--1899857161', value: {export: '', import: ''}}],
      optionsMapFinal: [{id: 'import', label: 'Destination field value', required: false, supportsRefresh: false, type: 'input'}, {id: 'export', label: 'Source field value', required: false, supportsRefresh: false, type: 'input'}],
      touched: true,
      ignoreEmptyRow: undefined,
      isAnyColumnFetching: false,
      setTableState: () => {},
      tableState: {ignoreEmptyRow: undefined,
        tableStateValue: [{key: 'new-wgqeyV1KO--1899857161', value: {export: 'id', import: 'Id'}}, {key: 'new-wgqeyV1KO--1899857161', value: {export: 'name', import: 'Name'}},
          {key: 'new-wgqeyV1KO--1899857161', value: {export: '', import: ''}}]},
    };

    initVirtualizedTable(props);
    expect(screen.getByDisplayValue('id')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Id')).toBeInTheDocument();
    expect(screen.getByDisplayValue('name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Name')).toBeInTheDocument();
    const inputs = screen.getAllByRole('combobox');

    await fireEvent.change(inputs[0], { target: { value: '' } });
    await userEvent.type(inputs[0], 'idchanged');
    expect(screen.getByDisplayValue('idchanged')).toBeInTheDocument();
  });
  test('should test items length is greater than number of rows provided invalid item in one row', async () => {
    const props = {
      items: [{key: 'new-wgqeyV1KO--1899857161', value: {export: 'id', import: 'Id'}},
        {key: 'new-wgqeyV1KO--1899857161', value: {export: 'name', import: 'Name'}},
        {key: 'new-wgqeyV1KO--1899857161', value: {export: 'type', import: 'Type'}},
        {key: 'new-wgqeyV1KO--1899857161', value: {export: 'invoice', import: 'Invoice'}},
        {key: 'new-wgqeyV1KO--1899857161', value: {export: 'type1', import: 'Type1'}},
        {key: 'new-wgqeyV1KO--1899857161', value: {export: 'subsidiary', import: 'Subsidiary'}},
        {key: 'new-wgqeyV1KO--1899857161', value: {export: 'customername', import: 'CustomerName'}},
        {key: 'new-wgqeyV1KO--1899857161', value: {export: 'customerid', import: 'CustomerId'}},
        {key: 'new-wgqeyV1KO--1899857161', value: {export: 'charges', import: 'Charges'}},
        {key: 'new-wgqeyV1KO--1899857161', value: {export: 'customername1', import: 'CustomerName1'}},
        {key: 'new-wgqeyV1KO--1899857161', value: {export: 'address', import: 'Address'}},
        {key: 'new-wgqeyV1KO--1899857161', value: {}},

      ],
      optionsMapFinal: [{id: 'import', label: 'Destination field value', required: true, supportsRefresh: false, type: 'input'}, {id: 'export', label: 'Source field value', required: true, supportsRefresh: false, type: 'input'}],
      touched: true,
      ignoreEmptyRow: undefined,
      isAnyColumnFetching: false,
      setTableState: () => {},
      tableState: {ignoreEmptyRow: undefined,
        tableStateValue: [{key: 'new-wgqeyV1KO--1899857161', value: {export: 'id', import: 'Id'}}, {key: 'new-wgqeyV1KO--1899857161', value: {export: 'name', import: 'Name'}},
          {key: 'new-wgqeyV1KO--1899857161', value: {export: '', import: ''}}]},
    };

    initVirtualizedTable(props);
    expect(screen.getByDisplayValue('id')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Id')).toBeInTheDocument();
    expect(screen.getByDisplayValue('name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('type')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Type')).toBeInTheDocument();
    expect(screen.getByDisplayValue('invoice')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Invoice')).toBeInTheDocument();
    expect(screen.getByDisplayValue('type1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Type1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('subsidiary')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Subsidiary')).toBeInTheDocument();
    expect(screen.getByDisplayValue('customername')).toBeInTheDocument();
    expect(screen.getByDisplayValue('CustomerName')).toBeInTheDocument();
    expect(screen.getByDisplayValue('customerid')).toBeInTheDocument();
    expect(screen.getByDisplayValue('CustomerId')).toBeInTheDocument();
    expect(screen.getByDisplayValue('charges')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Charges')).toBeInTheDocument();
    expect(screen.getByDisplayValue('customername1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('CustomerName1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('address')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Address')).toBeInTheDocument();
    const inputs = screen.getAllByRole('combobox');

    await fireEvent.change(inputs[0], { target: { value: '' } });
    await userEvent.type(inputs[0], 'Typechanged');
    expect(screen.getByDisplayValue('Typechanged')).toBeInTheDocument();
  });

  test('should able to test the Circular progressbar is shown when isAnyColumnFetching is set to true', () => {
    const props = {
      items: [{key: 'new-wgqeyV1KO--1899857161', value: {export: 'id', import: 'Id'}},
        {key: 'new-wgqeyV1KO--1899857161', value: {export: 'name', import: 'Name'}},
        {key: 'new-wgqeyV1KO--1899857161', value: {export: '', import: ''}}],
      optionsMapFinal: [{id: 'import', label: 'Destination field value', required: false, supportsRefresh: false, type: 'input'}, {id: 'export', label: 'Source field value', required: false, supportsRefresh: false, type: 'input'}],
      isAnyColumnFetching: true,
    };

    initVirtualizedTable(props);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
