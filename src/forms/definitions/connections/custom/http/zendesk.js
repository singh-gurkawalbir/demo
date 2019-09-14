export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'zendesk',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/method': 'GET',
    '/http/ping/relativeURI': '/api/v2/users.json',
    '/http/baseURI': `https://${formValues['/zendesk/subdomain']}.zendesk.com`,
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'zendesk.subdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.zendesk.com',
      label: 'Subdomain',
      helpText:
        'Please enter your team name here which you configured while signing up for a new Zendesk account.',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('.zendesk.com')
          );

        return subdomain;
      },
    },
    { fieldId: 'http.auth.basic.username' },
    {
      fieldId: 'http.auth.basic.password',
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
