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
    label: 'Flow Ids',
    required: true,
  },
  range: {
    type: 'reportdaterange',
    label: 'Range',
    defaultValue: '',
    required: true,
  },
};

