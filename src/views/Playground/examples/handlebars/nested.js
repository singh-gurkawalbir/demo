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
  key: 'handlebars2',
  type: 'handlebars',
  name: 'Nested JSON record',
  description: 'Nested JSON record',
  data: sampleData,
};
