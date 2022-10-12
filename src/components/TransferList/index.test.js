/* global describe, test, expect, jest */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
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

describe('TransferList test cases', () => {
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
    const allRightButton = screen.getByRole('button', {name: 'move all right'});
    const rightButton = screen.getByRole('button', {name: 'move selected right'});
    const leftButton = screen.getByRole('button', {name: 'move selected left'});
    const allLeftButton = screen.getByRole('button', {name: 'move all left'});

    expect(allRightButton).toBeInTheDocument();
    expect(allLeftButton).toBeInTheDocument();
    expect(rightButton).toBeInTheDocument();
    expect(leftButton).toBeInTheDocument();

    // right
    const value3Input = screen.getByRole('checkbox', {name: 'value_3'});
    const value2Input = screen.queryByText('value_2');

    userEvent.click(value3Input);
    userEvent.click(value2Input); // checking
    userEvent.click(value2Input); // unchecking
    userEvent.click(rightButton);
    expect(setLeft).toBeCalledWith(['value_1', 'value_2']);
    expect(setRight).toBeCalledWith(['value_3', 'value_4', 'value_5']);

    // all right
    userEvent.click(allRightButton);
    expect(setLeft).toBeCalledWith([]);
    expect(setRight).toBeCalledWith(['value_1', 'value_2', 'value_3', 'value_4', 'value_5']);

    // left
    const value4Input = screen.queryByText('value_4');

    userEvent.click(value4Input);
    userEvent.click(leftButton);
    expect(setRight).toBeCalledWith(['value_5']);
    expect(setLeft).toBeCalledWith(['value_1', 'value_2', 'value_3', 'value_4']);

    // all left
    userEvent.click(allLeftButton);
    expect(setRight).toBeCalledWith([]);
    expect(setLeft).toBeCalledWith(['value_1', 'value_2', 'value_3', 'value_4', 'value_5']);
  });
});
