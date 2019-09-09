import { omitBy } from 'lodash';
import {
  convertFromExport,
  convertToExport,
} from '../../../../../utils/assistant';

export default function assistantDefinition(
  resourceId,
  resource,
  assistantData
) {
  const { assistant, adaptorType } = resource;
  const fields = [
    { formId: 'common' },
    {
      id: 'assistantMetadata.assistant',
      type: 'text',
      value: assistant,
      visible: false,
    },
    {
      id: 'assistantMetadata.adaptorType',
      type: 'text',
      value: adaptorType === 'HTTPExport' ? 'http' : 'rest',
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
    const assistantConfig = convertFromExport(
      resource,
      assistantData,
      adaptorType === 'HTTPExport' ? 'http' : 'rest'
    );
    const { labels = {} } = assistantData.export;

    if (assistantData.export.versions.length > 1) {
      const versionField = {
        fieldId: 'assistantMetadata.version',
        value: assistantConfig.version,
        required: true,
      };

      if (labels.version) {
        versionField.label = labels.version;
      }

      fields.push(versionField);
    }

    const resourceField = {
      fieldId: 'assistantMetadata.resource',
      refreshOptionsOnChangesTo: ['assistantMetadata.version'],
      value: assistantConfig.resource,
      required: true,
    };

    if (labels.resource) {
      resourceField.label = labels.resource;
    }

    fields.push(resourceField);

    const endpointField = {
      fieldId: 'assistantMetadata.operation',
      refreshOptionsOnChangesTo: [
        'assistantMetadata.version',
        'assistantMetadata.resource',
      ],
      value: assistantConfig.operation || assistantConfig.operationUrl,
      required: true,
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
        assistantConfig.endpoint.supportedExportTypes &&
        assistantConfig.endpoint.supportedExportTypes.length > 0
      ) {
        const exportTypeOptions = [{ value: 'all', label: 'All' }];

        if (assistantConfig.endpoint.supportedExportTypes.includes('delta')) {
          exportTypeOptions.push({ value: 'delta', label: 'Delta' });
        }

        if (assistantConfig.endpoint.supportedExportTypes.includes('test')) {
          exportTypeOptions.push({ value: 'test', label: 'Test' });
        }

        fields.push({
          fieldId: 'assistantMetadata.exportType',
          options: [
            {
              items: exportTypeOptions,
            },
          ],
          value: assistantConfig.exportType || 'all',
          refreshOptionsOnChangesTo: [
            'assistantMetadata.version',
            'assistantMetadata.resource',
            'assistantMetadata.operation',
          ],
          required: true,
        });
      }

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
            required: !!pathParam.required,
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
          defaultValuesForDeltaExport:
            assistantConfig.exportType === 'delta' &&
            assistantConfig.endpoint.delta &&
            assistantConfig.endpoint.delta.defaults
              ? assistantConfig.endpoint.delta.defaults
              : {},
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
      const values = {};

      [
        'assistant',
        'adaptorType',
        'version',
        'resource',
        'operation',
        'exportType',
      ].forEach(key => {
        values[key] = (
          fields.find(field => field.id === `assistantMetadata.${key}`) || {}
        ).value;
      });

      return values;
    },
    preSubmit: formValues => {
      const assistantMetadata = {
        adaptorType: formValues['/assistantMetadata/adaptorType'],
        assistant: formValues['/assistantMetadata/assistant'],
        version: formValues['/assistantMetadata/version'],
        resource: formValues['/assistantMetadata/resource'],
        operation: formValues['/assistantMetadata/operation'],
        exportType: formValues['/assistantMetadata/exportType'],
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

      const exportDoc = convertToExport({
        ...assistantMetadata,
        assistantData: formValues['/assistantMetadata/assistantData'],
      });

      return { ...otherFormValues, ...exportDoc };
    },
  };
}
