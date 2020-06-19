export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'xcart',
    '/rest/authType': 'token',
    '/rest/mediaType': 'json',
    '/rest/tokenLocation': 'url',
    '/rest/tokenParam': '_key',
    '/rest/pingRelativeURI': '/admin.php?target=RESTAPI&_path=product/1',
    '/rest/pingMethod': 'GET',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.baseURI': { fieldId: 'rest.baseURI', label: 'Base URI' },
    'rest.bearerToken': {
      fieldId: 'rest.bearerToken',
      label: 'Token',
      required: true,
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name', 'rest.baseURI', 'rest.bearerToken'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.unencrypted.partnerUserId',
          'http.encrypted.partnerUserSecret'] },
      { collapsed: true, label: 'Advanced', fields: ['restAdvanced'] },
    ],
  },
};
