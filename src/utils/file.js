import XLSX from 'xlsx';

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
