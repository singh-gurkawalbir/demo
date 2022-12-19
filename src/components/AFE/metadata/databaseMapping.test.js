/* global describe, test, expect */
import metadata from './databaseMapping';

describe('databaseMapping metadata test cases', () => {
  test('should pass the test case for each field if any', () => {
    const {type, fieldId, description, label} = metadata;

    expect(type).toEqual('sql');
    expect(fieldId).toEqual(undefined);
    expect(description).toEqual('Use a handlebar template to construct SQL queries');
    expect(label).toEqual('SQL query builder');
  });
});
