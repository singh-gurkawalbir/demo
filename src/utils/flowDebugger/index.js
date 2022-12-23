/* eslint-disable valid-typeof */
import sizeof from 'object-sizeof';
import errorMessageStore from '../errorStore';
import { isValidCanonicalFormForExportData, isValidCanonicalFormForImportResponse, unwrapExportFileSampleData } from '../sampleData';
import { safeParse } from '../string';

const MAX_SIZE_IN_BYTES = 1000000;

export const validateMockOutputField = value => {
  if (value === '') return;

  const jsonValue = safeParse(value);

  // invalid json
  if (!jsonValue) return errorMessageStore('MOCK_OUTPUT_INVALID_JSON');

  // size greater than 1MB
  if (sizeof(jsonValue) > MAX_SIZE_IN_BYTES) {
    return errorMessageStore('MOCK_OUTPUT_SIZE_EXCEED');
  }

  // not in canonical format
  if (!isValidCanonicalFormForExportData(jsonValue)) {
    return errorMessageStore('MOCK_OUTPUT_INVALID_FORMAT');
  }

  // more than 10 records
  if (unwrapExportFileSampleData(jsonValue)?.length > 10) {
    return errorMessageStore('MOCK_OUTPUT_NUM_RECORDS_EXCEED');
  }
};

export const validateMockResponseField = value => {
  if (value === '') return;

  const jsonValue = safeParse(value);

  // invalid json
  if (!jsonValue) return errorMessageStore('MOCK_RESPONSE_INVALID_JSON');

  // size greater than 1MB
  if (sizeof(jsonValue) > MAX_SIZE_IN_BYTES) {
    return errorMessageStore('MOCK_RESPONSE_SIZE_EXCEED');
  }

  // not in canonical format
  if (!isValidCanonicalFormForImportResponse(jsonValue)) {
    return errorMessageStore('MOCK_RESPONSE_INVALID_FORMAT');
  }
};

export const getMockOutputFromResource = resource => {
  const {mockOutput} = resource || {};

  if (!mockOutput || validateMockOutputField(mockOutput)) return;

  const previewData = unwrapExportFileSampleData(mockOutput);

  // return first record if mockoutput has multiple records
  if (Array.isArray(previewData)) return previewData[0];

  return previewData;
};
