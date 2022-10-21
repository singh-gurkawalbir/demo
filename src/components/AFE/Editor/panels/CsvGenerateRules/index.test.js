/* global describe, test, expect, beforeEach, afterEach, jest */
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import {renderWithProviders} from '../../../../../test/test-utils';
import actions from '../../../../../actions';
import { getCreatedStore } from '../../../../../store';

import CsvGeneratePanel from '.';

const initialStore = getCreatedStore();

jest.mock('../../../../DynaForm/fields/DynaSelectWithInput', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../DynaForm/fields/DynaSelectWithInput'),
  default: props => (
    <div>
      Column Delimiter
      <input onChange={e => props.onFieldChange(props.id, e.target.value)} data-testId={props.label} type="text" value={props.value} />
      {/* <span>{props.errorMessages}</span> */}
    </div>

  ),
}));
function initCsvGeneratePanel(props = {}) {
  initialStore.getState().session.editors = {'5b3c75dd5d3c125c88b5dd02': {
    fieldId: 'file.csv',
    formKey: 'imports-5b3c75dd5d3c125c88b5dd20',
    resourceId: '5b3c75dd5d3c125c88b5dd20',
    resourceType: 'imports',
    rule: {
      customHeaderRows: 'custom value',
      columnDelimiter: 'Comma (,)',
      rowDelimiter: 'LF (\\n)',
      includeHeader: false,
      truncateLastRowDelimiter: false,
      wrapWithQuotes: false,
      replaceTabWithSpace: false,
      replaceNewlineWithSpace: false,
    },
  },
  '6b3c75dd5d3c125c88b5dd02': {
    fieldId: 'file.csv',
    formKey: 'imports-5b3c75dd5d3c125c88b5dd20',
    resourceId: '5b3c75dd5d3c125c88b5dd20',
    resourceType: 'imports',
    rule: {
      customHeaderRows: 'custom value',
      columnDelimiter: 'Comma (,)',
      rowDelimiter: 'LF (\\n)',
    },
  }};
  initialStore.getState().session.form = {'imports-5b3c75dd5d3c125c88b5dd20': { fields: {
    'file.csv': {
      disabled: props.disabled,
    },
  },
  }};
  initialStore.getState().data.resources = {
    imports: [{
      _id: '5b3c75dd5d3c125c88b5dd20',
      _connectionId: 'connection_id_1',
      adaptorType: 'HTTPImport',
      mappings: {
        fields: [{
          generate: 'generate_1',
        }, {
          generate: 'generate_2',
          lookupName: 'lookup_name',
        }],
        lists: [{
          generate: 'item',
          fields: [],
        }],
      },
      http: {
        requestMediaType: 'xml',
      },
    }],
  };

  return renderWithProviders(<CsvGeneratePanel {...props} />, {initialStore});
}

let mockDispatchFn;
let useDispatchSpy;

