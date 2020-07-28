import { deepClone } from 'fast-json-patch/lib/core';

const LOOKUP_RESPONSE_MAPPING_EXTRACTS = [
  'data',
  'errors',
  'ignored',
  'statusCode',
];
const IMPORT_RESPONSE_MAPPING_EXTRACTS = [
  'id',
  'errors',
  'ignored',
  'statusCode',
];
export default {
  getResponseMappingExtracts: (resourceType, adaptorType) => {
    let extractFields;
    if (resourceType === 'imports') {
      extractFields = [...IMPORT_RESPONSE_MAPPING_EXTRACTS];
      if (adaptorType === 'HTTPImport') {
        extractFields.push('headers');
      }
    } else {
      extractFields = LOOKUP_RESPONSE_MAPPING_EXTRACTS;
    }
    return extractFields;
  },
  getResponseMappingDefaultExtracts(resourceType, adaptorType) {
    const extractFields = this.getResponseMappingExtracts(resourceType, adaptorType);
    return extractFields.map(m => ({
      id: m,
      name: m,
    }));
  },
  getFieldsAndListMappings: _mappings => {
    const mappings = deepClone(_mappings);
    let tempFm;
    const toReturn = [];

    mappings.fields &&
      mappings.fields.forEach(fm => {
        toReturn.push(fm);
      });
    mappings.lists &&
      mappings.lists.forEach(lm => {
        lm.fields.forEach(fm => {
          tempFm = { ...fm };
          tempFm.generate = lm.generate
            ? [lm.generate, tempFm.generate].join('[*].')
            : tempFm.generate;

          toReturn.push(tempFm);
        });
      });

    return toReturn;
  },
  generateMappingFieldsAndList: (mappings = []) => {
    let generateParts;
    const lists = [];
    const fields = [];
    let generateListPath;

    mappings.forEach(mappingTmp => {
      const mapping = { ...mappingTmp };

      delete mapping.rowIdentifier;

      if (!mapping.generate) {
        return true;
      }

      generateParts = mapping.generate ? mapping.generate.split('[*].') : null;
      let list;

      if (generateParts && generateParts.length > 1) {
        mapping.generate = generateParts.pop();
        generateListPath = generateParts.join('.');

        list = lists.find(l => l.generate === generateListPath);

        if (!list) {
          list = {
            generate: generateListPath,
            fields: [],
          };
          lists.push(list);
        }
      }

      list ? list.fields.push(mapping) : fields.push(mapping);
    });

    return {
      fields,
      lists,
    };
  },
};
