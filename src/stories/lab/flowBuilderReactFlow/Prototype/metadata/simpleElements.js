export default [
  // {
  //   id: '1',
  //   type: 'input', // input node
  //   sourcePosition: 'right',
  //   data: { label: 'Input Node' },
  // },
  // default node
  {
    id: '1',
    type: 'pg', // input node
    sourcePosition: 'right',
    data: { label: 'Export NetSuite data', connectorType: 'netsuite' },
  },
  {
    id: '2',
    type: 'pp',
    data: { label: 'HTTP lookup', isLookup: true, connectorType: 'http' },
  },
  { id: 'e1-2', source: '1', target: '2', type: 'step' }, // , animated: true

];

