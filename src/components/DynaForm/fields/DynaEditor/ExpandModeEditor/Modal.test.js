
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditorModal from './Modal';
import { renderWithProviders} from '../../../../../test/test-utils';

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
  test('should call both handleClose and handleUpdate functions passed in props when clicked on "Done"', () => {
    renderWithProviders(<EditorModal {...props} />);
    expect(screen.getByText('Done')).toBeInTheDocument();
    userEvent.click(screen.getByText('Done'));
    expect(mockHandleClose).toHaveBeenCalled();
    expect(mockHandleUpdate).toHaveBeenCalled();
  });
});
