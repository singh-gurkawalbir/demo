import { isArray, isEmpty } from 'lodash';
import uniqBy from 'lodash/uniqBy';
import {
  convertFromImport,
  PARAMETER_LOCATION,
} from '../../../../../utils/assistant';

function hiddenFieldsMeta({ values }) {
  return ['assistant', 'adaptorType', 'assistantData', 'lookups'].map(fieldId => ({
    id: `assistantMetadata.${fieldId}`,
    type: 'text',
    value: values[fieldId],
    visible: false,
  }));
}

function basicFieldsMeta({ assistantConfig, assistantData }) {
  let resourceDefaultValue = assistantConfig.resource;
  let operationDefaultValue = assistantConfig.operation || assistantConfig.operationUrl;

  if (assistantData?.resources?.find(res => res.id === resourceDefaultValue)?.hidden) {
    resourceDefaultValue = assistantData?.resources?.find(res => res.id !== resourceDefaultValue && res.id.includes(resourceDefaultValue))?.id;
  }
  const resourceObj = assistantData?.resources?.find(res => res.id === resourceDefaultValue);

  if (resourceObj?.operations?.find(ep => ep.id === operationDefaultValue)?.hidden) {
    operationDefaultValue = resourceObj?.operations?.find(ep => ep.id !== operationDefaultValue && ep.id.includes(operationDefaultValue))?.id;
  }
  const fieldDefinitions = {
    resource: {
      fieldId: 'assistantMetadata.resource',
      value: resourceDefaultValue,
      required: true,
      type: 'hfoptions',
      label: 'Resource',
      helpKey: 'import.http._httpConnectorResourceId',
    },
    operation: {
      fieldId: 'assistantMetadata.operation',
      type: 'hfoptions',
      value: operationDefaultValue,
      required: true,
      label: 'API endpoint',
      helpKey: 'import.http._httpConnectorEndpointId',
    },
    version: {
      fieldId: 'assistantMetadata.version',
      value: assistantConfig.version,
      type: 'hfoptions',
      required: true,
      helpKey: 'import.http._httpConnectorVersionId',
    },
    createEndpoint: {
      fieldId: 'assistantMetadata.createEndpoint',
      type: 'hfoptions',
      assistantFieldType: 'createEndpoint',
      value: assistantConfig.createEndpoint,
      label: 'API endpoint for create new records',
      helpText: 'API endpoint for create new records - Select the API endpoint that should be used for creating new records. For more information, see <a href="https://docs.celigo.com/hc/en-us/articles/10841316566043#Composite" target="_blank">Composite API endpoints</a>.',
      visibleWhen: [{
        field: 'assistantMetadata.operation',
        is: ['create-update-id'],
      }],
      required: true,
    },
    updateEndpoint: {
      fieldId: 'assistantMetadata.updateEndpoint',
      type: 'hfoptions',
      assistantFieldType: 'updateEndpoint',
      value: assistantConfig.updateEndpoint,
      label: 'API endpoint for update existing records',
      helpText: 'API endpoint for update existing records - Select the API endpoint that should be used for updating existing records. For more information, see <a href="https://docs.celigo.com/hc/en-us/articles/10841316566043#Composite" target="_blank">Composite API endpoints</a>',
      visibleWhen: [{
        field: 'assistantMetadata.operation',
        is: ['create-update-id'],
      }],
      required: true,
    },
  };
  const { labels = {}, versions = [], helpTexts = {} } = assistantData;

  return Object.keys(fieldDefinitions).map(fieldId => {
    if (fieldId === 'version') {
      fieldDefinitions[fieldId].visible = versions.length > 1;

      if (!fieldDefinitions[fieldId].value && versions.length === 1) {
        fieldDefinitions[fieldId].value = versions[0]._id;
      }
    }

    if (labels[fieldId]) {
      fieldDefinitions[fieldId].label = labels[fieldId];
    }

    if (helpTexts[fieldId]) {
      fieldDefinitions[fieldId].helpText = helpTexts[fieldId];
    }

    return fieldDefinitions[fieldId];
  });
}

