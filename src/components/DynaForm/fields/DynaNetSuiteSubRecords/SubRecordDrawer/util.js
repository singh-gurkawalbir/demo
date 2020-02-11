export default function getFormFieldMetadata(
  recordLabel,
  subrecords,
  subrecordFields,
  fieldId
) {
  if (!subrecordFields || subrecordFields.length === 0) {
    return undefined;
  }

  const subrecordFieldsToIgnore = subrecords.map(sr => sr.fieldId);

  console.log(
    `subrecordFieldsToIgnore ${JSON.stringify(subrecordFieldsToIgnore)}`
  );
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

    console.log(`jsonPathFieldId ${jsonPathFieldId}`);

    fieldMeta.fieldMap[jsonPathFieldId] = {
      id: jsonPathFieldId,
      name: jsonPathFieldId,
      type: 'select',
      label: fld.subRecordJsonPathLabel,
      options: [
        {
          items: [
            { label: '$', value: '$' },
            { label: 'some thing', value: 'something' },
          ],
        },
      ],
      defaultValue: subrecord && subrecord.jsonPath,
      visibleWhen: [
        {
          field: 'fieldId',
          is: [fld.value],
        },
      ],
    };
    fieldMeta.layout.fields.push(jsonPathFieldId);
  });

  return fieldMeta;
}
