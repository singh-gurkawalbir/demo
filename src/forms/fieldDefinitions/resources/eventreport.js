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
    label: 'Date Range',
    defaultValue: '',
    required: true,
  },
};

