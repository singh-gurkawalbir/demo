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
        "Many of Amazon's APIs require an access key, and this field stores the 'id' for the access key that you want this connection to use.  Please check the AWS guides if you need more info about access keys and how to generate and/or find them in your AWS account.",
      required: true,
    },
    'http.encrypted.secretAccessKey': {
      id: 'http.encrypted.secretAccessKey',
      helpKey: 'redshift.connection.http.encrypted.secretAccessKey',
      type: 'text',
      label: 'Secret Access Key',
      defaultValue: '',
      helpText:
        'When you create a new access key in your Amazon Redshift account, AWS will display both the access key id and the secret access key.  The secret access key will only be available once, and you should store it immediately in integrator.io (i.e. in this field).  Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your secret access key safe.',
      required: true,
      inputType: 'password',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'region',
      'http.unencrypted.accessKeyId',
      'http.encrypted.secretAccessKey',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.unencrypted.partnerUserId',
          'http.encrypted.partnerUserSecret'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
