/* global describe, test, expect ,jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import PingMessageSnackbar from '.';
import { renderWithProviders} from '../../test/test-utils';

describe('PingMessageSnackbar UI tests', () => {
  test('For comm status equal to error', () => {
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
  test('For comm status loading', () => {
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
    userEvent.click(screen.getByText(/Cancel/i, {exact: false}));
    expect(mockOnCancel).toBeCalled();
    screen.debug();
  });
  test('For comm status loading', () => {
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
  test('For comm status loading', () => {
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
  test('Use case in which commState is not passed', () => {
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

