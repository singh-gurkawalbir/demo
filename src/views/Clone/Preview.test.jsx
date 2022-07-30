/* global describe, test, expect, jest, beforeEach, afterEach */
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, cleanup, waitForElementToBeRemoved } from '@testing-library/react';
import * as reactRedux from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import ClonePreview from './Preview';
import { reduxStore, renderWithProviders } from '../../test/test-utils';
import { runServer } from '../../test/api/server';

let initialStore;

function initStore(integrationSession) {
  initialStore.getState().data.resources.integrations = [
    {
      _id: '5fc5e0e66cfe5b44bb95de70',
      lastModified: '2022-07-27T11:14:41.700Z',
      name: '3PL Central',
      description: 'Testing Integration description',
      readme: 'https://staging.integrator.io/integrations/5fc5e0e66cfe5b44bb95de70/admin/readme/edit/readme ',
      install: [],
      sandbox: false,
      _registeredConnectionIds: [
        '5d529bfbdb0c7b14a6011a57',
        '5fc5e4a46cfe5b44bb95df44',
      ],
      installSteps: [],
      uninstallSteps: [],
      flowGroupings: [],
      createdAt: '2020-12-01T06:21:26.538Z',
    },
    {
      _id: '6294909fd5391a2e79b38eff',
      lastModified: '2022-06-01T10:21:47.332Z',
      name: 'Salesforce - NetSuite',
      _connectorId: '5b61ae4aeb538642c26bdbe6',
      install: [
        {
          name: 'Configure Salesforce connection',
          description: "Lets you create a connection with Salesforce. You can authenticate your connection either using the <b>Refresh Token</b> or <b>JWT Bearer Token</b> option. Once you allow access with your Salesforce account credentials, you won't be able to change the account or account type. For more information, see <a href = 'https://docs.celigo.com/hc/en-us/articles/360045063772-React-Install-Salesforce-NetSuite-IO-Integration-App#Configure_Salesforce_connection'>Configure Salesforce connection</a>.",
          imageURL: '/images/company-logos/salesforce.png',
          completed: true,
          installerFunction: 'verifyProductConnection',
          uninstallerFunction: 'deleteSalesforceConnection',
          _connectionId: '629490a0ccb94d35de693598',
        },
        {
          name: 'Install integrator.io package in Salesforce',
          description: "Lets you install the integrator.io distributed adaptor package. It is recommended to install using the <b>Install for All Users</b> option. After you install, an email is sent and you can find the installed package on the Salesforce > Installed Packages page. Verify your package after installation. For more information, see <a href = 'https://docs.celigo.com/hc/en-us/articles/360045063772-React-Install-Salesforce-NetSuite-IO-Integration-App#Install_integrator.io_package_in_Salesforce'>Install integrator.io package in Salesforce</a>.",
          imageURL: '/images/company-logos/salesforce.png',
          installURL: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/packaging/installPackage.apexp?p0=04t3m000002Komn',
          completed: true,
          installerFunction: 'verifyIntegratorPackageInSF',
          uninstallerFunction: 'uninstallVerifySalesforceBundle',
        },
        {
          name: 'Install NetSuite package in Salesforce',
          description: "Lets you install the NetSuite package. It is recommended to install using the <b>Install for All Users</b> option. After you install, an email is sent and you can find the installed package on the Salesforce > Installed Packages page. Verify your package after installation. For more information, see <a href = 'https://docs.celigo.com/hc/en-us/articles/360045063772-React-Install-Salesforce-NetSuite-IO-Integration-App#Install_NetSuite_package_in_Salesforce'>Install NetSuite package in Salesforce</a>.",
          imageURL: '/images/company-logos/salesforce.png',
          installURL: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/packaging/installPackage.apexp?p0=04t5a000001rCO9',
          completed: true,
          installerFunction: 'verifyConnectorPackageInSF',
          uninstallerFunction: 'uninstallVerifySalesforceBundle',
        },
        {
          name: 'Configure NetSuite connection',
          description: "Lets you create a connection with NetSuite. You can authenticate your connection either using the basic, token, or automatic token options. We recommend you to use any of the token based authentication methods. For token based authentication, create an access token in NetSuite. After you configure, you won't be able to change NetSuite environment and account.  For more information, see <a href = 'https://docs.celigo.com/hc/en-us/articles/360045063772-React-Install-Salesforce-NetSuite-IO-Integration-App#Configure_NetSuite_connection'>Configure NetSuite connection</a>.",
          imageURL: '/images/company-logos/netsuite.png',
          completed: true,
          installerFunction: 'verifyNetSuiteConnection',
          uninstallerFunction: 'deleteNetSuiteConnection',
          _connectionId: '6294909fccb94d35de693596',
        },
        {
          name: 'Install integrator.io bundle in NetSuite',
          description: "Lets you install the integrator.io bundle (20038) in NetSuite. It is a common bundle across all integration apps. Verify the bundle. If you already have a bundle installed, it is either updated or auto-verified. It is recommended to update and verify the bundle from NetSuite > Installed Bundles page. For more information, see <a href = 'https://docs.celigo.com/hc/en-us/articles/360045063772-React-Install-Salesforce-NetSuite-IO-Integration-App#Install_integrator.io_bundle_in_NetSuite'>Install integrator.io bundle in NetSuite</a>.",
          imageURL: '/images/company-logos/netsuite.png',
          installURL: 'https://tstdrv1934805.app.netsuite.com/app/bundler/bundledetails.nl?sourcecompanyid=TSTDRV840460&domain=PRODUCTION&config=F&id=20037',
          completed: true,
          installerFunction: 'verifyIntegratorBundleInstallation',
          uninstallerFunction: 'uninstallVerifySalesforceBundle',
        },
        {
          name: 'Install Salesforce SuiteApp in NetSuite',
          description: "Lets you install the Salesforce SuiteApp in NetSuite. You can install and verify the SuiteApp in NetSuite. For more information, see <a href = 'https://docs.celigo.com/hc/en-us/articles/360045063772-React-Install-Salesforce-NetSuite-IO-Integration-App#Install_Salesforce_SuiteApp_in_NetSuite'>Install Salesforce SuiteApp in NetSuite</a>.",
          imageURL: '/images/company-logos/netsuite.png',
          installURL: 'https://tstdrv1934805.app.netsuite.com/suiteapp/ui/marketplace.nl?whence=#/app?id=com.celigo.salesforceio',
          completed: true,
          installerFunction: 'verifyProductBundleInstallation',
          uninstallerFunction: 'uninstallVerifySalesforceBundle',
        },
      ],
      mode: 'settings',
      settings: {
        commonresources: {
          imports: [
            '6294aa2fd5391a2e79b3a0b8',
            '6294aa3cccb94d35de694808',
          ],
          exports: [
            '6294aa2eccb94d35de6947d2',
          ],
          savedSearches: [
            null,
          ],
          flows: [
            '6294aa3dccb94d35de69481e',
          ],
          netsuiteConnectionId: '6294909fccb94d35de693596',
          salesforceConnectionId: '629490a0ccb94d35de693598',
        },
        configs: {
          netsuite_item_to_salesforce_product_import: {
            apiId: 'i8fb391f04',
            id: '6294aa2fccb94d35de6947d4',
          },
          salesforce_account_to_netsuite_customer_import: {
            id: '6294aa2fccb94d35de6947d7',
            apiId: 'icc96bf06a',
          },
          netsuite_customer_to_salesforce_account_import: {
            apiId: 'i4a5c39b2d',
          },
          tag: '',
          netsuite_item_group_to_salesforce_product_import: '6294aa2ed5391a2e79b3a0ab',
          salesforce_opportunity_to_netsuite_salesorder_flow: '6294aa3cd5391a2e79b3a0ea',
          salesforce_opportunity_to_netsuite_salesorder_export: '6294aa2fd5391a2e79b3a0c3',
          salesforce_attachment_to_netsuite_order_attachments_export: '6294aa2fccb94d35de6947d8',
          netsuite_salesorder_id_writeback_export: '6294aa2fccb94d35de6947dc',
          salesforce_to_netsuite_flow_run_status_export: '6294aa2fd5391a2e79b3a0c1',
          netsuite_to_salesforce_flow_run_status_export: '6294aa2fccb94d35de6947da',
          salesforce_account_id_writeback_import: 'i13702c012',
          salesforce_attachment_to_netsuite_order_attachments_flow: '6294aa3cd5391a2e79b3a0ed',
          salesforce_contentdocument_to_netsuite_file_export: '6294aa2fccb94d35de6947df',
          salesforce_attachment_to_netsuite_file_export: '6294aa2ed5391a2e79b3a0ac',
          salesforce_attachment_to_netsuite_file_import: '6294aa2fd5391a2e79b3a0bb',
          salesforce_opportunity_to_netsuite_salesorder_import: '6294aa2ed5391a2e79b3a0ad',
          netsuite_financials_to_salesforce_financials_export: '6294aa3cccb94d35de69480d',
          salesforce_attachment_to_netsuite_so_fileattach: '6294aa2eccb94d35de6947cd',
          export_v2_io_configurations: '6294aa2eccb94d35de6947d1',
          salesforce_file_to_netsuite_file_export: '6294aa2fccb94d35de6947e2',
        },
        sections: [
          {
            title: 'Contact',
            flows: [
              {
                _id: '6294aa3dccb94d35de69481e',
                showMapping: true,
                showSchedule: false,
                settings: [
                  {
                    label: 'Criteria for NetSuite Contact Sync',
                    type: 'expression',
                    expressionType: 'export',
                    required: true,
                    name: 'exports_6294aa2eccb94d35de6947d2_contactqualifier',
                    tooltip: 'This setting allows to set the criteria for NetSuite Contacts which need be synced to Salesforce. The default qualification criteria should not be removed. You can have additional criteria to sync NetSuite Contacts to Salesforce.',
                    value: '["val:company","empty",false]',
                  },
                  {
                    label: 'Contact Lookup Criteria in Salesforce',
                    type: 'expression',
                    expressionType: 'import',
                    required: true,
                    name: 'imports_6294aa2fd5391a2e79b3a0b8_salesforceQualifier',
                    tooltip: 'This setting defines the lookup criteria that the integration app will use to determine if a record already exists in Salesforce or not.',
                    value: '((celigo_sfnsio__NetSuite_Id__c = {{{string internalid}}}) OR ((Email = {{{email email}}}) AND (AccountId = {{{reference salesforce_company_Id}}})))',
                  },
                ],
              },
            ],
          },
        ],
        general: [
          {
            title: 'General',
            fields: [
              {
                generates: [
                  null,
                ],
                extracts: [
                  {
                    id: '6',
                    text: 'Australian Dollars',
                  },
                  {
                    id: '2',
                    text: 'British Pounds',
                  },
                  {
                    id: '3',
                    text: 'Canadian Dollar',
                  },
                  {
                    id: '8',
                    text: 'Danish Krone',
                  },
                  {
                    id: '4',
                    text: 'Euro',
                  },
                  {
                    id: '5',
                    text: 'Indian Rupees',
                  },
                  {
                    id: '9',
                    text: 'Japanese Yen',
                  },
                  {
                    id: '10',
                    text: 'Mexican Peso',
                  },
                  {
                    id: '7',
                    text: 'Singapore Dollars',
                  },
                  {
                    id: '1',
                    text: 'U.S. Dollar',
                  },
                ],
                allowFailures: true,
                supportsGeneratesRefresh: true,
                supportsExtractsRefresh: true,
                hideLookupAllowFailures: true,
                generateFieldHeader: 'Salesforce Currency',
                extractFieldHeader: 'NetSuite Currency',
                label: 'Map NetSuite Currency to Salesforce Currency',
                title: 'Map NetSuite Currency to Salesforce Currency',
                tooltip: '',
                name: 'general_state_mapCurrencies_listNSCurrency_listSFCurrency',
                type: 'staticMapWidget',
                properties: {
                  sectionName: 'Currency',
                },
              },
              {
                label: 'Unique key for an Item in NetSuite',
                value: 'itemid',
                tooltip: "Select the NetSuite field that holds the unique key for an Item. The unique key should have matching values in Salesforce and NetSuite. We recommend that you select 'Item Name/Number'.\nFor more information on usage of this feature, refer <a href=\"https://celigosuccess.zendesk.com/hc/en-us/articles/360033312132\"> here</a>.",
                type: 'select',
                name: 'general_state_invokeSKUFieldsAction_listNSItemMetadata',
                supportsRefresh: true,
                properties: {
                  sectionName: 'Product Discovery',
                  yieldValueAndLabel: true,
                },
                options: [
                  [
                    'itemid',
                    'Name',
                  ],
                ],
              },
              {
                label: 'Unique key for a Product in Salesforce',
                value: 'ProductCode',
                tooltip: "Select the Salesforce field that holds a unique key for each Product. The unique key should have matching values in Salesforce and NetSuite. We recommend that you select 'Product Code'.\nFor more information on usage of this feature, refer <a href=\"https://celigosuccess.zendesk.com/hc/en-us/articles/360033312132\"> here</a>.",
                type: 'select',
                name: 'general_state_invokeSKUFieldsAction_listSFProductMetadata',
                supportsRefresh: true,
                properties: {
                  sectionName: 'Product Discovery',
                  yieldValueAndLabel: true,
                },
                options: [
                  [
                    'ProductCode',
                    'Product Code',
                  ],
                ],
              },
              {
                label: 'Track discount items using',
                type: 'select',
                name: 'general_state_setFieldValue_listDiscountItems',
                supportsRefresh: true,
                options: [],
                tooltip: 'This preference provides a choice for the default NetSuite discount item against which all the line-level discounts are posted. The item-based discounts are reflected on the NetSuite sales transactions right below the original line item as a separate line item',
                properties: {
                  sectionName: 'Discount',
                  yieldValueAndLabel: true,
                },
              },
              {
                label: 'Migrate configuration from v2 to IO',
                required: false,
                value: false,
                tooltip: 'Enable the checkbox to migrate configurations from Salesforce NetSuite Integration App version v2 to IO. We recommend that you use this setting along with "Test Mode" or "Go-Live date" to concurrently run both the versions of the Integration App. If you do not enable the checkbox, we will use the default configuration.\nFor more information on usage of this feature, refer <a href="https://celigosuccess.zendesk.com/hc/en-us/sections/360007894052-Migration-Utility"> here</a>.',
                type: 'checkbox',
                name: 'general_state_migrateFlowSettings',
                dependencies: {
                  disabled: {
                    fields: [
                      {
                        name: 'general_state_cutoffdate',
                        hidden: true,
                        required: false,
                      },
                      {
                        name: 'general_state_cutofftimezone_refreshTimeZoneList',
                        hidden: true,
                        required: false,
                      },
                    ],
                  },
                  enabled: {
                    fields: [
                      {
                        name: 'general_state_cutoffdate',
                        hidden: false,
                        required: false,
                      },
                      {
                        name: 'general_state_cutofftimezone_refreshTimeZoneList',
                        hidden: false,
                        required: false,
                      },
                    ],
                  },
                },
                properties: {
                  sectionName: 'V2 To IO Migration',
                },
              },
              {
                label: 'Set Go-Live date',
                required: false,
                value: '',
                tooltip: 'The "Go-Live date" is the day when you turn off the test mode and your Integration App is operational. Once you set the "Go-Live date" all record-level buttons and checkboxes for records synced via version v2 are disabled. Order transactions mentioned below sync via IO version after this day: \n 1. Closed Opportunities\n 2. Created Orders\n 3. Fulfilled Transactions \nOrder transactions on or before the "Go-Live date" sync via version v2.',
                type: 'date',
                name: 'general_state_cutoffdate',
                properties: {
                  sectionName: 'V2 To IO Migration',
                },
              },
              {
                label: 'Set go-live time zone',
                value: 'America/Los_Angeles',
                tooltip: 'Set the go-live time zone for the integration app. The default go-live time zone is (GMT-8) Pacific Time (US & Canada).',
                type: 'select',
                name: 'general_state_cutofftimezone_refreshTimeZoneList',
                supportsRefresh: true,
                properties: {
                  yieldValueAndLabel: true,
                  sectionName: 'V2 To IO Migration',
                },
                options: [
                  [
                    'America/Los_Angeles',
                    '(GMT-08:00) Pacific Time (US & Canada)',
                  ],
                ],
              },
              {
                label: 'Enable test mode',
                required: false,
                value: false,
                tooltip: 'When Enable Test Mode checkbox is checked, the records that are eligible for testing can be synced between Salesforce and NetSuite. If it is disabled, all of the live records are synced between Salesfoce and NetSuite. When the “Send as test record to IO” checkbox is checked in Salesforce or NetSuite on the records, these records are eligible to sync to IO.',
                type: 'checkbox',
                name: 'general_state_testmode',
              },
            ],
          },
        ],
        connectorEdition: 'premium',
        editionMigrated: 'true',
      },
      version: '1.11.0',
      sandbox: false,
      _registeredConnectionIds: [],
      installSteps: [],
      uninstallSteps: [],
      flowGroupings: [],
      createdAt: '2022-05-30T09:38:39.354Z',
    },
  ];
  initialStore.getState().data.resources.flows = [
    {
      _id: '60db46af9433830f8f0e0fe7',
      lastModified: '2021-06-30T02:36:49.734Z',
      name: '3PL Central - FTP',
      description: 'Testing Flows Description',
      disabled: false,
      _integrationId: '5fc5e0e66cfe5b44bb95de70',
      skipRetries: false,
      pageProcessors: [
        {
          responseMapping: {
            fields: [

            ],
            lists: [

            ],
          },
          type: 'import',
          _importId: '605b30767904202f31742092',
        },
      ],
      pageGenerators: [
        {
          _exportId: '60dbc5a8a706701ed4a148ac',
          skipRetries: false,
        },
      ],
      createdAt: '2021-06-29T16:13:35.071Z',
      lastExecutedAt: '2021-06-30T01:55:17.721Z',
    },
    {
      _id: '6294aa3dccb94d35de69481e',
      lastModified: '2022-05-30T11:27:58.128Z',
      name: 'NetSuite Contact to Salesforce Contact Add/Update',
      description: 'Syncs records present in NetSuite Contacts as Salesforce Contacts in real-time. This flow triggers when an update is made to a contact or a new contact is created for a customer that has Salesforce ID present in it. When a new contact is created in NetSuite and is synced successfully to Salesforce, the flow writes back its Salesforce ID to NetSuite contact.',
      disabled: true,
      _integrationId: '6294909fd5391a2e79b38eff',
      _connectorId: '5b61ae4aeb538642c26bdbe6',
      skipRetries: false,
      pageProcessors: [
        {
          type: 'import',
          _importId: '6294aa2fd5391a2e79b3a0b8',
          responseMapping: {
            lists: [],
            fields: [
              {
                extract: 'id',
                generate: 'Salesforce Contact Id',
              },
            ],
          },
        },
        {
          responseMapping: {
            fields: [],
            lists: [],
          },
          type: 'import',
          _importId: '6294aa3cccb94d35de694808',
        },
      ],
      pageGenerators: [
        {
          _exportId: '6294aa2eccb94d35de6947d2',
        },
      ],
      createdAt: '2022-05-30T11:27:57.968Z',
      externalId: 'netsuite_contact_to_salesforce_contact_flow',
      autoResolveMatchingTraceKeys: true,
    },
  ];
  initialStore.getState().data.resources.exports = [
    {
      _id: '60dbc5a8a706701ed4a148ac',
      createdAt: '2021-06-30T01:15:20.177Z',
      lastModified: '2021-06-30T02:36:51.936Z',
      name: 'Test 3pl central export',
      description: 'Test 3PL central export description',
      _connectionId: '5fc5e4a46cfe5b44bb95df44',
      apiIdentifier: 'ec742bc9b0',
      asynchronous: true,
      assistant: '3plcentral',
      sandbox: false,
      assistantMetadata: {
        resource: 'orders',
        version: 'latest',
        operation: 'get_packages_details',
      },
      http: {
        relativeURI: '/orders/3862/packages',
        method: 'GET',
        successMediaType: 'json',
        errorMediaType: 'json',
        formType: 'assistant',
      },
      rawData: '5d4010e14cd24a7c773122ef5d92fdf3fcca446b9e5ac853c6287f70',
      adaptorType: 'HTTPExport',
    },
    {
      _id: '6294aa2eccb94d35de6947d2',
      createdAt: '2022-05-30T11:27:42.954Z',
      lastModified: '2022-05-30T11:27:44.488Z',
      name: 'Get Contacts From NetSuite',
      _connectionId: '6294909fccb94d35de693596',
      _integrationId: '6294909fd5391a2e79b38eff',
      _connectorId: '5b61ae4aeb538642c26bdbe6',
      externalId: 'netsuite_contact_to_salesforce_contact_export',
      apiIdentifier: 'e158f37624',
      asynchronous: true,
      type: 'distributed',
      parsers: [],
      distributed: {
        bearerToken: '******',
      },
      netsuite: {
        type: 'distributed',
        skipGrouping: false,
        statsOnly: false,
        restlet: {
          criteria: [],
          columns: [],
        },
        distributed: {
          recordType: 'contact',
          executionContext: [
            'csvimport',
            'custommassupdate',
            'offlineclient',
            'portlet',
            'scheduled',
            'suitelet',
            'userevent',
            'userinterface',
            'webservices',
            'webstore',
            'workflow',
          ],
          disabled: true,
          executionType: [
            'create',
            'edit',
            'xedit',
          ],
          qualifier: [
            'val:company',
            'empty',
            false,
          ],
          sublists: [
            'addressbook',
          ],
          forceReload: false,
          skipExportFieldId: 'custentity_celigo_sfio_skip_export_to_sf',
          hooks: {
            preSend: {
              fileInternalId: 'SuiteApps/com.celigo.salesforceio/build/Celigo_SalesforceIOConnector.closure.js',
              function: 'netsuiteContactExportPreSendHook',
            },
          },
        },
      },
      adaptorType: 'NetSuiteExport',
    },
  ];
  initialStore.getState().data.resources.imports = [
    {
      _id: '605b30767904202f31742092',
      createdAt: '2021-03-24T12:28:38.813Z',
      lastModified: '2021-04-29T15:37:16.667Z',
      name: 'FTP Import 1',
      description: 'Test FTP import description',
      _connectionId: '5d529bfbdb0c7b14a6011a57',
      distributed: false,
      apiIdentifier: 'if1d74ac06',
      oneToMany: false,
      sandbox: false,
      file: {
        fileName: 'walmart-canada-pagination.json',
        type: 'json',
      },
      ftp: {
        directoryPath: '/ChaitanyaReddyMule/Connector_dev',
        fileName: 'walmart-canada-pagination.json',
      },
      adaptorType: 'FTPImport',
    },
    {
      _id: '6294aa3cccb94d35de694808',
      createdAt: '2022-05-30T11:27:56.745Z',
      lastModified: '2022-05-30T11:27:57.238Z',
      name: 'Salesforce Contact Id Write Back to NetSuite',
      parsers: [],
      _connectionId: '6294909fccb94d35de693596',
      _integrationId: '6294909fd5391a2e79b38eff',
      _connectorId: '5b61ae4aeb538642c26bdbe6',
      externalId: 'netsuite_contact_to_salesforce_contact_import_idwriteback',
      distributed: true,
      apiIdentifier: 'ia26181de1',
      lookups: [],
      netsuite_da: {
        operation: 'update',
        recordType: 'contact',
        internalIdLookup: {
          expression: '["internalid","is","{{{internalid}}}"]',
        },
        lookups: [],
        mapping: {
          fields: [
            {
              generate: 'custentity_celigo_sfio_sf_id',
              extract: 'Salesforce Contact Id',
              discardIfEmpty: false,
            },
            {
              generate: 'custentity_celigo_sfio_skip_export_to_sf',
              hardCodedValue: 'true',
              discardIfEmpty: false,
            },
          ],
          lists: [],
        },
      },
      filter: {
        type: 'expression',
        expression: {
          rules: [
            'empty',
            [
              'string',
              [
                'extract',
                'custentity_celigo_sfio_sf_id',
              ],
            ],
          ],
          version: '1',
        },
        version: '1',
        rules: [
          'empty',
          [
            'string',
            [
              'extract',
              'custentity_celigo_sfio_sf_id',
            ],
          ],
        ],
      },
      adaptorType: 'NetSuiteDistributedImport',
    },
    {
      _id: '6294aa2fd5391a2e79b3a0b8',
      createdAt: '2022-05-30T11:27:43.058Z',
      lastModified: '2022-05-30T11:27:44.870Z',
      name: 'Post Contacts to Salesforce',
      parsers: [],
      _connectionId: '629490a0ccb94d35de693598',
      _integrationId: '6294909fd5391a2e79b38eff',
      _connectorId: '5b61ae4aeb538642c26bdbe6',
      externalId: 'netsuite_contact_to_salesforce_contact_import',
      distributed: false,
      apiIdentifier: 'i11bdac975',
      hooks: {
        postSubmit: {
          function: 'netSuiteContactPostSubmitHook',
        },
      },
      idLockTemplate: '{{{id}}}',
      lookups: [],
      mapping: {
        fields: [
          {
            extract: 'internalid',
            generate: 'celigo_sfnsio__NetSuite_Id__c',
          },
          {
            extract: 'salesforce_company_Id',
            generate: 'AccountId',
          },
          {
            extract: 'salutation',
            generate: 'Salutation',
          },
          {
            extract: 'firstname',
            generate: 'FirstName',
          },
          {
            extract: 'lastname',
            generate: 'LastName',
          },
          {
            extract: 'email',
            generate: 'Email',
          },
          {
            extract: 'homephone',
            generate: 'HomePhone',
          },
          {
            extract: 'mobilephone',
            generate: 'MobilePhone',
          },
          {
            generate: 'celigo_sfnsio__Skip_Export_To_NetSuite__c',
            hardCodedValue: 'true',
          },
          {
            extract: '{{_billingaddress_addr1}}\n{{_billingaddress_addr2}}',
            generate: 'MailingStreet',
          },
          {
            extract: '_billingaddress_city',
            generate: 'MailingCity',
          },
          {
            extract: '_billingaddress_state',
            generate: 'MailingState',
          },
          {
            extract: '_billingaddress_country.name',
            generate: 'MailingCountry',
          },
          {
            extract: '_billingaddress_zip',
            generate: 'MailingPostalCode',
          },
          {
            extract: 'comments',
            generate: 'Description',
          },
          {
            extract: 'phone',
            generate: 'Phone',
          },
          {
            extract: 'netsuiteRecordUrl',
            generate: 'celigo_sfnsio__NetSuite_Record__c',
          },
        ],
      },
      salesforce: {
        operation: 'addupdate',
        sObjectType: 'Contact',
        api: 'soap',
        idLookup: {
          whereClause: '((celigo_sfnsio__NetSuite_Id__c = {{{string internalid}}}) OR ((Email = {{{email email}}}) AND (AccountId = {{{reference salesforce_company_Id}}})))',
        },
        removeNonSubmittableFields: false,
      },
      adaptorType: 'SalesforceImport',
    },
  ];
  initialStore.getState().data.resources.connections = [
    {
      _id: '5d529bfbdb0c7b14a6011a57',
      createdAt: '2019-08-13T11:16:11.951Z',
      lastModified: '2022-06-24T11:44:40.123Z',
      type: 'ftp',
      name: 'FTP Connection',
      offline: true,
      debugDate: '2021-02-08T12:50:45.678Z',
      sandbox: false,
      ftp: {
        type: 'sftp',
        hostURI: 'celigo.files.com',
        username: 'chaitanyareddy.mule@celigo.com',
        password: '******',
        port: 22,
        usePassiveMode: true,
        userDirectoryIsRoot: false,
        useImplicitFtps: true,
        requireSocketReUse: false,
      },
      queues: [
        {
          name: '5d529bfbdb0c7b14a6011a57',
          size: 0,
        },
      ],
    },
    {
      _id: '5fc5e4a46cfe5b44bb95df44',
      createdAt: '2020-12-01T06:37:24.341Z',
      lastModified: '2022-07-27T18:02:24.948Z',
      type: 'http',
      name: '3PL Central Connection',
      assistant: '3plcentral',
      offline: false,
      debugDate: '2021-06-30T02:54:38.481Z',
      sandbox: false,
      debugUntil: '2021-06-30T02:54:38.481Z',
      http: {
        formType: 'assistant',
        _iClientId: '5fc5e169269ea947c166510c',
        mediaType: 'json',
        baseURI: 'https://secure-wms.com/',
        ping: {
          relativeURI: 'orders',
          method: 'GET',
          failValues: [],
          successValues: [],
        },
        rateLimit: {
          failValues: [],
        },
        unencrypted: {
          tpl: 'b779b82f-f5e5-4d59-a2c9-ea2c5eb8eec3',
          userLoginId: 'Celigo_SandBox',
        },
        auth: {
          type: 'oauth',
          failValues: [],
          oauth: {
            tokenURI: 'https://secure-wms.com/AuthServer/api/Token',
            scope: [],
            grantType: 'clientcredentials',
            clientCredentialsLocation: 'basicauthheader',
            accessTokenBody: '{"grant_type": "client_credentials","tpl":"{b779b82f-f5e5-4d59-a2c9-ea2c5eb8eec3}", "user_login_id":"Celigo_SandBox"}',
          },
          token: {
            token: '******',
            location: 'header',
            headerName: 'Authorization',
            scheme: 'Bearer',
            refreshMethod: 'POST',
            refreshMediaType: 'urlencoded',
          },
        },
      },
      queues: [
        {
          name: '5fc5e4a46cfe5b44bb95df44',
          size: 0,
        },
      ],
    },
    {
      _id: '6294909fccb94d35de693596',
      createdAt: '2022-05-30T09:38:39.897Z',
      lastModified: '2022-05-30T11:18:48.232Z',
      type: 'netsuite',
      name: 'NetSuite Connection [Salesforce - NetSuite (IO)]',
      offline: false,
      _connectorId: '5b61ae4aeb538642c26bdbe6',
      _integrationId: '6294909fd5391a2e79b38eff',
      externalId: 'netsuite_connection',
      netsuite: {
        account: 'TSTDRV1934805',
        roleId: '3',
        requestLevelCredentials: true,
        dataCenterURLs: {
          restDomain: 'https://tstdrv1934805.restlets.api.netsuite.com',
          webservicesDomain: 'https://tstdrv1934805.suitetalk.api.netsuite.com',
          systemDomain: 'https://tstdrv1934805.app.netsuite.com',
        },
        tokenId: '******',
        tokenSecret: '******',
        entityId: '141286',
        wsdlVersion: '2020.2',
        concurrencyLevel: 1,
        _iClientId: '5ece4d743a9a3466ec759bb4',
        suiteAppInstalled: false,
        authType: 'token-auto',
      },
      queues: [
        {
          name: '6294909fccb94d35de693596',
          size: 0,
        },
      ],
    },
    {
      _id: '629490a0ccb94d35de693598',
      createdAt: '2022-05-30T09:38:40.303Z',
      lastModified: '2022-07-28T10:55:31.583Z',
      type: 'salesforce',
      name: 'Salesforce Connection [Salesforce - NetSuite (IO)]',
      offline: false,
      _connectorId: '5b61ae4aeb538642c26bdbe6',
      _integrationId: '6294909fd5391a2e79b38eff',
      externalId: 'salesforce_connection',
      salesforce: {
        sandbox: false,
        baseURI: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com',
        oauth2FlowType: 'refreshToken',
        bearerToken: '******',
        refreshToken: '******',
        packagedOAuth: true,
        scope: [],
        concurrencyLevel: 5,
        _iClientId: '5e9d7e344242783b222f3653',
        info: {
          sub: 'https://login.salesforce.com/id/00D0K0000024M3QUAU/0050K000009m3BTQAY',
          user_id: '0050K000009m3BTQAY',
          organization_id: '00D0K0000024M3QUAU',
          preferred_username: 'srilekha_tirumala@celigo.com',
          nickname: 'srilekha_tirumala',
          name: 'Srilekha Tirumala',
          email: 'srilekha.tirumala@celigo.com',
          email_verified: true,
          given_name: 'Srilekha',
          family_name: 'Tirumala',
          zoneinfo: 'America/Los_Angeles',
          photos: {
            picture: 'https://d0k0000024m3quau-dev-ed--c.documentforce.com/profilephoto/005/F',
            thumbnail: 'https://d0k0000024m3quau-dev-ed--c.documentforce.com/profilephoto/005/T',
          },
          profile: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/0050K000009m3BTQAY',
          picture: 'https://d0k0000024m3quau-dev-ed--c.documentforce.com/profilephoto/005/F',
          address: {
            country: 'IN',
          },
          urls: {
            enterprise: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/Soap/c/{version}/00D0K0000024M3Q',
            metadata: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/Soap/m/{version}/00D0K0000024M3Q',
            partner: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/Soap/u/{version}/00D0K0000024M3Q',
            rest: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/data/v{version}/',
            sobjects: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/data/v{version}/sobjects/',
            search: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/data/v{version}/search/',
            query: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/data/v{version}/query/',
            recent: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/data/v{version}/recent/',
            tooling_soap: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/Soap/T/{version}/00D0K0000024M3Q',
            tooling_rest: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/data/v{version}/tooling/',
            profile: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/0050K000009m3BTQAY',
            feeds: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/data/v{version}/chatter/feeds',
            groups: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/data/v{version}/chatter/groups',
            users: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/data/v{version}/chatter/users',
            feed_items: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/data/v{version}/chatter/feed-items',
            feed_elements: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/data/v{version}/chatter/feed-elements',
            custom_domain: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com',
          },
          active: true,
          user_type: 'STANDARD',
          language: 'en_US',
          locale: 'en_US',
          utcOffset: -28800000,
          updated_at: '2020-11-18T06:44:33Z',
          is_app_installed: true,
        },
      },
      queues: [
        {
          name: '629490a0ccb94d35de693598',
          size: 0,
        },
      ],
    },
  ];
  initialStore.getState().user.preferences = {
    environment: 'production',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'h:mm:ss a',
    drawerOpened: true,
    expand: 'Resources',
    scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
    showReactSneakPeekFromDate: '2019-11-05',
    showReactBetaFromDate: '2019-12-26',
    defaultAShareId: 'own',
    fbBottomDrawerHeight: 301,
    lastLoginAt: '2022-01-25T07:36:20.829Z',
    dashboard: {
      tilesOrder: [
        '5fc5e0e66cfe5b44bb95de70',
      ],
      view: 'tile',
    },
    recentActivity: {
      production: {
        integration: '5fc5e0e66cfe5b44bb95de70',
        flow: '60db46af9433830f8f0e0fe7',
      },
    },
  };
  initialStore.getState().session.templates = integrationSession;
}

