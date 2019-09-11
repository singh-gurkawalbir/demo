export default {
  optionsHandler(fieldId, fields) {
    if (fieldId === 'uploadFile') {
      const uploadFileField = fields.find(
        field => field.fieldId === 'uploadFile'
      );

      // if there is a uploadFileField in the form meta
      // then provide the file type if not return null
      // then the prevalent mode value will take over
      if (uploadFileField) {
        const fileTypeField = fields.find(
          field => field.fieldId === 'file.type'
        );

        return fileTypeField.value.toLowerCase();
      }
    }

    return null;
  },
  fields: [
    {
      fieldId: 'uploadFile',
      refreshOptionsOnChangesTo: ['file.type'],
    },
    { fieldId: 'file.csv.columnDelimiter' },
    { fieldId: 'file.csv.includeHeader' },
    { fieldId: 'file.xlsx.includeHeader' },
  ],
  fieldSets: [],
};
