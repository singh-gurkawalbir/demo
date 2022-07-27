import { select, call } from 'redux-saga/effects';
import { evaluateExternalProcessor } from '../../editor';
import { apiCallWithRetry } from '../../index';
import { processJsonSampleData, processJsonPreviewData } from '../../../utils/sampleData';
import { selectors } from '../../../reducers';

/*
 * Below sagas are Parser sagas for resource sample data
 */

const PARSERS = {
  csv: 'csvParser',
  xlsx: 'csvParser',
  xml: 'xmlParser',
  json: 'jsonParser',
};

/*
 * NOTE: We have two different mechanisms present to group records based on fields in BE
 * For old export docs which have groupByFields and no groupEmptyValues set or is false, we use previous mechanism
 * For all other cases with, we use new mechanism
 */

export const shouldGroupEmptyValues = (newGroupByFields, oldResourceDoc, fileType, newKeyColumns = []) => {
  const {groupByFields = [], groupEmptyValues} = oldResourceDoc?.file || {};
  const keyColumns = oldResourceDoc?.file?.[fileType]?.keyColumns || [];

  if (!newGroupByFields.length && ['csv', 'xlsx'].includes(fileType) && newKeyColumns.length) {
    newGroupByFields.push(...newKeyColumns);
  }

  if (!newGroupByFields.length) return undefined;

  if (!groupByFields.length && !(['csv', 'xlsx'].includes(fileType) && keyColumns.length)) return true;

  return !!groupEmptyValues;
};

/**
 * NOTE: All the fields used to extract options for a file type are based on
 * metadata field Ids for that resource
 * as we infer props on resource form while editing
 */
export const generateFileParserOptionsFromResource = (resource = {}, oldResourceDoc) => {
  const fileType = resource?.file?.type;
  const fields = resource?.file?.[fileType] || {};
  const {sortByFields = [], groupByFields = []} = resource?.file || {};
  const groupEmptyValues = shouldGroupEmptyValues(groupByFields, oldResourceDoc, fileType, fields.keyColumns);

  if (!fileType) {
    return;
  }

  // For csv, xlsx - similar kind of props are supplies
  // Some of them are not supported for xlsx yet
  if (['csv', 'xlsx'].includes(fileType)) {
    if (['HTTPExport', 'RESTExport'].includes(resource?.adaptorType)) {
      return {
        rowsToSkip: fields.rowsToSkip,
        trimSpaces: fields.trimSpaces,
        columnDelimiter: fields.columnDelimiter,
        hasHeaderRow: fields.hasHeaderRow,
        rowDelimiter: fields.rowDelimiter,
        multipleRowsPerRecord:
        fields.keyColumns &&
        Array.isArray(fields.keyColumns) &&
        fields.keyColumns.length,
        keyColumns: fields.keyColumns,
        ignoreSortAndGroup: true,
      };
    }

    return {
      rowsToSkip: fields.rowsToSkip,
      trimSpaces: fields.trimSpaces,
      columnDelimiter: fields.columnDelimiter,
      hasHeaderRow: fields.hasHeaderRow,
      rowDelimiter: fields.rowDelimiter,
      sortByFields,
      groupByFields: groupByFields.length ? groupByFields : fields.keyColumns || [],
      groupEmptyValues,
    };
  }

  if (fileType === 'xml') {
    const rules = resource?.parsers?.[0]?.rules || {};
    const { listNodes, includeNodes, excludeNodes, ...rest} = rules;

    return {
      resourcePath: fields.resourcePath,
      ...rest,
      listNodes,
      includeNodes,
      excludeNodes,
      sortByFields,
      groupByFields,
      groupEmptyValues,
    };
  }

  if (fileType === 'json') {
    return {
      resourcePath: fields.resourcePath,
      sortByFields,
      groupByFields,
      groupEmptyValues,
    };
  }
  // If not the above ones, it is of type file definition
  const fileDefinitionRules = resource.file?.filedefinition?.rules;

  return {
    rule: fileDefinitionRules,
    sortByFields,
    groupByFields,
    groupEmptyValues,
  };
};

export function* parseFileData({ sampleData, resource, resourceType = 'exports' }) {
  const oldResourceDoc = yield select(selectors.resource, resourceType, resource?._id);

  if (!resource?.file?.type) {
    return;
  }
  const fileType = resource.file.type;

  if (!PARSERS[fileType]) {
    // not supported for parsing
    return;
  }
  const options = generateFileParserOptionsFromResource(resource, oldResourceDoc);
  const processorData = {
    data: sampleData,
    editorType: PARSERS[fileType],
    rule: options,
    resourceType,
  };

  // console.log('parseFileData', processorData);

  try {
    const processedData = yield call(evaluateExternalProcessor, {
      processorData,
    });

    // console.log(processedData);
    return processedData;
  } catch (e) {
    // Handle errors
  }
}

/*
 * Given Sample data and fileDefinitionId , parses based on saved rules and returns JSON
 * @output: { data: parsedSampleData}
 */
export function* parseFileDefinition({ sampleData, resource, mode = 'parse' }) {
  if (!resource?.file?.type || !resource.file.fileDefinition?._fileDefinitionId || !sampleData) {
    return;
  }
  const { _fileDefinitionId, resourcePath } = resource.file.fileDefinition || {};

  try {
    const parsedFileDefinitionData = yield call(apiCallWithRetry, {
      path: `/fileDefinitions/parse?_fileDefinitionId=${_fileDefinitionId}`,
      opts: {
        method: 'POST',
        body: {
          data: sampleData,
          _fileDefinitionId,
        },
      },
      message: 'Loading',
      hidden: true,
    });
    const sampleParsedFileDefinitionData = Array.isArray(parsedFileDefinitionData?.data) ? parsedFileDefinitionData?.data[0] : parsedFileDefinitionData?.data;

    // Incase of resourcePath provided by user for a file definition
    // this util extracts passed path's data from the fileDefinitionSampleData
    // @Bug fix IO-15029
    if (
      resourcePath &&
      parsedFileDefinitionData &&
      parsedFileDefinitionData.data
    ) {
      const parsedSampleData = mode === 'parse' ? processJsonSampleData(sampleParsedFileDefinitionData, {
        resourcePath,
      })
        : processJsonPreviewData(sampleParsedFileDefinitionData, {
          resourcePath,
        });

      return { data: parsedSampleData };
    }

    // If there is no resourcePath, returns the resulting parsedFileDefinitionData
    return { data: sampleParsedFileDefinitionData };
  } catch (e) {
    // Handle errors
  }
}
