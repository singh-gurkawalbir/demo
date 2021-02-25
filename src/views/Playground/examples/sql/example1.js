const sampleData = {
  id: 123,
  name: 'Bob',
  age: 33,
};

export default {
  key: 'sql1',
  type: 'sql',
  name: 'Simple SQL query',
  description: 'Example of a simple SQL query template.',
  data: sampleData,
  rule: 'SELECT * from table1 where id={{id}}',
};
