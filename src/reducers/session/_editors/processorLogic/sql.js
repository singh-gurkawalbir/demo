import { cloneDeep } from 'lodash';
import util from '../../../../utils/json';
import { dataAsString } from '../../../../utils/editor';
import handlebars from './handlebars';
import { getDefaultData } from '../../../../utils/sampleData';
import { getUnionObject } from '../../../../utils/jsonPaths';
import { safeParse } from '../../../../utils/string';

const { merge } = require('lodash');

function _hasDefaultMetaData({fieldId, resourceType}) {
  const hideDefaultDataFields = [
    'dynamodb.expressionAttributeValues',
    'dynamodb.itemDocument',
    'mongodb.document',
    'mongodb.update',
    'mongodb.ignoreLookupFilter',
    'mongodb.filter',
    '_query',
    'salesforce.soql',
  ];

  if (hideDefaultDataFields.includes(fieldId)) {
    return false;
  }
  if (resourceType === 'exports' && (fieldId === 'rdbms.query' || fieldId === 'rdbms.once.query')) {
    return false;
  }

  return true;
}

export default {
  processor: 'handlebars',
  init: props => {
    const {adaptorType} = props.resource || {};
    let modelMetadata;

    if (adaptorType === 'RDBMSImport') {
      modelMetadata = props.formValues['/modelMetadata'];
    }

    return handlebars.init({...props, modelMetadata, supportsDefaultData: _hasDefaultMetaData(props.options)});
  },
  buildData: ({dataVersion, modelMetadata, supportsDefaultData}, sampleData) => {
    if (!supportsDefaultData) {
      return { data: sampleData};
    }
    if (modelMetadata) {
      const newMeta = cloneDeep(modelMetadata);
      const defaultData = dataVersion === 2 ? {record: newMeta} : {data: newMeta};

      return {
        data: sampleData,
        defaultData: JSON.stringify(defaultData, null, 2),
      };
    }
    const parsedData = safeParse(sampleData);
    let temp = {};

    if (Array.isArray(parsedData) && parsedData.length && typeof parsedData[0] === 'object') {
      temp = cloneDeep(getUnionObject(parsedData));
    } else if (parsedData) {
      temp = cloneDeep(parsedData);
    }
    const defaultData = getDefaultData(temp);

    return {
      data: sampleData,
      defaultData: dataAsString(defaultData) || '',
    };
  },
  requestBody: editor => ({
    rules: { strict: !!editor.strict, template: editor.rule },
    data: merge(
      {},
      editor.defaultData ? JSON.parse(editor.defaultData) : {},
      editor.data ? JSON.parse(editor.data) : {}
    ),
  }),
  validate: editor => {
    const getDataError = () => {
      const errMessages = [];

      if (editor.data) {
        const message = util.validateJsonString(editor.data);

        if (message) errMessages.push(`Sample Data: ${message}`);
      }

      if (editor.defaultData) {
        const message = util.validateJsonString(editor.defaultData);

        if (message) errMessages.push(`Default Data: ${message}`);
      }

      return errMessages.join('\n');
    };

    return {
      dataError: getDataError(),
    };
  },
};
