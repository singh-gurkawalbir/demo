import uuid from 'uuid';

export default {
  generateMappingLabel: application => {
    const mappingLabelObj = { extract: '', generate: '' };

    switch (application) {
      case 'REST':
        mappingLabelObj.extract = 'Source Record Field';
        mappingLabelObj.generate = 'REST API Field';
        break;
      // Aditya TODO other applications to be added here
      default:
    }

    return mappingLabelObj;
  },
  getRandomName: () => uuid.v4(),
  getHandlebarHelperFormat: helper => {
    const toReturn = `{{${helper} arg1}}`;
    const singleArs = [
      'floor',
      'ceil',
      'round',
      'capitalize',
      'capitalizeAll',
      'lowercase',
      'uppercase',
    ];
    const doubleArgs = ['add', 'subtract', 'multiply', 'divide', 'sum', 'avg'];
    const helpers = {
      abs: '{{{abs field}}}',
      if_else: '{{#if field}} expr {{else}} expr {{/if}}',
      dateFormat: '{{{dateFormat o/pformat date i/pformat timezone}}}',
      toExponential: '{{toExponential field fractionDigits}}',
      toFixed: '{{toFixed field digits}}',
      toPrecision: '{{toPrecision field precision}}',
      replace: '{{replace field string string}}',
      jsonSerialize: '{{{jsonSerialize field}}}',
      getValue: '{{getValue "field" "defaultValue"}}',
      jsonEncode: '{{{jsonEncode field}}}',
      and: '{{#and field field}} expr {{else}} expr {{/and}}',
      compare:
        '{{#compare field  operator field}} expr {{else}} expr {{/compare}}',
      contains:
        '{{#contains collection field}} expr {{else}} expr {{/contains}}',
      ifEven: '{{#ifEven field}} expr {{else}} expr {{/ifEven}}',
      neither: '{{#neither field field}} expr {{else}} expr {{/neither}}',
      or: '{{#or field field}} expr {{else}} expr {{/or}}',
      base64Encode: '{{{base64Encode field field}}}',
      base64htmlEncode: '{{base64Encode field field}}',
      encodeURI: '{{{encodeURI field}}}',
      decodeURI: '{{{decodeURI field}}}',
      encodeURIhtml: '{{encodeURI field}}',
      decodeURIhtml: '{{decodeURI field}}',
      each: '{{#each field}}{{this}}{{/each}}',
      unless: '{{#unless field}} expr {{else}} expr {{/unless}}',
      with: '{{#with field}} {{field1}} {{field2}} {{/with}}',
      substring: '{{substring stringField startIndex endIndex}}',
      join: '{{join delimiterField field1 field2}}',
      timeStamp: '{{timeStamp timeZoneField}}',
      dateAdd: '{{dateAdd dateField offsetField timeZoneField}}',
      sortnumbers: '{{sort field number="true"}}',
      sortstrings: '{{sort field}}',
      split: '{{{split field delimiter index}}}',
      trim: '{{{trim field}}}',
      random: '{{random “CRYPTO”/“UUID” length}}',
      regexReplace: '{{{regexReplace field1 field2 regex options}}}',
      regexMatch: '{{{regexMatch field regex index options}}}',
    };

    if (singleArs.indexOf(helper) > -1) {
      return `{{${helper} field}}`;
    } else if (doubleArgs.indexOf(helper) > -1) {
      return `{{${helper} field1 field2}}`;
    } else if (helpers[helper]) {
      return helpers[helper];
    }

    return toReturn;
  },
};
