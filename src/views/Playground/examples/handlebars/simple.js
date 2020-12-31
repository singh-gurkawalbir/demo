const sampleData = {
  id: 123,
  name: 'Bob',
  age: 33,
};

export default {
  key: 'handlebars1',
  type: 'handlebars',
  name: 'Simple JSON record',
  description: 'Simple JSON record',
  data: sampleData,
  rule:
`{
  "First Name": "{{name}}",
  "addResult": {{add id age}}
}`,
};

