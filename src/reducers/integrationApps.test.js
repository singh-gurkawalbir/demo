/* global describe, expect, test */
import reducer, { selectors } from '.';

const integrations = [
  {
    _id: 'integrationId',
    name: 'Cash Application Manager for NetSuite',
    _connectorId: '57d6475369ae57ad50bf835b',
    mode: 'settings',
    settings: {
      general: [
        {
          id: 'fb5fb65e',
          description:
            'This section contains setting options which impact the entire Connector.',
          fields: [
            {
              label: 'Enable Manual Upload Mode',
              type: 'checkbox',
              name: 'enableManualUploadMode_fb5fb65e',

            },
          ],
        },
        {
          id: 'dd67a407',
          description:
            'This section contains setting options which impact the entire Connector.',
          fields: [
            {
              label: 'Enable Manual Upload Mode',
              type: 'checkbox',
              name: 'enableManualUploadMode_dd67a407',

            },
          ],
        },
        {
          id: '9606430a',
          description:
            'This section contains setting options which impact the entire Connector.',
          fields: [
            {
              label: 'Enable Manual Upload Mode',
              type: 'checkbox',
              name: 'enableManualUploadMode_9606430a',

            },
          ],
        },
      ],
      connectorEdition: 'premium',
      hideUninstall: true,
      sections: [
        {
          title: 'BILLTECH',
          id: 'fb5fb65e',
          sections: [
            {
              title: 'CSV',
              iconURL: '/images/icons/settings/BAI2.png',
              flows: [
                {
                  _id: '5d9f70b98a71fc911a4068bd',
                  showMapping: true,
                  showSchedule: true,
                  sections: [
                    {
                      title: 'File Import',
                      fields: [
                        {
                          label: 'Directory Path:',
                          type: 'input',
                          name: 'directoryPath_5d9f70b98a71fc911a4068bd',
                          required: true,
                          placeholder:
                            'Enter FTP folder path, such as Directory/File',

                        },
                        {
                          label: 'File Name Starts With:',
                          type: 'input',
                          name: 'fileNameStartsWith_5d9f70b98a71fc911a4068bd',
                          placeholder: 'Optional',

                        },
                        {
                          label: 'File Name Ends With:',
                          type: 'input',
                          name: 'fileNameEndsWith_5d9f70b98a71fc911a4068bd',
                          placeholder: 'Optional',

                        },
                        {
                          label: 'Sample File:',
                          type: 'file',
                          name: 'ftp_sample_file_5d9f70b98a71fc911a4068bd',
                          value: '',

                        },
                        {
                          label: 'Leave File On Server',
                          type: 'checkbox',
                          name: 'skipDelete_5d9f70b98a71fc911a4068bd',
                          value: false,

                        },
                        {
                          label: 'Use Credit Memos',
                          type: 'checkbox',
                          name:
                            'checkbox_credit_memo_5d9f70b98a71fc911a4068bd',
                          value: false,

                        },
                        {
                          label: 'Ignore following Customers:',
                          type: 'textarea',
                          name:
                            'textarea_customer_filter_5d9f70b98a71fc911a4068bd',
                          value: '',
                          placeholder: 'eg. ACME Inc., S Industries',

                        },
                        {
                          label: 'NetSuite Invoice Prefix:',
                          type: 'textarea',
                          name:
                            'textarea_ns_invoice_prefix_5d9f70b98a71fc911a4068bd',
                          value: '',
                          placeholder: 'eg. INV, IV',

                        },
                        {
                          label: 'NetSuite Invoice Identifier',
                          type: 'select',
                          name:
                            'select_ns_invoice_identifier_5d9f70b98a71fc911a4068bd',
                          options: [['tranid_Invoice #', 'Invoice #']],
                          value: 'tranid_Invoice #',
                          supportsRefresh: true,

                        },
                        {
                          label: 'Column delimiter:',
                          type: 'input',
                          name: 'columnDelimiter_5d9f70b98a71fc911a4068bd',
                          placeholder: 'Optional',

                        },
                        {
                          label: 'Archive file',
                          type: 'checkbox',
                          name: 'archive_file_5d9f70b98a71fc911a4068bd',
                          value: false,

                          dependencies: {
                            disabled: {
                              fields: [
                                {
                                  name:
                                    'netsuite_archive_dir_5d9f70b98a71fc911a4068bd',
                                  hidden: true,
                                  required: false,
                                },
                              ],
                            },
                            enabled: {
                              fields: [
                                {
                                  name:
                                    'netsuite_archive_dir_5d9f70b98a71fc911a4068bd',
                                  hidden: false,
                                  required: true,
                                },
                              ],
                            },
                          },
                        },
                      ],
                    },
                    {
                      title: 'File Parsing',
                      fields: [
                        {
                          label: 'Batch Record',
                          title: 'Batch Record',
                          type: 'csvColumnMapper',
                          maxNumberOfColumns: 50,
                          name: '_batch_record_5d9f70b98a71fc911a4068bd',
                          value: [],

                        },
                        {
                          label: 'Transaction Record',
                          title: 'Transaction Record',
                          type: 'csvColumnMapper',
                          maxNumberOfColumns: 50,
                          name:
                            '_transaction_record_5d9f70b98a71fc911a4068bd',
                          value: [
                            {
                              fieldName: 'Transaction Id',
                              column: '1',
                            },
                          ],

                        },
                        {
                          label: 'Invoice Record',
                          title: 'Invoice Record',
                          type: 'csvColumnMapper',
                          maxNumberOfColumns: 50,
                          name: '_invoice_record_5d9f70b98a71fc911a4068bd',
                          value: [
                            {
                              fieldName: 'Invoice number',
                              column: '19',
                            },
                            {
                              fieldName: 'Invoice Date',
                              column: '4',
                            },
                            {
                              fieldName: 'Invoice amount',
                              column: '8',
                            },
                          ],

                        },
                      ],
                    },
                    {
                      title: 'Advanced Settings',
                      fields: [
                        {
                          label: 'Transaction Filter: Choose an action',
                          type: 'radio',
                          name:
                            'transactionFilterOptions_5d9f70b98a71fc911a4068bd',
                          properties: {
                            sectionName: 'Filter Settings',
                          },
                          options: [
                            ['skip', 'Skip'],
                            ['allow', 'Allow'],
                            ['default', 'Default'],
                          ],

                        },
                        {
                          label: 'Enter Transaction Codes',
                          type: 'input',
                          name: 'transactionCodes_5d9f70b98a71fc911a4068bd',
                          placeholder: 'eg. 100,102,104,201-299,305',

                          properties: {
                            sectionName: 'Filter Settings',
                          },
                        },
                        {
                          label: 'Default Currency',
                          type: 'select',
                          name:
                            'select_bank_currency_5d9f70b98a71fc911a4068bd',
                          options: [],
                          supportsRefresh: true,

                          properties: {
                            sectionName: 'Payment Settings',
                          },
                        },
                        {
                          label: 'Customer Has Priority',
                          type: 'checkbox',
                          name:
                            'checkbox_customer_priority_5d9f70b98a71fc911a4068bd',

                          properties: {
                            sectionName: 'Matching Settings',
                          },
                        },
                        {
                          label: 'Identify invoice with Amount',
                          name:
                            'checkbox_match_invoice_with_amount_5d9f70b98a71fc911a4068bd',
                          type: 'checkbox',
                          value: false,

                          properties: {
                            sectionName: 'Matching Settings',
                          },
                        },
                        {
                          label: 'Skip Zero Amount Transactions',
                          type: 'checkbox',
                          name:
                            'checkbox_skip_zero_amount_transactions_5d9f70b98a71fc911a4068bd',
                          value: true,

                          properties: {
                            sectionName: 'Payment Settings',
                          },
                        },
                        {
                          label:
                            "Don't create payment in locked posting period",
                          type: 'checkbox',
                          name:
                            'checkbox_validate_posting_period_5d9f70b98a71fc911a4068bd',
                          value: true,

                          properties: {
                            sectionName: 'Payment Settings',
                          },
                        },
                        {
                          label: 'Advanced Search for Customers',
                          type: 'checkbox',
                          name:
                            'checkbox_use_fuzzy_search_5d9f70b98a71fc911a4068bd',
                          value: false,

                          dependencies: {
                            disabled: {
                              fields: [
                                {
                                  name:
                                    'fuzzy_config_threshold_value_5d9f70b98a71fc911a4068bd',
                                  hidden: true,
                                  required: false,
                                },
                              ],
                            },
                            enabled: {
                              fields: [
                                {
                                  name:
                                    'fuzzy_config_threshold_value_5d9f70b98a71fc911a4068bd',
                                  hidden: false,
                                  required: true,
                                },
                              ],
                            },
                          },
                          properties: {
                            sectionName: 'Matching Settings',
                          },
                        },
                        {
                          label: 'Threshold',
                          type: 'input',
                          name:
                            'fuzzy_config_threshold_value_5d9f70b98a71fc911a4068bd',
                          value: '0.1',

                          properties: {
                            sectionName: 'Matching Settings',
                          },
                        },
                        {
                          type: 'subsidiaryMapWidget',
                          name:
                            'multisubsidiary_settings_5d9f70b98a71fc911a4068bd',

                          title: 'Multi-subsidiary Settings',
                          optionsMap: [
                            {
                              id: 'subsidiary',
                              name: 'Subsidiary',
                              type: 'select',
                              options: [],
                            },
                            {
                              id: 'paymentAccount',
                              name: 'Payment Account',
                              type: 'select',
                              options: [],
                            },
                            {
                              id: 'debitAccount',
                              name: 'Write off Account',
                              type: 'select',
                              options: [],
                            },
                            {
                              id: 'depositAccount',
                              name: 'Customer Deposit Account',
                              type: 'select',
                              options: [],
                            },
                            {
                              id: 'dummyCustomer',
                              name: 'Dummy Customer',
                              type: 'input',
                            },
                          ],
                          value: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          title: 'HSBC',
          id: 'dd67a407',
          sections: [
            {
              title: 'CSV',
              iconURL: '/images/icons/settings/BAI2.png',
              flows: [
                {
                  _id: '5d9f71628a71fc911a4068d9',
                  showMapping: true,
                  showSchedule: true,
                  sections: [
                    {
                      title: 'File Import',
                      fields: [
                        {
                          label: 'Directory Path:',
                          type: 'input',
                          name: 'directoryPath_5d9f71628a71fc911a4068d9',
                          required: true,
                          placeholder:
                            'Enter FTP folder path, such as Directory/File',

                        },
                        {
                          label: 'File Name Starts With:',
                          type: 'input',
                          name: 'fileNameStartsWith_5d9f71628a71fc911a4068d9',
                          placeholder: 'Optional',

                        },
                        {
                          label: 'File Name Ends With:',
                          type: 'input',
                          name: 'fileNameEndsWith_5d9f71628a71fc911a4068d9',
                          placeholder: 'Optional',

                        },
                        {
                          label: 'Sample File:',
                          type: 'file',
                          name: 'ftp_sample_file_5d9f71628a71fc911a4068d9',
                          value: '',

                        },
                        {
                          label: 'Leave File On Server',
                          type: 'checkbox',
                          name: 'skipDelete_5d9f71628a71fc911a4068d9',
                          value: false,

                        },
                        {
                          label: 'Use Credit Memos',
                          type: 'checkbox',
                          name:
                            'checkbox_credit_memo_5d9f71628a71fc911a4068d9',
                          value: false,

                        },
                        {
                          label: 'Ignore following Customers:',
                          type: 'textarea',
                          name:
                            'textarea_customer_filter_5d9f71628a71fc911a4068d9',
                          value: '',
                          placeholder: 'eg. ACME Inc., S Industries',

                        },
                        {
                          label: 'NetSuite Invoice Prefix:',
                          type: 'textarea',
                          name:
                            'textarea_ns_invoice_prefix_5d9f71628a71fc911a4068d9',
                          value: '',
                          placeholder: 'eg. INV, IV',

                        },
                        {
                          label: 'NetSuite Invoice Identifier',
                          type: 'select',
                          name:
                            'select_ns_invoice_identifier_5d9f71628a71fc911a4068d9',
                          options: [['tranid_Invoice #', 'Invoice #']],
                          value: 'tranid_Invoice #',
                          supportsRefresh: true,

                        },
                        {
                          label: 'Column delimiter:',
                          type: 'input',
                          name: 'columnDelimiter_5d9f71628a71fc911a4068d9',
                          placeholder: 'Optional',

                        },
                        {
                          label: 'Archive file',
                          type: 'checkbox',
                          name: 'archive_file_5d9f71628a71fc911a4068d9',
                          value: false,

                          dependencies: {
                            disabled: {
                              fields: [
                                {
                                  name:
                                    'netsuite_archive_dir_5d9f71628a71fc911a4068d9',
                                  hidden: true,
                                  required: false,
                                },
                              ],
                            },
                            enabled: {
                              fields: [
                                {
                                  name:
                                    'netsuite_archive_dir_5d9f71628a71fc911a4068d9',
                                  hidden: false,
                                  required: true,
                                },
                              ],
                            },
                          },
                        },
                        {
                          label: 'NetSuite Archive Folder: ',
                          type: 'input',
                          name:
                            'netsuite_archive_dir_5d9f71628a71fc911a4068d9',
                          placeholder: 'Optional',

                        },
                        {
                          label: 'File Has Header Row',
                          type: 'checkbox',
                          name: 'hasHeaderRow_5d9f71628a71fc911a4068d9',
                          value: false,

                        },
                      ],
                    },
                    {
                      title: 'File Parsing',
                      fields: [
                        {
                          label: 'Batch Record',
                          title: 'Batch Record',
                          type: 'csvColumnMapper',
                          maxNumberOfColumns: 50,
                          name: '_batch_record_5d9f71628a71fc911a4068d9',
                          value: [
                            {
                              fieldName: 'Batch Number',
                              column: '1',
                              columnName: 'BATCH NUMBER',
                            },
                            {
                              fieldName: 'Batch Date',
                              column: '2',
                              columnName: 'DEPOSIT DATE',
                            },
                          ],

                        },
                        {
                          label: 'Transaction Record',
                          title: 'Transaction Record',
                          type: 'csvColumnMapper',
                          maxNumberOfColumns: 50,
                          name:
                            '_transaction_record_5d9f71628a71fc911a4068d9',
                          value: [
                            {
                              fieldName: 'Transaction Id',
                              column: '3',
                              columnName: 'TRANSIT ROUTING #',
                            },
                            {
                              fieldName: 'Check Number',
                              column: '4',
                              columnName: 'CHECK NUMBER',
                            },
                            {
                              fieldName: 'Payment Amount',
                              column: '5',
                              columnName: 'CHECK AMOUNT',
                            },
                            {
                              fieldName: 'Customer Name',
                              column: '6',
                              columnName: 'REMITTER NAME',
                            },
                            {
                              fieldName: 'Check Date',
                              column: '7',
                              columnName: 'CHECK DATE',
                            },
                          ],

                        },
                        {
                          label: 'Invoice Record',
                          title: 'Invoice Record',
                          type: 'csvColumnMapper',
                          maxNumberOfColumns: 50,
                          name: '_invoice_record_5d9f71628a71fc911a4068d9',
                          value: [
                            {
                              fieldName: 'Invoice number',
                              column: '8',
                              columnName: 'INVOICE NUMBER',
                            },
                          ],

                        },
                      ],
                    },
                    {
                      title: 'Advanced Settings',
                      fields: [
                        {
                          label: 'Transaction Filter: Choose an action',
                          type: 'radio',
                          name:
                            'transactionFilterOptions_5d9f71628a71fc911a4068d9',
                          properties: {
                            sectionName: 'Filter Settings',
                          },
                          options: [
                            ['skip', 'Skip'],
                            ['allow', 'Allow'],
                            ['default', 'Default'],
                          ],

                        },
                        {
                          label: 'Enter Transaction Codes',
                          type: 'input',
                          name: 'transactionCodes_5d9f71628a71fc911a4068d9',
                          placeholder: 'eg. 100,102,104,201-299,305',

                          properties: {
                            sectionName: 'Filter Settings',
                          },
                        },
                        {
                          label: 'Default Currency',
                          type: 'select',
                          name:
                            'select_bank_currency_5d9f71628a71fc911a4068d9',
                          options: [],
                          supportsRefresh: true,

                          properties: {
                            sectionName: 'Payment Settings',
                          },
                        },
                        {
                          label: 'Customer Has Priority',
                          type: 'checkbox',
                          name:
                            'checkbox_customer_priority_5d9f71628a71fc911a4068d9',

                          properties: {
                            sectionName: 'Matching Settings',
                          },
                        },
                        {
                          label: 'Identify invoice with Amount',
                          name:
                            'checkbox_match_invoice_with_amount_5d9f71628a71fc911a4068d9',
                          type: 'checkbox',
                          value: false,

                          properties: {
                            sectionName: 'Matching Settings',
                          },
                        },
                        {
                          label: 'Skip Zero Amount Transactions',
                          type: 'checkbox',
                          name:
                            'checkbox_skip_zero_amount_transactions_5d9f71628a71fc911a4068d9',
                          value: true,

                          properties: {
                            sectionName: 'Payment Settings',
                          },
                        },
                        {
                          label:
                            "Don't create payment in locked posting period",
                          type: 'checkbox',
                          name:
                            'checkbox_validate_posting_period_5d9f71628a71fc911a4068d9',
                          value: true,

                          properties: {
                            sectionName: 'Payment Settings',
                          },
                        },
                        {
                          label: 'Advanced Search for Customers',
                          type: 'checkbox',
                          name:
                            'checkbox_use_fuzzy_search_5d9f71628a71fc911a4068d9',
                          value: false,

                          dependencies: {
                            disabled: {
                              fields: [
                                {
                                  name:
                                    'fuzzy_config_threshold_value_5d9f71628a71fc911a4068d9',
                                  hidden: true,
                                  required: false,
                                },
                              ],
                            },
                            enabled: {
                              fields: [
                                {
                                  name:
                                    'fuzzy_config_threshold_value_5d9f71628a71fc911a4068d9',
                                  hidden: false,
                                  required: true,
                                },
                              ],
                            },
                          },
                          properties: {
                            sectionName: 'Matching Settings',
                          },
                        },
                        {
                          label: 'Threshold',
                          type: 'input',
                          name:
                            'fuzzy_config_threshold_value_5d9f71628a71fc911a4068d9',
                          value: '0.1',

                          properties: {
                            sectionName: 'Matching Settings',
                          },
                        },
                        {
                          type: 'subsidiaryMapWidget',
                          name:
                            'multisubsidiary_settings_5d9f71628a71fc911a4068d9',

                          title: 'Multi-subsidiary Settings',
                          optionsMap: [
                            {
                              id: 'subsidiary',
                              name: 'Subsidiary',
                              type: 'select',
                              options: [],
                            },
                            {
                              id: 'paymentAccount',
                              name: 'Payment Account',
                              type: 'select',
                              options: [],
                            },
                            {
                              id: 'debitAccount',
                              name: 'Write off Account',
                              type: 'select',
                              options: [],
                            },
                            {
                              id: 'depositAccount',
                              name: 'Customer Deposit Account',
                              type: 'select',
                              options: [],
                            },
                            {
                              id: 'dummyCustomer',
                              name: 'Dummy Customer',
                              type: 'input',
                            },
                          ],
                          value: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      supportsMultiStore: true,
      supportsMatchRuleEngine: true,
      storeLabel: 'Bank',
    },
  },
  {
    _id: 'integrationId2',
    lastModified: '2019-10-21T06:53:12.363Z',
    name: 'Zendesk - NetSuite Connector',
    _connectorId: '57a84990c6c1b3551ea5d59c',
    mode: 'settings',
    settings: {
      general: {
        description:
          'This section contains setting options which impact the entire Connector.',
        fields: [
          {
            label: 'Enable Test Mode',
            type: 'checkbox',
            name: 'enableTestMode',

            value: false,
          },
          {
            label: 'Test Mode Text',
            name: 'testModeText',

            value: '',
          },
        ],
      },
      sections: [
        {
          title: 'Organization Sync',
          description:
            'This section contains settings to sync NetSuite Customers and Zendesk Organizations between the two systems.',
          columns: 1,
          flows: [
            {
              _id: '5d9b20328a71fc911a4018a4',
              showMapping: true,
              showSchedule: false,
              settings: [
                {
                  label: 'Execution Context',
                  type: 'multiselect',
                  name: 'executionContext',
                  value: [
                    'userevent',
                    'webservices',
                    'csvimport',
                    'userinterface',
                  ],
                  options: [
                    ['userevent', 'User Event'],
                    ['webservices', 'Web Services'],
                    ['csvimport', 'CSV Import'],
                    ['scheduled', 'Scheduled'],
                    ['workflow', 'Work Flow'],
                    ['userinterface', 'User Interface'],
                  ],
                },
                {
                  label: 'Execution Type',
                  type: 'multiselect',
                  name: 'executionType',
                  value: ['edit', 'create', 'xedit'],
                  options: [
                    ['edit', 'Edit'],
                    ['create', 'Create'],
                    ['xedit', 'xEdit'],
                  ],
                },
                {
                  label: 'Qualifier',
                  type: 'expression',
                  expressionType: 'export',
                  name: 'qualifier',
                  value:
                    '[["isperson","=","F"],"and",["custentity_celigo_znc_zendesk_id","empty",true]]',
                },
              ],
            },
            {
              _id: '5d9b20328a71fc911a4018ad',
              showMapping: true,
              showSchedule: false,
              settings: [
                {
                  label: 'Execution Context',
                  type: 'multiselect',
                  name: 'executionContext',
                  value: [
                    'userevent',
                    'webservices',
                    'csvimport',
                    'userinterface',
                  ],
                  options: [
                    ['userevent', 'User Event'],
                    ['webservices', 'Web Services'],
                    ['csvimport', 'CSV Import'],
                    ['scheduled', 'Scheduled'],
                    ['workflow', 'Work Flow'],
                    ['userinterface', 'User Interface'],
                  ],
                },
                {
                  label: 'Execution Type',
                  type: 'multiselect',
                  name: 'executionType',
                  value: ['edit', 'create', 'xedit'],
                  options: [
                    ['edit', 'Edit'],
                    ['create', 'Create'],
                    ['xedit', 'xEdit'],
                  ],
                },
                {
                  label: 'Qualifier',
                  type: 'expression',
                  expressionType: 'export',
                  name: 'qualifier',
                  value:
                    '[["isperson","=","F"],"and",["custentity_celigo_znc_zendesk_id","empty",false]]',
                },
              ],
            },
            {
              _id: '5d9b20328a71fc911a4018a7',
              showMapping: true,
              showSchedule: true,
            },
            {
              _id: '5d9b20328a71fc911a4018ac',
              showMapping: true,
              showSchedule: true,
            },
          ],
          fields: [
            {
              label: 'Sync all Zendesk Organizations as NetSuite Customers',
              type: 'checkbox',
              name: 'sync_zendesk_organizations_as_netsuite_customsers',

              value: true,
            },
          ],
        },
        {
          title: 'Tickets Sync',
          description:
            'This section contains settings to sync NetSuite Cases and Zendesk Tickets between the two systems.',
          editions: ['premium'],
          columns: 1,
          flows: [
            {
              _id: '5d9b20328a71fc911a4018a9',
              showMapping: true,
              showSchedule: false,
              settings: [
                {
                  label: 'Execution Context',
                  type: 'multiselect',
                  name: 'executionContext',
                  value: [
                    'userevent',
                    'webservices',
                    'csvimport',
                    'userinterface',
                  ],
                  options: [
                    ['userevent', 'User Event'],
                    ['webservices', 'Web Services'],
                    ['csvimport', 'CSV Import'],
                    ['scheduled', 'Scheduled'],
                    ['workflow', 'Work Flow'],
                    ['userinterface', 'User Interface'],
                  ],
                },
                {
                  label: 'Execution Type',
                  type: 'multiselect',
                  name: 'executionType',
                  value: ['edit', 'create'],
                  options: [['edit', 'Edit'], ['create', 'Create']],
                },
                {
                  label: 'Qualifier',
                  type: 'expression',
                  expressionType: 'export',
                  name: 'qualifier',
                  value: '["custevent_celigo_znc_zendesk_id","empty",true]',
                },
              ],
            },
            {
              _id: '5d9b20328a71fc911a4018a8',
              showMapping: true,
              showSchedule: false,
              settings: [
                {
                  label: 'Execution Context',
                  type: 'multiselect',
                  name: 'executionContext',
                  value: [
                    'userevent',
                    'webservices',
                    'csvimport',
                    'userinterface',
                  ],
                  options: [
                    ['userevent', 'User Event'],
                    ['webservices', 'Web Services'],
                    ['csvimport', 'CSV Import'],
                    ['scheduled', 'Scheduled'],
                    ['workflow', 'Work Flow'],
                    ['userinterface', 'User Interface'],
                  ],
                },
                {
                  label: 'Execution Type',
                  type: 'multiselect',
                  name: 'executionType',
                  value: ['edit', 'xedit'],
                  options: [['edit', 'Edit'], ['xedit', 'xEdit']],
                },
                {
                  label: 'Qualifier',
                  type: 'expression',
                  expressionType: 'export',
                  name: 'qualifier',
                  value: '["custevent_celigo_znc_zendesk_id","empty",false]',
                },
              ],
            },
            {
              _id: '5d9b20328a71fc911a4018b2',
              showMapping: true,
              showSchedule: true,
            },
            {
              _id: '5d9b20328a71fc911a4018b3',
              showMapping: true,
              showSchedule: true,
            },
            {
              _id: '5d9b20328a71fc911a4018b0',
              showMapping: true,
              showSchedule: true,
            },
            {
              _id: '5d9b20328a71fc911a4018ba',
              showMapping: true,
              showSchedule: true,
            },
          ],
          fields: [
            {
              label:
                'Create Zendesk Organization and User (if non-existent) while syncing NetSuite Support Case',
              type: 'checkbox',
              name: 'create_users_and_organizations_in_zendesk',

              value: false,
            },
            {
              label:
                'Create NetSuite Customer and Contact (if non-existent) while syncing Zendesk Ticket',
              type: 'checkbox',
              name: 'create_contacts_and_customers_in_netsuite',

              value: false,
            },
            {
              label:
                'Sync Zendesk Ticket Public Replies to NetSuite Case as Message',
              type: 'checkbox',
              name: 'sync_ticket_comments_to_netsuite',

              value: false,
            },

            {
              label:
                'Sync attachments in NetSuite Support Cases to Zendesk Tickets',
              type: 'checkbox',
              name: 'sync_attachments_from_netsuite_to_zendesk',

              value: false,
            },
          ],
        },
      ],
      connectorEdition: 'premium',
    },
  },
];
const flows = [
  {
    _id: '5d9b20328a71fc911a4018a4',
    name: '5d9b20328a71fc911a4018a4',
    _integrationId: 'integrationId2',
  },
  {
    _id: '5d9b20328a71fc911a4018ad',
    name: '5d9b20328a71fc911a4018ad',
    _integrationId: 'integrationId2',
  },
  {
    _id: '5d9b20328a71fc911a4018a7',
    name: '5d9b20328a71fc911a4018a7',
    _integrationId: 'integrationId2',
  },
  {
    _id: '5d9b20328a71fc911a4018ac',
    name: '5d9b20328a71fc911a4018ac',
    _integrationId: 'integrationId2',
  },
  {
    _id: '5d9b20328a71fc911a4018a9',
    name: '5d9b20328a71fc911a4018a9',
    _integrationId: 'integrationId2',
  },
  {
    _id: '5d9b20328a71fc911a4018a8',
    name: '5d9b20328a71fc911a4018a8',
    _integrationId: 'integrationId2',
  },
  {
    _id: '5d9b20328a71fc911a4018b2',
    name: '5d9b20328a71fc911a4018b2',
    _integrationId: 'integrationId2',
  },
  {
    _id: '5d9b20328a71fc911a4018b3',
    name: '5d9b20328a71fc911a4018b3',
    _integrationId: 'integrationId2',
  },
  {
    _id: '5d9b20328a71fc911a4018b0',
    name: '5d9b20328a71fc911a4018b0',
    _integrationId: 'integrationId2',
  },
  {
    _id: '5d9b20328a71fc911a4018ba',
    name: '5d9b20328a71fc911a4018ba',
    _integrationId: 'integrationId2',
  },
  {
    _id: '5d9f70b98a71fc911a4068bd',
    name: '5d9f70b98a71fc911a4068bd',
    _integrationId: 'integrationId',
  },
  {
    _id: '5d9f71628a71fc911a4068d9',
    name: '5d9f71628a71fc911a4068d9',
    _integrationId: 'integrationId',
  },
];

describe('integrationApps selector testcases', () => {
  describe('selectors.getFlowsAssociatedExportFromIAMetadata test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.getFlowsAssociatedExportFromIAMetadata({}, {})).toBe(null);
      expect(selectors.getFlowsAssociatedExportFromIAMetadata({})).toBe(null);
      expect(selectors.getFlowsAssociatedExportFromIAMetadata(null, {})).toBe(null);
    });
    test('should return correct Export details from IA metadata', () => {
      const state = {
        data: {
          resources: {
            exports: [{
              _id: 'exp1',
              name: 'Export',
            },
            {
              _id: 'exp2',
              name: 'Export2',
            }],
          },
        },
      };
      const metadata1 = {
        properties: {
          _exportId: 'exp1',
        },
      };
      const metadata2 = {
        properties: {
          _exportId: 'exp1',
        },
        resource: {
          _exportId: 'exp2',
        },
      };
      const metadata3 = {
        properties: {
          _exportId: 'exp2',
        },
        resource: {
          _exportId: 'exp1',
        },
      };
      const metadata4 = {
        resource: {
          pageGenerators: [{
            _exportId: 'exp2',
          }],
        },

      };

      expect(selectors.getFlowsAssociatedExportFromIAMetadata(state, metadata1)).toEqual({
        _id: 'exp1',
        name: 'Export',
      });
      expect(selectors.getFlowsAssociatedExportFromIAMetadata(state, metadata2)).toEqual({
        _id: 'exp1',
        name: 'Export',
      });
      expect(selectors.getFlowsAssociatedExportFromIAMetadata(state, metadata3)).toEqual({
        _id: 'exp2',
        name: 'Export2',
      });
      expect(selectors.getFlowsAssociatedExportFromIAMetadata(state, metadata4)).toEqual({
        _id: 'exp2',
        name: 'Export2',
      });
    });
  });

  describe('selectors.integrationConnectionList test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationConnectionList()).toEqual([]);
    });
  });

  describe('selectors.integrationAppV2FlowList test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationAppV2FlowList(undefined, {})).toBe(null);
    });
  });

  describe('selectors.integrationAppV2ConnectionList test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationAppV2ConnectionList()).toBe(null);
    });
  });

  describe('selectors.mkIntegrationAppResourceList test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkIntegrationAppResourceList();

      expect(selector(undefined, {})).toEqual({connections: [], flows: []});
    });
  });

  describe('selectors.mkIntegrationAppStore test cases', () => {
    const state = {
      data: {
        resources: {
          integrations: [{
            _id: 'integration1',
            name: 'Integration 1',
            _connectorId: 'connector',
            settings: {
              supportsMultiStore: true,
              sections: [{
                id: 'child1',
                mode: 'settings',
                title: 'Child 1',
                sections: [{
                  flows: [{}],
                  fields: [{}],
                }],
              },
              {
                id: 'child2',
                mode: 'uninstall',
                title: 'Child 2',
                sections: [{
                  flows: [{}],
                  fields: [{}],
                }],
              }],
            },
          }, {
            _id: 'integration2',
            name: 'Integration 2',
            _connectorId: 'connector2',
            settings: {
              sections: [{
                flows: [{}],
                fields: [{}],
              }],
            },
          }],
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkIntegrationAppStore();

      expect(selector()).toEqual({});
      expect(selector(null)).toEqual({});
      expect(selector({})).toEqual({});
      expect(selector({}, null)).toEqual({});
    });

    test('should return correct value for integration App with multistore and single store', () => {
      const selector = selectors.mkIntegrationAppStore();

      expect(selector(state, 'integration1', 'child1')).toEqual({
        hidden: false,
        label: 'Child 1',
        mode: 'settings',
        value: 'child1',
      });
      expect(selector(state, 'integration2', 'child1')).toEqual({});
    });
  });

  describe('integrationAppConnectionList reducer', () => {
    const integrations = [
      {
        _id: 'integrationId',
        name: 'Integration Name',
      },
      {
        _id: 'integrationId2',
        name: 'Integration Name',
        settings: {
          supportsMultiStore: true,
          sections: [
            {
              title: 'store1',
              id: 'store1',
              sections: [
                {
                  title: 'Section Title',
                  flows: [
                    {
                      _id: 'flow1',
                    },
                    {
                      _id: 'flow2',
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    ];
    const exports = [
      {
        _id: 'export1',
        name: 'export1',
        _connectionId: 'connection3',
      },
      {
        _id: 'export2',
        name: 'export2',
        _connectionId: 'connection4',
      },
    ];
    const imports = [
      {
        _id: 'import1',
        name: 'import1',
        _connectionId: 'connection3',
      },
      {
        _id: 'import1',
        name: 'import1',
        _connectionId: 'connection4',
      },
    ];
    const flows = [
      {
        _id: 'flow1',
        name: 'flow1',
        pageGenerators: [{ _exportId: 'export1' }],
        pageProcessors: [
          { _importId: 'import1', type: 'import' },
          { _importId: 'import2', type: 'import' },
        ],
      },
      {
        _id: 'flow2',
        name: 'flow2',
        pageGenerators: [{ _exportId: 'export2' }],
        pageProcessors: [{ _importId: 'import1', type: 'import' }],
      },
    ];
    const connections = [
      {
        _id: 'connection1',
        type: 'rest',
        _integrationId: 'integrationId',
        offline: false,
        rest: {},
      },
      {
        _id: 'connection3',
        _integrationId: 'integrationId2',
        type: 'rest',
        offline: false,
        rest: {},
      },
      {
        _id: 'connection4',
        _integrationId: 'integrationId2',
        type: 'rest',
        offline: false,
        rest: {},
      },
      {
        _id: 'connection2',
        _integrationId: 'integrationId',
        type: 'netsuite',
        offline: false,
        netsuite: {},
      },
    ];

    test('should not throw error for bad params', () => {
      const state = reducer({}, 'some_action');

      expect(
        selectors.integrationAppConnectionList(state, 'integrationId')
      ).toEqual([]);
      expect(
        selectors.integrationAppConnectionList(undefined, 'integrationId')
      ).toEqual([]);
      expect(selectors.integrationAppConnectionList(state, undefined)).toEqual(
        []
      );
    });
    test('should return correct connectionIds', () => {
      const state = reducer(
        {
          data: {
            resources: {
              integrations,
              connections,
              exports,
              imports,
              flows,
            },
          },
        },
        'some_action'
      );
      const data = selectors.integrationAppConnectionList(state, 'integrationId');

      // We dont need permissions to be tested here as we would have explicit tests for those.
      data.forEach(c => {
        // eslint-disable-next-line no-param-reassign
        delete c.permissions;

        return c;
      });
      expect(data).toEqual([
        {
          _id: 'connection1',
          _integrationId: 'integrationId',
          rest: {},
          type: 'rest',
          offline: false,
        },
        {
          _id: 'connection2',
          _integrationId: 'integrationId',
          netsuite: {},
          type: 'netsuite',
          offline: false,
        },
      ]);
    });
    test('should return correct connectionIds', () => {
      const state = reducer(
        {
          data: {
            resources: {
              integrations,
              connections,
              exports,
              imports,
              flows,
            },
          },
        },
        'some_action'
      );
      const data = selectors.integrationAppConnectionList(
        state,
        'integrationId2',
        'store1'
      );

      // We dont need permissions to be tested here as we would have explicit tests for those.
      data.forEach(c => {
        // eslint-disable-next-line no-param-reassign
        delete c.permissions;

        return c;
      });
      expect(data).toEqual([
        {
          _id: 'connection3',
          _integrationId: 'integrationId2',
          type: 'rest',
          rest: {},
          offline: false,
        },
        {
          _id: 'connection4',
          _integrationId: 'integrationId2',
          type: 'rest',
          rest: {},
          offline: false,
        },
      ]);
    });
  });

  describe('selectors.integrationAppName test cases', () => {
    const state = {
      data: {
        resources: {
          integrations: [{
            _id: 'i1',
            name: 'ABC',
            _connectorId: 'c',
          }, {
            _id: 'i2',
            name: 'ABC DEF',
            _connectorId: 'c',

          }, {
            _id: 'i3',
            name: 'ABC DEF Connector',
            _connectorId: 'c',

          }, {
            _id: 'i4',
            name: 'ABC*',
            _connectorId: 'c',

          }, {
            _id: 'i5',
            name: 'ABC-DEF',
            _connectorId: 'c',

          }, {
            _id: 'i6',
            name: 'ABCD',
          }],
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.integrationAppName();

      expect(selector()).toEqual(null);
      expect(selector({})).toEqual(null);
      expect(selector(null)).toEqual(null);
      expect(selector(null, null)).toEqual(null);
    });

    test('should return correct value for integraionAppName', () => {
      const selector = selectors.integrationAppName();

      expect(selector(state, 'i1')).toEqual('ABC');
      expect(selector(state, 'i2')).toEqual('ABCDEF');
      expect(selector(state, 'i3')).toEqual('ABCDEF');
      expect(selector(state, 'i4')).toEqual('ABC');
      expect(selector(state, 'i5')).toEqual('ABCDEF');
      expect(selector(state, 'i6')).toEqual(null);
    });
  });

  describe('selectors.integrationChildren test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationChildren()).toEqual([{label: undefined, value: undefined}]);
    });
  });

  describe('selectors.integrationAppLicense test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationAppLicense()).toEqual({});
    });
  });

  describe('selectors.makeIntegrationSectionFlows test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.makeIntegrationSectionFlows();

      expect(selector()).toEqual([]);
    });
  });

  describe('integrationAppFlowSections reducer', () => {
    test('should not throw error for bad params', () => {
      expect(selectors.integrationAppFlowSections({}, undefined)).toEqual([]);
      expect(selectors.integrationAppFlowSections()).toEqual([]);
      expect(
        selectors.integrationAppFlowSections(
          undefined,
          'integrationId',
          'fb5fb65e'
        )
      ).toEqual([]);
    });

    test('should return correct flow sections for multistore integrationApp', () => {
      const state = reducer(
        {
          data: {
            resources: {
              integrations,
            },
          },
        },
        'some_action'
      );

      expect(
        selectors.integrationAppFlowSections(state, 'integrationId', 'fb5fb65e')
      ).toEqual([
        {
          flows: [
            {
              _id: '5d9f70b98a71fc911a4068bd',
              sections: [
                {
                  title: 'File Import',
                  fields: [
                    {
                      label: 'Directory Path:',
                      type: 'input',
                      name: 'directoryPath_5d9f70b98a71fc911a4068bd',
                      required: true,
                      placeholder:
                        'Enter FTP folder path, such as Directory/File',

                    },
                    {
                      label: 'File Name Starts With:',
                      type: 'input',
                      name: 'fileNameStartsWith_5d9f70b98a71fc911a4068bd',
                      placeholder: 'Optional',

                    },
                    {
                      label: 'File Name Ends With:',
                      type: 'input',
                      name: 'fileNameEndsWith_5d9f70b98a71fc911a4068bd',
                      placeholder: 'Optional',

                    },
                    {
                      label: 'Sample File:',
                      type: 'file',
                      name: 'ftp_sample_file_5d9f70b98a71fc911a4068bd',
                      value: '',

                    },
                    {
                      label: 'Leave File On Server',
                      type: 'checkbox',
                      name: 'skipDelete_5d9f70b98a71fc911a4068bd',
                      value: false,

                    },
                    {
                      label: 'Use Credit Memos',
                      type: 'checkbox',
                      name: 'checkbox_credit_memo_5d9f70b98a71fc911a4068bd',
                      value: false,

                    },
                    {
                      label: 'Ignore following Customers:',
                      type: 'textarea',
                      name: 'textarea_customer_filter_5d9f70b98a71fc911a4068bd',
                      value: '',
                      placeholder: 'eg. ACME Inc., S Industries',

                    },
                    {
                      label: 'NetSuite Invoice Prefix:',
                      type: 'textarea',
                      name:
                        'textarea_ns_invoice_prefix_5d9f70b98a71fc911a4068bd',
                      value: '',
                      placeholder: 'eg. INV, IV',

                    },
                    {
                      label: 'NetSuite Invoice Identifier',
                      type: 'select',
                      name:
                        'select_ns_invoice_identifier_5d9f70b98a71fc911a4068bd',
                      options: [['tranid_Invoice #', 'Invoice #']],
                      value: 'tranid_Invoice #',
                      supportsRefresh: true,

                    },
                    {
                      label: 'Column delimiter:',
                      type: 'input',
                      name: 'columnDelimiter_5d9f70b98a71fc911a4068bd',
                      placeholder: 'Optional',

                    },
                    {
                      label: 'Archive file',
                      type: 'checkbox',
                      name: 'archive_file_5d9f70b98a71fc911a4068bd',
                      value: false,

                      dependencies: {
                        disabled: {
                          fields: [
                            {
                              name:
                                'netsuite_archive_dir_5d9f70b98a71fc911a4068bd',
                              hidden: true,
                              required: false,
                            },
                          ],
                        },
                        enabled: {
                          fields: [
                            {
                              name:
                                'netsuite_archive_dir_5d9f70b98a71fc911a4068bd',
                              hidden: false,
                              required: true,
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
                {
                  title: 'File Parsing',
                  fields: [
                    {
                      label: 'Batch Record',
                      title: 'Batch Record',
                      type: 'csvColumnMapper',
                      maxNumberOfColumns: 50,
                      name: '_batch_record_5d9f70b98a71fc911a4068bd',
                      value: [],

                    },
                    {
                      label: 'Transaction Record',
                      title: 'Transaction Record',
                      type: 'csvColumnMapper',
                      maxNumberOfColumns: 50,
                      name: '_transaction_record_5d9f70b98a71fc911a4068bd',
                      value: [
                        {
                          fieldName: 'Transaction Id',
                          column: '1',
                        },
                      ],

                    },
                    {
                      label: 'Invoice Record',
                      title: 'Invoice Record',
                      type: 'csvColumnMapper',
                      maxNumberOfColumns: 50,
                      name: '_invoice_record_5d9f70b98a71fc911a4068bd',
                      value: [
                        {
                          fieldName: 'Invoice number',
                          column: '19',
                        },
                        {
                          fieldName: 'Invoice Date',
                          column: '4',
                        },
                        {
                          fieldName: 'Invoice amount',
                          column: '8',
                        },
                      ],

                    },
                  ],
                },
                {
                  title: 'Advanced Settings',
                  fields: [
                    {
                      label: 'Transaction Filter: Choose an action',
                      type: 'radio',
                      name: 'transactionFilterOptions_5d9f70b98a71fc911a4068bd',
                      properties: {
                        sectionName: 'Filter Settings',
                      },
                      options: [
                        ['skip', 'Skip'],
                        ['allow', 'Allow'],
                        ['default', 'Default'],
                      ],

                    },
                    {
                      label: 'Enter Transaction Codes',
                      type: 'input',
                      name: 'transactionCodes_5d9f70b98a71fc911a4068bd',
                      placeholder: 'eg. 100,102,104,201-299,305',

                      properties: {
                        sectionName: 'Filter Settings',
                      },
                    },
                    {
                      label: 'Default Currency',
                      type: 'select',
                      name: 'select_bank_currency_5d9f70b98a71fc911a4068bd',
                      options: [],
                      supportsRefresh: true,

                      properties: {
                        sectionName: 'Payment Settings',
                      },
                    },
                    {
                      label: 'Customer Has Priority',
                      type: 'checkbox',
                      name:
                        'checkbox_customer_priority_5d9f70b98a71fc911a4068bd',

                      properties: {
                        sectionName: 'Matching Settings',
                      },
                    },
                    {
                      label: 'Identify invoice with Amount',
                      name:
                        'checkbox_match_invoice_with_amount_5d9f70b98a71fc911a4068bd',
                      type: 'checkbox',
                      value: false,

                      properties: {
                        sectionName: 'Matching Settings',
                      },
                    },
                    {
                      label: 'Skip Zero Amount Transactions',
                      type: 'checkbox',
                      name:
                        'checkbox_skip_zero_amount_transactions_5d9f70b98a71fc911a4068bd',
                      value: true,

                      properties: {
                        sectionName: 'Payment Settings',
                      },
                    },
                    {
                      label: "Don't create payment in locked posting period",
                      type: 'checkbox',
                      name:
                        'checkbox_validate_posting_period_5d9f70b98a71fc911a4068bd',
                      value: true,

                      properties: {
                        sectionName: 'Payment Settings',
                      },
                    },
                    {
                      label: 'Advanced Search for Customers',
                      type: 'checkbox',
                      name:
                        'checkbox_use_fuzzy_search_5d9f70b98a71fc911a4068bd',
                      value: false,

                      dependencies: {
                        disabled: {
                          fields: [
                            {
                              name:
                                'fuzzy_config_threshold_value_5d9f70b98a71fc911a4068bd',
                              hidden: true,
                              required: false,
                            },
                          ],
                        },
                        enabled: {
                          fields: [
                            {
                              name:
                                'fuzzy_config_threshold_value_5d9f70b98a71fc911a4068bd',
                              hidden: false,
                              required: true,
                            },
                          ],
                        },
                      },
                      properties: {
                        sectionName: 'Matching Settings',
                      },
                    },
                    {
                      label: 'Threshold',
                      type: 'input',
                      name:
                        'fuzzy_config_threshold_value_5d9f70b98a71fc911a4068bd',
                      value: '0.1',

                      properties: {
                        sectionName: 'Matching Settings',
                      },
                    },
                    {
                      type: 'subsidiaryMapWidget',
                      name: 'multisubsidiary_settings_5d9f70b98a71fc911a4068bd',

                      title: 'Multi-subsidiary Settings',
                      optionsMap: [
                        {
                          id: 'subsidiary',
                          name: 'Subsidiary',
                          type: 'select',
                          options: [],
                        },
                        {
                          id: 'paymentAccount',
                          name: 'Payment Account',
                          type: 'select',
                          options: [],
                        },
                        {
                          id: 'debitAccount',
                          name: 'Write off Account',
                          type: 'select',
                          options: [],
                        },
                        {
                          id: 'depositAccount',
                          name: 'Customer Deposit Account',
                          type: 'select',
                          options: [],
                        },
                        {
                          id: 'dummyCustomer',
                          name: 'Dummy Customer',
                          type: 'input',
                        },
                      ],
                      value: [],
                    },
                  ],
                },
              ],
              showMapping: true,
              showSchedule: true,
            },
          ],
          iconURL: '/images/icons/settings/BAI2.png',
          title: 'CSV',
          titleId: 'CSV',
        },
      ]);
    });

    test('should return correct flow sections for multistore integrationApp', () => {
      const state = reducer(
        {
          data: {
            resources: {
              integrations,
            },
          },
        },
        'some_action'
      );

      expect(
        selectors.integrationAppFlowSections(state, 'integrationId')
      ).toEqual([
        {
          flows: [
            {
              _id: '5d9f70b98a71fc911a4068bd',
              sections: [
                {
                  fields: [
                    {
                      label: 'Directory Path:',
                      name: 'directoryPath_5d9f70b98a71fc911a4068bd',
                      placeholder: 'Enter FTP folder path, such as Directory/File',
                      required: true,

                      type: 'input',
                    },
                    {
                      label: 'File Name Starts With:',
                      name: 'fileNameStartsWith_5d9f70b98a71fc911a4068bd',
                      placeholder: 'Optional',

                      type: 'input',
                    },
                    {
                      label: 'File Name Ends With:',
                      name: 'fileNameEndsWith_5d9f70b98a71fc911a4068bd',
                      placeholder: 'Optional',

                      type: 'input',
                    },
                    {
                      label: 'Sample File:',
                      name: 'ftp_sample_file_5d9f70b98a71fc911a4068bd',

                      type: 'file',
                      value: '',
                    },
                    {
                      label: 'Leave File On Server',
                      name: 'skipDelete_5d9f70b98a71fc911a4068bd',

                      type: 'checkbox',
                      value: false,
                    },
                    {
                      label: 'Use Credit Memos',
                      name: 'checkbox_credit_memo_5d9f70b98a71fc911a4068bd',

                      type: 'checkbox',
                      value: false,
                    },
                    {
                      label: 'Ignore following Customers:',
                      name: 'textarea_customer_filter_5d9f70b98a71fc911a4068bd',
                      placeholder: 'eg. ACME Inc., S Industries',

                      type: 'textarea',
                      value: '',
                    },
                    {
                      label: 'NetSuite Invoice Prefix:',
                      name: 'textarea_ns_invoice_prefix_5d9f70b98a71fc911a4068bd',
                      placeholder: 'eg. INV, IV',

                      type: 'textarea',
                      value: '',
                    },
                    {
                      label: 'NetSuite Invoice Identifier',
                      name: 'select_ns_invoice_identifier_5d9f70b98a71fc911a4068bd',
                      options: [
                        [
                          'tranid_Invoice #',
                          'Invoice #',
                        ],
                      ],
                      supportsRefresh: true,

                      type: 'select',
                      value: 'tranid_Invoice #',
                    },
                    {
                      label: 'Column delimiter:',
                      name: 'columnDelimiter_5d9f70b98a71fc911a4068bd',
                      placeholder: 'Optional',

                      type: 'input',
                    },
                    {
                      dependencies: {
                        disabled: {
                          fields: [
                            {
                              hidden: true,
                              name: 'netsuite_archive_dir_5d9f70b98a71fc911a4068bd',
                              required: false,
                            },
                          ],
                        },
                        enabled: {
                          fields: [
                            {
                              hidden: false,
                              name: 'netsuite_archive_dir_5d9f70b98a71fc911a4068bd',
                              required: true,
                            },
                          ],
                        },
                      },
                      label: 'Archive file',
                      name: 'archive_file_5d9f70b98a71fc911a4068bd',

                      type: 'checkbox',
                      value: false,
                    },
                  ],
                  title: 'File Import',
                },
                {
                  fields: [
                    {
                      label: 'Batch Record',
                      maxNumberOfColumns: 50,
                      name: '_batch_record_5d9f70b98a71fc911a4068bd',
                      title: 'Batch Record',

                      type: 'csvColumnMapper',
                      value: [],
                    },
                    {
                      label: 'Transaction Record',
                      maxNumberOfColumns: 50,
                      name: '_transaction_record_5d9f70b98a71fc911a4068bd',
                      title: 'Transaction Record',

                      type: 'csvColumnMapper',
                      value: [
                        {
                          column: '1',
                          fieldName: 'Transaction Id',
                        },
                      ],
                    },
                    {
                      label: 'Invoice Record',
                      maxNumberOfColumns: 50,
                      name: '_invoice_record_5d9f70b98a71fc911a4068bd',
                      title: 'Invoice Record',

                      type: 'csvColumnMapper',
                      value: [
                        {
                          column: '19',
                          fieldName: 'Invoice number',
                        },
                        {
                          column: '4',
                          fieldName: 'Invoice Date',
                        },
                        {
                          column: '8',
                          fieldName: 'Invoice amount',
                        },
                      ],
                    },
                  ],
                  title: 'File Parsing',
                },
                {
                  fields: [
                    {
                      label: 'Transaction Filter: Choose an action',
                      name: 'transactionFilterOptions_5d9f70b98a71fc911a4068bd',
                      options: [
                        [
                          'skip',
                          'Skip',
                        ],
                        [
                          'allow',
                          'Allow',
                        ],
                        [
                          'default',
                          'Default',
                        ],
                      ],
                      properties: {
                        sectionName: 'Filter Settings',
                      },

                      type: 'radio',
                    },
                    {
                      label: 'Enter Transaction Codes',
                      name: 'transactionCodes_5d9f70b98a71fc911a4068bd',
                      placeholder: 'eg. 100,102,104,201-299,305',
                      properties: {
                        sectionName: 'Filter Settings',
                      },

                      type: 'input',
                    },
                    {
                      label: 'Default Currency',
                      name: 'select_bank_currency_5d9f70b98a71fc911a4068bd',
                      options: [],
                      properties: {
                        sectionName: 'Payment Settings',
                      },
                      supportsRefresh: true,

                      type: 'select',
                    },
                    {
                      label: 'Customer Has Priority',
                      name: 'checkbox_customer_priority_5d9f70b98a71fc911a4068bd',
                      properties: {
                        sectionName: 'Matching Settings',
                      },

                      type: 'checkbox',
                    },
                    {
                      label: 'Identify invoice with Amount',
                      name: 'checkbox_match_invoice_with_amount_5d9f70b98a71fc911a4068bd',
                      properties: {
                        sectionName: 'Matching Settings',
                      },

                      type: 'checkbox',
                      value: false,
                    },
                    {
                      label: 'Skip Zero Amount Transactions',
                      name: 'checkbox_skip_zero_amount_transactions_5d9f70b98a71fc911a4068bd',
                      properties: {
                        sectionName: 'Payment Settings',
                      },

                      type: 'checkbox',
                      value: true,
                    },
                    {
                      label: "Don't create payment in locked posting period",
                      name: 'checkbox_validate_posting_period_5d9f70b98a71fc911a4068bd',
                      properties: {
                        sectionName: 'Payment Settings',
                      },

                      type: 'checkbox',
                      value: true,
                    },
                    {
                      dependencies: {
                        disabled: {
                          fields: [
                            {
                              hidden: true,
                              name: 'fuzzy_config_threshold_value_5d9f70b98a71fc911a4068bd',
                              required: false,
                            },
                          ],
                        },
                        enabled: {
                          fields: [
                            {
                              hidden: false,
                              name: 'fuzzy_config_threshold_value_5d9f70b98a71fc911a4068bd',
                              required: true,
                            },
                          ],
                        },
                      },
                      label: 'Advanced Search for Customers',
                      name: 'checkbox_use_fuzzy_search_5d9f70b98a71fc911a4068bd',
                      properties: {
                        sectionName: 'Matching Settings',
                      },

                      type: 'checkbox',
                      value: false,
                    },
                    {
                      label: 'Threshold',
                      name: 'fuzzy_config_threshold_value_5d9f70b98a71fc911a4068bd',
                      properties: {
                        sectionName: 'Matching Settings',
                      },

                      type: 'input',
                      value: '0.1',
                    },
                    {
                      name: 'multisubsidiary_settings_5d9f70b98a71fc911a4068bd',
                      optionsMap: [
                        {
                          id: 'subsidiary',
                          name: 'Subsidiary',
                          options: [],
                          type: 'select',
                        },
                        {
                          id: 'paymentAccount',
                          name: 'Payment Account',
                          options: [],
                          type: 'select',
                        },
                        {
                          id: 'debitAccount',
                          name: 'Write off Account',
                          options: [],
                          type: 'select',
                        },
                        {
                          id: 'depositAccount',
                          name: 'Customer Deposit Account',
                          options: [],
                          type: 'select',
                        },
                        {
                          id: 'dummyCustomer',
                          name: 'Dummy Customer',
                          type: 'input',
                        },
                      ],
                      title: 'Multi-subsidiary Settings',

                      type: 'subsidiaryMapWidget',
                      value: [],
                    },
                  ],
                  title: 'Advanced Settings',
                },
              ],
              showMapping: true,
              showSchedule: true,
            },
            {
              _id: '5d9f71628a71fc911a4068d9',
              sections: [
                {
                  fields: [
                    {
                      label: 'Directory Path:',
                      name: 'directoryPath_5d9f71628a71fc911a4068d9',
                      placeholder: 'Enter FTP folder path, such as Directory/File',
                      required: true,

                      type: 'input',
                    },
                    {
                      label: 'File Name Starts With:',
                      name: 'fileNameStartsWith_5d9f71628a71fc911a4068d9',
                      placeholder: 'Optional',

                      type: 'input',
                    },
                    {
                      label: 'File Name Ends With:',
                      name: 'fileNameEndsWith_5d9f71628a71fc911a4068d9',
                      placeholder: 'Optional',

                      type: 'input',
                    },
                    {
                      label: 'Sample File:',
                      name: 'ftp_sample_file_5d9f71628a71fc911a4068d9',

                      type: 'file',
                      value: '',
                    },
                    {
                      label: 'Leave File On Server',
                      name: 'skipDelete_5d9f71628a71fc911a4068d9',

                      type: 'checkbox',
                      value: false,
                    },
                    {
                      label: 'Use Credit Memos',
                      name: 'checkbox_credit_memo_5d9f71628a71fc911a4068d9',

                      type: 'checkbox',
                      value: false,
                    },
                    {
                      label: 'Ignore following Customers:',
                      name: 'textarea_customer_filter_5d9f71628a71fc911a4068d9',
                      placeholder: 'eg. ACME Inc., S Industries',

                      type: 'textarea',
                      value: '',
                    },
                    {
                      label: 'NetSuite Invoice Prefix:',
                      name: 'textarea_ns_invoice_prefix_5d9f71628a71fc911a4068d9',
                      placeholder: 'eg. INV, IV',

                      type: 'textarea',
                      value: '',
                    },
                    {
                      label: 'NetSuite Invoice Identifier',
                      name: 'select_ns_invoice_identifier_5d9f71628a71fc911a4068d9',
                      options: [
                        [
                          'tranid_Invoice #',
                          'Invoice #',
                        ],
                      ],
                      supportsRefresh: true,

                      type: 'select',
                      value: 'tranid_Invoice #',
                    },
                    {
                      label: 'Column delimiter:',
                      name: 'columnDelimiter_5d9f71628a71fc911a4068d9',
                      placeholder: 'Optional',

                      type: 'input',
                    },
                    {
                      dependencies: {
                        disabled: {
                          fields: [
                            {
                              hidden: true,
                              name: 'netsuite_archive_dir_5d9f71628a71fc911a4068d9',
                              required: false,
                            },
                          ],
                        },
                        enabled: {
                          fields: [
                            {
                              hidden: false,
                              name: 'netsuite_archive_dir_5d9f71628a71fc911a4068d9',
                              required: true,
                            },
                          ],
                        },
                      },
                      label: 'Archive file',
                      name: 'archive_file_5d9f71628a71fc911a4068d9',

                      type: 'checkbox',
                      value: false,
                    },
                    {
                      label: 'NetSuite Archive Folder: ',
                      name: 'netsuite_archive_dir_5d9f71628a71fc911a4068d9',
                      placeholder: 'Optional',

                      type: 'input',
                    },
                    {
                      label: 'File Has Header Row',
                      name: 'hasHeaderRow_5d9f71628a71fc911a4068d9',

                      type: 'checkbox',
                      value: false,
                    },
                  ],
                  title: 'File Import',
                },
                {
                  fields: [
                    {
                      label: 'Batch Record',
                      maxNumberOfColumns: 50,
                      name: '_batch_record_5d9f71628a71fc911a4068d9',
                      title: 'Batch Record',

                      type: 'csvColumnMapper',
                      value: [
                        {
                          column: '1',
                          columnName: 'BATCH NUMBER',
                          fieldName: 'Batch Number',
                        },
                        {
                          column: '2',
                          columnName: 'DEPOSIT DATE',
                          fieldName: 'Batch Date',
                        },
                      ],
                    },
                    {
                      label: 'Transaction Record',
                      maxNumberOfColumns: 50,
                      name: '_transaction_record_5d9f71628a71fc911a4068d9',
                      title: 'Transaction Record',

                      type: 'csvColumnMapper',
                      value: [
                        {
                          column: '3',
                          columnName: 'TRANSIT ROUTING #',
                          fieldName: 'Transaction Id',
                        },
                        {
                          column: '4',
                          columnName: 'CHECK NUMBER',
                          fieldName: 'Check Number',
                        },
                        {
                          column: '5',
                          columnName: 'CHECK AMOUNT',
                          fieldName: 'Payment Amount',
                        },
                        {
                          column: '6',
                          columnName: 'REMITTER NAME',
                          fieldName: 'Customer Name',
                        },
                        {
                          column: '7',
                          columnName: 'CHECK DATE',
                          fieldName: 'Check Date',
                        },
                      ],
                    },
                    {
                      label: 'Invoice Record',
                      maxNumberOfColumns: 50,
                      name: '_invoice_record_5d9f71628a71fc911a4068d9',
                      title: 'Invoice Record',

                      type: 'csvColumnMapper',
                      value: [
                        {
                          column: '8',
                          columnName: 'INVOICE NUMBER',
                          fieldName: 'Invoice number',
                        },
                      ],
                    },
                  ],
                  title: 'File Parsing',
                },
                {
                  fields: [
                    {
                      label: 'Transaction Filter: Choose an action',
                      name: 'transactionFilterOptions_5d9f71628a71fc911a4068d9',
                      options: [
                        [
                          'skip',
                          'Skip',
                        ],
                        [
                          'allow',
                          'Allow',
                        ],
                        [
                          'default',
                          'Default',
                        ],
                      ],
                      properties: {
                        sectionName: 'Filter Settings',
                      },

                      type: 'radio',
                    },
                    {
                      label: 'Enter Transaction Codes',
                      name: 'transactionCodes_5d9f71628a71fc911a4068d9',
                      placeholder: 'eg. 100,102,104,201-299,305',
                      properties: {
                        sectionName: 'Filter Settings',
                      },

                      type: 'input',
                    },
                    {
                      label: 'Default Currency',
                      name: 'select_bank_currency_5d9f71628a71fc911a4068d9',
                      options: [],
                      properties: {
                        sectionName: 'Payment Settings',
                      },
                      supportsRefresh: true,

                      type: 'select',
                    },
                    {
                      label: 'Customer Has Priority',
                      name: 'checkbox_customer_priority_5d9f71628a71fc911a4068d9',
                      properties: {
                        sectionName: 'Matching Settings',
                      },

                      type: 'checkbox',
                    },
                    {
                      label: 'Identify invoice with Amount',
                      name: 'checkbox_match_invoice_with_amount_5d9f71628a71fc911a4068d9',
                      properties: {
                        sectionName: 'Matching Settings',
                      },

                      type: 'checkbox',
                      value: false,
                    },
                    {
                      label: 'Skip Zero Amount Transactions',
                      name: 'checkbox_skip_zero_amount_transactions_5d9f71628a71fc911a4068d9',
                      properties: {
                        sectionName: 'Payment Settings',
                      },

                      type: 'checkbox',
                      value: true,
                    },
                    {
                      label: "Don't create payment in locked posting period",
                      name: 'checkbox_validate_posting_period_5d9f71628a71fc911a4068d9',
                      properties: {
                        sectionName: 'Payment Settings',
                      },

                      type: 'checkbox',
                      value: true,
                    },
                    {
                      dependencies: {
                        disabled: {
                          fields: [
                            {
                              hidden: true,
                              name: 'fuzzy_config_threshold_value_5d9f71628a71fc911a4068d9',
                              required: false,
                            },
                          ],
                        },
                        enabled: {
                          fields: [
                            {
                              hidden: false,
                              name: 'fuzzy_config_threshold_value_5d9f71628a71fc911a4068d9',
                              required: true,
                            },
                          ],
                        },
                      },
                      label: 'Advanced Search for Customers',
                      name: 'checkbox_use_fuzzy_search_5d9f71628a71fc911a4068d9',
                      properties: {
                        sectionName: 'Matching Settings',
                      },

                      type: 'checkbox',
                      value: false,
                    },
                    {
                      label: 'Threshold',
                      name: 'fuzzy_config_threshold_value_5d9f71628a71fc911a4068d9',
                      properties: {
                        sectionName: 'Matching Settings',
                      },

                      type: 'input',
                      value: '0.1',
                    },
                    {
                      name: 'multisubsidiary_settings_5d9f71628a71fc911a4068d9',
                      optionsMap: [
                        {
                          id: 'subsidiary',
                          name: 'Subsidiary',
                          options: [],
                          type: 'select',
                        },
                        {
                          id: 'paymentAccount',
                          name: 'Payment Account',
                          options: [],
                          type: 'select',
                        },
                        {
                          id: 'debitAccount',
                          name: 'Write off Account',
                          options: [],
                          type: 'select',
                        },
                        {
                          id: 'depositAccount',
                          name: 'Customer Deposit Account',
                          options: [],
                          type: 'select',
                        },
                        {
                          id: 'dummyCustomer',
                          name: 'Dummy Customer',
                          type: 'input',
                        },
                      ],
                      title: 'Multi-subsidiary Settings',

                      type: 'subsidiaryMapWidget',
                      value: [],
                    },
                  ],
                  title: 'Advanced Settings',
                },
              ],
              showMapping: true,
              showSchedule: true,
            },
          ],
          iconURL: '/images/icons/settings/BAI2.png',
          title: 'CSV',
          titleId: 'CSV',
        },
      ]);
    });

    test('should return correct flow sections for single store integration App', () => {
      const state = reducer(
        {
          data: {
            resources: {
              integrations,
            },
          },
        },
        'some_action'
      );

      expect(
        selectors.integrationAppFlowSections(state, 'integrationId2')
      ).toEqual([
        {
          columns: 1,
          description:
            'This section contains settings to sync NetSuite Customers and Zendesk Organizations between the two systems.',
          fields: [
            {
              label: 'Sync all Zendesk Organizations as NetSuite Customers',
              name: 'sync_zendesk_organizations_as_netsuite_customsers',
              type: 'checkbox',
              value: true,
            },
          ],
          flows: [
            {
              _id: '5d9b20328a71fc911a4018a4',
              settings: [
                {
                  label: 'Execution Context',
                  name: 'executionContext',
                  options: [
                    ['userevent', 'User Event'],
                    ['webservices', 'Web Services'],
                    ['csvimport', 'CSV Import'],
                    ['scheduled', 'Scheduled'],
                    ['workflow', 'Work Flow'],
                    ['userinterface', 'User Interface'],
                  ],
                  type: 'multiselect',
                  value: [
                    'userevent',
                    'webservices',
                    'csvimport',
                    'userinterface',
                  ],
                },
                {
                  label: 'Execution Type',
                  name: 'executionType',
                  options: [
                    ['edit', 'Edit'],
                    ['create', 'Create'],
                    ['xedit', 'xEdit'],
                  ],
                  type: 'multiselect',
                  value: ['edit', 'create', 'xedit'],
                },
                {
                  expressionType: 'export',
                  label: 'Qualifier',
                  name: 'qualifier',
                  type: 'expression',
                  value:
                    '[["isperson","=","F"],"and",["custentity_celigo_znc_zendesk_id","empty",true]]',
                },
              ],
              showMapping: true,
              showSchedule: false,
            },
            {
              _id: '5d9b20328a71fc911a4018ad',
              settings: [
                {
                  label: 'Execution Context',
                  name: 'executionContext',
                  options: [
                    ['userevent', 'User Event'],
                    ['webservices', 'Web Services'],
                    ['csvimport', 'CSV Import'],
                    ['scheduled', 'Scheduled'],
                    ['workflow', 'Work Flow'],
                    ['userinterface', 'User Interface'],
                  ],
                  type: 'multiselect',
                  value: [
                    'userevent',
                    'webservices',
                    'csvimport',
                    'userinterface',
                  ],
                },
                {
                  label: 'Execution Type',
                  name: 'executionType',
                  options: [
                    ['edit', 'Edit'],
                    ['create', 'Create'],
                    ['xedit', 'xEdit'],
                  ],
                  type: 'multiselect',
                  value: ['edit', 'create', 'xedit'],
                },
                {
                  expressionType: 'export',
                  label: 'Qualifier',
                  name: 'qualifier',
                  type: 'expression',
                  value:
                    '[["isperson","=","F"],"and",["custentity_celigo_znc_zendesk_id","empty",false]]',
                },
              ],
              showMapping: true,
              showSchedule: false,
            },
            {
              _id: '5d9b20328a71fc911a4018a7',
              showMapping: true,
              showSchedule: true,
            },
            {
              _id: '5d9b20328a71fc911a4018ac',
              showMapping: true,
              showSchedule: true,
            },
          ],
          title: 'Organization Sync',
          titleId: 'OrganizationSync',
        },
        {
          columns: 1,
          description:
            'This section contains settings to sync NetSuite Cases and Zendesk Tickets between the two systems.',
          editions: ['premium'],
          fields: [
            {
              label:
                'Create Zendesk Organization and User (if non-existent) while syncing NetSuite Support Case',
              name: 'create_users_and_organizations_in_zendesk',
              type: 'checkbox',
              value: false,
            },
            {
              label:
                'Create NetSuite Customer and Contact (if non-existent) while syncing Zendesk Ticket',
              name: 'create_contacts_and_customers_in_netsuite',
              type: 'checkbox',
              value: false,
            },
            {
              label:
                'Sync Zendesk Ticket Public Replies to NetSuite Case as Message',
              name: 'sync_ticket_comments_to_netsuite',
              type: 'checkbox',
              value: false,
            },
            {
              label:
                'Sync attachments in NetSuite Support Cases to Zendesk Tickets',
              name: 'sync_attachments_from_netsuite_to_zendesk',

              type: 'checkbox',
              value: false,
            },
          ],
          flows: [
            {
              _id: '5d9b20328a71fc911a4018a9',
              settings: [
                {
                  label: 'Execution Context',
                  name: 'executionContext',
                  options: [
                    ['userevent', 'User Event'],
                    ['webservices', 'Web Services'],
                    ['csvimport', 'CSV Import'],
                    ['scheduled', 'Scheduled'],
                    ['workflow', 'Work Flow'],
                    ['userinterface', 'User Interface'],
                  ],
                  type: 'multiselect',
                  value: [
                    'userevent',
                    'webservices',
                    'csvimport',
                    'userinterface',
                  ],
                },
                {
                  label: 'Execution Type',
                  name: 'executionType',
                  options: [['edit', 'Edit'], ['create', 'Create']],
                  type: 'multiselect',
                  value: ['edit', 'create'],
                },
                {
                  expressionType: 'export',
                  label: 'Qualifier',
                  name: 'qualifier',
                  type: 'expression',
                  value: '["custevent_celigo_znc_zendesk_id","empty",true]',
                },
              ],
              showMapping: true,
              showSchedule: false,
            },
            {
              _id: '5d9b20328a71fc911a4018a8',
              settings: [
                {
                  label: 'Execution Context',
                  name: 'executionContext',
                  options: [
                    ['userevent', 'User Event'],
                    ['webservices', 'Web Services'],
                    ['csvimport', 'CSV Import'],
                    ['scheduled', 'Scheduled'],
                    ['workflow', 'Work Flow'],
                    ['userinterface', 'User Interface'],
                  ],
                  type: 'multiselect',
                  value: [
                    'userevent',
                    'webservices',
                    'csvimport',
                    'userinterface',
                  ],
                },
                {
                  label: 'Execution Type',
                  name: 'executionType',
                  options: [['edit', 'Edit'], ['xedit', 'xEdit']],
                  type: 'multiselect',
                  value: ['edit', 'xedit'],
                },
                {
                  expressionType: 'export',
                  label: 'Qualifier',
                  name: 'qualifier',
                  type: 'expression',
                  value: '["custevent_celigo_znc_zendesk_id","empty",false]',
                },
              ],
              showMapping: true,
              showSchedule: false,
            },
            {
              _id: '5d9b20328a71fc911a4018b2',
              showMapping: true,
              showSchedule: true,
            },
            {
              _id: '5d9b20328a71fc911a4018b3',
              showMapping: true,
              showSchedule: true,
            },
            {
              _id: '5d9b20328a71fc911a4018b0',
              showMapping: true,
              showSchedule: true,
            },
            {
              _id: '5d9b20328a71fc911a4018ba',
              showMapping: true,
              showSchedule: true,
            },
          ],
          title: 'Tickets Sync',
          titleId: 'TicketsSync',
        },
      ]);
    });
  });

  describe('integrationAppGeneralSettings reducer', () => {
    test('should not throw error for bad params', () => {
      expect(selectors.integrationAppGeneralSettings({}, undefined)).toEqual({
        fields: undefined,
        sections: undefined,
      });
      expect(selectors.integrationAppGeneralSettings()).toEqual({});
      expect(
        selectors.integrationAppGeneralSettings(
          undefined,
          'integrationId',
          'fb5fb65e'
        )
      ).toEqual({});
    });

    test('should return correct general section for multistore integrationApp', () => {
      const state = reducer(
        {
          data: {
            resources: {
              integrations,
            },
          },
        },
        'some_action'
      );

      expect(
        selectors.integrationAppGeneralSettings(
          state,
          'integrationId',
          'fb5fb65e'
        )
      ).toEqual({
        fields: [
          {
            label: 'Enable Manual Upload Mode',
            name: 'enableManualUploadMode_fb5fb65e',

            type: 'checkbox',
          },
        ],
        sections: undefined,
      });
    });

    test('should return correct flow sections for single store integration App', () => {
      const state = reducer(
        {
          data: {
            resources: {
              integrations,
            },
          },
        },
        'some_action'
      );

      expect(
        selectors.integrationAppGeneralSettings(state, 'integrationId2')
      ).toEqual({
        fields: [
          {
            label: 'Enable Test Mode',
            name: 'enableTestMode',
            type: 'checkbox',
            value: false,
          },
          {
            label: 'Test Mode Text',
            name: 'testModeText',
            value: '',
          },
        ],
        sections: undefined,
      });
    });
  });

  describe('selectors.hasGeneralSettings test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.hasGeneralSettings()).toEqual(false);
    });
  });

  describe('selectors.mkIntegrationAppSectionMetadata test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkIntegrationAppSectionMetadata();

      expect(selector()).toEqual({});
    });
  });

  describe('integrationAppSectionFlows reducer', () => {
    test('should not throw error for bad params', () => {
      expect(selectors.integrationAppSectionFlows()).toEqual([]);
      expect(selectors.integrationAppSectionFlows({})).toEqual([]);
    });

    test('should return all flows when section is not passed to a single store integration App', () => {
      const state = reducer(
        {
          data: {
            resources: {
              integrations,
              flows,
            },
          },
        },
        'some_action'
      );

      expect(
        selectors.integrationAppSectionFlows(state, 'integrationId2')
      ).toEqual([
        {
          _id: '5d9b20328a71fc911a4018a4',
          _integrationId: 'integrationId2',
          errors: 0,
          name: '5d9b20328a71fc911a4018a4',
        },
        {
          _id: '5d9b20328a71fc911a4018a7',
          _integrationId: 'integrationId2',
          errors: 0,

          name: '5d9b20328a71fc911a4018a7',
        },
        {
          _id: '5d9b20328a71fc911a4018a8',
          _integrationId: 'integrationId2',
          errors: 0,

          name: '5d9b20328a71fc911a4018a8',
        },
        {
          _id: '5d9b20328a71fc911a4018a9',
          _integrationId: 'integrationId2',
          errors: 0,

          name: '5d9b20328a71fc911a4018a9',
        },
        {
          _id: '5d9b20328a71fc911a4018ac',
          _integrationId: 'integrationId2',
          errors: 0,

          name: '5d9b20328a71fc911a4018ac',
        },
        {
          _id: '5d9b20328a71fc911a4018ad',
          _integrationId: 'integrationId2',
          errors: 0,

          name: '5d9b20328a71fc911a4018ad',
        },
        {
          _id: '5d9b20328a71fc911a4018b0',
          _integrationId: 'integrationId2',
          errors: 0,

          name: '5d9b20328a71fc911a4018b0',
        },
        {
          _id: '5d9b20328a71fc911a4018b2',
          _integrationId: 'integrationId2',
          errors: 0,

          name: '5d9b20328a71fc911a4018b2',
        },
        {
          _id: '5d9b20328a71fc911a4018b3',
          _integrationId: 'integrationId2',
          errors: 0,

          name: '5d9b20328a71fc911a4018b3',
        },
        {
          _id: '5d9b20328a71fc911a4018ba',
          _integrationId: 'integrationId2',
          errors: 0,

          name: '5d9b20328a71fc911a4018ba',
        },
      ]);
    });

    test('should return all flows when section and storeId is not passed to a multi store integration App', () => {
      const state = reducer(
        {
          data: {
            resources: {
              integrations,
              flows,
            },
          },
        },
        'some_action'
      );

      expect(
        selectors.integrationAppSectionFlows(state, 'integrationId')
      ).toEqual([
        {
          _id: '5d9f70b98a71fc911a4068bd',
          _integrationId: 'integrationId',
          name: '5d9f70b98a71fc911a4068bd',
          childId: 'fb5fb65e',
          childName: 'BILLTECH',
          errors: 0,
          id: '5d9f70b98a71fc911a4068bd',
        },
        {
          _id: '5d9f71628a71fc911a4068d9',
          _integrationId: 'integrationId',
          name: '5d9f71628a71fc911a4068d9',
          childId: 'dd67a407',
          childName: 'HSBC',
          errors: 0,
          id: '5d9f71628a71fc911a4068d9',
        },
      ]);
    });

    test('should return all flows of the store when storeId is passed to a multi store integration App', () => {
      const state = reducer(
        {
          data: {
            resources: {
              integrations,
              flows,
            },
          },
        },
        'some_action'
      );

      expect(
        selectors.integrationAppSectionFlows(
          state,
          'integrationId',
          null,
          'fb5fb65e'
        )
      ).toEqual([
        {
          _id: '5d9f70b98a71fc911a4068bd',
          _integrationId: 'integrationId',
          errors: 0,
          name: '5d9f70b98a71fc911a4068bd',
        },
      ]);
    });
  });

  describe('selectors.integrationAppFlowIds test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationAppFlowIds()).toEqual([]);
    });
  });

  describe('selectors.isIntegrationAppVersion2 test cases', () => {
    const state = {
      data: {
        resources: {
          integrations: [{
            _id: 'integration1',
            name: 'Integration',
            install: [{
              isClone: true,
            }],
          }, {
            _id: 'integration2',
            name: 'Integration',
            installSteps: [{}],
            uninstallSteps: [{}],
          }, {
            _id: 'integration3',
            name: 'Integration',
            installSteps: [{}],
          }, {
            _id: 'integration4',
            name: 'Integration',
            uninstallSteps: [{}],
          }],
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isIntegrationAppVersion2()).toEqual(false);
      expect(selectors.isIntegrationAppVersion2(null)).toEqual(false);
      expect(selectors.isIntegrationAppVersion2({})).toEqual(false);
      expect(selectors.isIntegrationAppVersion2({}, null)).toEqual(false);
    });
    test('should return false when integration not found', () => {
      expect(selectors.isIntegrationAppVersion2(state, 'invalid')).toEqual(false);
      expect(selectors.isIntegrationAppVersion2(state, 'invalid', true)).toEqual(false);
      expect(selectors.isIntegrationAppVersion2(state, 'invalid', false)).toEqual(false);
    });
    test('should return true when integration found and is cloned when skipClone is false', () => {
      expect(selectors.isIntegrationAppVersion2(state, 'integration1')).toEqual(true);
      expect(selectors.isIntegrationAppVersion2(state, 'integration1', false)).toEqual(true);
    });
    test('should return false when integration found and is cloned when skipClone is true', () => {
      expect(selectors.isIntegrationAppVersion2(state, 'integration1', true)).toEqual(false);
    });
    test('should return true when integration found and is a IA2.0 integration', () => {
      expect(selectors.isIntegrationAppVersion2(state, 'integration2', true)).toEqual(true);
      expect(selectors.isIntegrationAppVersion2(state, 'integration3', true)).toEqual(true);
      expect(selectors.isIntegrationAppVersion2(state, 'integration4', true)).toEqual(true);
    });
  });

  describe('selectors.integrationAppChildIdOfFlow test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationAppChildIdOfFlow()).toEqual(null);
    });
  });
});

