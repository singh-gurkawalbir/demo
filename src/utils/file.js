import XLSX from 'xlsx';
import { each } from 'lodash';

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

/**
 * Reads the xslx content passed as string
 *
 * @params {string} data
 *
 * @returns {object} CSV Data
 */
export function getCsvFromXlsx(data) {
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
const generateFields = (data, options = {}) => {
  const {
    columnDelimiter = ',',
    rowDelimiter = '\n',
    includeHeader = true,
  } = options;
  let fieldsList;

  if (columnDelimiter && rowDelimiter) {
    fieldsList = data.split(rowDelimiter)[0].split(columnDelimiter);
  } else {
    fieldsList = data;
  }

  const fields = [];

  each(fieldsList, (field, index) => {
    const column = includeHeader
      ? // eslint-disable-next-line no-useless-escape
        field.replace(/^\"(.*)\"$/, '$1')
      : `Column${index}`;

    if (column) {
      fields.push([column, column]);
    }
  });

  return fields;
};

/*
 * sample csv content
 * "a,b,c
 * 1,2,3
 * 4,5,6"
 * Extracts headers from the above csv content [a,b,c]
 * Returns [{id: 'a', type: 'string'}, {id: 'b', type: 'string'}, {id: 'c', type: 'string'}]
 */
export function extractFieldsFromCsv(data = '', options = {}) {
  if (typeof data !== 'string') return;
  const fields = generateFields(data, options);

  return fields.map(col => ({ id: col[0], type: 'string' }));
}
