import { isArray, isEmpty } from 'lodash';
import uniqBy from 'lodash/uniqBy';
import {
  convertFromImport,
  PARAMETER_LOCATION,
} from '../../../../../utils/assistant';

export function hiddenFieldsMeta({ values }) {
  return ['assistant', 'adaptorType', 'assistantData', 'lookups'].map(fieldId => ({
    id: `assistantMetadata.${fieldId}`,
    type: 'text',
    value: values[fieldId],
    visible: false,
  }));
}

export function basicFieldsMeta({ assistant, assistantConfig, assistantData }) {
  const fieldDefinitions = {
    version: {
      fieldId: 'assistantMetadata.version',
      value: assistantConfig.version,
      required: true,
    },
    resource: {
      fieldId: 'assistantMetadata.resource',
      value: assistantConfig.resource,
      required: true,
    },
    operation: {
      fieldId: 'assistantMetadata.operation',
      value: assistantConfig.operation || assistantConfig.operationUrl,
      required: true,
    },
  };
  const { labels = {}, versions = [], helpTexts = {} } = assistantData;

  return Object.keys(fieldDefinitions).map(fieldId => {
    if (fieldId === 'version') {
      fieldDefinitions[fieldId].visible = versions.length > 1;

      if (!fieldDefinitions[fieldId].value && versions.length === 1) {
        fieldDefinitions[fieldId].value = versions[0].version;
      }
    }

    if (labels[fieldId]) {
      fieldDefinitions[fieldId].label = labels[fieldId];
    }

    fieldDefinitions[fieldId].helpKey = `${assistant}.import.${fieldId}`;

    if (helpTexts[fieldId]) {
      fieldDefinitions[fieldId].helpText = helpTexts[fieldId];
    }

    return fieldDefinitions[fieldId];
  });
}
export function headerFieldsMeta({operationDetails, headers = []}) {
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
export function pathParameterFieldsMeta({ operationParameters = [], values }) {
  return operationParameters
    .filter(pathParam => pathParam.in === 'path' && !pathParam.isIdentifier)
    .map(pathParam => {
      const pathParamField = {
        id: `assistantMetadata.pathParams.${pathParam.id}`,
        label: pathParam.name,
        type: 'textwithflowsuggestion',
        showLookup: false,
        value: values[pathParam.id],
        required: !!pathParam.required,
        helpText: pathParam.description,
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

      if (pathParam.suggestions && pathParam.suggestions.length > 0) {
        pathParamField.type = 'autosuggest';
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

export function ignoreConfigFieldsMeta({ operationDetails = {}, values = {} }) {
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

export function howToFindIdentifierFieldsMeta({
  operationDetails,
  pathParameterValues = {},
  lookupType,
  lookupQueryParameterValues = {},
}) {
  const lookupTypeOptions = [];
  const fields = [];

  if (operationDetails.howToFindIdentifier && !isEmpty(operationDetails.howToFindIdentifier)) {
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

  if (lookupTypeOptions.length > 0) {
    fields.push(lookupTypeField);

    if (lookupTypeOptions.find(opt => opt.value === 'source')) {
      const identifierPathParam = operationDetails.parameters.find(
        p => !!p.isIdentifier
      );
      const identifierField = {
        id: `assistantMetadata.pathParams.${identifierPathParam.id}`,
        label: 'Which field?',
        type: 'textwithflowsuggestion',
        showSuggestionsWithoutHandlebar: true,
        showLookup: false,
        required: true,
        helpText: `Specify the field – or field path for nested fields – in your exported data that contains the information necessary to identify which records in the destination application will be ignored when importing data. integrator.io will check each exported record to see whether the field is populated. If so, the record will be ignored; otherwise, it will be imported. For example, if you specify the field customerID, then integrator.io will check the destination app for the value of the customerID field of each exported record before importing (field does not have a value) or ignoring (field has a value). <br/>
        If a field contains special characters, enclose it in square brackets: [field-name]. Brackets can also indicate an array item, such as items[*].id.`,
        value: pathParameterValues[identifierPathParam.id],
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

      fields.push(identifierField);
    }

    if (lookupTypeOptions.find(opt => opt.value === 'lookup')) {
      const configureLookupQueryParametersField = {
        fieldId: 'assistantMetadata.lookupQueryParams',
        label: 'Configure search parameters',
        // required: hasRequiredParameters,
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
  let { adaptorType } = resource;
  let headers;

  if (adaptorType === 'RESTImport') {
    adaptorType = 'rest';
    headers = resource.rest?.headers || [];
  } else {
    adaptorType = 'http';
    headers = resource.http?.headers || [];
  }

  const hiddenFields = hiddenFieldsMeta({
    values: { assistant, adaptorType, assistantData, lookups },
  });
  let basicFields = [];
  let pathParameterFields = [];
  let headerFields = [];
  let ignoreConfigFields = [];
  let howToFindIdentifierFields = [];

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

    console.log('operation Details', operationDetails);
    if (operationDetails) {
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
    apiIdentifier: { fieldId: 'apiIdentifier' },
    traceKeyTemplate: { fieldId: 'traceKeyTemplate' },
  };
  const fieldIds = [];

  fields.forEach(field => {
    fieldMap[field.id || field.fieldId] = field;
    fieldIds.push(field.id || field.fieldId);
  });

  fieldMap.settings = {
    fieldId: 'settings',
  };

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
          fields: [...fieldIds],
        },
        {
          collapsed: true,
          label: 'Advanced',
          fields: ['traceKeyTemplate', 'apiIdentifier'],
        },
      ],
    },
  };
}