function headerFieldsMeta({ operationDetails, headers = [] }) {
  const editableHeaders = Object.keys(operationDetails?.headers || {})
    .filter(key => !operationDetails.headers[key]);
  const userEditableHeaderValues = headers.filter(header => editableHeaders.includes(header.name));
  const headersValue = uniqBy([
    ...userEditableHeaderValues,
    ...editableHeaders
      .map(key => ({
        name: key,
        value: operationDetails.headers[key],
      })),
  ], 'name');

  if (editableHeaders.length) {
    return [{
      id: 'assistantMetadata.headers',
      type: 'assistantHeaders',
      keyName: 'name',
      validate: true,
      headersMetadata: operationDetails?.headersMetadata,
      valueName: 'value',
      label: 'Configure HTTP headers',
      value: headersValue,
      required: true,
    }];
  }

  return [];
}

function pathParameterFieldsMeta({ operationParameters = [], values }) {
  return operationParameters
    .filter(pathParam => pathParam.in === 'path' && !pathParam.isIdentifier)
    .map(pathParam => {
      const pathParamField = {
        id: `assistantMetadata.pathParams.${pathParam.id}`,
        label: pathParam.label || pathParam.name,
        type: 'hfpathparams',
        showLookup: false,
        value: values[pathParam.id],
        required: !!pathParam.required,
        helpText: pathParam.description,
      };

      if (pathParam.options && pathParam.options.length > 0) {
        pathParamField.options = [
          {
            items: pathParam.options.map(opt => ({
              label: opt,
              value: opt,
            })),
          },
        ];
      }

      if (pathParam.suggestions && pathParam.suggestions.length > 0) {
        pathParamField.labelName = 'name';
        pathParamField.valueName = 'value';
        pathParamField.options = {
          suggestions: pathParam.suggestions.map(s => ({
            name: s,
            value: s,
          })),
        };
      }

      return pathParamField;
    });
}

function ignoreConfigFieldsMeta({ operationDetails = {}, values = {} }) {
  const fields = [];

  if (operationDetails.supportIgnoreExisting) {
    fields.push({
      fieldId: 'assistantMetadata.ignoreExisting',
      value: !!values.ignoreExisting,
    });
  } else if (operationDetails.supportIgnoreMissing) {
    fields.push({
      fieldId: 'assistantMetadata.ignoreMissing',
      value: !!values.ignoreMissing,
    });
  }

  return fields;
}

