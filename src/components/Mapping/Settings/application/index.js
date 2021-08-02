import shortid from 'shortid';
import restMappingSettings from './rest';
import netsuiteMappingSettings from './netsuite';
import salesforceMappingSettings from './salesforce';
import ftpMappingSettings from './ftp';
import { adaptorTypeMap } from '../../../../utils/resource';
import rdbmsMappingSettings from './rdbms';
// TODO (Aditya) test cases to be added for save functionality

const getFormattedLookup = (lookup, formVal) => {
  const lookupTmp = {};

  if (formVal.name) {
    lookupTmp.name = formVal.name;
  } else {
    // generating random lookup name
    lookupTmp.name = shortid.generate();
  }

  if (formVal._mode === 'dynamic') {
    lookupTmp.method = formVal._method;
    lookupTmp.relativeURI = formVal._relativeURI;
    lookupTmp.extract = formVal._extract;
    lookupTmp.postBody = formVal._postBody;
    lookupTmp.recordType = formVal.recordType;
    lookupTmp.whereClause = formVal.whereClause;
    lookupTmp.sObjectType = formVal.sObjectType;
    lookupTmp.resultField = formVal.resultField;
    lookupTmp.expression = formVal.lookupExpression;
  } else {
    lookupTmp.map = {};
    formVal._mapList.forEach(obj => {
      if (obj.import && obj.export) lookupTmp.map[obj.export] = obj.import;
    });
  }

  if (formVal.lookupAction === 'disallowFailure') lookupTmp.allowFailures = false;
  else {
    lookupTmp.allowFailures = true;

    switch (formVal.lookupAction) {
      case 'useEmptyString':
        lookupTmp.default = '';
        break;
      case 'useNull':
        lookupTmp.default = null;
        break;
      case 'useDefaultOnMultipleMatches':
        lookupTmp.useDefaultOnMultipleMatches = true;
        lookupTmp.default =
          formVal.lookupDefault;
        break;
      case 'default':
        lookupTmp.default =
          formVal.lookupDefault;
        break;
      default:
    }
  }

  return lookupTmp;
};

