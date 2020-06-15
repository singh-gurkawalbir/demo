import { call } from 'redux-saga/effects';
import { evaluateExternalProcessor } from '../../editor';
import { apiCallWithRetry } from '../../index';
import { processJsonSampleData } from '../../../utils/sampleData';

/*
 * Below sagas are Parser sagas for resource sample data
 */

const PARSERS = {
  csv: 'csvParser',
  xlsx: 'csvParser',
  xml: 'xmlParser',
};

// Any customization on file options before passing to processor is done here
export const generateFileParserOptions = (options = {}, type) => {
  if (type === 'csv' || type === 'xlsx') {
    return {
      ...options,
      multipleRowsPerRecord: !!(
        options.keyColumns && options.keyColumns.length
      ),
    };
  }

  return options;
};

/**
 * NOTE: All the fields used to extract options for a file type are based on
 * metadata field Ids for that resource
 * as we infer props on resource form while editing
 */
export const generateFileParserOptionsFromResource = (resource = {}, type) => {
  const { type: fileType } = resource.file || {};
  const fields = (resource.file && resource.file[fileType]) || {};
  // For csv, xlsx - similar kind of props are supplies
  // Some of them are not supported for xlsx yet
  if (['csv', 'xlsx'].includes(type)) {
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
    }
  }
  // no additional props for json and xml - Add in future if updated
  if (type === 'json' || type === 'xml') {
    return {};
  }
  // If not the above ones, it is of type file definition
  const fileDefinitionRules = resource.file.filedefinition && resource.file.filedefinition.rules;
  return {
    rule: fileDefinitionRules,
  }
}

export function* parseFileData({ sampleData, resource }) {
  const { file } = resource;
  const { type } = file;
  const options = generateFileParserOptions(file[type], type);
  const processorData = {
    data: sampleData,
    processor: PARSERS[type],
    ...options,
  };

  try {
    const processedData = yield call(evaluateExternalProcessor, {
      processorData,
    });

    return processedData;
  } catch (e) {
    // Handle errors
    return {};
  }
}

/*
 * Given Sample data and fileDefinitionId , parses based on saved rules and returns JSON
 * @output: { data: parsedSampleData}
 */
export function* parseFileDefinition({ sampleData, resource }) {
  const { file = {} } = resource;
  const { _fileDefinitionId, resourcePath } = file.fileDefinition || {};

  if (!_fileDefinitionId || !sampleData) return {};

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
      message: 'Fetching flows Preview',
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
      const parsedSampleData = processJsonSampleData(sampleData, {
        resourcePath,
      });

      return { data: parsedSampleData };
    }

    // If there is no resourcePath, returns the resulting parsedFileDefinitionData
    return parsedFileDefinitionData;
  } catch (e) {
    // Handle errors
    return {};
  }
}
