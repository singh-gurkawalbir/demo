export default {
  integration: {
    loggable: true,
    type: 'allintegrations',
    label: 'Integration',
    helpText: 'Select an integration to show its flows, below',
    placeholder: 'Choose integration',
    required: true,
  },
  childIntegrations: {
    loggable: true,
    type: 'childintegrations',
    label: 'Child Integrations',
    helpText: 'Select a “child” integration, such as stores or banks, to narrow the flows available for this report.',
    // placeholder is decided within the child integrations component
  },
  _flowIds: {
    loggable: true,
    type: 'flowstiedtointegrations',
    label: 'Flows',
    helpText: 'Select a “child” integration, such as stores or banks, to narrow the flows available for this report.',
    placeholder: 'Choose flows',
    required: true,
  },
  range: {
    loggable: true,
    type: 'reportdaterange',
    label: 'Date range',
    helpText: 'Pick a convenient predefined window ending now, or click Custom to specify up to a three-day range within the last 30 days. Be sure to click Apply after entering a range.',
    fullWidth: true,
    placeholder: 'Choose date range',
    defaultValue: '',
    required: true,
    description: 'You can include up to three days of data.',
  },
};

