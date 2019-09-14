import { omitBy, isEmpty } from 'lodash';
import {
  convertFromExport,
  convertToExport,
  PARAMETER_LOCATION,
} from '../../../../../utils/assistant';

const refGeneration = field => {
  const { fieldId, id, formId } = field;

  if (fieldId) return fieldId;
  else if (id) return id;
  else if (formId) return formId;
  throw new Error('cant generate reference');
};

const addMetaIntoFieldMapAndFields = (fieldMap, fields, newMeta) => {
  const id = refGeneration(newMeta);

  // eslint-disable-next-line no-param-reassign
  fieldMap[id] = newMeta;
  fields.push(id);
};

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
      exportDoc: resource,
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
        });
      }

      if (
        operationDetails.queryParameters &&
        operationDetails.queryParameters.length > 0
      ) {
        const hasRequiredParameters =
          operationDetails.queryParameters.filter(qp => !!qp.required).length >
          0;
        const configureQueryParametersField = {
          fieldId: 'assistantMetadata.searchParams',
          id: 'assistantMetadata.queryParams',
          label: operationDetails.queryParametersLabel,
          required: hasRequiredParameters,
          value: !isEmpty(assistantConfig.queryParams)
            ? assistantConfig.queryParams
            : undefined,
          paramMeta: {
            paramLocation: PARAMETER_LOCATION.QUERY,
            fields: operationDetails.queryParameters,
            defaultValuesForDeltaExport:
              assistantConfig.exportType === 'delta' &&
              operationDetails.delta &&
              operationDetails.delta.defaults
                ? operationDetails.delta.defaults
                : {},
          },
        };

        if (configureQueryParametersField.required) {
          configureQueryParametersField.validWhen = {
            isNot: {
              values: [undefined, {}],
            },
          };
        }

        fields.push(configureQueryParametersField);
      } else if (
        operationDetails.bodyParameters &&
        operationDetails.bodyParameters.length > 0
      ) {
        const hasRequiredParameters =
          operationDetails.bodyParameters.filter(qp => !!qp.required).length >
          0;
        const configureBodyParametersField = {
          fieldId: 'assistantMetadata.searchParams',
          id: 'assistantMetadata.bodyParams',
          label: operationDetails.bodyParametersLabel,
          required: hasRequiredParameters,
          value: !isEmpty(assistantConfig.bodyParams)
            ? assistantConfig.bodyParams
            : undefined,
          paramMeta: {
            paramLocation: PARAMETER_LOCATION.BODY,
            fields: operationDetails.bodyParameters,
            defaultValuesForDeltaExport:
              assistantConfig.exportType === 'delta' &&
              operationDetails.delta &&
              operationDetails.delta.defaults
                ? operationDetails.delta.defaults
                : {},
          },
        };

        if (configureBodyParametersField.required) {
          configureBodyParametersField.validWhen = {
            isNot: {
              values: [undefined, {}],
            },
          };
        }

        fields.push(configureBodyParametersField);
      }
    }
  }

  const fieldMap = {};
  const layoutFields = [];

  fields.forEach(field =>
    addMetaIntoFieldMapAndFields(fieldMap, layoutFields, field)
  );
  // we are adding hooks seperately because they should move into a container
  fieldMap.hooks = {
    formId: 'hooks',
  };

  const layout = {
    fields: layoutFields,
    type: 'collapse',
    containers: [
      {
        header: 'Hooks (Optional, Developers Only)',
        collapsed: false,
        fields: ['hooks'],
      },
    ],
  };

  return {
    fieldMap,
    layout,
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
        pathParams: {},
      };

      [
        'adaptorType',
        'assistant',
        'version',
        'resource',
        'operation',
        'exportType',
        'queryParams',
        'bodyParams',
      ].forEach(prop => {
        assistantMetadata[prop] = formValues[`/assistantMetadata/${prop}`];
      });
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
