export default {
  key: 'xmpParse1',
  type: 'xmlParser',
  name: 'XML parser',
  data: `<Contact id="123">
  <Name gender="male">   Luke Skywalker</Name>
  <Age>12  </Age>
</Contact>
`,
  rule: {
    V0_json: false,
  },
};
