import shortid from 'shortid';

const getFormattedLookup = (lookup, formVal) => {
  const lookupTmp = {};

  if (lookup && lookup.name) {
    lookupTmp.name = lookup.name;
  } else {
    // generating random lookup name
    lookupTmp.name = shortid.generate();
  }

  if (formVal._mode === 'dynamic') {
    lookupTmp.recordType = formVal.recordType;
    lookupTmp.whereClause = formVal.whereClause;
    lookupTmp.sObjectType = formVal.sObjectType;
    lookupTmp.resultField = formVal.resultField;
    lookupTmp.searchField = formVal.searchField;
  } else {
    lookupTmp.map = {};
    formVal._mapList.forEach(obj => {
      if (obj.import && obj.export) lookupTmp.map[obj.export] = obj.import;
    });
  }
  if (formVal.lookupFailIfMatchNotFound) {
    lookupTmp.allowFailures = false;
  } else {
    lookupTmp.allowFailures = true;
    if ('lookupUseNull' in formVal && formVal.lookupUseNull === true) {
      lookupTmp.default = null;
    } else if ('lookupuseEmptyString' in formVal && formVal.lookupUseEmptyString === true) {
      lookupTmp.default = '';
    } else if ('lookupDefault' in formVal && formVal.lookupDefault) {
      lookupTmp.default = formVal.lookupDefault;
    }
  }
  return lookupTmp;
};

export default {
  getFormattedValue: (value, formVal) => {
    const { generate, extract, lookup } = value;
    let errorStatus = false;
    let errorMessage = '';
    const settings = {};
    let conditionalLookup;

    settings.generate = generate;

    if ('isKey' in formVal) {
      settings.isKey = formVal.isKey;
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
      settings.hardCodedValue =
        formVal.hardcodedDefault || formVal.hardcodedSFSelect;
      if (formVal.hardcodedSelect) {
        settings.hardCodedValue = Array.isArray(formVal.hardcodedSelect)
          ? formVal.hardcodedSelect.join(',')
          : formVal.hardcodedSelect;
      } else if (formVal.hardcodedCheckbox) {
        settings.hardCodedValue = formVal.hardcodedCheckbox;
      }
    }
    // else if (
    //   formVal.fieldMappingType === 'standard' ||
    //   formVal.fieldMappingType === 'multifield'
    // ) {
    //   switch (formVal.standardAction) {
    //     case 'useEmptyString':
    //       settings.default = '';
    //       break;
    //     case 'useNull':
    //       settings.default = null;
    //       break;
    //     case 'default':
    //       settings.default = formVal.default || formVal.defaultSFSelect;
    //       break;
    //     default:
    //   }
    // }

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

        formVal._mapList.forEach(obj => {
          if (obj.export && obj.import) {
            atleastOneValMapped = true;
          }
        });

        if (!atleastOneValMapped) {
          errorStatus = true;
          errorMessage = 'You need to map at least one value.';
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

        if (formVal.lookups) {
          const tempLookUp = formVal.lookups.find(
            l => l.name === formVal.conditionalLookupName
          );

          if (
            tempLookUp &&
            (!updatedLookup || updatedLookup.name !== tempLookUp.name)
          ) {
            conditionalLookup = tempLookUp;
          }
        }
      }
    }

    return {
      settings,
      lookup: updatedLookup,
      errorStatus,
      errorMessage,
      conditionalLookup,
    };
  }
};
