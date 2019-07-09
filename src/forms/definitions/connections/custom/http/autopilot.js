export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'autopilot',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': 'v1/contacts',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://api2.autopilothq.com/`,
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'autopilotapikey',
    '/http/auth/token/scheme': ' ',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'http.auth.token.token',
      label: 'API Key:',
      helpText:
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. This can be obtained from the Settings section and Developer subsection.',
      required: true,
    },
  ],
};
