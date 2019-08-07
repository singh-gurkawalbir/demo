export default {
  fields: [
    { formId: 'common' },
    {
      fieldId: 'netsuite.netsuiteExportlabel',
    },
    {
      fieldId: 'netsuite.distributed.recordType',
    },
    {
      fieldId: 'netsuite.distributed.executionContext',
    },
    {
      fieldId: 'netsuite.distributed.executionType',
    },
    {
      fieldId: 'netsuite.distributed.sublists',
      refreshOptionsOnChangesTo: ['netsuite.distributed.recordType'],
      visibleWhen: [
        {
          id: 'hasRecord',
          field: 'netsuite.distributed.recordType',
          isNot: [''],
        },
      ],
    },
    //  Tranform  Data
    { fieldId: 'ftp.exportTransformRecords' },
    { fieldId: 'transform.expression.rules' },
    // Qualification Criteria
    // Sample Data
    // Filter  Data
    // Advanced
  ],
  fieldSets: [],
  optionsHandler: (field, fields) => {
    if (field === 'netsuite.distributed.sublists') {
      const recordTypeField = fields.find(
        field => field.fieldId === 'netsuite.distributed.recordType'
      );

      // returns corresponding relative uri path
      return {
        resourceToFetch:
          recordTypeField && `recordTypes/${recordTypeField.value}/sublists`,
        resetValue:
          recordTypeField &&
          recordTypeField.value !== recordTypeField.defaultValue,
      };
    }

    return null;
  },
};
