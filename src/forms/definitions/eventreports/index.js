export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    newValues['/type'] = 'flow_events';
    const {startDate, endDate} = newValues['/range'];

    newValues['/startTime'] = startDate;
    newValues['/endTime'] = endDate;
    delete newValues['/range'];

    return newValues;
  },
  fieldMap: {
    integration: { fieldId: 'integration' },
    _flowIds: { fieldId: '_flowIds' },
    childIntegrations: {
      fieldId: 'childIntegrations' },
    range: { fieldId: 'range' },
  },
  layout: {
    type: 'box',
    containers: [
      {
        fields: [
          'integration',
          'childIntegrations',
          '_flowIds',
          'range',
        ],
      },
    ],
  },
};

