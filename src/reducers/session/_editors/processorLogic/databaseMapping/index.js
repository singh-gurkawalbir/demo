import sql, { _hasDefaultMetaData } from '../sql';
import { _editorSupportsV1V2data } from '../handlebars';

const getEditorTitle = adaptorType => {
  if (adaptorType === 'MongodbImport') {
    return 'MongoDB document builder';
  }
  if (adaptorType === 'DynamodbImport') {
    return 'DynamoDB query builder';
  }
  if (adaptorType === 'RDBMSImport') {
    return 'SQL query builder';
  }
};

export default {
  processor: 'handlebars',
  init: ({ resource, connection, isPageGenerator, options }) => {
    let adaptorSpecificOptions = {};
    let query;
    let method;

    if (resource.adaptorType === 'RDBMSImport') {
      adaptorSpecificOptions = {
        lookups: resource.rdbms.lookups,
        modelMetadata: resource.modelMetadata,
        adaptorType: 'RDBMSImport',
      };
      query = resource.rdbms.query;
    } else if (resource.adaptorType === 'MongodbImport') {
      adaptorSpecificOptions = {
        method: resource.mongodb.method,
        adaptorType: 'MongodbImport',
      };
      query = resource.mongodb.method === 'insertMany' ? resource.mongodb.document : resource.mongodb.update;
      method = resource.mongodb.method;
    } else if (resource.adaptorType === 'DynamodbImport') {
      adaptorSpecificOptions = {
        method: resource.dynamodb.method,
        adaptorType: 'DynamodbImport',
      };
      query = resource.dynamodb.method === 'putItem' && resource.dynamodb.itemDocument;
      method = resource.dynamodb.method;
    }

    const formattedRule = typeof options.arrayIndex === 'number' && Array.isArray(query) ? query[options.arrayIndex] : query;
    const rule = typeof formattedRule === 'string' ? formattedRule : JSON.stringify(formattedRule, null, 2);

    const editorSupportsV1V2data = _editorSupportsV1V2data({resource, fieldId: options.fieldId, connection, isPageGenerator});
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
      editorTitle: getEditorTitle(resource.adaptorType),
      method,
    };
  },
  buildData: sql.buildData,
  requestBody: sql.requestBody,
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
        const parsedDefaultData = JSON.parse(defaultData) || {};
        const dataToPatch = parsedDefaultData.data || parsedDefaultData.record || parsedDefaultData.row;

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

