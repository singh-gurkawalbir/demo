export default {
  integration: {
    type: 'allintegrations',
    label: 'Integration',
    // Todo: (Surya) : we need the exact helptext for all helptext.
    helpText: 'Choose Integration',
    placeholder: 'Choose integration',
    required: true,
  },
  childIntegrations: {
    type: 'childintegrations',
    label: 'Child Integrations',
    helpText: 'Choose child integrations',
    // placeholder is decided within the childintegrations component
  },
  _flowIds: {
    type: 'flowstiedtointegrations',
    label: 'Flows',
    helpText: 'Choose flows',
    placeholder: 'Choose flows',
    required: true,
  },
  range: {
    type: 'reportdaterange',
    label: 'Date range',
    helpText: 'Choose the date range',
    fullWidth: true,
    placeholder: 'Choose date range',
    defaultValue: '',
    required: true,
    description: 'You can only report across 3 days of data.',
  },
};

