/* global describe, test, expect */
import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
// import userEvent from '@testing-library/user-event';
import Permissions from '.';
import { reduxStore, renderWithProviders } from '../../test/test-utils';
// import actions from '../../actions';

const initialStore = reduxStore;

initialStore.getState().user = {
  preferences: {
    environment: 'production',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'h:mm:ss a',
    drawerOpened: true,
    expand: 'Tools',
    scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
    showReactSneakPeekFromDate: '2019-11-05',
    showReactBetaFromDate: '2019-12-26',
    defaultAShareId: 'own',
    fbBottomDrawerHeight: -45,
    lastLoginAt: '2022-01-25T07:36:20.829Z',
    dashboard: {
      tilesOrder: [
        '5fc5e0e66cfe5b44bb95dgft',
      ],
      view: 'tile',
    },
    recentActivity: {
      production: {
        integration: '60c1b4aea4004f2e4cfcbght',
        flow: '60cf3ec4a4004f2e4cff3tr3',
      },
    },
  },
  profile: {
    _id: '5d4010e14cd24a7c77312vf5',
    name: 'Test Name',
    email: 'testemail@celigo.com',
    role: '',
    company: 'Test Company',
    phone: '12234567890',
    auth_type_google: {},
    timezone: 'Asia/Calcutta',
    developer: true,
    agreeTOSAndPP: true,
    createdAt: '2019-07-30T09:41:54.435Z',
    useErrMgtTwoDotZero: false,
    authTypeSSO: null,
    emailHash: '8a859a6cc8996b65d364a1ce1e7a3840',
  },
  notifications: {
    accounts: [],
    stacks: [],
    transfers: [],
  },
  org: {
    users: [
      {
        _id: '6073e5292c4eed237fa03546',
        accepted: true,
        integrationAccessLevel: [
          {
            _integrationId: '60c1b4aea4004f2e4cfcbght',
            accessLevel: 'manage',
          },
        ],
        sharedWithUser: {
          _id: '5bb6f83bc9d77360fb6feb21',
          email: 'testshareduser1',
          name: 'Shared User 1',
          accountSSOLinked: 'not_linked',
        },
      },
    ],
    accounts: [
      {
        _id: 'own',
        accessLevel: 'owner',
        ownerUser: {
          licenses: [
            {
              _id: '5d4010e24cd24a7c773123f2',
              created: '2019-07-30T09:41:54.439Z',
              lastModified: '2019-08-14T11:22:55.872Z',
              expires: '2022-09-13T11:22:55.872Z',
              type: 'integrator',
              tier: 'standard',
              numAddOnFlows: 100,
              trialEndDate: '2019-09-13T11:22:55.872Z',
              supportTier: 'essential',
              numSandboxAddOnFlows: 0,
              resumable: false,
            },
            {
              _id: '6290a220ccb94d35de66e3bd',
              created: '2022-05-27T10:04:16.990Z',
              lastModified: '2022-05-27T10:04:16.995Z',
              expires: '2022-11-27T18:29:59.999Z',
              type: 'connector',
              _connectorId: '5656f5e3bebf89c03f5dd55e',
              opts: {
                connectorEdition: 'premium',
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
                  {
                    licenses: [
                      {
                        addOnId: 'payout',
                      },
                    ],
                    type: 'addon',
                  },
                ],
              },
              sandbox: false,
              resumable: false,
            },
            {
              _id: '629d8a97ccb94d35de6f0fdr',
              created: '2022-06-06T05:03:19.396Z',
              lastModified: '2022-06-06T05:06:31.261Z',
              expires: '2023-06-06T18:29:59.999Z',
              type: 'connector',
              _connectorId: '56d3e8d3e24d0cf5090e555e',
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
                ],
                connectorEdition: 'premium',
              },
              _integrationId: '60c1b4aea4004f2e4cfcbght',
              sandbox: false,
              resumable: false,
            },
          ],
        },
      },
      {
        _id: '62cc487470b1915aa176e3ee',
        dismissed: true,
        integrationAccessLevel: [
          {
            _integrationId: '60c1b4aea4004f2e4cfcbght',
            accessLevel: 'manage',
          },
        ],
        ownerUser: {
          _id: '59d3382a94abe23fa59a5mom',
          email: 'testemail2@celigo.com',
          name: 'Test User 2',
          preferences: {
            environment: 'production',
            dateFormat: 'MM/DD/YYYY',
            timeFormat: 'h:mm:ss a',
            expand: 'Resources',
            scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
            showReactSneakPeekFromDate: '2019-11-05',
            showReactBetaFromDate: '2019-12-26',
            defaultAShareId: 'own',
            fbBottomDrawerHeight: 577,
            drawerOpened: true,
          },
          company: 'Celigo - Khaisar',
          timezone: 'Asia/Calcutta',
          useErrMgtTwoDotZero: true,
        },
      },
    ],
  },
  debug: false,
};

async function initPermissions() {
  const initialStore = reduxStore;
  const ui = (
    <MemoryRouter>
      <Route>
        <Permissions />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('Permissions', () => {
  test('Should able to test the permission explorer', async () => {
    const json = await initPermissions();
    const headingNode = screen.getByRole('heading', {name: 'Permission explorer'});

    expect(headingNode).toBeInTheDocument();
    expect(json).toMatchSnapshot();
  });
});
