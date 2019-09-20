import { omitBy, isEmpty, isArray } from 'lodash';
import {
  convertFromImport,
  convertToImport,
  PARAMETER_LOCATION,
} from '../../../../../utils/assistant';

export default function assistantDefinition(
  resourceId,
  resource,
  assistantData
) {
  const { assistant, adaptorType } = resource;
  const fields = [
    {
      id: 'assistantMetadata.assistant',
      type: 'text',
      value: assistant,
      visible: false,
    },
    {
      id: 'assistantMetadata.adaptorType',
      type: 'text',
      value: adaptorType === 'HTTPImport' ? 'http' : 'rest',
      visible: false,
    },
  ];

  if (assistantData && assistantData.import) {
    fields.push({
      id: 'assistantMetadata.assistantData',
      type: 'text',
      value: assistantData,
      visible: false,
    });
    const assistantConfig = convertFromImport({
      importDoc: resource,
      assistantData,
      adaptorType: adaptorType === 'HTTPImport' ? 'http' : 'rest',
    });

    console.log(
      `convertFromImport assistantConfig ${JSON.stringify(assistantConfig)}`
    );

    const { operationDetails } = assistantConfig;
    const { labels = {} } = assistantData.import;

    if (assistantData.import.versions.length > 1) {
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
        operationDetails.parameters &&
        operationDetails.parameters.length > 0
      ) {
        operationDetails.parameters.forEach(pathParam => {
          if (pathParam.in === 'path' && !pathParam.isIdentifier) {
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
          }
        });
      }

      if (operationDetails.supportIgnoreExisting) {
        fields.push({
          fieldId: 'assistantMetadata.ignoreExisting',
          value: !!assistantConfig.ignoreExisting,
        });
      } else if (operationDetails.supportIgnoreMissing) {
        fields.push({
          fieldId: 'assistantMetadata.ignoreMissing',
          value: !!assistantConfig.ignoreMissing,
        });
      }

      if (operationDetails.howToFindIdentifier) {
        let lookupUrl;
        const lookupTypeOptions = [];

        if (
          operationDetails.howToFindIdentifier.lookup &&
          (operationDetails.howToFindIdentifier.lookup.id ||
            operationDetails.howToFindIdentifier.lookup.url)
        ) {
          lookupUrl =
            operationDetails.howToFindIdentifier.lookup.id ||
            operationDetails.howToFindIdentifier.lookup.url;
          fields.push({
            id: 'assistantMetadata.lookupUrl',
            value: lookupUrl,
            visible: false,
          });
        }

        if (
          operationDetails.supportIgnoreMissing ||
          (operationDetails.method &&
            isArray(operationDetails.method) &&
            operationDetails.method.length > 1)
        ) {
          lookupTypeOptions.push({
            value: 'source',
            label: 'Records have a specific field populated',
          });

          if (lookupUrl) {
            lookupTypeOptions.push({
              value: 'lookup',
              label: 'Run a dynamic search against the import application',
            });
          }

          if (
            !!assistantData.ignoreMissing ||
            (operationDetails &&
              operationDetails.url &&
              (operationDetails.url.indexOf(':_') >= 0 ||
                (operationDetails.url &&
                  operationDetails.url[0] &&
                  operationDetails.url[0].indexOf(':_') >= 0)))
          ) {
            fields.push({
              fieldId: 'assistantMetadata.lookupType',
              required: true,
              value: assistantConfig.lookupType,
              options: [{ items: lookupTypeOptions }],
            });
          }
        } else if (assistantConfig.ignoreExisting) {
          lookupTypeOptions.push({
            value: 'source',
            label: 'Ignore records that have a specific field populated',
          });

          if (lookupUrl) {
            lookupTypeOptions.push({
              value: 'lookup',
              label: 'Run a dynamic search against the import application',
            });
          }

          fields.push({
            fieldId: 'assistantMetadata.lookupType',
            required: true,
            value: assistantConfig.lookupType,
            options: [{ items: lookupTypeOptions }],
          });
        } else if (operationDetails.askForHowToGetIdentifier) {
          // mostly DELETE case
          lookupTypeOptions.push({
            value: 'source',
            label: 'Records have a specific field populated',
          });

          if (lookupUrl) {
            lookupTypeOptions.push({
              value: 'lookup',
              label: 'Run a dynamic search against the import application',
            });
          }

          fields.push({
            fieldId: 'assistantMetadata.lookupType',
            label: 'How should we get record identifier?',
            required: true,
            value: assistantConfig.lookupType,
            options: [{ items: lookupTypeOptions }],
          });
        }

        if (assistantConfig.lookupType === 'source') {
          const identifierPathParam = operationDetails.parameters.find(
            p => !!p.isIdentifier
          );

          fields.push({
            id: `assistantMetadata.pathParams.${identifierPathParam.id}`,
            label: 'Which field?',
            type: 'text',
            required: true,
            value: assistantConfig.pathParams[identifierPathParam.id],
            placeholder: 'Enter field id, or JSON path if field is nested',
          });
        } else if (assistantConfig.lookupType === 'lookup') {
          const configureLookupQueryParametersField = {
            fieldId: 'assistantMetadata.lookupQueryParams',
            label: 'Configure Search Parameters',
            // required: hasRequiredParameters,
            value: !isEmpty(assistantConfig.lookupQueryParams)
              ? assistantConfig.lookupQueryParams
              : undefined,
            paramMeta: {
              paramLocation: PARAMETER_LOCATION.QUERY,
              fields: operationDetails.lookupOperationDetails.queryParameters,
            },
          };

          fields.push(configureLookupQueryParametersField);
        }
      }
    }
  }

  return {
    fields: [{ formId: 'common' }],
    fieldSets: [
      {
        header: 'How would you like the data imported?',
        collapsed: false,
        fields,
      },
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
        'ignoreExisting',
        'ignoreMissing',
        'lookupType',
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
        'queryParams',
        'bodyParams',
        'ignoreExisting',
        'ignoreMissing',
        'lookupType',
        'lookupUrl',
        'lookupQueryParams',
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

      const importDoc = convertToImport({
        assistantConfig: {
          ...assistantMetadata,
          assistantData: formValues['/assistantMetadata/assistantData'],
        },
      });

      // return {};

      return { ...otherFormValues, ...importDoc };
    },
  };
}
