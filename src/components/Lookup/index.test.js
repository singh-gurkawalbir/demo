/* global describe, test, expect, jest, afterEach, beforeEach */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Lookup from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

async function initLookup({ props } = {}) {
  const ui = (
    <MemoryRouter>
      <Lookup {...props} />
    </MemoryRouter>
  );

  const {utils, store} = await renderWithProviders(ui);

  expect(await screen.queryByText(/Manage lookups/i)).toBeInTheDocument();
  expect(screen.queryByText(/Create lookup/i)).toBeInTheDocument();
  expect(screen.queryByText(/Name/i)).toBeInTheDocument();
  expect(screen.queryByText(/Actions/i)).toBeInTheDocument();
  expect(screen.queryByText(/Close/i)).toBeInTheDocument();

  const createLookup = screen.getByRole('button', {name: 'Create lookup'});
  const closeButton = screen.getByRole('button', {name: 'Close'});
  const nameCell = screen.getByRole('columnheader', {name: 'Name'});
  const actionsCell = screen.getByRole('columnheader', {name: 'Actions'});

  expect(createLookup).toBeInTheDocument();
  expect(closeButton).toBeInTheDocument();
  expect(nameCell).toBeInTheDocument();
  expect(actionsCell).toBeInTheDocument();

  return {
    utils,
    store,
    createLookup,
    closeButton,
  };
}

const mockHandleSubmit = jest.fn().mockReturnValue({isEdit: false,
  val: {
    name: 'mockName1',
  },
});

jest.mock('./Manage', () => ({
  __esModule: true,
  ...jest.requireActual('./Manage'),
  default: props => {
    const handleClick = () => {
      const { isEdit, val } = mockHandleSubmit();

      props.onSave(isEdit, val);
    };

    return (
      <>
        <button type="button" onClick={handleClick} data-testid="text_button_1">
          Test Button 1
        </button>
        <button type="button" onClick={props.onCancel} data-testid="text_button_2">
          Test Button 2
        </button>
        <span>
          {props.error}
        </span>
      </>
    );
  },
}));

describe('Lookup component Test cases', () => {
  runServer();

  test('should pass the intial render with default values and null lookups', async () => {
    await initLookup({
      props: {
        lookups: null,
      },
    });

    expect(screen.queryByText(/Lookup type/i)).not.toBeInTheDocument();
  });

  test('should pass the intial render with default values with createLookup', async () => {
    const { createLookup } = await initLookup();

    expect(screen.queryByText(/Lookup type/i)).not.toBeInTheDocument();
    userEvent.click(createLookup);

    expect(await screen.queryByText(/Test Button 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/Test Button 2/i)).toBeInTheDocument();

    expect(screen.queryByText(/Manage lookups/i)).toBeInTheDocument(); // not sure why it displays as heading
    expect(screen.queryByText(/Create lookup/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Actions/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Close/i)).not.toBeInTheDocument();
  });

  test('should pass the intial render with onCancel/onClose', async () => {
    const onCancel = jest.fn();

    const { closeButton } = await initLookup({
      props: {
        onCancel,
      },
    });

    expect(closeButton).toBeInTheDocument();

    userEvent.click(closeButton);

    await expect(onCancel).toBeCalledTimes(1);
  });

  describe('Actions menu test cases', () => {
    let onSave;
    let lookups;

    beforeEach(async () => {
      onSave = jest.fn();
      lookups = [
        {
          name: 'TestLookup1',
        },
      ];
      const { closeButton } = await initLookup({
        props: {
          lookups,
          onSave,
        },
      });

      expect(closeButton).toBeInTheDocument();
      expect(screen.queryByText(/TestLookup1/i)).toBeInTheDocument();
      const ActionButton = screen.getAllByRole('button').find(eachButton => eachButton.hasAttribute('aria-label', 'more')); // getting the first lookup action button

      expect(ActionButton).toBeInTheDocument();

      userEvent.click(ActionButton);

      expect(await screen.queryByText(/Edit lookup/i)).toBeInTheDocument();
      expect(screen.queryByText(/Delete lookup/i)).toBeInTheDocument();
    });

    afterEach(() => {
      onSave.mockClear();
      mockHandleSubmit.mockClear();
    });

    test('should pass the intial render with delete Lookups', async () => {
      const deleteLookup = screen.queryByText(/Delete lookup/i);

      expect(deleteLookup).toBeInTheDocument();

      userEvent.click(deleteLookup);

      expect(onSave).toBeCalledTimes(1);
    });

    describe('handleSubmit test cases', () => {
      let testButton1;

      beforeEach(async () => {
        const editLookup = screen.queryByText(/Edit lookup/i);

        expect(editLookup).toBeInTheDocument();
        userEvent.click(editLookup);

        expect(await screen.queryByText(/Test Button 1/i)).toBeInTheDocument();

        testButton1 = screen.getByRole('button', {name: /Test Button 1/i});

        expect(testButton1).toBeInTheDocument();
      });

      test('should pass the intial render with create Lookups and handleSubmit sucess!', async () => {
        expect(testButton1).toBeInTheDocument();
        userEvent.click(testButton1);
        expect(onSave).toBeCalledTimes(1);
        expect(mockHandleSubmit).toBeCalledTimes(1);
        expect(onSave).toBeCalledWith([{
          name: 'TestLookup1',
        }, {
          name: 'mockName1',
        }]);
      });

      test('should pass the intial render with create Lookups and handleSubmit with same lookup names', async () => {
        mockHandleSubmit.mockReturnValue({isEdit: false,
          val: {
            name: 'TestLookup1',
          },
        });

        userEvent.click(testButton1);
        expect(onSave).toBeCalledTimes(0);
        expect(mockHandleSubmit).toBeCalledTimes(1);
        expect(screen.queryByText(/Lookup with same name is already present!/i)).toBeInTheDocument();
      });

      test('should pass the intial render with edit Lookups and handleSubmit', async () => {
        mockHandleSubmit.mockReturnValue({isEdit: true,
          val: {
            name: 'TestLookup2',
          },
        });

        userEvent.click(testButton1);
        expect(onSave).toBeCalledTimes(1);
        expect(mockHandleSubmit).toBeCalledTimes(1);
        expect(onSave).toBeCalledWith([{
          name: 'TestLookup2',
        }]);
      });
    });
  });
});
