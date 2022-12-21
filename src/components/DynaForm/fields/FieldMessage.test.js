/* global describe, test, expect, jest */
import React from 'react';
import {screen} from '@testing-library/react';
import FieldMessage from './FieldMessage';
import { renderWithProviders} from '../../../test/test-utils';

jest.mock('../../icons/ErrorIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../icons/ErrorIcon'),
  default: () => (
    <div>ErrorIcon</div>
  ),
}));

jest.mock('../../icons/WarningIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../icons/WarningIcon'),
  default: () => (
    <div>WarningIcon</div>
  ),
}));

function initFieldMessage(props = {}) {
  const ui = (
    <FieldMessage
      {...props}
    />
  );

  return renderWithProviders(ui);
}

describe('FieldMessage UI test case', () => {
  test('should show empty dom element when no description, error or warning message given', () => {
    const {utils} = initFieldMessage();

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should not show description when data is invalid', () => {
    const {utils} = initFieldMessage(
      { description: 'Some Description',
        isValid: false}
    );

    expect(utils.container.textContent).toBe('');
  });
  test('should show description when data is valid', () => {
    initFieldMessage(
      { description: 'Some Description',
        isValid: true}
    );

    expect(screen.getByText('Some Description'));
  });
  test('should show description with link when data is valid', () => {
    initFieldMessage(
      { description: 'Some Description <a href="https://docs.celigo.com">Learn more</a>',
        isValid: true}
    );

    expect(screen.getByText('Some Description'));
    expect(screen.getByText(/Learn more/i)).toHaveAttribute('href', 'https://docs.celigo.com');
  });
  test('should not show error message when data is valid', () => {
    initFieldMessage(
      {
        description: 'Some Description',
        isValid: true,
        errorMessages: 'errorMessages',
      }
    );

    expect(screen.getAllByText('Some Description').length).toEqual(2);
  });
  test('should show error message and error icon when data is invalid', () => {
    initFieldMessage(
      {
        isValid: false,
        errorMessages: 'errorMessages',
      }
    );

    expect(screen.getByText('ErrorIcon')).toBeInTheDocument();
    expect(screen.getByText('errorMessages')).toBeInTheDocument();
  });
  test('should show error message and error icon with link when data is invalid', () => {
    initFieldMessage(
      {
        isValid: false,
        errorMessages: 'errorMessages <a href="https://docs.celigo.com">Learn more</a>',
      }
    );

    expect(screen.getByText('ErrorIcon')).toBeInTheDocument();
    expect(screen.getByText('errorMessages')).toBeInTheDocument();
    expect(screen.getByText(/Learn more/i)).toHaveAttribute('href', 'https://docs.celigo.com');
  });
  test('should show warning message when data is invalid', () => {
    initFieldMessage(
      {
        isValid: true,
        warningMessages: 'Warning Messages',
      }
    );

    expect(screen.getByText('Warning Messages')).toBeInTheDocument();
  });
  test('should show warning message and warning icon when data is invalid', () => {
    initFieldMessage(
      {
        isValid: false,
        warningMessages: 'Warning Messages',
      }
    );

    expect(screen.getByText('WarningIcon')).toBeInTheDocument();
    expect(screen.getByText('Warning Messages')).toBeInTheDocument();
  });
  test('should show warning message and warning icon with link when data is invalid', () => {
    initFieldMessage(
      {
        isValid: false,
        warningMessages: 'Warning Messages <a href="https://docs.celigo.com">Learn more</a>',
      }
    );

    expect(screen.getByText('WarningIcon')).toBeInTheDocument();
    expect(screen.getByText('Warning Messages')).toBeInTheDocument();
    expect(screen.getByText(/Learn more/i)).toHaveAttribute('href', 'https://docs.celigo.com');
  });
});
