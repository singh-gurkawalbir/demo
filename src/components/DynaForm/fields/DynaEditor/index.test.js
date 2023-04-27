import React from 'react';
import * as reactRedux from 'react-redux';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { renderWithProviders } from '../../../../test/test-utils';
import DynaEditor from './index';
import errorMessageStore from '../../../../utils/errorStore';
import actions from '../../../../actions';

const mockOnFieldChange = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('../../../CodeEditor', () => ({
  __esModule: true,
  ...jest.requireActual('../../../CodeEditor'),
  default: props => {
    const handleChange = event => {
      props.onChange(event?.currentTarget?.value);
    };

    return (
      <textarea
        mode={props.mode}
        name={props.name}
        data-test="code-editor"
        value={props.value}
        onChange={handleChange}
      />
    );
  },
}));

function initDynaEditor(props = {}) {
  const ui = (
    <MemoryRouter initialEntries={[{ pathname: '/integrations/654321' }]}>
      <Route path="/integrations/654321">
        <DynaEditor {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('dynaEditor UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');

    mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  const id = 'settings';
  const mode = 'json';
  const formKey = 'imports-63ab90ffbc20f510012d5d08';
  const description = 'some description';
  const onFieldChange = mockOnFieldChange;
  const className = 'makeStyles-rawViewWrapper-692';
  const label = 'Settings';
  const editorClassName = 'makeStyles-editor-691';
  const skipJsonParse = true;
  const required = false;
  const isLoggable = false;
  const disabled = false;

  test('should call mockhistorypush when clicking on settings drawer and expand mode is set to drawer', async () => {
    const props = {
      id,
      expandMode: 'drawer',
      mode,
      formKey,
      options: {},
      isValid: true,
      description,
      onFieldChange,
      value: { a: 1 },
      className,
      label,
      editorClassName,
      disabled,
      skipJsonParse,
      required,
      isLoggable,
    };

    initDynaEditor(props);
    const editorButton = screen.getAllByRole('button').find(btn => btn.getAttribute('data-test') === 'settings');

    await userEvent.click(editorButton);
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/654321/expand/imports-63ab90ffbc20f510012d5d08/settings');
  });

  test('mock on field change should be called when content is updated in the settings editor when save mode is set to json', () => {
    const props = {
      id,
      expandMode: 'drawer',
      saveMode: 'json',
      formKey,
      options: { scriptFunctionStub: 'preSavePage', file: 'json' },
      isValid: true,
      onFieldChange,
      value: 'somevalue',
      className,
      label,
      editorClassName,
      disabled,
      required,
      isLoggable,
    };

    initDynaEditor(props);
    const editorButton = screen.getAllByRole('textbox').find(eachOption => eachOption.getAttribute('data-test') === 'code-editor');

    expect(editorButton).toBeInTheDocument();
    expect(document.querySelector('textarea[data-test="code-editor"]')).toHaveValue('somevalue');
    const textBoxNode = screen.getByRole('textbox');

    expect(textBoxNode).toBeInTheDocument();
    fireEvent.change(textBoxNode, { target: { value: '' } });
    expect(mockOnFieldChange).toHaveBeenCalledWith('settings', '', false);
  });
  test('should call validate content function and dispatch correct action', () => {
    const validateContent = jest.fn(() => 'Invalid format');
    const props = {
      id: 'feedOptions',
      expandMode: 'drawer',
      saveMode: 'json',
      formKey,
      options: { scriptFunctionStub: 'preSavePage', file: 'json' },
      isValid: true,
      onFieldChange,
      value: 'somevalue',
      className,
      label: 'Feed options',
      editorClassName,
      disabled,
      required,
      isLoggable,
      validateContent,
      mode: 'json',
    };

    initDynaEditor(props);

    const editorButton = screen.getAllByRole('textbox').find(eachOption => eachOption.getAttribute('data-test') === 'code-editor');

    expect(editorButton).toBeInTheDocument();
    expect(document.querySelector('textarea[data-test="code-editor"]')).toHaveValue('somevalue');
    const textBoxNode = screen.getByRole('textbox');

    expect(textBoxNode).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.form.forceFieldState(formKey)('feedOptions', {isValid: false, errorMessages: 'Invalid format'})
    );

    // should dispatch forceFieldState action when value changes
    const editorArea = document.querySelector('textarea[data-test="code-editor"]');

    userEvent.type(editorArea, 'abcd');

    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.form.forceFieldState(formKey)('feedOptions', {isValid: false, errorMessages: 'Invalid format'})
    );
  });
  test('should dispatch correct action if validateContent is true and mode is json', () => {
    const props = {
      id: 'feedOptions',
      expandMode: 'drawer',
      saveMode: 'json',
      formKey,
      options: { scriptFunctionStub: 'preSavePage', file: 'json' },
      isValid: true,
      onFieldChange,
      value: 'somevalue',
      className,
      label: 'Feed options',
      editorClassName,
      disabled,
      required,
      isLoggable,
      validateContent: true,
      mode: 'json',
    };

    initDynaEditor(props);

    const editorButton = screen.getAllByRole('textbox').find(eachOption => eachOption.getAttribute('data-test') === 'code-editor');

    expect(editorButton).toBeInTheDocument();
    expect(document.querySelector('textarea[data-test="code-editor"]')).toHaveValue('somevalue');
    const textBoxNode = screen.getByRole('textbox');

    expect(textBoxNode).toBeInTheDocument();

    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.form.forceFieldState(formKey)('feedOptions', {isValid: false, errorMessages: errorMessageStore('INVALID_JSON_VALUE', {label: 'Feed options'}) })
    );
  });
  test('should not dispatch any action if validateContent is true and mode is not json', () => {
    const props = {
      id: 'feedOptions',
      expandMode: 'drawer',
      saveMode: 'json',
      formKey,
      options: { scriptFunctionStub: 'preSavePage', file: 'json' },
      isValid: true,
      onFieldChange,
      value: 'somevalue',
      className,
      label: 'Feed options',
      editorClassName,
      disabled,
      required,
      isLoggable,
      validateContent: true,
      mode: 'java',
    };

    initDynaEditor(props);

    const editorButton = screen.getAllByRole('textbox').find(eachOption => eachOption.getAttribute('data-test') === 'code-editor');

    expect(editorButton).toBeInTheDocument();
    expect(document.querySelector('textarea[data-test="code-editor"]')).toHaveValue('somevalue');
    const textBoxNode = screen.getByRole('textbox');

    expect(textBoxNode).toBeInTheDocument();

    expect(mockDispatchFn).toHaveBeenCalledTimes(0);
  });
  test('should not dispatch any action if validateContent is false and mode is json', () => {
    const props = {
      id: 'feedOptions',
      expandMode: 'drawer',
      saveMode: 'json',
      formKey,
      options: { scriptFunctionStub: 'preSavePage', file: 'json' },
      isValid: true,
      onFieldChange,
      value: 'somevalue',
      className,
      label: 'Feed options',
      editorClassName,
      disabled,
      required,
      isLoggable,
      validateContent: false,
      mode: 'java',
    };

    initDynaEditor(props);

    const editorButton = screen.getAllByRole('textbox').find(eachOption => eachOption.getAttribute('data-test') === 'code-editor');

    expect(editorButton).toBeInTheDocument();
    expect(document.querySelector('textarea[data-test="code-editor"]')).toHaveValue('somevalue');
    const textBoxNode = screen.getByRole('textbox');

    expect(textBoxNode).toBeInTheDocument();

    expect(mockDispatchFn).toHaveBeenCalledTimes(0);
  });
  test('should test cancel modal dialog', async () => {
    const props = {
      id,
      expandMode: 'modal',
      mode,
      formKey,
      options: {},
      isValid: true,
      description,
      onFieldChange,
      value: { a: 1 },
      className,
      label: 'Settings',
      editorClassName,
      disabled,
      skipJsonParse,
      required,
      isLoggable,
    };

    initDynaEditor(props);
    const editorButton = screen.getAllByRole('button').find(btn => btn.getAttribute('data-test') === 'settings');

    await userEvent.click(editorButton);
    const onCloseButtonNode = document.querySelector('svg[data-testid="closeModalDialog"]');

    expect(onCloseButtonNode).toBeInTheDocument();
    await userEvent.click(onCloseButtonNode);
    expect(onCloseButtonNode).not.toBeInTheDocument();
  });

  test('mock on field change should be called when content is updated in the expanded settings editor', async () => {
    const props = {
      id,
      expandMode: 'modal',
      mode,
      formKey,
      options: {},
      isValid: true,
      description,
      onFieldChange,
      value: { a: 1 },
      className,
      label: 'Settings',
      editorClassName,
      disabled,
      skipJsonParse: false,
      required,
      isLoggable,
    };

    initDynaEditor(props);
    const editorButton = screen.getAllByRole('button').find(btn => btn.getAttribute('data-test') === 'settings');

    await userEvent.click(editorButton);
    const textBoxNode = screen.getByRole('textbox');

    expect(textBoxNode).toBeInTheDocument();
    fireEvent.change(textBoxNode, { target: { value: 'test' } });
    expect(document.querySelector('textarea[name="settings"]')).toHaveValue('test');
    const doneButton = screen.getByText('Done');

    await userEvent.click(doneButton);
    expect(mockOnFieldChange).toHaveBeenCalledWith('settings', 'test', false);
    expect(doneButton).not.toBeInTheDocument();
  });

  test('should test customHandleEditorClick', async () => {
    const customHandleEditorClick = jest.fn(() => 'customHandleEditorClick Called');
    const props = {
      id,
      customHandleEditorClick,
      expandMode: 'modal',
      isValid: true,
      onFieldChange,
      value: { a: 1 },
      label: 'Settings',
    };

    initDynaEditor(props);
    expect(customHandleEditorClick).not.toHaveBeenCalled();
    const editorButton = screen.getAllByRole('button').find(btn => btn.getAttribute('data-test') === 'settings');

    await userEvent.click(editorButton);
    expect(customHandleEditorClick).toHaveBeenCalledTimes(1);
  });

  test('should test the dyna editor with the updated parsed json string content', async () => {
    const props = {
      id,
      expandMode: 'modal',
      mode,
      formKey,
      options: {},
      isValid: true,
      description,
      onFieldChange,
      value: { a: 1 },
      className,
      label: 'Settings',
      editorClassName,
      disabled,
      skipJsonParse: false,
      required,
      isLoggable,
    };

    initDynaEditor(props);
    const editorButton = screen.getAllByRole('button').find(btn => btn.getAttribute('data-test') === 'settings');

    await userEvent.click(editorButton);
    const textBoxNode = screen.getByRole('textbox');

    expect(textBoxNode).toBeInTheDocument();
    fireEvent.change(textBoxNode, { target: { value: '' } });
    const doneButton = screen.getByText('Done');

    await userEvent.click(doneButton);
    expect(mockOnFieldChange).toHaveBeenCalledWith('settings', '', false);
    expect(doneButton).not.toBeInTheDocument();
    const textBoxNodeupdated = screen.getByRole('textbox');

    expect(textBoxNodeupdated).toBeInTheDocument();
    fireEvent.change(textBoxNodeupdated, { target: { value: '{"result":true, "count":42}' } });
    expect(mockOnFieldChange).toHaveBeenCalledWith('settings', {count: 42, result: true}, false);
  });

  test('should test the dyna editor when the mode is set to xml', async () => {
    const props = {
      id,
      expandMode: 'modal',
      mode: 'xml',
      formKey,
      options: {},
      isValid: true,
      description,
      onFieldChange,
      value: { a: 1 },
      className,
      label: 'Settings',
      editorClassName,
      disabled,
      skipJsonParse: true,
      required,
      isLoggable,
    };

    initDynaEditor(props);
    const editorButton = screen.getAllByRole('button').find(btn => btn.getAttribute('data-test') === 'settings');

    await userEvent.click(editorButton);
    const textBoxNode = screen.getByRole('textbox');

    expect(textBoxNode).toBeInTheDocument();
    fireEvent.change(textBoxNode, { target: { value: '' } });
    const doneButton = screen.getByText('Done');

    await userEvent.click(doneButton);
    expect(mockOnFieldChange).toHaveBeenCalledWith('settings', '', false);
    expect(doneButton).not.toBeInTheDocument();
    const textBoxNodeupdated = screen.getByRole('textbox');

    expect(textBoxNodeupdated).toBeInTheDocument();
    fireEvent.change(textBoxNodeupdated, { target: { value: '{"result":true, "count":42}' } });
    expect(mockOnFieldChange).toHaveBeenCalledWith('settings', '{"result":true, "count":42}', false);
  });

  test('should test customHandleUpdate', () => {
    const customHandleUpdate = jest.fn(() => 'customHandleUpdate Called');
    const props = {
      id,
      expandMode: 'drawer',
      customHandleUpdate,
      saveMode: 'json',
      formKey,
      options: { scriptFunctionStub: 'preSavePage', file: 'json' },
      isValid: true,
      onFieldChange,
      value: 'somevalue',
      className,
      label,
      editorClassName,
      disabled,
      required,
      isLoggable,
    };

    initDynaEditor(props);
    const editorButton = screen.getAllByRole('textbox').find(eachOption => eachOption.getAttribute('data-test') === 'code-editor');

    expect(editorButton).toBeInTheDocument();
    expect(document.querySelector('textarea[data-test="code-editor"]')).toHaveValue('somevalue');
    const textBoxNode = screen.getByRole('textbox');

    expect(textBoxNode).toBeInTheDocument();
    fireEvent.change(textBoxNode, { target: { value: '' } });
    expect(customHandleUpdate).toHaveBeenCalledTimes(1);
  });
});
