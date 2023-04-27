
import React from 'react';
import userEvent from '@testing-library/user-event';
import AddButton from '.';
import { renderWithProviders } from '../../../../../test/test-utils';

const mockOnClick = jest.fn();

describe('Testsuite for Add Button', () => {
  afterEach(() => {
    mockOnClick.mockClear();
  });
  test('should test the add button when type is generator', async () => {
    renderWithProviders(
      <AddButton onClick={mockOnClick} type="generator" />
    );
    const buttonNode = document.querySelector('button[data-test="addGenerator"]');

    expect(buttonNode).toBeInTheDocument();
    await userEvent.click(buttonNode);
    expect(mockOnClick).toBeCalled();
  });
  test('should test the add button when type is processor', async () => {
    renderWithProviders(
      <AddButton onClick={mockOnClick} type="processor" />
    );
    const buttonNode = document.querySelector('button[data-test="addProcessor"]');

    expect(buttonNode).toBeInTheDocument();
    await userEvent.click(buttonNode);
    expect(mockOnClick).toBeCalled();
  });
  test('should test the add button when there is no type', async () => {
    renderWithProviders(
      <AddButton onClick={mockOnClick} type="" />
    );
    const buttonNode = document.querySelector('button[data-test="addProcessor"]');

    expect(buttonNode).toBeInTheDocument();
    await userEvent.click(buttonNode);
    expect(mockOnClick).toBeCalled();
  });
});
