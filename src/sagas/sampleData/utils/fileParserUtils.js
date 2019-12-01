import { call } from 'redux-saga/effects';
import { evaluateExternalProcessor } from '../../../sagas/editor';

/*
 * Below sagas are Parser sagas for resource sample data
 */

const PARSERS = {
  csv: 'csvParser',
  xlsx: 'csvParser',
  xml: 'xmlParser',
  fileDefinition: 'structuredFileParser',
};

export default function* parseFileData({ sampleData, resource }) {
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
