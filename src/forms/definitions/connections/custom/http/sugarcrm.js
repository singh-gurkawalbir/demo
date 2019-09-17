export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'sugarcrm',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${formValues['/sugarcrmSubdomain']}/rest/${
      formValues['/http/unencrypted/version']
    }`,
    '/http/ping/method': 'GET',
    '/http/ping/relativeURI': '/Activities',
    '/http/auth/token/refreshMediaType': 'json',
    '/http/auth/token/refreshRelativeURI': `${
      formValues['/http/baseURI']
    }/oauth2/token`,
    '/http/auth/token/refreshBody':
      '{"grant_type":"password","client_id":"{{{connection.http.unencrypted.clientID}}}","client_secret":"","username":"{{{connection.http.unencrypted.username}}}","password":"{{{connection.http.unencrypted.password}}}","platform":"base"}',
    '/http/auth/token/refreshMethod': 'POST',
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'sugarcrmSubdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '/rest',
      label: 'Subdomain',
      helpText:
        'Please enter your SugarCRM subdomain. For example, in https://jpeyoy4394.trial.sugarcrm.eu/http/v11_2/ "jpeyoy4394.trial.sugarcrm.eu" is the subdomain.',
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
            baseUri.indexOf('/rest')
          );

        return subdomain;
      },
    },
    {
      id: 'http.unencrypted.grantType',
      required: true,
      type: 'select',
      label: 'Grant Type',
      options: [
        {
          items: [
            { label: 'Password', value: 'password' },
            { label: 'Refresh Token', value: 'refresh_token' },
          ],
        },
      ],
      helpText:
        'Please select type of request. Available grant types are "password" and "refresh_token".',
    },
    {
      id: 'http.unencrypted.version',
      required: true,
      type: 'text',
      label: 'Version',
      helpText: 'Please enter endpoint version of your SugarCRM account.',
    },
    {
      id: 'http.unencrypted.clientID',
      required: true,
      type: 'text',
      label: 'Client ID',
      helpText: `The client_id of "sugar" will automatically create an OAuth Key in the system and can be used for "password" authentication. The client_id of "support_portal" will create an OAuth Key if the portal system is enabled and will allow for portal authentication. Other client_id 's can be created by the administrator in the OAuthKeys section in the Administration section and can be used in the future for additional grant types,if the client secret is filled in, it will be checked to validate the use of the client id.`,
    },
    {
      id: 'http.unencrypted.platform',
      required: true,
      type: 'text',
      label: 'Platform',
      helpText:
        'Defaults to "base" allows you to have custom meta-data per platform. If using a value other than "base", you should make sure it is registered using the Platform extension or configure an API platform in Administration panel.',
    },
    {
      fieldId: 'http.unencrypted.username',
      type: 'text',
      label: 'Username',
      required: true,
    },
    {
      fieldId: 'http.encrypted.password',
      type: 'text',
      label: 'Password',
      inputType: 'password',
      defaultValue: '',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
    {
      id: 'http.encrypted.clientSecret',
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      label: 'Client Secret',
      placeholder: 'Optional if Client Secret is empty',
      helpText:
        'Defaults to "base" allows you to have custom meta-data per platform. If using a value other than "base", you should make sure it is registered using the Platform extension or configure an API platform in Administration panel.',
    },
    {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        {
          field: 'http.unencrypted.username',
          is: [''],
        },
        {
          field: 'http.encrypted.password',
          is: [''],
        },
      ],
      label: 'Token Generator',
      defaultValue: '',
      helpText: 'The access token of your Tableau account.',
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
