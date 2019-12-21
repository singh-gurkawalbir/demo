import { call } from 'redux-saga/effects';
import { evaluateExternalProcessor } from '../../../sagas/editor';
import { apiCallWithRetry } from '../../index';
/*
 * Below sagas are Parser sagas for resource sample data
 */

const PARSERS = {
  csv: 'csvParser',
  xlsx: 'csvParser',
  xml: 'xmlParser',
};

export function* parseFileData({ sampleData, resource }) {
  const { file } = resource;
  const { type } = file;
  const options = file[type] || {};
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
