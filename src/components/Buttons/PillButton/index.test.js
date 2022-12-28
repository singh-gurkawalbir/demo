import React from 'react';
import { screen, render} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../../test/test-utils';
import PillButton from './index';

describe('pill button component test', () => {
  function handleClick() {
  }
  // eslint-disable-next-line jest/no-commented-out-tests
  // test('pillbutton rendering', () => {
  //   renderWithProviders(
  //     <PillButton
  //       fill={false} // upgrade requested or not
  //       data-test="licenseActionDetails.label"
  //       onClick={handleClick}>
  //       licenseActionDetailslabel
  //     </PillButton>);
  // });

  // eslint-disable-next-line jest/no-commented-out-tests
  // test('pillbutton click working', () => {
  //   renderWithProviders(
  //     <PillButton
  //       fill={false}
  //       data-test="licenseActionDetails.label"
  //       onClick={handleClick}>
  //       licenseActionDetailslabel
  //     </PillButton>);
  //   const Message = screen.getByText('licenseActionDetailslabel');

  //   userEvent.click(Message);
  // });

  test('passing number', () => {
    renderWithProviders(
      <PillButton
        fill
        data-test="licenseActionDetails.label"
        onClick={handleClick}>
        {123}
      </PillButton>);
    const test1 = screen.getByText('123');

    expect(test1).toBeInTheDocument();
  });

  test('testing by className', () => {
    const {container} = render(
      <MemoryRouter>
        <PillButton
          fill
          data-test="licenseActionDetails.label"
          onClick={handleClick}>
          licenseActionDetailslabel
        </PillButton>
      </MemoryRouter>);
    const m = container.querySelector("[data-test='licenseActionDetails.label']");

    expect(m).toBeInTheDocument();
  });
});