async function initClonePreview(props) {
  const ui = (
    <MemoryRouter
      initialEntries={[{ pathname: props.pathname }]}
        >
      <Route
        path="/clone/:resourceType/:resourceId/preview"
        params={{
          resourceId: props.match.params.resourceId,
          resourceType: props.match.params.resourceType,
        }}
        >
        <ClonePreview {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

jest.mock('../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/LoadResources'),
  default: newprops => (
    <div>{newprops.children}</div>
  ),
}
));

describe('Clone Preview', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = reduxStore;
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    cleanup();
  });
  test('Should able to access the Integration clone preview page', async () => {
    const props = {
      match: {
        params: {
          resourceId: '5fc5e0e66cfe5b44bb95de70',
          resourceType: 'integrations',
        },
      },
      pathname: '/clone/integrations/5fc5e0e66cfe5b44bb95de70/preview',
      history: {
        push: jest.fn(),
      },
    };
    const integrationSession = {
      'integrations-5fc5e0e66cfe5b44bb95de70': {
        preview: {
          components: {
            objects: [
              {
                model: 'Integration',
                doc: {
                  _id: '5fc5e0e66cfe5b44bb95de70',
                  lastModified: '2021-09-29T16:17:12.522Z',
                  name: '3PL Central',
                  description: 'Testing Integration Description',
                  readme: 'https://staging.integrator.io/integrations/5fc5e0e66cfe5b44bb95de70/admin/readme/edit/readme ',
                  install: [],
                  sandbox: false,
                  _registeredConnectionIds: [
                    '5d529bfbdb0c7b14a6011a57',
                    '5fc5e4a46cfe5b44bb95df44',
                  ],
                  installSteps: [],
                  uninstallSteps: [],
                  flowGroupings: [],
                  createdAt: '2020-12-01T06:21:26.538Z',
                },
              },
              {
                model: 'Flow',
                doc: {
                  _id: '60db46af9433830f8f0e0fe7',
                  lastModified: '2021-06-30T02:36:49.734Z',
                  name: '3PL Central - FTP',
                  description: 'Testing flows Description',
                  disabled: false,
                  _integrationId: '5fc5e0e66cfe5b44bb95de70',
                  skipRetries: false,
                  pageProcessors: [
                    {
                      responseMapping: {
                        fields: [],
                        lists: [],
                      },
                      type: 'import',
                      _importId: '605b30767904202f31742092',
                    },
                  ],
                  pageGenerators: [
                    {
                      _exportId: '60dbc5a8a706701ed4a148ac',
                      skipRetries: false,
                    },
                  ],
                  createdAt: '2021-06-29T16:13:35.071Z',
                  lastExecutedAt: '2021-06-30T01:55:17.721Z',
                },
              },
              {
                model: 'Export',
                doc: {
                  _id: '60dbc5a8a706701ed4a148ac',
                  createdAt: '2021-06-30T01:15:20.177Z',
                  lastModified: '2021-06-30T02:36:51.936Z',
                  name: 'Test 3pl central export',
                  description: 'Test 3PL central export description',
                  _connectionId: '5fc5e4a46cfe5b44bb95df44',
                  apiIdentifier: 'ec742bc9b0',
                  asynchronous: true,
                  assistant: '3plcentral',
                  sandbox: false,
                  assistantMetadata: {
                    resource: 'orders',
                    version: 'latest',
                    operation: 'get_packages_details',
                  },
                  parsers: [],
                  http: {
                    relativeURI: '/orders/3862/packages',
                    method: 'GET',
                    successMediaType: 'json',
                    errorMediaType: 'json',
                    formType: 'assistant',
                  },
                  rawData: '5d4010e14cd24a7c773122ef5d92fdf3fcca446b9e5ac853c6287f70',
                  adaptorType: 'HTTPExport',
                },
              },
              {
                model: 'Import',
                doc: {
                  _id: '605b30767904202f31742092',
                  createdAt: '2021-03-24T12:28:38.813Z',
                  lastModified: '2021-04-29T15:37:16.667Z',
                  name: 'FTP Import 1',
                  description: 'Test FTP Import description',
                  _connectionId: '5d529bfbdb0c7b14a6011a57',
                  distributed: false,
                  apiIdentifier: 'if1d74ac06',
                  oneToMany: false,
                  sandbox: false,
                  file: {
                    fileName: 'walmart-canada-pagination.json',
                    type: 'json',
                  },
                  ftp: {
                    directoryPath: '/ChaitanyaReddyMule/Connector_dev',
                    fileName: 'walmart-canada-pagination.json',
                  },
                  adaptorType: 'FTPImport',
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5d529bfbdb0c7b14a6011a57',
                  createdAt: '2019-08-13T11:16:11.951Z',
                  lastModified: '2022-06-24T11:44:40.123Z',
                  type: 'ftp',
                  name: 'FTP Connection',
                  offline: true,
                  debugDate: '2021-02-08T12:50:45.678Z',
                  sandbox: false,
                  ftp: {
                    type: 'sftp',
                    hostURI: 'celigo.files.com',
                    username: 'chaitanyareddy.mule@celigo.com',
                    password: '******',
                    port: 22,
                    usePassiveMode: true,
                    userDirectoryIsRoot: false,
                    useImplicitFtps: true,
                    requireSocketReUse: false,
                  },
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5fc5e4a46cfe5b44bb95df44',
                  createdAt: '2020-12-01T06:37:24.341Z',
                  lastModified: '2022-07-15T06:51:28.160Z',
                  type: 'http',
                  name: '3PL Central Connection',
                  assistant: '3plcentral',
                  offline: false,
                  debugDate: '2021-06-30T02:54:38.481Z',
                  sandbox: false,
                  debugUntil: '2021-06-30T02:54:38.481Z',
                  http: {
                    formType: 'assistant',
                    _iClientId: '5fc5e169269ea947c166510c',
                    mediaType: 'json',
                    baseURI: 'https://secure-wms.com/',
                    ping: {
                      relativeURI: 'orders',
                      method: 'GET',
                      failValues: [],
                      successValues: [],
                    },
                    rateLimit: {
                      failValues: [],
                    },
                    unencrypted: {
                      tpl: 'b779b82f-f5e5-4d59-a2c9-ea2c5eb8eec3',
                      userLoginId: 'Celigo_SandBox',
                    },
                    auth: {
                      type: 'oauth',
                      failValues: [],
                      oauth: {
                        tokenURI: 'https://secure-wms.com/AuthServer/api/Token',
                        scope: [],
                        grantType: 'clientcredentials',
                        clientCredentialsLocation: 'basicauthheader',
                        accessTokenBody: '{"grant_type": "client_credentials","tpl":"{b779b82f-f5e5-4d59-a2c9-ea2c5eb8eec3}", "user_login_id":"Celigo_SandBox"}',
                      },
                      token: {
                        token: '******',
                        location: 'header',
                        headerName: 'Authorization',
                        scheme: 'Bearer',
                        refreshMethod: 'POST',
                        refreshMediaType: 'urlencoded',
                      },
                    },
                  },
                },
              },
            ],
            stackRequired: false,
            _stackId: null,
          },
          status: 'success',
        },
      },
    };

    await initStore(integrationSession);
    await initClonePreview(props);
    const cloneIntegrationHeadingNode = screen.getByRole('heading', {name: 'Clone integration'});

    expect(cloneIntegrationHeadingNode).toBeInTheDocument();
    const integrationNameNode = screen.getByRole('textbox', {value: 'Clone - 3PL Central'});

    expect(integrationNameNode).toBeInTheDocument();
    await userEvent.clear(integrationNameNode);
    await userEvent.type(integrationNameNode, 'Succesfully Cloned - 3Pl Central');
    expect(integrationNameNode).toHaveValue('Succesfully Cloned - 3Pl Central');
    const environmentNode = screen.getByRole('radiogroup', {name: 'Environment'});

    expect(environmentNode).toBeInTheDocument();
    const environmentProductionNode = screen.getByRole('radio', {name: 'Production'});

    expect(environmentProductionNode).toBeInTheDocument();
    const environmentSandboxNode = screen.getByRole('radio', {name: 'Sandbox'});

    expect(environmentSandboxNode).toBeInTheDocument();
    userEvent.click(environmentSandboxNode);
    expect(environmentSandboxNode).toBeChecked();
    expect(environmentProductionNode).not.toBeChecked();
    userEvent.click(environmentProductionNode);
    expect(environmentSandboxNode).not.toBeChecked();
    expect(environmentProductionNode).toBeChecked();
    const paragraphNode = screen.getByText('The following components will get cloned with this integration.');

    expect(paragraphNode).toBeInTheDocument();
    const flowButtonNode = screen.getByRole('button', {name: 'Flows'});

    expect(flowButtonNode).toBeInTheDocument();
    expect(flowButtonNode).toHaveAttribute('aria-expanded', 'true');
    userEvent.click(flowButtonNode);
    expect(flowButtonNode).toHaveAttribute('aria-expanded', 'false');
    const tableNode = screen.getAllByRole('rowgroup');

    expect(tableNode[0].querySelectorAll('thead').length).toBe(0);
    expect(tableNode[1].querySelectorAll('tbody').length).toBe(0);
    const tableRow = screen.getAllByRole('row', {name: 'Name Description'});

    expect(tableRow[0].querySelectorAll('th').length).toBe(2);
    const integrationsButtonNode = screen.getByRole('button', {name: 'Integrations'});

    expect(integrationsButtonNode).toBeInTheDocument();
    expect(integrationsButtonNode).toHaveAttribute('aria-expanded', 'false');
    userEvent.click(integrationsButtonNode);
    expect(integrationsButtonNode).toHaveAttribute('aria-expanded', 'true');
    const exportButtonNode = screen.getByRole('button', {name: 'Exports'});

    expect(exportButtonNode).toBeInTheDocument();
    expect(exportButtonNode).toHaveAttribute('aria-expanded', 'false');
    userEvent.click(exportButtonNode);
    expect(exportButtonNode).toHaveAttribute('aria-expanded', 'true');
    const importButtonNode = screen.getByRole('button', {name: 'Imports'});

    expect(importButtonNode).toBeInTheDocument();
    expect(importButtonNode).toHaveAttribute('aria-expanded', 'false');
    userEvent.click(importButtonNode);
    expect(importButtonNode).toHaveAttribute('aria-expanded', 'true');
    const connectionsButtonNode = screen.getByRole('button', {name: 'Connections'});

    expect(connectionsButtonNode).toBeInTheDocument();
    expect(connectionsButtonNode).toHaveAttribute('aria-expanded', 'false');
    userEvent.click(connectionsButtonNode);
    expect(connectionsButtonNode).toHaveAttribute('aria-expanded', 'true');
    const cloneIntegrationButtonNode = screen.getByRole('button', {name: 'Clone integration'});

    expect(cloneIntegrationButtonNode).toBeInTheDocument();
    userEvent.click(cloneIntegrationButtonNode);
  }, 30000);
  test('Should able to access the Flow clone preview page', async () => {
    const props = {
      match: {
        params: {
          resourceId: '60db46af9433830f8f0e0fe7',
          resourceType: 'flows',
        },
      },
      pathname: '/clone/flows/60db46af9433830f8f0e0fe7/preview',
      history: {
        push: jest.fn(),
      },
    };
    const integrationSession = {
      'flows-60db46af9433830f8f0e0fe7': {
        preview: {
          components: {
            objects: [
              {
                model: 'Flow',
                doc: {
                  _id: '60db46af9433830f8f0e0fe7',
                  lastModified: '2022-07-27T18:04:57.044Z',
                  name: '3PL Central - FTP',
                  description: 'Testing Flow',
                  disabled: false,
                  _integrationId: '5fc5e0e66cfe5b44bb95de70',
                  skipRetries: false,
                  pageProcessors: [
                    {
                      responseMapping: {
                        fields: [],
                        lists: [],
                      },
                      type: 'import',
                      _importId: '605b30767904202f31742092',
                    },
                  ],
                  pageGenerators: [
                    {
                      _exportId: '60dbc5a8a706701ed4a148ac',
                      skipRetries: false,
                    },
                  ],
                  createdAt: '2021-06-29T16:13:35.071Z',
                  lastExecutedAt: '2021-06-30T01:55:17.721Z',
                  autoResolveMatchingTraceKeys: true,
                },
              },
              {
                model: 'Export',
                doc: {
                  _id: '60dbc5a8a706701ed4a148ac',
                  createdAt: '2021-06-30T01:15:20.177Z',
                  lastModified: '2022-07-27T18:04:41.999Z',
                  name: 'Test 3pl central export',
                  description: 'Test 3PL central export description',
                  _connectionId: '5fc5e4a46cfe5b44bb95df44',
                  apiIdentifier: 'ec742bc9b0',
                  asynchronous: true,
                  assistant: '3plcentral',
                  oneToMany: false,
                  sandbox: false,
                  assistantMetadata: {
                    resource: 'orders',
                    version: 'latest',
                    operation: 'get_packages_details',
                  },
                  parsers: [],
                  http: {
                    relativeURI: '/orders/3862/packages',
                    method: 'GET',
                    requestMediaType: 'json',
                    successMediaType: 'json',
                    errorMediaType: 'json',
                    formType: 'assistant',
                  },
                  rawData: '5d4010e14cd24a7c773122efebb372a471d8466aa1e52b628035c2a7',
                  adaptorType: 'HTTPExport',
                },
              },
              {
                model: 'Import',
                doc: {
                  _id: '605b30767904202f31742092',
                  createdAt: '2021-03-24T12:28:38.813Z',
                  lastModified: '2022-07-27T18:04:53.906Z',
                  name: 'FTP Import 1',
                  description: 'Test FTP Import description',
                  _connectionId: '5d529bfbdb0c7b14a6011a57',
                  distributed: false,
                  apiIdentifier: 'if1d74ac06',
                  oneToMany: false,
                  sandbox: false,
                  file: {
                    fileName: 'walmart-canada-pagination.json',
                    skipAggregation: false,
                    type: 'json',
                  },
                  ftp: {
                    directoryPath: '/ChaitanyaReddyMule/Connector_dev',
                    fileName: 'walmart-canada-pagination.json',
                  },
                  adaptorType: 'FTPImport',
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5d529bfbdb0c7b14a6011a57',
                  createdAt: '2019-08-13T11:16:11.951Z',
                  lastModified: '2022-06-24T11:44:40.123Z',
                  type: 'ftp',
                  name: 'FTP Connection',
                  offline: true,
                  debugDate: '2021-02-08T12:50:45.678Z',
                  sandbox: false,
                  ftp: {
                    type: 'sftp',
                    hostURI: 'celigo.files.com',
                    username: 'chaitanyareddy.mule@celigo.com',
                    password: '******',
                    port: 22,
                    usePassiveMode: true,
                    userDirectoryIsRoot: false,
                    useImplicitFtps: true,
                    requireSocketReUse: false,
                  },
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5fc5e4a46cfe5b44bb95df44',
                  createdAt: '2020-12-01T06:37:24.341Z',
                  lastModified: '2022-07-27T18:02:24.948Z',
                  type: 'http',
                  name: '3PL Central Connection',
                  assistant: '3plcentral',
                  offline: false,
                  debugDate: '2021-06-30T02:54:38.481Z',
                  sandbox: false,
                  debugUntil: '2021-06-30T02:54:38.481Z',
                  http: {
                    formType: 'assistant',
                    _iClientId: '5fc5e169269ea947c166510c',
                    mediaType: 'json',
                    baseURI: 'https://secure-wms.com/',
                    ping: {
                      relativeURI: 'orders',
                      method: 'GET',
                      failValues: [],
                      successValues: [],
                    },
                    rateLimit: {
                      failValues: [],
                    },
                    unencrypted: {
                      tpl: 'b779b82f-f5e5-4d59-a2c9-ea2c5eb8eec3',
                      userLoginId: 'Celigo_SandBox',
                    },
                    auth: {
                      type: 'oauth',
                      failValues: [],
                      oauth: {
                        tokenURI: 'https://secure-wms.com/AuthServer/api/Token',
                        scope: [],
                        grantType: 'clientcredentials',
                        clientCredentialsLocation: 'basicauthheader',
                        accessTokenBody: '{"grant_type": "client_credentials","tpl":"{b779b82f-f5e5-4d59-a2c9-ea2c5eb8eec3}", "user_login_id":"Celigo_SandBox"}',
                      },
                      token: {
                        token: '******',
                        location: 'header',
                        headerName: 'Authorization',
                        scheme: 'Bearer',
                        refreshMethod: 'POST',
                        refreshMediaType: 'urlencoded',
                      },
                    },
                  },
                },
              },
            ],
            stackRequired: false,
            _stackId: null,
          },
          status: 'success',
        },
      },
    };

    await initStore(integrationSession);
    await initClonePreview(props);
    const cloneFlowNode = screen.getByRole('heading', {name: 'Clone flow'});

    expect(cloneFlowNode).toBeInTheDocument();
    const flowNameNode = screen.getByRole('textbox', {name: ''});

    expect(flowNameNode).toHaveValue('Clone - 3PL Central - FTP');
    await userEvent.clear(flowNameNode);
    await userEvent.type(flowNameNode, 'Succesfully Cloned - 3PL Central - FTP');
    expect(flowNameNode).toHaveValue('Succesfully Cloned - 3PL Central - FTP');
    const environmentNode = screen.getByRole('radiogroup', {name: 'Environment'});

    expect(environmentNode).toBeInTheDocument();
    const environmentProductionNode = screen.getByRole('radio', {name: 'Production'});

    expect(environmentProductionNode).toBeInTheDocument();
    const environmentSandboxNode = screen.getByRole('radio', {name: 'Sandbox'});

    expect(environmentSandboxNode).toBeInTheDocument();
    userEvent.click(environmentSandboxNode);
    expect(environmentSandboxNode).toBeChecked();
    expect(environmentProductionNode).not.toBeChecked();
    userEvent.click(environmentProductionNode);
    expect(environmentSandboxNode).not.toBeChecked();
    expect(environmentProductionNode).toBeChecked();
    const paragraphNode = screen.getByText('The following components will get cloned with this flow.');

    expect(paragraphNode).toBeInTheDocument();
    const integrationNode = screen.getByRole('button', {name: 'Please select'});

    expect(integrationNode).toBeInTheDocument();
    await userEvent.click(integrationNode);
    const menuitemNode = screen.getByRole('menuitem', {name: '3PL Central'});

    expect(menuitemNode).toBeInTheDocument();
    await userEvent.click(menuitemNode);
    await waitForElementToBeRemoved(menuitemNode);
    expect(integrationNode).toHaveAccessibleName('3PL Central');
    const flowButtonNode = screen.getByRole('button', {name: 'Flows'});

    expect(flowButtonNode).toBeInTheDocument();
    expect(flowButtonNode).toHaveAttribute('aria-expanded', 'true');
    userEvent.click(flowButtonNode);
    expect(flowButtonNode).toHaveAttribute('aria-expanded', 'false');
    const tableNode = screen.getAllByRole('rowgroup');

    expect(tableNode[0].querySelectorAll('thead').length).toBe(0);
    expect(tableNode[1].querySelectorAll('tbody').length).toBe(0);
    const tableRow = screen.getAllByRole('row', {name: 'Name Description'});

    expect(tableRow[0].querySelectorAll('th').length).toBe(2);
    const exportButtonNode = screen.getByRole('button', {name: 'Exports'});

    expect(exportButtonNode).toBeInTheDocument();
    expect(exportButtonNode).toHaveAttribute('aria-expanded', 'false');
    userEvent.click(exportButtonNode);
    expect(exportButtonNode).toHaveAttribute('aria-expanded', 'true');
    const importButtonNode = screen.getByRole('button', {name: 'Imports'});

    expect(importButtonNode).toBeInTheDocument();
    expect(importButtonNode).toHaveAttribute('aria-expanded', 'false');
    userEvent.click(importButtonNode);
    expect(importButtonNode).toHaveAttribute('aria-expanded', 'true');
    const connectionsButtonNode = screen.getByRole('button', {name: 'Connections'});

    expect(connectionsButtonNode).toBeInTheDocument();
    expect(connectionsButtonNode).toHaveAttribute('aria-expanded', 'false');
    userEvent.click(connectionsButtonNode);
    expect(connectionsButtonNode).toHaveAttribute('aria-expanded', 'true');
    const cloneFlowButtonNode = screen.getByRole('button', {name: 'Clone flow'});

    expect(cloneFlowButtonNode).toBeInTheDocument();
    userEvent.click(cloneFlowButtonNode);
    // const loadingTextNode = screen.getByText('Loading');

    // await waitForElementToBeRemoved(loadingTextNode);
  }, 30000);
  test('Should able to access the Integration App clone preview page', async () => {
    const props = {
      match: {
        params: {
          resourceId: '6294909fd5391a2e79b38eff',
          resourceType: 'integrations',
        },
      },
      pathname: '/clone/integrations/6294909fd5391a2e79b38eff/preview',
      history: {
        push: jest.fn(),
      },
    };
    const integrationSession = {
      'integrations-6294909fd5391a2e79b38eff': {
        preview: {
          components: {
            objects: [
              {
                model: 'Integration',
                doc: {
                  _id: '6294909fd5391a2e79b38eff',
                  lastModified: '2022-06-01T10:21:47.332Z',
                  name: 'Salesforce - NetSuite',
                  _connectorId: '5b61ae4aeb538642c26bdbe6',
                  install: [
                    {
                      name: 'Configure Salesforce connection',
                      description: 'Lets you create a connection with Salesforce. You can authenticate your connection either using the <b>Refresh Token</b> or <b>JWT Bearer Token</b> option. Once you allow access with your Salesforce account credentials, you won\'t be able to change the account or account type. For more information, see <a href = \'https://docs.celigo.com/hc/en-us/articles/360045063772-React-Install-Salesforce-NetSuite-IO-Integration-App#Configure_Salesforce_connection\'>Configure Salesforce connection</a>.',
                      imageURL: '/images/company-logos/salesforce.png',
                      completed: true,
                      installerFunction: 'verifyProductConnection',
                      uninstallerFunction: 'deleteSalesforceConnection',
                      _connectionId: '629490a0ccb94d35de693598',
                    },
                    {
                      name: 'Install integrator.io package in Salesforce',
                      description: 'Lets you install the integrator.io distributed adaptor package. It is recommended to install using the <b>Install for All Users</b> option. After you install, an email is sent and you can find the installed package on the Salesforce > Installed Packages page. Verify your package after installation. For more information, see <a href = \'https://docs.celigo.com/hc/en-us/articles/360045063772-React-Install-Salesforce-NetSuite-IO-Integration-App#Install_integrator.io_package_in_Salesforce\'>Install integrator.io package in Salesforce</a>.',
                      imageURL: '/images/company-logos/salesforce.png',
                      installURL: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/packaging/installPackage.apexp?p0=04t3m000002Komn',
                      completed: true,
                      installerFunction: 'verifyIntegratorPackageInSF',
                      uninstallerFunction: 'uninstallVerifySalesforceBundle',
                    },
                    {
                      name: 'Install NetSuite package in Salesforce',
                      description: 'Lets you install the NetSuite package. It is recommended to install using the <b>Install for All Users</b> option. After you install, an email is sent and you can find the installed package on the Salesforce > Installed Packages page. Verify your package after installation. For more information, see <a href = \'https://docs.celigo.com/hc/en-us/articles/360045063772-React-Install-Salesforce-NetSuite-IO-Integration-App#Install_NetSuite_package_in_Salesforce\'>Install NetSuite package in Salesforce</a>.',
                      imageURL: '/images/company-logos/salesforce.png',
                      installURL: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/packaging/installPackage.apexp?p0=04t5a000001rCO9',
                      completed: true,
                      installerFunction: 'verifyConnectorPackageInSF',
                      uninstallerFunction: 'uninstallVerifySalesforceBundle',
                    },
                    {
                      name: 'Configure NetSuite connection',
                      description: 'Lets you create a connection with NetSuite. You can authenticate your connection either using the basic, token, or automatic token options. We recommend you to use any of the token based authentication methods. For token based authentication, create an access token in NetSuite. After you configure, you won\'t be able to change NetSuite environment and account.  For more information, see <a href = \'https://docs.celigo.com/hc/en-us/articles/360045063772-React-Install-Salesforce-NetSuite-IO-Integration-App#Configure_NetSuite_connection\'>Configure NetSuite connection</a>.',
                      imageURL: '/images/company-logos/netsuite.png',
                      completed: true,
                      installerFunction: 'verifyNetSuiteConnection',
                      uninstallerFunction: 'deleteNetSuiteConnection',
                      _connectionId: '6294909fccb94d35de693596',
                    },
                    {
                      name: 'Install integrator.io bundle in NetSuite',
                      description: 'Lets you install the integrator.io bundle (20038) in NetSuite. It is a common bundle across all integration apps. Verify the bundle. If you already have a bundle installed, it is either updated or auto-verified. It is recommended to update and verify the bundle from NetSuite > Installed Bundles page. For more information, see <a href = \'https://docs.celigo.com/hc/en-us/articles/360045063772-React-Install-Salesforce-NetSuite-IO-Integration-App#Install_integrator.io_bundle_in_NetSuite\'>Install integrator.io bundle in NetSuite</a>.',
                      imageURL: '/images/company-logos/netsuite.png',
                      installURL: 'https://tstdrv1934805.app.netsuite.com/app/bundler/bundledetails.nl?sourcecompanyid=TSTDRV840460&domain=PRODUCTION&config=F&id=20037',
                      completed: true,
                      installerFunction: 'verifyIntegratorBundleInstallation',
                      uninstallerFunction: 'uninstallVerifySalesforceBundle',
                    },
                    {
                      name: 'Install Salesforce SuiteApp in NetSuite',
                      description: 'Lets you install the Salesforce SuiteApp in NetSuite. You can install and verify the SuiteApp in NetSuite. For more information, see <a href = \'https://docs.celigo.com/hc/en-us/articles/360045063772-React-Install-Salesforce-NetSuite-IO-Integration-App#Install_Salesforce_SuiteApp_in_NetSuite\'>Install Salesforce SuiteApp in NetSuite</a>.',
                      imageURL: '/images/company-logos/netsuite.png',
                      installURL: 'https://tstdrv1934805.app.netsuite.com/suiteapp/ui/marketplace.nl?whence=#/app?id=com.celigo.salesforceio',
                      completed: true,
                      installerFunction: 'verifyProductBundleInstallation',
                      uninstallerFunction: 'uninstallVerifySalesforceBundle',
                    },
                  ],
                  mode: 'settings',
                  settings: {
                    commonresources: {
                      imports: [
                        '6294aa3cccb94d35de694808',
                        '6294aa2fd5391a2e79b3a0b8',
                      ],
                      exports: [
                        '6294aa2eccb94d35de6947d2',
                      ],
                      savedSearches: [
                        null,
                      ],
                      flows: [
                        '6294aa3dccb94d35de69481e',
                      ],
                      netsuiteConnectionId: '6294909fccb94d35de693596',
                      salesforceConnectionId: '629490a0ccb94d35de693598',
                    },
                    configs: {
                      netsuite_item_to_salesforce_product_import: {
                        apiId: 'i8fb391f04',
                        id: '6294aa2fccb94d35de6947d4',
                      },
                      salesforce_account_to_netsuite_customer_import: {
                        id: '6294aa2fccb94d35de6947d7',
                        apiId: 'icc96bf06a',
                      },
                      netsuite_customer_to_salesforce_account_import: {
                        apiId: 'i4a5c39b2d',
                      },
                      tag: '',
                      netsuite_item_group_to_salesforce_product_import: '6294aa2ed5391a2e79b3a0ab',
                      salesforce_opportunity_to_netsuite_salesorder_flow: '6294aa3cd5391a2e79b3a0ea',
                      salesforce_opportunity_to_netsuite_salesorder_export: '6294aa2fd5391a2e79b3a0c3',
                      salesforce_attachment_to_netsuite_order_attachments_export: '6294aa2fccb94d35de6947d8',
                      netsuite_salesorder_id_writeback_export: '6294aa2fccb94d35de6947dc',
                      salesforce_to_netsuite_flow_run_status_export: '6294aa2fd5391a2e79b3a0c1',
                      netsuite_to_salesforce_flow_run_status_export: '6294aa2fccb94d35de6947da',
                      salesforce_account_id_writeback_import: 'i13702c012',
                      salesforce_attachment_to_netsuite_order_attachments_flow: '6294aa3cd5391a2e79b3a0ed',
                      salesforce_contentdocument_to_netsuite_file_export: '6294aa2fccb94d35de6947df',
                      salesforce_attachment_to_netsuite_file_export: '6294aa2ed5391a2e79b3a0ac',
                      salesforce_attachment_to_netsuite_file_import: '6294aa2fd5391a2e79b3a0bb',
                      salesforce_opportunity_to_netsuite_salesorder_import: '6294aa2ed5391a2e79b3a0ad',
                      netsuite_financials_to_salesforce_financials_export: '6294aa3cccb94d35de69480d',
                      salesforce_attachment_to_netsuite_so_fileattach: '6294aa2eccb94d35de6947cd',
                      export_v2_io_configurations: '6294aa2eccb94d35de6947d1',
                      salesforce_file_to_netsuite_file_export: '6294aa2fccb94d35de6947e2',
                    },
                    sections: [
                      {
                        title: 'Contact',
                        flows: [
                          {
                            _id: '6294aa3dccb94d35de69481e',
                            showMapping: true,
                            showSchedule: false,
                            settings: [
                              {
                                label: 'Criteria for NetSuite Contact Sync',
                                type: 'expression',
                                expressionType: 'export',
                                required: true,
                                name: 'exports_6294aa2eccb94d35de6947d2_contactqualifier',
                                tooltip: 'This setting allows to set the criteria for NetSuite Contacts which need be synced to Salesforce. The default qualification criteria should not be removed. You can have additional criteria to sync NetSuite Contacts to Salesforce.',
                                value: '["val:company","empty",false]',
                              },
                              {
                                label: 'Contact Lookup Criteria in Salesforce',
                                type: 'expression',
                                expressionType: 'import',
                                required: true,
                                name: 'imports_6294aa2fd5391a2e79b3a0b8_salesforceQualifier',
                                tooltip: 'This setting defines the lookup criteria that the integration app will use to determine if a record already exists in Salesforce or not.',
                                value: '((celigo_sfnsio__NetSuite_Id__c = {{{string internalid}}}) OR ((Email = {{{email email}}}) AND (AccountId = {{{reference salesforce_company_Id}}})))',
                              },
                            ],
                          },
                        ],
                      },
                    ],
                    general: [
                      {
                        title: 'General',
                        fields: [
                          {
                            generates: [
                              null,
                            ],
                            extracts: [
                              {
                                id: '6',
                                text: 'Australian Dollars',
                              },
                              {
                                id: '2',
                                text: 'British Pounds',
                              },
                              {
                                id: '3',
                                text: 'Canadian Dollar',
                              },
                              {
                                id: '8',
                                text: 'Danish Krone',
                              },
                              {
                                id: '4',
                                text: 'Euro',
                              },
                              {
                                id: '5',
                                text: 'Indian Rupees',
                              },
                              {
                                id: '9',
                                text: 'Japanese Yen',
                              },
                              {
                                id: '10',
                                text: 'Mexican Peso',
                              },
                              {
                                id: '7',
                                text: 'Singapore Dollars',
                              },
                              {
                                id: '1',
                                text: 'U.S. Dollar',
                              },
                            ],
                            allowFailures: true,
                            supportsGeneratesRefresh: true,
                            supportsExtractsRefresh: true,
                            hideLookupAllowFailures: true,
                            generateFieldHeader: 'Salesforce Currency',
                            extractFieldHeader: 'NetSuite Currency',
                            label: 'Map NetSuite Currency to Salesforce Currency',
                            title: 'Map NetSuite Currency to Salesforce Currency',
                            tooltip: '',
                            name: 'general_state_mapCurrencies_listNSCurrency_listSFCurrency',
                            type: 'staticMapWidget',
                            properties: {
                              sectionName: 'Currency',
                            },
                          },
                          {
                            label: 'Unique key for an Item in NetSuite',
                            value: 'itemid',
                            tooltip: 'Select the NetSuite field that holds the unique key for an Item. The unique key should have matching values in Salesforce and NetSuite. We recommend that you select \'Item Name/Number\'.\nFor more information on usage of this feature, refer <a href="https://celigosuccess.zendesk.com/hc/en-us/articles/360033312132"> here</a>.',
                            type: 'select',
                            name: 'general_state_invokeSKUFieldsAction_listNSItemMetadata',
                            supportsRefresh: true,
                            properties: {
                              sectionName: 'Product Discovery',
                              yieldValueAndLabel: true,
                            },
                            options: [
                              [
                                'itemid',
                                'Name',
                              ],
                            ],
                          },
                          {
                            label: 'Unique key for a Product in Salesforce',
                            value: 'ProductCode',
                            tooltip: 'Select the Salesforce field that holds a unique key for each Product. The unique key should have matching values in Salesforce and NetSuite. We recommend that you select \'Product Code\'.\nFor more information on usage of this feature, refer <a href="https://celigosuccess.zendesk.com/hc/en-us/articles/360033312132"> here</a>.',
                            type: 'select',
                            name: 'general_state_invokeSKUFieldsAction_listSFProductMetadata',
                            supportsRefresh: true,
                            properties: {
                              sectionName: 'Product Discovery',
                              yieldValueAndLabel: true,
                            },
                            options: [
                              [
                                'ProductCode',
                                'Product Code',
                              ],
                            ],
                          },
                          {
                            label: 'Track discount items using',
                            type: 'select',
                            name: 'general_state_setFieldValue_listDiscountItems',
                            supportsRefresh: true,
                            options: [

                            ],
                            tooltip: 'This preference provides a choice for the default NetSuite discount item against which all the line-level discounts are posted. The item-based discounts are reflected on the NetSuite sales transactions right below the original line item as a separate line item',
                            properties: {
                              sectionName: 'Discount',
                              yieldValueAndLabel: true,
                            },
                          },
                          {
                            label: 'Migrate configuration from v2 to IO',
                            required: false,
                            value: false,
                            tooltip: 'Enable the checkbox to migrate configurations from Salesforce NetSuite Integration App version v2 to IO. We recommend that you use this setting along with "Test Mode" or "Go-Live date" to concurrently run both the versions of the Integration App. If you do not enable the checkbox, we will use the default configuration.\nFor more information on usage of this feature, refer <a href="https://celigosuccess.zendesk.com/hc/en-us/sections/360007894052-Migration-Utility"> here</a>.',
                            type: 'checkbox',
                            name: 'general_state_migrateFlowSettings',
                            dependencies: {
                              disabled: {
                                fields: [
                                  {
                                    name: 'general_state_cutoffdate',
                                    hidden: true,
                                    required: false,
                                  },
                                  {
                                    name: 'general_state_cutofftimezone_refreshTimeZoneList',
                                    hidden: true,
                                    required: false,
                                  },
                                ],
                              },
                              enabled: {
                                fields: [
                                  {
                                    name: 'general_state_cutoffdate',
                                    hidden: false,
                                    required: false,
                                  },
                                  {
                                    name: 'general_state_cutofftimezone_refreshTimeZoneList',
                                    hidden: false,
                                    required: false,
                                  },
                                ],
                              },
                            },
                            properties: {
                              sectionName: 'V2 To IO Migration',
                            },
                          },
                          {
                            label: 'Set Go-Live date',
                            required: false,
                            value: '',
                            tooltip: 'The "Go-Live date" is the day when you turn off the test mode and your Integration App is operational. Once you set the "Go-Live date" all record-level buttons and checkboxes for records synced via version v2 are disabled. Order transactions mentioned below sync via IO version after this day: \n 1. Closed Opportunities\n 2. Created Orders\n 3. Fulfilled Transactions \nOrder transactions on or before the "Go-Live date" sync via version v2.',
                            type: 'date',
                            name: 'general_state_cutoffdate',
                            properties: {
                              sectionName: 'V2 To IO Migration',
                            },
                          },
                          {
                            label: 'Set go-live time zone',
                            value: 'America/Los_Angeles',
                            tooltip: 'Set the go-live time zone for the integration app. The default go-live time zone is (GMT-8) Pacific Time (US & Canada).',
                            type: 'select',
                            name: 'general_state_cutofftimezone_refreshTimeZoneList',
                            supportsRefresh: true,
                            properties: {
                              yieldValueAndLabel: true,
                              sectionName: 'V2 To IO Migration',
                            },
                            options: [
                              [
                                'America/Los_Angeles',
                                '(GMT-08:00) Pacific Time (US & Canada)',
                              ],
                            ],
                          },
                          {
                            label: 'Enable test mode',
                            required: false,
                            value: false,
                            tooltip: 'When Enable Test Mode checkbox is checked, the records that are eligible for testing can be synced between Salesforce and NetSuite. If it is disabled, all of the live records are synced between Salesfoce and NetSuite. When the “Send as test record to IO” checkbox is checked in Salesforce or NetSuite on the records, these records are eligible to sync to IO.',
                            type: 'checkbox',
                            name: 'general_state_testmode',
                          },
                        ],
                      },
                    ],
                    connectorEdition: 'premium',
                    editionMigrated: 'true',
                  },
                  version: '1.11.0',
                  sandbox: false,
                  _registeredConnectionIds: [

                  ],
                  installSteps: [

                  ],
                  uninstallSteps: [

                  ],
                  flowGroupings: [

                  ],
                  createdAt: '2022-05-30T09:38:39.354Z',
                },
              },
              {
                model: 'Flow',
                doc: {
                  _id: '6294aa3dccb94d35de69481e',
                  lastModified: '2022-05-30T11:27:58.128Z',
                  name: 'NetSuite Contact to Salesforce Contact Add/Update',
                  description: 'Syncs records present in NetSuite Contacts as Salesforce Contacts in real-time. This flow triggers when an update is made to a contact or a new contact is created for a customer that has Salesforce ID present in it. When a new contact is created in NetSuite and is synced successfully to Salesforce, the flow writes back its Salesforce ID to NetSuite contact.',
                  disabled: true,
                  _integrationId: '6294909fd5391a2e79b38eff',
                  _connectorId: '5b61ae4aeb538642c26bdbe6',
                  skipRetries: false,
                  pageProcessors: [
                    {
                      type: 'import',
                      _importId: '6294aa2fd5391a2e79b3a0b8',
                      responseMapping: {
                        lists: [

                        ],
                        fields: [
                          {
                            extract: 'id',
                            generate: 'Salesforce Contact Id',
                          },
                        ],
                      },
                    },
                    {
                      responseMapping: {
                        fields: [

                        ],
                        lists: [

                        ],
                      },
                      type: 'import',
                      _importId: '6294aa3cccb94d35de694808',
                    },
                  ],
                  pageGenerators: [
                    {
                      _exportId: '6294aa2eccb94d35de6947d2',
                    },
                  ],
                  createdAt: '2022-05-30T11:27:57.968Z',
                  externalId: 'netsuite_contact_to_salesforce_contact_flow',
                  autoResolveMatchingTraceKeys: true,
                },
              },
              {
                model: 'Export',
                doc: {
                  _id: '6294aa2eccb94d35de6947d2',
                  createdAt: '2022-05-30T11:27:42.954Z',
                  lastModified: '2022-05-30T11:27:44.488Z',
                  name: 'Get Contacts From NetSuite',
                  _connectionId: '6294909fccb94d35de693596',
                  _integrationId: '6294909fd5391a2e79b38eff',
                  _connectorId: '5b61ae4aeb538642c26bdbe6',
                  externalId: 'netsuite_contact_to_salesforce_contact_export',
                  apiIdentifier: 'e158f37624',
                  asynchronous: true,
                  type: 'distributed',
                  parsers: [

                  ],
                  distributed: {
                    bearerToken: '******',
                  },
                  netsuite: {
                    type: 'distributed',
                    skipGrouping: false,
                    statsOnly: false,
                    restlet: {
                      criteria: [

                      ],
                      columns: [

                      ],
                    },
                    distributed: {
                      recordType: 'contact',
                      executionContext: [
                        'csvimport',
                        'custommassupdate',
                        'offlineclient',
                        'portlet',
                        'scheduled',
                        'suitelet',
                        'userevent',
                        'userinterface',
                        'webservices',
                        'webstore',
                        'workflow',
                      ],
                      disabled: true,
                      executionType: [
                        'create',
                        'edit',
                        'xedit',
                      ],
                      qualifier: [
                        'val:company',
                        'empty',
                        false,
                      ],
                      sublists: [
                        'addressbook',
                      ],
                      forceReload: false,
                      skipExportFieldId: 'custentity_celigo_sfio_skip_export_to_sf',
                      hooks: {
                        preSend: {
                          fileInternalId: 'SuiteApps/com.celigo.salesforceio/build/Celigo_SalesforceIOConnector.closure.js',
                          function: 'netsuiteContactExportPreSendHook',
                        },
                      },
                    },
                  },
                  adaptorType: 'NetSuiteExport',
                },
              },
              {
                model: 'Import',
                doc: {
                  _id: '6294aa2fd5391a2e79b3a0b8',
                  createdAt: '2022-05-30T11:27:43.058Z',
                  lastModified: '2022-05-30T11:27:44.870Z',
                  name: 'Post Contacts to Salesforce',
                  parsers: [

                  ],
                  _connectionId: '629490a0ccb94d35de693598',
                  _integrationId: '6294909fd5391a2e79b38eff',
                  _connectorId: '5b61ae4aeb538642c26bdbe6',
                  externalId: 'netsuite_contact_to_salesforce_contact_import',
                  distributed: false,
                  apiIdentifier: 'i11bdac975',
                  hooks: {
                    postSubmit: {
                      function: 'netSuiteContactPostSubmitHook',
                    },
                  },
                  idLockTemplate: '{{{id}}}',
                  lookups: [

                  ],
                  mapping: {
                    fields: [
                      {
                        extract: 'internalid',
                        generate: 'celigo_sfnsio__NetSuite_Id__c',
                      },
                      {
                        extract: 'salesforce_company_Id',
                        generate: 'AccountId',
                      },
                      {
                        extract: 'salutation',
                        generate: 'Salutation',
                      },
                      {
                        extract: 'firstname',
                        generate: 'FirstName',
                      },
                      {
                        extract: 'lastname',
                        generate: 'LastName',
                      },
                      {
                        extract: 'email',
                        generate: 'Email',
                      },
                      {
                        extract: 'homephone',
                        generate: 'HomePhone',
                      },
                      {
                        extract: 'mobilephone',
                        generate: 'MobilePhone',
                      },
                      {
                        generate: 'celigo_sfnsio__Skip_Export_To_NetSuite__c',
                        hardCodedValue: 'true',
                      },
                      {
                        extract: '{{_billingaddress_addr1}}\n{{_billingaddress_addr2}}',
                        generate: 'MailingStreet',
                      },
                      {
                        extract: '_billingaddress_city',
                        generate: 'MailingCity',
                      },
                      {
                        extract: '_billingaddress_state',
                        generate: 'MailingState',
                      },
                      {
                        extract: '_billingaddress_country.name',
                        generate: 'MailingCountry',
                      },
                      {
                        extract: '_billingaddress_zip',
                        generate: 'MailingPostalCode',
                      },
                      {
                        extract: 'comments',
                        generate: 'Description',
                      },
                      {
                        extract: 'phone',
                        generate: 'Phone',
                      },
                      {
                        extract: 'netsuiteRecordUrl',
                        generate: 'celigo_sfnsio__NetSuite_Record__c',
                      },
                    ],
                  },
                  salesforce: {
                    operation: 'addupdate',
                    sObjectType: 'Contact',
                    api: 'soap',
                    idLookup: {
                      whereClause: '((celigo_sfnsio__NetSuite_Id__c = {{{string internalid}}}) OR ((Email = {{{email email}}}) AND (AccountId = {{{reference salesforce_company_Id}}})))',
                    },
                    removeNonSubmittableFields: false,
                  },
                  adaptorType: 'SalesforceImport',
                },
              },
              {
                model: 'Import',
                doc: {
                  _id: '6294aa3cccb94d35de694808',
                  createdAt: '2022-05-30T11:27:56.745Z',
                  lastModified: '2022-05-30T11:27:57.238Z',
                  name: 'Salesforce Contact Id Write Back to NetSuite',
                  parsers: [

                  ],
                  _connectionId: '6294909fccb94d35de693596',
                  _integrationId: '6294909fd5391a2e79b38eff',
                  _connectorId: '5b61ae4aeb538642c26bdbe6',
                  externalId: 'netsuite_contact_to_salesforce_contact_import_idwriteback',
                  distributed: true,
                  apiIdentifier: 'ia26181de1',
                  lookups: [

                  ],
                  netsuite_da: {
                    operation: 'update',
                    recordType: 'contact',
                    internalIdLookup: {
                      expression: '["internalid","is","{{{internalid}}}"]',
                    },
                    lookups: [

                    ],
                    mapping: {
                      fields: [
                        {
                          generate: 'custentity_celigo_sfio_sf_id',
                          extract: 'Salesforce Contact Id',
                          discardIfEmpty: false,
                        },
                        {
                          generate: 'custentity_celigo_sfio_skip_export_to_sf',
                          hardCodedValue: 'true',
                          discardIfEmpty: false,
                        },
                      ],
                      lists: [

                      ],
                    },
                  },
                  filter: {
                    type: 'expression',
                    expression: {
                      rules: [
                        'empty',
                        [
                          'string',
                          [
                            'extract',
                            'custentity_celigo_sfio_sf_id',
                          ],
                        ],
                      ],
                      version: '1',
                    },
                    version: '1',
                    rules: [
                      'empty',
                      [
                        'string',
                        [
                          'extract',
                          'custentity_celigo_sfio_sf_id',
                        ],
                      ],
                    ],
                  },
                  adaptorType: 'NetSuiteDistributedImport',
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '6294909fccb94d35de693596',
                  createdAt: '2022-05-30T09:38:39.897Z',
                  lastModified: '2022-05-30T11:18:48.232Z',
                  type: 'netsuite',
                  name: 'NetSuite Connection [Salesforce - NetSuite (IO)]',
                  offline: false,
                  _connectorId: '5b61ae4aeb538642c26bdbe6',
                  _integrationId: '6294909fd5391a2e79b38eff',
                  externalId: 'netsuite_connection',
                  netsuite: {
                    account: 'TSTDRV1934805',
                    roleId: '3',
                    requestLevelCredentials: true,
                    dataCenterURLs: {
                      restDomain: 'https://tstdrv1934805.restlets.api.netsuite.com',
                      webservicesDomain: 'https://tstdrv1934805.suitetalk.api.netsuite.com',
                      systemDomain: 'https://tstdrv1934805.app.netsuite.com',
                    },
                    tokenId: '******',
                    tokenSecret: '******',
                    entityId: '141286',
                    wsdlVersion: '2020.2',
                    concurrencyLevel: 1,
                    _iClientId: '5ece4d743a9a3466ec759bb4',
                    suiteAppInstalled: false,
                    authType: 'token-auto',
                  },
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '629490a0ccb94d35de693598',
                  createdAt: '2022-05-30T09:38:40.303Z',
                  lastModified: '2022-07-28T10:55:31.583Z',
                  type: 'salesforce',
                  name: 'Salesforce Connection [Salesforce - NetSuite (IO)]',
                  offline: false,
                  _connectorId: '5b61ae4aeb538642c26bdbe6',
                  _integrationId: '6294909fd5391a2e79b38eff',
                  externalId: 'salesforce_connection',
                  salesforce: {
                    sandbox: false,
                    baseURI: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com',
                    oauth2FlowType: 'refreshToken',
                    bearerToken: '******',
                    refreshToken: '******',
                    packagedOAuth: true,
                    scope: [

                    ],
                    concurrencyLevel: 5,
                    _iClientId: '5e9d7e344242783b222f3653',
                    info: {
                      sub: 'https://login.salesforce.com/id/00D0K0000024M3QUAU/0050K000009m3BTQAY',
                      user_id: '0050K000009m3BTQAY',
                      organization_id: '00D0K0000024M3QUAU',
                      preferred_username: 'srilekha_tirumala@celigo.com',
                      nickname: 'srilekha_tirumala',
                      name: 'Srilekha Tirumala',
                      email: 'srilekha.tirumala@celigo.com',
                      email_verified: true,
                      given_name: 'Srilekha',
                      family_name: 'Tirumala',
                      zoneinfo: 'America/Los_Angeles',
                      photos: {
                        picture: 'https://d0k0000024m3quau-dev-ed--c.documentforce.com/profilephoto/005/F',
                        thumbnail: 'https://d0k0000024m3quau-dev-ed--c.documentforce.com/profilephoto/005/T',
                      },
                      profile: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/0050K000009m3BTQAY',
                      picture: 'https://d0k0000024m3quau-dev-ed--c.documentforce.com/profilephoto/005/F',
                      address: {
                        country: 'IN',
                      },
                      urls: {
                        enterprise: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/Soap/c/{version}/00D0K0000024M3Q',
                        metadata: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/Soap/m/{version}/00D0K0000024M3Q',
                        partner: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/Soap/u/{version}/00D0K0000024M3Q',
                        rest: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/data/v{version}/',
                        sobjects: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/data/v{version}/sobjects/',
                        search: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/data/v{version}/search/',
                        query: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/data/v{version}/query/',
                        recent: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/data/v{version}/recent/',
                        tooling_soap: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/Soap/T/{version}/00D0K0000024M3Q',
                        tooling_rest: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/data/v{version}/tooling/',
                        profile: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/0050K000009m3BTQAY',
                        feeds: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/data/v{version}/chatter/feeds',
                        groups: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/data/v{version}/chatter/groups',
                        users: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/data/v{version}/chatter/users',
                        feed_items: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/data/v{version}/chatter/feed-items',
                        feed_elements: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com/services/data/v{version}/chatter/feed-elements',
                        custom_domain: 'https://d0k0000024m3quau-dev-ed.my.salesforce.com',
                      },
                      active: true,
                      user_type: 'STANDARD',
                      language: 'en_US',
                      locale: 'en_US',
                      utcOffset: -28800000,
                      updated_at: '2020-11-18T06:44:33Z',
                      is_app_installed: true,
                    },
                  },
                },
              },
              {
                model: 'Script',
                doc: {
                  _id: '5f7abcb05fc935549ceb214a',
                  lastModified: '2020-11-09T12:29:30.356Z',
                  createdAt: '2020-10-05T06:26:56.840Z',
                  name: 'SFNSIA Update Integration Status Script',
                  description: 'This script is required to execute preSavePage for Salesforce realtime export records. It updates the inprogress integration status for every realtime record trigger from salesforce',
                },
              },
            ],
            stackRequired: false,
            _stackId: null,
          },
          status: 'success',
        },
      },
    };

    await initStore(integrationSession);
    await initClonePreview(props);
    const cloneIntegrationNode = screen.getByRole('heading', {name: 'Clone integration'});

    expect(cloneIntegrationNode).toBeInTheDocument();
    const tagNode = screen.getByRole('textbox');

    expect(tagNode).toHaveAttribute('name', 'tag');
    await userEvent.type(tagNode, 'testing tag');
    expect(tagNode).toHaveAttribute('value', 'testing tag');
    const environmentNode = screen.getByRole('radiogroup', {name: 'Environment'});

    expect(environmentNode).toBeInTheDocument();
    const environmentProductionNode = screen.getByRole('radio', {name: 'Production'});

    expect(environmentProductionNode).toBeInTheDocument();
    const environmentSandboxNode = screen.getByRole('radio', {name: 'Sandbox'});

    expect(environmentSandboxNode).toBeInTheDocument();
    userEvent.click(environmentSandboxNode);
    expect(environmentSandboxNode).toBeChecked();
    expect(environmentProductionNode).not.toBeChecked();
    userEvent.click(environmentProductionNode);
    expect(environmentSandboxNode).not.toBeChecked();
    expect(environmentProductionNode).toBeChecked();
    const paragraphNode = screen.getByText('The following components will get cloned with this integration.');

    expect(paragraphNode).toBeInTheDocument();
    const flowButtonNode = screen.getByRole('button', {name: 'Flows'});

    expect(flowButtonNode).toBeInTheDocument();
    expect(flowButtonNode).toHaveAttribute('aria-expanded', 'true');
    userEvent.click(flowButtonNode);
    expect(flowButtonNode).toHaveAttribute('aria-expanded', 'false');
    const tableNode = screen.getAllByRole('rowgroup');

    expect(tableNode[0].querySelectorAll('thead').length).toBe(0);
    expect(tableNode[1].querySelectorAll('tbody').length).toBe(0);
    const tableRow = screen.getAllByRole('row', {name: 'Name Description'});

    expect(tableRow[0].querySelectorAll('th').length).toBe(2);
    const integrationsButtonNode = screen.getByRole('button', {name: 'Integrations'});

    expect(integrationsButtonNode).toBeInTheDocument();
    expect(integrationsButtonNode).toHaveAttribute('aria-expanded', 'false');
    userEvent.click(integrationsButtonNode);
    expect(integrationsButtonNode).toHaveAttribute('aria-expanded', 'true');
    const exportButtonNode = screen.getByRole('button', {name: 'Exports'});

    expect(exportButtonNode).toBeInTheDocument();
    expect(exportButtonNode).toHaveAttribute('aria-expanded', 'false');
    userEvent.click(exportButtonNode);
    expect(exportButtonNode).toHaveAttribute('aria-expanded', 'true');
    const importButtonNode = screen.getByRole('button', {name: 'Imports'});

    expect(importButtonNode).toBeInTheDocument();
    expect(importButtonNode).toHaveAttribute('aria-expanded', 'false');
    userEvent.click(importButtonNode);
    expect(importButtonNode).toHaveAttribute('aria-expanded', 'true');
    const connectionsButtonNode = screen.getByRole('button', {name: 'Connections'});

    expect(connectionsButtonNode).toBeInTheDocument();
    expect(connectionsButtonNode).toHaveAttribute('aria-expanded', 'false');
    userEvent.click(connectionsButtonNode);
    expect(connectionsButtonNode).toHaveAttribute('aria-expanded', 'true');
    const scriptButtonNode = screen.getByRole('button', {name: 'Scripts'});

    expect(scriptButtonNode).toBeInTheDocument();
    expect(scriptButtonNode).toHaveAttribute('aria-expanded', 'false');
    userEvent.click(scriptButtonNode);
    expect(scriptButtonNode).toHaveAttribute('aria-expanded', 'true');
    const cloneIntegrationButtonNode = screen.getByRole('button', {name: 'Clone integration'});

    expect(cloneIntegrationButtonNode).toBeInTheDocument();
    userEvent.click(cloneIntegrationButtonNode);
  }, 30000);
  test('Should able to access the Integration clone preview page of type sandbox', async () => {
    const props = {
      match: {
        params: {
          resourceId: '5fc5e0e66cfe5b44bb95de70',
          resourceType: 'integrations',
        },
      },
      pathname: '/clone/integrations/5fc5e0e66cfe5b44bb95de70/preview',
      history: {
        push: jest.fn(),
      },
    };
    const integrationSession = {
      'integrations-5fc5e0e66cfe5b44bb95de70': {
        preview: {
          components: {
            objects: [
              {
                model: 'Integration',
                doc: {
                  _id: '5fc5e0e66cfe5b44bb95de70',
                  lastModified: '2021-09-29T16:17:12.522Z',
                  name: '3PL Central',
                  description: 'Testing Integration Description',
                  readme: 'https://staging.integrator.io/integrations/5fc5e0e66cfe5b44bb95de70/admin/readme/edit/readme ',
                  install: [],
                  sandbox: false,
                  _registeredConnectionIds: [
                    '5d529bfbdb0c7b14a6011a57',
                    '5fc5e4a46cfe5b44bb95df44',
                  ],
                  installSteps: [],
                  uninstallSteps: [],
                  flowGroupings: [],
                  createdAt: '2020-12-01T06:21:26.538Z',
                },
              },
              {
                model: 'Flow',
                doc: {
                  _id: '60db46af9433830f8f0e0fe7',
                  lastModified: '2021-06-30T02:36:49.734Z',
                  name: '3PL Central - FTP',
                  description: 'Testing flows Description',
                  disabled: false,
                  _integrationId: '5fc5e0e66cfe5b44bb95de70',
                  skipRetries: false,
                  pageProcessors: [
                    {
                      responseMapping: {
                        fields: [],
                        lists: [],
                      },
                      type: 'import',
                      _importId: '605b30767904202f31742092',
                    },
                  ],
                  pageGenerators: [
                    {
                      _exportId: '60dbc5a8a706701ed4a148ac',
                      skipRetries: false,
                    },
                  ],
                  createdAt: '2021-06-29T16:13:35.071Z',
                  lastExecutedAt: '2021-06-30T01:55:17.721Z',
                },
              },
              {
                model: 'Export',
                doc: {
                  _id: '60dbc5a8a706701ed4a148ac',
                  createdAt: '2021-06-30T01:15:20.177Z',
                  lastModified: '2021-06-30T02:36:51.936Z',
                  name: 'Test 3pl central export',
                  description: 'Test 3PL central export description',
                  _connectionId: '5fc5e4a46cfe5b44bb95df44',
                  apiIdentifier: 'ec742bc9b0',
                  asynchronous: true,
                  assistant: '3plcentral',
                  sandbox: false,
                  assistantMetadata: {
                    resource: 'orders',
                    version: 'latest',
                    operation: 'get_packages_details',
                  },
                  parsers: [],
                  http: {
                    relativeURI: '/orders/3862/packages',
                    method: 'GET',
                    successMediaType: 'json',
                    errorMediaType: 'json',
                    formType: 'assistant',
                  },
                  rawData: '5d4010e14cd24a7c773122ef5d92fdf3fcca446b9e5ac853c6287f70',
                  adaptorType: 'HTTPExport',
                },
              },
              {
                model: 'Import',
                doc: {
                  _id: '605b30767904202f31742092',
                  createdAt: '2021-03-24T12:28:38.813Z',
                  lastModified: '2021-04-29T15:37:16.667Z',
                  name: 'FTP Import 1',
                  description: 'Test FTP Import description',
                  _connectionId: '5d529bfbdb0c7b14a6011a57',
                  distributed: false,
                  apiIdentifier: 'if1d74ac06',
                  oneToMany: false,
                  sandbox: false,
                  file: {
                    fileName: 'walmart-canada-pagination.json',
                    type: 'json',
                  },
                  ftp: {
                    directoryPath: '/ChaitanyaReddyMule/Connector_dev',
                    fileName: 'walmart-canada-pagination.json',
                  },
                  adaptorType: 'FTPImport',
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5d529bfbdb0c7b14a6011a57',
                  createdAt: '2019-08-13T11:16:11.951Z',
                  lastModified: '2022-06-24T11:44:40.123Z',
                  type: 'ftp',
                  name: 'FTP Connection',
                  offline: true,
                  debugDate: '2021-02-08T12:50:45.678Z',
                  sandbox: false,
                  ftp: {
                    type: 'sftp',
                    hostURI: 'celigo.files.com',
                    username: 'chaitanyareddy.mule@celigo.com',
                    password: '******',
                    port: 22,
                    usePassiveMode: true,
                    userDirectoryIsRoot: false,
                    useImplicitFtps: true,
                    requireSocketReUse: false,
                  },
                },
              },
              {
                model: 'Connection',
                doc: {
                  _id: '5fc5e4a46cfe5b44bb95df44',
                  createdAt: '2020-12-01T06:37:24.341Z',
                  lastModified: '2022-07-15T06:51:28.160Z',
                  type: 'http',
                  name: '3PL Central Connection',
                  assistant: '3plcentral',
                  offline: false,
                  debugDate: '2021-06-30T02:54:38.481Z',
                  sandbox: false,
                  debugUntil: '2021-06-30T02:54:38.481Z',
                  http: {
                    formType: 'assistant',
                    _iClientId: '5fc5e169269ea947c166510c',
                    mediaType: 'json',
                    baseURI: 'https://secure-wms.com/',
                    ping: {
                      relativeURI: 'orders',
                      method: 'GET',
                      failValues: [],
                      successValues: [],
                    },
                    rateLimit: {
                      failValues: [],
                    },
                    unencrypted: {
                      tpl: 'b779b82f-f5e5-4d59-a2c9-ea2c5eb8eec3',
                      userLoginId: 'Celigo_SandBox',
                    },
                    auth: {
                      type: 'oauth',
                      failValues: [],
                      oauth: {
                        tokenURI: 'https://secure-wms.com/AuthServer/api/Token',
                        scope: [],
                        grantType: 'clientcredentials',
                        clientCredentialsLocation: 'basicauthheader',
                        accessTokenBody: '{"grant_type": "client_credentials","tpl":"{b779b82f-f5e5-4d59-a2c9-ea2c5eb8eec3}", "user_login_id":"Celigo_SandBox"}',
                      },
                      token: {
                        token: '******',
                        location: 'header',
                        headerName: 'Authorization',
                        scheme: 'Bearer',
                        refreshMethod: 'POST',
                        refreshMediaType: 'urlencoded',
                      },
                    },
                  },
                },
              },
            ],
            stackRequired: false,
            _stackId: null,
          },
          status: 'success',
        },
      },
    };

    initStore(integrationSession);
    await initClonePreview(props);
    const cloneIntegrationHeadingNode = screen.getByRole('heading', {name: 'Clone integration'});

    expect(cloneIntegrationHeadingNode).toBeInTheDocument();
    const integrationNameNode = screen.getByRole('textbox', {value: 'Clone - 3PL Central'});

    expect(integrationNameNode).toBeInTheDocument();
    await userEvent.clear(integrationNameNode);
    await userEvent.type(integrationNameNode, 'Succesfully Cloned - 3Pl Central');
    expect(integrationNameNode).toHaveValue('Succesfully Cloned - 3Pl Central');
    const environmentNode = screen.getByRole('radiogroup', {name: 'Environment'});

    expect(environmentNode).toBeInTheDocument();
    const environmentProductionNode = screen.getByRole('radio', {name: 'Production'});

    expect(environmentProductionNode).toBeInTheDocument();
    const environmentSandboxNode = screen.getByRole('radio', {name: 'Sandbox'});

    expect(environmentSandboxNode).toBeInTheDocument();
    userEvent.click(environmentSandboxNode);
    expect(environmentSandboxNode).toBeChecked();
    expect(environmentProductionNode).not.toBeChecked();
    const paragraphNode = screen.getByText('The following components will get cloned with this integration.');

    expect(paragraphNode).toBeInTheDocument();
    const flowButtonNode = screen.getByRole('button', {name: 'Flows'});

    expect(flowButtonNode).toBeInTheDocument();
    expect(flowButtonNode).toHaveAttribute('aria-expanded', 'true');
    userEvent.click(flowButtonNode);
    expect(flowButtonNode).toHaveAttribute('aria-expanded', 'false');
    const tableNode = screen.getAllByRole('rowgroup');

    expect(tableNode[0].querySelectorAll('thead').length).toBe(0);
    expect(tableNode[1].querySelectorAll('tbody').length).toBe(0);
    const tableRow = screen.getAllByRole('row', {name: 'Name Description'});

    expect(tableRow[0].querySelectorAll('th').length).toBe(2);
    const integrationsButtonNode = screen.getByRole('button', {name: 'Integrations'});

    expect(integrationsButtonNode).toBeInTheDocument();
    expect(integrationsButtonNode).toHaveAttribute('aria-expanded', 'false');
    userEvent.click(integrationsButtonNode);
    expect(integrationsButtonNode).toHaveAttribute('aria-expanded', 'true');
    const exportButtonNode = screen.getByRole('button', {name: 'Exports'});

    expect(exportButtonNode).toBeInTheDocument();
    expect(exportButtonNode).toHaveAttribute('aria-expanded', 'false');
    userEvent.click(exportButtonNode);
    expect(exportButtonNode).toHaveAttribute('aria-expanded', 'true');
    const importButtonNode = screen.getByRole('button', {name: 'Imports'});

    expect(importButtonNode).toBeInTheDocument();
    expect(importButtonNode).toHaveAttribute('aria-expanded', 'false');
    userEvent.click(importButtonNode);
    expect(importButtonNode).toHaveAttribute('aria-expanded', 'true');
    const connectionsButtonNode = screen.getByRole('button', {name: 'Connections'});

    expect(connectionsButtonNode).toBeInTheDocument();
    expect(connectionsButtonNode).toHaveAttribute('aria-expanded', 'false');
    userEvent.click(connectionsButtonNode);
    expect(connectionsButtonNode).toHaveAttribute('aria-expanded', 'true');
    const cloneIntegrationButtonNode = screen.getByRole('button', {name: 'Clone integration'});

    expect(cloneIntegrationButtonNode).toBeInTheDocument();
    userEvent.click(cloneIntegrationButtonNode);
  }, 30000);
  test('Should able to acess the Integration Clone preview page by using created components which has Integrations', async () => {
    const props = {
      match: {
        params: {
          resourceId: '5fc5e0e66cfe5b44bb95de70',
          resourceType: 'integrations',
        },
      },
      pathname: '/clone/integrations/5fc5e0e66cfe5b44bb95de70/preview',
      history: {
        push: jest.fn(),
      },
    };
    const integrationSession = {
      'integrations-5fc5e0e66cfe5b44bb95de70': {

        createdComponents: [
          {
            model: 'Integration',
            doc: {
              _id: '5fc5e0e66cfe5b44bb95de70',
              lastModified: '2021-09-29T16:17:12.522Z',
              name: '3PL Central',
              description: 'Testing Integration Description',
              readme: 'https://staging.integrator.io/integrations/5fc5e0e66cfe5b44bb95de70/admin/readme/edit/readme ',
              install: [],
              sandbox: false,
              _registeredConnectionIds: [
                '5d529bfbdb0c7b14a6011a57',
                '5fc5e4a46cfe5b44bb95df44',
              ],
              installSteps: [],
              uninstallSteps: [],
              flowGroupings: [],
              createdAt: '2020-12-01T06:21:26.538Z',
            },
          },
          {
            model: 'Flow',
            doc: {
              _id: '60db46af9433830f8f0e0fe7',
              lastModified: '2021-06-30T02:36:49.734Z',
              name: '3PL Central - FTP',
              description: 'Testing flows Description',
              disabled: false,
              _integrationId: '5fc5e0e66cfe5b44bb95de70',
              skipRetries: false,
              pageProcessors: [
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  type: 'import',
                  _importId: '605b30767904202f31742092',
                },
              ],
              pageGenerators: [
                {
                  _exportId: '60dbc5a8a706701ed4a148ac',
                  skipRetries: false,
                },
              ],
              createdAt: '2021-06-29T16:13:35.071Z',
              lastExecutedAt: '2021-06-30T01:55:17.721Z',
            },
          },
          {
            model: 'Export',
            doc: {
              _id: '60dbc5a8a706701ed4a148ac',
              createdAt: '2021-06-30T01:15:20.177Z',
              lastModified: '2021-06-30T02:36:51.936Z',
              name: 'Test 3pl central export',
              description: 'Test 3PL central export description',
              _connectionId: '5fc5e4a46cfe5b44bb95df44',
              apiIdentifier: 'ec742bc9b0',
              asynchronous: true,
              assistant: '3plcentral',
              sandbox: false,
              assistantMetadata: {
                resource: 'orders',
                version: 'latest',
                operation: 'get_packages_details',
              },
              parsers: [],
              http: {
                relativeURI: '/orders/3862/packages',
                method: 'GET',
                successMediaType: 'json',
                errorMediaType: 'json',
                formType: 'assistant',
              },
              rawData: '5d4010e14cd24a7c773122ef5d92fdf3fcca446b9e5ac853c6287f70',
              adaptorType: 'HTTPExport',
            },
          },
          {
            model: 'Import',
            doc: {
              _id: '605b30767904202f31742092',
              createdAt: '2021-03-24T12:28:38.813Z',
              lastModified: '2021-04-29T15:37:16.667Z',
              name: 'FTP Import 1',
              description: 'Test FTP Import description',
              _connectionId: '5d529bfbdb0c7b14a6011a57',
              distributed: false,
              apiIdentifier: 'if1d74ac06',
              oneToMany: false,
              sandbox: false,
              file: {
                fileName: 'walmart-canada-pagination.json',
                type: 'json',
              },
              ftp: {
                directoryPath: '/ChaitanyaReddyMule/Connector_dev',
                fileName: 'walmart-canada-pagination.json',
              },
              adaptorType: 'FTPImport',
            },
          },
          {
            model: 'Connection',
            doc: {
              _id: '5d529bfbdb0c7b14a6011a57',
              createdAt: '2019-08-13T11:16:11.951Z',
              lastModified: '2022-06-24T11:44:40.123Z',
              type: 'ftp',
              name: 'FTP Connection',
              offline: true,
              debugDate: '2021-02-08T12:50:45.678Z',
              sandbox: false,
              ftp: {
                type: 'sftp',
                hostURI: 'celigo.files.com',
                username: 'chaitanyareddy.mule@celigo.com',
                password: '******',
                port: 22,
                usePassiveMode: true,
                userDirectoryIsRoot: false,
                useImplicitFtps: true,
                requireSocketReUse: false,
              },
            },
          },
          {
            model: 'Connection',
            doc: {
              _id: '5fc5e4a46cfe5b44bb95df44',
              createdAt: '2020-12-01T06:37:24.341Z',
              lastModified: '2022-07-15T06:51:28.160Z',
              type: 'http',
              name: '3PL Central Connection',
              assistant: '3plcentral',
              offline: false,
              debugDate: '2021-06-30T02:54:38.481Z',
              sandbox: false,
              debugUntil: '2021-06-30T02:54:38.481Z',
              http: {
                formType: 'assistant',
                _iClientId: '5fc5e169269ea947c166510c',
                mediaType: 'json',
                baseURI: 'https://secure-wms.com/',
                ping: {
                  relativeURI: 'orders',
                  method: 'GET',
                  failValues: [],
                  successValues: [],
                },
                rateLimit: {
                  failValues: [],
                },
                unencrypted: {
                  tpl: 'b779b82f-f5e5-4d59-a2c9-ea2c5eb8eec3',
                  userLoginId: 'Celigo_SandBox',
                },
                auth: {
                  type: 'oauth',
                  failValues: [],
                  oauth: {
                    tokenURI: 'https://secure-wms.com/AuthServer/api/Token',
                    scope: [],
                    grantType: 'clientcredentials',
                    clientCredentialsLocation: 'basicauthheader',
                    accessTokenBody: '{"grant_type": "client_credentials","tpl":"{b779b82f-f5e5-4d59-a2c9-ea2c5eb8eec3}", "user_login_id":"Celigo_SandBox"}',
                  },
                  token: {
                    token: '******',
                    location: 'header',
                    headerName: 'Authorization',
                    scheme: 'Bearer',
                    refreshMethod: 'POST',
                    refreshMediaType: 'urlencoded',
                  },
                },
              },
            },
          },
        ],
      },
    };

    initStore(integrationSession);
    await initClonePreview(props);
    const loading = screen.getByText('Loading');

    expect(loading).toBeInTheDocument();
  });
  test('Should able to acess the Integration Clone preview page by using created components which has no Integrations', async () => {
    const props = {
      match: {
        params: {
          resourceId: '60db46af9433830f8f0e0fe7',
          resourceType: 'flows',
        },
      },
      pathname: '/clone/flows/60db46af9433830f8f0e0fe7/preview',
      history: {
        push: jest.fn(),
      },
    };
    const integrationSession = {
      'flows-60db46af9433830f8f0e0fe7': {
        createdComponents: [
          {
            model: 'Flow',
            doc: {
              _id: '60db46af9433830f8f0e0fe7',
              lastModified: '2022-07-27T18:04:57.044Z',
              name: '3PL Central - FTP',
              description: 'Testing Flow',
              disabled: false,
              _integrationId: '5fc5e0e66cfe5b44bb95de70',
              skipRetries: false,
              pageProcessors: [
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  type: 'import',
                  _importId: '605b30767904202f31742092',
                },
              ],
              pageGenerators: [
                {
                  _exportId: '60dbc5a8a706701ed4a148ac',
                  skipRetries: false,
                },
              ],
              createdAt: '2021-06-29T16:13:35.071Z',
              lastExecutedAt: '2021-06-30T01:55:17.721Z',
              autoResolveMatchingTraceKeys: true,
            },
          },
          {
            model: 'Export',
            doc: {
              _id: '60dbc5a8a706701ed4a148ac',
              createdAt: '2021-06-30T01:15:20.177Z',
              lastModified: '2022-07-27T18:04:41.999Z',
              name: 'Test 3pl central export',
              description: 'Test 3PL central export description',
              _connectionId: '5fc5e4a46cfe5b44bb95df44',
              apiIdentifier: 'ec742bc9b0',
              asynchronous: true,
              assistant: '3plcentral',
              oneToMany: false,
              sandbox: false,
              assistantMetadata: {
                resource: 'orders',
                version: 'latest',
                operation: 'get_packages_details',
              },
              parsers: [],
              http: {
                relativeURI: '/orders/3862/packages',
                method: 'GET',
                requestMediaType: 'json',
                successMediaType: 'json',
                errorMediaType: 'json',
                formType: 'assistant',
              },
              rawData: '5d4010e14cd24a7c773122efebb372a471d8466aa1e52b628035c2a7',
              adaptorType: 'HTTPExport',
            },
          },
          {
            model: 'Import',
            doc: {
              _id: '605b30767904202f31742092',
              createdAt: '2021-03-24T12:28:38.813Z',
              lastModified: '2022-07-27T18:04:53.906Z',
              name: 'FTP Import 1',
              description: 'Test FTP Import description',
              _connectionId: '5d529bfbdb0c7b14a6011a57',
              distributed: false,
              apiIdentifier: 'if1d74ac06',
              oneToMany: false,
              sandbox: false,
              file: {
                fileName: 'walmart-canada-pagination.json',
                skipAggregation: false,
                type: 'json',
              },
              ftp: {
                directoryPath: '/ChaitanyaReddyMule/Connector_dev',
                fileName: 'walmart-canada-pagination.json',
              },
              adaptorType: 'FTPImport',
            },
          },
          {
            model: 'Connection',
            doc: {
              _id: '5d529bfbdb0c7b14a6011a57',
              createdAt: '2019-08-13T11:16:11.951Z',
              lastModified: '2022-06-24T11:44:40.123Z',
              type: 'ftp',
              name: 'FTP Connection',
              offline: true,
              debugDate: '2021-02-08T12:50:45.678Z',
              sandbox: false,
              ftp: {
                type: 'sftp',
                hostURI: 'celigo.files.com',
                username: 'chaitanyareddy.mule@celigo.com',
                password: '******',
                port: 22,
                usePassiveMode: true,
                userDirectoryIsRoot: false,
                useImplicitFtps: true,
                requireSocketReUse: false,
              },
            },
          },
          {
            model: 'Connection',
            doc: {
              _id: '5fc5e4a46cfe5b44bb95df44',
              createdAt: '2020-12-01T06:37:24.341Z',
              lastModified: '2022-07-27T18:02:24.948Z',
              type: 'http',
              name: '3PL Central Connection',
              assistant: '3plcentral',
              offline: false,
              debugDate: '2021-06-30T02:54:38.481Z',
              sandbox: false,
              debugUntil: '2021-06-30T02:54:38.481Z',
              http: {
                formType: 'assistant',
                _iClientId: '5fc5e169269ea947c166510c',
                mediaType: 'json',
                baseURI: 'https://secure-wms.com/',
                ping: {
                  relativeURI: 'orders',
                  method: 'GET',
                  failValues: [],
                  successValues: [],
                },
                rateLimit: {
                  failValues: [],
                },
                unencrypted: {
                  tpl: 'b779b82f-f5e5-4d59-a2c9-ea2c5eb8eec3',
                  userLoginId: 'Celigo_SandBox',
                },
                auth: {
                  type: 'oauth',
                  failValues: [],
                  oauth: {
                    tokenURI: 'https://secure-wms.com/AuthServer/api/Token',
                    scope: [],
                    grantType: 'clientcredentials',
                    clientCredentialsLocation: 'basicauthheader',
                    accessTokenBody: '{"grant_type": "client_credentials","tpl":"{b779b82f-f5e5-4d59-a2c9-ea2c5eb8eec3}", "user_login_id":"Celigo_SandBox"}',
                  },
                  token: {
                    token: '******',
                    location: 'header',
                    headerName: 'Authorization',
                    scheme: 'Bearer',
                    refreshMethod: 'POST',
                    refreshMediaType: 'urlencoded',
                  },
                },
              },
            },
          },
        ],
      },
    };

    initStore(integrationSession);
    await initClonePreview(props);
    const loading = screen.getByText('Loading');

    expect(loading).toBeInTheDocument();
  });
  test('Should able to acess the Export Clone preview page by using created components which has no Integrations and flows', async () => {
    const props = {
      match: {
        params: {
          resourceId: '60dbc5a8a706701ed4a148ac',
          resourceType: 'exports',
        },
      },
      pathname: '/clone/exports/60dbc5a8a706701ed4a148ac/preview',
      history: {
        push: jest.fn(),
      },
    };
    const integrationSession = {
      'exports-60dbc5a8a706701ed4a148ac': {
        createdComponents: [
          {
            model: 'Export',
            doc: {
              _id: '60dbc5a8a706701ed4a148ac',
              createdAt: '2021-06-30T01:15:20.177Z',
              lastModified: '2022-07-27T18:04:41.999Z',
              name: 'Test 3pl central export',
              description: 'Test 3PL central export description',
              _connectionId: '5fc5e4a46cfe5b44bb95df44',
              apiIdentifier: 'ec742bc9b0',
              asynchronous: true,
              assistant: '3plcentral',
              oneToMany: false,
              sandbox: false,
              assistantMetadata: {
                resource: 'orders',
                version: 'latest',
                operation: 'get_packages_details',
              },
              parsers: [],
              http: {
                relativeURI: '/orders/3862/packages',
                method: 'GET',
                requestMediaType: 'json',
                successMediaType: 'json',
                errorMediaType: 'json',
                formType: 'assistant',
              },
              rawData: '5d4010e14cd24a7c773122efebb372a471d8466aa1e52b628035c2a7',
              adaptorType: 'HTTPExport',
            },
          },
          {
            model: 'Connection',
            doc: {
              _id: '5fc5e4a46cfe5b44bb95df44',
              createdAt: '2020-12-01T06:37:24.341Z',
              lastModified: '2022-07-27T18:02:24.948Z',
              type: 'http',
              name: '3PL Central Connection',
              assistant: '3plcentral',
              offline: false,
              debugDate: '2021-06-30T02:54:38.481Z',
              sandbox: false,
              debugUntil: '2021-06-30T02:54:38.481Z',
              http: {
                formType: 'assistant',
                _iClientId: '5fc5e169269ea947c166510c',
                mediaType: 'json',
                baseURI: 'https://secure-wms.com/',
                ping: {
                  relativeURI: 'orders',
                  method: 'GET',
                  failValues: [],
                  successValues: [],
                },
                rateLimit: {
                  failValues: [],
                },
                unencrypted: {
                  tpl: 'b779b82f-f5e5-4d59-a2c9-ea2c5eb8eec3',
                  userLoginId: 'Celigo_SandBox',
                },
                auth: {
                  type: 'oauth',
                  failValues: [],
                  oauth: {
                    tokenURI: 'https://secure-wms.com/AuthServer/api/Token',
                    scope: [],
                    grantType: 'clientcredentials',
                    clientCredentialsLocation: 'basicauthheader',
                    accessTokenBody: '{"grant_type": "client_credentials","tpl":"{b779b82f-f5e5-4d59-a2c9-ea2c5eb8eec3}", "user_login_id":"Celigo_SandBox"}',
                  },
                  token: {
                    token: '******',
                    location: 'header',
                    headerName: 'Authorization',
                    scheme: 'Bearer',
                    refreshMethod: 'POST',
                    refreshMediaType: 'urlencoded',
                  },
                },
              },
            },
          },
        ],
      },
    };

    initStore(integrationSession);
    await initClonePreview(props);
    const loading = screen.getByText('Loading');

    expect(loading).toBeInTheDocument();
  });
});

