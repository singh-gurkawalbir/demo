/* global describe, test, expect */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {screen, render} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OutlinedButton from './index';
import {renderWithProviders} from '../../../test/test-utils';

describe('Outlined Button component test', () => {
  function handleSaveAndCloseClick() {
  }
  test('should render the component with content onto the screen', () => {
    renderWithProviders(<OutlinedButton />);
  });

  test('test passing string', () => {
    const {container} = render(
      <MemoryRouter>
        <OutlinedButton
          data-test="saveAndClose"
          onClick={handleSaveAndCloseClick}
          color="primary">
          Save & close
        </OutlinedButton>
      </MemoryRouter>);
    const test1 = container.querySelector("[data-test='saveAndClose']");

    expect(test1).toBeInTheDocument();
  });

  test('test passing string', () => {
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

  test('test passing number', () => {
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
    const {container} = render(
      <MemoryRouter>
        <OutlinedButton
          data-test="saveAndClose"
          onClick={handleSaveAndCloseClick}
          color="primary">
          {123}
        </OutlinedButton>
      </MemoryRouter>);
    const m = container.querySelector("[data-test='saveAndClose']");

    expect(m).toBeInTheDocument();
  });
});
