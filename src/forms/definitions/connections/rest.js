export default {
  preSubmit: formValues => {
    const newValues = Object.assign({}, formValues);

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
      newValues['/rest/basicAuth/username'] = undefined;
      newValues['/rest/basicAuth/password'] = undefined;
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
    }

    if (newValues['/rest/authType'] !== 'cookie') {
      if (newValues['/rest/cookieAuth/method'] === 'GET') {
        newValues['/rest/cookieAuth/body'] = undefined;
      }
    }

    return newValues;
  },
  fields: [
    { fieldId: 'type' },
    { fieldId: 'name' },

    { fieldId: 'rest.authType', required: true },
    {
      fieldId: 'rest.headers',
      visibleWhenAll: [
        {
          field: 'rest.authType',
          isNot: [''],
        },
      ],
    },
    {
      fieldId: 'rest.baseURI',
      required: true,
      visibleWhenAll: [
        {
          field: 'rest.authType',
          isNot: [''],
        },
      ],
    },
    {
      fieldId: 'rest.mediaType',
      required: true,
      visibleWhenAll: [
        {
          field: 'rest.authType',
          isNot: [''],
        },
      ],
    },

    {
      fieldId: 'rest.encrypted',
      visibleWhenAll: [
        {
          field: 'rest.authType',
          is: ['custom'],
        },
        {
          field: 'rest.authType',
          isNot: [''],
        },
      ],
      defaultValue: '{"field": "value"}',
    },
    {
      fieldId: 'rest.unencrypted',
      visibleWhenAll: [
        {
          field: 'rest.authType',
          is: ['custom'],
        },
        {
          field: 'rest.authType',
          isNot: [''],
        },
      ],
      defaultValue: r =>
        r && r.rest && r.rest.unencrypted && JSON.stringify(r.rest.unencrypted),
    },
    {
      formId: 'restBasic',
      visibleWhenAll: [
        {
          field: 'rest.authType',
          is: ['basic'],
        },
      ],
    },
    {
      formId: 'restToken',
      visibleWhenAll: [
        {
          field: 'rest.authType',
          is: ['token'],
        },
      ],
    },
    {
      formId: 'restCookie',
      visibleWhenAll: [
        {
          field: 'rest.authType',
          is: ['cookie'],
        },
      ],
    },
  ],
  fieldSets: [
    {
      header: 'How to test connection?',
      collapsed: false,
      fields: [
        { fieldId: 'rest.pingMethod' },
        {
          fieldId: 'rest.pingBody',
          visibleWhenAll: [
            {
              field: 'rest.pingMethod',
              is: ['POST'],
            },
          ],
        },
        { fieldId: 'rest.pingRelativeURI' },
        { fieldId: 'rest.pingSuccessPath' },
        { fieldId: 'rest.pingSuccessValues' },
      ],
    },
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'restAdvanced' }],
    },
  ],
};
