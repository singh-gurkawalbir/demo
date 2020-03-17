import { isProduction } from '../../../../utils';

export default {
  preSave: formValues => {
    const retValues = { ...formValues };
    let pingURI = '';

    if (isProduction()) {
      pingURI = '/users?source=integrator.io';
    } else {
      pingURI = '/users?source=staging.integrator.io';
    }

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
      label: 'API Key',
      required: true,
      helpText:
        'Please enter API Key of your SAP Litmos Account.Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your user secret safe.Steps to generate API Key: Login to SAP Litmos Account -- > Click "My Profile & Settings" from the drop-down menu at the top right corner of the screen -- > View the bottom of your profile.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.auth.token.token'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
