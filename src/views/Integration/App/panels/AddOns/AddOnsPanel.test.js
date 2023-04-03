
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders} from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';
import { ConfirmDialogProvider } from '../../../../../components/ConfirmDialog';
import AddOnsPanel from './index';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('AddOnsPanel UI tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  function initialStoreAndRender(settings) {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.integrations = [{
        _id: '5ff579d745ceef7dcd797c15',
        lastModified: '2021-01-19T06:34:17.222Z',
        name: " AFE 2.0 refactoring for DB's",
        install: [],
        sandbox: false,
        _registeredConnectionIds: [
          '5cd51efd3607fe7d8eda9c97',
          '5ff57a8345ceef7dcd797c21',
        ],
        installSteps: [],
        uninstallSteps: [],
        flowGroupings: [],
        createdAt: '2021-01-06T08:50:31.935Z',
      }];
      draft.session.integrationApps.settings['5ff579d745ceef7dcd797c15-addOns'] = settings;
      draft.user.preferences = {defaultAShareId: '5e27eb7fe2f22b579b581228'};
      draft.user.org.accounts = [{_id: '5e27eb7fe2f22b579b581228',
        ownerUser: {licenses: [
          {_id: 'someLicenseId', _integrationId: '5ff579d745ceef7dcd797c15'},
        ]},
      }];
    });

    renderWithProviders(
      <ConfirmDialogProvider><MemoryRouter><AddOnsPanel integrationId="5ff579d745ceef7dcd797c15" /></MemoryRouter></ConfirmDialogProvider>,
      {initialStore});
  }
  test('should click on Submit request button', () => {
    initialStoreAndRender(
      {
        addOns: {addOnMetaData: [{id: 'someid', name: 'someName', description: 'someDescription'}]},
      }
    );
    expect(screen.getByText('someName')).toBeInTheDocument();
    expect(screen.getByText('someDescription')).toBeInTheDocument();
    userEvent.click(screen.getByText('Request add-on'));
    expect(screen.getByText('We will contact you to discuss your add-on request.')).toBeInTheDocument();
    const submitButton = screen.getByText('Submit request');

    userEvent.click(submitButton);
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'INTEGRATION_APPS_SETTINGS_REQUEST_UPGRADE',
        integrationId: '5ff579d745ceef7dcd797c15',
        options: { addOnName: 'someName', licenseId: 'someLicenseId' },
      }
    );
    expect(screen.getByText(/Check out our Marketplace/)).toBeInTheDocument();
  });
  test('should click on cancel button', () => {
    initialStoreAndRender(
      {
        addOns: {addOnMetaData: [{id: 'someid', name: 'someName', description: 'description'}]},
      }
    );
    userEvent.click(screen.getByText('Request add-on'));
    expect(screen.getByText('We will contact you to discuss your add-on request.')).toBeInTheDocument();
    const cancel = screen.getByText('Cancel');

    userEvent.click(cancel);
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });
  test('should test AddoninstallerButton', () => {
    initialStoreAndRender(
      {
        addOns: {addOnMetaData: [{id: 'someid', name: 'someName', description: <div>Html description</div>, status: 'available'}],
          addOnLicenses: [{id: 'someid', name: 'someName', description: <div>description</div>, status: 'available'}]},
      }
    );
    userEvent.click(screen.getByText('Install'));
    expect(screen.getByText('Installing someName add-on...')).toBeInTheDocument();
  });
  test('should test when no license is provided', () => {
    const {utils} = renderWithProviders(<ConfirmDialogProvider><MemoryRouter><AddOnsPanel /></MemoryRouter></ConfirmDialogProvider>);

    expect(utils.container.textContent).toBe('Add-ons');
  });
});
