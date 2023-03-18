import React from 'react';
import {screen} from '@testing-library/react';
import DynaNetSuiteImportOperation from './DynaNetSuiteImportOperation';
import { renderWithProviders } from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';

let initialStore = getCreatedStore();

const items = [
  {name: 'name1', value: 'add'},
  {name: 'name2', value: 'update'},
  {name: 'name3', value: 'addupdate'},
  {name: 'name4', value: 'delete'},
  {name: 'name5', value: 'someLabel'},
];
const mockOnFieldChange = jest.fn();

function initDynaNetSuiteImportOperation(items = {}) {
  const ui = (
    <DynaNetSuiteImportOperation
      value="once"
      defaultValue="someDefaultValue"
      id="someID"
      onFieldChange={mockOnFieldChange}
      connectionId="someconnectionId"
      selectOptions={[{items}]}
      formKey="form-123"
      filterKey="suitescript-recordTypes"
  />
  );

  return renderWithProviders(ui, {initialStore});
}

describe('dynaNetSuiteImportOperation UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
    initialStore = getCreatedStore();
  });
  test('should not show value add,addupdate and delete options when search delete and create is not supported', () => {
    initialStore.getState().session.form['form-123'] = {
      fields: {
        'netsuite_da.recordType': { value: 'once' },
      },
    };
    initialStore.getState().session.metadata = {
      application: {
        someconnectionId: {
          'netsuite/metadata/suitescript/connections/someconnectionId/recordTypes': {
            data: [{
              name: 'someName',
              scriptId: 'once',
              doesNotSupportCreate: true,
              doesNotSupportSearch: true,
              doesNotSupportDelete: true,
            }],
          },
        },
      },
    };
    initDynaNetSuiteImportOperation(items);

    const radioButtons = screen.getAllByRole('radio');

    expect(radioButtons).toHaveLength(1);
    expect(screen.getByText('someLabel')).toBeInTheDocument();
  });
  test('should show add and delete option when create is not suported', () => {
    initialStore.getState().session.form['form-123'] = {
      fields: {
        'netsuite_da.recordType': { value: 'once' },
      },
    };
    initialStore.getState().session.metadata = {
      application: {
        someconnectionId: {
          'netsuite/metadata/suitescript/connections/someconnectionId/recordTypes': {
            data: [{
              name: 'someName',
              scriptId: 'once',
              doesNotSupportCreate: true,
              doesNotSupportSearch: false,
              doesNotSupportDelete: false,
            }],
          },
        },
      },
    };
    initDynaNetSuiteImportOperation(items);
    const radioButtons = screen.getAllByRole('radio');

    expect(radioButtons).toHaveLength(3);
    expect(screen.getByText('someLabel')).toBeInTheDocument();
    expect(screen.getByText('delete')).toBeInTheDocument();
    expect(screen.getByText('update')).toBeInTheDocument();
  });
  test('should show add and delete option when search is not suported', () => {
    initialStore.getState().session.form['form-123'] = {
      fields: {
        'netsuite_da.recordType': { value: 'once' },
      },
    };
    initialStore.getState().session.metadata = {
      application: {
        someconnectionId: {
          'netsuite/metadata/suitescript/connections/someconnectionId/recordTypes': {
            data: [{
              name: 'someName',
              scriptId: 'once',
              doesNotSupportCreate: false,
              doesNotSupportSearch: true,
              doesNotSupportDelete: false,
            }],
          },
        },
      },
    };
    initDynaNetSuiteImportOperation(items);

    const radioButtons = screen.getAllByRole('radio');

    expect(radioButtons).toHaveLength(3);
    expect(screen.getByText('someLabel')).toBeInTheDocument();
    expect(screen.getByText('add')).toBeInTheDocument();
    expect(screen.getByText('delete')).toBeInTheDocument();
  });
  test('should show all option list when search update create and delete is supported', () => {
    initDynaNetSuiteImportOperation(items, {});
    const radioButtons = screen.getAllByRole('radio');

    expect(radioButtons).toHaveLength(5);
    expect(screen.getByText('someLabel')).toBeInTheDocument();
    expect(screen.getByText('delete')).toBeInTheDocument();
    expect(screen.getByText('update')).toBeInTheDocument();
    expect(screen.getByText('addupdate')).toBeInTheDocument();
    expect(screen.getByText('add')).toBeInTheDocument();
  });
  test('should show all option list when record type is not specified', () => {
    renderWithProviders(
      <DynaNetSuiteImportOperation
        value="once"
        defaultValue="someDefaultValue"
        id="someID"
        onFieldChange={mockOnFieldChange}
        connectionId="someconnectionId"
        selectOptions={[{items}]}
        filterKey="suitescript-recordTypes"
  />, {initialStore});

    const radioButtons = screen.getAllByRole('radio');

    expect(radioButtons).toHaveLength(5);
    expect(screen.getByText('someLabel')).toBeInTheDocument();
    expect(screen.getByText('delete')).toBeInTheDocument();
    expect(screen.getByText('update')).toBeInTheDocument();
    expect(screen.getByText('addupdate')).toBeInTheDocument();
    expect(screen.getByText('add')).toBeInTheDocument();
  });
});
