export default {
  integration: {
    type: 'allintegrations',
    label: 'Integration',
    placeholder: 'Choose integration',
    required: true,
  },
  childIntegrations: {
    type: 'childintegrations',
    label: 'Child Integrations',
    // placeholder is decided within the childintegrations component
  },
  _flowIds: {
    type: 'flowstiedtointegrations',
    label: 'Flows',
    placeholder: 'Choose flows',
    required: true,
  },
  range: {
    type: 'reportdaterange',
    label: 'Date range',
    placeholder: 'Choose date range',
    defaultValue: '',
    required: true,
    description: 'You can only report across 3 days of data.',
  },
};

