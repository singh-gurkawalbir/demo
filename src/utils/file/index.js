import { each } from 'lodash';
import { MAX_FILE_SIZE } from '../constants';
import { isJsonString } from '../string';
import retry from '../retry';
import messageStore from '../../constants/messages';

// A map that returns corresponding application file types used for file uploading
export const fileTypeToApplicationTypeMap = {
  csv: 'text/csv',
  json: 'application/json',
  xml: 'application/xml',
  xlsx: 'application/vnd.ms-excel',
};

/*
 * Validates file type against all possible file types when user uploads a file
 * validFileTypes - Took reference from 'integrator' Repository
 */
export function isValidFileType(fileType, file) {
  const validFileTypes = {
    csv: [
      'text/csv',
      'text/plain',
      'application/vnd.ms-excel',
      'application/comma-separated-values',
      '',
      undefined,
    ],
    json: ['application/json', '', undefined],
    xml: ['application/xml', 'text/xml', '', undefined],
    xlsx: [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ],
  };

  // In ADP connection, Client certificates need to included, those will not have file type.
  //  File can not be validated if it doesn't have file type, so assuming it is a valid file.
  return validFileTypes[fileType]
    ? validFileTypes[fileType].includes(file?.type)
    : true;
}

// Validates file size against MAX_FILE_SIZE as per Bug @IO-12216
export const isValidFileSize = (file, maxSize) => file?.size <= maxSize;

export const getUploadedFileStatus = (file, fileType, fileProps = {}) => {
  if (!file) return {};
  const { maxSize = MAX_FILE_SIZE } = fileProps;

  if (!isValidFileSize(file, maxSize)) return { success: false, error: messageStore('FILE_SIZE_EXCEEDED') };

  if (fileType && !isValidFileType(fileType, file)) return { success: false, error: messageStore('FILE_TYPE_INVALID', {fileType}) };

  return { success: true };
};

export function getFileReaderOptions(type) {
  if (!type) return {};

  if (type === 'json') {
    return { expectedContentType: 'json' };
  }

  if (type === 'xlsx') {
    return { readAsArrayBuffer: true };
  }

  return {};
}

export const getJSONContentFromString = data => {
  if (!isJsonString(data)) {
    return { success: false, error: messageStore('FILE_TYPE_INVALID', {fileType: 'JSON'}) };
  }

  return { success: true, data: JSON.parse(data) };
};

/**
 * Reads the xslx content passed as string
 *
 * @params {string} data
 *
 * @returns {object} CSV Data
 */
export async function getCsvFromXlsx(data) {
  const { default: XLSX } = await retry(() => import(/* webpackChunkName: "XLSX" */'xlsx'));
  let workBook;
  let result;

  try {
    const typedArray = String.fromCharCode.apply(null, new Uint8Array(data));

    workBook = XLSX.read(window.btoa(typedArray), { type: 'base64' });
  } catch (ex) {
    try {
      const base64 = window.btoa(
        new Uint8Array(data).reduce(
          (locData, byte) => locData + String.fromCharCode(byte),
          ''
        )
      );

      workBook = XLSX.read(base64, { type: 'base64' });
    } catch (ex) {
      return {
        success: false,
        error: 'Upload Error',
      };
    }
  }

  workBook.SheetNames.forEach(sheetName => {
    try {
      result = XLSX.utils.sheet_to_csv(workBook.Sheets[sheetName]);
    } catch (e) {
      return {
        success: false,
        error: 'Upload Error',
      };
    }
  });

  return {
    success: true,
    result,
  };
}

/*
 * sample csv content
 * "a,b,c
 * 1,2,3
 * 4,5,6"
 * Extracts headers from the above csv content [a,b,c] if includeHeader is true
 * Else, default headers [Column0, Column1, ...ColumnN] are considered
 * Returns [[a,a], [b,b], [c,c]]
 */
export const generateCSVFields = (data, options = {}) => {
  if (!data || typeof data !== 'string') return [];
  const {
    columnDelimiter = ',',
    rowDelimiter = '\n',
    includeHeader = true,
  } = options;

  const fieldsList = data.split(rowDelimiter)[0].split(columnDelimiter);

  const fields = [];

  // Trims the headers incase of any spaces/'/n's or '/r's existing while uploading a file
  // @BugFix: IO-14393
  each(fieldsList, (field, index) => {
    const column = includeHeader
      // eslint-disable-next-line no-useless-escape
      ? field.replace(/^\"(.*)\"$/, '$1').trim()
      : `Column${index}`;

    if (column) {
      fields.push([column, column]);
    }
  });

  return fields;
};

export const getFileColumns = result => {
  const columnsData = result?.columnsData || result?.data;

  if (!columnsData?.length) {
    return [];
  }

  const sampleRecord = Array.isArray(columnsData[0])
    ? columnsData[0][0]
    : columnsData[0];

  return Object.keys(sampleRecord);
};
