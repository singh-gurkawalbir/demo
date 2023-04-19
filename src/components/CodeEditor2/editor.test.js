
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import CodeEditor from './editor';
import {renderWithProviders} from '../../test/test-utils';
import { getCreatedStore } from '../../store';

let initialStore;
const mockOnChange = jest.fn();
const mockOnLoad = jest.fn();
const mockingHandlebarCompleterSetup = jest.fn();

function initCodeEditor({props, renderFun}) {
  const ui = (
    <CodeEditor {...props} />
  );

  return renderWithProviders(ui, {initialStore, renderFun});
}

jest.mock('react-resize-detector', () => ({
  __esModule: true,
  ...jest.requireActual('react-resize-detector'),
  default: props => (
    <>
      <div>handleWidth = {props.handleWidth}</div>
      <div>handleHeight = {props.handleHeight}</div>
      <button type="button" onClick={props.onResize}>reSize</button>
    </>
  ),
}));
jest.mock('../AFE/Editor/panels/Handlebars/autocompleteSetup/editorCompleterSetup', () => ({
  __esModule: true,
  ...jest.requireActual('../AFE/Editor/panels/Handlebars/autocompleteSetup/editorCompleterSetup'),
  default: () => mockingHandlebarCompleterSetup(),
}));
describe('testsuite for CodeEditor', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  afterEach(() => {
    mockOnLoad.mockClear();
    mockOnChange.mockClear();
    mockingHandlebarCompleterSetup.mockClear();
  });
  test('should test the code editor when rendering it should call mockOnLoad function when the code type is JSON and when the enableAutoComplete is set to true and readOnly set to true', () => {
    const props = {
      enableAutocomplete: true,
      errorLine: undefined,
      hasError: undefined,
      hasWarning: false,
      mode: 'json',
      name: 'result',
      onChange: mockOnChange,
      onLoad: mockOnLoad,
      readOnly: true,
      showGutter: true,
      showInvisibles: undefined,
      useWorker: true,
      value: '{\n  "Column0": "1",\n  "Column1": "Eldon Base for stackable storage shelf, platinum",\n  "Column2": "Muhammed MacIntyre",\n  "Column3": "3",\n  "Column4": "-213.25",\n  "Column5": "38.94",\n  "Column6": "35",\n  "Column7": "Nunavut",\n  "Column8": "Storage & Organization",\n  "Column9": "0.8"\n}',
      wrap: undefined,
    };

    initCodeEditor({props});

    expect(mockingHandlebarCompleterSetup).toHaveBeenCalled();
    expect(mockOnLoad).toHaveBeenCalled();
    expect(document.querySelector('div[id="result"]').className).toEqual(expect.stringContaining('makeStyles-editorReadOnlyPanel-'));
  });
  test('should test the code editor when rendering it should call mockOnLoad function when the code type is Javascript and change the prop of hasError to true to test the editor error style', () => {
    const props = {
      enableAutocomplete: undefined,
      errorLine: undefined,
      hasError: false,
      hasWarning: false,
      mode: 'javascript',
      name: 'result',
      onChange: mockOnChange,
      onLoad: mockOnLoad,
      readOnly: false,
      showGutter: true,
      showInvisibles: undefined,
      useWorker: true,
      value: 'function preSavePage(){\n  return (\n    console.log("Hello world")\n    )\n}',
      wrap: undefined,
    };
    const props1 = {
      enableAutocomplete: undefined,
      errorLine: undefined,
      hasError: true,
      hasWarning: false,
      name: 'result',
      onChange: mockOnChange,
      onLoad: mockOnLoad,
      readOnly: false,
      showGutter: true,
      showInvisibles: undefined,
      useWorker: true,
      wrap: undefined,
    };

    const { utils } = initCodeEditor({props});

    expect(mockOnLoad).toHaveBeenCalled();
    expect(utils.container.querySelector('div[id="result"]').className).not.toEqual(expect.stringContaining('makeStyles-editorReadOnlyPanel-'));
    initCodeEditor({props: (props1 || props), renderFun: utils.rerender});
    expect(mockOnLoad).toHaveBeenCalled();
    expect(document.querySelector('div[id="result"]').className).toEqual(expect.stringContaining('makeStyles-editorErrorWrapper-'));
  });
  test('should test the code editor resize function and rerender when hasWarning is modified to true and test the warning message style', async () => {
    const props = {
      enableAutocomplete: true,
      errorLine: undefined,
      hasError: undefined,
      hasWarning: false,
      mode: 'json',
      name: 'result',
      onChange: mockOnChange,
      onLoad: mockOnLoad,
      readOnly: false,
      showGutter: true,
      showInvisibles: undefined,
      useWorker: true,
      value: '{\n  "Column0": "1",\n  "Column1": "Eldon Base for stackable storage shelf, platinum",\n  "Column2": "Muhammed MacIntyre",\n  "Column3": "3",\n  "Column4": "-213.25",\n  "Column5": "38.94",\n  "Column6": "35",\n  "Column7": "Nunavut",\n  "Column8": "Storage & Organization",\n  "Column9": "0.8"\n}',
      wrap: undefined,
    };
    const props1 = {
      enableAutocomplete: true,
      errorLine: true,
      hasError: undefined,
      hasWarning: true,
      mode: 'json',
      name: 'result',
      onChange: mockOnChange,
      onLoad: mockOnLoad,
      readOnly: false,
      showGutter: true,
      showInvisibles: undefined,
      useWorker: true,
      value: {test: 'test'},
      wrap: undefined,
    };

    const { utils } = initCodeEditor({props});
    const reSizeButtonNode = screen.getByRole('button', {name: 'reSize'});

    expect(reSizeButtonNode).toBeInTheDocument();
    await userEvent.click(reSizeButtonNode);
    initCodeEditor({props: (props1 || props), renderFun: utils.rerender});
    expect(mockOnLoad).toHaveBeenCalled();
    expect(document.querySelector('div[id="result"]').className).toEqual(expect.stringContaining('makeStyles-editorWarningWrapper-'));
  });
});
