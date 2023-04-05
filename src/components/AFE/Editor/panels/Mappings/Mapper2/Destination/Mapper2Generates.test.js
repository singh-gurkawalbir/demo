import * as React from 'react';
import {screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Mapper2Generates from './Mapper2Generates';
import { renderWithProviders} from '../../../../../../../test/test-utils';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const mockOnBlur = jest.fn();

function initFunction(disabled = false, isRequired = false) {
  const ui = (
    <Mapper2Generates
      id="someId"
      disabled={disabled}
      onBlur={mockOnBlur}
      nodeKey="somenodeKey"
      isRequired={isRequired}
        />
  );

  renderWithProviders(ui);
}

describe('mapper2Generates test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should change the data type Generates field', async () => {
    initFunction();

    await userEvent.type(screen.getByRole('textbox'), 'number');
    await userEvent.click(screen.getByText('string'));
    await userEvent.click(screen.getByRole('button', {name: 'number'}));
    expect(mockOnBlur).toHaveBeenCalledWith('number');
  });
  test('should show the textbox as disabled', () => {
    initFunction(true);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
  test('should press the escape button and textbox should be blurred', async () => {
    initFunction();

    await userEvent.type(screen.getByRole('textbox'), 'number');
    await userEvent.keyboard('{Escape}');
    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });
  test('should click outside the textbox and the textbox should be blurred', async () => {
    initFunction();

    await userEvent.type(screen.getByRole('textbox'), 'number');
    fireEvent.click(document);
    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });
  test('should should the Lock Icon when the field is mandatory', async () => {
    initFunction(false, true);
    const lockIcon = document.querySelectorAll('[class*=lockIcon]')[0];

    expect(lockIcon).toBeInTheDocument();
    await userEvent.hover(lockIcon);
    const tooltipText = document.querySelector('[aria-label="This field is required by the application you are importing into"]');

    expect(tooltipText).toBeInTheDocument();
  });
});
