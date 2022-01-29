export default [
  {
    id: '1',
    type: 'input', // input node
    sourcePosition: 'right',
    data: { label: 'Input Node' },
  },
  // default node
  {
    id: '2',
    type: 'step',
    data: { label: 'Custom step node' },
  },
  {
    id: '2a',
    type: 'step',
    data: { label: 'Custom step node' },
  },
  {
    id: '2b',
    type: 'step',
    data: { label: 'Custom step node' },
  },
  {
    id: '3',
    type: 'output', // output node
    targetPosition: 'left',
    data: { label: 'Output Node' },
  },

  { id: 'e1-2', source: '1', target: '2', type: 'step' }, // , animated: true
  { id: 'e2-2a', source: '2', target: '2a', type: 'step' }, // , animated: true
  { id: 'e2-2b', source: '2', target: '2b', type: 'step' }, // , animated: true
  { id: 'e2b-3', source: '2b', target: '3', type: 'linked' },
];
