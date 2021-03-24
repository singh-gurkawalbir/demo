import { convertUtcToTimezone } from '../../../utils/date';

export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    newValues['/type'] = 'flow_events';
    const {startDate, timezone, endDate} = newValues['/range'];

    newValues['/startTime'] = convertUtcToTimezone(startDate, null, null, timezone, {skipFormatting: true});
    newValues['/endTime'] = convertUtcToTimezone(endDate, null, null, timezone, {skipFormatting: true});
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
    fields: [
      'integration',
      'childIntegrations',
      '_flowIds',
      'range',
    ],
  },
};

