/* global describe, test, expect, */
import getForm from './formMeta';

describe('CsvParse Rules UI tests', () => {
  test('should return an object with the required propperties when fieldId is passed as "keyColumns" to the optionsHandler fumction', () => {
    const options = {
      code: 'custom code',
      entryFunction: 'preSavePage',
      scriptId: '5b3c75dd5d3c125c88b5cc00',
      trimSpaces: true,
      keyColumns: ['demo'],
      ignoreSortAndGroup: true,
      hasHeaderRow: true,
      rowDelimiter: '\n',
      columnDelimiter: '*',
    };

    const formMeta = getForm(options);
    const result = formMeta.optionsHandler('keyColumns', [{id: 'rowDelimiter', value: 'value'}]);

    expect(result).toHaveProperty('rowDelimiter');
    expect(result).toHaveProperty('columnDelimiter');
    expect(result).toHaveProperty('trimSpaces');
    expect(result).toHaveProperty('rowsToSkip');
    expect(result).toHaveProperty('hasHeaderRow');
    expect(result).toHaveProperty('fileType');
  });
});