function howToFindIdentifierFieldsMeta({
  operationDetails,
  pathParameterValues = {},
  lookupType,
  identifierValue,
  lookupQueryParameterValues = {},
}) {
  const lookupTypeOptions = [];
  const fields = [];

  if (operationDetails.howToFindIdentifier) {
    if (operationDetails.supportIgnoreExisting) {
      lookupTypeOptions.push({
        value: 'source',
        label: 'Ignore records that have a specific field populated',
      });
    } else if (
      operationDetails.supportIgnoreMissing ||
      operationDetails.askForHowToGetIdentifier ||
      (operationDetails.method &&
        isArray(operationDetails.method) &&
        operationDetails.method.length > 1)
    ) {
      lookupTypeOptions.push({
        value: 'source',
        label: 'Records have a specific field populated',
      });
    }

    if (
      operationDetails.howToFindIdentifier.lookup &&
      (operationDetails.howToFindIdentifier.lookup.id ||
        operationDetails.howToFindIdentifier.lookup.url)
    ) {
      lookupTypeOptions.push({
        value: 'lookup',
        label: 'Run a dynamic search against the import application',
      });
    }
  }

  const lookupTypeField = {
    fieldId: 'assistantMetadata.lookupType',
    required: true,
    value: lookupType,
    options: [{ items: lookupTypeOptions }],
  };

  if (operationDetails.supportIgnoreExisting) {
    lookupTypeField.visibleWhen = [
      {
        field: 'assistantMetadata.ignoreExisting',
        is: [true],
      },
    ];
  }
  const endPointHasQueryParams = operationDetails.url?.indexOf?.(':_') >= 0 || operationDetails.url?.[0]?.indexOf?.(':_') >= 0;

  if (operationDetails.supportIgnoreExisting || operationDetails.askForHowToGetIdentifier || endPointHasQueryParams || operationDetails.howToIdentifyExistingRecords) {
    if (lookupTypeOptions.length) {
      fields.push(lookupTypeField);
    }

    if (lookupTypeOptions.find(opt => opt.value === 'source') && operationDetails.parameters) {
      const identifierPathParam = operationDetails.parameters.find(
        p => !!p.isIdentifier
      );
      const identifierFieldId = `assistantMetadata.${operationDetails.howToIdentifyExistingRecords ? 'existingExtract' : `pathParams.${identifierPathParam?.id}`}`;
      const identifierFieldValue = operationDetails.howToIdentifyExistingRecords ? (identifierValue || pathParameterValues[identifierPathParam?.id]) : pathParameterValues[identifierPathParam?.id];
      const identifierField = {
        id: identifierFieldId,
        label: 'Which field?',
        type: 'textwithflowsuggestion',
        showSuggestionsWithoutHandlebar: true,
        showLookup: false,
        required: true,
        helpText: `Specify the field – or field path for nested fields – in your exported data that contains the information necessary to identify which records in the destination application will be ignored when importing data. integrator.io will check each exported record to see whether the field is populated. If so, the record will be ignored; otherwise, it will be imported. For example, if you specify the field customerID, then integrator.io will check the destination app for the value of the customerID field of each exported record before importing (field does not have a value) or ignoring (field has a value). <br/>
        If a field contains special characters, enclose it in square brackets: [field-name]. Brackets can also indicate an array item, such as items[*].id.`,
        value: identifierFieldValue,
        visibleWhenAll: [
          {
            field: 'assistantMetadata.lookupType',
            is: ['source'],
          },
        ],
        placeholder: 'Enter field id, or JSON path if field is nested',
      };

      if (operationDetails.supportIgnoreExisting) {
        identifierField.visibleWhenAll.push({
          field: 'assistantMetadata.ignoreExisting',
          is: [true],
        });
      }

      if (identifierField) { fields.push(identifierField); }
    }

    if (lookupTypeOptions.find(opt => opt.value === 'lookup')) {
      const configureLookupQueryParametersField = {
        fieldId: 'assistantMetadata.lookupQueryParams',
        label: 'Query parameters',
        type: 'hfsearchparams',
        keyName: 'name',
        valueName: 'value',
        keyPlaceholder: 'Search, select or add a name',
        value: !isEmpty(lookupQueryParameterValues)
          ? lookupQueryParameterValues
          : undefined,
        paramMeta: {
          paramLocation: PARAMETER_LOCATION.QUERY,
          fields: operationDetails.lookupOperationDetails.queryParameters,
        },
        visibleWhenAll: [
          {
            field: 'assistantMetadata.lookupType',
            is: ['lookup'],
          },
        ],
      };

      if (operationDetails.supportIgnoreExisting) {
        configureLookupQueryParametersField.visibleWhenAll.push({
          field: 'assistantMetadata.ignoreExisting',
          is: [true],
        });
      }

      fields.push(configureLookupQueryParametersField);
    }
  }

  return fields;
}

