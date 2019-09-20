export default {
  getDefaultDataType: value => {
    if (
      value.extractDateFormat ||
      value.extractDateTimezone ||
      value.generateDateFormat ||
      value.generateDateTimezone
    ) {
      return 'date';
    }

    return value.dataType;
  },

  getFieldMappingType: value => {
    if (value.lookupName) {
      return 'lookup';
    } else if ('hardCodedValue' in value) {
      return 'hardCoded';
    } else if (value.extract && value.extract.indexOf('{{') !== -1) {
      return 'multifield';
    }

    return 'standard';
  },

  getDefaultActionValue: value => {
    if ('default' in value || 'hardCodedValue' in value) {
      let defaultVal;

      if ('default' in value) {
        defaultVal = value.default;
      } else if ('hardCodedValue' in value) {
        defaultVal = value.hardCodedValue;
      }

      switch (defaultVal) {
        case '':
          return 'useEmptyString';
        case null:
          return 'useNull';
        default:
          return 'default';
      }
    }
  },

  getDefaultExpression: value => {
    if (value.extract && value.extract.indexOf('{{') !== -1) {
      return value.extract;
    }
  },
  getMappingPath: application => {
    switch (application) {
      case 'rest':
        return '/mapping/fields';
      case 'netsuite':
        // TODO
        return '';
      default:
    }
  },
  getLookupPath: application => {
    switch (application) {
      case 'rest':
        return '/rest/lookup';
      case 'netsuite':
        // TODO
        return '';
      default:
    }
  },
  getGenerateLabelForMapping: application => {
    switch (application) {
      case 'rest':
        return 'REST API Field';
      case 'netsuite':
        return 'NetSuite Field';
      default:
    }
  },
};
