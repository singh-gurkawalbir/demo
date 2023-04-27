
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransferList from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

async function initTransferList({
  props = {},
} = {}) {
  const ui = (
    <MemoryRouter>
      <TransferList {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('transferList test cases', () => {
  runServer();
  test('should pass the initial render with default values', async () => {
    await initTransferList({});
    expect(screen.queryByText('<')).toBeInTheDocument();
    expect(screen.queryByText('>')).toBeInTheDocument();
    expect(screen.queryByText('≫')).toBeInTheDocument();
    expect(screen.queryByText('≪')).toBeInTheDocument();
  });

  test('should pass the initial render with custom values', async () => {
    const setLeft = jest.fn();
    const setRight = jest.fn();

    await initTransferList({
      props: {
        left: [
          'value_1',
          'value_2',
          'value_3',
        ],
        right: [
          'value_4',
          'value_5',
        ],
        setLeft,
        setRight,
        subHeaderMap: {
          value_2: 'Required',
          value_1: 'Optional',
          value_3: 'Custom',
          value_4: 'Optional',
          value_5: 'Optional',
        },
        scopesOrig: [
          'value_1',
          'value_2',
          'value_3',
          'value_4',
          'value_5',
        ],
      },
    });

    let rightButton;
    let leftButton;
    let allLeftButton;
    let allRightButton;

    waitFor(() => {
      allRightButton = screen.getByRole('button', {name: 'move all right'});
      rightButton = screen.getByRole('button', {name: 'move selected right'});
      leftButton = screen.getByRole('button', {name: 'move selected left'});
      allLeftButton = screen.getByRole('button', {name: 'move all left'});
      expect(allRightButton).toBeInTheDocument();
      expect(allLeftButton).toBeInTheDocument();
      expect(rightButton).toBeInTheDocument();
      expect(leftButton).toBeInTheDocument();
    });

    // right
    waitFor(async () => {
      const value3Input = screen.getByRole('checkbox', {name: 'value_3'});
      const value2Input = screen.queryByText('value_2');

      await userEvent.click(value3Input);
      await userEvent.click(value2Input); // checking
      await userEvent.click(value2Input); // unchecking
      await userEvent.click(rightButton);
      expect(setLeft).toHaveBeenCalledWith(['value_1', 'value_2']);
      expect(setRight).toHaveBeenCalledWith(['value_3', 'value_4', 'value_5']);
    });

    // all right
    waitFor(async () => {
      await userEvent.click(allRightButton);
      expect(setLeft).toHaveBeenCalledWith([]);
      expect(setRight).toHaveBeenCalledWith(['value_1', 'value_2', 'value_3', 'value_4', 'value_5']);
    });

    // left
    waitFor(async () => {
      const value4Input = screen.queryByText('value_4');

      await userEvent.click(value4Input);
      await userEvent.click(leftButton);
      expect(setRight).toHaveBeenCalledWith(['value_5']);
      expect(setLeft).toHaveBeenCalledWith(['value_1', 'value_2', 'value_3', 'value_4']);

      // all left
      await userEvent.click(allLeftButton);
      expect(setRight).toHaveBeenCalledWith([]);
      expect(setLeft).toHaveBeenCalledWith(['value_1', 'value_2', 'value_3', 'value_4', 'value_5']);
    });
  });
});
