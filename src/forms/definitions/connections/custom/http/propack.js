export default {
  preSave: formValues => {
    const date = new Date();
    const dateString = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split('T')[0];

    return {
      ...formValues,
      '/type': 'http',
      '/assistant': 'propack',
      '/http/auth/type': 'custom',
      '/http/mediaType': 'xml',
      '/http/baseURI': `${
        formValues['/environment'] === 'test'
          ? 'https://test.webservices.p3pl.com'
          : 'https://webservices.p3pl.com'
      }`,
      '/http/ping/relativeURI': '/WSOrderinfo.asmx',
      '/http/ping/successPath': `/*[local-name()='Envelope']/*[local-name()='Body']/*[local-name()='GetOrdersByDateRangeResponse']/*[local-name()='GetOrdersByDateRangeResult']/*[local-name()='Result']/text()`,
      '/http/ping/successValues': ['OK', 'Warning'],
      '/http/ping/errorPath': '',
      '/http/ping/body':
        `${'<?xml version="1.0" encoding="utf-8"?> ' +
          '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"> ' +
          '<soap12:Body> <GetOrdersByDateRange xmlns="http://p3pl.propack.com/"> ' +
          '<P3PLLogin>{{{connection.http.unencrypted.p3plUserID}}}</P3PLLogin> ' +
          '<P3PLPassword>{{{connection.http.encrypted.p3plUserPassword}}}</P3PLPassword> ' +
          '<FromDate>'}${dateString}</FromDate> ` +
        `<ToDate>${dateString}</ToDate> ` +
        `</GetOrdersByDateRange> ` +
        `</soap12:Body> ` +
        `</soap12:Envelope>`,
      '/http/ping/method': 'POST',
      '/http/headers': [
        { name: 'Content-Type', value: 'application/soap+xml' },
      ],
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    environment: {
      id: 'environment',
      type: 'select',
      label: 'Environment',
      helpText:
        'Please select your environment here. Select Test if the account is created on https://test.webservices.p3pl.com. Select Production if the account is created on https://webservices.p3pl.com.',
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Test', value: 'test' },
          ],
        },
      ],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('test') !== -1) {
            return 'test';
          }
        }

        return 'production';
      },
    },
    'http.unencrypted.p3plUserID': {
      id: 'http.unencrypted.p3plUserID',
      type: 'text',
      label: 'P3PL User ID',
      helpText: 'Please enter your P3PL account User ID.',
      required: true,
    },
    'http.encrypted.p3plUserPassword': {
      id: 'http.encrypted.p3plUserPassword',
      type: 'text',
      label: 'P3PL User Password',
      helpText: 'Please enter your P3PL account Password.',
      required: true,
      inputType: 'password',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'environment',
      'http.unencrypted.p3plUserID',
      'http.encrypted.p3plUserPassword',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
