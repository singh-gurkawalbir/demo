import {
  getFieldById,
  replaceField,
  defaultValueInitializer,
} from '../../utils';

const fieldInitializer = (meta, resource) => {
  const newMeta = { ...meta };
  const uriFieldIds = ['relativeUri'];

  uriFieldIds.forEach(id => {
    const relativeUriField = getFieldById({ meta: newMeta, id });

    if (relativeUriField) {
      relativeUriField.connectionId = resource._connectionId;
      replaceField({ meta: newMeta, field: relativeUriField });
    }
  });

  return newMeta;
};

export default {
  initializer: ({ resource, fieldMeta }) => ({
    formValues: defaultValueInitializer(resource),
    fieldMeta: fieldInitializer(fieldMeta, resource),
  }),

  fields: [
    {
      id: 'Name',
      name: '/name',
      helpKey: 'export.name',
      type: 'text',
      label: 'Name',
    },
    {
      id: 'description',
      name: '/description',
      helpKey: 'export.description',
      type: 'text',
      multiline: true,
      rowsMax: 4,
      label: 'Description',
    },
    {
      id: 'method',
      name: '/http/method',
      helpKey: 'export.http.method',
      type: 'select',
      label: 'HTTP method',
      options: [
        {
          items: ['GET', 'POST'],
        },
      ],
    },
    {
      id: 'relativeUri',
      name: '/http/relativeURI',
      helpKey: 'export.http.relativeURI',
      type: 'relativeuri',
      label: 'Relative URI',
      required: true,
    },
    {
      id: 'body',
      name: '/http/body',
      helpKey: 'export.http.body',
      type: 'editor',
      mode: 'json',
      label: 'HTTP Body',
      visibleWhen: [
        {
          id: 'isPost',
          field: 'method',
          is: ['POST'],
        },
      ],
    },
  ],
};
