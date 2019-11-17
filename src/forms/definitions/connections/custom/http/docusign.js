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
      label: 'Environment',
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Demo', value: 'demo' },
          ],
        },
      ],
      helpText:
        'Select either Production or Demo and then click Save & Authorize that opens up the DocuSign window where you can enter your DocuSign account email ID and password to establish the connection.',
      defaultValue: r => {
        const authUri = r && r.http && r.http.authURI;

        if (authUri) {
          if (authUri.indexOf('account-d.docusign.com') !== -1) {
            return 'demo';
          }
        }

        return 'production';
      },
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'environment'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
