/* global describe, test, expect */
const { stringCompare } = require('./sort');

describe('Sort util function test', () => {
  test('should return correct sorted data for array of strings with all Capitals', () => {
    const sampleArray = ['Canada', 'USA', 'India', 'China', 'Australia', 'Swden', 'Sri Lanka', 'Germany'];
    sampleArray.sort(stringCompare())
    expect(sampleArray).toEqual(['Australia',
      'Canada',
      'China',
      'Germany',
      'India',
      'Sri Lanka',
      'Swden',
      'USA']);
  });

  test('should return correct sorted data for array of strings with all small letters', () => {
    const sampleArray = ['canada', 'usa', 'india', 'china', 'australia', 'swden', 'sri Lanka', 'germany'];
    sampleArray.sort(stringCompare())
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

  test('should return correct sorted data for array of strings with combination of small and capitalized letters', () => {
    const sampleArray = ['Canada', 'USSR', 'USA', 'India', 'china', 'australia', 'Austria', 'Sweden', 'sri Lanka', 'germany', 'Greenland'];
    sampleArray.sort(stringCompare())
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

  test('should return correct sorted data for array of just numbers', () => {
    const sampleArray = [3, 67, 78, 34, 21, 456, 678, 432, 999, 342, 123, 456, 876, 2, 321, 987, 1232];
    sampleArray.sort(stringCompare())
    expect(sampleArray).toEqual([2, 3, 21, 34, 67, 78, 123, 321, 342, 432, 456, 456, 678, 876, 987, 999, 1232]);
  });

  test('should return correct sorted data for just numbers stored as strings', () => {
    const sampleArray = ['3', '67', '78', '34', '21', '456', '678', '432', '999', '342', '123', '456', '876', '2', '321', '987', '1232'];
    sampleArray.sort(stringCompare())
    expect(sampleArray).toEqual(['2', '3', '21', '34', '67', '78', '123', '321', '342', '432', '456', '456', '678', '876', '987', '999', '1232']);
  });

  test('should return correct sorted data for array of strings with combination of small and capitalized letters and numbers', () => {
    const sampleArray = [123, '1233', '123Canada', 'Canada', 'USSR', 'USA', '456India', 'indonesia', 'India', 'china', 'australia', 'Austria', 'Sweden', 'sri Lanka', 'germany', 'Greenland'];
    sampleArray.sort(stringCompare())
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
    sampleArray.sort(stringCompare())
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

  test('should return correct sorted data for array of objects with all Capitals', () => {
    const sampleArray = [{id: 'Canada'}, {id: 'USA'}, {id: 'India'}, {id: 'China'}, {id: 'Australia'}, {id: 'Swden'}, {id: 'Sri Lanka'}, {id: 'Germany'}];
    sampleArray.sort(stringCompare('id'))
    expect(sampleArray).toEqual([
      {id: 'Australia'},
      {id: 'Canada'},
      {id: 'China'},
      {id: 'Germany'},
      {id: 'India'},
      {id: 'Sri Lanka'},
      {id: 'Swden'},
      {id: 'USA'}
    ]);
  });

  test('should return correct sorted data for array of objects with all small letters', () => {
    const sampleArray = [{id: 'canada'}, {id: 'usa'}, {id: 'india'}, {id: 'china'}, {id: 'australia'}, {id: 'sweden'}, {id: 'sri Lanka'}, {id: 'germany'}];
    sampleArray.sort(stringCompare('id'))
    expect(sampleArray).toEqual([
      {id: 'australia'},
      {id: 'canada'},
      {id: 'china'},
      {id: 'germany'},
      {id: 'india'},
      {id: 'sri Lanka'},
      {id: 'sweden'},
      {id: 'usa'}
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
      {id: 'Greenland'}
    ];
    sampleArray.sort(stringCompare('id'))
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
      {id: 'USSR'}
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
      {id: 342}
    ];
    sampleArray.sort(stringCompare('id'))
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
      {id: '342'}
    ];
    sampleArray.sort(stringCompare('id'))
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
    sampleArray.sort(stringCompare('id'))
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
});
