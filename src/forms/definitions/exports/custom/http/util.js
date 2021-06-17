import { isEmpty } from 'lodash';
import {
  convertFromExport,
  PARAMETER_LOCATION,
} from '../../../../../utils/assistant';

export function hiddenFieldsMeta({ values }) {
  return ['assistant', 'adaptorType', 'assistantData'].map(fieldId => ({
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

    fieldDefinitions[fieldId].helpKey = `${assistant}.export.${fieldId}`;

    if (helpTexts[fieldId]) {
      fieldDefinitions[fieldId].helpText = helpTexts[fieldId];
    }

    return fieldDefinitions[fieldId];
  });
}

export function pathParameterFieldsMeta({ operationParameters = [], values }) {
  return operationParameters.map(pathParam => {
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

export function exportTypeFieldsMeta({
  supportedExportTypes = [],
  exportType,
}) {
  const exportTypeOptions = [{ value: 'all', label: 'All' }];

  if (supportedExportTypes.includes('delta')) {
    exportTypeOptions.push({ value: 'delta', label: 'Delta' });
  }

  if (supportedExportTypes.includes('test')) {
    exportTypeOptions.push({ value: 'test', label: 'Test' });
  }

  if (exportTypeOptions.length <= 1) {
    return [];
  }

  return [
    {
      helpKey: 'export.type',
      fieldId: 'assistantMetadata.exportType',
      options: [
        {
          items: exportTypeOptions,
        },
      ],
      value: exportType || 'all',
    },
  ];
}

export function searchParameterFieldsMeta({
  label,
  paramLocation,
  parameters = [],
  oneMandatoryQueryParamFrom,
  value,
  deltaDefaults = {},
  isDeltaExport,
}) {
  let searchParamsField;
  const defaultValue = {};

  parameters.forEach(p => {
    if (Object.prototype.hasOwnProperty.call(p, 'defaultValue')) {
      defaultValue[p.id] = p.defaultValue;
    }
  });

  if (parameters.length > 0) {
    searchParamsField = {
      fieldId: 'assistantMetadata.searchParams',
      id:
        paramLocation === PARAMETER_LOCATION.QUERY
          ? 'assistantMetadata.queryParams'
          : 'assistantMetadata.bodyParams',
      label,
      value: !isEmpty(value) ? value : defaultValue,
      paramMeta: {
        paramLocation,
        fields: parameters,
        oneMandatoryQueryParamFrom,
        isDeltaExport,
        defaultValuesForDeltaExport: deltaDefaults,
      },
    };

    if (
      parameters.filter(p => !!p.required).length > 0 ||
      (oneMandatoryQueryParamFrom && oneMandatoryQueryParamFrom.length > 0)
    ) {
      searchParamsField.required = true;
      searchParamsField.validWhen = {
        isNot: {
          values: [undefined, {}],
        },
      };
    }
  }

  if (searchParamsField) {
    return [searchParamsField];
  }

  return [];
}

export function fieldMeta({ resource, assistantData }) {
  const { assistant } = resource;
  let { adaptorType } = resource;

  if (adaptorType === 'RESTExport') {
    adaptorType = 'rest';
  } else {
    adaptorType = 'http';
  }

  const hiddenFields = hiddenFieldsMeta({
    values: { assistant, adaptorType, assistantData },
  });
  let basicFields = [];
  let pathParameterFields = [];
  let exportTypeFields = [];
  let searchParameterFields = [];

  if (assistantData && assistantData.export) {
    const assistantConfig = convertFromExport({
      exportDoc: resource,
      assistantData,
      adaptorType,
    });

    basicFields = basicFieldsMeta({
      assistant,
      assistantConfig,
      assistantData: assistantData.export,
    });

    const { operationDetails = {} } = assistantConfig;

    if (operationDetails) {
      pathParameterFields = pathParameterFieldsMeta({
        operationParameters: operationDetails.pathParameters,
        values: assistantConfig.pathParams,
      });
      exportTypeFields = exportTypeFieldsMeta({
        supportedExportTypes: operationDetails.supportedExportTypes,
        exportType: assistantConfig.exportType,
      });

      if (
        operationDetails.queryParameters &&
        operationDetails.queryParameters.filter(qp => !qp.readOnly).length > 0
      ) {
        searchParameterFields = searchParameterFieldsMeta({
          label: operationDetails.queryParametersLabel,
          paramLocation: PARAMETER_LOCATION.QUERY,
          parameters: operationDetails.queryParameters,
          oneMandatoryQueryParamFrom:
            operationDetails.oneMandatoryQueryParamFrom,
          value: resource.assistantMetadata?.dontConvert ? {} : assistantConfig.queryParams,
          isDeltaExport: assistantConfig.exportType === 'delta',
          deltaDefaults:
            operationDetails.delta &&
            operationDetails.delta.defaults
              ? operationDetails.delta.defaults
              : {},
        });
      }
      if (
        operationDetails.bodyParameters &&
        operationDetails.bodyParameters.length > 0
      ) {
        searchParameterFields = searchParameterFields.concat(searchParameterFieldsMeta({
          label: operationDetails.bodyParametersLabel,
          paramLocation: PARAMETER_LOCATION.BODY,
          parameters: operationDetails.bodyParameters,
          value: resource.assistantMetadata?.dontConvert ? {} : assistantConfig.bodyParams,
          isDeltaExport: assistantConfig.exportType === 'delta',
          deltaDefaults:
            operationDetails.delta &&
            operationDetails.delta.defaults
              ? operationDetails.delta.defaults
              : {},
        }));
      }
    }
  }

  const fields = [
    ...hiddenFields,
    ...basicFields,
    ...pathParameterFields,

    ...searchParameterFields,
  ];
  const exportTypeRelatedFields = [...exportTypeFields];
  const fieldMap = {
    common: {
      formId: 'common',
    },
    exportOneToMany: { formId: 'exportOneToMany' },
    apiIdentifier: { fieldId: 'apiIdentifier' },
    pageSize: { fieldId: 'pageSize' },
    formView: { fieldId: 'formView' },
    skipRetries: { fieldId: 'skipRetries' },
  };
  const fieldIds = [];
  const exportTypeFieldIds = [];

  fields.forEach(field => {
    fieldMap[field.id || field.fieldId] = field;
    fieldIds.push(field.id || field.fieldId);
  });
  exportTypeRelatedFields.forEach(field => {
    fieldMap[field.id || field.fieldId] = field;
    exportTypeFieldIds.push(field.id || field.fieldId);
  });
  fieldMap.settings = {
    fieldId: 'settings',
  };

  fieldMap.traceKeyTemplate = {
    fieldId: 'traceKeyTemplate',
  };

  return {
    fieldMap,
    layout: {
      type: 'collapse',
      containers: [
        {
          collapsed: true,
          label: 'General',
          fields: ['common', 'exportOneToMany', 'formView'],
        },
        {
          collapsed: true,
          label: 'What would you like to export?',
          fields: [...fieldIds],
        },
        {
          collapsed: true,
          label: 'Configure export type',
          fields: [...exportTypeFieldIds],
        },
        {
          collapsed: true,
          label: 'Advanced',
          fields: ['pageSize', 'skipRetries', 'traceKeyTemplate', 'apiIdentifier'],
        },
      ],
    },
  };
}
