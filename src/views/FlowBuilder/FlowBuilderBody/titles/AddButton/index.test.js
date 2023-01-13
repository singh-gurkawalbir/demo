
import { render } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import AddButton from '.';

const mockOnClick = jest.fn();

describe('Testsuite for Add Button', () => {
  afterEach(() => {
    mockOnClick.mockClear();
  });
  test('should test the add button when type is generator', () => {
    render(
      <AddButton onClick={mockOnClick} type="generator" />
    );
    const buttonNode = document.querySelector('button[data-test="addGenerator"]');

    expect(buttonNode).toBeInTheDocument();
    userEvent.click(buttonNode);
    expect(mockOnClick).toBeCalled();
  });
  test('should test the add button when type is processor', () => {
    render(
      <AddButton onClick={mockOnClick} type="processor" />
    );
    const buttonNode = document.querySelector('button[data-test="addProcessor"]');

    expect(buttonNode).toBeInTheDocument();
    userEvent.click(buttonNode);
    expect(mockOnClick).toBeCalled();
  });
  test('should test the add button when there is no type', () => {
    render(
      <AddButton onClick={mockOnClick} type="" />
    );
    const buttonNode = document.querySelector('button[data-test="addProcessor"]');

    expect(buttonNode).toBeInTheDocument();
    userEvent.click(buttonNode);
    expect(mockOnClick).toBeCalled();
  });
});
