import { screen } from '@testing-library/react';
import React from 'react';
import ShopifyLandingPage from '.';
import { getCreatedStore } from '../../../store';
import { KBDocumentation } from '../../../utils/connections';
import * as ApplicationList from '../../../constants/applications';
import { renderWithProviders } from '../../../test/test-utils';

let initialStore;

function initShopifyLandingPage({accountData}) {
  initialStore.getState().user.org.accounts = accountData;
  const ui = (
    <ShopifyLandingPage />
  );

  return renderWithProviders(ui);
}

// Mocking generateNewId as part of unit testing
jest.mock('../../../utils/resource', () => ({
  __esModule: true,
  ...jest.requireActual('../../../utils/resource'),
  generateNewId: () => 'someGeneratedId',
}));

// Mocking KBDocumentation as part of unit testing
jest.mock('../../../utils/connections', () => ({
  __esModule: true,
  ...jest.requireActual('../../../utils/connections'),
  KBDocumentation: {
    shopify: '/testHelpURL',
  },
}));

// Mocking ShopifyLandingPageHeader as part of unit testing
jest.mock('./PageHeader', () => ({
  __esModule: true,
  ...jest.requireActual('./PageHeader'),
  default: () => <div>Mocking ShopifyLandingPageHeader</div>,
}));

// Mocking AddOrSelectForm as part of unit testing
jest.mock('./Form', () => ({
  __esModule: true,
  ...jest.requireActual('./Form'),
  default: props => (
    <>
      <div>resourceId = {props.resourceId}</div>
      <div>selectedAccountHasSandbox = {props.selectedAccountHasSandbox}</div>
      <div>helpURL = {props.helpURL}</div>
    </>
  ),
}));

describe('Testsuite for Shopify Landing Page', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  test('should test the Shopify Landing Page when there is a help url and no KB Documentation', () => {
    KBDocumentation.shopify = undefined;

    // SpyOn Application List and return mock application details
    jest.spyOn(ApplicationList, 'applicationsList').mockReturnValueOnce(
      [
        {
          id: 'shopify',
          assistant: 'shopify',
          helpURL: '/testUrl',
        },
      ]
    );
    initShopifyLandingPage(
      {
        accountData: [
          {
            _id: 'own',
            accessLevel: 'owner',
            ownerUser: {
              licenses: [
                {
                  _id: 'license_id',
                  sandbox: true,
                },
              ],
            },
          },
        ],
      }
    );
    expect(screen.getByText(/mocking shopifylandingpageheader/i)).toBeInTheDocument();
    expect(screen.getByText(/resourceid = somegeneratedid/i)).toBeInTheDocument();
    expect(screen.getByText(/selectedaccounthassandbox =/i)).toBeInTheDocument();
    expect(screen.getByText(/helpurl = \/testurl/i)).toBeInTheDocument();
  });
  test('should test the Shopify Landing Page when there is KB Documentation and no help url', () => {
    KBDocumentation.shopify = '/test/kbShopify';
    jest.spyOn(ApplicationList, 'applicationsList').mockReturnValueOnce(
      [
        {
          id: 'shopify',
          assistant: 'shopify',
        },
      ]
    );
    initShopifyLandingPage(
      {
        accountData: [
          {
            _id: 'own',
            accessLevel: 'owner',
            ownerUser: {
              licenses: [
                {
                  _id: 'license_id',
                  sandbox: true,
                },
              ],
            },
          },
        ],
      }
    );
    expect(screen.getByText(/mocking shopifylandingpageheader/i)).toBeInTheDocument();
    expect(screen.getByText(/resourceid = somegeneratedid/i)).toBeInTheDocument();
    expect(screen.getByText(/selectedaccounthassandbox =/i)).toBeInTheDocument();
    expect(screen.getByText(/helpurl = \/test\/kbshopify/i)).toBeInTheDocument();
  });
});
