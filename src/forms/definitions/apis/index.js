import { isNewId } from '../../../utils/resource';

export default {
  preSave: formValues => {
    const retValues = { ...formValues };
    retValues['/_scriptId'] = retValues['/script']._scriptId;
    retValues['/function'] = retValues['/script'].function;
    delete retValues['/script'];
    return retValues;
  },
  fieldMap: {
    name: {
      id: 'name',
      name: '/name',
      defaultValue: r => r.name,
      type: 'text',
      label: 'Name',
      required: true,
    },
    description: {
      id: 'description',
      name: '/description',
      defaultValue: r => r.description,
      type: 'text',
      multiline: true,
      maxRows: 5,
      label: 'Description',
    },
    script: {
      id: 'script',
      name: '/script',
      type: 'hook',
      hookType: 'script',
      defaultValue: r => ({
        _scriptId: r._scriptId,
        function: r.function
      }),
      hookStage: '',
      label: 'Script',
      required: true,
    },
    enableShipworksAuthentication: {
      id: 'enableShipworksAuthentication',
      name: '/enableShipworksAuthentication',
      type: 'checkbox',
      label: 'Enable Shipworks authentication',
      defaultValue: r => !!(r && r.shipworks && r.shipworks.username),
    },
    'shipworks.username': {
      id: 'shipworks.username',
      type: 'text',
      name: '/shipworks/username',
      label: 'Username',
      required: true,
      visibleWhen: [
        {
          field: 'enableShipworksAuthentication',
          is: [true],
        },
      ],
    },
    'shipworks.password': {
      id: 'shipworks.password',
      name: '/shipworks/password',
      defaultValue: '',
      type: 'text',
      inputType: 'password',
      label: 'Password',
      required: true,
      description:
        'Note: for security reasons this field must always be re-entered.',
      visibleWhen: [
        {
          field: 'enableShipworksAuthentication',
          is: [true],
        },
      ],
    },
    apiIdentifier: {
      id: 'apiIdentifier',
      label: 'Invoke',
      helpKey: 'apiIdentifier',
      type: 'apiidentifier',
      visible: r => r && !isNewId(r._id),
    },
  },

  layout: {
    fields: ['name', 'description', 'apiIdentifier', 'script'],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced Settings',
        fields: [
          'enableShipworksAuthentication',
          'shipworks.username',
          'shipworks.password',
        ],
      },
    ],
  },
};
