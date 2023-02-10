import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../../../../test/test-utils';
import OperandSettingsDialog from './OperandSettingsDialog';

const onClose = jest.fn();
const onSubmit = jest.fn();

describe('operandSettingsDialog UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should call onsubmit with type field when field radio button is clicked', () => {
    renderWithProviders(<OperandSettingsDialog onSubmit={onSubmit} onClose={onClose} ruleData={{type: 'value'}} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    userEvent.click(screen.getAllByRole('radio')[0]);

    userEvent.click(screen.getByText('Save'));

    expect(onSubmit).toHaveBeenCalledWith({ type: 'field' });
  });
  test('should call onsubmit with type value when field radio button is clicked', () => {
    renderWithProviders(<OperandSettingsDialog onSubmit={onSubmit} onClose={onClose} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    userEvent.click(screen.getAllByRole('radio')[1]);
    userEvent.click(screen.getByText('Save'));

    expect(onSubmit).toHaveBeenCalledWith({ type: 'value' });
  });
  test('should call onsubmit with type expression when field radio button is clicked', () => {
    renderWithProviders(<OperandSettingsDialog onSubmit={onSubmit} onClose={onClose} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    userEvent.click(screen.getAllByRole('radio')[2]);
    userEvent.click(screen.getByText('Save'));

    expect(onSubmit).toHaveBeenCalledWith({ type: 'expression' });
  });
  test('should call onClose when clicked on cancel button', () => {
    renderWithProviders(<OperandSettingsDialog onSubmit={onSubmit} onClose={onClose} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    userEvent.click(screen.getByText('Cancel'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
