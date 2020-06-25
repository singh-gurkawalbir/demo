export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'docusign',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/baseURI': 'https://demo.docusign.net/restapi', // we need to set this due to a backend validation. And backend updates this after oauth completes.
    '/http/auth/oauth/authURI': `https://account${
      formValues['/environment'] === 'demo' ? '-d' : ''
    }.docusign.com/oauth/auth`,
    '/http/auth/oauth/tokenURI': `https://account${
      formValues['/environment'] === 'demo' ? '-d' : ''
    }.docusign.com/oauth/token`,
    '/http/unencrypted/version': 'v2',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    environment: {
      id: 'environment',
      type: 'select',
      required: true,
      label: 'Environment',
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Demo', value: 'demo' },
          ],
        },
      ],
      helpKey: 'docusign.connection.environment',
      defaultValue: r => {
        const authUri =
          r &&
          r.http &&
          r.http.auth &&
          r.http.auth.oauth &&
          r.http.auth.oauth.authURI;

        if (authUri) {
          if (authUri.indexOf('account-d.docusign.com') !== -1) {
            return 'demo';
          }
        }

        return 'production';
      },
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
        fields: ['environment'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
