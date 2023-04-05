
import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import {MemoryRouter, Route} from 'react-router-dom';
import moment from 'moment';
import {mutateStore, renderWithProviders} from '../../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../../store';
import SubscriptionSection from './index';
import { ConfirmDialogProvider } from '../../../../../../../components/ConfirmDialog';
import actions from '../../../../../../../actions';

const futureDate = moment().add(1, 'years').toISOString();

async function initSubscriptionSection(props = {}) {
  const initialStore = getCreatedStore();

  mutateStore(initialStore, draft => {
    draft.data.resources.integrations = [{
      _id: '61604a5a8364267b8a378084',
      version: '1.27.3',
      name: 'Amazon - NetSuite Connector',
      _connectorId: '58777a2b1008fb325e6c0953',
      initChild: {
        function: props.childSupport,
      },
      settings: {
        connectorEdition: 'starter',
        supportsMultiStore: true,
      }}];
    draft.session = {integrationApps: {settings: {'61604a5a8364267b8a378084-addOns': {
      status: 'received',
      addOns: {
        addOnMetaData: [
          {
            id: 'fbaInventoryAdjustment',
            name: 'FBA Inventory Adjustments',
            description: 'Manage your sellable and damaged inventory items. Track your inventory levels in NetSuite and minimize the chances of you underselling or overselling on Amazon and non-Amazon sales channels.',
            installerFunction: 'installAddOn',
            uninstallerFunction: 'uninstallAddOn',
          },
          {
            id: 'transferOrder',
            name: 'Transfer Order - InboundShipments',
            installedOn: '2018-01-29T06:39:54.268Z',
            description: 'Manage the Amazon inbound shipments, inbound shipment plans, and item receipts. This add-on sends a shipment of items from NetSuite to the Amazon FBA Warehouse and tracks back the shipment delivery status in NetSuite.',
            installerFunction: 'installAddOn',
            uninstallerFunction: 'uninstallAddOn',
          },
        ],
        addOnLicenses: [{id: 'transferOrder'}],
      },
    }}}};
    draft.user.org.accounts = [{accessLevel: 'administrator',
      _id: 'own',
      ownerUser: {licenses: [{
        _id: '5a6ec1bae9aaa11c9bc86106',
        created: '2018-01-29T06:39:54.268Z',
        lastModified: '2022-06-27T07:52:09.014Z',
        expires: futureDate,
        type: 'connector',
        _connectorId: '58777a2b1008fb325e6c0953',
        opts: {
          connectorEdition: props.edition ? 'premium' : 'starter',
          addonLicenses: [
            {
              type: 'store',
              licenses: [
                {
                  addOnEdition: 'premium',
                },
                {
                  addOnEdition: 'premium',
                },
              ],
            },
          ],
        },
        upgradeText: 'Request upgrade',
        _integrationId: '61604a5a8364267b8a378084',
        resumable: false,
      }]}}];
  });

  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/integrations/61604a5a8364267b8a378084/admin/sections/Order_MFN_/subscription'}]}>
      <Route path="/integrations/61604a5a8364267b8a378084/admin/sections/Order_MFN_/subscription">
        <ConfirmDialogProvider>
          <SubscriptionSection {...props} />
        </ConfirmDialogProvider>
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
describe('Subscription Section UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
  });
  test('should pass the initial render', async () => {
    await initSubscriptionSection({integrationId: '61604a5a8364267b8a378084'});
    expect(screen.getByText('Starter plan')).toBeInTheDocument();
    expect(screen.getByText('Version 1.27.3')).toBeInTheDocument();
    expect(screen.getByText('Integration ID 61604a5a8364267b8a378084')).toBeInTheDocument();
    expect(screen.getByText('Started on Jan 29th, 2018')).toBeInTheDocument();
    expect(screen.getByText(`Expires on ${moment(futureDate).format('MMM Do, YYYY')}`)).toBeInTheDocument();
    expect(screen.getByText('Your subscription gives you access to install and run one instance (tile) of this Integration App. Contact your Account Manager for more info.')).toBeInTheDocument();
    expect(screen.getByText('Add-ons')).toBeInTheDocument();
    expect(screen.getByText('Add-ons let you customize your subscription to meet your specific business requirements. They will expire when your Integration App subscription expires.')).toBeInTheDocument();
    expect(screen.getByText('Transfer Order - InboundShipments')).toBeInTheDocument();
  });
  test('should display the confirm dialogue box when clicked on request upgrade button', async () => {
    await initSubscriptionSection({integrationId: '61604a5a8364267b8a378084'});
    userEvent.click(screen.getByText('Request upgrade'));
    expect(screen.getByText('We will contact you to discuss your business needs and recommend an ideal subscription plan.')).toBeInTheDocument();
    expect(screen.getByText('Submit request')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
  test('should make the respective dispatch call when clicked on "Submit request" in the dialog box', async () => {
    await initSubscriptionSection({integrationId: '61604a5a8364267b8a378084', edition: false});
    userEvent.click(screen.getByText('Request upgrade'));
    userEvent.click(screen.getByText('Submit request'));
    expect(mockDispatchFn).toBeCalledWith(actions.integrationApp.settings.requestUpgrade('61604a5a8364267b8a378084', {
      licenseId: '5a6ec1bae9aaa11c9bc86106',
    }));
  });
  test('should make the respective dispatch call when connectorEdition is of lower precedence than license edition', async () => {
    const license = {
      _id: '5a6ec1bae9aaa11c9bc86106',
      created: '2018-01-29T06:39:54.268Z',
      lastModified: '2022-06-27T07:52:09.014Z',
      expires: futureDate,
      nextPlan: '',
      isHighestPlan: false,
      type: 'connector',
      _connectorId: '58777a2b1008fb325e6c0953',
      opts: { connectorEdition: 'premium',
        addonLicenses: [
          {
            type: 'store',
            licenses: [
              {
                addOnEdition: 'premium',
              },
              {
                addOnEdition: 'premium',
              },
            ],
          },
        ] },
      upgradeText: 'Upgrade',
      _integrationId: '61604a5a8364267b8a378084',
      resumable: false,
      expiresText: `Expires on ${moment(futureDate).format('MMM Do, YYYY')}`,
      upgradeRequested: false,
      createdText: 'Started on Jan 29th, 2018',
      showLicenseExpiringWarning: false,
    };

    await initSubscriptionSection({integrationId: '61604a5a8364267b8a378084', edition: true});
    userEvent.click(screen.getByText('Upgrade'));
    expect(mockDispatchFn).toBeCalledWith(actions.integrationApp.settings.upgrade('61604a5a8364267b8a378084', license));
  });
});
