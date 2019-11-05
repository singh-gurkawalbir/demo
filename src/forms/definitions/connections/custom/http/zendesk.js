export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/http/auth/type'] === 'token') {
      retValues['/http/auth/basic/password'] = retValues['/http/apiToken'];
      retValues['/http/auth/basic/username'] = `${
        retValues['/http/auth/basic/username']
      }/token`;
      retValues['/http/auth/type'] = 'basic';
    } else {
      retValues['/http/apiToken'] = undefined;
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'zendesk',
      '/http/mediaType': 'json',
      '/http/ping/method': 'GET',
      '/http/ping/relativeURI': '/api/v2/users.json',
      '/http/baseURI': `https://${
        formValues['/http/zendeskSubdomain']
      }.zendesk.com`,
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.type': {
      id: 'http.auth.type',
      required: true,
      type: 'select',
      label: 'Authentication Type',
      helpText: 'Please select Authentication Type',
      defaultValue: r =>
        r &&
        r.http &&
        r.http.auth &&
        r.http.auth.basic &&
        r.http.auth.basic.username &&
        r.http.auth.basic.username.indexOf('/token') !== -1
          ? 'token'
          : 'basic',
      options: [
        {
          items: [
            { label: 'Basic', value: 'basic' },
            { label: 'Token', value: 'token' },
          ],
        },
      ],
    },
    'http.zendeskSubdomain': {
      id: 'http.zendeskSubdomain',
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
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      defaultValue: r => {
        if (
          r &&
          r.http &&
          r.http.auth &&
          r.http.auth.basic &&
          r.http.auth.basic.username
        ) {
          if (r.http.auth.basic.username.indexOf('/token') !== -1)
            return r.http.auth.basic.username.replace('/token', '');

          return r.http.auth.basic.username;
        }

        return '';
      },
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      visibleWhen: [{ field: 'http.auth.type', is: ['basic'] }],
    },
    'http.apiToken': {
      id: 'http.apiToken',
      required: true,
      type: 'text',
      label: 'API Token',
      helpText:
        'API tokens are managed in the Support admin interface at Admin > Channels > API',
      visibleWhen: [{ field: 'http.auth.type', is: ['token'] }],
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.auth.type',
      'http.zendeskSubdomain',
      'http.auth.basic.username',
      'http.auth.basic.password',
      'http.apiToken',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
