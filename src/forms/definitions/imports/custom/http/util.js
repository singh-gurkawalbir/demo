import { isArray, isEmpty } from 'lodash';
import {
  convertFromImport,
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

export function basicFieldsMeta({ assistantConfig, assistantData }) {
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
      refreshOptionsOnChangesTo: ['assistantMetadata.version'],
    },
    operation: {
      fieldId: 'assistantMetadata.operation',
      value: assistantConfig.operation || assistantConfig.operationUrl,
      required: true,
      refreshOptionsOnChangesTo: [
        'assistantMetadata.version',
        'assistantMetadata.resource',
      ],
    },
  };
  const { labels = {}, versions = [] } = assistantData;

  return Object.keys(fieldDefinitions)
    .filter(fieldId => {
      if (fieldId === 'version') {
        return versions.length > 1;
      }

      return true;
    })
    .map(fieldId => {
      if (labels[fieldId]) {
        fieldDefinitions[fieldId].label = labels[fieldId];
      }

      return fieldDefinitions[fieldId];
    });
}

export function pathParameterFieldsMeta({ operationParameters = [], values }) {
  return operationParameters
    .filter(pathParam => pathParam.in === 'path' && !pathParam.isIdentifier)
    .map(pathParam => {
      const pathParamField = {
        id: `assistantMetadata.pathParams.${pathParam.id}`,
        label: pathParam.name,
        type: 'text',
        value: values[pathParam.id],
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

  if (lookupTypeOptions.length > 0) {
    fields.push(lookupTypeField);

    if (lookupTypeOptions.find(opt => opt.value === 'source')) {
      const identifierPathParam = operationDetails.parameters.find(
        p => !!p.isIdentifier
      );
      const identifierField = {
        id: `assistantMetadata.pathParams.${identifierPathParam.id}`,
        label: 'Which field?',
        type: 'text',
        required: true,
        value: pathParameterValues[identifierPathParam.id],
        visibleWhenAll: [
          {
            field: 'assistantMetadata.lookupType',
            is: ['source'],
          },
        ],
        placeholder: 'Enter field id, or JSON path if field is nested',
        helpText:
          'Specify the field, or field path for nested fields, in your export data record that contains the information necessary to identify the existing records that should be ignored when importing the data. IO will check each exported record to see whether the field is populated or not. If it is, then the record will be ignored. If the field is not populated, it will move forward in the import process. For example, if you specify the field as "customerID", then IO will check the customerID field of each exported record to see whether the record should get imported (field does not have a value) or skip the import (field has value). \n\n IO provides dynamic field lists to make it easier for you to select the field. If a field contains special characters (which may be the case for certain APIs, then the field is surrounded with [], e.g. [field-name]. The [*] indicates that the specified field is an array. In this case, you need to replace the * with a number corresponding to the array item to test. \n\nNote that this is a true or false field, i.e. there is no logic involved but a simple check whether a field has a value or not, arrays will not get iterated through for comparing of values.',
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
        label: 'Configure Search Parameters',
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
  const { assistant } = resource;
  let { adaptorType } = resource;

  if (adaptorType === 'RESTImport') {
    adaptorType = 'rest';
  } else {
    adaptorType = 'http';
  }

  const hiddenFields = hiddenFieldsMeta({
    values: { assistant, adaptorType, assistantData },
  });
  let basicFields = [];
  let pathParameterFields = [];
  let ignoreConfigFields = [];
  let howToFindIdentifierFields = [];

  if (assistantData && assistantData.import) {
    const assistantConfig = convertFromImport({
      importDoc: resource,
      assistantData,
      adaptorType,
    });

    basicFields = basicFieldsMeta({
      assistantConfig,
      assistantData: assistantData.import,
    });

    const { operationDetails = {} } = assistantConfig;

    if (operationDetails) {
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
    ...pathParameterFields,
    ...ignoreConfigFields,
    ...howToFindIdentifierFields,
  ];
  const fieldMap = {
    common: {
      formId: 'common',
    },
    importData: {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    dataMappings: {
      formId: 'dataMappings',
    },
  };
  const fieldIds = [];

  fields.forEach(field => {
    fieldMap[field.id || field.fieldId] = field;
    fieldIds.push(field.id || field.fieldId);
  });

  return {
    fieldMap,
    layout: {
      fields: ['common', 'importData', ...fieldIds, 'dataMappings'],
    },
  };
}
