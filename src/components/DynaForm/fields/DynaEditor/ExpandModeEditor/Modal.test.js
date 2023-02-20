
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditorModal from './Modal';
import { renderWithProviders} from '../../../../../test/test-utils';
import { validateMockOutputField } from '../../../../../utils/flowDebugger';
import errorMessageStore from '../../../../../utils/errorStore';

jest.mock('../../../../CodeEditor', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../CodeEditor'),
  default: props => (
    <><div>Editor</div><input type="text" onClick={() => props.onChange('a')} /></>
  ),
}));
describe('editorModal UI tests', () => {
  const mockHandleClose = jest.fn();
  const mockHandleUpdate = jest.fn();
  const props = {
    handleClose: mockHandleClose,
    label: 'form label',
    editorProps: { id: 'settings', value: '', mode: 'json', disabled: false, handleUpdate: mockHandleUpdate},
    isLoggable: true,
  };

  test('should pass the initial render', () => {
    renderWithProviders(<EditorModal {...props} />);
    expect(screen.getByText('Editor')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });
  test('should display the error message when an invalid json value is entered in the editor', () => {
    renderWithProviders(<EditorModal {...props} />);
    const editorInputArea = screen.getByRole('textbox');

    expect(screen.queryByText('Settings must be a valid JSON')).toBeNull();
    userEvent.type(editorInputArea, 'a');
    expect(screen.getByText('Settings must be a valid JSON')).toBeInTheDocument();
  });
  test('should display the error message when validateContent returns error for the editor content', () => {
    const editorProps = {...props, validateContent: validateMockOutputField, editorProps: {...props.editorProps, id: 'mockoutput'}};

    renderWithProviders(<EditorModal {...editorProps} />);
    const editorInputArea = screen.getByRole('textbox');

    expect(screen.queryByText(errorMessageStore('MOCK_OUTPUT_INVALID_JSON'))).toBeNull();
    userEvent.type(editorInputArea, 'a');
    expect(screen.queryByText(errorMessageStore('MOCK_OUTPUT_INVALID_JSON'))).toBeInTheDocument();
  });
  test('should not display the error message when validateContent returns no error for the editor content', () => {
    const editorProps = {...props, validateContent: () => {}, editorProps: {...props.editorProps, id: 'mockoutput'}};

    renderWithProviders(<EditorModal {...editorProps} />);
    const editorInputArea = screen.getByRole('textbox');

    expect(screen.queryByText(errorMessageStore('MOCK_OUTPUT_INVALID_JSON'))).toBeNull();
    userEvent.type(editorInputArea, 'a');
    expect(screen.queryByText(errorMessageStore('MOCK_OUTPUT_INVALID_JSON'))).not.toBeInTheDocument();
  });
  test('should call both handleClose and handleUpdate functions passed in props when clicked on "Done"', async () => {
    renderWithProviders(<EditorModal {...props} />);
    expect(screen.getByText('Done')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Done'));
    expect(mockHandleClose).toHaveBeenCalled();
    expect(mockHandleUpdate).toHaveBeenCalled();
  });
});
