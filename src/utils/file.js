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
  let result;
  let arr;
  let base64;
  let wb;

  try {
    arr = String.fromCharCode.apply(null, new Uint8Array(data));
    wb = XLSX.read(window.btoa(arr), { type: 'base64' });
  } catch (ex) {
    try {
      base64 = window.btoa(
        new Uint8Array(data).reduce(
          (locData, byte) => locData + String.fromCharCode(byte),
          ''
        )
      );
      wb = XLSX.read(base64, { type: 'base64' });
    } catch (ex) {
      return result;
    }
  }

  wb.SheetNames.forEach(sheetName => {
    try {
      result = XLSX.utils.sheet_to_csv(wb.Sheets[sheetName]);
    } catch (e) {
      // console.log('caught error while converting sheet to csv');
    }
  });

  return result;
}
