export default {
  preSubmit: formValues => {
    const pingBody = {
      authenticateTestRequest: {
        merchantAuthentication: {
          name: `${formValues['/http/encrypted/apiLoginID']}`,
          transactionKey: `${formValues['/http/encrypted/transactionKey']}`,
        },
      },
    };

    return {
      ...formValues,
      '/type': 'http',
      '/assistant': 'ebay-xml',
      '/http/auth/type': 'custom',
      '/http/mediaType': 'xml',
      '/http/baseURI': `https://api${
        formValues['/environment'] === 'sandbox' ? '.sandbox' : ''
      }.ebay.com/ws/api.dll`,
      '/http/ping/relativeURI': '/xml/v1/request.api',
      '/http/ping/successPath': 'messages.resultCode',
      '/http/ping/successValues': ['Ok'],
      '/http/ping/body': JSON.stringify(pingBody),
      '/http/ping/method': 'POST',
    };
  },
  fields: [
    { fieldId: 'name' },

    {
      id: 'environment',
      type: 'select',
      label: 'Account Type',
      helpText: 'Select either Production or Sandbox.',
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Sandbox', value: 'sandbox' },
          ],
        },
      ],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('sandbox') === -1) {
            return 'sandbox';
          }

          return 'production';
        }

        return '';
      },
    },
    {
      id: 'http.unencrypted.apiSiteId',
      type: 'text',
      label: 'API Site ID',
      defaultValue: r =>
        (r && r.http && r.http.unencrypted && r.http.unencrypted.apiSiteId) ||
        '0',
      options: [
        {
          items: [
            {
              value: '16',
              label: 'eBay Austria - 16',
            },
            {
              value: '15',
              label: 'eBay Australia - 15',
            },
            {
              value: '193',
              label: 'eBay Switzerland - 193',
            },
            {
              value: '77',
              label: 'eBay Germany - 77',
            },
            {
              value: '2',
              label: 'eBay Canada (English) - 2',
            },
            {
              value: '186',
              label: 'eBay Spain - 186',
            },
            {
              value: '71',
              label: 'eBay France - 71',
            },
            {
              value: '23',
              label: 'eBay Belgium (French) - 23',
            },
            {
              value: '210',
              label: 'eBay Canada (French) - 210',
            },
            {
              value: '3',
              label: 'eBay UK - 3',
            },
            {
              value: '201',
              label: 'eBay Hong Kong - 201',
            },
            {
              value: '205',
              label: 'eBay Ireland - 205',
            },
            {
              value: '203',
              label: 'eBay India - 203',
            },
            {
              value: '101',
              label: 'eBay Italy - 101',
            },
            {
              value: '100',
              label: 'eBay Motors - 100',
            },
            {
              value: '207',
              label: 'eBay Malaysia - 207',
            },
            {
              value: '146',
              label: 'eBay Netherlands - 146',
            },
            {
              value: '123',
              label: 'eBay Belgium (Dutch) - 123',
            },
            {
              value: '211',
              label: 'eBay Philippines - 211',
            },
            {
              value: '212',
              label: 'eBay Poland - 212',
            },
            {
              value: '216',
              label: 'eBay Singapore - 216',
            },
            {
              value: '0',
              label: 'eBay United States - 0',
            },
          ],
        },
      ],
      helpText:
        'After you have specified the API Site ID, click Save & Authorize that opens up the eBay window where you can enter email/username and password to establish the connection with eBay.',
      required: true,
      inputType: 'password',
      description:
        'Note: for security reasons this field must always be re-entered',
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