export function fieldMeta({ resource, assistantData }) {
  const { assistant, lookups } = resource;

  const adaptorType = 'http';
  const headers = resource.http?.headers || [];

  const hiddenFields = hiddenFieldsMeta({
    values: {
      assistant,
      adaptorType: 'http',
      assistantData,
      lookups,
    },
  });
  let basicFields = [];
  let pathParameterFields = [];
  let headerFields = [];
  let ignoreConfigFields = [];
  let howToFindIdentifierFields = [];
  let supportsEndpointLevelAsyncHelper = false;

  if (assistantData && assistantData.import) {
    const assistantConfig = convertFromImport({
      importDoc: resource,
      assistantData,
      adaptorType,
    });

    basicFields = basicFieldsMeta({
      assistant,
      assistantConfig,
      assistantData: assistantData.import,
    });

    const { operationDetails = {} } = assistantConfig;

    if (operationDetails) {
      supportsEndpointLevelAsyncHelper = operationDetails.supportsAsyncHelper;

      headerFields = headerFieldsMeta({
        headers,
        operationDetails,
        assistantConfig,
      });
      pathParameterFields = pathParameterFieldsMeta({
        operationParameters: operationDetails.parameters,
        values: assistantConfig.pathParams,
      });
      ignoreConfigFields = ignoreConfigFieldsMeta({
        operationDetails,
        values: assistantConfig,
      });
      howToFindIdentifierFields = howToFindIdentifierFieldsMeta({
        operationDetails,
        pathParameterValues: assistantConfig.pathParams,
        lookupType: assistantConfig.lookupType,
        identifierValue: assistantConfig.identifierValue,
        lookupQueryParameterValues: assistantConfig.lookupQueryParams,
      });
    }
  }

  const fields = [
    ...hiddenFields,
    ...basicFields,
    ...headerFields,
    ...pathParameterFields,
    ...ignoreConfigFields,
    ...howToFindIdentifierFields,
  ];
  const fieldMap = {
    common: {
      formId: 'common',
    },
    formView: { fieldId: 'formView' },
    dataMappings: { formId: 'dataMappings' },
    'http.ignoreEmptyNodes': { fieldId: 'http.ignoreEmptyNodes' },
    advancedSettings: {
      formId: 'advancedSettings',
    },
    'http.configureAsyncHelper': { fieldId: 'http.configureAsyncHelper',
      defaultValue: r => !!(r && r.http && r.http._asyncHelperId) || supportsEndpointLevelAsyncHelper,
      visible: r => !(r && r.statusExport) && !supportsEndpointLevelAsyncHelper },
    'http._asyncHelperId': { fieldId: 'http._asyncHelperId', required: supportsEndpointLevelAsyncHelper },
  };
  const fieldIds = [];

  fields.forEach(field => {
    fieldMap[field.id || field.fieldId] = field;
    fieldIds.push(field.id || field.fieldId);
  });

  fieldMap.settings = {
    fieldId: 'settings',
  };

  fieldMap.mockResponseSection = {formId: 'mockResponseSection'};

  if (supportsEndpointLevelAsyncHelper) {
    const index = fieldIds.findIndex(fld => fld === 'assistantMetadata.updateEndpoint');

    fieldIds.splice(index + 1, 0, 'http._asyncHelperId');
  }
  const createEndpointIndex = fieldIds.indexOf('assistantMetadata.createEndpoint');

  return {
    fieldMap,
    layout: {
      type: 'collapse',
      containers: [
        {
          collapsed: true,
          label: 'General',
          fields: ['common', 'dataMappings', 'formView'],
        },
        {
          collapsed: true,
          label: 'How would you like the records imported?',
          containers: [{
            fields: fieldIds.slice(0, createEndpointIndex),
          }, {
            type: 'indent',
            containers: [{
              fields: ['assistantMetadata.createEndpoint',
                'assistantMetadata.updateEndpoint',
              ],
            }],
          },
          {
            fields: fieldIds.slice(createEndpointIndex + 2),
          },
          ],
        },
        {
          actionId: 'mockResponse',
          collapsed: true,
          label: 'Mock response',
          fields: ['mockResponseSection'],
        },
        {
          collapsed: true,
          label: 'Advanced',
          fields: ['http.ignoreEmptyNodes',
            'advancedSettings',
            ...(!supportsEndpointLevelAsyncHelper ? ['http.configureAsyncHelper', 'http._asyncHelperId'] : ['http.configureAsyncHelper'])],
        },
      ],
    },
  };
}
