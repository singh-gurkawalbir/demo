/* eslint-disable no-param-reassign */
import { nanoid } from 'nanoid';
import { adaptorTypeMap } from '../../../../../../../../utils/resource';
import httpMappingSettings from './http';

const getFormattedLookup = (lookup, formVal, settings) => {
  const lookupTmp = {};

  if (formVal.name) {
    lookupTmp.name = formVal.name;
  } else {
    // generating random lookup name
    lookupTmp.name = nanoid();
  }

  if (formVal._mode === 'dynamic') {
    lookupTmp.method = formVal._method;
    lookupTmp.relativeURI = formVal._relativeURI;
    lookupTmp.extract = formVal._extract;
    lookupTmp.postBody = formVal._body;
    lookupTmp.body = formVal._body; // todo ashu test this
  } else {
    lookupTmp.map = {};
    (formVal._mapList || []).forEach(obj => {
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
          break;
        } else {
          fieldMeta = httpMappingSettings.getMetaData(params);
        }
        break;

      default:
    }

    return fieldMeta;
  },
  getFormattedValue: (node, formVal) => {
    const { generate, extract, lookup } = node;
    const settings = {};
    let updatedLookup;

    settings.generate = generate;

    if ('dataType' in formVal) {
      // default data type is always string
      settings.dataType = formVal.dataType || 'string';
    }

    settings.copySource = formVal.copySource;

    // setting extract value
    if (formVal.copySource !== 'yes') {
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
    }

    if ((settings.dataType === 'object' || settings.dataType === 'objectarray') && formVal.copySource === 'no') {
      settings.extract = '';
    }

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
    } else if (formVal.fieldMappingType === 'hardCoded') {
      switch (formVal.hardcodedAction) {
        case 'useEmptyString':
          settings.hardCodedValue = '';
          break;
        case 'useNull':
          settings.hardCodedValue = null;
          settings.default = '';
          break;
        case 'default':
          settings.hardCodedValue = Array.isArray(formVal.hardcodedDefault)
            ? formVal.hardcodedDefault.join(',')
            : formVal.hardcodedDefault;
          break;
        case 'discardIfEmpty':
          settings.conditional = {};
          settings.conditional.when = 'extract_not_empty';
          break;
        default:
      }
    } else if (formVal.fieldMappingType === 'standard') {
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
        case 'discardIfEmpty':
          settings.conditional = {};
          settings.conditional.when = 'extract_not_empty';
          break;
        default:
      }
    } else if (formVal.fieldMappingType === 'multifield') {
      switch (formVal.multifieldAction) {
        case 'useEmptyString':
          settings.default = '';
          break;
        case 'useNull':
          settings.default = null;
          break;
        case 'default':
          settings.default = formVal.default;
          break;
        case 'discardIfEmpty':
          settings.conditional = {};
          settings.conditional.when = 'extract_not_empty';
          break;
        default:
      }
    } else if (formVal.fieldMappingType === 'lookup') {
      if (formVal._mode === 'static') {
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

        const duplicateKeys = _mapList
          .filter(e => !!e.export)
          .map(e => e.export)
          .map((e, i, final) => final.indexOf(e) !== i && i)
          .filter(obj => _mapList[obj])
          .map(e => _mapList[e].export);

        if (duplicateKeys.length) {
          errorMessage = `You cannot have duplicate source record field values: ${duplicateKeys.join(
            ','
          )}`;
        }

        if (errorMessage) {
          return {errorMessage};
        }
      }

      updatedLookup = getFormattedLookup(lookup, formVal, settings);

      settings.lookupName = updatedLookup && updatedLookup.name;
    }

    if (formVal.conditionalWhen) {
      if (!settings.conditional) {
        settings.conditional = {};
      }
      settings.conditional.when = formVal.conditionalWhen;
    }
    if (settings.dataType === 'object' || settings.dataType === 'objectarray') {
      delete settings.hardCodedValue;
      delete settings.lookupName;
    }

    return {
      settings,
      updatedLookup,
    };
  },
};
