import { deepClone } from 'fast-json-patch/lib/core';
import responseMappingUtil from './';

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
  getPatchSet: value => {
    const {
      mappings,
      resourceIndex,
      resourceType,
      pageProcessor,
      resource,
      flowId,
    } = value;
    const patchSet = [];
    const _mappings = mappings.map(({ rowIdentifier, ...others }) => others);
    const mappingsWithListsAndFields = responseMappingUtil.generateMappingFieldsAndList(
      _mappings
    );

    if (
      pageProcessor &&
      pageProcessor[resourceIndex] &&
      pageProcessor[resourceIndex].responseMapping
    ) {
      const obj = {};

      obj.responseMapping = {};
      obj.type = resourceType === 'imports' ? 'import' : 'export';
      obj[resourceType === 'imports' ? '_importId' : '_exportId'] =
        resource._id;
      patchSet.push({
        op: 'add',
        path: `/pageProcessors/${resourceIndex}`,
        value: obj,
      });
    }

    patchSet.push({
      op: 'replace',
      path: `/pageProcessors/${resourceIndex}/responseMapping`,
      value: mappingsWithListsAndFields,
    });

    return {
      patch: patchSet,
      resourceType: 'flows',
      resourceId: flowId,
    };
  },
};
