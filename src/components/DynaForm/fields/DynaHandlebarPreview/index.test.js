
import React from 'react';
import {
  waitFor, screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaHandlebarPreview from './index';
import { renderWithProviders} from '../../../../test/test-utils';

jest.mock('../../../CodeEditor2', () => ({
  __esModule: true,
  ...jest.requireActual('../../../CodeEditor2'),
  default: props => (
    <><div>Editor</div><input type="text" onClick={() => props.onChange(props.value)} /></>
  ),
}));

describe('dynaHandlebarPreview UI tests', () => {
  const mockOnFieldChange = jest.fn();
  const mockEditorClick = jest.fn();
  const props = {id: 'Id', value: 'editorValue', onFieldChange: mockOnFieldChange, label: 'Form Label', onEditorClick: mockEditorClick, isLoggable: true };

  test('should pass the initial render', async () => {
    renderWithProviders(<DynaHandlebarPreview {...props} />);
    expect(screen.getByText('Form Label')).toBeInTheDocument();
    expect(screen.getByText('Editor')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  test('should call the onFieldChange function passed in props when editor is edited', async () => {
    renderWithProviders(<DynaHandlebarPreview {...props} />);
    userEvent.type(screen.getByRole('textbox'), 'a');
    await waitFor(() => expect(mockOnFieldChange).toHaveBeenCalledWith('Id', 'editorValue'));
  });
  test('should call the onEditorClick function when clicked on the AFE icon', async () => {
    renderWithProviders(<DynaHandlebarPreview {...props} />);
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(mockEditorClick).toBeCalled());
  });
});
