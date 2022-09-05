export default
{
  flows: [
    {
      _id: 'flowExport',
      lastModified: '2022-05-05T00:58:39.936Z',
      name: 'This is a really big flow',
      description: 'with a desc',
      disabled: true,
      schedule: '? 10 0,8,16 ? * 1,6,0',
      _integrationId: '5cfee7936171ea32e3759239',
      skipRetries: false,
      pageGenerators: [
        {
          _exportId: '5d7acd32a523f46c89e2578d',
          skipRetries: false,
          id: '5d7acd32a523f46c89e2578d',
        },
        {
          _exportId: '5d7acc78c7a0a1744b86f1db',
          id: '5d7acc78c7a0a1744b86f1db',
        },
        {
          _exportId: '5d7acd51c7a0a1744b86f202',
          id: '5d7acd51c7a0a1744b86f202',
        },
        {
          _exportId: '5d9038c7c4aaff6492aa1c5e',
          id: '5d9038c7c4aaff6492aa1c5e',
        },
        {
          application: 'webhook',
          webhookOnly: true,
          id: 'new-L-lbJ5',
        },
        {
          _connectionId: '5c723d770f188667b7a06b35',
          webhookOnly: false,
          id: 'new-Fcu_fo',
        },
      ],
      createdAt: '2019-06-25T14:49:35.756Z',
      wizardState: 'step3',
      autoResolveMatchingTraceKeys: true,
      routers: [
        {
          id: '-OkZM-',
          branches: [
            {
              name: 'Branch 1.0',
              pageProcessors: [
                {
                  responseMapping: {
                    fields: [
                      {
                        extract: 'id',
                        generate: 'ID',
                      },
                      {
                        extract: 'errors',
                        generate: 'ERRORS',
                      },
                    ],
                    lists: [],
                  },
                  type: 'import',
                  _importId: '5d7badfdbc680646da9f8c2c',
                  id: '5d7badfdbc680646da9f8c2c',
                },
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  type: 'export',
                  _connectionId: '5c761d715ceb7e3c6a89eada',
                  id: 'new-19C2Ac',
                },
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  type: 'import',
                  _importId: '5d7ace75a523f46c89e257ca',
                  id: '5d7ace75a523f46c89e257ca',
                },
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  type: 'export',
                  _connectionId: '5ce822237c95546b15c487a3',
                  id: 'new-480dqm',
                },
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  type: 'import',
                  _connectionId: '5c828dd4098e287f6479faff',
                  id: 'new-uZyPfr',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  exports: [
    {
      _id: '5d7acd32a523f46c89e2578d',
      createdAt: '2019-09-12T22:56:50.745Z',
      lastModified: '2021-03-24T20:48:02.985Z',
      name: 'ftp 1 that has a long title... we should see a truncated name with ellipsis at the end and longer',
      _connectionId: '5c828dd4098e287f6479faff',
      apiIdentifier: 'e8881a5688',
      asynchronous: true,
      sandbox: false,
      sampleData: '2018-10-16T15:44:41.086Z f66054b3b046445aa7943a4233a70bd2 export \n{"relativeURI":"3dCartWebAPI/v1/Customers?offset=1","uri":"https://apirest.3dcart.com/3dCartWebAPI/v1/Customers?offset=1","headers":{"SecureUrl":"https://sandbox-integrator-io.3dcartstores.com","PrivateKey":"********","Accept":"application/json","Token":"  ********"},"method":"GET","json":true,"followAllRedirects":true,"gzip":true}\n\n\n2018-10-16T15:44:41.733Z f66054b3b046445aa7943a4233a70bd2 export \n{"body":[{"CustomerID":2,"Email":"dave.jones@goceligo.net","Password":"30c47be3897020196aadcd0170f3aea3","BillingCompany":"GoCeligo","BillingFirstName":"Dave","BillingLastName":"Jones","BillingAddress1":"123 Bill Me Street","BillingAddress2":null,"BillingCity":"Destin","BillingState":"FL","BillingZipCode":"32540","BillingCountry":"US","BillingPhoneNumber":"555-777-1234","BillingTaxID":null,"ShippingCompany":"GoCeligo","ShippingFirstName":"Dave","ShippingLastName":"Jones","ShippingAddress1":"123 Shipping Street","ShippingAddress2":null,"ShippingCity":"Destin","ShippingState":"FL","ShippingZipCode":"32540","ShippingCountry":"US","ShippingPhoneNumber":"555-777-1234","ShippingAddressType":1,"CustomerGroupID":0,"Enabled":true,"MailList":false,"NonTaxable":false,"DisableBillingSameAsShipping":false,"Comments":null,"AdditionalField1":null,"AdditionalField2":null,"AdditionalField3":null,"TotalStoreCredit":0,"ResetPassword":false},{"CustomerID":3,"Email":"3.newemail@sandbox-integrator-io.com","Password":"f768963f42163f77624df1b014ea8a58","BillingCompany":"Demo_1","BillingFirstName":"Joe","BillingLastName":"Shmoe","BillingAddress1":"456 Bill Street","BillingAddress2":null,"BillingCity":"Destin","BillingState":"FL","BillingZipCode":"32540","BillingCountry":"US","BillingPhoneNumber":"555-777-8899","BillingTaxID":null,"ShippingCompany":"Demo_1","ShippingFirstName":"Joe","ShippingLastName":"Schmoe","ShippingAddress1":"234 Shipping Ave","ShippingAddress2":null,"ShippingCity":"Williamsport","ShippingState":"MD","ShippingZipCode":"21795","ShippingCountry":"US","ShippingPhoneNumber":"333-1111-8888","ShippingAddressType":1,"CustomerGroupID":1,"Enabled":true,"MailList":false,"NonTaxable":false,"DisableBillingSameAsShipping":false,"Comments":null,"AdditionalField1":null,"AdditionalField2":null,"AdditionalField3":null,"TotalStoreCredit":0,"ResetPassword":false},{"CustomerID":4,"Email":"josh.tester@goceligo.net","Password":"eae45bc610644b6e3daec2bac22189ad","BillingCompany":"Test Inc.","BillingFirstName":"Josh","BillingLastName":"Tester","BillingAddress1":"567 Billing Street","BillingAddress2":null,"BillingCity":"Wmspt","BillingState":"MD","BillingZipCode":"21795","BillingCountry":"US","BillingPhoneNumber":"123-888-9876","BillingTaxID":null,"ShippingCompany":null,"ShippingFirstName":"Ann","ShippingLastName":"Tester","ShippingAddress1":"89889343 Ship To Me Ave","ShippingAddress2":null,"ShippingCity":"Destin","ShippingState":"FL","ShippingZipCode":"32540","ShippingCountry":"US","ShippingPhoneNumber":"123-888-9876","ShippingAddressType":0,"CustomerGroupID":10,"Enabled":true,"MailList":false,"NonTaxable":false,"DisableBillingSameAsShipping":false,"Comments":null,"AdditionalField1":null,"AdditionalField2":null,"AdditionalField3":null,"TotalStoreCredit":0,"ResetPassword":false},{"CustomerID":5,"Email":"d.carr@goceligo.net","Password":"836c5944d0c4d53a7848945c39ab13e1","BillingCompany":"GoCeligo","BillingFirstName":"David","BillingLastName":"Carr","BillingAddress1":"543 Bill Street","BillingAddress2":null,"BillingCity":"FWB","BillingState":"FL","BillingZipCode":"32548","BillingCountry":"US","BillingPhoneNumber":"555-555-5555","BillingTaxID":null,"ShippingCompany":"GoCeligo","ShippingFirstName":"David","ShippingLastName":"Carr","ShippingAddress1":"398 Ship Street","ShippingAddress2":null,"ShippingCity":"Destin","ShippingState":"FL","ShippingZipCode":"32540","ShippingCountry":"US","ShippingPhoneNumber":"444-444-4444","ShippingAddressType":1,"CustomerGroupID":4,"Enabled":true,"MailList":false,"NonTaxable":false,"DisableBillingSameAsShipping":false,"Comments":null,"AdditionalField1":null,"AdditionalField2":null,"AdditionalField3":null,"TotalStoreCredit":0,"ResetPassword":false},{"CustomerID":12,"Email":"sandeep3@test.com","Password":"c344322fc7e208b90a2d94a05262ab58","BillingCompany":"3DCart B","BillingFirstName":"Sandy3","BillingLastName":"Test2","BillingAddress1":"123 Street","BillingAddress2":"null","BillingCity":"Coral Springs","BillingState":"FL","BillingZipCode":"33065","BillingCountry":"US","BillingPhoneNumber":"800-828-6650","BillingTaxID":null,"ShippingCompany":"3DCart S","ShippingFirstName":"John","ShippingLastName":"Doe","ShippingAddress1":"123 Street","ShippingAddress2":"null","ShippingCity":"Anglesina","ShippingState":"FL","ShippingZipCode":"33065","ShippingCountry":"US","ShippingPhoneNumber":"800-828-6650","ShippingAddressType":1,"CustomerGroupID":10,"Enabled":false,"MailList":false,"NonTaxable":false,"DisableBillingSameAsShipping":false,"Comments":null,"AdditionalField1":null,"AdditionalField2":null,"AdditionalField3":null,"TotalStoreCredit":0,"ResetPassword":false},{"CustomerID":14,"Email":"sandeep4@test.com","Password":"030b0bb6ee27b9191edec92296fa9686","BillingCompany":"3DCart","BillingFirstName":"Sandy4","BillingLastName":"Test2","BillingAddress1":"123 Street","BillingAddress2":"null","BillingCity":"Coral Springs","BillingState":"FL","BillingZipCode":"33065","BillingCountry":"US","BillingPhoneNumber":"800-828-6650","BillingTaxID":null,"ShippingCompany":"3DCart","ShippingFirstName":"John","ShippingLastName":"Doe","ShippingAddress1":"123 Street","ShippingAddress2":"null","ShippingCity":"Anglesina","ShippingState":"FL","ShippingZipCode":"33065","ShippingCountry":"US","ShippingPhoneNumber":"800-828-6650","ShippingAddressType":1,"CustomerGroupID":10,"Enabled":false,"MailList":false,"NonTaxable":false,"DisableBillingSameAsShipping":false,"Comments":null,"AdditionalField1":null,"AdditionalField2":null,"AdditionalField3":null,"TotalStoreCredit":0,"ResetPassword":false},{"CustomerID":17,"Email":"sandeep555@test.com","Password":"d7758dc2ba5795541685f83567fd8477","BillingCompany":"3DCart","BillingFirstName":"Sandy555_555","BillingLastName":"Test2","BillingAddress1":"123 Street","BillingAddress2":"null","BillingCity":"Coral Springs","BillingState":"FL","BillingZipCode":"33065","BillingCountry":"US","BillingPhoneNumber":"800-828-6650","BillingTaxID":null,"ShippingCompany":"3DCart","ShippingFirstName":"John","ShippingLastName":"Doe","ShippingAddress1":"123 Street","ShippingAddress2":"null","ShippingCity":"Anglesina","ShippingState":"FL","ShippingZipCode":"33065","ShippingCountry":"US","ShippingPhoneNumber":"800-828-6650","ShippingAddressType":1,"CustomerGroupID":10,"Enabled":false,"MailList":false,"NonTaxable":false,"DisableBillingSameAsShipping":false,"Comments":null,"AdditionalField1":null,"AdditionalField2":null,"AdditionalField3":null,"TotalStoreCredit":0,"ResetPassword":false},{"CustomerID":19,"Email":"sandeep6@test.com","Password":"a9adb3f3aef9e89593b96f6e940969b8","BillingCompany":"3DCart","BillingFirstName":"Sandy6","BillingLastName":"Test2","BillingAddress1":"123 Street","BillingAddress2":"null","BillingCity":"Coral Springs","BillingState":"FL","BillingZipCode":"33065","BillingCountry":"US","BillingPhoneNumber":"800-828-6650","BillingTaxID":null,"ShippingCompany":"3DCart","ShippingFirstName":"John","ShippingLastName":"Doe","ShippingAddress1":"123 Street","ShippingAddress2":"null","ShippingCity":"Coral Springs","ShippingState":"FL","ShippingZipCode":"33065","ShippingCountry":"US","ShippingPhoneNumber":"800-828-6650","ShippingAddressType":1,"CustomerGroupID":0,"Enabled":false,"MailList":false,"NonTaxable":false,"DisableBillingSameAsShipping":false,"Comments":null,"AdditionalField1":null,"AdditionalField2":null,"AdditionalField3":null,"TotalStoreCredit":0,"ResetPassword":false},{"CustomerID":21,"Email":"sandeep222_222_!!!@test.com","Password":"69af18bc523f0e58da42ac9ac9f0f638","BillingCompany":"3DCart","BillingFirstName":"Sandy222222_222222","BillingLastName":"Test","BillingAddress1":"123 Street","BillingAddress2":"null","BillingCity":"Coral Springs","BillingState":"FL","BillingZipCode":"33065","BillingCountry":"US","BillingPhoneNumber":"800-828-6650","BillingTaxID":null,"ShippingCompany":"3DCart","ShippingFirstName":"John","ShippingLastName":"Doe","ShippingAddress1":"123 Street","ShippingAddress2":"null","ShippingCity":"Coral Springs","ShippingState":"FL","ShippingZipCode":"33065","ShippingCountry":"US","ShippingPhoneNumber":"800-828-6650","ShippingAddressType":1,"CustomerGroupID":0,"Enabled":false,"MailList":false,"NonTaxable":false,"DisableBillingSameAsShipping":false,"Comments":null,"AdditionalField1":null,"AdditionalField2":null,"AdditionalField3":null,"TotalStoreCredit":0,"ResetPassword":false},{"CustomerID":22,"Email":"22.newemail@sandbox-integrator-io.com","Password":"bfe5706b9306fd906b8bfb88a99d2510","BillingCompany":"Test Venkat","BillingFirstName":"Venkat","BillingLastName":"Golla","BillingAddress1":"3/173 A-1","BillingAddress2":null,"BillingCity":"FWB","BillingState":"FL","BillingZipCode":"40012","BillingCountry":"US","BillingPhoneNumber":null,"BillingTaxID":null,"ShippingCompany":null,"ShippingFirstName":null,"ShippingLastName":null,"ShippingAddress1":null,"ShippingAddress2":null,"ShippingCity":null,"ShippingState":"AL","ShippingZipCode":null,"ShippingCountry":"US","ShippingPhoneNumber":null,"ShippingAddressType":1,"CustomerGroupID":0,"Enabled":true,"MailList":false,"NonTaxable":false,"DisableBillingSameAsShipping":false,"Comments":null,"AdditionalField1":null,"AdditionalField2":null,"AdditionalField3":null,"TotalStoreCredit":0,"ResetPassword":false}]}\n\n\n',
      ftp: {
        directoryPath: '/whatever222',
      },
      file: {
        encoding: 'utf8',
        output: 'records',
        skipDelete: false,
        type: 'csv',
        csv: {
          columnDelimiter: ',',
          rowDelimiter: '\r\n',
          hasHeaderRow: false,
          trimSpaces: true,
          rowsToSkip: 0,
        },
      },
      transform: {
        type: 'expression',
        expression: {
          version: '1',
        },
        version: '1',
      },
      filter: {
        type: 'expression',
        expression: {
          version: '1',
        },
        version: '1',
      },
      inputFilter: {
        type: 'expression',
        expression: {
          version: '1',
        },
        version: '1',
      },
      adaptorType: 'FTPExport',
    },
    {
      _id: '5d7acc78c7a0a1744b86f1db',
      createdAt: '2019-09-12T22:53:44.906Z',
      lastModified: '2021-03-09T02:32:48.435Z',
      name: 'http 1',
      _connectionId: '5c761d715ceb7e3c6a89eada',
      apiIdentifier: 'ea2bf370f0',
      asynchronous: true,
      sandbox: false,
      http: {
        relativeURI: 'people',
        method: 'GET',
        formType: 'http',
      },
      rawData: '5c19e22b39e4a82afd7eb37f8980c390f1c5411dbf21cf0290463edd',
      transform: {
        type: 'expression',
        expression: {
          version: '1',
        },
        version: '1',
      },
      filter: {
        type: 'expression',
        expression: {
          version: '1',
        },
        version: '1',
      },
      inputFilter: {
        type: 'expression',
        expression: {
          version: '1',
        },
        version: '1',
      },
      adaptorType: 'HTTPExport',
    },
    {
      _id: '5d7acd51c7a0a1744b86f202',
      createdAt: '2019-09-12T22:57:21.623Z',
      lastModified: '2019-09-12T22:57:21.782Z',
      name: 'jirra xyz',
      _connectionId: '5c723d770f188667b7a06b35',
      apiIdentifier: 'e8b97439de',
      asynchronous: true,
      type: 'test',
      assistant: 'jira',
      sandbox: false,
      assistantMetadata: {
        version: 'v2',
      },
      parsers: [],
      http: {
        relativeURI: '/rest/api/2/application-properties',
        method: 'GET',
        headers: [],
        successMediaType: 'json',
        errorMediaType: 'json',
        formType: 'assistant',
      },
      test: {
        limit: 1,
      },
      rest: {
        relativeURI: '/rest/api/2/application-properties',
        method: 'GET',
        headers: [],
      },
      transform: {
        type: 'expression',
        expression: {
          version: '1',
        },
        version: '1',
      },
      filter: {
        type: 'expression',
        expression: {
          version: '1',
        },
        version: '1',
      },
      inputFilter: {
        type: 'expression',
        expression: {
          version: '1',
        },
        version: '1',
      },
      adaptorType: 'RESTExport',
      _rest: {
        relativeURI: '/rest/api/2/application-properties',
        method: 'GET',
        headers: [],
      },
    },
    {
      _id: '5d9038c7c4aaff6492aa1c5e',
      createdAt: '2019-09-29T04:53:27.366Z',
      lastModified: '2019-10-11T18:32:19.056Z',
      name: 'webhook listener with a long name that wraps',
      description: 'This is a dropbox listener',
      type: 'webhook',
      sandbox: false,
      webhook: {
        provider: 'dropbox',
        key: '******',
      },
      transform: {
        type: 'expression',
        expression: {
          version: '1',
        },
        version: '1',
      },
      filter: {
        type: 'expression',
        expression: {
          version: '1',
        },
        version: '1',
      },
      inputFilter: {
        type: 'expression',
        expression: {
          version: '1',
        },
        version: '1',
      },
      adaptorType: 'WebhookExport',
    },
  ],
  imports: [
    {
      _id: '5d7ace75a523f46c89e257ca',
      createdAt: '2019-09-12T23:02:13.167Z',
      lastModified: '2019-10-10T21:52:44.371Z',
      name: 'FTP import with a really long name that spans lines',
      responseTransform: {
        type: 'expression',
        expression: {
          version: '1',
        },
        version: '1',
      },
      _connectionId: '5c828dd4098e287f6479faff',
      distributed: false,
      apiIdentifier: 'ib50a1dddb',
      sandbox: false,
      mapping: {
        fields: [
          {
            extract: 'films',
            generate: 'films',
          },
          {
            extract: 'people',
            generate: 'people',
          },
          {
            extract: 'planets',
            generate: 'planets',
          },
          {
            extract: 'species',
            generate: 'species',
          },
          {
            extract: 'starships',
            generate: 'starships',
          },
          {
            extract: 'vehicles',
            generate: 'vehicles',
          },
        ],
      },
      file: {
        fileName: 'file-{{timestamp "YYYY-MM-DDTHH-mm-ss"}}.csv',
        skipAggregation: false,
        type: 'csv',
        csv: {
          rowDelimiter: '\n',
          columnDelimiter: ',',
          includeHeader: true,
          wrapWithQuotes: false,
          replaceTabWithSpace: false,
          replaceNewlineWithSpace: false,
        },
      },
      ftp: {
        directoryPath: '/abc',
        fileName: 'file-{{timestamp "YYYY-MM-DDTHH-mm-ss"}}.csv',
      },
      filter: {
        type: 'expression',
        expression: {
          version: '1',
        },
        version: '1',
      },
      adaptorType: 'FTPImport',
    },
    {
      _id: '5d7badfdbc680646da9f8c2c',
      createdAt: '2019-09-13T14:55:57.953Z',
      lastModified: '2021-01-26T19:37:33.341Z',
      name: 'New Contacts new name',
      description: '123',
      responseTransform: {
        type: 'expression',
        expression: {
          version: '1',
        },
        version: '1',
      },
      _connectionId: '5c761d715ceb7e3c6a89eada',
      distributed: false,
      apiIdentifier: 'i07d692323',
      ignoreExisting: false,
      ignoreMissing: false,
      oneToMany: false,
      sandbox: false,
      http: {
        relativeURI: [
          '',
        ],
        method: [
          'POST',
        ],
        body: [
          '{{#each data}}\n{{#if @index}} , {{/if}}\n{\n  "myField123":"{{myField}}"\n}\n{{/each}}',
        ],
        batchSize: 1,
        ignoreEmptyNodes: false,
        requestMediaType: 'json',
        successMediaType: 'json',
        errorMediaType: 'json',
        formType: 'http',
        response: {
          errorPath: '',
        },
      },
      filter: {
        type: 'expression',
        expression: {
          version: '1',
        },
        version: '1',
      },
      settingsForm: {
        form: {
          fieldMap: {
            settingA: {
              id: 'settingA',
              name: 'settingA',
              type: 'text',
              helpText: 'Optional help for setting: settingA',
              label: 'boo',
              required: true,
            },
            settingB: {
              id: 'settingB',
              name: 'settingB',
              type: 'text',
              helpText: 'Optional help for setting: settingB',
              label: 'settingB',
              required: true,
            },
          },
          layout: {
            fields: [
              'settingA',
              'settingB',
            ],
          },
        },
      },
      settings: {
        settingA: 23,
        settingB: 'my value',
      },
      adaptorType: 'HTTPImport',
    },
  ],
};
