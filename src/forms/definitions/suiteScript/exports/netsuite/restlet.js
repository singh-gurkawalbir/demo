export default {
  fieldMap: {
    'export.netsuite.restlet.recordType': {
      fieldId: 'export.netsuite.restlet.recordType',
    },
    'export.netsuite.restlet.searchId': {
      fieldId: 'export.netsuite.restlet.searchId',
    },
    'export.type': {
      fieldId: 'export.type',
    },
    'export.delta.dateField': {
      fieldId: 'export.delta.dateField',
    },
  },
  layout: {
    type: 'column',
    containers: [
      {
        fields: [
          'export.netsuite.restlet.recordType',
          'export.netsuite.restlet.searchId',
          'export.type',
          'export.delta.dateField',
        ],
        type: 'collapse',
      },
    ],
  },
};