export default {
  getMetaData: params => {
    const {
      value,
      isCategoryMapping,
      importResource,
    } = params;
    const {adaptorType} = importResource;
    let fieldMeta = {};

    switch (adaptorTypeMap[adaptorType]) {
      case adaptorTypeMap.HTTPImport:
      case adaptorTypeMap.RESTImport:
        if (importResource?.http?.type === 'file') { fieldMeta = ftpMappingSettings.getMetaData(params); } else {
          fieldMeta = restMappingSettings.getMetaData(params);
        }
        break;
      case adaptorTypeMap.NetSuiteDistributedImport:
        fieldMeta = netsuiteMappingSettings.getMetaData(params);
        break;
      case adaptorTypeMap.SalesforceImport:
        fieldMeta = salesforceMappingSettings.getMetaData(params);
        break;
      case adaptorTypeMap.AS2Import:
      case adaptorTypeMap.S3Import:
      case adaptorTypeMap.WrapperImport:
      case adaptorTypeMap.FTPImport:
        fieldMeta = ftpMappingSettings.getMetaData(params);
        break;
      case adaptorTypeMap.RDBMSImport: {
        fieldMeta = rdbmsMappingSettings.getMetaData(params);
        break;
      }

      default:
    }

    if (isCategoryMapping) {
      fieldMeta = netsuiteMappingSettings.getMetaData(params);
    }

    const { isNotEditable } = value;
    const { fieldMap } = fieldMeta;

    if (isNotEditable) {
      Object.keys(fieldMap).forEach(fieldId => {
        if (fieldId !== 'useAsAnInitializeValue') {
          fieldMap[fieldId].defaultDisabled = true;
        }
      });
    }

    return fieldMeta;
  },
  getFormattedValue: (value, formVal) => {
    const { generate, extract, lookup } = value;
    const settings = {};

    settings.generate = generate;

    if (formVal.dataType === 'date') {
      settings.dataType = 'string';
    } else if ('dataType' in formVal) {
      // for empty dataType, BE requires undefined to be sent
      settings.dataType = formVal.dataType || undefined;
    }

    if ('isKey' in formVal) {
      settings.isKey = formVal.isKey;
    }

    if ('useFirstRow' in formVal) {
      settings.useFirstRow = formVal.useFirstRow;
    }

    // setting date fields
    if (formVal.fieldMappingType === 'standard') {
      if (formVal.extractDateFormat) {
        settings.extractDateFormat = formVal.extractDateFormat;
      }

      if (formVal.extractDateTimezone) {
        settings.extractDateTimezone = formVal.extractDateTimezone;
      }

      if (formVal.generateDateFormat) {
        settings.generateDateFormat = formVal.generateDateFormat;
      }

      if (formVal.generateDateTimezone) {
        settings.generateDateTimezone = formVal.generateDateTimezone;
      }
    }

    if ('discardIfEmpty' in formVal) {
      settings.discardIfEmpty = formVal.discardIfEmpty;
    }

    if ('useAsAnInitializeValue' in formVal) {
      settings.useAsAnInitializeValue = formVal.useAsAnInitializeValue;
    }

    if ('immutable' in formVal) {
      settings.immutable = formVal.immutable;
    }

    if (formVal.fieldMappingType === 'hardCoded') {
      if (formVal.hardcodedAction) {
        switch (formVal.hardcodedAction) {
          case 'useEmptyString':
            settings.hardCodedValue = '';
            break;
          case 'useNull':
            settings.hardCodedValue = null;
            break;
          case 'default':
            settings.hardCodedValue = Array.isArray(formVal.hardcodedDefault)
              ? formVal.hardcodedDefault.join(',')
              : formVal.hardcodedDefault;
            break;
          default:
        }
      } else if (formVal.hardcodedDefault) {
        // in some cases hardcodedDefault is shown without hardcodedAction
        settings.hardCodedValue = Array.isArray(formVal.hardcodedDefault)
          ? formVal.hardcodedDefault.join(',')
          : formVal.hardcodedDefault;
      }
    } else if (
      formVal.fieldMappingType === 'standard' ||
      formVal.fieldMappingType === 'multifield'
    ) {
      switch (formVal.standardAction) {
        case 'useEmptyString':
          settings.default = '';
          break;
        case 'useNull':
          settings.default = null;
          break;
        case 'default':
          settings.default = formVal.default;
          break;
        default:
      }
    }

    // setting extract value
    if (
      formVal.fieldMappingType === 'standard' &&
      extract &&
      extract.indexOf('{{') !== -1
    ) {
      settings.extract = '';
    } else if (formVal.fieldMappingType === 'multifield') {
      settings.extract = formVal.expression;
    } else if (formVal.fieldMappingType !== 'hardCoded') {
      settings.extract = extract;
    }

    let updatedLookup;

    if (formVal.fieldMappingType === 'lookup') {
      if (formVal._mode === 'static') {
        let atleastOneValMapped = false;

        formVal._mapList?.forEach(obj => {
          if (obj.export && obj.import) {
            atleastOneValMapped = true;
          }
        });

        if (!atleastOneValMapped) {
          return {
            errorMessage: 'You need to map at least one value.',
          };
        }
      }

      updatedLookup = getFormattedLookup(lookup, formVal);

      settings.lookupName = updatedLookup && updatedLookup.name;
    }

    if (formVal.conditionalWhen) {
      settings.conditional = {};
      settings.conditional.when = formVal.conditionalWhen;

      if (
        formVal.conditionalWhen === 'lookup_not_empty' ||
        formVal.conditionalWhen === 'lookup_empty'
      ) {
        settings.conditional.lookupName = formVal.conditionalLookupName;
      }
    }

    return {
      settings,
      lookup: updatedLookup,
    };
  },
};
