const sampleData = {
  id: 123,
  name: 'Bob',
  age: 33,
};

const defaultData = {
  rank: 0,
};

export default {
  key: 'sql1',
  type: 'sql',
  name: 'Simple SQL query',
  description: 'Example of a simple SQL query template.',
  data: sampleData,
  initProps: {
    defaultData,
  },
};
