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
  preSave: formValues => {
    const newValues = { ...formValues };

    newValues['/type'] = 'http';
    newValues['/assistant'] = 'jira';
    newValues['/http/auth/type'] = 'basic';
    newValues['/http/mediaType'] = 'json';
    newValues['/http/ping/method'] = 'GET';
    newValues['/http/ping/relativeURI'] = '/';

    return newValues;
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.baseURI': {
      fieldId: 'http.baseURI',
      helpKey: 'jira.connection.http.baseURI',
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpKey: 'jira.connection.http.auth.basic.username',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      label: 'API token',
      helpKey: 'jira.connection.http.auth.basic.password',
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
        fields: ['http.baseURI',
          'http.auth.basic.username',
          'http.auth.basic.password'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
