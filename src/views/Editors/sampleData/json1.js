const sampleData = {
  id: 123,
  name: 'Bob',
  age: 33,
};

export default {
  key: 'json1',
  mode: 'json',
  name: 'Simple JSON record',
  data: JSON.stringify(sampleData, null, 2),
};
