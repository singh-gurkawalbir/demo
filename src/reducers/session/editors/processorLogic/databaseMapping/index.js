import sql, { _hasDefaultMetaData } from '../sql';
import { _editorSupportsV1V2data } from '../handlebars';

export const getEditorTitle = adaptorType => {
  if (adaptorType === 'MongodbImport') {
    return 'MongoDB document builder';
  }
  if (adaptorType === 'DynamodbImport') {
    return 'DynamoDB query builder';
  }
  if (adaptorType === 'RDBMSImport') {
    return 'SQL query builder';
  }

  return '';
};

export default {
  processor: 'handlebars',
  init: ({ resource, connection, isPageGenerator, isStandaloneExport, options }) => {
    const {adaptorType, rdbms, mongodb, dynamodb, modelMetadata} = resource || {};
    let adaptorSpecificOptions = {};
    let query;

    if (adaptorType === 'RDBMSImport') {
      const {lookups, query: rdbmsQuery} = rdbms || {};

      adaptorSpecificOptions = {
        lookups,
        modelMetadata,
        adaptorType,
      };
      query = rdbmsQuery;
    } else if (adaptorType === 'MongodbImport') {
      const {method, document, update} = mongodb || {};

      adaptorSpecificOptions = {
        method,
        adaptorType,
      };
      query = method === 'insertMany' ? document : update;
    } else if (adaptorType === 'DynamodbImport') {
      const {method, itemDocument} = dynamodb || {};

      adaptorSpecificOptions = {
        method,
        adaptorType,
      };
      query = method === 'putItem' && itemDocument;
    }

    const formattedRule = typeof options.arrayIndex === 'number' && Array.isArray(query) ? query[options.arrayIndex] : query;
    const rule = typeof formattedRule === 'string' ? formattedRule : JSON.stringify(formattedRule, null, 2);

    const editorSupportsV1V2data = _editorSupportsV1V2data({resource, fieldId: options.fieldId, connection, isPageGenerator, isStandaloneExport});
    let v1Rule;
    let v2Rule;

    if (editorSupportsV1V2data) {
      v1Rule = rule;
      v2Rule = rule;
    }

    return {
      ...options,
      ...adaptorSpecificOptions,
      query,
      rule,
      v1Rule,
      v2Rule,
      supportsDefaultData: _hasDefaultMetaData(options),
      resultMode: 'text',
      editorSupportsV1V2data,
      editorTitle: getEditorTitle(adaptorType),
    };
  },
  buildData: sql.buildData,
  requestBody: sql.requestBody,
  dirty: sql.dirty,
  validate: sql.validate,
  patchSet: editor => {
    const {
      resourceId,
      resourceType,
      rule,
      query,
      arrayIndex,
      adaptorType,
      defaultData,
      lookups,
      method,
    } = editor;
    const patches = [];

    if (adaptorType === 'MongodbImport') {
      patches.push({
        op: 'replace',
        path: method === 'insertMany' ? '/mongodb/document' : '/mongodb/update',
        value: rule,
      });
    } else if (adaptorType === 'DynamodbImport' && method === 'putItem') {
      patches.push({
        op: 'replace',
        path: '/dynamodb/itemDocument',
        value: rule,
      });
    } else if (adaptorType === 'RDBMSImport') {
      const modifiedQuery = [...query];

      modifiedQuery[arrayIndex] = rule;
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
        const dataToPatch = JSON.parse(defaultData) || {};

        if (dataToPatch) {
          patches.push({
            op: 'replace',
            path: '/modelMetadata',
            value: dataToPatch,
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

