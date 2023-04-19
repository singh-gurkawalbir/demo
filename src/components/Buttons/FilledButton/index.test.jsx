import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FilledButton from './index';
import {renderWithProviders} from '../../../test/test-utils';

describe('filled Button component test', () => {
  function handleClose() {
  }

  test('passing string', () => {
    renderWithProviders(
      <MemoryRouter>
        <FilledButton
          data-test="closeLogs"
          onClick={handleClose}
          disabled={false}
          size="medium"
          color="primary">
          Close
        </FilledButton>
      </MemoryRouter>);
    const test1 = screen.getByText('Close');

    expect(test1).toBeInTheDocument();
  });

  test('passing number', () => {
    renderWithProviders(
      <MemoryRouter>
        <FilledButton
          data-test="closeLogs"
          onClick={handleClose}
          disabled={false}
          size="medium"
          color="primary">
          {123}
        </FilledButton>
      </MemoryRouter>);
    const test1 = screen.getByText('123');

    expect(test1).toBeInTheDocument();
  });

  test('testing by className', () => {
    renderWithProviders(
      <MemoryRouter>
        <FilledButton
          error
          data-test="cancel"
          disabled={false}
          color="primary"
       > Close
        </FilledButton>
      </MemoryRouter>);
    const m = document.querySelector("[data-test='cancel']");

    expect(m).toBeInTheDocument();
  });
});
