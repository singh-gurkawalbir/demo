export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'ware2go',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://openapi${
      formValues['/http/accountType'] === 'staging'
        ? '.staging.ware2goproject.com'
        : '.ware2go.co'
    }/ware2go`,
    '/http/ping/relativeURI': `/v1/merchants/${
      formValues['/http/encrypted/merchantId']
    }/inventory`,
    '/http/ping/method': 'GET',
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'http.accountType',
      type: 'select',
      label: 'Account Type',
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
          if (baseUri.indexOf('staging') === -1) {
            return 'staging';
          }
        }

        return 'production';
      },
      helpText: `Please select your environment here. Select Staging if the account is created on https://openapi.staging.ware2goproject.com/ware2go. Select Production if the account is created on https://openapi.ware2goproject.com/ware2go.`,
    },
    {
      fieldId: 'http.auth.basic.username',
      label: 'Access Token',
      helpText:
        'Please enter your Access Secret here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API Secret safe. This can be obtained by reaching out to Ware2Go support team.',
    },
    {
      fieldId: 'http.auth.basic.password',
      label: 'Access Secret',
      helpText:
        'Please enter your Access Secret here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API Secret safe. This can be obtained by reaching out to Ware2Go support team.',
    },
    {
      id: 'http.encrypted.merchantId',
      label: 'Merchant Id',
      required: true,
      type: 'text',
      defaultValue: '',
      helpText:
        'Please enter your Merchant Id here. This can be obtained by reaching out to Ware2Go support team.',
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
