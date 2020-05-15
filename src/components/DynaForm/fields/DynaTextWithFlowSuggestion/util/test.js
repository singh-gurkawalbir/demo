/* global describe, test, expect */
import getValueAfterInsert from '.';

describe('getValueAfterInsert util method for TextWithFlowSuggestion', () => {
  test('insert value just after "{{", without "}}" or "{{" following it', () => {
    const value = 'Hello{{';
    const insertPosition = 7;
    const insertedVal = 'John';
    const expectedResult = 'Hello{{John}}';

    expect(getValueAfterInsert(value, insertPosition, insertedVal)).toEqual(
      expectedResult
    );
  });

  test('insert value after "{{xxx", without "}}" or "{{" following it ', () => {
    const value = 'Hello{{John';
    const insertPosition = 9;
    const insertedVal = 'Jonny';
    const expectedResult = 'Hello{{Jonny}}';

    expect(getValueAfterInsert(value, insertPosition, insertedVal)).toEqual(
      expectedResult
    );
  });

  test('insert value after "{{xxx", with "xxx}}" following it', () => {
    const value = 'Hello{{John}}';
    const insertPosition = 8;
    const insertedVal = 'Johny';
    const expectedResult = 'Hello{{Johny}}';

    expect(getValueAfterInsert(value, insertPosition, insertedVal)).toEqual(
      expectedResult
    );
  });
  test('insert value after "{{Test}}{{xxx", without post "}}" or "{{"', () => {
    const value = '{{Hello}}{{John';
    const insertPosition = `14`;
    const insertedVal = 'Johnson';
    const expectedResult = '{{Hello}}{{Johnson}}';

    expect(getValueAfterInsert(value, insertPosition, insertedVal)).toEqual(
      expectedResult
    );
  });
  test('insert value after "{{Test}}{{xxx", with  "xxx}}" following it', () => {
    const value = '{{Hello}}{{John}}';
    const insertPosition = `14`;
    const insertedVal = 'Johnson';
    const expectedResult = '{{Hello}}{{Johnson}}';

    expect(getValueAfterInsert(value, insertPosition, insertedVal)).toEqual(
      expectedResult
    );
  });

  test('insert value after "{{Test}}{{xxx", with  "{{" following it', () => {
    const value = '{{Hello}}{{John{{abcd}}';
    const insertPosition = `14`;
    const insertedVal = 'Johnson';
    const expectedResult = '{{Hello}}{{Johnson}}{{abcd}}';

    expect(getValueAfterInsert(value, insertPosition, insertedVal)).toEqual(
      expectedResult
    );
  });
  test('insert value after "{{Test}}{{xxx", with  "{" following it', () => {
    const value = '{{Hello}}{{John{';
    const insertPosition = `14`;
    const insertedVal = 'Johnson';
    const expectedResult = '{{Hello}}{{Johnson}}';

    expect(getValueAfterInsert(value, insertPosition, insertedVal)).toEqual(
      expectedResult
    );
  });
});
