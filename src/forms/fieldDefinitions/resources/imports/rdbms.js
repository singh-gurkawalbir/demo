export default {
  'rdbms.queryType': {
    type: 'ignorefieldvalue',
    label: 'Query Type',
    fieldsToUnCheck: ['ignoreExisting', 'ignoreMissing', 'rdbms.ignoreExtract'],
    required: true,
    helpText: `Please select 'Insert' if you are only importing new records into the Database. Please select 'Update' if you are only importing changes to existing records in the Database. Please select 'Insert or Update' if you want your import to be more dynamic such that (1) if an existing record exists in the Database then that record will be updated, or (2) if an existing record does not exist then a new record will be created.`,
    options: [
      {
        items: [
          { label: 'Insert', value: 'INSERT' },
          { label: 'Update', value: 'UPDATE' },
          { label: 'Insert or Update', value: 'COMPOSITE' },
        ],
      },
    ],
    defaultValue: r => {
      let toReturn = '';

      if (!r || !r.rdbms) {
        return toReturn;
      }

      if (r.rdbms.queryType) {
        if (r.rdbms.queryType.length > 1) {
          toReturn = 'COMPOSITE';
        } else if (r.rdbms.queryType.length === 1) {
          [toReturn] = r.rdbms.queryType;
        }
      }

      return toReturn;
    },
  },
  'rdbms.query': {
    id: 'rdbms.query',
    type: 'sqlquerybuilder',
    arrayIndex: 0,
    label: 'Launch Query Builder',
    title: 'SQL Query Builder',
    refreshOptionsOnChangesTo: [
      'rdbms.lookups',
      'rdbms.queryType',
      'modelMetadata',
    ],
    visibleWhen: [
      {
        field: 'rdbms.queryType',
        is: ['INSERT', 'UPDATE'],
      },
    ],
  },
  'rdbms.queryInsert': {
    id: 'rdbms.queryInsert',
    type: 'sqlquerybuilder',
    label: 'Launch Query Builder for Insert',
    title: 'SQL Query Builder',
    refreshOptionsOnChangesTo: [
      'rdbms.lookups',
      'rdbms.queryType',
      'modelMetadata',
    ],
    visibleWhen: [
      {
        field: 'rdbms.queryType',
        is: ['COMPOSITE'],
      },
    ],
  },
  'rdbms.queryUpdate': {
    id: 'rdbms.queryUpdate',
    type: 'sqlquerybuilder',
    label: 'Launch Query Builder for Update',
    title: 'SQL Query Builder',
    refreshOptionsOnChangesTo: [
      'rdbms.lookups',
      'rdbms.queryType',
      'modelMetadata',
    ],
    visibleWhen: [
      {
        field: 'rdbms.queryType',
        is: ['COMPOSITE'],
      },
    ],
  },
  'rdbms.ignoreExtract': {
    type: 'text',
    label: 'Existing Data Id',
    required: true,
    defaultValue: r =>
      r && r.rdbms && r.rdbms.ignoreLookupName
        ? r.rdbms.ignoreLookupName
        : r.rdbms.ignoreExtract,
    helpText: `This field is used to inform integrator.io on how to identify existing records, and if a record is found to exist, it will be ignored (no operation performed for this record). integrator.io will determine if a record exists by the presence of a specific record property. Typically this would be a field that is only present on existing records such as an "ID", or "createDate". If this is the case, simply provide the field path to this property. Example: "customerId" or "dateCreated".
    Alternatively you can identify existing records by using the result of a lookup. If the lookup returned a value, then this would be an indication that the record exists. An example of this would be a lookup that maps an email from the export record to an ID from the destination App. If this is how you wish to identify an existing lookup, first define the lookup and then simply enter the lookup's name in this field.`,
    visibleWhen: [
      {
        field: 'ignoreExisting',
        is: [true],
      },
      {
        field: 'ignoreMissing',
        is: [true],
      },
    ],
  },
  'rdbms.updateExtract': {
    type: 'text',
    label: 'Existing Data Id',
    required: true,
    defaultValue: r =>
      r && r.rdbms && r.rdbms.updateLookupName
        ? r.rdbms.updateLookupName
        : r.rdbms.updateExtract,
    helpText: `This field is used to inform integrator.io on how to identify existing records, and if a record is found to not exist, it will be ignored (no operation performed for this record). integrator.io will determine if a record exists by the presence of a specific record property. Typically this would be a field that is only present on existing records such as an "ID", or "createDate". If this is your case, simply provide the field path to this property. Example: "customerId" or "dateCreated".
    Alternatively you can identify existing records by using the result of a lookup. If the lookup returned a value, then this would be an indication that the record exists. An example of this would be a lookup that maps an email from the export record to an ID from the destination App. If this is how you wish to identify an existing lookup, first define the lookup and then simply enter the lookup's name in this field.`,
    visibleWhen: [
      {
        field: 'rdbms.queryType',
        is: ['COMPOSITE'],
      },
    ],
  },
};
