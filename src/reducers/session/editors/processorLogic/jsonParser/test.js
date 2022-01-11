/* global describe, test, expect */
import processorLogic from './index';

const {
  requestBody,
  processResult,
} = processorLogic;

describe('jsonParser processor logic', () => {
  describe('requestBody util', () => {
    test('should return the correct data and rule object with options', () => {
      const rule = {
        resourcePath: '*',
        groupByFields: ['id', 'Email'],
        sortByFields: ['Name'],
      };
      const data = [
        {id: '1997',
          Name: 'Bob',
          Email: 'bob@gmail.com',
          game: 'Basket Ball'},
      ];

      const expectedBody = {
        rules: {
          resourcePath: '*',
          groupByFields: ['id', 'Email'],
          sortByFields: ['Name'],
        },
        data,
      };

      expect(requestBody({rule, data})).toEqual(expectedBody);
    });
  });
  describe('processResult util', () => {
    test('should return passed result without modifying if isSuiteScriptData is true', () => {
      const result = {
        data: [[{id: 123}]],
      };

      expect(processResult({isSuiteScriptData: true}, result)).toBe(result);
    });
    test('should update and return the correctly wrapped result', () => {
      const result = {
        data: [[{id: '1997',
          Name: 'Bob',
          Email: 'bob@gmail.com',
          game: 'Basket Ball'}]],
      };
      const expectedResult = {
        columnsData: result.data,
        data: {
          page_of_records: [
            {rows: [{id: '1997',
              Name: 'Bob',
              Email: 'bob@gmail.com',
              game: 'Basket Ball'}]},
          ],
        },
      };

      expect(processResult({}, result)).toEqual(expectedResult);
    });
  });
});
