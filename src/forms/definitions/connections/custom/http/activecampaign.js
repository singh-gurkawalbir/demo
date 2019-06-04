export default {
  preSubmit: formValues => {
    const fixedValues = {
      '/type': 'http',
      '/assistant': 'activecampaign',
      '/http/auth/type': 'token',
      '/http/mediaType': 'json',
      '/http/ping/relativeURI':
        '/admin/api.php?api_action=account_view&api_output=json',
      '/http/baseURI': `https://${
        formValues['/http/activecampaignSubdomain']
      }.api-us1.com`,
      '/http/auth/token/location': 'url',
      '/http/auth/token/paramName': 'api_key',
    };
    const newValues = {
      ...formValues,
      ...fixedValues,
    };

    return newValues;
  },
  converter: formValues => {
    const fixedValues = {
      '/type': 'http',
      '/assistant': 'activecampaign',
      '/http/auth/type': 'token',
      '/http/mediaType': 'json',
      '/http/ping/relativeURI':
        '/admin/api.php?api_action=account_view&api_output=json',
      '/http/baseURI': `https://${
        formValues['/http/activecampaignSubdomain']
      }.api-us1.com`,
      '/http/auth/token/location': 'url',
      '/http/auth/token/paramName': 'api_key',
    };
    const newValues = {
      ...formValues,
      ...fixedValues,
    };

    return newValues;
  },
  fields: [
    // Fields can be referenced by their fieldDefinition key, and the
    // framework will fetch the missing values. Any values present in
    // this file override the references field's props.
    { fieldId: 'name' },
    {
      type: 'text',
      fieldId: 'http.activecampaignSubdomain',
      startAdornment: 'https://',
      endAdornment: '.api-us1.com',
      label: 'Enter subdomain into the base uri',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r.http.baseURI;
        const subdomain = baseUri.substring(
          baseUri.indexOf('https://') + 8,
          baseUri.indexOf('.api-us1.com')
        );

        return subdomain;
      },
    },
    {
      id: 'apiKey',
      name: '/http/auth/token/token',
      type: 'text',
      inputType: 'password',
      label: 'Password',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
