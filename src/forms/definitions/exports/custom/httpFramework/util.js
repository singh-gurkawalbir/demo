import { isEmpty } from 'lodash';
import uniqBy from 'lodash/uniqBy';
import {
  convertFromExport,
  PARAMETER_LOCATION,
} from '../../../../../utils/assistant';

function hiddenFieldsMeta({ values }) {
  return ['assistant', 'adaptorType', 'assistantData'].map(fieldId => ({
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

  if (resourceObj?.endpoints?.find(ep => ep.id === operationDefaultValue)?.hidden) {
    operationDefaultValue = resourceObj?.endpoints?.find(ep => ep.id !== operationDefaultValue && ep.id.includes(operationDefaultValue))?.id;
  }

  const fieldDefinitions = {
    resource: {
      fieldId: 'assistantMetadata.resource',
      value: resourceDefaultValue,
      required: true,
      type: 'hfoptions',
      label: 'Resource',
      helpKey: 'export.http._httpConnectorResourceId',
    },
    operation: {
      fieldId: 'assistantMetadata.operation',
      value: operationDefaultValue,
      required: true,
      type: 'hfoptions',
      label: 'API endpoint',
      helpKey: 'export.http._httpConnectorEndpointId',
    },
    version: {
      fieldId: 'assistantMetadata.version',
      value: assistantConfig.version,
      required: true,
      type: 'hfoptions',
      helpKey: 'export.http._httpConnectorVersionId',
    },

  };
  const { labels = {}, versions = [], helpTexts = {} } = assistantData;

  return Object.keys(fieldDefinitions).map(fieldId => {
    if (fieldId === 'version') {
      fieldDefinitions[fieldId].visible = versions.length > 1;

      if (!fieldDefinitions[fieldId].value && versions.length === 1) {
        fieldDefinitions[fieldId].value = versions[0]._id;
        fieldDefinitions[fieldId].defaultValue = versions[0]._id;
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

function headerFieldsMeta({operationDetails, headers = []}) {
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
      headersMetadata: operationDetails?.headersMetadata,
      validate: true,
      valueName: 'value',
      label: 'Configure HTTP headers',
      value: headersValue,
      required: true,
    }];
  }

  return [];
}

function pathParameterFieldsMeta({ operationParameters = [], values }) {
  return operationParameters.map(pathParam => {
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

function exportTypeFieldsMeta({
  supportedExportTypes = [],
  exportType,
}) {
  const exportTypeOptions = [{ value: 'all', label: 'All – always export all data' }];

  if (supportedExportTypes.includes('delta')) {
    exportTypeOptions.push({ value: 'delta', label: 'Delta – export only modified data' });
  }

  if (supportedExportTypes.includes('test')) {
    exportTypeOptions.push({ value: 'test', label: 'Limit – export a set number of records' });
  }

  if (exportTypeOptions.length <= 1) {
    return [];
  }

  return [
    {
      helpKey: 'export.type',
      fieldId: 'assistantMetadata.exportType',
      type: 'hfoptions',
      options: [
        {
          items: exportTypeOptions,
        },
      ],
      value: exportType || 'all',
    },
    {
      fieldId: 'test.limit',
      visibleWhen: [
        {field: 'assistantMetadata.exportType', is: ['test']},
      ],
    },
  ];
}

function searchParameterFieldsMeta({
  label,
  paramLocation,
  parameters = [],
  oneMandatoryQueryParamFrom,
  value,
  operationChanged,
  deltaDefaults = {},
  isDeltaExport,
  url,
}) {
  let searchParamsField;
  const defaultValue = {};
  const filteredValues = value;

  if (url) {
    const [, queryPart] = url?.split('?');
    const queryObj = new URLSearchParams(queryPart);
    const parameterIds = parameters.map(param => param.id);

    if (queryPart) {
      [...queryObj.entries()].filter(([key]) => !parameterIds.includes(key)).map(([key]) => key).forEach(key => {
        delete filteredValues[key];
      });
    }
  }

  parameters.forEach(p => {
    if (Object.prototype.hasOwnProperty.call(p, 'defaultValue') && operationChanged) {
      if (p.type === 'array' && p.defaultValue && typeof p.defaultValue === 'string') {
        try {
          defaultValue[p.id] = JSON.parse(p.defaultValue);
        } catch (e) {
          defaultValue[p.id] = [];
        }
      } else {
        defaultValue[p.id] = p.defaultValue;
      }
    }
  });

  if (parameters.length > 0) {
    searchParamsField = {
      fieldId: 'assistantMetadata.searchParams',
      type: 'hfsearchparams',
      id:
        paramLocation === PARAMETER_LOCATION.QUERY
          ? 'assistantMetadata.queryParams'
          : 'assistantMetadata.bodyParams',
      label,
      value: !isEmpty(filteredValues) ? filteredValues : defaultValue,
      keyName: 'name',
      valueName: 'value',
      keyPlaceholder: 'Search, select or add a name',
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
  let headers;
  let adaptorType = 'http';

  if (adaptorType === 'RESTExport') {
    adaptorType = 'rest';
    headers = resource.rest?.headers || [];
  } else {
    adaptorType = 'http';
    headers = resource.http?.headers || [];
  }
  const hiddenFields = hiddenFieldsMeta({
    values: {
      assistant,
      adaptorType: 'http',
      assistantData,
    },
  });
  let basicFields = [];
  let pathParameterFields = [];
  let exportTypeFields = [];
  let searchParameterFields = [];
  let headerFields = [];
  let supportsEndpointLevelAsyncHelper = false;

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
      supportsEndpointLevelAsyncHelper = operationDetails.supportsAsyncHelper;
      headerFields = headerFieldsMeta({
        headers,
        operationDetails,
        assistantConfig,
      });
      pathParameterFields = pathParameterFieldsMeta({
        operationParameters: operationDetails.pathParameters,
        values: resource.assistantMetadata?.dontConvert ? {} : assistantConfig.pathParams,
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
          operationChanged: resource.assistantMetadata?.operationChanged,
          isDeltaExport: assistantConfig.exportType === 'delta',
          deltaDefaults:
            operationDetails.delta &&
            operationDetails.delta.defaults
              ? operationDetails.delta.defaults
              : {},
          url: operationDetails.url,
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
          operationChanged: resource.assistantMetadata?.operationChanged,
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
    ...headerFields,
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
    'test.limit': {fieldId: 'test.limit'},
    advancedSettings: {
      formId: 'advancedSettings',
    },
    configureAsyncHelper: {
      fieldId: 'configureAsyncHelper',
      defaultValue: r => !!(r && r.http && r.http._asyncHelperId) || supportsEndpointLevelAsyncHelper,
      visible: r => !(r && r.statusExport) && !supportsEndpointLevelAsyncHelper,
    },
    'http._asyncHelperId': {
      fieldId: 'http._asyncHelperId',
      required: supportsEndpointLevelAsyncHelper,
    },
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

  fieldMap.mockOutput = {fieldId: 'mockOutput'};
  if (supportsEndpointLevelAsyncHelper) {
    const index = fieldIds.findIndex(fld => fld === 'assistantMetadata.version');

    fieldIds.splice(index + 1, 0, 'http._asyncHelperId');
  }

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
          actionId: 'mockOutput',
          label: 'Mock output',
          fields: ['mockOutput'],
        },
        {
          collapsed: true,
          label: 'Advanced',
          fields: [...(!supportsEndpointLevelAsyncHelper ? ['configureAsyncHelper',
            'http._asyncHelperId'] : ['configureAsyncHelper']),
          'advancedSettings'],
        },
      ],
    },
  };
}
