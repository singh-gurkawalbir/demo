/* eslint-disable no-param-reassign */
import { adaptorTypeMap, isFileAdaptor, isAS2Resource } from '../../../../../../../../utils/resource';
import httpMappingSettings from './http';
import ftpMappingSettings from './ftp';
import { MAPPING_DATA_TYPES, ARRAY_DATA_TYPES, buildExtractsHelperFromExtract } from '../../../../../../../../utils/mapping';
import { generateUniqueKey } from '../../../../../../../../utils/string';

const getFormattedLookup = (lookup, formVal, settings) => {
  const lookupTmp = {};

  if (formVal.name) {
    lookupTmp.name = formVal.name;
  } else {
    // generating random lookup name
    lookupTmp.name = generateUniqueKey();
  }

  if (formVal._mode === 'dynamic') {
    lookupTmp.method = formVal._method;
    lookupTmp.relativeURI = formVal._relativeURI;
    lookupTmp.extract = formVal._extract;
    lookupTmp.postBody = formVal._body;
    lookupTmp.body = formVal._body;
  } else {
    lookupTmp.map = {};
    (formVal._mapList || []).forEach(obj => {
      if (obj.import && obj.export) {
        const splitSourceValues = obj.export.split(',');

        splitSourceValues.forEach(src => {
          lookupTmp.map[src] = obj.import;
        });
      }
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
      case 'default':
        lookupTmp.default =
          formVal.lookupDefault;
        break;
      case 'discardIfEmpty':
        if (!settings.conditional) {
          settings.conditional = {};
        }

        settings.conditional.when = 'extract_not_empty';
        break;
      default:
    }
  }

  return lookupTmp;
};

export default {
  getMetaData: params => {
    const {
      importResource,
    } = params;

    const {adaptorType} = importResource;
    let fieldMeta = {};

    // only http/rest imports supported
    switch (adaptorTypeMap[adaptorType]) {
      case adaptorTypeMap.RESTImport:
      case adaptorTypeMap.HTTPImport:
        if (importResource?.http?.type === 'file') {
          fieldMeta = ftpMappingSettings.getMetaData(params);
        } else {
          fieldMeta = httpMappingSettings.getMetaData(params);
        }
        break;
      case adaptorTypeMap.AS2Import:
      case adaptorTypeMap.S3Import:
      case adaptorTypeMap.FTPImport:
        fieldMeta = ftpMappingSettings.getMetaData(params);
        break;

      default:
    }

    return fieldMeta;
  },
  getFormattedValue: (node, formVal, importResource) => {
    const { generate, lookup } = node;
    const settings = {};
    let updatedLookup;

    settings.generate = generate;
    settings.description = formVal.description;
    settings.extract = formVal.sourceField;
    settings.sourceDataType = formVal.sourceDataType;

    if ('dataType' in formVal) {
      // default data type is always string
      settings.dataType = formVal.dataType || MAPPING_DATA_TYPES.STRING;
    }
    if (ARRAY_DATA_TYPES.includes(settings.dataType)) {
      settings.extractsArrayHelper = buildExtractsHelperFromExtract(formVal.extractsArrayHelper, formVal.sourceField);
    }

    settings.copySource = formVal.copySource;

    if (formVal.copySource === 'yes') {
      switch (formVal.objectAction) {
        case 'useNull':
          settings.default = null;
          break;
        case 'discardIfEmpty':
          settings.conditional = {};
          settings.conditional.when = 'extract_not_empty';
          break;
        default:
      }
    } else     // setting date fields
    if (formVal.fieldMappingType === 'standard') {
      settings.extractDateFormat = formVal.extractDateFormat ? formVal.extractDateFormat : undefined;
      settings.extractDateTimezone = formVal.extractDateTimezone ? formVal.extractDateTimezone : undefined;
      settings.generateDateFormat = formVal.generateDateFormat ? formVal.generateDateFormat : undefined;
      settings.generateDateTimezone = formVal.generateDateTimezone ? formVal.generateDateTimezone : undefined;
      switch (formVal.standardAction) {
        case 'useEmptyString':
          settings.default = '';
          break;
        case 'useNull':
          settings.default = null;
          break;
        case 'default':
          settings.default = settings.dataType === MAPPING_DATA_TYPES.BOOLEAN ? formVal.boolDefault : formVal.default;
          break;
        case 'discardIfEmpty':
          settings.conditional = {};
          settings.conditional.when = 'extract_not_empty';
          break;
        default:
      }
    } else if (formVal.fieldMappingType === 'hardCoded') {
      switch (formVal.hardcodedAction) {
        case 'useEmptyString':
          settings.hardCodedValue = '';
          break;
        case 'useNull':
          settings.hardCodedValue = null;
          break;
        case 'default':
          if (settings.dataType === MAPPING_DATA_TYPES.BOOLEAN) {
            settings.hardCodedValue = formVal.boolHardcodedDefault;
          } else {
            settings.hardCodedValue = Array.isArray(formVal.hardcodedDefault)
              ? formVal.hardcodedDefault.join(',')
              : formVal.hardcodedDefault;
          }

          break;
        case 'discardIfEmpty':
          settings.conditional = {};
          settings.conditional.when = 'extract_not_empty';
          break;
        default:
      }
      settings.extract = '';
    } else if (formVal.fieldMappingType === 'multifield') {
      switch (formVal.multifieldAction) {
        case 'useEmptyString':
          settings.default = '';
          break;
        case 'useNull':
          settings.default = null;
          break;
        case 'default':
          settings.default = settings.dataType === MAPPING_DATA_TYPES.BOOLEAN ? formVal.boolMultifieldDefault : formVal.multifieldDefault;
          break;
        case 'discardIfEmpty':
          settings.conditional = {};
          settings.conditional.when = 'extract_not_empty';
          break;
        default:
      }
      settings.extract = formVal.expression;
    } else if (formVal.fieldMappingType === 'lookup') {
      if (formVal._mode === 'static' || isFileAdaptor(importResource) || isAS2Resource(importResource)) {
        const {_mapList = []} = formVal;
        let atleastOneValMapped = false;
        let errorMessage;

        _mapList.forEach(obj => {
          if (obj.export && obj.import) {
            atleastOneValMapped = true;
          }
        });

        if (!atleastOneValMapped) {
          errorMessage = 'You need to map at least one value.';
        }

        const formattedSourceValues = _mapList
          .filter(e => !!e.export)
          .map(e => e.export)
          .reduce((values, src) => [...values, ...src.split(',')], []);
        const duplicateKeys = formattedSourceValues
          .map((e, i, final) => final.indexOf(e) !== i && i)
          .filter(obj => formattedSourceValues[obj])
          .map(e => formattedSourceValues[e]);

        if (duplicateKeys.length) {
          errorMessage = `You cannot have duplicate source field values: ${duplicateKeys.join(
            ','
          )}`;
        }

        if (errorMessage) {
          return {errorMessage};
        }
      }

      updatedLookup = getFormattedLookup(lookup, formVal, settings);

      settings.lookupName = updatedLookup && updatedLookup.name;
      if (formVal._mode === 'dynamic') {
        settings.extract = '';
      }
    }

    if (formVal.conditionalWhen) {
      if (!settings.conditional) {
        settings.conditional = {};
      }
      settings.conditional.when = formVal.conditionalWhen;
    }
    if (settings.dataType === MAPPING_DATA_TYPES.OBJECT || settings.dataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
      delete settings.hardCodedValue;
      delete settings.lookupName;
    }

    // array data types don't have these properties at parent level
    if (ARRAY_DATA_TYPES.includes(settings.dataType)) {
      delete settings.default;
      delete settings.sourceDataType;
      delete settings.copySource;
      if (settings?.conditional?.when === 'extract_not_empty') {
        delete settings.conditional;
      }
    }

    return {
      settings,
      updatedLookup,
    };
  },
};
