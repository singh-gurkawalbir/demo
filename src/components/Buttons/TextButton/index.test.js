import React from 'react';
import TextButton from './index';
import { renderWithProviders } from '../../../test/test-utils';

describe('text button component test', () => {
  // eslint-disable-next-line jest/no-commented-out-tests
  // test('text test', () => {
  //   renderWithProviders(<TextButton />);
  // });
  function onClose() {
  }

  // eslint-disable-next-line jest/no-commented-out-tests
  // test('textbutton rendering', () => {
  //   renderWithProviders(
  //     <TextButton
  //       data-test="cancelOperandSettings"
  //       onClick={onClose}>
  //       Cancel
  //     </TextButton>);
  // });

  // eslint-disable-next-line jest/no-commented-out-tests
  // test('textbutton click working', () => {
  //   renderWithProviders(
  //     <TextButton
  //       data-test="cancelOperandSettings"
  //       onClick={onClose}> Cancel
  //     </TextButton>);
  //   const Message = screen.getByText('Cancel');

  //   await userEvent.click(Message);
  // });

  // eslint-disable-next-line jest/no-commented-out-tests
  // test('test passing number', () => {
  //   renderWithProviders(
  //     <TextButton
  //       data-test="cancelOperandSettings"
  //       onClick={onClose}> {123}
  //     </TextButton>);
  //   const Message = screen.getByText('123');

  //   await userEvent.click(Message);
  // });

  test('testing by className', () => {
    renderWithProviders(
      <TextButton
        data-test="cancelOperandSettings"
        onClick={onClose}> Cancel
      </TextButton>
    );
    const m = document.querySelector("[data-test='cancelOperandSettings']");

    expect(m).toBeInTheDocument();
  });
});
