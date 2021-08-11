/* global describe, test, expect */
const { stringCompare, celigoListCompare } = require('./sort');

describe('Sort util function test', () => {
  describe('stringCompare function test', () => {
    test('should return correct sorted data for array of objects with compare property and type number', () => {
      const sampleArray = [
        {
          name: 'name3',
          errors: 123,
        }, {
          name: 'name1',
          errors: 0,
        }, {
          name: 'name4',
          errors: 345,
        }, {
          name: 'name2',
          errors: 0,
        }];

      sampleArray.sort(stringCompare('errors'));
      expect(sampleArray).toEqual([
        {
          name: 'name1',
          errors: 0,
        }, {
          name: 'name2',
          errors: 0,
        }, {
          name: 'name3',
          errors: 123,
        }, {
          name: 'name4',
          errors: 345,
        },
      ]);
    });
    test('should return correct sorted data for array of strings with all Capitals', () => {
      const sampleArray = ['Canada', 'USA', 'India', 'China', 'Australia', 'Swden', 'Sri Lanka', 'Germany'];

      sampleArray.sort(stringCompare());
      expect(sampleArray).toEqual(['Australia',
        'Canada',
        'China',
        'Germany',
        'India',
        'Sri Lanka',
        'Swden',
        'USA']);
    });

    test('should return correct sorted data for array of strings with all Capitals in descending order', () => {
      const sampleArray = ['Canada', 'USA', 'India', 'China', 'Australia', 'Swden', 'Sri Lanka', 'Germany'];

      sampleArray.sort(stringCompare(null, true));
      expect(sampleArray).toEqual([
        'USA',
        'Swden',
        'Sri Lanka',
        'India',
        'Germany',
        'China',
        'Canada',
        'Australia',
      ]);
    });

    test('should return correct sorted data for array of strings with all small letters', () => {
      const sampleArray = ['canada', 'usa', 'india', 'china', 'australia', 'swden', 'sri Lanka', 'germany'];

      sampleArray.sort(stringCompare());
      expect(sampleArray).toEqual([
        'australia',
        'canada',
        'china',
        'germany',
        'india',
        'sri Lanka',
        'swden',
        'usa']);
    });

    test('should return correct sorted data for array of strings with all small letters in descending order', () => {
      const sampleArray = ['canada', 'usa', 'india', 'china', 'australia', 'swden', 'sri Lanka', 'germany'];

      sampleArray.sort(stringCompare(null, true));
      expect(sampleArray).toEqual([
        'usa',
        'swden',
        'sri Lanka',
        'india',
        'germany',
        'china',
        'canada',
        'australia',
      ]);
    });

    test('should return correct sorted data for array of strings with combination of small and capitalized letters', () => {
      const sampleArray = ['Canada', 'USSR', 'USA', 'India', 'china', 'australia', 'Austria', 'Sweden', 'sri Lanka', 'germany', 'Greenland'];

      sampleArray.sort(stringCompare());
      expect(sampleArray).toEqual([
        'australia',
        'Austria',
        'Canada',
        'china',
        'germany',
        'Greenland',
        'India',
        'sri Lanka',
        'Sweden',
        'USA',
        'USSR']);
    });

    test('should return correct sorted data for array of strings with combination of small and capitalized letters in descending order', () => {
      const sampleArray = ['Canada', 'USSR', 'USA', 'India', 'china', 'australia', 'Austria', 'Sweden', 'sri Lanka', 'germany', 'Greenland'];

      sampleArray.sort(stringCompare(null, true));
      expect(sampleArray).toEqual([
        'USSR',
        'USA',
        'Sweden',
        'sri Lanka',
        'India',
        'Greenland',
        'germany',
        'china',
        'Canada',
        'Austria',
        'australia',
      ]
      );
    });

    test('should return correct sorted data for array of just numbers', () => {
      const sampleArray = [3, 67, 78, 34, 21, 456, 678, 432, 999, 342, 123, 456, 876, 2, 321, 987, 1232];

      sampleArray.sort(stringCompare());
      expect(sampleArray).toEqual([2, 3, 21, 34, 67, 78, 123, 321, 342, 432, 456, 456, 678, 876, 987, 999, 1232]);
    });

    test('should return correct sorted data for just numbers stored as strings in descending order', () => {
      const sampleArray = ['3', '67', '78', '34', '21', '456', '678', '432', '999', '342', '123', '456', '876', '2', '321', '987', '1232'];

      sampleArray.sort(stringCompare(null, true));
      expect(sampleArray).toEqual(['1232', '999', '987', '876', '678', '456', '456', '432', '342', '321', '123', '78', '67', '34', '21', '3', '2']);
    });

    test('should return correct sorted data for array of just numbers in descending order', () => {
      const sampleArray = [3, 67, 78, 34, 21, 456, 678, 432, 999, 342, 123, 456, 876, 2, 321, 987, 1232];

      sampleArray.sort(stringCompare(null, true));
      expect(sampleArray).toEqual([1232, 999, 987, 876, 678, 456, 456, 432, 342, 321, 123, 78, 67, 34, 21, 3, 2]);
    });

    test('should return correct sorted data for just numbers stored as strings ', () => {
      const sampleArray = ['3', '67', '78', '34', '21', '456', '678', '432', '999', '342', '123', '456', '876', '2', '321', '987', '1232'];

      sampleArray.sort(stringCompare());
      expect(sampleArray).toEqual(['2', '3', '21', '34', '67', '78', '123', '321', '342', '432', '456', '456', '678', '876', '987', '999', '1232']);
    });

    test('should return correct sorted data for array of strings with combination of small and capitalized letters and numbers', () => {
      const sampleArray = [123, '1233', '123Canada', 'Canada', 'USSR', 'USA', '456India', 'indonesia', 'India', 'china', 'australia', 'Austria', 'Sweden', 'sri Lanka', 'germany', 'Greenland'];

      sampleArray.sort(stringCompare());
      expect(sampleArray).toEqual([
        123,
        '1233',
        '123Canada',
        '456India',
        'australia',
        'Austria',
        'Canada',
        'china',
        'germany',
        'Greenland',
        'India',
        'indonesia',
        'sri Lanka',
        'Sweden',
        'USA',
        'USSR',
      ]
      );
    });

    test('should return correct sorted data for array of strings with combination of small and capitalized letters and numbers', () => {
      const sampleArray = [123, 3, 335, 333345, '123Canada', 'Canada', 'USSR', 456, 4567, '456New zealand', '876Bangladesh', '1233', 'USA', '456India', 'indonesia', 'India', 'china', 'australia', 'Austria', 'Sweden', 'sri Lanka', 'germany', 'Greenland'];

      sampleArray.sort(stringCompare());
      expect(sampleArray).toEqual([
        3,
        123,
        335,
        456,
        '1233',
        4567,
        333345,
        '123Canada',
        '456India',
        '456New zealand',
        '876Bangladesh',
        'australia',
        'Austria',
        'Canada',
        'china',
        'germany',
        'Greenland',
        'India',
        'indonesia',
        'sri Lanka',
        'Sweden',
        'USA',
        'USSR',
      ]
      );
    });

    test('should return correct sorted data for array of strings with combination of small and capitalized letters and numbers in descending order', () => {
      const sampleArray = [123, 3, 335, 333345, '123Canada', 'Canada', 'USSR', 456, 4567, '456New zealand', '876Bangladesh', '1233', 'USA', '456India', 'indonesia', 'India', 'china', 'australia', 'Austria', 'Sweden', 'sri Lanka', 'germany', 'Greenland'];

      sampleArray.sort(stringCompare(null, true));
      expect(sampleArray).toEqual([
        'USSR',
        'USA',
        'Sweden',
        'sri Lanka',
        'indonesia',
        'India',
        'Greenland',
        'germany',
        'china',
        'Canada',
        'Austria',
        'australia',
        '876Bangladesh',
        '456New zealand',
        '456India',
        '123Canada',
        333345,
        4567,
        '1233',
        456,
        335,
        123,
        3,

      ]
      );
    });
    test('should return correct sorted data for array of strings with leading/trailing spaces in descending order', () => {
      const sampleArray = [' 123Canada', 'Canada ', 'USSR', 456, 4567, '456New zealand', '876Bangladesh', '1233', 'USA', '456India', 'indonesia', 'India', 'china', 'australia', 'Austria', 'Sweden', 'sri Lanka', 'germany', 'Greenland'];

      sampleArray.sort(stringCompare(null, true));
      expect(sampleArray).toEqual([
        'USSR',
        'USA',
        'Sweden',
        'sri Lanka',
        'indonesia',
        'India',
        'Greenland',
        'germany',
        'china',
        'Canada ',
        'Austria',
        'australia',
        '876Bangladesh',
        '456New zealand',
        '456India',
        ' 123Canada',
        4567,
        '1233',
        456,
      ]
      );
    });

    test('should return correct sorted data for array of objects with all Capitals', () => {
      const sampleArray = [{id: 'Canada'}, {id: 'USA'}, {id: 'India'}, {id: 'China'}, {id: 'Australia'}, {id: 'Swden'}, {id: 'Sri Lanka'}, {id: 'Germany'}];

      sampleArray.sort(stringCompare('id'));
      expect(sampleArray).toEqual([
        {id: 'Australia'},
        {id: 'Canada'},
        {id: 'China'},
        {id: 'Germany'},
        {id: 'India'},
        {id: 'Sri Lanka'},
        {id: 'Swden'},
        {id: 'USA'},
      ]);
    });

    test('should return correct sorted data for array of objects with all Capitals in descending order', () => {
      const sampleArray = [{id: 'Canada'}, {id: 'USA'}, {id: 'India'}, {id: 'China'}, {id: 'Australia'}, {id: 'Swden'}, {id: 'Sri Lanka'}, {id: 'Germany'}];

      sampleArray.sort(stringCompare('id', true));
      expect(sampleArray).toEqual([
        {id: 'USA'},
        {id: 'Swden'},
        {id: 'Sri Lanka'},
        {id: 'India'},
        {id: 'Germany'},
        {id: 'China'},
        {id: 'Canada'},
        {id: 'Australia'},
      ]);
    });

    test('should return correct sorted data for array of objects with all small letters', () => {
      const sampleArray = [{id: 'canada'}, {id: 'usa'}, {id: 'india'}, {id: 'china'}, {id: 'australia'}, {id: 'sweden'}, {id: 'sri Lanka'}, {id: 'germany'}];

      sampleArray.sort(stringCompare('id'));
      expect(sampleArray).toEqual([
        {id: 'australia'},
        {id: 'canada'},
        {id: 'china'},
        {id: 'germany'},
        {id: 'india'},
        {id: 'sri Lanka'},
        {id: 'sweden'},
        {id: 'usa'},
      ]);
    });

    test('should return correct sorted data for array of objects with all small letters in descending order', () => {
      const sampleArray = [{id: 'canada'}, {id: 'usa'}, {id: 'india'}, {id: 'china'}, {id: 'australia'}, {id: 'sweden'}, {id: 'sri Lanka'}, {id: 'germany'}];

      sampleArray.sort(stringCompare('id', true));
      expect(sampleArray).toEqual([
        {id: 'usa'},
        {id: 'sweden'},
        {id: 'sri Lanka'},
        {id: 'india'},
        {id: 'germany'},
        {id: 'china'},
        {id: 'canada'},
        {id: 'australia'},
      ]);
    });

    test('should return correct sorted data for array of objects with combination of small and capital letters', () => {
      const sampleArray = [
        {id: 'Canada'},
        {id: 'USSR'},
        {id: 'USA'},
        {id: 'India'},
        {id: 'china'},
        {id: 'australia'},
        {id: 'Austria'},
        {id: 'Sweden'},
        {id: 'sri Lanka'},
        {id: 'germany'},
        {id: 'Greenland'},
      ];

      sampleArray.sort(stringCompare('id'));
      expect(sampleArray).toEqual([
        {id: 'australia'},
        {id: 'Austria'},
        {id: 'Canada'},
        {id: 'china'},
        {id: 'germany'},
        {id: 'Greenland'},
        {id: 'India'},
        {id: 'sri Lanka'},
        {id: 'Sweden'},
        {id: 'USA'},
        {id: 'USSR'},
      ]);
    });

    test('should return correct sorted data for array of objects with combination of small and capital letters in descending order', () => {
      const sampleArray = [
        {id: 'Canada'},
        {id: 'USSR'},
        {id: 'USA'},
        {id: 'India'},
        {id: 'china'},
        {id: 'australia'},
        {id: 'Austria'},
        {id: 'Sweden'},
        {id: 'sri Lanka'},
        {id: 'germany'},
        {id: 'Greenland'},
      ];

      sampleArray.sort(stringCompare('id', true));
      expect(sampleArray).toEqual([
        {id: 'USSR'},
        {id: 'USA'},
        {id: 'Sweden'},
        {id: 'sri Lanka'},
        {id: 'India'},
        {id: 'Greenland'},
        {id: 'germany'},
        {id: 'china'},
        {id: 'Canada'},
        {id: 'Austria'},
        {id: 'australia'},
      ]);
    });

    test('should return correct sorted data for array of objects with numbers', () => {
      const sampleArray = [
        {id: 3},
        {id: 67},
        {id: 78},
        {id: 34},
        {id: 21},
        {id: 456},
        {id: 678},
        {id: 432},
        {id: 999},
        {id: 342},
      ];

      sampleArray.sort(stringCompare('id'));
      expect(sampleArray).toEqual([
        {id: 3},
        {id: 21},
        {id: 34},
        {id: 67},
        {id: 78},
        {id: 342},
        {id: 432},
        {id: 456},
        {id: 678},
        {id: 999},
      ]);
    });

    test('should return correct sorted data for array of objects with numbers in descending order', () => {
      const sampleArray = [
        {id: 3},
        {id: 67},
        {id: 78},
        {id: 34},
        {id: 21},
        {id: 456},
        {id: 678},
        {id: 432},
        {id: 999},
        {id: 342},
      ];

      sampleArray.sort(stringCompare('id', true));
      expect(sampleArray).toEqual([
        {id: 999},
        {id: 678},
        {id: 456},
        {id: 432},
        {id: 342},
        {id: 78},
        {id: 67},
        {id: 34},
        {id: 21},
        {id: 3},
      ]);
    });

    test('should return correct sorted data for array of objects with numbers as strings', () => {
      const sampleArray = [
        {id: '3'},
        {id: '67'},
        {id: '78'},
        {id: '34'},
        {id: '21'},
        {id: '456'},
        {id: '678'},
        {id: '432'},
        {id: '999'},
        {id: '342'},
      ];

      sampleArray.sort(stringCompare('id'));
      expect(sampleArray).toEqual([
        {id: '3'},
        {id: '21'},
        {id: '34'},
        {id: '67'},
        {id: '78'},
        {id: '342'},
        {id: '432'},
        {id: '456'},
        {id: '678'},
        {id: '999'},
      ]);
    });

    test('should return correct sorted data for array of objects with numbers as strings in descending order', () => {
      const sampleArray = [
        {id: '3'},
        {id: '67'},
        {id: '78'},
        {id: '34'},
        {id: '21'},
        {id: '456'},
        {id: '678'},
        {id: '432'},
        {id: '999'},
        {id: '342'},
      ];

      sampleArray.sort(stringCompare('id', true));
      expect(sampleArray).toEqual([
        {id: '999'},
        {id: '678'},
        {id: '456'},
        {id: '432'},
        {id: '342'},
        {id: '78'},
        {id: '67'},
        {id: '34'},
        {id: '21'},
        {id: '3'},
      ]);
    });

    test('should return correct sorted data for array of strings with combination of small and capitalized letters and numbers', () => {
      const sampleArray = [
        {id: 123},
        {id: 3},
        {id: 335},
        {id: 333345},
        {id: '123Canada'},
        {id: 'Canada'},
        {id: 'USSR'},
        {id: 456},
        {id: 4567},
        {id: '456New zealand'},
        {id: '876Bangladesh'},
        {id: '1233'},
        {id: 'USA'},
        {id: '456India'},
        {id: 'indonesia'},
        {id: 'India'},
        {id: 'china'},
        {id: 'australia'},
        {id: 'Austria'},
        {id: 'Sweden'},
        {id: 'sri Lanka'},
        {id: 'germany'},
        {id: 'Greenland'}];

      sampleArray.sort(stringCompare('id'));
      expect(sampleArray).toEqual([
        {id: 3},
        {id: 123},
        {id: 335},
        {id: 456},
        {id: '1233'},
        {id: 4567},
        {id: 333345},
        {id: '123Canada'},
        {id: '456India'},
        {id: '456New zealand'},
        {id: '876Bangladesh'},
        {id: 'australia'},
        {id: 'Austria'},
        {id: 'Canada'},
        {id: 'china'},
        {id: 'germany'},
        {id: 'Greenland'},
        {id: 'India'},
        {id: 'indonesia'},
        {id: 'sri Lanka'},
        {id: 'Sweden'},
        {id: 'USA'},
        {id: 'USSR'},
      ]
      );
    });

    test('should return correct sorted data for array of strings with combination of small and capitalized letters and numbers in descending order', () => {
      const sampleArray = [
        {id: 123},
        {id: 3},
        {id: 335},
        {id: 333345},
        {id: '123Canada'},
        {id: 'Canada'},
        {id: 'USSR'},
        {id: 456},
        {id: 4567},
        {id: '456New zealand'},
        {id: '876Bangladesh'},
        {id: '1233'},
        {id: 'USA'},
        {id: '456India'},
        {id: 'indonesia'},
        {id: 'India'},
        {id: 'china'},
        {id: 'australia'},
        {id: 'Austria'},
        {id: 'Sweden'},
        {id: 'sri Lanka'},
        {id: 'germany'},
        {id: 'Greenland'}];

      sampleArray.sort(stringCompare('id', true));
      expect(sampleArray).toEqual([
        {id: 'USSR'},
        {id: 'USA'},
        {id: 'Sweden'},
        {id: 'sri Lanka'},
        {id: 'indonesia'},
        {id: 'India'},
        {id: 'Greenland'},
        {id: 'germany'},
        {id: 'china'},
        {id: 'Canada'},
        {id: 'Austria'},
        {id: 'australia'},
        {id: '876Bangladesh'},
        {id: '456New zealand'},
        {id: '456India'},
        {id: '123Canada'},
        {id: 333345},
        {id: 4567},
        {id: '1233'},
        {id: 456},
        {id: 335},
        {id: 123},
        {id: 3}]
      );
    });
  });
  describe('celigoListCompare function test', () => {
    test('should return correct sorted data for array of objects with all Capitals', () => {
      const sampleArray = [{id: 'Canada'}, {id: 'USA'}, {id: 'India'}, {id: 'China'}, {id: 'Australia'}, {id: 'Swden'}, {id: 'Sri Lanka'}, {id: 'Germany'}];

      sampleArray.sort(celigoListCompare);
      expect(sampleArray).toEqual([
        {id: 'Australia'},
        {id: 'Canada'},
        {id: 'China'},
        {id: 'Germany'},
        {id: 'India'},
        {id: 'Sri Lanka'},
        {id: 'Swden'},
        {id: 'USA'},
      ]);
    });

    test('should return correct sorted data for array of objects with all small letters', () => {
      const sampleArray = [{id: 'canada'}, {id: 'usa'}, {id: 'india'}, {id: 'china'}, {id: 'australia'}, {id: 'sweden'}, {id: 'sri Lanka'}, {id: 'germany'}];

      sampleArray.sort(celigoListCompare);
      expect(sampleArray).toEqual([
        {id: 'australia'},
        {id: 'canada'},
        {id: 'china'},
        {id: 'germany'},
        {id: 'india'},
        {id: 'sri Lanka'},
        {id: 'sweden'},
        {id: 'usa'},
      ]);
    });

    test('should return correct sorted data for array of objects with combination of small and capital letters', () => {
      const sampleArray = [
        {id: 'Canada'},
        {id: 'USSR'},
        {id: 'USA'},
        {id: 'India'},
        {id: 'china'},
        {id: 'australia'},
        {id: 'Austria'},
        {id: 'Sweden'},
        {id: 'sri Lanka'},
        {id: 'germany'},
        {id: 'Greenland'},
      ];

      sampleArray.sort(celigoListCompare);
      expect(sampleArray).toEqual([
        {id: 'australia'},
        {id: 'Austria'},
        {id: 'Canada'},
        {id: 'china'},
        {id: 'germany'},
        {id: 'Greenland'},
        {id: 'India'},
        {id: 'sri Lanka'},
        {id: 'Sweden'},
        {id: 'USA'},
        {id: 'USSR'},
      ]);
    });

    test('should return correct sorted data for array of objects with numbers', () => {
      const sampleArray = [
        {id: 3},
        {id: 67},
        {id: 78},
        {id: 34},
        {id: 21},
        {id: 456},
        {id: 678},
        {id: 432},
        {id: 999},
        {id: 342},
      ];

      sampleArray.sort(celigoListCompare);
      expect(sampleArray).toEqual([
        {id: 3},
        {id: 21},
        {id: 34},
        {id: 67},
        {id: 78},
        {id: 342},
        {id: 432},
        {id: 456},
        {id: 678},
        {id: 999},
      ]);
    });

    test('should return correct sorted data for array of objects with numbers as strings', () => {
      const sampleArray = [
        {id: '3'},
        {id: '67'},
        {id: '78'},
        {id: '34'},
        {id: '21'},
        {id: '456'},
        {id: '678'},
        {id: '432'},
        {id: '999'},
        {id: '342'},
      ];

      sampleArray.sort(celigoListCompare);
      expect(sampleArray).toEqual([
        { id: '3' },
        { id: '21' },
        { id: '34' },
        { id: '67' },
        { id: '78' },
        { id: '342' },
        { id: '432' },
        { id: '456' },
        { id: '678' },
        { id: '999' },
      ]);
    });
    test('should return correct sorted data for array of strings with combination of small and capitalized letters and numbers', () => {
      const sampleArray = [
        {id: 123},
        {id: 3},
        {id: 335},
        {id: 333345},
        {id: '123Canada'},
        {id: 'Canada'},
        {id: 'USSR'},
        {id: 456},
        {id: 4567},
        {id: '456New zealand'},
        {id: '876Bangladesh'},
        {id: '1233'},
        {id: 'USA'},
        {id: '456India'},
        {id: 'indonesia'},
        {id: 'India'},
        {id: 'china'},
        {id: 'australia'},
        {id: 'Austria'},
        {id: 'Sweden'},
        {id: 'sri Lanka'},
        {id: 'germany'},
        {id: 'Greenland'}];

      sampleArray.sort(celigoListCompare);
      expect(sampleArray).toEqual([
        {id: 3},
        {id: 123},
        {id: 335},
        {id: 456},
        {id: '1233'},
        {id: 4567},
        {id: 333345},
        {id: '123Canada'},
        {id: '456India'},
        {id: '456New zealand'},
        {id: '876Bangladesh'},
        {id: 'australia'},
        {id: 'Austria'},
        {id: 'Canada'},
        {id: 'china'},
        {id: 'germany'},
        {id: 'Greenland'},
        {id: 'India'},
        {id: 'indonesia'},
        {id: 'sri Lanka'},
        {id: 'Sweden'},
        {id: 'USA'},
        {id: 'USSR'},
      ]
      );
    });

    test('should return correct sorted data for array of strings with combination of small and capitalized letters and numbers and sublist expressions', () => {
      const sampleArray = [
        {id: 123},
        {id: 3},
        {id: 'test[*].sublist'},
        {id: 335},
        {id: 333345},
        {id: '123Canada'},
        {id: 'Canada'},
        {id: 'USSR'},
        {id: '123[*].sublist'},
        {id: 456},
        {id: 4567},
        {id: '456New zealand'},
        {id: '876Bangladesh'},
        {id: '1233'},
        {id: 'USA'},
        {id: '456India'},
        {id: 'indonesia'},
        {id: 'India'},
        {id: 'again[*].sublist'},
        {id: 'china'},
        {id: 'australia'},
        {id: 'Austria'},
        {id: 'Sweden'},
        {id: 'last[*].sublist'},
        {id: 'sri Lanka'},
        {id: 'germany'},
        {id: 'Greenland'}];

      sampleArray.sort(celigoListCompare);
      expect(sampleArray).toEqual([
        { id: 3 },
        { id: 123 },
        { id: 335 },
        { id: 456 },
        { id: '1233' },
        { id: 4567 },
        { id: 333345 },
        { id: '123Canada' },
        { id: '456India' },
        { id: '456New zealand' },
        { id: '876Bangladesh' },
        { id: 'australia' },
        { id: 'Austria' },
        { id: 'Canada' },
        { id: 'china' },
        { id: 'germany' },
        { id: 'Greenland' },
        { id: 'India' },
        { id: 'indonesia' },
        { id: 'sri Lanka' },
        { id: 'Sweden' },
        { id: 'USA' },
        { id: 'USSR' },
        { id: '123[*].sublist' },
        { id: 'again[*].sublist' },
        { id: 'last[*].sublist' },
        { id: 'test[*].sublist' },
      ]
      );
    });
  });
});
