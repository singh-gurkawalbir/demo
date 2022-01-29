export default [
  {
    id: '1',
    type: 'input', // input node
    sourcePosition: 'right',
    data: { label: 'Input Node' },
    // position: { x: 100, y: 150 },
  },
  // default node
  {
    id: '2',
    type: 'step',
    // you can also pass a React component as a label
    data: { label: 'Custom step node' },
    // position: { x: 400, y: 125 },
  },
  {
    id: '3',
    type: 'output', // output node
    targetPosition: 'left',
    data: { label: 'Output Node' },
    // position: { x: 700, y: 150 },
  },

  { id: 'e1-2', source: '1', target: '2', type: 'step' }, // , animated: true
  { id: 'e2-3', source: '2', target: '3', type: 'linked' },
];
