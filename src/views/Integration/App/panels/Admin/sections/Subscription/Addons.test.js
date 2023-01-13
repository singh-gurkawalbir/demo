
import React from 'react';
import {screen} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {renderWithProviders} from '../../../../../../../test/test-utils';
import AddOns from './Addons';
import { getCreatedStore } from '../../../../../../../store';
import { ConfirmDialogProvider } from '../../../../../../../components/ConfirmDialog';

function initAddons(props = {}) {
  const initialStore = getCreatedStore();

  initialStore.getState().data.resources.integrations = [{
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
  initialStore.getState().session = {integrationApps: {settings: {'61604a5a8364267b8a378084-addOns': {
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
      addOnLicenses: props.enableAddons ? [{id: 'transferOrder'}] : [],
    },
  }}}};
  initialStore.getState().user.org.accounts = [{accessLevel: 'administrator',
    _id: 'own',
    ownerUser: {licenses: [{
      _id: '5a6ec1bae9aaa11c9bc86106',
      created: '2018-01-29T06:39:54.268Z',
      lastModified: '2022-06-27T07:52:09.014Z',
      expires: '2023-05-05T00:00:00.000Z',
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
  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/integrations/61604a5a8364267b8a378084/admin/sections/Order_MFN_/subscription'}]}>
      <Route path="/integrations/61604a5a8364267b8a378084/admin/sections/Order_MFN_/subscription">
        <ConfirmDialogProvider>
          <AddOns {...props} />
        </ConfirmDialogProvider>
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Addons UI tests', () => {
  test('should pass the initial render when no Addons are present', async () => {
    await initAddons({integrationId: '61604a5a8364267b8a378084'});
    expect(screen.getByText('Add-ons')).toBeInTheDocument();
    expect(screen.getByText('You don’t have any add-ons yet. Add-ons let you customize subscription to meet your specific business requirements.')).toBeInTheDocument();
    expect(screen.getByText('Get add-ons')).toBeInTheDocument();
  });
  test('should pass the initial render when Addons are present', async () => {
    await initAddons({integrationId: '61604a5a8364267b8a378084', enableAddons: true});
    expect(screen.getByText('Add-ons')).toBeInTheDocument();
    expect(screen.getByText('Add-ons let you customize your subscription to meet your specific business requirements. They will expire when your Integration App subscription expires.')).toBeInTheDocument();
    expect(screen.getByText('Transfer Order - InboundShipments')).toBeInTheDocument();
  });
});
