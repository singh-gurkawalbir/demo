export default function getFormFieldMetadata(
  recordLabel,
  subrecords,
  subrecordFields,
  fieldId,
  flowId,
  resourceId
) {
  if (!subrecordFields || subrecordFields.length === 0) {
    return undefined;
  }

  const subrecordFieldsToIgnore = subrecords.map(sr => sr.fieldId);
  const subrecord = subrecords.find(sr => sr.fieldId === fieldId);
  const fieldMeta = {
    fieldMap: {
      fieldId: {
        id: 'fieldId',
        name: 'fieldId',
        type: 'select',
        label: `Which ${recordLabel} field should this subrecord set?`,
        options: [
          {
            items: subrecordFields.filter(
              fld =>
                !subrecordFieldsToIgnore.includes(fld.value) ||
                fld.value === fieldId
            ),
          },
        ],
        defaultDisabled: !!fieldId,
        defaultValue: subrecord && subrecord.fieldId,
      },
    },
    layout: {
      fields: ['fieldId'],
    },
  };

  subrecordFields.forEach(fld => {
    const jsonPathFieldId = `jsonPath_${fld.value.replace(
      '[*].',
      '_sublist_'
    )}`;

    fieldMeta.fieldMap[jsonPathFieldId] = {
      id: jsonPathFieldId,
      name: jsonPathFieldId,
      type: 'netsuitesubrecordjsonpath',
      label: fld.subRecordJsonPathLabel,
      defaultValue: subrecord && subrecord.jsonPath,
      visibleWhen: [
        {
          field: 'fieldId',
          is: [fld.value],
        },
      ],
      flowId,
      resourceId,
    };
    fieldMeta.layout.fields.push(jsonPathFieldId);
  });

  return fieldMeta;
}
