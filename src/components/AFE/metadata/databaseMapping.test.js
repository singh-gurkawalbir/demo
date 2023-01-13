
import metadata from './databaseMapping';

describe('databaseMapping metadata test cases', () => {
  test('should pass the test case for each field if any', () => {
    const {type, fieldId, description, label} = metadata;

    expect(type).toBe('sql');
    expect(fieldId).toBeUndefined();
    expect(description).toBe('Use a handlebar template to construct SQL queries');
    expect(label).toBe('SQL query builder');
  });
});
