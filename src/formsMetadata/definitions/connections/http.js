import {
  getFieldById,
  replaceField,
  defaultValueInitializer,
  defaultPatchSetConverter,
} from '../../utils';

const delimitedValueFields = [
  '/http/auth/failValues',
  '/http/rateLimit/failValues',
  '/http/ping/successValues',
];
const valueInitializer = resource => {
  const formValues = defaultValueInitializer(resource);

  delimitedValueFields.forEach(field => {
    const value = formValues[field];

    // console.log(formValues, 'values=', value);

    if (value) {
      formValues[field] = value.join(',');
    }
  });

  // console.log('custom value initializer', formValues);

  return formValues;
};

const fieldInitializer = (meta, resource) => {
  const newMeta = { ...meta };
  const uriFieldIds = ['PingRelativeURI', 'RefreshRelativeURI'];

  uriFieldIds.forEach(id => {
    const relativeUriField = getFieldById({ meta: newMeta, id });

    if (relativeUriField) {
      relativeUriField.connectionId = resource._id;
      replaceField({ meta: newMeta, field: relativeUriField });
    }
  });

  return newMeta;
};

export default {
  initializer: ({ resource, fieldMeta }) => ({
    formValues: valueInitializer(resource),
    fieldMeta: fieldInitializer(fieldMeta, resource),
  }),

  converter: formValues => {
    const normalizedFormValues = { ...formValues };

    delimitedValueFields.forEach(field => {
      const value = formValues[field];

      // console.log('values=', value);

      if (value) {
        normalizedFormValues[field] = value.split(',');
      }
    });

    const patchSet = defaultPatchSetConverter(normalizedFormValues);

    return patchSet;
  },

  fields: [
    // #region Main
    // name
    {
      id: 'Name',
      name: '/name',
      type: 'key',
      label: 'Name',
    },

    // description
    {
      id: 'description',
      name: '/description',
      type: 'textarea',
      label: 'Description',
      description: '',
      placeholder: '',
      defaultValue: '',
    },

    // baseURI
    {
      id: 'baseURI',
      name: '/http/baseURI',
      type: 'text',
      label: 'Base URI',
      description: '',
      placeholder: '',
      defaultValue: '',
      required: true,
    },

    // media type
    {
      id: 'mediaType',
      name: '/http/mediaType',
      type: 'select',
      label: 'Media Type',
      description: '',
      placeholder: '',
      defaultValue: '',
      options: [
        {
          items: [
            {
              label: 'JSON',
              value: 'json',
            },
            {
              label: 'XML',
              value: 'xml',
            },
          ],
        },
      ],
      visible: true,
      required: true,
    },

    // header
    {
      id: 'HttpHeader',
      name: '/http/headers',
      label: 'HTTP Headers',
      type: 'keyvalue',
      keyName: 'name',
      valueName: 'value',
      description:
        'If needed, add any custom headers this application requires.',
    },

    // #endregion
  ],
  fieldSets: [
    {
      header: 'Authentication',
      collapsed: false,
      fields: [
        // #region Auth
        // auth type
        {
          id: 'AuthenticationType',
          name: '/http/auth/type',
          type: 'select',
          label: 'Authentication Type',
          description: '',
          placeholder: '',
          defaultValue: '',
          options: [
            {
              items: [
                {
                  label: 'Custom',
                  value: 'custom',
                },
                {
                  label: 'Basic',
                  value: 'basic',
                },
                {
                  label: 'Token',
                  value: 'token',
                },
              ],
            },
          ],
          visible: true,
          required: false,
          disabled: false,
          visibleWhen: [],
          requiredWhen: [],
          disabledWhen: [],
          shouldMatchRegex: false,
          hasMinLength: false,
          hasMaxLength: false,
          hasNumericalRange: false,
          shouldCompareTo: false,
          omitWhenHidden: false,
          valueDelimiter: '',
          useChangesAsValues: false,
        },

        // auth fail code
        {
          id: 'AuthFailStatusCode',
          name: '/http/auth/failStatusCode',
          type: 'text',
          label: 'Authentication Fail Status Code',
          description: '',
          placeholder: 'optional',
          defaultValue: '',
        },

        // auth fail path
        {
          id: 'AuthenticationFailPath ',
          name: '/http/auth/failPath',
          type: 'text',
          label: 'Authentication Fail Path',
          description: '',
          placeholder: 'optional',
          defaultValue: '',
        },

        // auth fail values
        {
          id: 'AuthenticationFailValues',
          name: '/http/auth/failValues',
          type: 'text',
          label: 'Authentication Fail Values',
          description: 'Separate multiple values with commas.',
          placeholder: 'optional',
          defaultValue: '',
        },

        // unencrypted
        {
          id: 'Unencrypted',
          name: '/http/unencrypted',
          type: 'textarea',
          label: 'Unencrypted',
          description: 'Place any non sesitive connetion information here.',
          placeholder: '{"field": "value"}',
          defaultValue: '',
        },

        // encrypted
        {
          id: 'Encrypted',
          name: '/http/encrypted',
          type: 'textarea',
          label: 'Unencrypted',
          description: 'Place your sesitive connetion information here.',
          placeholder: '{"field": "value"}',
          defaultValue: '',
        },
        // #endregion
      ],
    },
    {
      header: 'Ping Configuration',
      collapsed: true,
      fields: [
        // #region PING
        // Ping Relative URI:
        {
          id: 'PingRelativeURI',
          name: '/http/ping/relativeURI',
          type: 'relativeuri',
          label: 'Relative URI',
          description: '',
          placeholder: 'optional',
          defaultValue: '',
        },

        // Ping Method:
        {
          id: 'PingMethod',
          name: '/http/ping/method',
          type: 'select',
          label: 'Ping Method',
          description: '',
          options: [
            {
              items: ['GET', 'PUT', 'POST'],
            },
          ],
          defaultValue: '',
        },

        // Ping Success Path:
        {
          id: 'PingSuccessPath',
          name: '/http/ping/successPath',
          type: 'text',
          label: 'Success Path',
          description: '',
          placeholder: 'optional',
          defaultValue: '',
        },

        // Ping Success Values:
        {
          id: 'PingSuccessValues',
          name: '/http/ping/successValues',
          type: 'text',
          label: 'Success Values',
          description: '',
          placeholder: 'optional',
          defaultValue: '',
        },

        // Ping Error Path
        {
          id: 'PingErrorPath',
          name: '/http/ping/errorPath',
          type: 'text',
          label: 'Error Path',
          description: '',
          placeholder: 'optional',
          defaultValue: '',
        },
        // #endregion
      ],
    },
    {
      header: 'API Rate Limits Configuration (optional)',
      collapsed: true,
      fields: [
        // #region API Rate Limits
        // Limit
        {
          id: 'Limit',
          name: '/http/rateLimit/limit',
          type: 'text',
          label: 'Limit',
          description: '',
          placeholder: 'optional',
          defaultValue: '',
        },

        // Fail Status Code:
        {
          id: 'LimitStatusCode',
          name: '/http/rateLimit/failStatusCode',
          type: 'text',
          label: 'Fail Status Code',
          description: '',
          placeholder: 'optional',
          defaultValue: '',
        },

        // Fail Path:
        {
          id: 'RateLimitFailPath',
          name: '/http/rateLimit/failPath',
          type: 'text',
          label: 'Fail Path',
          description: '',
          placeholder: 'optional',
          defaultValue: '',
        },

        // Fail Values:
        {
          id: 'RateLimitFailValues',
          name: '/http/rateLimit/failValues',
          type: 'text',
          label: 'Fail Values',
          description: '',
          placeholder: 'optional',
          defaultValue: '',
        },

        // Retry Header:
        {
          id: 'LimitRetryHeader',
          name: '/http/rateLimit/retryHeader',
          type: 'text',
          label: 'Retry Header',
          description: '',
          placeholder: 'optional',
          defaultValue: '',
        },
        // #endregion
      ],
    },
    {
      header: 'Refresh Token Configuration (optional)',
      collapsed: true,
      fields: [
        // #region Refresh Token
        // RefreshToken
        {
          id: 'RefreshToken',
          name: '/http/auth/token/refreshToken',
          helpKey: 'connection.http.auth.token.refreshToken',
          type: 'text',
          label: 'Refresh Token',
        },

        // RefreshRelativeURI:
        {
          id: 'RefreshRelativeURI',
          name: '/http/auth/token/refreshRelativeURI',
          helpKey: 'connection.http.auth.token.refreshRelativeURI',
          type: 'relativeuri',
          label: 'Relative URI',
        },

        // RefreshMediaType:
        {
          id: 'RefreshMediaType',
          name: '/http/auth/token/refreshMediaType',
          helpKey: 'connection.http.auth.token.refreshMediaType',
          type: 'select',
          options: [
            {
              items: ['XML', 'JSON'],
            },
          ],
          label: 'Media type',
          defaultValue: '',
        },

        // RefreshMethod:
        {
          id: 'RefreshMethod',
          name: '/http/auth/token/refreshMethod',
          helpKey: 'connection.http.auth.token.refreshMethod',
          type: 'select',
          options: [
            {
              items: ['GET', 'PUT', 'POST'],
            },
          ],
          label: 'HTTP method',
          defaultValue: '',
        },

        // RefreshBody
        {
          id: 'RefreshBody',
          name: '/http/auth/token/refreshBody',
          helpKey: 'connection.http.auth.token.refreshBody',
          type: 'textarea',
          label: 'HTTP body',
        },
        // RefreshTokenPath:
        {
          id: 'RefreshTokenPath',
          name: '/http/auth/token/refreshTokenPath',
          helpKey: 'connection.http.auth.token.refreshTokenPath',
          type: 'text',
          label: 'Token Path',
        },
        // #endregion
      ],
    },
  ],
};
