const sampleData = {
  orderId: 123,
  total: 99.99,
  state: 'ca',
  items: [
    {
      description: 'Hat',
      qty: 3,
    },
    {
      description: 'Shoes',
      qty: 1,
    },
  ],
};

export default {
  key: 'json2',
  mode: 'json',
  name: 'Nested JSON record',
  data: JSON.stringify(sampleData, null, 2),
};
