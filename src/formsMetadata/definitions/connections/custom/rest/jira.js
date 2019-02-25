import {
  defaultValueInitializer,
  defaultPatchSetConverter,
} from '../../../../utils';

export default {
  // Initializers get the
  initializer: dataModel => {
    const formValues = defaultValueInitializer(dataModel);

    // console.log('custom initializer', formValues);

    return formValues;
  },

  converter: formValues => {
    const fixedValues = {
      '/rest/authType': 'basic',
      '/rest/mediaType': 'json',
      '/rest/pingRelativeURI': '/',
    };
    const patchSet = defaultPatchSetConverter({
      ...formValues,
      ...fixedValues,
    });

    // console.log('custom converter', v);

    return patchSet;
  },
  fields: [
    {
      id: 'Name',
      name: '/name',
      type: 'text',
      label: 'Name',
      description: 'this is the description',
      placeholder: '',
      defaultValue: '',
      visible: true,
      required: true,
      disabled: false,
    },
    {
      id: 'type',
      name: '/type',
      type: 'select',
      label: 'Connection Type',
      description: '',
      placeholder: '',
      defaultValue: '',
      options: [
        {
          items: [
            {
              label: 'Jira',
              value: 'jira',
            },
            {
              label: 'REST',
              value: 'rest',
            },
          ],
        },
      ],
      visible: true,
      required: true,
      disabled: true,
      visibleWhen: [],
      requiredWhen: [],
      disabledWhen: [],
    },
    {
      id: 'baseURI',
      name: '/rest/baseURI',
      type: 'text',
      label: 'Base URI',
      description: '',
      placeholder: '',
      defaultValue: '',
      required: true,
    },
    {
      id: 'Username',
      name: '/rest/basicAuth/username',
      type: 'text',
      label: 'Username',
      placeholder: '',
      defaultValue: '',
      required: true,
    },
    {
      id: 'Password',
      name: '/rest/basicAuth/password',
      type: 'text',
      label: 'Password',
      description:
        'Note: for security reasons this field must always be re-entered.',
      placeholder: '',
      defaultValue: '',
      required: true,
    },
  ],
};
