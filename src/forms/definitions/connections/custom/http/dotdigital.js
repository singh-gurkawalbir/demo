export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'dotdigital',
    '/http/auth/type': 'basic',
    '/http/baseURI': `https://${formValues['/http/region']}-api.dotmailer.com`,
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v2/campaigns',
    '/http/ping/method': 'GET',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.region': {
      id: 'http.region',
      type: 'select',
      label: 'Region',
      options: [
        {
          items: [
            { label: 'Europe', value: 'r1' },
            { label: 'North America', value: 'r2' },
            { label: 'Asia Pacific', value: 'r3' },
          ],
        },
      ],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('r1') === -1) {
            return 'r1';
          }
          if (baseUri.indexOf('r2') === -1) {
            return 'r2';
          }
        }

        return 'r3';
      },
      helpKey: 'dotdigital.connection.http.region',
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpKey: 'dotdigital.connection.http.auth.basic.username',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpKey: 'dotdigital.connection.http.auth.basic.password',
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
        fields: ['http.region', 'http.auth.basic.username', 'http.auth.basic.password'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};

