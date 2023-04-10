export default {
  preSave: (formValues, resp) => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'ebay-xml',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'xml',
    '/http/baseURI': `https://api${
      formValues['/environment'] === 'sandbox' ? '.sandbox' : ''
    }.ebay.com/ws/api.dll`,
    '/http/unencrypted/apiCompLevel': parseInt(
      (((resp || {}).http || {}).unencrypted || {}).apiCompLevel || '1005',
      10
    ),
    '/http/ping/successPath': '/*[local-name()="GetMyMessagesResponse"]/*[local-name()="Ack"]/text()',
    '/http/ping/successValues': ['Success'],
    '/http/ping/errorPath': '',
    '/http/ping/body':
    '<?xml version="1.0" encoding="utf-8"?>\n' +
    '<GetMyMessagesRequest xmlns="urn:ebay:apis:eBLBaseComponents">\n' +
      '<RequesterCredentials>\n' +
        '<eBayAuthToken>{{{connection.http.auth.token.token}}}</eBayAuthToken>\n' +
      '</RequesterCredentials>\n' +
      '<ErrorLanguage>en_US</ErrorLanguage>\n' +
      '<WarningLevel>High</WarningLevel>\n' +
      '<DetailLevel>ReturnHeaders</DetailLevel>\n' +
    '</GetMyMessagesRequest>',
    '/http/ping/method': 'POST',
    '/http/headers': [
      { name: 'X-EBAY-API-CALL-NAME', value: 'GetMyMessages' },
      { name: 'X-EBAY-API-SITEID', value: '{{{connection.http.unencrypted.apiSiteId}}}' },
      { name: 'X-EBAY-API-COMPATIBILITY-LEVEL', value: '{{{connection.http.unencrypted.apiCompLevel}}}' }],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    environment: {
      id: 'environment',
      type: 'select',
      label: 'Account type',
      helpKey: 'ebay-xml.connection.environment',
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
          if (baseUri.indexOf('sandbox') !== -1) {
            return 'sandbox';
          }

          return 'production';
        }

        return '';
      },
    },
    'http.unencrypted.apiSiteId': {
      id: 'http.unencrypted.apiSiteId',
      type: 'select',
      label: 'API site id',
      defaultValue: r =>
        (r && r.http && r.http.unencrypted && r.http.unencrypted.apiSiteId) ||
        '0',
      options: [
        {
          items: [
            { value: '16', label: 'eBay Austria - 16' },
            { value: '15', label: 'eBay Australia - 15' },
            { value: '193', label: 'eBay Switzerland - 193' },
            { value: '77', label: 'eBay Germany - 77' },
            { value: '2', label: 'eBay Canada (English) - 2' },
            { value: '186', label: 'eBay Spain - 186' },
            { value: '71', label: 'eBay France - 71' },
            { value: '23', label: 'eBay Belgium (French) - 23' },
            { value: '210', label: 'eBay Canada (French) - 210' },
            { value: '3', label: 'eBay UK - 3' },
            { value: '201', label: 'eBay Hong Kong - 201' },
            { value: '205', label: 'eBay Ireland - 205' },
            { value: '203', label: 'eBay India - 203' },
            { value: '101', label: 'eBay Italy - 101' },
            { value: '100', label: 'eBay Motors - 100' },
            { value: '207', label: 'eBay Malaysia - 207' },
            { value: '146', label: 'eBay Netherlands - 146' },
            { value: '123', label: 'eBay Belgium (Dutch) - 123' },
            { value: '211', label: 'eBay Philippines - 211' },
            { value: '212', label: 'eBay Poland - 212' },
            { value: '216', label: 'eBay Singapore - 216' },
            { value: '0', label: 'eBay United States - 0' },
          ],
        },
      ],
      required: true,
      description:
        'Note: for security reasons this field must always be re-entered',
    },
    'http._iClientId': {
      id: 'http._iClientId',
      resourceType: 'iClients',
      filter: { provider: 'ebay' },
      connType: 'ebay',
      label: 'iClient',
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      ignoreEnvironmentFilter: true,
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['environment',
          'http.unencrypted.apiSiteId',
          'http._iClientId'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
