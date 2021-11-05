import { hooksList, hooksLabelMap } from '../../../utils/hooks';

export default {
  name: {
    canInstrument: true,
    type: 'text',
    label: 'Name',
    required: true,
  },
  description: {
    canInstrument: true,
    type: 'text',
    multiline: true,
    maxRows: 5,
    label: 'Description',
  },
  insertFunction: {
    canInstrument: true,
    type: 'select',
    label: 'Insert function stub',
    helpKey: 'hooks.insertFunction',
    options: [
      {
        items: hooksList.map(hook => ({
          label: hooksLabelMap[hook],
          value: hook,
        })),
      },
    ],
  },
  content: {
    canInstrument: false,
    defaultValue: r => ({ _scriptId: r._id, function: 'main' }),
    type: 'scriptcontent',
    label: 'Edit content',
    helpKey: 'hooks.scriptContent',
  },
};
