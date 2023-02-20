import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import PingMessageSnackbar from '.';
import { renderWithProviders} from '../../test/test-utils';

describe('pingMessageSnackbar UI tests', () => {
  test('should pass the initial render for comm status equal to success', () => {
    const mockOnClose = jest.fn();
    const mockOnCancel = jest.fn();
    const props = {
      commStatus: {commState: 'success', message: 'Hi'},
      onClose: mockOnClose,
      onCancel: mockOnCancel,
    };

    const {utils} = renderWithProviders(<MemoryRouter><PingMessageSnackbar {...props} /></MemoryRouter>);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should pass the initial render for comm status loading', async () => {
    const mockOnClose = jest.fn();
    const mockOnCancel = jest.fn();
    const props = {
      commStatus: {commState: 'loading', message: 'Halo biro'},
      onClose: mockOnClose,
      onCancelTask: mockOnCancel,
    };

    renderWithProviders(<MemoryRouter><PingMessageSnackbar {...props} /></MemoryRouter>);

    expect(screen.getByText(/Testing your connection/i, {exact: false})).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i, {exact: false})).toBeInTheDocument();
    await userEvent.click(screen.getByText(/Cancel/i, {exact: false}));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
  test('should pass the initial render for comm status error', () => {
    const mockOnClose = jest.fn();
    const mockOnCancel = jest.fn();
    const props = {
      commStatus: {commState: 'error'},
      onClose: mockOnClose,
      onCancelTask: mockOnCancel,
    };

    const {utils} = renderWithProviders(<MemoryRouter><PingMessageSnackbar {...props} /></MemoryRouter>);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should display the error message when comm status is error', () => {
    const mockOnClose = jest.fn();
    const mockOnCancel = jest.fn();
    const props = {
      commStatus: {commState: 'error', message: ['This is the error']},
      onClose: mockOnClose,
      onCancelTask: mockOnCancel,
    };

    renderWithProviders(<MemoryRouter><PingMessageSnackbar {...props} /></MemoryRouter>);

    expect(screen.getByText(/This is the error/i, {exact: false})).toBeInTheDocument();
  });
  test('should render empty DOM when comm status is not passed', () => {
    const mockOnClose = jest.fn();
    const mockOnCancel = jest.fn();
    const props = {
      commStatus: {commState: null, message: ['This is the error']},
      onClose: mockOnClose,
      onCancelTask: mockOnCancel,
    };

    const {utils} = renderWithProviders(<MemoryRouter><PingMessageSnackbar {...props} /></MemoryRouter>);

    expect(utils.container).toBeEmptyDOMElement();
  });
});

