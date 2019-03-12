export default {
  fields: [
    {
      id: 'ExportName',
    },
    {
      id: 'ExportDescription',
    },
    {
      id: 'ExportHttpMethod',
    },
    {
      id: 'ExportHttpRelativeURI',
    },
    {
      id: 'ExportHttpBody',
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
