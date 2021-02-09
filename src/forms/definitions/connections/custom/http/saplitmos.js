import { getDomain } from '../../../../formFactory/utils';

export default {
  preSave: formValues => {
    const retValues = { ...formValues };
    const pingURI = `/users?source=${getDomain()}`;

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'saplitmos',
      '/http/auth/type': 'token',
      '/http/mediaType': 'json',
      '/http/ping/method': 'GET',
      '/http/baseURI': 'https://api.litmos.com/v1.svc',
      '/http/auth/token/location': 'header',
      '/http/auth/token/headerName': 'apikey',
      '/http/auth/token/scheme': ' ',
      '/http/ping/relativeURI': pingURI,
      '/http/concurrencyLevel': `${formValues['/http/concurrencyLevel']}` || 1,
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'API key',
      required: true,
      helpKey: 'saplitmos.connection.http.auth.token.token',
      description:
        'Note: for security reasons this field must always be re-entered.',
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
        fields: ['http.auth.token.token'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
