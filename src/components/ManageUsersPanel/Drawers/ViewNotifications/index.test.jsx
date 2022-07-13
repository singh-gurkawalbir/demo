/* global describe, test, afterEach, jest, expect */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { cleanup, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { runServer } from '../../../../test/api/server';
// eslint-disable-next-line import/no-extraneous-dependencies
import { reduxStore, renderWithProviders } from '../../../../test/test-utils';
import ViewNotificationsDrawer from '.';

function initViewNotification(props = {}) {
  const initialStore = reduxStore;

  initialStore.getState().data.resources.notifications = [
    {
      _id: '62cc4c0e70b1915aa176e5b8',
      type: 'connection',
      _connectionId: '61b20e032e84a42ca17106cf',
      subscribedByUser: {
        name: 'Test User',
        email: 'testuser+1@celigo.com',
      },
    },
    {
      _id: '62cc4c0e70b1915aa176e5b9',
      type: 'flow',
      _flowId: '62a6d47f6e4b5b50f556084d',
      subscribedByUser: {
        name: 'Test User',
        email: 'testuser+1@celigo.com',
      },
    },
  ];
  initialStore.getState().data.resources.flows = [
    {
      _id: '62c17e749666a20255163c0d',
      lastModified: '2022-07-11T18:32:35.374Z',
      name: 'Automation flow  [Jira - Testrail] to update the Automation status',
      disabled: false,
      _integrationId: '62c17d1a2a8ce51203950e51',
      skipRetries: false,
      pageProcessors: [
        {
          responseMapping: {
            fields: [
              {
                extract: 'data.[0].custom_automation_status',
                generate: 'testRailAutomationStatus',
              },
            ],
            lists: [],
          },
          type: 'export',
          _exportId: '62c862c2bb1658456e9c4d73',
        },
        {
          responseMapping: {
            fields: [
              {
                extract: 'ignored',
                generate: 'isIgnored',
              },
            ],
            lists: [],
          },
          type: 'import',
          _importId: '62c189b22a8ce51203951557',
        },
        {
          responseMapping: {
            fields: [],
            lists: [],
          },
          type: 'import',
          _importId: '62c18a812a8ce51203951574',
        },
      ],
      pageGenerators: [
        {
          _exportId: '62c17e739666a20255163c0b',
          skipRetries: false,
        },
      ],
      createdAt: '2022-07-03T11:33:08.928Z',
      lastExecutedAt: '2022-07-11T18:35:37.491Z',
      autoResolveMatchingTraceKeys: true,
    },
    {
      _id: '62c280e89666a2025516d064',
      lastModified: '2022-07-04T06:11:43.082Z',
      name: 'Load JIRA data [Khaisar] - M2 [TestRail]',
      disabled: false,
      _integrationId: '62c17d1a2a8ce51203950e51',
      skipRetries: false,
      createdAt: '2022-07-04T05:55:52.969Z',
      free: false,
      _sourceId: '62a6d47f6e4b5b50f556084d',
      lastExecutedAt: '2022-07-04T06:22:46.438Z',
      autoResolveMatchingTraceKeys: true,
      pageGenerators: [
        {
          type: 'export',
          _exportId: '62c280e89666a2025516d060',
        },
      ],
      pageProcessors: [
        {
          type: 'import',
          _importId: '62c280e89666a2025516d062',
        },
      ],
      flowConvertedToNewSchema: true,
    },
    {
      _id: '62a6d47f6e4b5b50f556084d',
      lastModified: '2022-07-04T05:55:00.650Z',
      name: 'Load JIRA data [Khaisar] - WA',
      disabled: false,
      _integrationId: '62c17d1a2a8ce51203950e51',
      skipRetries: false,
      createdAt: '2022-06-13T06:09:03.549Z',
      lastExecutedAt: '2022-07-11T17:07:15.853Z',
      autoResolveMatchingTraceKeys: true,
      pageGenerators: [
        {
          type: 'export',
          _exportId: '62a6d47e6e4b5b50f556084b',
        },
      ],
      pageProcessors: [
        {
          type: 'import',
          _importId: '62a73760d92aff47b2ebb831',
        },
      ],
      flowConvertedToNewSchema: true,
    },
  ];
  initialStore.getState().data.integrationAShares = {
    '62c17d1a2a8ce51203950e51': [
      {
        _id: '613716c0cb41a913fbf3159b',
        accepted: true,
        accessLevel: 'administrator',
        accountSSORequired: false,
        sharedWithUser: {
          _id: '5d036cb0bb88170e9e00e6ac',
          email: 'testuser+1@celigo.com',
          name: 'Test User',
          accountSSOLinked: 'not_linked',
        },
      },
    ],
  };
  initialStore.getState().user.org.accounts = [
    {
      _id: '62cc4933e5b9204a59045ae8',
      accepted: true,
      integrationAccessLevel: [
        {
          _integrationId: '62c17d1a2a8ce51203950e51',
          accessLevel: 'monitor',
        },
      ],
      ownerUser: {
        _id: '59d3382a94abe23fa59a5dad',
        email: 'khaisar.ahmad@celigo.com',
        name: 'KHAISAR AHAMAD',
        company: 'Celigo - Khaisar',
        timezone: 'Asia/Calcutta',
        useErrMgtTwoDotZero: true,
        licenses: [
          {
            _id: '59d3382b94abe23fa59a5dae',
            created: '2017-10-03T07:11:39.157Z',
            lastModified: '2022-05-11T11:37:01.734Z',
            expires: '2023-12-31T00:00:00.000Z',
            type: 'endpoint',
            tier: 'professional',
            trialEndDate: '2018-07-25T11:15:51.209Z',
            supportTier: 'preferred',
            sandbox: true,
            endpoint: {
              production: {
                numEndpoints: 5,
                numAddOnEndpoints: 10,
                numFlows: 100,
                numAddOnFlows: 0,
                numTradingPartners: 5,
                numAddOnTradingPartners: 0,
                numAgents: 1,
                numAddOnAgents: 0,
              },
              sandbox: {
                numEndpoints: 5,
                numAddOnEndpoints: 0,
                numFlows: 100,
                numAddOnFlows: 0,
                numTradingPartners: 5,
                numAddOnTradingPartners: 0,
                numAgents: 1,
                numAddOnAgents: 0,
              },
              apiManagement: true,
            },
            resumable: false,
          },
          {
            _id: '5a2a68ba09fb1c56f666c2e3',
            created: '2017-12-08T10:26:02.323Z',
            lastModified: '2021-01-06T08:32:32.917Z',
            expires: '2020-01-14T18:29:59.999Z',
            type: 'connector',
            _connectorId: '57e10364a0047c23baeffa09',
            opts: {
              connectorEdition: 'enterprise',
            },
            resumable: false,
          },
          {
            _id: '5a6ec1bae9aaa11c9bc86106',
            created: '2018-01-29T06:39:54.268Z',
            lastModified: '2022-06-27T07:52:09.014Z',
            expires: '2022-05-05T00:00:00.000Z',
            type: 'connector',
            _connectorId: '5829bce6069ccb4460cdb34e',
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
              ],
            },
            _integrationId: '6092583b2b22fe4803a3505e',
            resumable: false,
          },
          {
            _id: '57fb22f6ac80cd4191fe3025',
            created: '2016-10-10T05:11:18.419Z',
            lastModified: '2021-11-15T06:17:42.602Z',
            expires: '2018-04-28T18:29:59.999Z',
            type: 'connector',
            _connectorId: '56d3e8d3e24d0cf5090e5a18',
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
            _integrationId: '5ac5e47106bd2615df9fba2f',
            resumable: false,
          },
          {
            _id: '5acda35474706f0c087f0166',
            created: '2018-04-11T05:55:32.381Z',
            lastModified: '2022-05-17T20:47:30.598Z',
            expires: '2022-11-18T00:00:00.000Z',
            type: 'connector',
            _connectorId: '58777a2b1008fb325e6c0953',
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
                    {
                      addOnEdition: 'premium',
                    },
                    {
                      addOnEdition: 'premium',
                    },
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
                  licenses: [
                    {
                      addOnId: 'transferOrder',
                    },
                    {
                      addOnId: 'fbaInventoryAdjustment',
                    },
                    {
                      addOnId: 'amazonLocalSelling',
                    },
                  ],
                  type: 'addOn',
                },
              ],
              connectorEdition: 'premium',
            },
            _integrationId: '5c9b5bfaccf55e2a5c140233',
            resumable: false,
          },
          {
            _id: '5adf0b017db7260e0d4fe3e1',
            created: '2018-04-24T10:46:25.951Z',
            lastModified: '2022-05-03T00:54:24.327Z',
            expires: '2022-05-01T00:00:00.000Z',
            type: 'connector',
            _connectorId: '58777a2b1008fb325e6c0953',
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
                    {
                      addOnEdition: 'premium',
                    },
                    {
                      addOnEdition: 'premium',
                    },
                    {
                      addOnEdition: 'premium',
                    },
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
                      addOnId: 'fbaInventoryAdjustment',
                    },
                    {
                      addOnId: 'transferOrder',
                    },
                    {
                      addOnId: 'fbaInventoryAdjustment',
                    },
                    {
                      addOnId: 'transferOrder',
                    },
                    {
                      addOnId: 'fbaInventoryAdjustment',
                    },
                    {
                      addOnId: 'amazonLocalSelling',
                    },
                  ],
                },
              ],
              connectorEdition: 'premium',
            },
            _integrationId: '5d95f77174836b1acdcd2788',
            resumable: false,
          },
          {
            _id: '5b35fbeca344a97941eca6a2',
            created: '2018-06-29T09:29:16.811Z',
            lastModified: '2021-09-12T18:51:33.898Z',
            expires: '2021-09-10T18:29:59.999Z',
            type: 'connector',
            _connectorId: '57b5c79c61314b461e1515b1',
            opts: {
              addonLicenses: [
                {
                  licenses: [
                    {
                      addOnEdition: 'standard',
                    },
                    {
                      addOnEdition: 'standard',
                    },
                    {
                      addOnEdition: 'standard',
                    },
                    {
                      addOnEdition: 'standard',
                    },
                  ],
                  type: 'store',
                },
              ],
              connectorEdition: 'standard',
            },
            _integrationId: '5e6b543a64995e4e69326ef3',
            resumable: false,
          },
          {
            _id: '5b56eb3be3d44f5be4b0d216',
            created: '2018-07-24T09:02:51.416Z',
            lastModified: '2022-05-11T05:13:16.407Z',
            expires: '2022-09-23T18:29:59.999Z',
            type: 'connector',
            _connectorId: '5b4f5b8ab3122842c1be0314',
            opts: {
              addonLicenses: [
                {
                  licenses: [
                    {
                      addOnEdition: 'STARTER',
                    },
                    {
                      addOnEdition: 'STARTER',
                    },
                  ],
                  type: 'store',
                },
                {
                  type: 'addon',
                  licenses: [
                    {
                      addOnId: 'TRANSFERORDER',
                    },
                    {
                      addOnId: 'FbaInventory',
                    },
                    {
                      addOnId: 'Tranfer',
                    },
                    {
                      addOnId: 'FbaInventory',
                    },
                  ],
                },
              ],
              connectorEdition: 'StarTer',
            },
            resumable: false,
          },
          {
            _id: '5d384c4b0699e8605c8076a4',
            created: '2019-07-24T12:17:15.554Z',
            lastModified: '2022-03-30T19:20:54.203Z',
            expires: '2022-03-28T18:29:59.999Z',
            type: 'connector',
            _connectorId: '58777a2b1008fb325e6c0953',
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
            _integrationId: '5d84791f2af6196b2e0be441',
            sandbox: true,
            resumable: false,
          },
          {
            _id: '5db7d99eef27a42ae1500ddf',
            created: '2019-10-29T06:18:06.518Z',
            lastModified: '2021-01-06T09:23:25.273Z',
            expires: '2020-09-05T18:29:59.999Z',
            type: 'connector',
            _connectorId: '57e10364a0047c23baeffa09',
            opts: {
              connectorEdition: 'enterprise',
            },
            _integrationId: '5db7da110dc9986b5dc7cfa2',
            sandbox: true,
            resumable: false,
          },
          {
            _id: '5dbe4ce505eb532ead250c9c',
            created: '2019-11-03T03:43:33.540Z',
            lastModified: '2022-02-11T00:30:38.650Z',
            expires: '2022-02-09T00:00:00.000Z',
            type: 'connector',
            _connectorId: '5d84891a2af6196b2e0be90c',
            opts: {
              connectorEdition: 'STARTER',
              addonLicenses: [
                {
                  type: 'store',
                  licenses: [
                    {
                      addOnEdition: 'sarTER',
                    },
                    {
                      addOnEdition: 'sarTER',
                    },
                    {
                      addOnEdition: 'sarTER',
                    },
                  ],
                },
              ],
            },
            _integrationId: '60f50e97b3d8081116d40979',
            sandbox: false,
            resumable: false,
          },
          {
            _id: '5dd791857775e73c631abdda',
            created: '2019-11-22T07:43:01.881Z',
            lastModified: '2021-10-04T16:59:04.597Z',
            expires: '2022-09-05T00:00:00.000Z',
            type: 'connector',
            _connectorId: '5656f5e3bebf89c03f5dd77e',
            opts: {
              addonLicenses: [
                {
                  licenses: [
                    {
                      addOnEdition: 'premium',
                    },
                  ],
                  type: 'store',
                },
                {
                  licenses: [
                    {
                      addOnId: 'payout',
                    },
                    {
                      addOnId: 'payout',
                    },
                  ],
                  type: 'addon',
                },
              ],
              connectorEdition: 'premium',
            },
            _integrationId: '615ac7698d28bb0cb89671c5',
            sandbox: true,
            resumable: false,
          },
          {
            _id: '5e81d053ea61ad5c6aed7d0a',
            created: '2020-03-30T10:56:19.636Z',
            lastModified: '2021-03-17T00:06:45.725Z',
            expires: '2021-03-15T00:00:00.000Z',
            type: 'connector',
            _connectorId: '56d3e8d3e24d0cf5090e5a18',
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
            sandbox: true,
            resumable: false,
          },
          {
            _id: '5eb114b9281c4c0228ea307e',
            created: '2020-05-05T07:24:41.889Z',
            lastModified: '2021-01-06T08:35:14.062Z',
            expires: '2020-06-01T18:29:59.999Z',
            type: 'connector',
            _connectorId: '57e10364a0047c23baeffa09',
            opts: {
              connectorEdition: 'enterprise',
            },
            _integrationId: '5eb114f0281c4c0228ea30a3',
            sandbox: false,
            resumable: false,
          },
          {
            _id: '5f13fcf158730f2617d759c7',
            created: '2020-07-19T07:57:37.042Z',
            lastModified: '2021-08-07T00:00:20.856Z',
            expires: '2021-08-05T00:00:00.000Z',
            type: 'connector',
            _connectorId: '5b4f5b8ab3122842c1be0314',
            opts: {
              addonLicenses: [
                {
                  licenses: [
                    {
                      addOnEdition: 'starter',
                    },
                    {
                      addOnEdition: 'starter',
                    },
                    {
                      addOnEdition: 'starter',
                    },
                    {
                      addOnEdition: 'starter',
                    },
                    {
                      addOnEdition: 'starter',
                    },
                    {
                      addOnEdition: 'starter',
                    },
                    {
                      addOnEdition: 'starter',
                    },
                    {
                      addOnEdition: 'starter',
                    },
                    {
                      addOnEdition: 'starter',
                    },
                  ],
                  type: 'store',
                },
              ],
              connectorEdition: 'starter',
            },
            _integrationId: '5f13fcfc2e38dc1d31c37985',
            sandbox: true,
            resumable: false,
          },
          {
            _id: '5f2098119b2e7468fbf729ff',
            created: '2020-07-28T21:26:41.657Z',
            lastModified: '2021-12-13T02:46:19.996Z',
            expires: '2022-06-13T18:29:59.999Z',
            type: 'integrationApp',
            _connectorId: '5eeb6e7b3f407a70cd7484d6',
            _integrationId: '5f449c6e0ba217584e528852',
            sandbox: false,
          },
          {
            _id: '5f313687f238932d6c7608a2',
            created: '2020-08-10T11:59:03.422Z',
            lastModified: '2021-06-27T13:08:41.593Z',
            type: 'integrationAppChild',
            _parentId: '5f2098119b2e7468fbf729ff',
            _integrationId: '60d878596d08365744c3aa2e',
          },
          {
            _id: '5fd85ad5672dd94a45d9103f',
            created: '2020-12-15T06:42:29.863Z',
            lastModified: '2022-06-29T05:56:08.627Z',
            expires: '2022-09-03T18:29:59.999Z',
            type: 'connector',
            _connectorId: '5656f5e3bebf89c03f5dd77e',
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
                    {
                      addOnEdition: 'premium',
                    },
                    {
                      addOnEdition: 'premium',
                    },
                  ],
                },
                {
                  type: 'addon',
                  licenses: [
                    {
                      addOnId: 'payout',
                    },
                    {
                      addOnId: 'payout',
                    },
                    {
                      addOnId: 'payout',
                    },
                  ],
                },
              ],
            },
            _integrationId: '62bbe97820ecb90e02f1c9c5',
            resumable: false,
          },
          {
            _id: '5fdacfcf672dd94a45d98d2f',
            created: '2020-12-17T03:26:07.290Z',
            lastModified: '2021-11-22T19:01:28.253Z',
            expires: '2021-11-20T18:29:59.999Z',
            type: 'connector',
            _connectorId: '58777a2b1008fb325e6c0953',
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
                  type: 'addon',
                },
              ],
              connectorEdition: 'premium',
            },
            _integrationId: '5fdad00f7b5f7a714e7ffad4',
            sandbox: true,
            resumable: false,
          },
          {
            _id: '5ff1d81cb5f0b168fc105a5c',
            created: '2021-01-03T14:43:40.077Z',
            lastModified: '2022-07-01T05:42:07.622Z',
            expires: '2023-01-01T18:29:59.999Z',
            type: 'connector',
            _connectorId: '5656f5e3bebf89c03f5dd77e',
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
            _integrationId: '5ff1d82fae2e896a3f3ca9f7',
            sandbox: true,
            resumable: false,
          },
          {
            _id: '6007246a9a658330fd91902b',
            created: '2021-01-19T18:26:50.304Z',
            lastModified: '2021-05-11T14:02:58.386Z',
            type: 'integrationAppChild',
            _parentId: '5f2098119b2e7468fbf729ff',
            _integrationId: '609a8e92a0cd8857acdfe42d',
          },
          {
            _id: '603e81889f49784e58e704e4',
            created: '2021-03-02T18:18:48.477Z',
            lastModified: '2021-09-04T00:42:47.487Z',
            expires: '2021-09-02T00:00:00.000Z',
            type: 'connector',
            _connectorId: '56d3e8d3e24d0cf5090e5a18',
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
            sandbox: false,
            resumable: false,
          },
          {
            _id: '603fc8b0f973e32fb056e67e',
            created: '2021-03-03T17:34:40.905Z',
            lastModified: '2022-03-30T13:38:45.868Z',
            expires: '2022-09-30T18:29:59.999Z',
            type: 'connector',
            _connectorId: '5656f5e3bebf89c03f5dd77e',
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
                  licenses: [
                    {
                      addOnId: 'payout',
                    },
                    {
                      addOnId: 'payout',
                    },
                  ],
                  type: 'addon',
                },
              ],
              connectorEdition: 'premium',
            },
            _integrationId: '60e6f83f3499084a689178cc',
            sandbox: false,
            resumable: false,
          },
          {
            _id: '605989fc1562e664f50e10be',
            created: '2021-03-23T06:26:04.408Z',
            lastModified: '2021-09-25T18:52:25.496Z',
            expires: '2021-09-23T18:29:59.999Z',
            type: 'connector',
            _connectorId: '58777a2b1008fb325e6c0953',
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
                    {
                      addOnEdition: 'premium',
                    },
                    {
                      addOnEdition: 'premium',
                    },
                    {
                      addOnEdition: 'premium',
                    },
                    {
                      addOnEdition: 'premium',
                    },
                    {
                      addOnEdition: 'premium',
                    },
                    {
                      addOnEdition: 'premium',
                    },
                    {
                      addOnEdition: 'premium',
                    },
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
                },
                {
                  type: 'addon',
                  licenses: [
                    {
                      addOnId: 'transferOrder',
                    },
                    {
                      addOnId: 'fbaInventoryAdjustment',
                    },
                    {
                      addOnId: 'FBACustomerReturns',
                    },
                  ],
                },
              ],
            },
            _integrationId: '6064408b2a35897e109303ec',
            sandbox: false,
            resumable: false,
          },
          {
            _id: '605b633ffddc8259d923d30c',
            created: '2021-03-24T16:05:19.307Z',
            lastModified: '2021-09-17T05:01:24.376Z',
            expires: '2022-11-16T18:29:59.999Z',
            type: 'integrationApp',
            _connectorId: '5eeb6e7b3f407a70cd7484d6',
            opts: {},
            _integrationId: '605b6372fddc8259d923d318',
            sandbox: true,
          },
          {
            _id: '60864c16c1d1a5755909afa9',
            created: '2021-04-26T05:13:58.000Z',
            lastModified: '2022-05-06T07:35:33.340Z',
            expires: '2022-11-06T18:29:59.999Z',
            type: 'connector',
            _connectorId: '58777a2b1008fb325e6c0953',
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
                    {
                      addOnEdition: 'premium',
                    },
                    {
                      addOnEdition: 'premium',
                    },
                    {
                      addOnEdition: 'premium',
                    },
                    {
                      addOnEdition: 'premium',
                    },
                    {
                      addOnEdition: 'premium',
                    },
                    {
                      addOnEdition: 'premium',
                    },
                    {
                      addOnEdition: 'premium',
                    },
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
                },
                {
                  type: 'addon',
                  licenses: [
                    {
                      addOnId: 'transferOrder',
                    },
                    {
                      addOnId: 'fbaInventoryAdjustment',
                    },
                    {
                      addOnId: 'FBACustomerReturns',
                    },
                  ],
                },
              ],
            },
            sandbox: false,
            resumable: true,
          },
          {
            _id: '6091846c2b22fe4803a32463',
            created: '2021-05-04T17:29:16.875Z',
            lastModified: '2021-08-09T10:34:03.635Z',
            expires: '2021-11-04T00:00:00.000Z',
            type: 'integrationApp',
            _connectorId: '6082ae387ccb97777b0fb659',
            opts: {},
            sandbox: false,
            _editionId: '6082ae737ccb97777b0fb661',
          },
          {
            _id: '609184742b22fe4803a32466',
            created: '2021-05-04T17:29:24.007Z',
            lastModified: '2021-05-04T17:29:24.010Z',
            type: 'integrationAppChild',
            _parentId: '6091846c2b22fe4803a32463',
          },
          {
            _id: '60a0b00a9495cf3a1dd7cb11',
            created: '2021-05-16T05:39:22.454Z',
            lastModified: '2021-05-16T05:47:07.355Z',
            type: 'integrationAppChild',
            _parentId: '605b633ffddc8259d923d30c',
            _integrationId: '60a0b1db005cd32855a1ad4b',
          },
          {
            _id: '60a0b195005cd32855a1ad3d',
            created: '2021-05-16T05:45:57.912Z',
            lastModified: '2021-05-16T05:46:01.782Z',
            type: 'integrationAppChild',
            _parentId: '605b633ffddc8259d923d30c',
            _integrationId: '60a0b1999495cf3a1dd7cb4d',
          },
          {
            _id: '60d322c856cbf22dffd2e56b',
            created: '2021-06-23T12:02:16.057Z',
            lastModified: '2022-06-30T07:35:41.558Z',
            expires: '2022-12-30T18:29:59.999Z',
            type: 'connector',
            _connectorId: '5656f5e3bebf89c03f5dd77e',
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
                    {
                      addOnEdition: 'premium',
                    },
                    {
                      addOnEdition: 'premium',
                    },
                  ],
                },
                {
                  type: 'addon',
                  licenses: [
                    {
                      addOnId: 'payout',
                    },
                    {
                      addOnId: 'payout',
                    },
                    {
                      addOnId: 'payout',
                    },
                  ],
                },
              ],
            },
            _integrationId: '60d354eca8491e22c310e389',
            sandbox: false,
            resumable: false,
          },
          {
            _id: '60db177df130d11881ac7fb9',
            created: '2021-06-29T12:52:13.852Z',
            lastModified: '2021-06-29T12:52:26.001Z',
            type: 'integrationAppChild',
            _parentId: '5f2098119b2e7468fbf729ff',
            _integrationId: '60db1789f130d11881ac7fba',
          },
          {
            _id: '60e1ef511f8e826681f2ee2e',
            created: '2021-07-04T17:26:41.516Z',
            lastModified: '2021-07-05T07:35:44.798Z',
            type: 'integrationAppChild',
            _parentId: '5f2098119b2e7468fbf729ff',
            _integrationId: '60e2b650e7163d657f2c8f87',
          },
          {
            _id: '60e1ef561797d0701d8108d5',
            created: '2021-07-04T17:26:46.661Z',
            lastModified: '2021-07-04T17:45:57.575Z',
            type: 'integrationAppChild',
            _parentId: '5f2098119b2e7468fbf729ff',
            _integrationId: '60e1f3d51797d0701d810955',
          },
          {
            _id: '60f510e0b3d8081116d409f9',
            created: '2021-07-19T05:42:56.899Z',
            lastModified: '2022-05-23T09:45:47.888Z',
            expires: '2022-08-17T00:00:00.000Z',
            type: 'connector',
            _connectorId: '5d84891a2af6196b2e0be90c',
            opts: {
              connectorEdition: 'STarTer',
              addonLicenses: [
                {
                  type: 'store',
                  licenses: [
                    {
                      addOnEdition: 'STARTER',
                    },
                    {
                      addOnEdition: 'STARTER',
                    },
                    {
                      addOnEdition: 'STARTER',
                    },
                  ],
                },
              ],
            },
            _integrationId: '628b57cb21a7a4020a5883d7',
            sandbox: true,
            resumable: false,
          },
          {
            _id: '6139aa4620595c32baf01482',
            created: '2021-09-09T06:31:34.811Z',
            lastModified: '2021-09-09T06:33:02.365Z',
            type: 'integrationAppChild',
            _parentId: '5f2098119b2e7468fbf729ff',
            _integrationId: '6139aa9e19ca0c44eedead0e',
          },
          {
            _id: '6144215797013f62c81b1060',
            created: '2021-09-17T05:02:15.883Z',
            lastModified: '2022-01-11T06:42:49.994Z',
            expires: '2022-07-11T18:29:59.999Z',
            type: 'integrationApp',
            _connectorId: '5eeb6e7b3f407a70cd7484d6',
            _integrationId: '6144217d0b06e17eb52641c7',
            sandbox: true,
          },
          {
            _id: '6144216397013f62c81b1063',
            created: '2021-09-17T05:02:27.804Z',
            lastModified: '2022-01-11T06:39:25.731Z',
            type: 'integrationAppChild',
            _parentId: '6144215797013f62c81b1060',
            _integrationId: '61dd261de44ce32f03a93a6b',
          },
          {
            _id: '6144216a36d1051ff73fd2df',
            created: '2021-09-17T05:02:34.295Z',
            lastModified: '2021-09-17T05:06:40.245Z',
            type: 'integrationAppChild',
            _parentId: '6144215797013f62c81b1060',
            _integrationId: '6144226097013f62c81b1091',
          },
          {
            _id: '6146f0960b06e17eb5269926',
            created: '2021-09-19T08:11:02.239Z',
            lastModified: '2021-10-20T04:23:22.734Z',
            expires: '2022-04-06T18:29:59.999Z',
            type: 'connector',
            _connectorId: '5d84891a2af6196b2e0be90c',
            opts: {
              connectorEdition: 'starter',
              addonLicenses: [
                {
                  type: 'store',
                  licenses: [
                    {
                      addOnEdition: 'starter',
                    },
                    {
                      addOnEdition: 'starter',
                    },
                    {
                      addOnEdition: 'STARTER',
                    },
                  ],
                },
              ],
            },
            sandbox: false,
            resumable: false,
          },
          {
            _id: '61475bbaff4e9e6b85ee276a',
            created: '2021-09-19T15:48:10.985Z',
            lastModified: '2022-03-21T00:11:39.014Z',
            expires: '2022-03-19T00:00:00.000Z',
            type: 'connector',
            _connectorId: '5656f5e3bebf89c03f5dd77e',
            opts: {
              addonLicenses: [
                {
                  licenses: [
                    {
                      addOnEdition: 'premium',
                    },
                  ],
                  type: 'store',
                },
              ],
              connectorEdition: 'premium',
            },
            _integrationId: '614aee61ce97cd2cac7273fa',
            sandbox: false,
            resumable: false,
          },
          {
            _id: '614ea7451ac0cc69b5bdfdf0',
            created: '2021-09-25T04:36:21.992Z',
            lastModified: '2022-05-11T05:13:23.952Z',
            expires: '2021-10-24T18:29:59.999Z',
            type: 'connector',
            _connectorId: '5b4f5b8ab3122842c1be0314',
            opts: {
              addonLicenses: [
                {
                  licenses: [
                    {
                      addOnEdition: 'STARTER',
                    },
                    {
                      addOnEdition: 'STARTER',
                    },
                  ],
                  type: 'store',
                },
              ],
              connectorEdition: 'StarTer',
            },
            sandbox: false,
            resumable: false,
          },
          {
            _id: '614ebac5f7a56c1eff2a1514',
            created: '2021-09-25T05:59:33.454Z',
            lastModified: '2022-05-11T05:13:30.861Z',
            expires: '2022-03-25T00:00:00.000Z',
            type: 'connector',
            _connectorId: '5b4f5b8ab3122842c1be0314',
            opts: {
              addonLicenses: [
                {
                  licenses: [
                    {
                      addOnEdition: 'STARTER',
                    },
                    {
                      addOnEdition: 'STARTER',
                    },
                  ],
                  type: 'store',
                },
                {
                  type: 'addon',
                  licenses: [
                    {
                      addOnId: 'TRANSFERORDER',
                    },
                    {
                      addOnId: 'FbaInventory',
                    },
                    {
                      addOnId: 'Tranfer',
                    },
                    {
                      addOnId: 'FbaInventory',
                    },
                  ],
                },
              ],
              connectorEdition: 'StarTer',
            },
            sandbox: false,
            resumable: false,
          },
          {
            _id: '616047f18364267b8a37800c',
            created: '2021-10-08T13:30:25.764Z',
            lastModified: '2022-04-10T18:30:49.365Z',
            expires: '2022-04-08T18:29:59.999Z',
            type: 'connector',
            _connectorId: '58777a2b1008fb325e6c0953',
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
                    {
                      addOnEdition: 'premium',
                    },
                  ],
                  type: 'store',
                },
              ],
              connectorEdition: 'premium',
            },
            _integrationId: '61604a5a8364267b8a378084',
            sandbox: false,
            resumable: false,
          },
          {
            _id: '61e3aae004b4ad1da701d1d5',
            created: '2022-01-16T05:19:28.627Z',
            lastModified: '2022-07-05T17:42:12.084Z',
            expires: '2023-01-05T18:29:59.999Z',
            type: 'connector',
            _connectorId: '56fbb1176691821844de2721',
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
              ],
            },
            _integrationId: '622f44c729e5d107786dcdba',
            sandbox: false,
            resumable: false,
          },
          {
            _id: '61e4c83a04b4ad1da7020bea',
            created: '2022-01-17T01:36:58.272Z',
            lastModified: '2022-02-11T07:24:14.887Z',
            expires: '2022-07-17T18:29:59.999Z',
            type: 'integrationApp',
            _connectorId: '5eeb6e7b3f407a70cd7484d6',
            _integrationId: '62060f1ee171026df168ebc9',
            sandbox: true,
          },
          {
            _id: '61e4c84b04b4ad1da7020bf0',
            created: '2022-01-17T01:37:15.340Z',
            lastModified: '2022-02-11T07:26:04.253Z',
            type: 'integrationAppChild',
            _parentId: '61e4c83a04b4ad1da7020bea',
            _integrationId: '62060f8ce171026df168ebd5',
          },
          {
            _id: '61f8e69877a85656227d2679',
            created: '2022-02-01T07:51:52.268Z',
            lastModified: '2022-02-16T06:34:24.219Z',
            expires: '2022-08-01T18:29:59.999Z',
            type: 'integrationApp',
            _connectorId: '61e00b165c907e4eac14175d',
            _integrationId: '620c9af01ad33b35703a9786',
            sandbox: false,
            _editionId: '61e00b165c907e4eac14175e',
          },
          {
            _id: '61f8e6a3c34a8c55a22a1417',
            created: '2022-02-01T07:52:03.842Z',
            lastModified: '2022-02-20T16:41:51.753Z',
            type: 'integrationAppChild',
            _parentId: '61f8e69877a85656227d2679',
            _integrationId: '62126f4f0f36bf7cbd9c2780',
          },
          {
            _id: '620be3421ad33b35703a7629',
            created: '2022-02-15T17:30:42.666Z',
            lastModified: '2022-02-18T13:14:37.366Z',
            type: 'integrationAppChild',
            _parentId: '61f8e69877a85656227d2679',
            _integrationId: '620f9bbd78f2387da20dab38',
          },
          {
            _id: '620c93073ac5d033c6eef406',
            created: '2022-02-16T06:00:39.762Z',
            lastModified: '2022-02-16T06:40:31.219Z',
            type: 'integrationAppChild',
            _parentId: '61f8e69877a85656227d2679',
            _integrationId: '620c9c5f3d7a9a3d9c86c3dc',
          },
          {
            _id: '6212892197769c750858ddbe',
            created: '2022-02-20T18:32:01.817Z',
            lastModified: '2022-02-20T18:32:01.837Z',
            type: 'integrationAppChild',
            _parentId: '61f8e69877a85656227d2679',
          },
          {
            _id: '621289260f36bf7cbd9c2b5b',
            created: '2022-02-20T18:32:06.441Z',
            lastModified: '2022-02-20T18:32:06.446Z',
            type: 'integrationAppChild',
            _parentId: '61f8e69877a85656227d2679',
          },
          {
            _id: '6212892a78f2387da20e11e0',
            created: '2022-02-20T18:32:10.165Z',
            lastModified: '2022-02-20T18:32:10.171Z',
            type: 'integrationAppChild',
            _parentId: '61f8e69877a85656227d2679',
          },
          {
            _id: '6212892e97769c750858ddbf',
            created: '2022-02-20T18:32:14.253Z',
            lastModified: '2022-02-20T18:32:14.257Z',
            type: 'integrationAppChild',
            _parentId: '61f8e69877a85656227d2679',
          },
          {
            _id: '621289320f36bf7cbd9c2b5c',
            created: '2022-02-20T18:32:18.713Z',
            lastModified: '2022-02-23T18:30:04.194Z',
            type: 'integrationAppChild',
            _parentId: '61f8e69877a85656227d2679',
            _integrationId: '62167d2c97769c75085a038f',
          },
          {
            _id: '6212893797769c750858ddc0',
            created: '2022-02-20T18:32:23.366Z',
            lastModified: '2022-02-23T12:21:24.000Z',
            type: 'integrationAppChild',
            _parentId: '61f8e69877a85656227d2679',
            _integrationId: '621626c378f2387da20f13be',
          },
          {
            _id: '6212893c78f2387da20e11e2',
            created: '2022-02-20T18:32:28.042Z',
            lastModified: '2022-02-23T17:21:17.254Z',
            type: 'integrationAppChild',
            _parentId: '61f8e69877a85656227d2679',
            _integrationId: '62166d0d97769c75085a00d4',
          },
          {
            _id: '6212894097769c750858ddc1',
            created: '2022-02-20T18:32:32.665Z',
            lastModified: '2022-02-22T18:45:25.155Z',
            type: 'integrationAppChild',
            _parentId: '61f8e69877a85656227d2679',
            _integrationId: '62152f4597769c75085994cb',
          },
          {
            _id: '621289490f36bf7cbd9c2b60',
            created: '2022-02-20T18:32:41.689Z',
            lastModified: '2022-02-22T17:57:20.178Z',
            type: 'integrationAppChild',
            _parentId: '61f8e69877a85656227d2679',
            _integrationId: '6215240078f2387da20ec301',
          },
          {
            _id: '6212894d78f2387da20e11e5',
            created: '2022-02-20T18:32:45.204Z',
            lastModified: '2022-02-22T14:59:51.209Z',
            type: 'integrationAppChild',
            _parentId: '61f8e69877a85656227d2679',
            _integrationId: '6214fa670f36bf7cbd9ccd2d',
          },
          {
            _id: '6212895197769c750858ddc4',
            created: '2022-02-20T18:32:49.444Z',
            lastModified: '2022-02-22T14:03:13.191Z',
            type: 'integrationAppChild',
            _parentId: '61f8e69877a85656227d2679',
            _integrationId: '6214ed2197769c7508597ef4',
          },
          {
            _id: '621289550f36bf7cbd9c2b61',
            created: '2022-02-20T18:32:53.080Z',
            lastModified: '2022-02-20T19:20:11.375Z',
            type: 'integrationAppChild',
            _parentId: '61f8e69877a85656227d2679',
            _integrationId: '6212946b78f2387da20e1424',
          },
          {
            _id: '6212895978f2387da20e11e7',
            created: '2022-02-20T18:32:57.380Z',
            lastModified: '2022-02-20T18:33:15.927Z',
            type: 'integrationAppChild',
            _parentId: '61f8e69877a85656227d2679',
            _integrationId: '6212896b78f2387da20e11e8',
          },
          {
            _id: '62170f1878f2387da20f4987',
            created: '2022-02-24T04:52:40.786Z',
            lastModified: '2022-02-24T04:56:21.346Z',
            expires: '2022-08-24T18:29:59.999Z',
            type: 'integrationApp',
            _connectorId: '61e00b165c907e4eac14175d',
            _integrationId: '62170ff578f2387da20f4998',
            sandbox: false,
            _editionId: '61e00b165c907e4eac14175e',
          },
          {
            _id: '62170f2378f2387da20f498a',
            created: '2022-02-24T04:52:51.726Z',
            lastModified: '2022-02-24T06:57:36.276Z',
            type: 'integrationAppChild',
            _parentId: '62170f1878f2387da20f4987',
            _integrationId: '62172c6097769c75085a2774',
          },
          {
            _id: '62170f2897769c75085a19ec',
            created: '2022-02-24T04:52:56.197Z',
            lastModified: '2022-03-14T15:19:02.456Z',
            type: 'integrationAppChild',
            _parentId: '62170f1878f2387da20f4987',
            _integrationId: '622f5ce629e5d107786dd69d',
          },
          {
            _id: '62170f2c78f2387da20f498b',
            created: '2022-02-24T04:53:00.753Z',
            lastModified: '2022-02-24T04:58:16.059Z',
            type: 'integrationAppChild',
            _parentId: '62170f1878f2387da20f4987',
            _integrationId: '621710670f36bf7cbd9d6087',
          },
          {
            _id: '6238893723bcfb0ea0f516d2',
            created: '2022-03-21T14:18:31.341Z',
            lastModified: '2022-06-29T05:12:37.764Z',
            expires: '2022-12-29T18:29:59.999Z',
            type: 'connector',
            _connectorId: '5656f5e3bebf89c03f5dd77e',
            opts: {
              addonLicenses: [
                {
                  licenses: [
                    {
                      addOnEdition: 'premium',
                    },
                  ],
                  type: 'store',
                },
                {
                  licenses: [
                    {
                      addOnId: 'payout',
                    },
                    {
                      addOnId: 'payout',
                    },
                  ],
                  type: 'addon',
                },
              ],
              connectorEdition: 'premium',
            },
            _integrationId: '62543ffdcddb8a1ba550bbef',
            sandbox: false,
            resumable: false,
          },
          {
            _id: '624c52477b053234d3ccae9a',
            created: '2022-04-05T14:29:27.981Z',
            lastModified: '2022-04-28T10:30:51.536Z',
            expires: '2022-10-05T18:29:59.999Z',
            type: 'integrationApp',
            _connectorId: '5eeb6e7b3f407a70cd7484d6',
            sandbox: false,
          },
          {
            _id: '625e60574566090defe8934a',
            created: '2022-04-19T07:10:15.281Z',
            lastModified: '2022-04-19T07:14:10.692Z',
            expires: '2022-12-12T12:12:12.999Z',
            type: 'integrationApp',
            _connectorId: '5eeb6e7b3f407a70cd7484d6',
            _integrationId: '625e61424566090defe89362',
            sandbox: false,
          },
          {
            _id: '625e60634566090defe8934b',
            created: '2022-04-19T07:10:27.879Z',
            lastModified: '2022-06-23T16:20:45.383Z',
            type: 'integrationAppChild',
            _parentId: '625e60574566090defe8934a',
            _integrationId: '62b492dd34420d228503d913',
          },
          {
            _id: '625e606526f1473265fecfcd',
            created: '2022-04-19T07:10:29.339Z',
            lastModified: '2022-04-19T07:15:57.728Z',
            type: 'integrationAppChild',
            _parentId: '625e60574566090defe8934a',
            _integrationId: '625e61ad2fcba1391e49f7d0',
          },
          {
            _id: '626f19c9385b5c5d57bcbd93',
            created: '2022-05-01T23:37:45.151Z',
            lastModified: '2022-05-11T06:52:35.118Z',
            expires: '2022-11-02T18:29:59.999Z',
            type: 'integrationApp',
            _connectorId: '62687a4edd4afe56b59cdd34',
            _integrationId: '627b5d32d70fb81b4f1b61d3',
            sandbox: false,
            _editionId: '62687a4edd4afe56b59cdd35',
          },
          {
            _id: '626f19d3385b5c5d57bcbd9e',
            created: '2022-05-01T23:37:55.931Z',
            lastModified: '2022-05-11T17:42:08.972Z',
            type: 'integrationAppChild',
            _parentId: '626f19c9385b5c5d57bcbd93',
            _integrationId: '627bf57021a7a4020a4f2c66',
          },
          {
            _id: '626f19d8dd4afe56b5a0093a',
            created: '2022-05-01T23:38:00.462Z',
            lastModified: '2022-05-11T06:54:26.381Z',
            type: 'integrationAppChild',
            _parentId: '626f19c9385b5c5d57bcbd93',
            _integrationId: '627b5da22d6dd121b5b82a05',
          },
          {
            _id: '627496f374f9f8558cdb7ec4',
            created: '2022-05-06T03:33:07.372Z',
            lastModified: '2022-06-27T15:32:08.620Z',
            expires: '2022-11-06T18:29:59.999Z',
            type: 'integrationApp',
            _connectorId: '62712c1edd4afe56b5a10c3c',
            _integrationId: '62b9cd7826f029597087c632',
            sandbox: false,
            _editionId: '62712c1edd4afe56b5a10c3d',
          },
          {
            _id: '6274970174f9f8558cdb7ec6',
            created: '2022-05-06T03:33:21.607Z',
            lastModified: '2022-05-06T03:33:21.612Z',
            type: 'integrationAppChild',
            _parentId: '627496f374f9f8558cdb7ec4',
          },
          {
            _id: '62749705d9525a559625e667',
            created: '2022-05-06T03:33:25.392Z',
            lastModified: '2022-06-27T15:33:31.846Z',
            type: 'integrationAppChild',
            _parentId: '627496f374f9f8558cdb7ec4',
            _integrationId: '62b9cdcb6d35c36b8b3a8cea',
          },
          {
            _id: '6274ce60e940c02f7f803d1b',
            created: '2022-05-06T07:29:36.194Z',
            lastModified: '2022-06-15T09:57:56.647Z',
            expires: '2022-11-06T18:29:59.999Z',
            type: 'integrationApp',
            _connectorId: '62712c1edd4afe56b5a10c3c',
            _integrationId: '62a9ad24c1fe144a850d6540',
            sandbox: false,
            _editionId: '62712c1edd4afe56b5a10c3d',
          },
          {
            _id: '6274ce77e940c02f7f803d1e',
            created: '2022-05-06T07:29:59.965Z',
            lastModified: '2022-06-30T19:19:11.007Z',
            type: 'integrationAppChild',
            _parentId: '6274ce60e940c02f7f803d1b',
            _integrationId: '62bdf72ea0f5f21448168f4e',
          },
          {
            _id: '6274cf098005ab294d8d3679',
            created: '2022-05-06T07:32:25.331Z',
            lastModified: '2022-06-15T09:59:11.173Z',
            type: 'integrationAppChild',
            _parentId: '6274ce60e940c02f7f803d1b',
            _integrationId: '62a9ad6f2c12e2538eacf517',
          },
          {
            _id: '6274cff88005ab294d8d3775',
            created: '2022-05-06T07:36:24.084Z',
            lastModified: '2022-05-06T07:37:00.723Z',
            expires: '2022-11-06T18:29:59.999Z',
            type: 'integrationApp',
            _connectorId: '61e00b165c907e4eac14175d',
            _integrationId: '6274d01ce940c02f7f803eae',
            sandbox: false,
            _editionId: '61e00b165c907e4eac14175e',
          },
          {
            _id: '6274d0078005ab294d8d37a3',
            created: '2022-05-06T07:36:39.256Z',
            lastModified: '2022-05-06T07:36:39.261Z',
            type: 'integrationAppChild',
            _parentId: '6274cff88005ab294d8d3775',
          },
          {
            _id: '628387bef53c92797734325f',
            created: '2022-05-17T11:32:14.917Z',
            lastModified: '2022-05-17T11:32:45.045Z',
            type: 'integrationAppChild',
            _parentId: '626f19c9385b5c5d57bcbd93',
            _integrationId: '628387dcf53c92797734326d',
          },
          {
            _id: '628387f521a7a4020a53d929',
            created: '2022-05-17T11:33:09.428Z',
            lastModified: '2022-05-17T11:33:49.685Z',
            expires: '2022-11-17T18:29:59.999Z',
            type: 'integrationApp',
            _connectorId: '62687a4edd4afe56b59cdd34',
            _integrationId: '6283881cf53c9279773432ae',
            sandbox: false,
            _editionId: '62687a4edd4afe56b59cdd35',
          },
          {
            _id: '62838802f53c927977343297',
            created: '2022-05-17T11:33:22.251Z',
            lastModified: '2022-05-17T11:33:22.257Z',
            type: 'integrationAppChild',
            _parentId: '628387f521a7a4020a53d929',
          },
          {
            _id: '6284c51ff53c92797735139e',
            created: '2022-05-18T10:06:23.877Z',
            lastModified: '2022-05-20T09:49:01.530Z',
            expires: '2022-11-18T18:29:59.999Z',
            type: 'integrationApp',
            _connectorId: '62687a4edd4afe56b59cdd34',
            _integrationId: '6287640d255d156e20d6397e',
            sandbox: false,
            _editionId: '62687a4edd4afe56b59cdd35',
          },
          {
            _id: '6284c52821a7a4020a54bcda',
            created: '2022-05-18T10:06:32.892Z',
            lastModified: '2022-05-20T13:49:31.650Z',
            type: 'integrationAppChild',
            _parentId: '6284c51ff53c92797735139e',
          },
          {
            _id: '6284cf7821a7a4020a54c53e',
            created: '2022-05-18T10:50:32.643Z',
            lastModified: '2022-05-20T09:54:47.984Z',
            type: 'integrationAppChild',
            _parentId: '6284c51ff53c92797735139e',
            _integrationId: '6287656721a7a4020a5667d5',
          },
          {
            _id: '62861de821a7a4020a559510',
            created: '2022-05-19T10:37:28.556Z',
            lastModified: '2022-06-18T11:21:30.522Z',
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
            _integrationId: '62861de821a7a4020a559512',
            sandbox: false,
            resumable: false,
            trialEndDate: '2022-06-18T10:37:28.555Z',
          },
          {
            _id: '62861e09255d156e20d567d5',
            created: '2022-05-19T10:38:01.539Z',
            lastModified: '2022-05-20T04:59:55.333Z',
            type: 'integrationApp',
            _connectorId: '6241841da925e40ea9d43ba8',
            sandbox: false,
            trialEndDate: '2022-06-18T10:38:01.537Z',
          },
          {
            _id: '628786f8255d156e20d64a83',
            created: '2022-05-20T12:18:00.173Z',
            lastModified: '2022-06-27T13:17:42.228Z',
            type: 'integrationAppChild',
            _parentId: '6284c51ff53c92797735139e',
          },
          {
            _id: '628786ff255d156e20d64a8a',
            created: '2022-05-20T12:18:07.908Z',
            lastModified: '2022-05-20T12:18:48.400Z',
            type: 'integrationAppChild',
            _parentId: '6284c51ff53c92797735139e',
            _integrationId: '62878728255d156e20d64a96',
          },
          {
            _id: '6287afb421a7a4020a569538',
            created: '2022-05-20T15:11:48.217Z',
            lastModified: '2022-05-20T16:41:10.392Z',
            expires: '2022-11-20T18:29:59.999Z',
            type: 'integrationApp',
            _connectorId: '62687a4edd4afe56b59cdd34',
            _integrationId: '6287c4a621a7a4020a56a4d5',
            sandbox: true,
            _editionId: '62687a4edd4afe56b59cdd35',
          },
          {
            _id: '6287b0c1255d156e20d66722',
            created: '2022-05-20T15:16:17.132Z',
            lastModified: '2022-05-20T15:16:17.137Z',
            type: 'integrationAppChild',
            _parentId: '6287afb421a7a4020a569538',
          },
          {
            _id: '6287b0cf255d156e20d66723',
            created: '2022-05-20T15:16:31.464Z',
            lastModified: '2022-05-20T16:42:34.280Z',
            type: 'integrationAppChild',
            _parentId: '6287afb421a7a4020a569538',
            _integrationId: '6287c4fa21a7a4020a56a50a',
          },
          {
            _id: '62b4935a6d79e831303857f9',
            created: '2022-06-23T16:22:50.268Z',
            lastModified: '2022-06-23T16:22:50.272Z',
            type: 'integrationAppChild',
            _parentId: '625e60574566090defe8934a',
          },
          {
            _id: '62b4935e34420d228503d93e',
            created: '2022-06-23T16:22:54.977Z',
            lastModified: '2022-06-23T16:23:15.694Z',
            type: 'integrationAppChild',
            _parentId: '625e60574566090defe8934a',
            _integrationId: '62b493736d79e83130385803',
          },
          {
            _id: '62c50b4a2a8ce512039766ad',
            created: '2022-07-06T04:10:50.452Z',
            lastModified: '2022-07-06T04:15:37.234Z',
            expires: '2023-01-06T18:29:59.999Z',
            type: 'integrationApp',
            _connectorId: '62712c1edd4afe56b5a10c3c',
            _integrationId: '62c50c691a68c443d138121a',
            sandbox: true,
            _editionId: '62712c1edd4afe56b5a10c3d',
          },
          {
            _id: '62c50b562a8ce512039766b5',
            created: '2022-07-06T04:11:02.992Z',
            lastModified: '2022-07-06T04:16:39.403Z',
            type: 'integrationAppChild',
            _parentId: '62c50b4a2a8ce512039766ad',
            _integrationId: '62c50ca71a68c443d138122b',
          },
          {
            _id: '62c50cea1a68c443d138123f',
            created: '2022-07-06T04:17:46.778Z',
            lastModified: '2022-07-06T04:22:16.916Z',
            type: 'integrationAppChild',
            _parentId: '62c50b4a2a8ce512039766ad',
          },
          {
            _id: '62c50de61a68c443d13812d1',
            created: '2022-07-06T04:21:58.862Z',
            lastModified: '2022-07-06T04:21:58.866Z',
            type: 'integrationAppChild',
            _parentId: '62c50b4a2a8ce512039766ad',
          },
          {
            _id: '62c50deb2a8ce512039767ed',
            created: '2022-07-06T04:22:03.394Z',
            lastModified: '2022-07-06T04:26:17.278Z',
            type: 'integrationAppChild',
            _parentId: '62c50b4a2a8ce512039766ad',
            _integrationId: '62c50ee91a68c443d1381379',
          },
        ],
      },
    },
  ];
  initialStore.getState().user.profile = [{
    _id: '6040b91267059b24eb522db6',
    name: 'Chaitanya Reddy',
    email: 'chaitanyareddy.mule+1@celigo.com',
    role: 'Assosiate Software Analyst',
    company: 'Celigo',
    phone: '1234567890',
    auth_type_google: {},
    agreeTOSAndPP: true,
    createdAt: '2021-03-04T10:40:18.812Z',
    authTypeSSO: null,
    emailHash: '54d80e4bf5ffc62eaf499d16e7e400a8',
  }];
  initialStore.getState().user.org.users = [{
    _id: '5ea6afa9cc041b3effb87105',
    accepted: true,
    accessLevel: 'administrator',
    sharedWithUser: {
      _id: '5d036cb0bb88170e9e00e6ac',
      email: 'testuser+1@celigo.com',
      name: 'Test user',
      accountSSOLinked: 'not_linked',
    },
  }];
  initialStore.getState().data.resources.integrations = [
    {
      _id: '62c17d1a2a8ce51203950e51',
      lastModified: '2022-07-03T12:19:25.647Z',
      name: 'JIRA Required',
      description: 'Contains all the custom flows linking with JIRA integration',
      install: [],
      sandbox: false,
      _registeredConnectionIds: [
        '61b20e032e84a42ca17106cf',
        '62c1894d2a8ce5120395154c',
      ],
      installSteps: [],
      uninstallSteps: [],
      flowGroupings: [],
      createdAt: '2022-07-03T11:27:22.346Z',
    },
  ];
  initialStore.getState().data.resources.connections = [
    {
      _id: '61b20e032e84a42ca17106cf',
      createdAt: '2021-12-09T14:09:07.482Z',
      lastModified: '2022-07-03T14:48:18.315Z',
      type: 'rest',
      name: 'JIRA Automation',
      assistant: 'jira',
      debugDate: '2022-07-03T15:03:17.961Z',
      sandbox: false,
      debugUntil: '2022-07-03T15:03:17.961Z',
      isHTTP: true,
      http: {
        formType: 'assistant',
        mediaType: 'json',
        baseURI: 'https://celigo.atlassian.net/',
        ping: {
          relativeURI: '/',
          method: 'GET',
        },
        headers: [
          {
            name: 'content-type',
            value: 'application/json',
          },
        ],
        auth: {
          type: 'basic',
          basic: {
            username: 'khaisar.ahmad@celigo.com',
            password: '******',
          },
        },
      },
      rest: {
        baseURI: 'https://celigo.atlassian.net/',
        isHTTPProxy: true,
        mediaType: 'json',
        authType: 'basic',
        headers: [
          {
            name: 'content-type',
            value: 'application/json',
          },
        ],
        encryptedFields: [],
        unencryptedFields: [],
        scope: [],
        pingRelativeURI: '/',
        pingSuccessValues: [],
        pingFailureValues: [],
        pingMethod: 'GET',
        refreshTokenHeaders: [],
        basicAuth: {
          username: 'khaisar.ahmad@celigo.com',
          password: '******',
        },
      },
    },
    {
      _id: '62c1894d2a8ce5120395154c',
      createdAt: '2022-07-03T12:19:25.405Z',
      lastModified: '2022-07-07T16:16:34.466Z',
      type: 'http',
      name: 'Test Rail HTTP Connection',
      debugDate: '2022-07-07T16:31:33.722Z',
      sandbox: false,
      debugUntil: '2022-07-07T16:31:33.722Z',
      http: {
        formType: 'http',
        mediaType: 'json',
        baseURI: 'https://celigo.testrail.io/index.php?/api/v2',
        ping: {
          relativeURI: '/get_projects',
          method: 'GET',
        },
        headers: [
          {
            name: 'content-type',
            value: 'application/json',
          },
        ],
        unencrypted: {
          field: 'value',
        },
        encrypted: '******',
        auth: {
          type: 'basic',
          basic: {
            username: 'khaisar.ahmad@celigo.com',
            password: '******',
          },
        },
      },
    },
  ];
  initialStore.getState().session.loadResources = {
    integrations: 'received',
    'transfers/invited': 'received',
    ashares: 'failed',
    'shared/ashares': 'received',
    'ui/assistants': 'received',
    httpconnectors: 'failed',
    tiles: 'received',
    published: 'received',
    connections: 'received',
    marketplacetemplates: 'received',
    '62c17d1a2a8ce51203950e51': {
      flows: 'received',
      exports: 'received',
      imports: 'received',
    },
    notifications: 'requested',
    'integrations/62c17d1a2a8ce51203950e51/ashares': 'requested',
  };
  initialStore.getState().user.preferences = {
    environment: 'production',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'h:mm:ss a',
    scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
    showReactSneakPeekFromDate: '2019-11-05',
    showReactBetaFromDate: '2019-12-26',
    defaultAShareId: '62cc4933e5b9204a59045ae8',
    expand: 'Resources',
    accounts: {
      '6040b99a7671bb3ddf6a368b': {
        drawerOpened: true,
        fbBottomDrawerHeight: 257,
        expand: null,
        dashboard: {
          view: 'tile',
        },
      },
      '61c45e7b11cd027c01583984': {
        expand: null,
      },
    },
  };

  const ui = (
    <MemoryRouter
      initialEntries={[{ pathname: 'integrations/62c17d1a2a8ce51203950e51/users/ui-drawer/testuser+1@celigo.com/notifications' }]}
    >
      <Route
        path="integrations/62c17d1a2a8ce51203950e51/users/ui-drawer/:userEmail/notifications"
        params={{userEmail: 'testuser+1@celigo.com'}}
      >
        <ViewNotificationsDrawer {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}
jest.mock('../../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../LoadResources'),
  default: props => (
    <>
      {props.children}
    </>
  ),
}));

jest.mock('../../../drawer/Right', () => ({
  __esModule: true,
  ...jest.requireActual('../../../drawer/Right'),
  default: props => (
    <>
      {props.children}
    </>
  ),
}));
jest.mock('../../../drawer/Right/DrawerHeader', () => ({
  __esModule: true,
  ...jest.requireActual('../../../drawer/Right/DrawerHeader'),
  default: props => (
    <>
      {props.children}
    </>
  ),
}));
describe('View Notifications', () => {
  runServer();
  afterEach(cleanup);
  test('Should render the view notification right drawer', async () => {
    const props = {
      integrationId: '62c17d1a2a8ce51203950e51',
    };

    await initViewNotification(props);
    const subscribedFlows = screen.getByText('Subscribed flows');

    expect(subscribedFlows).toBeInTheDocument();
    const flows = screen.getByText('Load JIRA data [Khaisar] - WA');

    expect(flows).toBeInTheDocument();
    const subscribedconnections = screen.getByText('Subscribed connections');

    expect(subscribedconnections).toBeInTheDocument();
    const connections = screen.getByText('JIRA Automation');

    expect(connections).toBeInTheDocument();
  });
});
