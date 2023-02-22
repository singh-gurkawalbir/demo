
import React from 'react';
import { screen, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Switch, useParams } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { isEmpty } from 'lodash';
import { act } from 'react-dom/test-utils';
import { mockGetRequestOnce, mockPostRequestOnce, renderWithProviders} from '../../../test/test-utils';
import GlobalSearch from '.';
import actions from '../../../actions';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';
import { runServer } from '../../../test/api/server';
import getRoutePath from '../../../utils/routePaths';

async function initGlobalSearch(ui = (<MemoryRouter><GlobalSearch /></MemoryRouter>)) {
  const { store, utils } = renderWithProviders(ui);

  mockGetRequestOnce('/api/mfa/sessionInfo', {});
  act(() => { store.dispatch(actions.user.preferences.request()); });
  act(() => { store.dispatch(actions.user.profile.request()); });
  act(() => { store.dispatch(actions.mfa.receivedSessionInfo()); });

  await waitFor(() => expect(isEmpty(store?.getState()?.user?.profile)).not.toBe(true));
  await waitFor(() => expect(isEmpty(store?.getState()?.user?.preferences)).not.toBe(true));
  await waitFor(() => expect(isEmpty(store?.getState()?.session?.mfa?.sessionInfo)).not.toBe(true));
  await waitFor(() => expect(screen.queryByLabelText(/Global search/i)).toBeInTheDocument());

  return {store, utils};
}
describe('Globalsearch feature tests', () => {
  // Run this server so that API will be up and running for Integration tests
  runServer();
  test('Should display filters allowed for Administer account', async () => {
    await initGlobalSearch();
    await userEvent.click(screen.queryByLabelText(/Global search/i));

    expect(screen.queryByLabelText(/Global search/i)).not.toBeInTheDocument();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    expect(searchInput).toBeInTheDocument();
    const resourceFiltersButton = screen.getByText('All');

    expect(resourceFiltersButton).toBeInTheDocument();

    await userEvent.click(resourceFiltersButton);

    await waitFor(() => {
      expect(screen.queryByText(/Resources/i)).toBeInTheDocument();
      expect(screen.queryByText(/Marketplace/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/All/i)).toBeChecked();
      expect(screen.queryByLabelText(/Integrations/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/Flows/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/Connections/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/Scripts/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/Agents/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/Stacks/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/My APIs/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/API Tokens/i)).toBeInTheDocument();
      const templates = screen.queryAllByLabelText(/^Templates/i);

      templates?.forEach(template => expect(template).toBeInTheDocument());
      const IAs = screen.queryAllByLabelText(/Integration apps/i);

      IAs?.forEach(app => expect(app).toBeInTheDocument());
      expect(screen.queryByLabelText(/Recycle Bin/i)).toBeInTheDocument();
    });
  });
  test('Should display filters allowed for Monitor account', async () => {
    cleanup();
    mockGetRequestOnce('/api/preferences', {
      environment: 'production',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: 'h:mm:ss a',
      scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
      showReactSneakPeekFromDate: '2019-11-05',
      showReactBetaFromDate: '2019-12-26',
      defaultAShareId: '6195e21a9bfbdd12c575c649',
      accounts: {
        '61548be61cff9b1f5bd5b01a': {
          drawerOpened: true,
          fbBottomDrawerHeight: 442,
        },
        '6154934ec391b30a44d6da33': {
          drawerOpened: true,
        },
        '6192353f75f94b333a5638cc': {
          drawerOpened: true,
          expand: 'Resources',
        },
        '6195dce97811ca183c46318c': {
          drawerOpened: true,
          expand: 'Tools',
        },
        '6128775375f8917a64ddefa8': {
          expand: 'Resources',
          drawerOpened: true,
        },
        '6195e21a9bfbdd12c575c649': {
          drawerOpened: true,
          expand: 'Resources',
        },
      },
    });
    mockGetRequestOnce('/api/shared/ashares', [
      {
        _id: '6195e21a9bfbdd12c575c649',
        accepted: true,
        accessLevel: 'monitor',
        integrationAccessLevel: [],
        ownerUser: {
          _id: '5ca5c855ec5c172792285f53',
          email: 'aasa@gmail.com',
          name: 'sai kaivalya',
          company: 'Amazon Central',
          timezone: 'Asia/Calcutta',
          useErrMgtTwoDotZero: false,
          allowedToPublish: true,
          licenses: [
            {
              _id: '5ca5c856ec5c172792285f54',
              created: '2019-04-04T09:03:18.211Z',
              lastModified: '2019-04-04T09:06:54.579Z',
              expires: '2022-05-04T09:06:54.578Z',
              type: 'integrator',
              tier: 'premium',
              numAddOnFlows: 1400,
              trialEndDate: '2019-05-04T09:06:54.578Z',
              supportTier: 'essential',
              numSandboxAddOnFlows: 500,
              resumable: false,
            },
            {
              _id: '61baae033f236054eee504bd',
              created: '2021-12-16T03:09:55.371Z',
              lastModified: '2022-01-15T03:57:21.820Z',
              type: 'connector',
              _connectorId: '5d1ef1765f96fa1577cf251f',
              opts: {
                addonLicenses: [
                  {
                    licenses: [
                      {
                        addOnEdition: 'premium',
                      },
                      {
                        addOnEdition: 'premium',
                      },
                      {
                        addOnEdition: 'premium',
                      },
                    ],
                    type: 'store',
                  },
                  {
                    type: 'addon',
                    licenses: [
                      {
                        addOnId: 'transferOrder',
                      },
                      {
                        addOnId: 'transferOrder',
                      },
                      {
                        addOnId: 'fbaInventoryAdjustment',
                      },
                    ],
                  },
                ],
                connectorEdition: 'premium',
              },
              _integrationId: '61baae033f236054eee504c3',
              sandbox: false,
              resumable: false,
              trialEndDate: '2022-01-15T03:09:55.368Z',
            },
          ],
        },
      },
    ]);
    const {store} = await initGlobalSearch();

    act(() => { store.dispatch(actions.user.org.accounts.requestCollection()); });
    await waitFor(() => expect(store?.getState()?.user?.org?.accounts?.length).toBeGreaterThan(0));

    await userEvent.click(screen.queryByLabelText(/Global search/i));
    const resourceFiltersButton = screen.getByText('All');

    expect(resourceFiltersButton).toBeInTheDocument();

    await userEvent.click(resourceFiltersButton);

    await waitFor(() => {
      expect(screen.queryByText(/Resources/i)).toBeInTheDocument();
      expect(screen.queryByText(/Marketplace/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/All/i)).toBeChecked();
      expect(screen.queryByLabelText(/Integrations/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/Flows/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/^Integration apps/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/^Templates/i)).toBeInTheDocument();

      expect(screen.queryByLabelText(/Connections/i)).toBeNull();
      expect(screen.queryByLabelText(/Scripts/i)).toBeNull();
      expect(screen.queryByLabelText(/Agents/i)).toBeNull();
      expect(screen.queryByLabelText(/Stacks/i)).toBeNull();
      expect(screen.queryByLabelText(/My APIs/i)).toBeNull();
      expect(screen.queryByLabelText(/API Tokens/i)).toBeNull();
      const templates = screen.queryAllByLabelText(/^Templates/i);

      expect(templates?.length).toBe(1);
      const IAs = screen.queryAllByLabelText(/Integration apps/i);

      expect(IAs).toHaveLength(1);
    });
  });
  test('Should display filters allowed for Manager account', async () => {
    mockGetRequestOnce('/api/preferences', {
      environment: 'production',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: 'h:mm:ss a',
      scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
      showReactSneakPeekFromDate: '2019-11-05',
      showReactBetaFromDate: '2019-12-26',
      defaultAShareId: '6195e21a9bfbdd12c575c649',
      accounts: {
        '61548be61cff9b1f5bd5b01a': {
          drawerOpened: true,
          fbBottomDrawerHeight: 442,
        },
        '6154934ec391b30a44d6da33': {
          drawerOpened: true,
        },
        '6192353f75f94b333a5638cc': {
          drawerOpened: true,
          expand: 'Resources',
        },
        '6195dce97811ca183c46318c': {
          drawerOpened: true,
          expand: 'Tools',
        },
        '6128775375f8917a64ddefa8': {
          expand: 'Resources',
          drawerOpened: true,
        },
        '6195e21a9bfbdd12c575c649': {
          drawerOpened: true,
          expand: 'Resources',
        },
      },
    });
    mockGetRequestOnce('/api/shared/ashares', [
      {
        _id: '6195e21a9bfbdd12c575c649',
        accepted: true,
        accessLevel: 'manage',
        integrationAccessLevel: [],
        ownerUser: {
          _id: '5ca5c855ec5c172792285f53',
          email: 'asc@gmail.com',
          name: 'sai kaivalya',
          company: 'Amazon Central',
          timezone: 'Asia/Calcutta',
          useErrMgtTwoDotZero: false,
          allowedToPublish: true,
          licenses: [
            {
              _id: '5ca5c856ec5c172792285f54',
              created: '2019-04-04T09:03:18.211Z',
              lastModified: '2019-04-04T09:06:54.579Z',
              expires: '2022-05-04T09:06:54.578Z',
              type: 'integrator',
              tier: 'premium',
              numAddOnFlows: 1400,
              trialEndDate: '2019-05-04T09:06:54.578Z',
              supportTier: 'essential',
              numSandboxAddOnFlows: 500,
              resumable: false,
            },
            {
              _id: '61baae033f236054eee504bd',
              created: '2021-12-16T03:09:55.371Z',
              lastModified: '2022-01-15T03:57:21.820Z',
              type: 'connector',
              _connectorId: '5d1ef1765f96fa1577cf251f',
              opts: {
                addonLicenses: [
                  {
                    licenses: [
                      {
                        addOnEdition: 'premium',
                      },
                      {
                        addOnEdition: 'premium',
                      },
                      {
                        addOnEdition: 'premium',
                      },
                    ],
                    type: 'store',
                  },
                  {
                    type: 'addon',
                    licenses: [
                      {
                        addOnId: 'transferOrder',
                      },
                      {
                        addOnId: 'transferOrder',
                      },
                      {
                        addOnId: 'fbaInventoryAdjustment',
                      },
                    ],
                  },
                ],
                connectorEdition: 'premium',
              },
              _integrationId: '61baae033f236054eee504c3',
              sandbox: false,
              resumable: false,
              trialEndDate: '2022-01-15T03:09:55.368Z',
            },
          ],
        },
      },
    ]);
    const {store} = await initGlobalSearch();

    act(() => { store.dispatch(actions.user.org.accounts.requestCollection()); });
    await waitFor(() => expect(store?.getState()?.user?.org?.accounts?.length).toBeGreaterThan(0));
    await userEvent.click(screen.queryByLabelText(/Global search/i));
    const resourceFiltersButton = screen.getByText('All');

    expect(resourceFiltersButton).toBeInTheDocument();

    await userEvent.click(resourceFiltersButton);

    await waitFor(() => {
      expect(screen.queryByText(/Resources/i)).toBeInTheDocument();
      expect(screen.queryByText(/Marketplace/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/All/i)).toBeChecked();
      expect(screen.queryByLabelText(/Integrations/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/Flows/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/Connections/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/Agents/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/Recycle Bin/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/^Integration apps/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/^Templates/i)).toBeInTheDocument();
    });
  });
  test('Should display results containing the characters typed in both Resources and Marketplace Results', async () => {
    await initGlobalSearch();
    await userEvent.click(screen.queryByLabelText(/Global search/i));
    expect(screen.queryByLabelText(/Global search/i)).not.toBeInTheDocument();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    userEvent.type(searchInput, 'acumatica');
    await waitFor(() => {
      expect(screen.queryByLabelText(/Global search results/i)).toBeInTheDocument();
    });
    const marketplaceTab = screen.queryByText(/Marketplace: Apps & templates \(1\)/i);
    const resourcesTab = screen.queryByText(/Resources \(4\)/i);

    expect(marketplaceTab).toBeInTheDocument();
    expect(resourcesTab).toBeInTheDocument();
    expect(screen.queryByText('Acumatica Agent HTTP')).toBeInTheDocument();
    expect(screen.queryByText('ACUMATICA')).toBeInTheDocument();
    expect(screen.queryByText('Acumatica - Location Import')).toBeInTheDocument();
    expect(screen.queryByText('Acumatica-Location Import')).toBeInTheDocument();
    expect(screen.queryByText('Checkout 1 result in Marketplace')).toBeInTheDocument();
    await userEvent.click(screen.queryByText('Checkout 1 result in Marketplace'));
    expect(screen.queryByText('ADP Workforce Now (API) - Acumatica')).toBeInTheDocument();
  });
  test('Should display results containing the characters typed in Resources Tab only', async () => {
    await initGlobalSearch();
    await userEvent.click(screen.queryByLabelText(/Global search/i));
    expect(screen.queryByLabelText(/Global search/i)).not.toBeInTheDocument();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    userEvent.type(searchInput, 'as');
    await waitFor(() => {
      expect(screen.queryByLabelText(/Global search results/i)).toBeInTheDocument();
    });
    const marketplaceTab = screen.queryByText(/Marketplace: Apps & templates \(0\)/i);
    const resourcesTab = screen.queryByText(/Resources \(3\)/i);

    expect(marketplaceTab).toBeInTheDocument();
    expect(resourcesTab).toBeInTheDocument();
    expect(screen.queryByText(/Checkout/i)).toBeNull();
    expect(screen.queryByText('4cast plus')).toBeInTheDocument();
    expect(screen.queryByText('AS2')).toBeInTheDocument();
    expect(screen.queryByText('Base64 Encode')).toBeInTheDocument();
    await userEvent.click(marketplaceTab);
    expect(screen.queryByText(/Your search didn’t return any matching results. Try expanding your search criteria/i)).toBeInTheDocument();
  });
  test('Should display results containing the characters in Marketplace Tab only', async () => {
    await initGlobalSearch();
    await userEvent.click(screen.queryByLabelText(/Global search/i));
    expect(screen.queryByLabelText(/Global search/i)).not.toBeInTheDocument();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    userEvent.type(searchInput, 'am');
    await waitFor(() => {
      expect(screen.queryByLabelText(/Global search results/i)).toBeInTheDocument();
    });
    const marketplaceTab = screen.queryByText(/Marketplace: Apps & templates \(1\)/i);
    const resourcesTab = screen.queryByText(/Resources \(0\)/i);

    expect(marketplaceTab).toBeInTheDocument();
    expect(resourcesTab).toBeInTheDocument();
    // expect(screen.queryByText('AMZ test- Dinesh')).toBeInTheDocument();
    expect(screen.queryByText('Checkout 1 result in Marketplace')).toBeNull();
    await userEvent.click(resourcesTab);
    expect(screen.queryByText(/Your search didn’t return any matching results. Try expanding your search criteria/i)).toBeInTheDocument();
  });
  test('Should display empty results in both when no results start with the given characters', async () => {
    await initGlobalSearch();
    await userEvent.click(screen.queryByLabelText(/Global search/i));
    expect(screen.queryByLabelText(/Global search/i)).not.toBeInTheDocument();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    userEvent.type(searchInput, 'dummyyy');
    await waitFor(() => {
      expect(screen.queryByLabelText(/Global search results/i)).toBeInTheDocument();
    });
    const marketplaceTab = screen.queryByText(/Marketplace: Apps & templates \(0\)/i);
    const resourcesTab = screen.queryByText(/Resources \(0\)/i);

    expect(marketplaceTab).toBeInTheDocument();
    expect(resourcesTab).toBeInTheDocument();
    expect(screen.queryByText(/Your search didn’t return any matching results. Try expanding your search criteria/i)).toBeInTheDocument();
    expect(screen.queryByText('Checkout 1 result in Marketplace')).toBeNull();
    await userEvent.click(resourcesTab);
    expect(screen.queryByText(/Your search didn’t return any matching results. Try expanding your search criteria/i)).toBeInTheDocument();
  });
  test('Should display filtered results after typing 2 or more characters', async () => {
    await initGlobalSearch();
    await userEvent.click(screen.queryByLabelText(/Global search/i));
    expect(screen.queryByLabelText(/Global search/i)).not.toBeInTheDocument();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    userEvent.type(searchInput, 'acumatica');
    await waitFor(() => {
      expect(screen.queryByLabelText(/Global search results/i)).toBeInTheDocument();
    });
    const marketplaceTab = screen.queryByText(/Marketplace: Apps & templates \(1\)/i);
    const resourcesTab = screen.queryByText(/Resources \(4\)/i);

    expect(marketplaceTab).toBeInTheDocument();
    expect(resourcesTab).toBeInTheDocument();
    expect(screen.queryByText('Acumatica Agent HTTP')).toBeInTheDocument();
    expect(screen.queryByText('ACUMATICA')).toBeInTheDocument();
    expect(screen.queryByText('Acumatica - Location Import')).toBeInTheDocument();
    expect(screen.queryByText('Acumatica-Location Import')).toBeInTheDocument();
    expect(screen.queryByText('Checkout 1 result in Marketplace')).toBeInTheDocument();
    await userEvent.click(screen.queryByText('Checkout 1 result in Marketplace'));
    expect(screen.queryByText('ADP Workforce Now (API) - Acumatica')).toBeInTheDocument();
    const resourceFilterButton = screen.queryByText(/all/i);

    await userEvent.click(resourceFilterButton);
    await userEvent.click(screen.queryByLabelText(/Connections/i));
    expect(screen.queryByText('Checkout 1 result in Marketplace')).toBeNull();
    expect(screen.queryByText('Acumatica Agent HTTP')).toBeInTheDocument();
    expect(screen.queryByText('Acumatica - Location Import')).toBeNull();
    expect(screen.queryByText('Acumatica-Location Import')).toBeNull();
    expect(screen.queryByText('Checkout 1 result in Marketplace')).toBeNull();
    await userEvent.click(marketplaceTab);
    expect(screen.queryByText(/Your search didn’t return any matching results. Try expanding your search criteria/i)).toBeInTheDocument();
  });
  test('Should open resource filters after typing special character , select filters starting with the string before : and should display filtered results', async () => {
    await initGlobalSearch();
    await userEvent.click(screen.queryByLabelText(/Global search/i));
    expect(screen.queryByLabelText(/Global search/i)).not.toBeInTheDocument();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    userEvent.type(searchInput, 'c: acumatica');
    await waitFor(() => {
      expect(screen.queryByLabelText(/Global search results/i)).toBeInTheDocument();
    });
    const marketplaceTab = screen.queryByText(/Marketplace: Apps & templates \(0\)/i);

    expect(screen.queryByLabelText('Resource Filter')).toBeInTheDocument();
    expect(screen.queryByLabelText(/Connections/i)).toBeChecked();
    expect(screen.queryByText('Checkout 1 result in Marketplace')).toBeNull();
    expect(screen.queryByText('Acumatica Agent HTTP')).toBeInTheDocument();
    expect(screen.queryByText('Acumatica - Location Import')).toBeNull();
    expect(screen.queryByText('Acumatica-Location Import')).toBeNull();
    expect(screen.queryByText('Checkout 1 result in Marketplace')).toBeNull();
    await userEvent.click(marketplaceTab);
    expect(screen.queryByText(/Your search didn’t return any matching results. Try expanding your search criteria/i)).toBeInTheDocument();
  });
  test('Should raise a request to backend and open a modal on clicking on marketplace app preview', async () => {
    await initGlobalSearch();
    const mockResolverFunction = jest.fn();
    /* When checking if the route was requested, if we directly give
      mockResolver function initialized by jest.fn, it is getting called twice
      so we need to explicitly give a mock resolver, resolve the request
      and call the mock function
    */

    mockPostRequestOnce('/api/licenses/request', (req, res, ctx) => {
      mockResolverFunction();

      return res(ctx.json([]));
    }
    );

    await userEvent.click(screen.queryByLabelText(/Global search/i));
    expect(screen.queryByLabelText(/Global search/i)).not.toBeInTheDocument();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    userEvent.type(searchInput, 'ADP IA');
    await waitFor(() => {
      expect(screen.queryByLabelText(/Global search results/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/ADP IA/i)).toBeInTheDocument();
    const requestForDemoButton = screen.queryByText('Request demo');

    await userEvent.click(requestForDemoButton);
    await waitFor(() => {
      expect(mockResolverFunction).toHaveBeenCalledTimes(1);
    });
  });
  test('Should navigate to that route on clicking on marketplace templates preview', async () => {
    const Preview = () => {
      const {application, templateId} = useParams();

      return <div> Templates Preview route application:{application} templateId:{templateId} </div>;
    };

    // Never use BrowserRouter as two tests having BrowserRouter cannot run
    // The test suite will fail when two tests are run together
    await initGlobalSearch(
      <MemoryRouter>
        <Switch>
          <Route
            path={buildDrawerUrl({
              path: drawerPaths.INSTALL.TEMPLATE_PREVIEW,
              baseUrl: getRoutePath('marketplace/:application'),
            })}>
            <Preview />
          </Route>
          <Route exact path="/">
            <GlobalSearch />
          </Route>
        </Switch>
      </MemoryRouter>
    );
    await userEvent.click(screen.queryByLabelText(/Global search/i));
    expect(screen.queryByLabelText(/Global search/i)).not.toBeInTheDocument();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    userEvent.type(searchInput, 'acumatica');
    await waitFor(() => {
      expect(screen.queryByLabelText(/Global search results/i)).toBeInTheDocument();
    });
    const marketplaceTab = screen.queryByText(/Marketplace: Apps & templates \(1\)/i);

    await userEvent.click(marketplaceTab);
    const template = screen.queryByText('ADP Workforce Now (API) - Acumatica');

    expect(template).toBeInTheDocument();
    const previewButton = screen.queryByText(/Preview/i);

    await userEvent.click(previewButton);
    expect(screen.queryByText(/^Templates Preview route application:acumatica templateId:5d4aa1dcdaf8cb66639f0a89/i)).toBeInTheDocument();
  });
  test('Should navigate to that route on clicking on resource results', async () => {
    const Connections = () => {
      const {id} = useParams();

      return <div> Connections route {id} </div>;
    };

    await initGlobalSearch(
      <MemoryRouter>
        <Switch>
          <Route
            path={buildDrawerUrl({
              path: drawerPaths.RESOURCE.EDIT,
              baseUrl: getRoutePath('connections'),
              params: { resourceType: 'connections' },
            })}>
            <Connections />
          </Route>
          <Route exact path="/">
            <GlobalSearch />
          </Route>
        </Switch>
      </MemoryRouter>
    );
    await userEvent.click(screen.queryByLabelText(/Global search/i));
    expect(screen.queryByLabelText(/Global search/i)).not.toBeInTheDocument();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    userEvent.type(searchInput, 'c: acumatica');
    await waitFor(() => {
      expect(screen.queryByLabelText(/Global search results/i)).toBeInTheDocument();
    });
    expect(screen.queryByText('Acumatica Agent HTTP')).toBeInTheDocument();
    await userEvent.click(screen.queryByText('Acumatica Agent HTTP'));
    await waitFor(() => expect(screen.queryByText(/Connections route 5ee0b67a3c11e4201f43102d/i)).toBeInTheDocument());
  });
});

