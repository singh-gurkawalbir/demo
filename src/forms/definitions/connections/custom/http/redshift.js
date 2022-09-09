export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'redshift',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://redshift.${formValues['/region']}.amazonaws.com`,
    '/http/ping/relativeURI': '/?Action=DescribeClusters&Version=2012-12-01',
    '/http/ping/method': 'GET',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    region: {
      id: 'region',
      type: 'text',
      label: 'Region',
      helpKey: 'redshift.connection.region',
      startAdornment: 'https://redshift.',
      endAdornment: '.amazonaws.com',
      helpText:
        'Name of the Amazon Redshift region to the location where the request is being made.',
      required: true,
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://redshift.') + 17,
            baseUri.indexOf('.amazonaws.com')
          );

        return subdomain;
      },
    },
    'http.unencrypted.accessKeyId': {
      id: 'http.unencrypted.accessKeyId',
      type: 'text',
      label: 'Access Key Id',
      helpKey: 'redshift.connection.http.unencrypted.accessKeyId',
      helpText:
        'Many Amazon APIs require an access key, and you must enter its ID in this setting for Redshift authentication. Refer to the AWS guides for more info about access keys and how to generate or find them in your AWS account.',
      required: true,
    },
    'http.encrypted.secretAccessKey': {
      id: 'http.encrypted.secretAccessKey',
      helpKey: 'redshift.connection.http.encrypted.secretAccessKey',
      type: 'text',
      label: 'Secret Access Key',
      defaultValue: '',
      helpText:
        'When you create an access key in your Amazon Redshift account, AWS will display both the access key ID and the secret access key. The secret access key will be available only once, and you should immediately copy it to a secure location and paste it into this setting. Multiple layers of protection, including AES 256 encryption, are in place to keep your secret access key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
      required: true,
      inputType: 'password',
      description:
        'Note: for security reasons this field must always be re-entered.',
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
        fields: ['region',
          'http.unencrypted.accessKeyId',
          'http.encrypted.secretAccessKey'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
