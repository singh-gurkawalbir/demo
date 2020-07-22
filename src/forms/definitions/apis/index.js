import { isNewId } from '../../../utils/resource';

export default {
  preSave: formValues => {
    const retValues = { ...formValues };
    retValues['/_scriptId'] = retValues['/script']._scriptId;
    retValues['/function'] = retValues['/script'].function;
    delete retValues['/script'];
    if (retValues['/enableShipworksAuthentication'] === false) {
      delete retValues['/shipworks/username'];
      delete retValues['/shipworks/password'];
      retValues['/shipworks'] = undefined;
    }
    delete retValues['/shipworksApiIdentifier'];
    delete retValues['/apiIdentifier'];
    return retValues;
  },
  fieldMap: {
    name: {
      id: 'name',
      defaultValue: r => r.name,
      type: 'text',
      label: 'Name',
      required: true,
    },
    description: {
      id: 'description',
      defaultValue: r => r.description,
      type: 'text',
      multiline: true,
      maxRows: 5,
      label: 'Description',
    },
    script: {
      id: 'script',
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
      type: 'checkbox',
      label: 'Enable ShipWorks authentication',
      defaultValue: r => !!(r && r.shipworks && r.shipworks.username),
    },
    'shipworks.username': {
      id: 'shipworks.username',
      type: 'text',
      label: 'Username',
      visibleWhen: [
        {
          field: 'enableShipworksAuthentication',
          is: [true],
        },
      ],
      requiredWhen: [
        {
          field: 'enableShipworksAuthentication',
          is: [true],
        },
      ],
    },
    'shipworks.password': {
      id: 'shipworks.password',
      defaultValue: '',
      type: 'text',
      inputType: 'password',
      label: 'Password',
      description:
        'Note: for security reasons this field must always be re-entered.',
      visibleWhen: [
        {
          field: 'enableShipworksAuthentication',
          is: [true],
        },
      ],
      requiredWhen: [
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
      defaultValue: r => `v1/apis/${r._id}/request`
    },
    shipworksApiIdentifier: {
      id: 'shipworksApiIdentifier',
      label: 'Invoke',
      helpKey: 'apiIdentifier',
      type: 'apiidentifier',
      visible: r => r && !isNewId(r._id),
      defaultValue: r => `v1/shipworks/${r._id}/request`,
      visibleWhen: r => {
        const isNew = isNewId(r._id);

        if (isNew) return [];

        return [
          {
            field: 'enableShipworksAuthentication',
            is: [true],
          },
        ];
      },
    },
  },

  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: false,
        label: 'General',
        fields: ['name', 'description', 'script', 'apiIdentifier'],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'enableShipworksAuthentication',
          'shipworks.username',
          'shipworks.password',
          'shipworksApiIdentifier',
        ],
      },
    ],
  },
};
