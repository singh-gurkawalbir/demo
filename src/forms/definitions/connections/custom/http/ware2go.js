export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/http/platformversion'] === 'platform2') {
      retValues['/http/auth/basic/username'] = retValues['/http/unencrypted/username'];
      retValues['/http/auth/basic/password'] = retValues['/http/encrypted/password'];
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'ware2go',
      '/http/auth/type': 'basic',
      '/http/mediaType': 'json',
      '/http/baseURI': `https://openapi${
        formValues['/http/platformversion'] === 'platform1' ? `${
          formValues['/http/accountType'] === 'staging'
            ? '.staging.ware2goproject.com'
            : '.ware2go.co'
        }/ware2go` : `${
          formValues['/http/accountType'] === 'staging'
            ? '.staging.tryware2go.com'
            : '.ware2go.io'
        }`}`,
      '/http/ping/relativeURI': `/v1/merchants/${
        formValues['/http/unencrypted/merchantId']
      }/inventory`,
      '/http/ping/method': 'GET',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.platformversion': {
      id: 'http.platformversion',
      type: 'select',
      label: 'Platform version',
      // helpKey: 'ware2go.connection.http.accountType',
      options: [
        {
          items: [
            { label: 'Platform 1', value: 'platform1' },
            { label: 'Platform 2', value: 'platform2' },
          ],
        },
      ],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('/ware2go') !== -1) {
            return 'platform1';
          }
        }

        return 'platform2';
      },
    },
    'http.accountType': {
      id: 'http.accountType',
      type: 'select',
      label: 'Account type',
      helpKey: 'ware2go.connection.http.accountType',
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Staging', value: 'staging' },
          ],
        },
      ],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('staging') !== -1) {
            return 'staging';
          }
        }

        return 'production';
      },
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      label: 'Access token',
      helpKey: 'ware2go.connection.http.auth.basic.username',
      visibleWhen: [{ field: 'http.platformversion', is: ['platform1'] }],
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpKey: 'ware2go.connection.http.auth.basic.password',
      label: 'Access secret',
      visibleWhen: [{ field: 'http.platformversion', is: ['platform1'] }],
    },
    'http.unencrypted.merchantId': {
      id: 'http.unencrypted.merchantId',
      helpKey: 'ware2go.connection.http.unencrypted.merchantId',
      label: 'Merchant id',
      required: true,
      type: 'text',
    },
    'http.unencrypted.username': {
      id: 'http.unencrypted.username',
      helpKey: 'ware2go.connection.http.unencrypted.username',
      label: 'Username',
      required: true,
      type: 'text',
      visibleWhen: [{ field: 'http.platformversion', is: ['platform2'] }],
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      helpKey: 'ware2go.connection.http.unencrypted.password',
      label: 'Password',
      required: true,
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      visibleWhen: [{ field: 'http.platformversion', is: ['platform2'] }],
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
        fields: [
          'http.platformversion',
          'http.accountType',
          'http.auth.basic.username',
          'http.auth.basic.password',
          'http.unencrypted.username',
          'http.encrypted.password',
          'http.unencrypted.merchantId'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
