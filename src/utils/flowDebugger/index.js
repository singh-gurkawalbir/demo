/* eslint-disable valid-typeof */
import sizeof from 'object-sizeof';
import { MAX_MOCK_DATA_SIZE } from '../../constants';
import errorMessageStore from '../errorStore';
import { isValidCanonicalFormForExportData, isValidCanonicalFormForImportResponse, unwrapExportFileSampleData } from '../sampleData';
import { safeParse } from '../string';

export const validateMockOutputField = value => {
  if (value === '' || !value) return;

  const jsonValue = safeParse(value);

  // invalid json
  if (!jsonValue) return errorMessageStore('MOCK_OUTPUT_INVALID_JSON');

  // size greater than 1MB
  if (sizeof(jsonValue) > MAX_MOCK_DATA_SIZE) {
    return errorMessageStore('MOCK_OUTPUT_SIZE_EXCEED');
  }

  // not in canonical format
  if (!isValidCanonicalFormForExportData(jsonValue)) {
    return errorMessageStore('MOCK_OUTPUT_INVALID_FORMAT');
  }

  // more than 10 records
  const unwrappedSampleData = unwrapExportFileSampleData(jsonValue);

  if (Array.isArray(unwrappedSampleData) && unwrappedSampleData.length > 10) {
    return errorMessageStore('MOCK_OUTPUT_NUM_RECORDS_EXCEED');
  }
};

export const validateMockResponseField = value => {
  if (value === '' || !value) return;

  const jsonValue = safeParse(value);

  // invalid json
  if (!jsonValue) return errorMessageStore('MOCK_RESPONSE_INVALID_JSON');

  // size greater than 1MB
  if (sizeof(jsonValue) > MAX_MOCK_DATA_SIZE) {
    return errorMessageStore('MOCK_RESPONSE_SIZE_EXCEED');
  }

  // not in canonical format
  if (!isValidCanonicalFormForImportResponse(jsonValue)) {
    return errorMessageStore('MOCK_RESPONSE_INVALID_FORMAT');
  }
};

export const validateMockDataField = (resourceType, value) =>
  resourceType === 'exports' ? validateMockOutputField(value) : validateMockResponseField(value);

export const getMockOutputFromResource = resource => {
  const {mockOutput} = resource || {};

  if (!mockOutput || validateMockOutputField(mockOutput)) return;

  const previewData = unwrapExportFileSampleData(mockOutput);

  // return first record if mockoutput has multiple records
  if (Array.isArray(previewData)) return previewData[0];

  return previewData;
};
