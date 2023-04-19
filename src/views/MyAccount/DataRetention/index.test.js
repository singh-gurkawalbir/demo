
import React from 'react';
import * as reactRedux from 'react-redux';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders} from '../../../test/test-utils';
import DataRetention from '.';
import { getCreatedStore } from '../../../store';
import { ConfirmDialogProvider } from '../../../components/ConfirmDialog';
import actions from '../../../actions';

const initialStore = getCreatedStore();

async function initDataRetentionPeriod(
  {
    rest = {},
    dataRetentionPeriod,
  } = {}
) {
  mutateStore(initialStore, draft => {
    draft.user.preferences = {
      defaultAShareId: 'own',
      environment: 'production',
      dateFormat: 'DD MMMM, YYYY',
    };
    draft.data.accountSettings = {
      dataRetentionPeriod,
      status: {
        accountSettings: 'received',
      },
    };
    draft.user.org = {
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
  });
  const ui = (
    <MemoryRouter>
      <ConfirmDialogProvider>
        <DataRetention />
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
    expect(screen.queryByText('Data retention')).toBeInTheDocument();
  });
  test('Should show request upgrade button if maxAllowedDataRetention is less than MAX_DATA_RETENTION_PERIOD', async () => {
    const dataRetentionPeriod = 30;
    const rest = {
      maxAllowedDataRetention: 90,
    };

    initDataRetentionPeriod({dataRetentionPeriod, rest});
    const button = screen.getByRole('button', {name: 'Request upgrade'});

    expect(button).toBeInTheDocument();
    await userEvent.click(button);

    expect(screen.getByText(/We will contact you to discuss your business needs and recommend an ideal subscription plan./i)).toBeInTheDocument();
    const confirmSubmitButton = screen.getByRole('button', {name: 'Submit request'});
    const cancelButton = screen.getByRole('button', {name: 'Cancel'});

    expect(confirmSubmitButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
    await userEvent.click(confirmSubmitButton);
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.license.requestUpdate('upgrade', {feature: 'dataRetention'})));
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.license.dataRetentionLicenseUpgradeRequested()));
  });
  test('Should test the data retention period field', async () => {
    const dataRetentionPeriod = 30;
    const rest = {
      maxAllowedDataRetention: 180,
    };

    initDataRetentionPeriod({dataRetentionPeriod, rest});

    const button = screen.getByRole('button', {name: '30 days'});

    expect(button).toBeInTheDocument();
    await userEvent.click(button);

    const sixtyDaysOption = screen.getByRole('option', {name: '60 days'});

    expect(sixtyDaysOption).toBeInTheDocument();
    await userEvent.click(sixtyDaysOption);

    expect(screen.getByText('Learn more about data retention')).toBeInTheDocument();
  });
});

