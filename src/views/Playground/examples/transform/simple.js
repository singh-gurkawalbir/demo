const sampleData = {
  id: 123,
  name: 'Bob',
  age: 33,
};

export default {
  key: 'transform1',
  type: 'transform',
  name: 'Simple JSON record',
  description: 'Simple JSON record',
  data: sampleData,
  rule: [{
    extract: 'id',
    generate: 'id',
  }],
};

