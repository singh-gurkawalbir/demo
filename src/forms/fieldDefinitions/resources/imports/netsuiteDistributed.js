export default {
  'netsuite_da.recordType': {
    label: 'Record Type',
    required: true,
    type: 'refreshableselect',
    filterKey: 'suitescript-recordTypes',
    commMetaPath: r =>
      r &&
      `netsuite/metadata/suitescript/connections/${r._connectionId}/recordTypes`,
    placeholder: 'Please select a record type',
    connectionId: r => r && r._connectionId,
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'netsuite_da.subrecords': {
    label: 'Subrecords',
    required: false,
    type: 'netsuitesubrecords',
    // filterKey: 'suitescript-recordTypes',
    // commMetaPath: r =>
    //   r &&
    //   `netsuite/metadata/suitescript/connections/${r._connectionId}/recordTypes`,
    // placeholder: 'Please select a record type',
    connectionId: r => r && r._connectionId,
    // visibleWhen: [
    //   {
    //     field: 'inputMode',
    //     is: ['records'],
    //   },
    // ],
    defaultValue: r => {
      let val = [];

      console.log(`r ${JSON.stringify(r)}`);

      if (r && r.netsuite_da && r.netsuite_da.mapping) {
        if (r.netsuite_da.mapping.fields) {
          val = val.concat(
            r.netsuite_da.mapping.fields
              .filter(
                fld => fld.subRecordMapping && fld.subRecordMapping.recordType
              )
              .map(fld => ({
                fieldId: fld.subRecordMapping._id,
                recordType: fld.subRecordMapping.recordType,
                jsonPath: fld.subRecordMapping.jsonPath,
              }))
          );
        }

        if (r.netsuite_da.mapping.lists) {
          r.netsuite_da.mapping.lists.forEach(list => {
            if (list.fields) {
              val = val.concat(
                list.fields
                  .filter(
                    fld =>
                      fld.subRecordMapping && fld.subRecordMapping.recordType
                  )
                  .map(fld => ({
                    fieldId: fld.subRecordMapping._id,
                    recordType: fld.subRecordMapping.recordType,
                    jsonPath: fld.subRecordMapping.jsonPath,
                  }))
              );
            }
          });
        }
      }

      return val;
    },
    defaultValue1: [
      {
        fieldId: 'item[*].celigo_inventorydetail',
        recordType: 'inventorydetail',
        jsonPath: '$',
      },
      {
        fieldId: 'item[*].celigo_inventorydetail123',
        recordType: 'inventorydetail',
        jsonPath: 'abc',
      },
    ],
  },
  'netsuite_da.mapping': {
    type: 'mapping',
    connectionId: r => r && r._connectionId,
    label: 'Manage Import Mapping',
  },
  'netsuite_da.operation': {
    type: 'radiogroupforresetfields',
    fieldsToReset: [
      { id: 'ignoreExisting', type: 'checkbox' },
      { id: 'ignoreMissing', type: 'checkbox' },
    ],
    label: 'Operation',
    required: true,
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
    options: [
      {
        items: [
          { label: 'Add', value: 'add' },
          { label: 'Update', value: 'update' },
          { label: 'Add or Update', value: 'addupdate' },
        ],
      },
    ],
  },
  'netsuite.operation': {
    type: 'radiogroup',
    label: 'Operation',
    required: true,
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
    options: [
      {
        items: [
          { label: 'Add', value: 'add' },
          { label: 'Update', value: 'update' },
          { label: 'Add or Update', value: 'addupdate' },
          { label: 'Delete', value: 'delete' },
        ],
      },
    ],
  },
  'netsuite_da.internalIdLookup.expression': {
    type: 'netsuitelookup',
    label: 'How can we find existing records?',
    required: true,
    visibleWhen: [
      {
        field: 'ignoreExisting',
        is: [true],
      },
      {
        field: 'netsuite_da.operation',
        is: ['update', 'addupdate'],
      },
    ],
  },
  'netsuite_da.hooks.preMap.function': {
    type: 'text',
    label: 'Pre Map',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'netsuite_da.hooks.preMap.fileInternalId': {
    type: 'text',
    placeholder: 'File Internal ID',
    label: 'Pre Map File',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'netsuite_da.hooks.postMap.function': {
    type: 'text',
    label: 'Post Map',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'netsuite_da.hooks.postMap.fileInternalId': {
    type: 'text',
    placeholder: 'File Internal ID',
    label: 'Post Map File',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'netsuite_da.hooks.postSubmit.function': {
    type: 'text',
    label: 'Post Submit',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'netsuite.file.name': {
    type: 'text',
    label: 'Name',
    visibleWhenAll: [
      {
        field: 'netsuite.operation',
        is: ['add', 'addupdate'],
      },
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
  },
  'netsuite.file.fileType': {
    type: 'text',
    label: 'File Type',
    visibleWhenAll: [
      {
        field: 'netsuite.operation',
        is: ['add', 'addupdate'],
      },
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
  },
  'netsuite.file.folder': {
    type: 'text',
    label: 'Folder',
    visibleWhenAll: [
      {
        field: 'netsuite.operation',
        is: ['add', 'addupdate'],
      },
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
  },
  'netsuite.file.internalId': {
    type: 'text',
    label: 'File Internal Id',
    visibleWhenAll: [
      {
        field: 'netsuite.operation',
        is: ['update', 'delete'],
      },
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
  },
  'netsuite_da.hooks.postSubmit.fileInternalId': {
    type: 'text',
    placeholder: 'File Internal ID',
    label: 'Post Submit File',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
};
