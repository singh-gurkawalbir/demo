export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'pagerdutyevents',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://events.pagerduty.com/v2',
    '/http/ping/relativeURI': '/enqueue',
    '/http/ping/method': 'POST',
    '/http/ping/body': '{"payload": {"summary":"Test event from Celigo","source": "monitoringtool:cloudvendor:central-region-dc-01:852559987:cluster/api-stats-prod-003","severity": "info"},"routing_key": "{{connection.http.encrypted.routingKey}}","event_action": "trigger"}',
    '/http/ping/successPath': 'status',
    '/http/ping/successValues': 'success',
    '/http/concurrencyLevel': `${formValues['/http/concurrencyLevel']}` || 2,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.encrypted.routingKey': {
      id: 'http.encrypted.routingKey',
      required: true,
      type: 'text',
      label: 'Routing Key',
      inputType: 'password',
      defaultValue: '',
      description:
        'Note: for security reasons this field must always be re-entered.',
      helpKey: 'pagerdutyevents.connection.http.encrypted.routingKey',
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
        fields: ['http.encrypted.routingKey'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
