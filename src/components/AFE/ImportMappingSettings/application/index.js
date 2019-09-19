import utilityFunctions from '../../../../utils/utilityFunctions';
import RestMappingSettings from './rest';
import NetsuiteMappingSettings from './netsuite';

const getDefaultDataType = value => {
  if (
    value.extractDateFormat ||
    value.extractDateTimezone ||
    value.generateDateFormat ||
    value.generateDateTimezone
  ) {
    return 'date';
  }

  return value.dataType;
};

const getFieldMappingType = value => {
  if (value.lookupName) {
    return 'lookup';
  } else if ('hardCodedValue' in value) {
    return 'hardCoded';
  } else if (value.extract && value.extract.indexOf('{{') !== -1) {
    return 'multifield';
  }

  return 'standard';
};

const getDefaultValue = value => {
  if ('default' in value || 'hardCodedValue' in value) {
    const defaultVal = value.default || value.hardCodedValue;

    switch (defaultVal) {
      case '':
        return 'useEmptyString';
      case null:
        return 'useNull';
      default:
        return 'default';
    }
  }
};

const getDefaultExpression = value => {
  if (value.extract && value.extract.indexOf('{{') !== -1) {
    return value.extract;
  }
};

const getFormattedLookup = (lookup, formVal) => {
  const lookupTmp = {};

  if (lookup && lookup.name) {
    lookupTmp.name = lookup.name;
  } else {
    lookupTmp.name = utilityFunctions.getRandomName();
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

  if (formVal.standardAction === 'disallowFailure')
    lookupTmp.allowFailures = false;
  else {
    lookupTmp.allowFailures = true;

    switch (formVal.standardAction) {
      case 'useEmptyString':
        lookupTmp.default = '';
        break;
      case 'useNull':
        lookupTmp.default = null;
        break;
      case 'default':
        lookupTmp.default = formVal.default;
        break;
      default:
    }
  }

  return lookupTmp;
};

export default {
  getMetaData: options => {
    const { application, value, lookup = {}, extractFields } = options;
    const defaultUtil = {
      getDefaultDataType,
      getFieldMappingType,
      getDefaultValue,
      getDefaultExpression,
    };
    let fieldMeta = {};

    switch (application) {
      case 'REST':
        fieldMeta = RestMappingSettings.getMetaData({
          value,
          lookup,
          extractFields,
          defaultUtil,
        });
        break;
      case 'netsuite':
        fieldMeta = NetsuiteMappingSettings.getMetaData({
          value,
          lookup,
          extractFields,
          defaultUtil,
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

    if (formVal.discardIfEmpty) {
      settings.discardIfEmpty = formVal.discardIfEmpty;
    }

    if (formVal.useAsAnInitializeValue) {
      settings.useAsAnInitializeValue = formVal.useAsAnInitializeValue;
    }

    if (formVal.immutable) {
      settings.immutable = formVal.immutable;
    }

    if (formVal.restImportFieldMappingSettings === 'hardCoded') {
      // in case of hardcoded value, we dont save extract property
      switch (formVal.standardAction) {
        case 'useEmptyString':
          settings.hardCodedValue = '';
          break;
        case 'useNull':
          settings.hardCodedValue = null;
          break;
        case 'default':
          settings.hardCodedValue = formVal.default;
          break;
        default:
      }
    } else {
      if (formVal.restImportFieldMappingSettings === 'multifield') {
        settings.extract = formVal.expression;
      } else {
        settings.extract = extract;
      }

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

    let updatedLookup;

    if (formVal.restImportFieldMappingSettings === 'lookup') {
      updatedLookup = getFormattedLookup(lookup, formVal);

      settings.lookupName = updatedLookup && updatedLookup.name;
    }

    return {
      settings,
      lookup: updatedLookup,
    };
  },
};
