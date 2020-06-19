export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'freshbooks',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.freshbooks.com/',
    '/http/auth/oauth/authURI':
      'https://my.freshbooks.com/service/auth/oauth/authorize',
    '/http/auth/oauth/tokenURI': 'https://api.freshbooks.com/auth/oauth/token',
    '/http/headers': [
      { name: 'Api-Version', value: 'alpha' },
      { name: 'Content-Type', value: 'application/json' },
    ],
    '/http/auth/token/refreshHeaders': [
      { name: 'Api-Version', value: 'alpha' },
      { name: 'Content-Type', value: 'application/json' },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    httpAdvanced: { formId: 'httpAdvanced' },
    application: {
      id: 'application',
      type: 'text',
      label: 'Application',
      defaultValue: r => r && r.assistant ? r.assistant : r.type,
      defaultDisabled: true,
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
