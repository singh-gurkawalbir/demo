export default [
  {
    id: '1',
    type: 'pg', // input node
    data: { label: 'Export NetSuite data', connectorType: 'netsuite' },
  },
  { id: '2', type: 'router'},
  {
    id: '3',
    type: 'pp',
    data: { label: 'HTTP lookup', isLookup: true, connectorType: 'http' },
  },
  {
    id: '4',
    type: 'pp',
    data: { label: 'FTP import', connectorType: 'ftp' },
  },
  { id: '4r', type: 'router'},
  {
    id: '4a',
    type: 'pp',
    data: { label: 'FTP import', connectorType: 'ftp' },
  },
  { id: '5', type: 'merge'},
  {
    id: '6',
    type: 'pp',
    data: { label: 'S3 import', connectorType: 's3' },
  },
  { id: '7', type: 'terminal'},
  // { id: '5', type: 'terminal'},

  { id: 'e1-2', source: '1', target: '2', type: 'step' }, // , animated: true
  { id: 'e2-3', source: '2', target: '3', type: 'step' }, // , animated: true
  { id: 'e2-4', source: '2', target: '4', type: 'step' }, // , animated: true
  { id: 'e4-4r', source: '4', target: '4r', type: 'step' }, // , animated: true
  { id: 'e4r-4a', source: '4r', target: '4a', type: 'step' }, // , animated: true
  { id: 'e4r-5', source: '4r', target: '5', type: 'step' }, // , animated: true
  { id: 'e3-5', source: '3', target: '5', type: 'step' }, // , animated: true
  { id: 'e4a-5', source: '4a', target: '5', type: 'step' },
  { id: 'e5-6', source: '5', target: '6', type: 'step' },
  { id: 'e6-7', source: '6', target: '7', type: 'step' },
];
