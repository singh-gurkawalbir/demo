import { API } from '../utils';

export default API.get('/api/integrations', [
  {
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
  },
  {
    _id: '5e2fdf183a34b14c6405381c',
    lastModified: '2020-11-03T15:29:52.385Z',
    name: 'ACUMATICA',
    install: [],
    sandbox: false,
    _registeredConnectionIds: [
      '5da93f6590b5b54781372e96',
      '5e2fd9893a34b14c640536a4',
    ],
    installSteps: [],
    uninstallSteps: [],
    flowGroupings: [],
    createdAt: '2020-01-28T07:13:28.354Z',
  },
  {
    _id: '5f925c684109037fe51fbe8c',
    lastModified: '2021-02-05T09:26:33.479Z',
    name: 'AFE 2.0 IN DB',
    install: [],
    sandbox: false,
    _registeredConnectionIds: [
      '5e80979706d4e11f2a2aab0d',
      '5cd2995a67d43871d97c5260',
    ],
    installSteps: [],
    uninstallSteps: [],
    flowGroupings: [],
    createdAt: '2020-10-23T04:30:32.355Z',
  },
  {
    _id: '6035ea822517ec51224a1afe',
    lastModified: '2021-02-25T05:34:30.478Z',
    name: 'AFE REPORTED ISSUES',
    install: [],
    sandbox: false,
    _registeredConnectionIds: [
      '5cd51efd3607fe7d8eda9c97',
      '5feafdd3b3ded9644e0418c2',
    ],
    installSteps: [],
    uninstallSteps: [],
    flowGroupings: [],
    createdAt: '2021-02-24T05:56:18.507Z',
  },
  {
    _id: '5ffad3d1f08d35214ed200f7',
    lastModified: '2021-01-22T08:40:45.731Z',
    name: 'AFE other adaptors',
    install: [],
    sandbox: false,
    _registeredConnectionIds: [
      '5cd51efd3607fe7d8eda9c97',
      '5feafe6bf415e15f455dbc05',
    ],
    installSteps: [],
    uninstallSteps: [],
    flowGroupings: [],
    createdAt: '2021-01-10T10:15:45.184Z',
  },
  {
    _id: '5a2e4cc68147dd5f5cf8d6f8',
    lastModified: '2022-01-16T14:56:27.331Z',
    name: 'BigCommerce - NetSuite',
    _connectorId: '56fbb1176691821844de2721',
    mode: 'settings',
    settings: {
      commonresources: {
        netsuiteConnectionId: '5a2e4cc751fe9e2d7c1c3bac',
        nsUtilImportAdaptorId: '5a2e4cc78147dd5f5cf8d6fa',
        nsUtilImportAdaptorApiIdentifier: 'i156aefd90',
      },
      storemap: [
        {
          shopname: 'QA_Store',
          email: 'demostore@netsuite.com',
          apiIdentifier: '',
          bigcommerceConnection: '5de5137307f3ae41e0ebd4d4',
          shopInstallComplete: 'true',
          shopid: 'g3uzz5c7jx',
          massUpdateImportAdaptorId: '5de5139d07f3ae41e0ebd4e4',
          apiIdentifierCustomerImport: 'ifdc3cc202',
          genericExportApiIdentifier: 'e9b9955ccf',
          productVariantsExportApiIdentifier: 'e1b6f03c6a',
          genericv3ExportApiIdentifier: 'e2fc3a0e2c',
          productIdsExportId: '5f13e3502e38dc1d31c377ec',
        },
      ],
      sections: [
        {
          shopInstallComplete: 'true',
          title: 'QA_Store',
          id: 'g3uzz5c7jx',
          sections: [
            {
              title: 'Fulfillment',
              columns: 1,
              flows: [
                {
                  _id: '5de513a007f3ae41e0ebd501',
                  showMapping: true,
                  showSchedule: true,
                },
              ],
              fields: [
                {
                  label: 'NetSuite Saved Search for syncing item fulfillments',
                  required: true,
                  value: '79256',
                  type: 'select',
                  name: 'exports_5de513a00bce564542847e2e_savedSearch_listSavedSearches',
                  supportsRefresh: true,
                  options: [
                    [
                      '79256',
                      'Celigo BigCommerce Fulfillment Export Search [QA Team1] Store',
                    ],
                  ],
                  properties: {
                    yieldValueAndLabel: true,
                  },
                },
              ],
            },
          ],
        },
      ],
      supportsMultiStore: true,
      storeLabel: 'BigCommerce Store',
      connectorEdition: 'standard',
      editionMigrated: 'true',
      defaultSectionId: 'defaultstoreid',
      general: [
        {
          id: 'g3uzz5c7jx',
          title: 'General',
          fields: [
            {
              label: 'Your store',
              value: 'g3uzz5c7jx',
              type: 'select',
              name: 'general_g3uzz5c7jx_storeName_updateStoreName',
              tooltip: 'TooltipText',
              options: [
                [
                  'g3uzz5c7jx',
                  'Option1',
                ],
              ],
              disabled: true,
              supportsRefresh: true,
              properties: {
                yieldValueAndLabel: true,
              },
            },
          ],
        },
      ],
    },
  },
  {
    _id: '5a2e4cc68147dd5f5cf8d6f9',
    lastModified: '2022-01-16T14:56:27.331Z',
    name: 'BigCommerce - NetSuite',
    _connectorId: '56fbb1176691821844de2721',
    mode: 'settings',
    settings: {
      commonresources: {
        netsuiteConnectionId: '5a2e4cc751fe9e2d7c1c3bac',
        nsUtilImportAdaptorId: '5a2e4cc78147dd5f5cf8d6fa',
        nsUtilImportAdaptorApiIdentifier: 'i156aefd90',
      },
      storemap: [
        {
          shopname: 'QA_Store',
          email: 'demostore@netsuite.com',
          apiIdentifier: '',
          bigcommerceConnection: '5de5137307f3ae41e0ebd4d4',
          shopInstallComplete: 'true',
          shopid: 'g3uzz5c7jx',
          massUpdateImportAdaptorId: '5de5139d07f3ae41e0ebd4e4',
          apiIdentifierCustomerImport: 'ifdc3cc202',
          genericExportApiIdentifier: 'e9b9955ccf',
          productVariantsExportApiIdentifier: 'e1b6f03c6a',
          genericv3ExportApiIdentifier: 'e2fc3a0e2c',
          productIdsExportId: '5f13e3502e38dc1d31c377ec',
        },
      ],
      sections: [
        {
          shopInstallComplete: 'true',
          title: 'QA_Store',
          id: 'g3uzz5c7jx',
          sections: [
            {
              title: 'Fulfillment',
              columns: 1,
              flows: [
                {
                  _id: '5de513a007f3ae41e0ebd501',
                  showMapping: true,
                  showSchedule: true,
                },
              ],
              fields: [
                {
                  label: 'NetSuite Saved Search for syncing item fulfillments',
                  required: true,
                  value: '79256',
                  type: 'select',
                  name: 'exports_5de513a00bce564542847e2e_savedSearch_listSavedSearches',
                  supportsRefresh: true,
                  options: [
                    [
                      '79256',
                      'Celigo BigCommerce Fulfillment Export Search [QA Team1] Store',
                    ],
                  ],
                  properties: {
                    yieldValueAndLabel: true,
                  },
                },
              ],
            },
          ],
        },
      ],
      supportsMultiStore: true,
      storeLabel: 'BigCommerce Store',
      connectorEdition: 'standard',
      editionMigrated: 'true',
      defaultSectionId: 'defaultstoreid',
      general: [
        {
          id: 'g3uzz5c7jx',
          title: 'General',
          fields: [
            {
              label: 'Your store',
              value: 'g3uzz5c7jx',
              type: 'select',
              name: 'general_g3uzz5c7jx_storeName_updateStoreName',
              tooltip: 'TooltipText',
              options: [
                [
                  'g3uzz5c7jx',
                  'Option1',
                ],
              ],
              disabled: true,
              supportsRefresh: true,
              properties: {
                yieldValueAndLabel: true,
              },
            },
          ],
        },
      ],
    },
  },
  {
    _id: '5ff579d745ceef7dcd797777',
    lastModified: '2021-01-19T06:34:17.222Z',
    name: " AFE 2.0 refactoring for DB's",
    install: [],
    sandbox: false,
    _registeredConnectionIds: [
      '5cd51efd3607fe7d8eda9c97',
      '5ff57a8345ceef7dcd797c21',
    ],
    settings: {supportsMultiStore: true, storeLabel: 'someStoreLabel'},
    installSteps: [],
    uninstallSteps: [],
    flowGroupings: [],
    createdAt: '2021-01-06T08:50:31.935Z',
  },
  {
    _id: '5a2e4cc68147dd5f5cfdddd',
    name: 'BigCommerce - NetSuite',
    settings: {
      sections: [
        {
          shopInstallComplete: 'true',
          title: 'QA_Store',
          id: 'someChildId',
          sections: [
            {
              title: 'SomeTitle',
              columns: 1,
              flows: [
                {
                  _id: '5de513a007f3ae41e0ebd501',
                  showMapping: true,
                  showSchedule: true,
                },
              ],
              fields: [
                {
                  label: 'SomeLabel',
                  required: true,
                  value: '79256',
                  type: 'select',
                  name: 'exports_5de513a00bce564542847e2e_savedSearch_listSavedSearches',
                  supportsRefresh: true,
                  options: [
                    [
                      '79256',
                      'SomeOption1',
                    ],
                    [
                      '79257',
                      'SomeOption2',
                    ],
                  ],
                  properties: {
                    yieldValueAndLabel: true,
                  },
                },
              ],
            },
          ],
        },
      ],
      supportsMultiStore: true,
      storeLabel: 'BigCommerce Store',
    },
  },
  {
    _id: '5a2e4cccc147dd5f5cfdddd',
    lastModified: '2022-01-16T14:56:27.331Z',
    name: 'BigCommerce - NetSuite',
    _connectorId: '56fbb1176691821844de2721',
    mode: 'settings',
    settings: {
      commonresources: {
        netsuiteConnectionId: '5a2e4cc751fe9e2d7c1c3bac',
        nsUtilImportAdaptorId: '5a2e4cc78147dd5f5cf8d6fa',
        nsUtilImportAdaptorApiIdentifier: 'i156aefd90',
      },
      sections: [
        {
          shopInstallComplete: 'true',
          title: 'QA_Store',
          id: 'g3uzz5c7jx',
          sections: [
            {
              title: 'Fulfillment',
              columns: 1,
              flows: [
                {
                  _id: '5de513a007f3ae41e0ebd501',
                  showMapping: true,
                  showSchedule: true,
                },
              ],
              fields: [
                {
                  label: 'NetSuite Saved Search for syncing item fulfillments',
                  required: true,
                  value: '79256',
                  type: 'select',
                  name: 'exports_5de513a00bce564542847e2e_savedSearch_listSavedSearches',
                  supportsRefresh: true,
                  options: [
                    [
                      '79256',
                      'Celigo BigCommerce Fulfillment Export Search [QA Team1] Store',
                    ],
                  ],
                  properties: {
                    yieldValueAndLabel: true,
                  },
                },
              ],
            },
          ],
        },
      ],
      supportsMultiStore: true,
      storeLabel: 'BigCommerce Store',
      connectorEdition: 'standard',
      editionMigrated: 'true',
      defaultSectionId: 'defaultstoreid',
      general: [
        {
          id: 'g3uzz5c7jx',
          title: 'General',
          fields: [
            {
              label: 'Some Lable for general',
              value: 'g3uzz5c7jx',
              type: 'select',
              name: 'general_g3uzz5c7jx_storeName_updateStoreName',
              tooltip: 'SomeToolTipText',
              options: [
                [
                  'g3uzz5c7jx',
                  'Option1',
                ],
                [
                  'g3uzz5c7jy',
                  'Option2',
                ],
              ],
            },
          ],
        },
      ],
    },
    version: '1.15.1',
    tag: 'IO-20802',
    updateInProgress: false,
    _registeredConnectionIds: [],
    installSteps: [],
    uninstallSteps: [],
    flowGroupings: [],
    createdAt: '2017-12-11T09:15:50.903Z',
  },
  {
    _id: '61dedf725c907e4eac13af03',
    lastModified: '2022-01-12T17:27:49.551Z',
    name: 'Clone - Employee Onboarding and Offboarding for SAP SuccessFactors@new',
    description: 'For companies using SAP SuccessFactors as the central hub, this Business Process Automation provides a seamless onboarding and offboarding employee experience to multiple applications like Microsoft Azure AD, Okta, SAP Concur, and ServiceNow.',
    install: [],
    mode: 'settings',
    version: '1.0.0',
    tag: 'Clone - Employee Onboarding and Offboarding for SAP SuccessFactors@new',
    sandbox: false,
    _templateId: '61b9d5d2f1447d5e7f8e0c6f',
    preSave: {
      function: 'processHire2RetireSAPSFSettingSave',
      _scriptId: '61dedf725c907e4eac13af00',
    },
    uninstallSteps: [],
    flowGroupings: [
      {
        name: 'Provisioning',
        _id: '61b9d5803deb5437e2dfaadc',
        settingsForm: {
          init: {
            _scriptId: '61dedf725c907e4eac13af00',
            function: 'initProvisionSettings',
          },
        },
      },
      {
        name: 'Deprovisioning',
        _id: '61b9d5803deb5437e2dfaadd',
        settingsForm: {
          init: {
            _scriptId: '61dedf725c907e4eac13af00',
            function: 'initDeprovisionSettings',
          },
        },
      },
    ],
    createdAt: '2022-01-12T14:02:26.330Z',
  },
  {
    _id: '61dedf725c907e4eac13af04',
    lastModified: '2022-01-12T17:27:49.551Z',
    name: 'Clone - Employee Onboarding and Offboarding for SAP SuccessFactors@new',
    description: 'SomeDescription',
    install: [],
    installSteps: ['2'],
    mode: 'settings',
    version: '1.0.0',
    tag: 'Clone - Employee Onboarding and Offboarding for SAP SuccessFactors@new',
    sandbox: false,
    _templateId: '61b9d5d2f1447d5e7f8e0c6f',
    preSave: {
      function: 'processHire2RetireSAPSFSettingSave',
      _scriptId: '61dedf725c907e4eac13af00',
    },
    uninstallSteps: [],
    flowGroupings: [
      {
        name: 'Provisioning',
        _id: '61b9d5803deb5437e2dfaadc',
        settingsForm: {
          init: {
            _scriptId: '61dedf725c907e4eac13af00',
            function: 'initProvisionSettings',
          },
        },
      },
      {
        name: 'Deprovisioning',
        _id: '61b9d5803deb5437e2dfaadd',
        settingsForm: {
          init: {
            _scriptId: '61dedf725c907e4eac13af00',
            function: 'initDeprovisionSettings',
          },
        },
      },
    ],
    createdAt: '2022-01-12T14:02:26.330Z',
  },
]);
