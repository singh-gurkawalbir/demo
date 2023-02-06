
import React from 'react';
import {screen} from '@testing-library/react';
import DynaNetSuiteImportOperation from './DynaNetSuiteImportOperation';
import { renderWithProviders, reduxStore, mutateStore} from '../../../test/test-utils';

const initialStore = reduxStore;

const items = [
  {name: 'name1', value: 'add'},
  {name: 'name2', value: 'update'},
  {name: 'name3', value: 'addupdate'},
  {name: 'name4', value: 'delete'},
  {name: 'name5', value: 'someLabel'},
];
const mockOnFieldChange = jest.fn();

function initDynaNetSuiteImportOperation(items = {}, supports) {
  mutateStore(initialStore, draft => {
    draft.session.metadata = {application: {someconnectionId: {somePath: {
      data: [{name: 'someName', scriptId: 'once', ...supports}],
    }}}};
  });
  const ui = (
    <DynaNetSuiteImportOperation
      value="once"
      defaultValue="someDefaultValue"
      id="someID"
      onFieldChange={mockOnFieldChange}
      connectionId="someconnectionId"
      selectOptions={[{items}]}
      options={{commMetaPath: 'somePath', recordType: 'once'}}
      filterKey="suitescript-recordTypes"
  />
  );

  return renderWithProviders(ui, {initialStore});
}

describe('dynaNetSuiteImportOperation UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should not show value add,addupdate and delete options when search delete and create is not supported', () => {
    initDynaNetSuiteImportOperation(items, {
      doesNotSupportCreate: true, doesNotSupportSearch: true, doesNotSupportDelete: true,
    });

    const radioButtons = screen.getAllByRole('radio');

    expect(radioButtons).toHaveLength(1);
    expect(screen.getByText('someLabel')).toBeInTheDocument();
  });
  test('should show add and delete option when create is not suported', () => {
    initDynaNetSuiteImportOperation(items, {
      doesNotSupportCreate: true, doesNotSupportSearch: false, doesNotSupportDelete: false,
    });
    const radioButtons = screen.getAllByRole('radio');

    expect(radioButtons).toHaveLength(3);
    expect(screen.getByText('someLabel')).toBeInTheDocument();
    expect(screen.getByText('delete')).toBeInTheDocument();
    expect(screen.getByText('update')).toBeInTheDocument();
  });
  test('should show add and delete option when search is not suported', () => {
    initDynaNetSuiteImportOperation(items, {
      doesNotSupportCreate: false, doesNotSupportSearch: true, doesNotSupportDelete: false,
    });

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
