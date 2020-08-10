export default {
  optionsHandler(fieldId, fields) {
    if (fieldId === 'uploadFile') {
      const uploadFileField = fields.find(
        field => field.fieldId === 'uploadFile'
      );
      // if there is a uploadFileField in the form meta
      // then provide the file type if not return null
      // then the prevalent mode value will take over
      const fileType = fields.find(field => field.id === 'file.type');

      if (fieldId === 'uploadFile') {
        return fileType.value;
      }

      if (uploadFileField) {
        const fileTypeField = fields.find(
          field => field.fieldId === 'file.type'
        );

        return fileTypeField.value.toLowerCase();
      }
    }

    return null;
  },
  fieldMap: {
    uploadFile: {
      fieldId: 'uploadFile',
      refreshOptionsOnChangesTo: ['file.type'],
      placeholder: 'Sample file (that would be generated)',
      helpKey: 'import.uploadFile',
    },
    'file.csv': { fieldId: 'file.csv' },
    'file.xlsx.includeHeader': { fieldId: 'file.xlsx.includeHeader' },
  },
  layout: {
    fields: [
      'uploadFile',
      'file.csv',
      'file.xlsx.includeHeader',
    ],
  },
};
