export default {
  fields: [
    {
      fieldId: 'ExportName',
    },
    {
      fieldId: 'ExportDescription',
    },
    {
      fieldId: 'ExportHttpMethod',
    },
    {
      fieldId: 'ExportHttpRelativeURI',
    },
    {
      fieldId: 'ExportHttpBody',
      visibleWhen: [
        {
          id: 'isPost',
          field: 'ExportHttpMethod',
          is: ['POST'],
        },
      ],
    },
  ],
};
