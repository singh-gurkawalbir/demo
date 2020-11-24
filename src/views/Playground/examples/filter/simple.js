const sampleData = {
  id: 123,
  name: 'Bob',
  age: 33,
};

export default {
  key: 'filter1',
  type: 'filter',
  name: 'Simple JSON record',
  description: 'Simple JSON record',
  // data: JSON.stringify(sampleData, null, 2),
  data: sampleData,
};

