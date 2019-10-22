import shortid from 'shortid';
import RestMappingSettings from './rest';
import NetsuiteMappingSettings from './netsuite';
import SalesforceMappingSettings from './salesforce';
import FTPMappingSettings from './ftp';
import { adaptorTypeMap } from '../../../../utils/resource';

// TODO (Aditya) test cases to be added for save functionality

const getFormattedLookup = (lookup, formVal) => {
  const lookupTmp = {};

  if (lookup && lookup.name) {
    lookupTmp.name = lookup.name;
  } else {
    // generating random lookup name
    lookupTmp.name = shortid.generate();
  }

  if (formVal._mode === 'dynamic') {
    lookupTmp.method = formVal._method;
    lookupTmp.relativeURI = formVal._relativeURI;
    lookupTmp.extract = formVal._extract;
    lookupTmp.postBody = formVal._postBody;
  } else {
    lookupTmp.map = {};
    formVal._mapList.forEach(obj => {
      lookupTmp.map[obj.export] = obj.import;
    });
  }

  if (formVal.lookupAction === 'disallowFailure')
    lookupTmp.allowFailures = false;
  else {
    lookupTmp.allowFailures = true;

    switch (formVal.lookupAction) {
      case 'useEmptyString':
        lookupTmp.default = '';
        break;
      case 'useNull':
        lookupTmp.default = null;
        break;
      case 'default':
        lookupTmp.default = formVal.lookupDefault || formVal.lookupSFSelect;
        break;
      default:
    }
  }

  return lookupTmp;
};

export default {
  getMetaData: params => {
    const {
      application,
      value,
      lookup = {},
      extractFields,
      // connectionId,
      // recordType,
      generate,
      generateFields,
      options,
    } = params;
    let fieldMeta = {};

    switch (application) {
      case adaptorTypeMap.RESTImport:
        fieldMeta = RestMappingSettings.getMetaData({
          value,
          lookup,
          extractFields,
        });
        break;
      case adaptorTypeMap.NetSuiteDistributedImport:
        fieldMeta = NetsuiteMappingSettings.getMetaData({
          value,
          lookup,
          extractFields,
          generate,
          generateFields,
          options,
        });
        break;
      case adaptorTypeMap.SalesforceImport:
        fieldMeta = SalesforceMappingSettings.getMetaData({
          value,
          lookup,
          extractFields,
          generate,
          generateFields,
          options,
        });
        break;
      case adaptorTypeMap.AS2Import:
      case adaptorTypeMap.S3Import:
      case adaptorTypeMap.FTPImport:
        fieldMeta = FTPMappingSettings.getMetaData({
          value,
          lookup,
          extractFields,
        });
        break;
      default:
    }

    return fieldMeta;
  },
  getFormattedValue: (value, formVal) => {
    const { generate, extract, lookup } = value;
    const settings = {};

    settings.generate = generate;

    if (formVal.dataType === 'date') {
      settings.dataType = 'string';
      settings.exportDateTimeZone = formVal.exportDateTimeZone;
      settings.exportDateFormat = formVal.exportDateFormat;
      settings.importDateFormat = formVal.importDateFormat;
      settings.importDateTimeZone = formVal.importDateTimeZone;
    } else if (formVal.dataType) {
      settings.dataType = formVal.dataType;
    }

    if (formVal.extractDateFormat) {
      settings.extractDateFormat = formVal.extractDateFormat;
    }

    if (formVal.extractDateTimezone) {
      settings.extractDateTimezone = formVal.extractDateTimezone;
    }

    if (formVal.discardIfEmpty) {
      settings.discardIfEmpty = formVal.discardIfEmpty;
    }

    if (formVal.useAsAnInitializeValue) {
      settings.useAsAnInitializeValue = formVal.useAsAnInitializeValue;
    }

    if (formVal.immutable) {
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
            settings.hardCodedValue =
              formVal.hardcodedDefault || formVal.hardcodedSFSelect;
            break;
          default:
        }
      } else if (formVal.hardcodedSelect) {
        settings.hardCodedValue = Array.isArray(formVal.hardcodedSelect)
          ? formVal.hardcodedSelect.join(',')
          : formVal.hardcodedSelect;
      } else if (formVal.hardcodedCheckbox) {
        settings.hardCodedValue = formVal.hardcodedCheckbox;
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
          settings.default = formVal.default || formVal.defaultSFSelect;
          break;
        default:
      }
    }

    if (formVal.fieldMappingType === 'multifield') {
      settings.extract = formVal.expression;
    } else {
      settings.extract = extract;
    }

    let updatedLookup;

    if (formVal.fieldMappingType === 'lookup') {
      updatedLookup = getFormattedLookup(lookup, formVal);

      settings.lookupName = updatedLookup && updatedLookup.name;
    }

    return {
      settings,
      lookup: updatedLookup,
    };
  },
};