describe('CsvGeneratePanel UI tests', () => {
  beforeEach(done => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    done();
  });
  const rule = {
    customHeaderRows: 'custom value',
    columnDelimiter: 'Comma (,)',
    rowDelimiter: 'LF (\\n)',
    includeHeader: false,
    truncateLastRowDelimiter: false,
    wrapWithQuotes: false,
    replaceTabWithSpace: false,
    replaceNewlineWithSpace: false,
  };

  afterEach(async () => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should pass the initial render for the fields', async () => {
    initCsvGeneratePanel({editorId: '5b3c75dd5d3c125c88b5dd02', disabled: false});
    await waitFor(() => expect(screen.getByText(/Column delimiter/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Row delimiter')).toBeInTheDocument());
  });
  test('should open the dropdown when clicked on Row delimiter', () => {
    initCsvGeneratePanel({editorId: '5b3c75dd5d3c125c88b5dd02', disabled: false});
    const textfields = screen.getAllByRole('textbox');

    userEvent.click(textfields[1]);
    const list = screen.getAllByRole('option');

    expect(list).toHaveLength(3);
  });
  test('should pass the initial render for all the checkboxes', () => {
    initCsvGeneratePanel({editorId: '5b3c75dd5d3c125c88b5dd02', disabled: false});
    expect(screen.getByRole('checkbox', {name: 'Include header'})).toBeInTheDocument();
    expect(screen.getByRole('checkbox', {name: 'Truncate last row delimiter'})).toBeInTheDocument();
    expect(screen.getByRole('checkbox', {name: 'Wrap with quotes'})).toBeInTheDocument();
    expect(screen.getByRole('checkbox', {name: 'Replace tab with space'})).toBeInTheDocument();
    expect(screen.getByRole('checkbox', {name: 'Replace new line with space'})).toBeInTheDocument();
  });
  test('should render disabled buttons when form status is disabled in the state', () => {
    initCsvGeneratePanel({editorId: '5b3c75dd5d3c125c88b5dd02', disabled: true});
    const textfields = screen.getAllByRole('textbox');

    userEvent.click(textfields[1]);
    const list = screen.getAllByRole('checkbox');

    list.forEach(ele => expect(ele).toBeDisabled());
  });
  test('should make the respective dispatch call when codepanel is altered', async () => {
    initCsvGeneratePanel({editorId: '5b3c75dd5d3c125c88b5dd02', disabled: false});
    const searchInput = screen.getByText(/custom value/i);

    expect(searchInput).toBeInTheDocument();
    userEvent.type(searchInput, 'a');
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.editor.patchRule('5b3c75dd5d3c125c88b5dd02', {...rule, customHeaderRows: 'custom valuea'})));  // an extra alphabet 'a' is added to the text already present //
  });
  test('should make the respective dispatch call when value is changed in column delimiter', async () => {
    initCsvGeneratePanel({editorId: '5b3c75dd5d3c125c88b5dd02', disabled: false});

    const columnField = screen.getByTestId('Column delimiter');

    expect(columnField).toBeInTheDocument();

    userEvent.click(columnField);
    userEvent.type(columnField, 'S');
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.editor.patchRule('5b3c75dd5d3c125c88b5dd02', {...rule,
      columnDelimiter: 'Comma (,)S',
    })));
  });
  test('should make the respective dispatch call when row delimiter value is changed', async () => {
    initCsvGeneratePanel({editorId: '5b3c75dd5d3c125c88b5dd02', disabled: false});

    const rowField = screen.getByRole('option', {name: 'LF (\\n)'});

    expect(rowField).toBeInTheDocument();

    userEvent.click(rowField);

    userEvent.click(document.querySelector('[value="\r"]'));
    await waitFor(() => expect(mockDispatchFn).toBeCalled());
  });
  test('should make a dispatch call when Include Header checkbox is checked', async () => {
    initCsvGeneratePanel({editorId: '5b3c75dd5d3c125c88b5dd02', disabled: false});
    const checkbox1 = screen.getByRole('checkbox', {name: 'Include header'});

    expect(checkbox1).toBeInTheDocument();

    userEvent.click(checkbox1);
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.editor.patchRule('5b3c75dd5d3c125c88b5dd02', {...rule, includeHeader: true})));
  });
  test('should make a dispatch call when Truncate last row delimiter checkbox is checked', async () => {
    initCsvGeneratePanel({editorId: '5b3c75dd5d3c125c88b5dd02', disabled: false});
    const checkbox2 = screen.getByRole('checkbox', {name: 'Truncate last row delimiter'});

    expect(checkbox2).toBeInTheDocument();

    userEvent.click(checkbox2);
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.editor.patchRule('5b3c75dd5d3c125c88b5dd02', {...rule, truncateLastRowDelimiter: true})));
  });
  test('should make a dispatch call when Wrap with quotes checkbox is checked', async () => {
    initCsvGeneratePanel({editorId: '5b3c75dd5d3c125c88b5dd02', disabled: false});
    const checkbox3 = screen.getByRole('checkbox', {name: 'Wrap with quotes'});

    expect(checkbox3).toBeInTheDocument();

    userEvent.click(checkbox3);
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.editor.patchRule('5b3c75dd5d3c125c88b5dd02', {...rule, wrapWithQuotes: true})));
  });
  test('should make a dispatch call when Replace tab with space checkbox is checked', async () => {
    initCsvGeneratePanel({editorId: '5b3c75dd5d3c125c88b5dd02', disabled: false});
    const checkbox4 = screen.getByRole('checkbox', {name: 'Replace tab with space'});

    expect(checkbox4).toBeInTheDocument();

    userEvent.click(checkbox4);
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.editor.patchRule('5b3c75dd5d3c125c88b5dd02', {...rule, replaceTabWithSpace: true})));
  });
  test('should make a dispatch call when Replace new line with space checkbox is checked', async () => {
    initCsvGeneratePanel({editorId: '5b3c75dd5d3c125c88b5dd02', disabled: false});
    const checkbox5 = screen.getByRole('checkbox', {name: 'Replace new line with space'});

    expect(checkbox5).toBeInTheDocument();

    userEvent.click(checkbox5);
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.editor.patchRule('5b3c75dd5d3c125c88b5dd02', {...rule, replaceNewlineWithSpace: true})));
  });
});

