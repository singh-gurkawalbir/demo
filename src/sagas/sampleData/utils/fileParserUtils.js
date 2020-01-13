import { call } from 'redux-saga/effects';
import { invert } from 'lodash';
import { evaluateExternalProcessor } from '../../../sagas/editor';
import { apiCallWithRetry } from '../../index';
import csvOptions from '../../../components/AFE/CsvConfigEditor/options';

/*
 * Below sagas are Parser sagas for resource sample data
 */

const PARSERS = {
  csv: 'csvParser',
  xlsx: 'csvParser',
  xml: 'xmlParser',
};

/*
 * type: row / column
 * value: corresponds value in RowDelimiterMap/ColumnDelimiterMap
 * Returns label corresponding to the value of the map as evaluateExternalProcessor saga expects labels of delimiters
 */
function getDelimiterLabel(type, value) {
  const delimiterMap =
    csvOptions[type === 'row' ? 'RowDelimiterMap' : 'ColumnDelimiterMap'];

  // Extracts key from the value given against RowDelimiterMap & ColumnDelimiterMap
  return value && invert(delimiterMap)[value];
}

// Any customization on file options before passing to processor is done here
export const generateFileParserOptions = (options = {}, type) => {
  if (type === 'csv' || type === 'xlsx') {
    return {
      ...options,
      rowDelimiter: getDelimiterLabel('row', options.rowDelimiter),
      columnDelimiter: getDelimiterLabel('column', options.columnDelimiter),
      multipleRowsPerRecord: !!(
        options.keyColumns && options.keyColumns.length
      ),
    };
  }

  return options;
};

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
 */
export function* parseFileDefinition({ sampleData, resource }) {
  const { file = {} } = resource;
  const { _fileDefinitionId } = file.fileDefinition || {};

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
      message: `Fetching flows Preview`,
      hidden: true,
    });

    return parsedFileDefinitionData;
  } catch (e) {
    // Handle errors
    return {};
  }
}
