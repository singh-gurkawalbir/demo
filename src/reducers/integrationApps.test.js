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
              tooltip: 'Select the checkbox for manual upload of file.',
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
              tooltip: 'Select the checkbox for manual upload of file.',
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
              tooltip: 'Select the checkbox for manual upload of file.',
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
                          tooltip:
                            'Please provide the path of the Directory in the FTP server where the files are stored.',
                        },
                        {
                          label: 'File Name Starts With:',
                          type: 'input',
                          name: 'fileNameStartsWith_5d9f70b98a71fc911a4068bd',
                          placeholder: 'Optional',
                          tooltip:
                            'Please provide the first few characters of the file name which the Connector should read.',
                        },
                        {
                          label: 'File Name Ends With:',
                          type: 'input',
                          name: 'fileNameEndsWith_5d9f70b98a71fc911a4068bd',
                          placeholder: 'Optional',
                          tooltip:
                            'Please provide the last few characters of the file name which the Connector should read.',
                        },
                        {
                          label: 'Sample File:',
                          type: 'file',
                          name: 'ftp_sample_file_5d9f70b98a71fc911a4068bd',
                          value: '',
                          tooltip:
                            'Please upload a sample csv file containing records to help us build the mapping definition of the csv file.',
                        },
                        {
                          label: 'Leave File On Server',
                          type: 'checkbox',
                          name: 'skipDelete_5d9f70b98a71fc911a4068bd',
                          value: false,
                          tooltip:
                            'Choose this setting if the Connector should leave the files on the FTP server after reading. Else the file will be deleted from the FTP server after reading.',
                        },
                        {
                          label: 'Use Credit Memos',
                          type: 'checkbox',
                          name:
                            'checkbox_credit_memo_5d9f70b98a71fc911a4068bd',
                          value: false,
                          tooltip:
                            'Choose this setting if the Connector should sync credit memos.',
                        },
                        {
                          label: 'Ignore following Customers:',
                          type: 'textarea',
                          name:
                            'textarea_customer_filter_5d9f70b98a71fc911a4068bd',
                          value: '',
                          placeholder: 'eg. ACME Inc., S Industries',
                          tooltip:
                            'Please enter names of customers (separated by ",") for which payments should be ignored.',
                        },
                        {
                          label: 'NetSuite Invoice Prefix:',
                          type: 'textarea',
                          name:
                            'textarea_ns_invoice_prefix_5d9f70b98a71fc911a4068bd',
                          value: '',
                          placeholder: 'eg. INV, IV',
                          tooltip:
                            'Please enter list of prefixes (separated by ",") in order of priority used in NetSuite Account.',
                        },
                        {
                          label: 'NetSuite Invoice Identifier',
                          type: 'select',
                          name:
                            'select_ns_invoice_identifier_5d9f70b98a71fc911a4068bd',
                          options: [['tranid_Invoice #', 'Invoice #']],
                          value: 'tranid_Invoice #',
                          supportsRefresh: true,
                          tooltip:
                            'Please select the field from the list for which the connector should look for the Invoice number to match the Invoice Id from bank file.',
                        },
                        {
                          label: 'Column delimiter:',
                          type: 'input',
                          name: 'columnDelimiter_5d9f70b98a71fc911a4068bd',
                          placeholder: 'Optional',
                          tooltip: 'Please provide the column delimiter.',
                        },
                        {
                          label: 'Archive file',
                          type: 'checkbox',
                          name: 'archive_file_5d9f70b98a71fc911a4068bd',
                          value: false,
                          tooltip:
                            'Choose this setting if the Connector should archive the files in NetSuite file cabinet.',
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
                          tooltip:
                            'Settings to change the column position of fields in csv file format.',
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
                          tooltip:
                            'Settings to change the column position of fields in csv file format.',
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
                          tooltip:
                            'Settings to change the column position of fields in csv file format.',
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
                          tooltip:
                            'This setting allows you to specify how certain transaction codes will be processed by the connector. A transaction code could be sent by the bank in the remittance file indicating the type of transaction for eg: Debit or Credit. Based on your needs you can choose to skip or process only those transaction codes. You can only choose one action for the transaction codes as described below.\n\nSkip: Choose this option to skip the transaction codes which have been specified in the text box.\n\nAllow: Choose this to only allow the processing of transaction codes specified in the text box. All other incoming transaction codes will be ignored.\n\nDefault: Choose this to process all the incoming transaction codes. This is the default selection.',
                        },
                        {
                          label: 'Enter Transaction Codes',
                          type: 'input',
                          name: 'transactionCodes_5d9f70b98a71fc911a4068bd',
                          placeholder: 'eg. 100,102,104,201-299,305',
                          tooltip:
                            "Enter individual transaction code(s) or range(s) separated by a comma. Based on your choice, corresponding transactions will either be skipped or included for processing from the bank file. Use '-' to indicate a code range. For example: 100,102,104,201-299,305",
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
                          tooltip:
                            'Please enter the currency that should be used for the creation of payment. This is an optional field and should only be specified when the bank will send all the transactions in a pre-defined currency. In the case when the transactions in the bank file will carry currency details, this field need not be populated and the transaction currency from the bank file will be used to create payments. In case the currency is not specified and the bank file doesn’t contain currency details for the transactions, then the payment will be created for the customer’s primary currency.',
                          properties: {
                            sectionName: 'Payment Settings',
                          },
                        },
                        {
                          label: 'Customer Has Priority',
                          type: 'checkbox',
                          name:
                            'checkbox_customer_priority_5d9f70b98a71fc911a4068bd',
                          tooltip:
                            'This setting will assume transaction customer to be of higher priority and if the transaction customer is found and ascertained, the invoices will be searched for this customer as we now know the correct customer before the invoice search happens.',
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
                          tooltip:
                            'If there is no match using invoice number, then this enables to find the match using invoice/transaction amount for that customer.',
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
                          tooltip:
                            'This setting if checked will filter out any zero amount transactions.\nUnselect this checkbox to create zero amount transactions.',
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
                          tooltip:
                            'Unselect this check box to create customer payment for Administrator role when posting period is locked.',
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
                          tooltip:
                            'CAM employs an optional advanced search algorithm which can improve the match rate by employing fuzzy search on the the file record with the records in NetSuite in case the exact matches are not found. The results returned are approximate matches and certain users may prefer to review the matches thus found.',
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
                          tooltip:
                            'This value determines the degree of search results. With 0.1 being highest and 1 being lowest',
                          properties: {
                            sectionName: 'Matching Settings',
                          },
                        },
                        {
                          type: 'subsidiaryMapWidget',
                          name:
                            'multisubsidiary_settings_5d9f70b98a71fc911a4068bd',
                          tooltip:
                            'Please specify the GL accounts for each of your subsidiaries here. This mapping allows the product to identify the GL account that will be used for a particular subsidiary to create payments, write-offs or customer deposits. The Subsidiary name and Payment account are mandatory fields and must be supplied. You can choose to provide a dummy customer in the corresponding subsidiary to allow the creation of incoming payment in case the customer is not identified during processing, and later once you have identified the customer you can change the value to the correct customer. Please make sure that all your subsidiaries have an entry in this section.',
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
                  matchingRules: {
                    transactionStatusValues: [],
                    creditMemoStatusValues: [],
                    applyValues: [],
                    expressionSearchFilters: [],
                    expressionSearchOperators: [],
                    expressionSearchValues: [],
                    value: [],
                  },
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
                          tooltip:
                            'Please provide the path of the Directory in the FTP server where the files are stored.',
                        },
                        {
                          label: 'File Name Starts With:',
                          type: 'input',
                          name: 'fileNameStartsWith_5d9f71628a71fc911a4068d9',
                          placeholder: 'Optional',
                          tooltip:
                            'Please provide the first few characters of the file name which the Connector should read.',
                        },
                        {
                          label: 'File Name Ends With:',
                          type: 'input',
                          name: 'fileNameEndsWith_5d9f71628a71fc911a4068d9',
                          placeholder: 'Optional',
                          tooltip:
                            'Please provide the last few characters of the file name which the Connector should read.',
                        },
                        {
                          label: 'Sample File:',
                          type: 'file',
                          name: 'ftp_sample_file_5d9f71628a71fc911a4068d9',
                          value: '',
                          tooltip:
                            'Please upload a sample csv file containing records to help us build the mapping definition of the csv file.',
                        },
                        {
                          label: 'Leave File On Server',
                          type: 'checkbox',
                          name: 'skipDelete_5d9f71628a71fc911a4068d9',
                          value: false,
                          tooltip:
                            'Choose this setting if the Connector should leave the files on the FTP server after reading. Else the file will be deleted from the FTP server after reading.',
                        },
                        {
                          label: 'Use Credit Memos',
                          type: 'checkbox',
                          name:
                            'checkbox_credit_memo_5d9f71628a71fc911a4068d9',
                          value: false,
                          tooltip:
                            'Choose this setting if the Connector should sync credit memos.',
                        },
                        {
                          label: 'Ignore following Customers:',
                          type: 'textarea',
                          name:
                            'textarea_customer_filter_5d9f71628a71fc911a4068d9',
                          value: '',
                          placeholder: 'eg. ACME Inc., S Industries',
                          tooltip:
                            'Please enter names of customers (separated by ",") for which payments should be ignored.',
                        },
                        {
                          label: 'NetSuite Invoice Prefix:',
                          type: 'textarea',
                          name:
                            'textarea_ns_invoice_prefix_5d9f71628a71fc911a4068d9',
                          value: '',
                          placeholder: 'eg. INV, IV',
                          tooltip:
                            'Please enter list of prefixes (separated by ",") in order of priority used in NetSuite Account.',
                        },
                        {
                          label: 'NetSuite Invoice Identifier',
                          type: 'select',
                          name:
                            'select_ns_invoice_identifier_5d9f71628a71fc911a4068d9',
                          options: [['tranid_Invoice #', 'Invoice #']],
                          value: 'tranid_Invoice #',
                          supportsRefresh: true,
                          tooltip:
                            'Please select the field from the list for which the connector should look for the Invoice number to match the Invoice Id from bank file.',
                        },
                        {
                          label: 'Column delimiter:',
                          type: 'input',
                          name: 'columnDelimiter_5d9f71628a71fc911a4068d9',
                          placeholder: 'Optional',
                          tooltip: 'Please provide the column delimiter.',
                        },
                        {
                          label: 'Archive file',
                          type: 'checkbox',
                          name: 'archive_file_5d9f71628a71fc911a4068d9',
                          value: false,
                          tooltip:
                            'Choose this setting if the Connector should archive the files in NetSuite file cabinet.',
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
                          tooltip:
                            'Specify the netsuite file cabinet location where the outgoing file will be archived once it has been transferred.',
                        },
                        {
                          label: 'File Has Header Row',
                          type: 'checkbox',
                          name: 'hasHeaderRow_5d9f71628a71fc911a4068d9',
                          value: false,
                          tooltip:
                            'Please indicate if the csv file has column headers',
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
                          tooltip:
                            'Settings to change the column position of fields in csv file format.',
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
                          tooltip:
                            'Settings to change the column position of fields in csv file format.',
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
                          tooltip:
                            'Settings to change the column position of fields in csv file format.',
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
                          tooltip:
                            'This setting allows you to specify how certain transaction codes will be processed by the connector. A transaction code could be sent by the bank in the remittance file indicating the type of transaction for eg: Debit or Credit. Based on your needs you can choose to skip or process only those transaction codes. You can only choose one action for the transaction codes as described below.\n\nSkip: Choose this option to skip the transaction codes which have been specified in the text box.\n\nAllow: Choose this to only allow the processing of transaction codes specified in the text box. All other incoming transaction codes will be ignored.\n\nDefault: Choose this to process all the incoming transaction codes. This is the default selection.',
                        },
                        {
                          label: 'Enter Transaction Codes',
                          type: 'input',
                          name: 'transactionCodes_5d9f71628a71fc911a4068d9',
                          placeholder: 'eg. 100,102,104,201-299,305',
                          tooltip:
                            "Enter individual transaction code(s) or range(s) separated by a comma. Based on your choice, corresponding transactions will either be skipped or included for processing from the bank file. Use '-' to indicate a code range. For example: 100,102,104,201-299,305",
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
                          tooltip:
                            'Please enter the currency that should be used for the creation of payment. This is an optional field and should only be specified when the bank will send all the transactions in a pre-defined currency. In the case when the transactions in the bank file will carry currency details, this field need not be populated and the transaction currency from the bank file will be used to create payments. In case the currency is not specified and the bank file doesn’t contain currency details for the transactions, then the payment will be created for the customer’s primary currency.',
                          properties: {
                            sectionName: 'Payment Settings',
                          },
                        },
                        {
                          label: 'Customer Has Priority',
                          type: 'checkbox',
                          name:
                            'checkbox_customer_priority_5d9f71628a71fc911a4068d9',
                          tooltip:
                            'This setting will assume transaction customer to be of higher priority and if the transaction customer is found and ascertained, the invoices will be searched for this customer as we now know the correct customer before the invoice search happens.',
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
                          tooltip:
                            'If there is no match using invoice number, then this enables to find the match using invoice/transaction amount for that customer.',
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
                          tooltip:
                            'This setting if checked will filter out any zero amount transactions.\nUnselect this checkbox to create zero amount transactions.',
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
                          tooltip:
                            'Unselect this check box to create customer payment for Administrator role when posting period is locked.',
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
                          tooltip:
                            'CAM employs an optional advanced search algorithm which can improve the match rate by employing fuzzy search on the the file record with the records in NetSuite in case the exact matches are not found. The results returned are approximate matches and certain users may prefer to review the matches thus found.',
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
                          tooltip:
                            'This value determines the degree of search results. With 0.1 being highest and 1 being lowest',
                          properties: {
                            sectionName: 'Matching Settings',
                          },
                        },
                        {
                          type: 'subsidiaryMapWidget',
                          name:
                            'multisubsidiary_settings_5d9f71628a71fc911a4068d9',
                          tooltip:
                            'Please specify the GL accounts for each of your subsidiaries here. This mapping allows the product to identify the GL account that will be used for a particular subsidiary to create payments, write-offs or customer deposits. The Subsidiary name and Payment account are mandatory fields and must be supplied. You can choose to provide a dummy customer in the corresponding subsidiary to allow the creation of incoming payment in case the customer is not identified during processing, and later once you have identified the customer you can change the value to the correct customer. Please make sure that all your subsidiaries have an entry in this section.',
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
                  matchingRules: {
                    transactionStatusValues: [],
                    creditMemoStatusValues: [],
                    applyValues: [],
                    expressionSearchFilters: [],
                    expressionSearchOperators: [],
                    expressionSearchValues: [],
                    value: [],
                  },
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
            tooltip:
              'If you are setting up the Connector and only want few test records to sync, enable this setting. Only records which have a field pre-fixed with the Test Mode Text will be selected for syncing.',
            value: false,
          },
          {
            label: 'Test Mode Text',
            name: 'testModeText',
            tooltip:
              'This text should be at least 5 characters long. Records with a field prefixed with this text will be selected for syncing.',
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
              tooltip:
                'If this setting is selected all Zendesk Organizations will be synced as NetSuite Customers.',
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
              tooltip:
                'The Connector will first create the Zendesk Organization and User and then sync the NetSuite Support Case as Zendesk Ticket under the Zendesk User.',
              value: false,
            },
            {
              label:
                'Create NetSuite Customer and Contact (if non-existent) while syncing Zendesk Ticket',
              type: 'checkbox',
              name: 'create_contacts_and_customers_in_netsuite',
              tooltip:
                'The Connector will first create the NetSuite Customer and Contact and then sync the Zendesk Ticket as NetSuite Support Case NetSuite Customer.',
              value: false,
            },
            {
              label:
                'Sync Zendesk Ticket Public Replies to NetSuite Case as Message',
              type: 'checkbox',
              name: 'sync_ticket_comments_to_netsuite',
              tooltip:
                'Zendesk Ticket Public replies will be synced as Public Case Messages in NetSuite.',
              value: false,
            },

            {
              label:
                'Sync attachments in NetSuite Support Cases to Zendesk Tickets',
              type: 'checkbox',
              name: 'sync_attachments_from_netsuite_to_zendesk',
              tooltip:
                'If this setting is selected, NetSuite Case Attachments will be synced to Zendesk.',
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
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkIntegrationAppStore();

      expect(selector()).toEqual({});
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

  describe('selectors.pendingCategoryMappings test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.pendingCategoryMappings({})).toEqual();
    });
  });

  describe('selectors.categoryMappingMetadata test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.categoryMappingMetadata(undefined, {})).toEqual({});
    });
  });

  describe('selectors.mappedCategories test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.mappedCategories()).toEqual([]);
    });
  });

  describe('selectors.categoryMappingGenerateFields test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.categoryMappingGenerateFields({})).toEqual(null);
    });
  });

  describe('selectors.mappingsForVariation test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.mappingsForVariation({})).toEqual({});
    });
  });

  describe('selectors.mappingsForCategory test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.mappingsForCategory({})).toEqual();
    });
  });

  describe('selectors.integrationAppName test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.integrationAppName();

      expect(selector()).toEqual(null);
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
              matchingRules: {
                applyValues: [],
                creditMemoStatusValues: [],
                expressionSearchFilters: [],
                expressionSearchOperators: [],
                expressionSearchValues: [],
                transactionStatusValues: [],
                value: [],
              },
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
                      tooltip:
                        'Please provide the path of the Directory in the FTP server where the files are stored.',
                    },
                    {
                      label: 'File Name Starts With:',
                      type: 'input',
                      name: 'fileNameStartsWith_5d9f70b98a71fc911a4068bd',
                      placeholder: 'Optional',
                      tooltip:
                        'Please provide the first few characters of the file name which the Connector should read.',
                    },
                    {
                      label: 'File Name Ends With:',
                      type: 'input',
                      name: 'fileNameEndsWith_5d9f70b98a71fc911a4068bd',
                      placeholder: 'Optional',
                      tooltip:
                        'Please provide the last few characters of the file name which the Connector should read.',
                    },
                    {
                      label: 'Sample File:',
                      type: 'file',
                      name: 'ftp_sample_file_5d9f70b98a71fc911a4068bd',
                      value: '',
                      tooltip:
                        'Please upload a sample csv file containing records to help us build the mapping definition of the csv file.',
                    },
                    {
                      label: 'Leave File On Server',
                      type: 'checkbox',
                      name: 'skipDelete_5d9f70b98a71fc911a4068bd',
                      value: false,
                      tooltip:
                        'Choose this setting if the Connector should leave the files on the FTP server after reading. Else the file will be deleted from the FTP server after reading.',
                    },
                    {
                      label: 'Use Credit Memos',
                      type: 'checkbox',
                      name: 'checkbox_credit_memo_5d9f70b98a71fc911a4068bd',
                      value: false,
                      tooltip:
                        'Choose this setting if the Connector should sync credit memos.',
                    },
                    {
                      label: 'Ignore following Customers:',
                      type: 'textarea',
                      name: 'textarea_customer_filter_5d9f70b98a71fc911a4068bd',
                      value: '',
                      placeholder: 'eg. ACME Inc., S Industries',
                      tooltip:
                        'Please enter names of customers (separated by ",") for which payments should be ignored.',
                    },
                    {
                      label: 'NetSuite Invoice Prefix:',
                      type: 'textarea',
                      name:
                        'textarea_ns_invoice_prefix_5d9f70b98a71fc911a4068bd',
                      value: '',
                      placeholder: 'eg. INV, IV',
                      tooltip:
                        'Please enter list of prefixes (separated by ",") in order of priority used in NetSuite Account.',
                    },
                    {
                      label: 'NetSuite Invoice Identifier',
                      type: 'select',
                      name:
                        'select_ns_invoice_identifier_5d9f70b98a71fc911a4068bd',
                      options: [['tranid_Invoice #', 'Invoice #']],
                      value: 'tranid_Invoice #',
                      supportsRefresh: true,
                      tooltip:
                        'Please select the field from the list for which the connector should look for the Invoice number to match the Invoice Id from bank file.',
                    },
                    {
                      label: 'Column delimiter:',
                      type: 'input',
                      name: 'columnDelimiter_5d9f70b98a71fc911a4068bd',
                      placeholder: 'Optional',
                      tooltip: 'Please provide the column delimiter.',
                    },
                    {
                      label: 'Archive file',
                      type: 'checkbox',
                      name: 'archive_file_5d9f70b98a71fc911a4068bd',
                      value: false,
                      tooltip:
                        'Choose this setting if the Connector should archive the files in NetSuite file cabinet.',
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
                      tooltip:
                        'Settings to change the column position of fields in csv file format.',
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
                      tooltip:
                        'Settings to change the column position of fields in csv file format.',
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
                      tooltip:
                        'Settings to change the column position of fields in csv file format.',
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
                      tooltip:
                        'This setting allows you to specify how certain transaction codes will be processed by the connector. A transaction code could be sent by the bank in the remittance file indicating the type of transaction for eg: Debit or Credit. Based on your needs you can choose to skip or process only those transaction codes. You can only choose one action for the transaction codes as described below.\n\nSkip: Choose this option to skip the transaction codes which have been specified in the text box.\n\nAllow: Choose this to only allow the processing of transaction codes specified in the text box. All other incoming transaction codes will be ignored.\n\nDefault: Choose this to process all the incoming transaction codes. This is the default selection.',
                    },
                    {
                      label: 'Enter Transaction Codes',
                      type: 'input',
                      name: 'transactionCodes_5d9f70b98a71fc911a4068bd',
                      placeholder: 'eg. 100,102,104,201-299,305',
                      tooltip:
                        "Enter individual transaction code(s) or range(s) separated by a comma. Based on your choice, corresponding transactions will either be skipped or included for processing from the bank file. Use '-' to indicate a code range. For example: 100,102,104,201-299,305",
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
                      tooltip:
                        'Please enter the currency that should be used for the creation of payment. This is an optional field and should only be specified when the bank will send all the transactions in a pre-defined currency. In the case when the transactions in the bank file will carry currency details, this field need not be populated and the transaction currency from the bank file will be used to create payments. In case the currency is not specified and the bank file doesn’t contain currency details for the transactions, then the payment will be created for the customer’s primary currency.',
                      properties: {
                        sectionName: 'Payment Settings',
                      },
                    },
                    {
                      label: 'Customer Has Priority',
                      type: 'checkbox',
                      name:
                        'checkbox_customer_priority_5d9f70b98a71fc911a4068bd',
                      tooltip:
                        'This setting will assume transaction customer to be of higher priority and if the transaction customer is found and ascertained, the invoices will be searched for this customer as we now know the correct customer before the invoice search happens.',
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
                      tooltip:
                        'If there is no match using invoice number, then this enables to find the match using invoice/transaction amount for that customer.',
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
                      tooltip:
                        'This setting if checked will filter out any zero amount transactions.\nUnselect this checkbox to create zero amount transactions.',
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
                      tooltip:
                        'Unselect this check box to create customer payment for Administrator role when posting period is locked.',
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
                      tooltip:
                        'CAM employs an optional advanced search algorithm which can improve the match rate by employing fuzzy search on the the file record with the records in NetSuite in case the exact matches are not found. The results returned are approximate matches and certain users may prefer to review the matches thus found.',
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
                      tooltip:
                        'This value determines the degree of search results. With 0.1 being highest and 1 being lowest',
                      properties: {
                        sectionName: 'Matching Settings',
                      },
                    },
                    {
                      type: 'subsidiaryMapWidget',
                      name: 'multisubsidiary_settings_5d9f70b98a71fc911a4068bd',
                      tooltip:
                        'Please specify the GL accounts for each of your subsidiaries here. This mapping allows the product to identify the GL account that will be used for a particular subsidiary to create payments, write-offs or customer deposits. The Subsidiary name and Payment account are mandatory fields and must be supplied. You can choose to provide a dummy customer in the corresponding subsidiary to allow the creation of incoming payment in case the customer is not identified during processing, and later once you have identified the customer you can change the value to the correct customer. Please make sure that all your subsidiaries have an entry in this section.',
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
              tooltip:
                'If this setting is selected all Zendesk Organizations will be synced as NetSuite Customers.',
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
              tooltip:
                'The Connector will first create the Zendesk Organization and User and then sync the NetSuite Support Case as Zendesk Ticket under the Zendesk User.',
              type: 'checkbox',
              value: false,
            },
            {
              label:
                'Create NetSuite Customer and Contact (if non-existent) while syncing Zendesk Ticket',
              name: 'create_contacts_and_customers_in_netsuite',
              tooltip:
                'The Connector will first create the NetSuite Customer and Contact and then sync the Zendesk Ticket as NetSuite Support Case NetSuite Customer.',
              type: 'checkbox',
              value: false,
            },
            {
              label:
                'Sync Zendesk Ticket Public Replies to NetSuite Case as Message',
              name: 'sync_ticket_comments_to_netsuite',
              tooltip:
                'Zendesk Ticket Public replies will be synced as Public Case Messages in NetSuite.',
              type: 'checkbox',
              value: false,
            },
            {
              label:
                'Sync attachments in NetSuite Support Cases to Zendesk Tickets',
              name: 'sync_attachments_from_netsuite_to_zendesk',
              tooltip:
                'If this setting is selected, NetSuite Case Attachments will be synced to Zendesk.',
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
            tooltip: 'Select the checkbox for manual upload of file.',
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
            tooltip:
              'If you are setting up the Connector and only want few test records to sync, enable this setting. Only records which have a field pre-fixed with the Test Mode Text will be selected for syncing.',
            type: 'checkbox',
            value: false,
          },
          {
            label: 'Test Mode Text',
            name: 'testModeText',
            tooltip:
              'This text should be at least 5 characters long. Records with a field prefixed with this text will be selected for syncing.',
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
          name: '5d9b20328a71fc911a4018a4',
        },
        {
          _id: '5d9b20328a71fc911a4018a7',
          _integrationId: 'integrationId2',
          name: '5d9b20328a71fc911a4018a7',
        },
        {
          _id: '5d9b20328a71fc911a4018a8',
          _integrationId: 'integrationId2',
          name: '5d9b20328a71fc911a4018a8',
        },
        {
          _id: '5d9b20328a71fc911a4018a9',
          _integrationId: 'integrationId2',
          name: '5d9b20328a71fc911a4018a9',
        },
        {
          _id: '5d9b20328a71fc911a4018ac',
          _integrationId: 'integrationId2',
          name: '5d9b20328a71fc911a4018ac',
        },
        {
          _id: '5d9b20328a71fc911a4018ad',
          _integrationId: 'integrationId2',
          name: '5d9b20328a71fc911a4018ad',
        },
        {
          _id: '5d9b20328a71fc911a4018b0',
          _integrationId: 'integrationId2',
          name: '5d9b20328a71fc911a4018b0',
        },
        {
          _id: '5d9b20328a71fc911a4018b2',
          _integrationId: 'integrationId2',
          name: '5d9b20328a71fc911a4018b2',
        },
        {
          _id: '5d9b20328a71fc911a4018b3',
          _integrationId: 'integrationId2',
          name: '5d9b20328a71fc911a4018b3',
        },

        {
          _id: '5d9b20328a71fc911a4018ba',
          _integrationId: 'integrationId2',
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
          id: '5d9f70b98a71fc911a4068bd',
        },
        {
          _id: '5d9f71628a71fc911a4068d9',
          _integrationId: 'integrationId',
          name: '5d9f71628a71fc911a4068d9',
          childId: 'dd67a407',
          childName: 'HSBC',
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
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isIntegrationAppVersion2()).toEqual(false);
    });
  });

  describe('selectors.integrationAppChildIdOfFlow test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationAppChildIdOfFlow()).toEqual(null);
    });
  });
});

