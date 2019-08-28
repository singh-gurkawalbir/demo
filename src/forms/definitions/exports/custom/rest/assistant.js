import { convertFromRestExport } from '../../../../../utils/assistants';
/* export default {
  fields: [
    {
      id: 'rest.assistant.assistant',
      type: 'text',
      defaultValue: r => r && r.assistant,
    },
    {
      fieldId: 'rest.assistant.apiVersion',
      assistantFieldType: 'apiVersion',
      defaultValue: r => {
        if (r && r.assistantMetadata && r.assistantMetadata.version) {
          return r.assistantMetadata.version;
        }

        return '';
      },
    },
    {
      fieldId: 'rest.assistant.apiName',
      assistantFieldType: 'apiName',
      refreshOptionsOnChangesTo: ['rest.assistant.apiVersion'],
      defaultValue: r => {
        if (r && r.assistantMetadata) {
          return r.assistantMetadata.resource;
        }

        return '';
      },
    },
  ],
  optionsHandler(fieldId, fields) {
    console.log(`iio optionsHandler ${fieldId} ${JSON.stringify(fields)}`);
    const { value: assistant } =
      fields.find(field => field.id === 'rest.assistant.assistant') || {};
    const { value: apiVersion } =
      fields.find(field => field.id === 'rest.assistant.apiVersion') || {};

    return { assistant, apiVersion };
  },
};
*/

export default function assistantDefinition(resource, assistantData) {
  const { assistant } = resource;

  console.log(`assistant in assistantDefinition ${JSON.stringify(assistant)}`);
  console.log(
    `assistantData in assistantDefinition ${JSON.stringify(assistantData)}`
  );

  const fields = [
    {
      id: 'rest.assistant.assistant',
      type: 'text',
      // defaultValue: r => r && r.assistant,
      value: assistant,
    },
  ];

  if (assistantData && assistantData.export) {
    const assistantConfig = convertFromRestExport(resource, assistantData);

    console.log(`assistantConfig ${JSON.stringify(assistantConfig)}`);

    const { labels = {} } = assistantData.export;

    if (assistantData.export.versions.length > 1) {
      const versionField = {
        fieldId: 'rest.assistant.version',
        assistantFieldType: 'version',
        value: assistantConfig.version,
      };

      if (labels.version) {
        versionField.label = labels.version;
      }

      fields.push(versionField);
    }

    const resourceField = {
      fieldId: 'rest.assistant.resource',
      assistantFieldType: 'resource',
      refreshOptionsOnChangesTo: ['rest.assistant.version'],
      value: assistantConfig.resource,
    };

    if (labels.resource) {
      resourceField.label = labels.resource;
    }

    fields.push(resourceField);

    const endpointField = {
      fieldId: 'rest.assistant.endpoint',
      assistantFieldType: 'endpoint',
      refreshOptionsOnChangesTo: [
        'rest.assistant.version',
        'rest.assistant.resource',
      ],
      value:
        assistantConfig.endpoint &&
        (assistantConfig.endpoint.id || assistantConfig.endpoint.url),
    };

    if (labels.endpoint) {
      endpointField.label = labels.endpoint;
    }

    fields.push(endpointField);

    if (
      assistantConfig.endpoint.pathParameters &&
      assistantConfig.endpoint.pathParameters.length > 0
    ) {
      assistantConfig.endpoint.pathParameters.forEach(pathParam => {
        const pathParamField = {
          id: `rest.assistant.pathParams.${pathParam.id}`,
          label: pathParam.name,
          type: 'text',
          value: assistantConfig.pathParams[pathParam.id],
          refreshOptionsOnChangesTo: [
            'rest.assistant.version',
            'rest.assistant.resource',
            'rest.assistant.endpoint',
          ],
        };

        if (pathParam.options && pathParam.options.length > 0) {
          pathParamField.type = 'select';
          pathParamField.options = [
            {
              items: pathParam.options.map(opt => ({
                label: opt,
                value: opt,
              })),
            },
          ];
        }

        fields.push(pathParamField);
      });
    }
  }

  return {
    fields,
    optionsHandler(fieldId, fields) {
      console.log(`iio optionsHandler ${fieldId} ${JSON.stringify(fields)}`);
      const { value: assistant } =
        fields.find(field => field.id === 'rest.assistant.assistant') || {};
      const { value: version } =
        fields.find(field => field.id === 'rest.assistant.version') || {};
      const { value: resource } =
        fields.find(field => field.id === 'rest.assistant.resource') || {};
      const { value: endpoint } =
        fields.find(field => field.id === 'rest.assistant.endpoint') || {};

      return { assistant, version, resource, endpoint };
    },
  };
}
