import { defaultPatchSetConverter } from '../../../../utils';

export default {
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
      helpKey: 'connection.name',
      defaultValue: '{{name}}',
      type: 'text',
      label: 'Name',
    },
    {
      id: 'baseURI',
      name: '/rest/baseURI',
      helpKey: 'connection.rest.baseURI',
      defaultValue: '{{rest.baseURI}}',
      type: 'text',
      label: 'Base URI',
      required: true,
    },
    {
      id: 'Username',
      name: '/rest/basicAuth/username',
      helpKey: 'connection.rest.basicAuth.username',
      defaultValue: '{{rest.basicAuth.username}}',
      type: 'text',
      label: 'Username',
      required: true,
    },
    {
      id: 'Password',
      name: '/rest/basicAuth/password',
      helpKey: 'connection.rest.basicAuth.password',
      defaultValue: '{{rest.basicAuth.password}}',
      type: 'text',
      label: 'Password',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
