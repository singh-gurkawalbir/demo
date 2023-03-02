
import React from 'react';
import userEvent from '@testing-library/user-event';
import { fireEvent, screen } from '@testing-library/react';
import CodeEditor from './editor';
import { renderWithProviders } from '../../test/test-utils';
import { getCreatedStore } from '../../store';

let initialStore;
const mockOnChange = jest.fn();
const mockOnLoad = jest.fn();
const mockingHandlebarCompleterSetup = jest.fn();

function initCodeEditor({props}) {
  const ui = (
    <CodeEditor {...props} />
  );

  return renderWithProviders(ui, {initialStore});
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
describe('Should test Code Editor', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  afterEach(() => {
    mockOnLoad.mockClear();
    mockOnChange.mockClear();
    mockingHandlebarCompleterSetup.mockClear();
  });
  test('should test the code editor when rendering it should call mockOnLoad function when the code type is text and when the enableAutoComplete is set to true', () => {
    const props = {
      name: 'test name',
      value: 'Test',
      mode: 'text',
      readOnly: true,
      width: '',
      height: '',
      wrap: '',
      showGutter: true,
      showInvisibles: '',
      showLineNumbers: true,
      displayIndentGuides: true,
      useWorker: true,
      enableAutocomplete: true,
      onChange: mockOnChange,
      skipDelay: false,
      hasError: '',
      hasWarning: '',
      errorLine: '',
      onLoad: mockOnLoad,
    };

    initCodeEditor({props});

    expect(mockingHandlebarCompleterSetup).toBeCalled();
    expect(mockOnLoad).toHaveBeenCalled();
  });
  test('should test the code editor when rendering it should call mockOnLoad function when the code type is Javascript and change the prop of hasError to true to test the editor error style', () => {
    const props = {
      name: 'test name',
      value: {test: 'test1'},
      mode: 'javascript',
      readOnly: false,
      width: '',
      height: '',
      wrap: '',
      showGutter: true,
      showInvisibles: undefined,
      showLineNumbers: true,
      displayIndentGuides: true,
      useWorker: true,
      enableAutocomplete: undefined,
      onChange: mockOnChange,
      skipDelay: false,
      hasError: false,
      hasWarning: false,
      errorLine: true,
      onLoad: mockOnLoad,
    };
    const props1 = {
      enableAutocomplete: undefined,
      errorLine: undefined,
      hasError: true,
      hasWarning: false,
      name: 'test name',
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
    expect(utils.container.querySelector('div[id="test name"]').className).not.toEqual(expect.stringContaining('makeStyles-editorReadOnlyPanel-'));
    utils.unmount();
    initCodeEditor({props: props1, renderFun: utils.rerender});
    expect(mockOnLoad).toHaveBeenCalled();
    expect(document.querySelector('div[id="test name"]').className).toEqual(expect.stringContaining('makeStyles-editorErrorWrapper-'));
  });
  test('should test the code editor resize function and rerender when hasWarning is modified to true and test the warning message style', async () => {
    const props = {
      name: 'test name',
      value: 'function preSavePage(){\n  return (\n    console.log("Hello world")\n    )\n}',
      mode: 'javascript',
      readOnly: false,
      width: '',
      height: '',
      wrap: '',
      showGutter: true,
      showInvisibles: undefined,
      showLineNumbers: true,
      displayIndentGuides: true,
      useWorker: true,
      enableAutocomplete: undefined,
      onChange: mockOnChange,
      skipDelay: false,
      hasError: false,
      hasWarning: false,
      errorLine: undefined,
      onLoad: mockOnLoad,
    };
    const props1 = {
      enableAutocomplete: undefined,
      errorLine: undefined,
      hasError: false,
      hasWarning: true,
      name: 'test name',
      onChange: mockOnChange,
      onLoad: mockOnLoad,
      readOnly: false,
      showGutter: true,
      showInvisibles: undefined,
      useWorker: true,
      wrap: undefined,
    };

    const { utils } = initCodeEditor({props});
    const reSizeButtonNode = screen.getByRole('button', {name: 'reSize'});

    expect(reSizeButtonNode).toBeInTheDocument();
    await userEvent.click(reSizeButtonNode);
    utils.unmount();
    initCodeEditor({props: (props1 || props), renderFun: utils.rerender});
    expect(mockOnLoad).toHaveBeenCalled();
    expect(document.querySelector('div[id="test name"]').className).toEqual(expect.stringContaining('makeStyles-editorWarningWrapper-'));
  });
  test('should test the codeEditor when the value is changed and when skip delay has been set to false', async () => {
    const props = {
      name: 'test name',
      value: '',
      mode: 'text',
      readOnly: false,
      width: '',
      height: '',
      wrap: '',
      showGutter: true,
      showInvisibles: undefined,
      showLineNumbers: true,
      displayIndentGuides: true,
      useWorker: true,
      enableAutocomplete: undefined,
      onChange: mockOnChange,
      skipDelay: false,
      hasError: false,
      hasWarning: false,
      errorLine: undefined,
      onLoad: mockOnLoad,
    };

    initCodeEditor({props});

    const textAreaNode = screen.getByRole('textbox');

    expect(textAreaNode).toBeInTheDocument();
    // await userEvent.clear(textAreaNode);
    await fireEvent.change(textAreaNode, {target: {value: ''}});
    textAreaNode.focus();
    await userEvent.paste('test');
    await userEvent.paste('test1');
    expect(textAreaNode).toBeTruthy();
  });
  test('should test the codeEditor when the value is changed and when skip delay has been set to true', async () => {
    const props = {
      name: 'test name',
      value: '',
      mode: 'text',
      readOnly: false,
      width: '',
      height: '',
      wrap: '',
      showGutter: true,
      showInvisibles: undefined,
      showLineNumbers: true,
      displayIndentGuides: true,
      useWorker: true,
      enableAutocomplete: undefined,
      onChange: mockOnChange,
      skipDelay: true,
      hasError: false,
      hasWarning: false,
      errorLine: undefined,
      onLoad: mockOnLoad,
    };

    initCodeEditor({props});

    const textAreaNode = screen.getByRole('textbox');

    expect(textAreaNode).toBeInTheDocument();
    // await userEvent.clear(textAreaNode);
    await fireEvent.change(textAreaNode, {target: {value: ''}});
    textAreaNode.focus();
    await userEvent.paste('test');
    expect(mockOnChange).toBeCalled();
  });
});
