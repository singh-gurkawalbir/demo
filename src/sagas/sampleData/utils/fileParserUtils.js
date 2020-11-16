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
};

/**
 * NOTE: All the fields used to extract options for a file type are based on
 * metadata field Ids for that resource
 * as we infer props on resource form while editing
 */
export const generateFileParserOptionsFromResource = (resource = {}) => {
  const fileType = resource?.file?.type;
  const fields = resource?.file?.[fileType] || {};
  // console.log(fileType, resource);

  // For csv, xlsx - similar kind of props are supplies
  // Some of them are not supported for xlsx yet
  if (['csv', 'xlsx'].includes(fileType)) {
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
    };
  }

  if (fileType === 'xml') {
    const rules = resource?.parsers?.[0]?.rules || {};
    const { listNodes, includeNodes, excludeNodes, ...rest} = rules;

    return {
      resourcePath: fields.resourcePath,
      ...rest,
      // the export.parsers schema defines the following as arrays,
      // while the processor logic uses strings.
      listNodes: listNodes?.join('\n'),
      includeNodes: includeNodes?.join('\n'),
      excludeNodes: excludeNodes?.join('\n'),
    };
  }

  // no additional props for json and xml - Add in future if updated
  if (fileType === 'json') {
    return {};
  }
  // If not the above ones, it is of type file definition
  const fileDefinitionRules = resource.file && resource.file.filedefinition && resource.file.filedefinition.rules;

  return {
    rule: fileDefinitionRules,
  };
};

export function* parseFileData({ sampleData, resource }) {
  const { file } = resource;
  const { type } = file;
  const options = generateFileParserOptionsFromResource(resource);
  const processorData = {
    data: sampleData,
    processor: PARSERS[type],
    ...options,
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
    return {};
  }
}

/*
 * Given Sample data and fileDefinitionId , parses based on saved rules and returns JSON
 * @output: { data: parsedSampleData}
 */
export function* parseFileDefinition({ sampleData, resource, mode = 'parse' }) {
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
    return {};
  }
}
