export default {
  integration: {
    type: 'allintegrations',
    label: 'Integration',
    required: true,
  },
  childIntegrations: {
    type: 'childintegrations',
    label: 'Child Integrations',
  },
  _flowIds: {
    type: 'flowstiedtointegrations',
    label: 'Flows',
    required: true,
  },
  range: {
    type: 'reportdaterange',
    label: 'Date range',
    defaultValue: '',
    required: true,
    description: 'You can only report across 3 days of data.',
  },
};

