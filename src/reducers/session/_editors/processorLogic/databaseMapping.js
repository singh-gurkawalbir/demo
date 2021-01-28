export default {
  patchSet: editor => {
    const {
      template,
      defaultData,
      lookups,
      optionalSaveParams = {},
    } = editor;
    const { adaptorType, resourceId, resourceType, queryIndex, query, method } = optionalSaveParams || {};
    const patches = [];

    if (adaptorType === 'MongodbImport') {
      patches.push({
        op: 'replace',
        path: method === 'insertMany' ? '/mongodb/document' : '/mongodb/update',
        value: template,
      });
    } else if (adaptorType === 'DynamodbImport' && method === 'putItem') {
      patches.push({
        op: 'replace',
        path: '/dynamodb/itemDocument',
        value: template,
      });
    } else if (adaptorType === 'RDBMSImport') {
      const modifiedQuery = [...query];

      modifiedQuery[queryIndex] = template;
      patches.push({
        op: 'replace',
        path: '/rdbms/query',
        value: modifiedQuery,
      });
      patches.push({
        op: 'replace',
        path: '/rdbms/lookups',
        value: lookups,
      });
      try {
        const parsedDefaultData = JSON.parse(defaultData);

        if (parsedDefaultData.data) {
          patches.push({
            op: 'replace',
            path: '/modelMetadata',
            value: parsedDefaultData.data,
          });
        } else if (parsedDefaultData.record) {
          patches.push({
            op: 'replace',
            path: '/modelMetadata',
            value: parsedDefaultData.record,
          });
        }
      } catch (e) {
        // do nothing
      }
    }

    return {
      foregroundPatches: [{
        patch: patches,
        resourceType,
        resourceId,
      }],
    };
  },
};

