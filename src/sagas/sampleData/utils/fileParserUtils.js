import { call } from 'redux-saga/effects';
import { evaluateExternalProcessor } from '../../editor';
import { apiCallWithRetry } from '../../index';
import { processJsonSampleData, processJsonPreviewData } from '../../../utils/sampleData';

/*
 * Below sagas are Parser sagas for resource sample data
 */

const PARSERS = {
  csv: 'csvParser',
  xlsx: 'csvParser',
  xml: 'xmlParser',
  json: 'jsonParser',
};

/**
 * NOTE: All the fields used to extract options for a file type are based on
 * metadata field Ids for that resource
 * as we infer props on resource form while editing
 */
export const generateFileParserOptionsFromResource = (resource = {}) => {
  const fileType = resource?.file?.type;
  const fields = resource?.file?.[fileType] || {};
  const {sortByFields = [], groupByFields = []} = resource?.file || {};

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
      groupByFields,
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
    };
  }

  // no additional props for json - Add in future if updated
  if (fileType === 'json') {
    return {
      resourcePath: fields.resourcePath,
      sortByFields,
      groupByFields,
    };
  }
  // If not the above ones, it is of type file definition
  const fileDefinitionRules = resource.file?.filedefinition?.rules;

  return {
    rule: fileDefinitionRules,
    sortByFields,
    groupByFields,
  };
};

export function* parseFileData({ sampleData, resource }) {
  if (!resource?.file?.type) {
    return;
  }
  const fileType = resource.file.type;

  if (!PARSERS[fileType]) {
    // not supported for parsing
    return;
  }
  const options = generateFileParserOptionsFromResource(resource);
  const processorData = {
    data: sampleData,
    editorType: PARSERS[fileType],
    rule: options,
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

    // Incase of resourcePath provided by user for a file definition
    // this util extracts passed path's data from the fileDefinitionSampleData
    // @Bug fix IO-15029
    if (
      resourcePath &&
      parsedFileDefinitionData &&
      parsedFileDefinitionData.data
    ) {
      const { data: sampleData } = parsedFileDefinitionData || {};
      const parsedSampleData = mode === 'parse' ? processJsonSampleData(sampleData, {
        resourcePath,
      })
        : processJsonPreviewData(sampleData, {
          resourcePath,
        });

      return { data: parsedSampleData };
    }

    // If there is no resourcePath, returns the resulting parsedFileDefinitionData
    return parsedFileDefinitionData;
  } catch (e) {
    // Handle errors
  }
}
