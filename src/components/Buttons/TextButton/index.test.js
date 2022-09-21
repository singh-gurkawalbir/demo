/* global describe, test, expect */
import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextButton from './index';
import { renderWithProviders } from '../../../test/test-utils';

describe('text button component test', () => {
  test('text test', () => {
    renderWithProviders(<TextButton />);
    screen.debug();
  });
  function onClose() {
  }

  test('textbutton rendering', () => {
    renderWithProviders(
      <TextButton
        data-test="cancelOperandSettings"
        onClick={onClose}>
        Cancel
      </TextButton>);
    screen.debug();
  });

  test('textbutton click working', () => {
    renderWithProviders(
      <TextButton
        data-test="cancelOperandSettings"
        onClick={onClose}> Cancel
      </TextButton>);
    const Message = screen.getByText('Cancel');

    userEvent.click(Message);
    screen.debug();
  });

  test('test passing number', () => {
    renderWithProviders(
      <TextButton
        data-test="cancelOperandSettings"
        onClick={onClose}> {123}
      </TextButton>);
    const Message = screen.getByText('123');

    userEvent.click(Message);
    screen.debug();
  });

  test('testing by className', () => {
    const { container } = render(
      <TextButton
        data-test="cancelOperandSettings"
        onClick={onClose}> Cancel
      </TextButton>
    );
    const m = container.querySelector("[data-test='cancelOperandSettings']");

    expect(m).toBeInTheDocument();
  });
});
