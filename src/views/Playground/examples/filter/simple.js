const sampleData = {
  record: {
    id: 123,
    name: 'Bob',
    age: 33,
  },
};

export default {
  key: 'filter1',
  type: 'filter',
  name: 'Simple JSON record',
  description: 'Simple JSON record',
  data: sampleData,
  rule: ['equals', ['string', ['extract', 'id']], ''],
};

