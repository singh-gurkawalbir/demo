import { getResourceFromAlias } from '../../../utils/resource';

export default function getFieldMeta(resourceId, resourceType, aliasData, isEdit) {
  const fieldMeta = {
    fieldMap: {
      aliasId: {
        id: 'aliasId',
        name: 'aliasId',
        type: 'aliasid',
        label: 'Alias ID',
        defaultValue: aliasData?.alias,
        helpKey: 'alias.aliasId',
        isEdit,
        required: true,
        noApi: true,
        aliasContextResourceId: resourceId,
        aliasContextResourceType: resourceType,
        aliasData,
      },
      description: {
        id: 'description',
        name: 'description',
        type: 'text',
        label: 'Alias description',
        defaultValue: aliasData?.description,
        helpKey: 'alias.description',
        noApi: true,
      },
      aliasResourceType: {
        id: 'aliasResourceType',
        name: 'aliasResourceType',
        type: 'select',
        label: 'Resource type',
        helpKey: 'alias.resourceType',
        defaultValue: getResourceFromAlias(aliasData).resourceType || '',
        options: [{
          items: [
            {
              label: 'Connection',
              value: 'connections',
            },
            {
              label: 'Export',
              value: 'exports',
            },
            {
              label: 'Flow',
              value: 'flows',
            },
            {
              label: 'Import',
              value: 'imports',
            },
          ],
        }],
        required: true,
        noApi: true,
      },
      aliasResourceName: {
        id: 'aliasResourceName',
        name: 'aliasResourceName',
        type: 'selectaliasresource',
        label: 'Resource name',
        helpKey: 'alias.resource',
        defaultValue: getResourceFromAlias(aliasData).id,
        aliasContextResourceId: resourceId,
        aliasContextResourceType: resourceType,
        required: true,
        noApi: true,
        visibleWhen: [
          {
            field: 'aliasResourceType',
            isNot: [''],
          },
        ],
      },
    },
    layout: {
      containers: [
        {
          fields: [
            'aliasId', 'description', 'aliasResourceType',
          ],
        },
        {
          type: 'indent',
          containers: [
            {
              fields: [
                'aliasResourceName',
              ],
            },
          ],
        },
      ],
    },
  };

  return fieldMeta;
}
