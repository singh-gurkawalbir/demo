export function getFormFieldMetadata(
  recordLabel,
  subrecords,
  subrecordFields,
  referenceFieldId,
  flowId,
  connectionId,
  integrationId,
) {
  if (!subrecordFields || subrecordFields.length === 0) {
    return {};
  }

  const subrecordFieldsToIgnore = subrecords.map(sr => sr.referenceFieldId);
  const subrecord = subrecords.find(sr => sr.referenceFieldId === referenceFieldId);
  const fieldMeta = {
    fieldMap: {
      referenceFieldId: {
        id: 'referenceFieldId',
        name: 'referenceFieldId',
        // TODO: helpText is needed
        helpText: 'Sample helptext for the subrecord set',
        type: 'select',
        label: `Which ${recordLabel} field should this subrecord set?`,
        options: [
          {
            items: subrecordFields.filter(
              fld =>
                !subrecordFieldsToIgnore.includes(fld.value) ||
                fld.value === referenceFieldId
            ),
          },
        ],
        defaultDisabled: !!referenceFieldId,
        defaultValue: subrecord?.referenceFieldId,
        required: true,
      },
      recordType: {
        id: 'recordType',
        name: 'recordType',
        label: 'Record type',
        required: true,
        type: 'refreshableselect',
        filterKey: 'suitescript-recordTypes',
        commMetaPath: `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes`,
        resourceType: 'recordTypes',
        placeholder: 'Please select a record type',
        connectionId,
        defaultValue: subrecord?.recordType,
      },
      operation: {
        id: 'operation',
        name: 'operation',
        type: 'radiogroupforresetfields',
        fieldsToReset: [
          { id: 'ignoreExisting', type: 'checkbox' },
          { id: 'ignoreMissing', type: 'checkbox' },
        ],
        label: 'Operation',
        required: true,
        options: [
          {
            items: [
              { label: 'Add', value: 'add' },
              { label: 'Update', value: 'update' },
              { label: 'Add or Update', value: 'addupdate' },
            ],
          },
        ],
        defaultValue: subrecord?.operation,
      },
      ignoreExisting: {
        id: 'ignoreExisting',
        name: 'ignoreExisting',
        type: 'checkbox',
        label: 'Ignore existing records',
        defaultValue: subrecord?.ignoreExisting,
        visibleWhen: [
          {
            field: 'operation',
            is: ['add'],
          },
        ],
      },
      ignoreMissing: {
        id: 'ignoreMissing',
        name: 'ignoreMissing',
        type: 'checkbox',
        label: 'Ignore missing records',
        defaultValue: subrecord?.ignoreMissing,
        visibleWhen: [
          {
            field: 'operation',
            is: ['update'],
          },
        ],
      },
      internalIdLookupExpression: {
        id: 'internalIdLookupExpression',
        name: 'internalIdLookupExpression',
        type: 'suitescriptnetsuitelookup',
        label: 'How can we find existing records?',
        required: true,
        visibleWhen: [
          {
            field: 'ignoreExisting',
            is: [true],
          },
          {
            field: 'operation',
            is: ['update', 'addupdate'],
          },
        ],
        ssLinkedConnectionId: connectionId,
        integrationId,
        resourceContext: {
          resourceId: flowId,
          resourceType: 'flows',
        },
        defaultValue: JSON.stringify(subrecord?.internalIdLookup?.expression),
        refreshOptionsOnChangesTo: ['recordType'],
      },
    },
    layout: {
      fields: ['referenceFieldId', 'recordType', 'operation', 'ignoreExisting', 'ignoreMissing', 'internalIdLookupExpression'],
    },
  };

  return {fieldMeta,
    optionsHandler: (fieldId, fields) => {
      if (fieldId === 'internalIdLookupExpression') {
        const recordTypeField = fields.find(
          field => field.id === 'recordType'
        );

        return {
          disableFetch: !(recordTypeField && recordTypeField.value),
          commMetaPath: recordTypeField
            ? `netsuite/metadata/suitescript/connections/${recordTypeField.connectionId}/recordTypes/${recordTypeField.value}/searchFilters?includeJoinFilters=true`
            : '',
          resetValue: [],
        };
      }

      return null;
    }};
}

export const getNetSuiteSubrecordLabel = (referenceFieldId, referenceFields) => {
  const field = referenceFields.find(f => f.value === referenceFieldId);

  return field?.label ?? referenceFieldId;
};
