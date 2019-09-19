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
  },

  getDefaultExpression: value => {
    if (value.extract && value.extract.indexOf('{{') !== -1) {
      return value.extract;
    }
  },
};
