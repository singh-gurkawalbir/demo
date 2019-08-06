export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'github',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://api.github.com',
    '/rest/authURI': 'http://github.com/login/oauth/authorize',
    '/rest/oauthTokenURI': 'https://github.com/login/oauth/access_token',
    '/rest/scopeDelimiter': ' ',
    '/rest/headers': [{ name: 'User-Agent', value: 'Awesome-Octocat-App' }],
  }),

  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.scope',
      scopes: [
        'user',
        'user:email',
        'user:follow',
        'public_repo',
        'repo',
        'repo_deployment',
        'repo:status',
        'repo:invite',
        'delete_repo',
        'notifications',
        'gist',
        'read:repo_hook',
        'write:repo_hook',
        'admin:repo_hook',
        'read:org',
        'write:org',
        'admin:org',
        'read:public_key',
        'write:public_key',
        'admin:public_key',
        'read:gpg_key',
        'write:gpg_key',
        'admin:gpg_key',
      ],
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'restAdvanced' }],
    },
  ],
};
