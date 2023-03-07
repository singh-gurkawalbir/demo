import React from 'react';
import { screen, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import Status from './index';

describe('status button component test', () => {
  // eslint-disable-next-line jest/no-commented-out-tests
  // test('status test', () => {
  //   renderWithProviders(<Status />);
  // });
  function handleErrorClick() {}

  // eslint-disable-next-line jest/expect-expect
  test('statusbutton click working', async () => {
    renderWithProviders(
      <Status variant="error" size="mini" onClick={handleErrorClick}>
        handleErrorClick
      </Status>
    );
    const Message = screen.getByText('handleErrorClick');

    await userEvent.click(Message);
  });

  // eslint-disable-next-line jest/expect-expect
  test('passing number', async () => {
    renderWithProviders(
      <Status variant="error" size="mini" onClick={handleErrorClick}>
        {123}
      </Status>
    );
    const Message = screen.getByText('123');

    await userEvent.click(Message);
  });

  test('testing by className', () => {
    const { container } = render(
      <MemoryRouter>
        <Status variant="error" size="mini" onClick={handleErrorClick}>
          handleErrorClick
        </Status>
      </MemoryRouter>
    );
    const m = container.querySelector("[type='button']");

    expect(m).toBeInTheDocument();
  });
});
