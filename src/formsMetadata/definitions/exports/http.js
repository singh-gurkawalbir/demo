export default {
  fieldSets: [
    {
      fields: [
        {
          id: 'Name',
          name: '/name',
          type: 'text',
          label: 'Name',
          description: '',
          placeholder: '',
          defaultValue: '',
        },
        {
          id: 'description',
          name: '/description',
          type: 'textarea',
          label: 'Description',
          description: '',
          placeholder: '',
          defaultValue: '',
        },
        {
          id: 'method',
          name: '/http/method',
          type: 'select',
          label: 'HTTP method',
          description: '',
          placeholder: '',
          defaultValue: '',
          options: [
            {
              items: ['GET', 'POST'],
            },
          ],
          visible: true,
          required: true,
          disabled: false,
          visibleWhen: [],
          requiredWhen: [],
          disabledWhen: [],
        },
        {
          id: 'relativeUri',
          name: '/http/relativeURI',
          type: 'relativeUri',
          label: 'Relative URI',
          visible: true,
          required: true,
        },
        {
          id: 'body',
          name: '/http/body',
          type: 'text',
          multiline: true,
          rowsMax: 5,
          label: 'HTTP Body',
          visibleWhen: [
            {
              id: 'isPost',
              field: 'method',
              is: ['POST'],
            },
          ],
          description: '',
          placeholder: '',
          defaultValue: '',
        },
      ],
    },
  ],
};
