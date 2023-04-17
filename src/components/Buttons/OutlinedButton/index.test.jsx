import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OutlinedButton from './index';
import {renderWithProviders} from '../../../test/test-utils';

describe('outlined Button component test', () => {
  function handleSaveAndCloseClick() {
  }

  test('passing string', () => {
    renderWithProviders(
      <MemoryRouter>
        <OutlinedButton
          data-test="saveAndClose"
          onClick={handleSaveAndCloseClick}
          color="primary">
          Save & close
        </OutlinedButton>
      </MemoryRouter>);
    const test1 = document.querySelector("[data-test='saveAndClose']");

    expect(test1).toBeInTheDocument();
  });

  test('passing string duplicate', () => {
    renderWithProviders(
      <MemoryRouter>
        <OutlinedButton
          data-test="saveAndClose"
          onClick={handleSaveAndCloseClick}
          color="primary">
          Save & close
        </OutlinedButton>
      </MemoryRouter>);
    const test2 = screen.getByText('Save & close');

    expect(test2).toBeInTheDocument();
  });

  test('passing number', () => {
    renderWithProviders(
      <MemoryRouter>
        <OutlinedButton
          data-test="saveAndClose"
          onClick={handleSaveAndCloseClick}
          color="primary">
          {123}
        </OutlinedButton>
      </MemoryRouter>);
    const test1 = screen.getByText('123');

    expect(test1).toBeInTheDocument();
  });

  test('testing by className', () => {
    renderWithProviders(
      <MemoryRouter>
        <OutlinedButton
          data-test="saveAndClose"
          onClick={handleSaveAndCloseClick}
          color="primary">
          {123}
        </OutlinedButton>
      </MemoryRouter>);
    const m = document.querySelector("[data-test='saveAndClose']");

    expect(m).toBeInTheDocument();
  });
});
