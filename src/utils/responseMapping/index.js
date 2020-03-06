import { deepClone } from 'fast-json-patch/lib/core';

export const LookupResponseMappingExtracts = [
  'data',
  'errors',
  'ignored',
  'statusCode',
];

export const ImportResponseMappingExtracts = [
  'id',
  'errors',
  'ignored',
  'statusCode',
];

export default {
  getResponseMappingDefaultExtracts: resourceType => {
    const extractFields =
      resourceType === 'imports'
        ? ImportResponseMappingExtracts
        : LookupResponseMappingExtracts;

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
