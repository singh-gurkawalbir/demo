import { isNewId } from '../../../utils/resource';

const restPreSave = formValues => {
  const newValues = { ...formValues };

  const restToHttpFieldMap = {
    '/rest/headers': '/http/headers',
    '/rest/baseURI': '/http/baseURI',
    '/rest/encrypted': '/http/encrypted',
    '/rest/unencrypted': '/http/unencrypted',
    '/rest/disableStrictSSL': '/http/disableStrictSSL',
    '/rest/pingBody': '/http/ping/body',
    '/rest/pingRelativeURI': '/http/ping/relativeURI',
    '/rest/pingSuccessPath': '/http/ping/successPath',
    '/rest/pingSuccessValues': '/http/ping/successValues',
    '/rest/basicAuth/username': '/http/auth/basic/username',
    '/rest/basicAuth/password': '/http/auth/basic/password',
    '/rest/cookieAuth/method': '/http/auth/cookie/method',
    '/rest/cookieAuth/uri': '/http/auth/cookie/uri',
    '/rest/cookieAuth/body': '/http/auth/cookie/body',
    '/rest/cookieAuth/successStatusCode': '/http/auth/cookie/successStatusCode',
    '/rest/refreshTokenMethod': '/http/auth/token/refreshMethod',
    '/rest/refreshTokenHeaders': '/http/auth/token/refreshHeaders',
    '/rest/refreshTokenBody': '/http/auth/token/refreshBody',
    '/rest/refreshTokenURI': '/http/auth/token/refreshRelativeURI',
    '/rest/refreshTokenPath': '/http/auth/token/refreshTokenPath',
    '/rest/bearerToken': '/http/auth/token/token',
    '/rest/tokenHeader': '/http/auth/token/headerName',
    '/rest/tokenParam': '/http/auth/token/paramName',

  };

  Object.keys(restToHttpFieldMap).forEach(restField => {
    const httpField = restToHttpFieldMap[restField];

    if (newValues[httpField]) {
      newValues[restField] = newValues[httpField];
    } else {
      newValues[restField] = undefined;
    }
    delete newValues[httpField];
  });

  if (newValues['/mode'] === 'cloud') {
    newValues['/_agentId'] = undefined;
  }
  delete newValues['/mode'];

  if (!newValues['/rest/pingSuccessPath']) {
    newValues['/rest/pingSuccessValues'] = undefined;
  }

  if (newValues['/rest/pingMethod'] === 'GET') {
    newValues['/rest/pingBody'] = undefined;
  }

  if (newValues['/rest/encrypted']) {
    try {
      newValues['/rest/encrypted'] = JSON.parse(newValues['/rest/encrypted']);
    } catch (ex) {
      newValues['/rest/encrypted'] = undefined;
    }
  }

  if (newValues['/rest/unencrypted']) {
    try {
      newValues['/rest/unencrypted'] = JSON.parse(
        newValues['/rest/unencrypted']
      );
    } catch (ex) {
      newValues['/rest/unencrypted'] = undefined;
    }
  }

  if (newValues['/rest/authType'] !== 'basic') {
    delete newValues['/rest/basicAuth/username'];
    delete newValues['/rest/basicAuth/password'];
    newValues['/rest/basicAuth'] = undefined;
  }

  if (
    newValues['/rest/authType'] !== 'token' ||
    !formValues['/configureTokenRefresh']
  ) {
    newValues['/rest/refreshTokenMediaType'] = undefined;
    newValues['/rest/refreshTokenPath'] = undefined;
    newValues['/rest/refreshTokenHeaders'] = undefined;
    newValues['/rest/refreshTokenMethod'] = undefined;
    newValues['/rest/refreshTokenBody'] = undefined;
    newValues['/rest/refreshTokenURI'] = undefined;
    // newValues['/rest/auth/token/refreshMediaType'] = undefined;
  }

  if (newValues['/rest/authType'] !== 'token') {
    newValues['/rest/bearerToken'] = undefined;
    newValues['/rest/authScheme'] = undefined;
    newValues['/rest/authHeader'] = undefined;
    newValues['/rest/tokenLocation'] = undefined;
    newValues['/rest/tokenParam'] = undefined;
  }

  if (newValues['/rest/authType'] !== 'cookie') {
    if (newValues['/rest/cookieAuth/method'] === 'GET') {
      newValues['/rest/cookieAuth/body'] = undefined;
    }
  }

  return newValues;
};

