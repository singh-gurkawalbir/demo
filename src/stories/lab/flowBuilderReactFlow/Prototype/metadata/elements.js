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
    data: { label: 'Export NetSuite data', connectorType: 'netsuite' },
  },
  {
    id: '2',
    type: 'pp',
    data: { label: 'HTTP lookup', isLookup: true, connectorType: 'http' },
  },
  {
    id: '2a',
    type: 'pp',
    data: { label: 'FTP import', connectorType: 'ftp' },
  },
  {
    id: '2b',
    type: 'pp',
    data: { label: 'S3 import', connectorType: 's3' },
  },
  {
    id: '3',
    type: 'pp',
    data: { label: 'REST import', connectorType: 'rest' },
  },

  { id: 'e1-2', source: '1', target: '2', type: 'default' }, // , animated: true
  { id: 'e2-2a', source: '2', target: '2a', type: 'default' }, // , animated: true
  { id: 'e2-2b', source: '2', target: '2b', type: 'default' }, // , animated: true
  { id: 'e2b-3', source: '2b', target: '3', type: 'default' },
];
