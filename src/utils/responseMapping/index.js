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
  /**
   *
   * getResponseMappingExtracts: returns extract array list for response mapping.
   * Also, used in flowData utils.
   *
   */
  getResponseMappingExtracts: (resourceType, adaptorType) => {
    if (resourceType === 'imports') {
      if (['RESTImport', 'HTTPImport'].includes(adaptorType)) { return [...IMPORT_RESPONSE_MAPPING_EXTRACTS, 'headers']; }

      return IMPORT_RESPONSE_MAPPING_EXTRACTS;
    }

    return LOOKUP_RESPONSE_MAPPING_EXTRACTS;
  },

  /**
   *
   * getResponseMappingDefaultExtracts: returns extract suggestions to be displayed
   * in Response Mapping window
   *
   */
  getResponseMappingDefaultExtracts(resourceType, adaptorType) {
    const extractFields = this.getResponseMappingExtracts(resourceType, adaptorType);

    return extractFields.map(m => ({
      id: m,
      name: m,
    }));
  },

  /**
   * getFieldsAndListMappings takes response mapping as input as returns flattended mapping structure
   * it into list and list mapping structure
   *
   * Ex: Input:
   *  mapping = {
   *      fields: [
   *        {generate: 'fg1', extract: 'e1'},
   *      ],
   *      lists: [
   *        {
   *          generate: 'lg1',
   *          fields: [
   *            {generate: 'lfg1', extract: 'lge1'},
   *            {generate: 'lfg2', extract: 'lge2'},
   *          ],
   *        },
   *      ],
   *    },
   *    Output = [
   *      {generate: 'fg1', extract: 'e1'},
   *      {generate: 'lg1[*].lfg1', extract: 'lge1'},
   *      {generate: 'lg1[*].lfg2', extract: 'lge2'},
   *    ]
   */
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

  /**
   * generateMappingFieldsAndList takes flattened response mapping list and converts
   * it into list and list mapping structure
   *
   * Ex: Input:
   * mapping = [
   *            {generate: 'abc', extract: 'a'},
   *            {generate: 'lg1[*].lfg1', extract: 'lge1'},
   *            {generate: 'lg1[*].lfg2', extract: 'lge2'},
   *            {generate: 'lg2[*].lfg21', extract: 'lge21'},
   *           ]
   * Output = {
   *       fields: [{generate: 'abc', extract: 'a'}],
   *      lists: [
   *        {
   *          generate: 'lg1',
   *          fields: [
   *            {generate: 'lfg1', extract: 'lge1'},
   *            {generate: 'lfg2', extract: 'lge2'},
   *          ],
   *        },
   *        {
   *          generate: 'lg2',
   *          fields: [
   *            {generate: 'lfg21', extract: 'lge21'},
   *          ],
   *        },
   *      ],
   *    }
   */
  generateMappingFieldsAndList: (mappings = []) => {
    let generateParts;
    const lists = [];
    const fields = [];
    let generateListPath;

    mappings.forEach(mappingTmp => {
      const mapping = { ...mappingTmp };

      delete mapping.key;

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