export default {
  preSave: (formValues, resource) => {
    // Save it as REST connection for edit cases, converting to http will delete rest doc completely.
    if (resource?.type === 'rest' && resource._id && !isNewId(resource._id)) {
      return restPreSave(formValues);
    }
    const newValues = { ...formValues };

    newValues['/http/useRestForm'] = true;
    if (newValues['/mode'] === 'cloud') {
      newValues['/_agentId'] = undefined;
    }
    delete newValues['/mode'];

    if (!newValues['/http/ping/successPath']) {
      newValues['/http/ping/successValues'] = undefined;
    }

    newValues['/http/auth/type'] = newValues['/rest/authType'];
    delete newValues['/rest/authType'];
    newValues['/http/auth/token/scheme'] = newValues['/rest/authScheme'];
    delete newValues['/rest/authScheme'];
    newValues['/http/auth/token/location'] = newValues['/rest/tokenLocation'];
    delete newValues['/rest/tokenLocation'];
    newValues['/http/auth/token/refreshMediaType'] = newValues['/rest/refreshTokenMediaType'];
    delete newValues['/rest/refreshTokenMediaType'];

    newValues['/http/mediaType'] = newValues['/rest/mediaType'] === 'urlencoded' ? 'urlencoded' : 'json';
    if (newValues['/rest/mediaType'] === 'csv') {
      newValues['/http/successMediaType'] = 'csv';
    } else {
      newValues['/http/successMediaType'] = undefined;
    }
    delete newValues['/rest/mediaType'];

    newValues['/http/ping/method'] = newValues['/rest/pingMethod'];
    delete newValues['/rest/pingMethod'];

    if (newValues['/http/ping/method'] === 'GET') {
      newValues['/http/ping/body'] = undefined;
    }

    if (newValues['/http/encrypted']) {
      try {
        newValues['/http/encrypted'] = JSON.parse(newValues['/http/encrypted']);
      } catch (ex) {
        newValues['/http/encrypted'] = undefined;
      }
    }

    if (newValues['/http/unencrypted']) {
      try {
        newValues['/http/unencrypted'] = JSON.parse(
          newValues['/http/unencrypted']
        );
      } catch (ex) {
        newValues['/http/unencrypted'] = undefined;
      }
    }

    if (newValues['/http/auth/type'] !== 'basic') {
      delete newValues['/http/auth/basic/username'];
      delete newValues['/http/auth/basic/password'];
      newValues['/http/auth/basic'] = undefined;
    }

    if (
      newValues['/http/auth/type'] !== 'token' ||
      !formValues['/configureTokenRefresh']
    ) {
      delete newValues['/http/auth/token/refreshMethod'];
      delete newValues['/http/auth/token/refreshTokenPath'];
      delete newValues['/http/auth/token/refreshToken'];
      delete newValues['/http/auth/token/refreshHeaders'];
      delete newValues['/http/auth/token/refreshBody'];
      delete newValues['/http/auth/token/refreshRelativeURI'];
      delete newValues['/http/auth/token/refreshMediaType'];
    }

    if (newValues['/http/auth/type'] !== 'token') {
      newValues['/http/auth/token'] = undefined;
      delete newValues['/http/auth/token/token'];
      delete newValues['/http/auth/token/scheme'];
      delete newValues['/http/auth/token/headerName'];
      delete newValues['/http/auth/token/location'];
      delete newValues['/http/auth/token/paramName'];
    }

    if (newValues['/http/auth/type'] !== 'cookie') {
      if (newValues['/http/auth/cookie/method'] === 'GET') {
        delete newValues['/http/auth/cookie/body'];
      }

      delete newValues['/http/auth/cookie/method'];
      delete newValues['/http/auth/cookie/uri'];
    }

    /* rest to http conversion util */

    if (newValues['/http/ping/relativeURI'] && !newValues['/http/ping/method']) {
      newValues['/http/ping/method'] = 'GET';
    }
    if (!newValues['/http/auth/type']) {
      newValues['/http/auth/type'] = 'token';
    }
    if (newValues['/http/auth/type'] === 'token' || newValues['/http/auth/type'] === 'oauth') {
      newValues['/http/auth/token/refreshMethod'] = newValues['/http/auth/token/refreshMethod'] || 'POST';
    }
    if (newValues['/http/ping/successPath'] && !newValues['/http/ping/successValues']) {
      newValues['/http/ping/allowArrayforSuccessPath'] = true;
    }
    newValues['/type'] = 'http';

    /* end */
    delete newValues['/rest'];

    return newValues;
  },
  fieldMap: {
    name: { fieldId: 'name' },
    mode: {
      id: 'mode',
      type: 'radiogroup',
      label: 'Mode',
      defaultValue: r => (r && r._agentId ? 'onpremise' : 'cloud'),
      options: [
        {
          items: [
            { label: 'Cloud', value: 'cloud' },
            { label: 'On-premise', value: 'onpremise' },
          ],
        },
      ],
    },
    _agentId: {
      fieldId: '_agentId',
      visibleWhen: [{ field: 'mode', is: ['onpremise'] }],
    },
    'rest.authType': {
      fieldId: 'rest.authType',
      required: true,
      defaultValue: r => r?.http?.auth?.type,
    },
    'http.headers': {
      fieldId: 'http.headers',
    },
    'http.baseURI': {
      fieldId: 'http.baseURI',
      required: true,
    },
    'rest.mediaType': {
      fieldId: 'rest.mediaType',
      required: true,
      defaultValue: r => r?.http?.successMediaType === 'csv' ? 'csv' : (r?.http?.mediaType || 'json'),
    },
    'http.encrypted': {
      fieldId: 'http.encrypted',
      label: 'Custom encrypted fields',
      helpKey: 'connection.http.encrypted',
      visibleWhenAll: [
        { field: 'rest.authType', is: ['custom'] },
        { field: 'rest.authType', isNot: [''] },
      ],
      defaultValue: r => isNewId(r._id) ? '{"field": "value"}' : '',
    },
    'http.unencrypted': {
      fieldId: 'http.unencrypted',
      label: 'Custom unencrypted fields',
      helpKey: 'connection.http.unencrypted',
      visibleWhenAll: [
        { field: 'rest.authType', is: ['custom'] },
        { field: 'rest.authType', isNot: [''] },
      ],
      defaultValue: r =>
        (r?.http?.unencrypted && JSON.stringify(r.http.unencrypted)) || '{"field": "value"}',
    },
    restBasic: {
      formId: 'restBasic',
      visibleWhenAll: [{ field: 'rest.authType', is: ['basic'] }],
    },
    'http.disableStrictSSL': { fieldId: 'http.disableStrictSSL' },
    restToken: {
      formId: 'restToken',
      visibleWhenAll: [
        { field: 'rest.authType', is: ['token'] },
      ],
    },
    restRefreshToken: {
      formId: 'restRefreshToken',
      visibleWhenAll: [
        { field: 'rest.authType', is: ['token'] },
        { field: 'rest.tokenLocation', isNot: [''] },
        { field: 'configureTokenRefresh', is: [true] },
      ],
    },
    restCookie: {
      formId: 'restCookie',
      visibleWhenAll: [
        { field: 'rest.authType', is: ['cookie'] },
        { field: 'rest.authType', isNot: [''] },
      ],
    },
    'rest.pingMethod': {
      fieldId: 'rest.pingMethod',
      defaultValue: r => r?.http?.ping?.method,
    },
    'http.ping.body': {
      fieldId: 'http.ping.body',
      visibleWhenAll: [{ field: 'rest.pingMethod', is: ['POST'] }],
    },
    'http.ping.relativeURI': { fieldId: 'http.ping.relativeURI' },
    'http.ping.successPath': { fieldId: 'http.ping.successPath' },
    'http.ping.successValues': { fieldId: 'http.ping.successValues' },
    restAdvanced: { formId: 'restAdvanced' },
    application: {
      fieldId: 'application',
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: [
          'name',
          'application',
          'mode',
          '_agentId',
        ],
      },
      {
        collapsed: true,
        label: 'Application details',
        fields: [
          'http.baseURI',
          'http.headers',
          'rest.mediaType',
        ],
      },
      {
        collapsed: true,
        label: 'Configure authentication',
        fields: ['rest.authType'],
        type: 'collapse',
        containers: [
          {
            collapsed: true,
            label: 'Configure basic auth',
            fields: [
              'restBasic',
            ],
          },
          {
            collapsed: true,
            label: 'Configure cookie auth',
            fields: [
              'restCookie',
            ],
          },
          {
            collapsed: false,
            label: 'Configure custom auth',
            fields: [
              'http.encrypted',
              'http.unencrypted',
            ],
          },
          {
            collapsed: true,
            label: 'Configure token auth',
            fields: [
              'restToken',
            ],
          },
          {
            collapsed: true,
            label: 'Configure refresh token',
            fields: ['restRefreshToken'],
          },
        ],
      },
      {
        collapsed: true,
        label: 'How to test this connection?',
        fields: [
          'rest.pingMethod',
          'http.ping.relativeURI',
          'http.ping.body',
          'http.ping.successPath',
          'http.ping.successValues',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['http.disableStrictSSL', 'restAdvanced'],
      },
    ],
  },
};
