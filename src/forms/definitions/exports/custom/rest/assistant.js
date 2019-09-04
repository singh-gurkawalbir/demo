import { omitBy } from 'lodash';
import {
  convertFromRestExport,
  convertToRestExport,
} from '../../../../../utils/assistants';

export default function assistantDefinition(
  resourceId,
  resource,
  assistantData
) {
  const { assistant } = resource;
  // console.log(`resourceId in assistantDefinition ${resourceId}`);
  // console.log(`resource in assistantDefinition ${JSON.stringify(resource)}`);
  const fields = [
    { formId: 'common' },
    {
      id: 'assistantMetadata.assistant',
      type: 'text',
      // defaultValue: r => r && r.assistant,
      value: assistant,
      visible: false,
    },
  ];

  if (assistantData && assistantData.export) {
    fields.push({
      id: 'assistantMetadata.assistantData',
      type: 'text',
      value: assistantData,
      visible: false,
    });
    const assistantConfig = convertFromRestExport(resource, assistantData);
    const { labels = {} } = assistantData.export;

    if (assistantData.export.versions.length > 1) {
      const versionField = {
        fieldId: 'assistantMetadata.version',
        assistantFieldType: 'version',
        value: assistantConfig.version,
        __resourceId: resourceId,
      };

      if (labels.version) {
        versionField.label = labels.version;
      }

      fields.push(versionField);
    }

    const resourceField = {
      fieldId: 'assistantMetadata.resource',
      assistantFieldType: 'resource',
      refreshOptionsOnChangesTo: ['assistantMetadata.version'],
      value: assistantConfig.resource,
      __resourceId: resourceId,
    };

    if (labels.resource) {
      resourceField.label = labels.resource;
    }

    fields.push(resourceField);

    const endpointField = {
      fieldId: 'assistantMetadata.operation',
      assistantFieldType: 'operation',
      refreshOptionsOnChangesTo: [
        'assistantMetadata.version',
        'assistantMetadata.resource',
      ],
      value: assistantConfig.operation,
      __resourceId: resourceId,
    };

    if (labels.endpoint) {
      endpointField.label = labels.endpoint;
    }

    if (assistantConfig.endpoint) {
      endpointField.endpoint = assistantConfig.endpoint;
    }

    fields.push(endpointField);

    if (assistantConfig.endpoint) {
      if (
        assistantConfig.endpoint.pathParameters &&
        assistantConfig.endpoint.pathParameters.length > 0
      ) {
        assistantConfig.endpoint.pathParameters.forEach(pathParam => {
          const pathParamField = {
            id: `assistantMetadata.pathParams.${pathParam.id}`,
            label: pathParam.name,
            type: 'text',
            value: assistantConfig.pathParams[pathParam.id],
            refreshOptionsOnChangesTo: [
              'assistantMetadata.version',
              'assistantMetadata.resource',
              'assistantMetadata.operation',
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

      if (
        assistantConfig.endpoint.queryParameters &&
        assistantConfig.endpoint.queryParameters.length > 0
      ) {
        fields.push({
          id: 'assistantMetadata.queryParams',
          label: assistantConfig.endpoint.queryParametersLabel,
          type: 'assistantsearchparams',
          value: assistantConfig.queryParams,
          fieldMeta: assistantConfig.endpoint.queryParameters,
          __resourceId: resourceId,
        });
      } else if (
        assistantConfig.endpoint.bodyParameters &&
        assistantConfig.endpoint.bodyParameters.length > 0
      ) {
        fields.push({
          id: 'assistantMetadata.bodyParams',
          label: assistantConfig.endpoint.bodyParametersLabel,
          type: 'assistantsearchparams',
          paramsType: 'body',
          value: assistantConfig.bodyParams,
          fieldMeta: assistantConfig.endpoint.bodyParameters,
          __resourceId: resourceId,
        });
      }
    }
  }

  return {
    fields,
    fieldSets: [
      {
        header: 'Hooks (Optional, Developers Only)',
        collapsed: false,
        fields: [{ formId: 'hooks' }],
      },
    ],
    optionsHandler(fieldId, fields) {
      const { value: assistant } =
        fields.find(field => field.id === 'assistantMetadata.assistant') || {};
      const { value: version } =
        fields.find(field => field.id === 'assistantMetadata.version') || {};
      const { value: resource } =
        fields.find(field => field.id === 'assistantMetadata.resource') || {};
      const { value: operation } =
        fields.find(field => field.id === 'assistantMetadata.operation') || {};

      return { assistant, version, resource, operation };
    },
    preSubmit: formValues => {
      const assistantMetadata = {
        assistant: formValues['/assistantMetadata/assistant'],
        version: formValues['/assistantMetadata/version'],
        resource: formValues['/assistantMetadata/resource'],
        operation: formValues['/assistantMetadata/operation'],
        pathParams: {},
        queryParams: formValues['/assistantMetadata/queryParams'],
        bodyParams: formValues['/assistantMetadata/bodyParams'],
      };
      const otherFormValues = omitBy(formValues, (v, k) =>
        k.includes('/assistantMetadata/')
      );

      Object.keys(formValues).forEach(key => {
        if (key.includes('/assistantMetadata/pathParams/')) {
          assistantMetadata.pathParams[
            key.replace('/assistantMetadata/pathParams/', '')
          ] = formValues[key];
        }
      });

      const restDoc = convertToRestExport({
        ...assistantMetadata,
        assistantData: formValues['/assistantMetadata/assistantData'],
      });

      return { ...otherFormValues, ...restDoc };
    },
  };
}
