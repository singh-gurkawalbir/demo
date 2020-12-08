import { isProduction } from '../../../../formFactory/utils';

export default {
  preSave: formValues => {
    const retValues = { ...formValues };
    let baseURI = '';

    if (retValues['/integrator/region'] === 'europe') {
      baseURI = 'https://api.eu.integrator.io';
      retValues['/integrator/environment'] = undefined;
    } else if (isProduction()) {
      baseURI = 'https://api.integrator.io';
    } else {
      baseURI = 'https://api.staging.integrator.io';
    }
    delete retValues['/integrator/environment'];
    delete retValues['/integrator/region'];
    // To do: remove headrs as after migration we will not have any headers in the connection doc.
    delete retValues['/http/headers'];
    retValues['/http/headers'] = undefined;

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'integratorio',
      '/http/auth/type': 'token',
      '/http/mediaType': 'json',
      '/http/ping/method': 'GET',
      '/http/baseURI': baseURI,
      '/http/ping/relativeURI': '/v1/connections',
      '/http/auth/token/location': 'header',
      '/http/auth/token/scheme': 'Bearer',
      '/http/auth/token/headerName': 'Authorization',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'integrator.region': {
      id: 'integrator.region',
      type: 'select',
      label: 'Region',
      helpKey: 'integratorio.connection.integrator.region',
      required: true,
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('eu') !== -1) {
            return 'europe';
          }

          return 'north_america';
        }
      },
      options: [
        {
          items: [
            {
              value: 'north_america',
              label: 'North America',
            },
            {
              value: 'europe',
              label: 'Europe',
            },
          ],
        },
      ],
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'Token',
      required: true,
      helpKey: 'integratorio.connection.http.auth.token.token',
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
        fields: ['integrator.region', 'http.auth.token.token'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
