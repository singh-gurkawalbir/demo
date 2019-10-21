export default {
  // This handler gets fired after the fieldMeta is merged with the master
  // field definitions and has had any js props converted to scalar values.
  // TODO: I think we need to also pass in the current resource.
  // Some default values could take some parsing or other such custom logic?
  // Lets wait for some assistants to be made and we will see...
  // init: fieldMeta => ({
  //   fields: [
  //     {
  //       id: 'injected',
  //       type: 'text',
  //       label: 'Injected field',
  //       placeholder: 'using init hook',
  //     },
  //     ...fieldMeta.fields,
  //   ],
  // }),
  // This handler is called just before the form values are
  // converted to a patch-set and applied against the resource.
  // This handler can be used to add/modify the form values
  // programmatically if needed. Typical example is to add hardcoded values...
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'jira',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/method': 'GET',
    '/http/ping/relativeURI': '/',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.baseURI': {
      fieldId: 'http.baseURI',
      helpText:
        'The base URI for JIRA. For example, http://www.company.com/confluence',
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpText: 'The username of your JIRA account.',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      label: 'API Token',
      helpText:
        'To create an API token for Atlassian account:Login to your Atlassian account– >Go to User management– >Go to Your profile --> Security – > API token',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.baseURI',
      'http.auth.basic.username',
      'http.auth.basic.password',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
