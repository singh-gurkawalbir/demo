/* global describe, test,expect, beforeEach, afterEach, jest */
import React from 'react';
import * as reactRedux from 'react-redux';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders} from '../../../../test/test-utils';
import DataRetentionPeriod from '.';
import { getCreatedStore } from '../../../../store';
import { ConfirmDialogProvider } from '../../../../components/ConfirmDialog';
import actions from '../../../../actions';

const initialStore = getCreatedStore();

async function initDataRetentionPeriod(
  {
    rest = {},
    dataRetentionPeriod,
  } = {}
) {
  initialStore.getState().user.preferences = {
    defaultAShareId: 'own',
    environment: 'production',
    dateFormat: 'DD MMMM, YYYY',
  };
  initialStore.getState().data.accountSettings = {
    dataRetentionPeriod,
  };
  initialStore.getState().user.org = {
    accounts: [{
      _id: 'own',
      accessLevel: 'owner',
      ownerUser: {
        licenses: [{
          type: 'endpoint',
          tier: 'free',
          sandbox: true,
          trialEndDate: '2019-03-09T06:02:00.255Z',
          ...rest,
        }],
      },
    }],
  };
  const ui = (
    <MemoryRouter>
      <ConfirmDialogProvider>
        <DataRetentionPeriod />
      </ConfirmDialogProvider>
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('DataRetentionPeriod component tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    done();
  });
  afterEach(async () => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('Should pass the initial render', async () => {
    const dataRetentionPeriod = 30;
    const rest = {
      maxAllowedDataRetention: 30,
    };

    initDataRetentionPeriod({dataRetentionPeriod, rest});

    screen.debug();
    expect(screen.queryByText(/Data retention period/i)).toBeInTheDocument();
  });
  test('Should show warning message on changing the dataRetentionPeriod', async () => {
    const dataRetentionPeriod = 30;
    const rest = {
      maxAllowedDataRetention: 180,
    };

    initDataRetentionPeriod({dataRetentionPeriod, rest});

    const button = screen.getByRole('button', {name: '30 days'});

    expect(button).toBeInTheDocument();
    userEvent.click(button);

    const sixtyDaysOption = screen.getByRole('option', {name: '60 days'});

    expect(sixtyDaysOption).toBeInTheDocument();
    userEvent.click(sixtyDaysOption);

    expect(screen.getByText(/Learn more about data retention/i)).toBeInTheDocument();
  });
  test('Should test the data retention period save', async () => {
    const dataRetentionPeriod = 30;
    const rest = {
      maxAllowedDataRetention: 180,
    };

    initDataRetentionPeriod({dataRetentionPeriod, rest});

    const button = screen.getByRole('button', {name: '30 days'});

    expect(button).toBeInTheDocument();
    userEvent.click(button);

    const sixtyDaysOption = screen.getByRole('option', {name: '60 days'});

    expect(sixtyDaysOption).toBeInTheDocument();
    userEvent.click(sixtyDaysOption);

    const saveButton = screen.getByRole('button', {name: 'Save'});

    expect(saveButton).toBeInTheDocument();
    userEvent.click(saveButton);

    expect(screen.getByText(/The new retention period of/i)).toBeInTheDocument();
    const confirmSaveButton = screen.getByRole('button', {name: 'Save'});
    const cancelButton = screen.getByRole('button', {name: 'Cancel'});

    expect(confirmSaveButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
    userEvent.click(confirmSaveButton);
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.accountSettings.update({
      dataRetentionPeriod: 60,
    })));
  });
});

