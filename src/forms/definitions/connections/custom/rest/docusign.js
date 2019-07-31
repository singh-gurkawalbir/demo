export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'docusign',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://demo.docusign.net/restapi', // we need to set this due to a backend validation. And backend updates this after oauth completes.
    '/rest/authURI': `https://account${
      formValues['/environment'] === 'demo' ? '-d' : ''
    }.docusign.com/oauth/auth`,
    '/rest/oauthTokenURI': `https://account${
      formValues['/environment'] === 'demo' ? '-d' : ''
    }.docusign.com/oauth/token`,
    '/rest/unencrypted/version': 'v2',
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'environment',
      type: 'select',
      label: 'Environment:',
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
        const authUri = r && r.rest && r.rest.authURI;

        if (authUri) {
          if (authUri.indexOf('account-d.docusign.com') > -1) {
            return 'demo';
          }
        }

        return 'production';
      },
    },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
