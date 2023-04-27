import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../../../../test/test-utils';
import OperandSettingsDialog from './OperandSettingsDialog';

const onClose = jest.fn();
const onSubmit = jest.fn();

const mockReact = React;

jest.mock('@mui/material/IconButton', () => ({
  __esModule: true,
  ...jest.requireActual('@mui/material/IconButton'),
  default: props => {
    const mockProps = {...props};

    delete mockProps.autoFocus;

    return mockReact.createElement('IconButton', mockProps, mockProps.children);
  },
}));

describe('operandSettingsDialog UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should call onsubmit with type field when field radio button is clicked', async () => {
    renderWithProviders(<OperandSettingsDialog onSubmit={onSubmit} onClose={onClose} ruleData={{type: 'value'}} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await userEvent.click(screen.getAllByRole('radio')[0]);

    await userEvent.click(screen.getByText('Save'));

    expect(onSubmit).toHaveBeenCalledWith({ type: 'field' });
  });
  test('should call onsubmit with type value when field radio button is clicked', async () => {
    renderWithProviders(<OperandSettingsDialog onSubmit={onSubmit} onClose={onClose} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('radio')[1]);
    await userEvent.click(screen.getByText('Save'));

    expect(onSubmit).toHaveBeenCalledWith({ type: 'value' });
  });
  test('should call onsubmit with type expression when field radio button is clicked', async () => {
    renderWithProviders(<OperandSettingsDialog onSubmit={onSubmit} onClose={onClose} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('radio')[2]);
    await userEvent.click(screen.getByText('Save'));

    expect(onSubmit).toHaveBeenCalledWith({ type: 'expression' });
  });
  test('should call onClose when clicked on cancel button', async () => {
    renderWithProviders(<OperandSettingsDialog onSubmit={onSubmit} onClose={onClose} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Cancel'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
