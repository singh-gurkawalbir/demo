import { omitBy } from 'lodash';
import {
  convertFromExport,
  convertToExport,
  SEARCH_PARAMETER_TYPES,
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
    const assistantConfig = convertFromExport({
      resourceDoc: resource,
      assistantData,
      adaptorType: adaptorType === 'HTTPExport' ? 'http' : 'rest',
    });
    const { operationDetails } = assistantConfig;
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

    const operationField = {
      fieldId: 'assistantMetadata.operation',
      refreshOptionsOnChangesTo: [
        'assistantMetadata.version',
        'assistantMetadata.resource',
      ],
      value: assistantConfig.operation || assistantConfig.operationUrl,
      required: true,
    };

    if (labels.endpoint) {
      operationField.label = labels.endpoint;
    }

    if (operationDetails) {
      operationField.operationDetails = operationDetails;
    }

    fields.push(operationField);

    if (operationDetails) {
      if (
        operationDetails.supportedExportTypes &&
        operationDetails.supportedExportTypes.length > 0
      ) {
        const exportTypeOptions = [{ value: 'all', label: 'All' }];

        if (operationDetails.supportedExportTypes.includes('delta')) {
          exportTypeOptions.push({ value: 'delta', label: 'Delta' });
        }

        if (operationDetails.supportedExportTypes.includes('test')) {
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
        operationDetails.pathParameters &&
        operationDetails.pathParameters.length > 0
      ) {
        operationDetails.pathParameters.forEach(pathParam => {
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
        operationDetails.queryParameters &&
        operationDetails.queryParameters.length > 0
      ) {
        fields.push({
          id: 'assistantMetadata.queryParams',
          label: operationDetails.queryParametersLabel,
          type: 'assistantsearchparams',
          value: assistantConfig.queryParams,
          fieldMeta: operationDetails.queryParameters,
          defaultValuesForDeltaExport:
            assistantConfig.exportType === 'delta' &&
            operationDetails.delta &&
            operationDetails.delta.defaults
              ? operationDetails.delta.defaults
              : {},
        });
      } else if (
        operationDetails.bodyParameters &&
        operationDetails.bodyParameters.length > 0
      ) {
        fields.push({
          id: 'assistantMetadata.bodyParams',
          label: operationDetails.bodyParametersLabel,
          type: 'assistantsearchparams',
          paramsType: SEARCH_PARAMETER_TYPES.BODY,
          value: assistantConfig.bodyParams,
          fieldMeta: operationDetails.bodyParameters,
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
        assistantConfig: {
          ...assistantMetadata,
          assistantData: formValues['/assistantMetadata/assistantData'],
        },
      });

      return { ...otherFormValues, ...exportDoc };
    },
  };
}
