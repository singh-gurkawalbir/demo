import { hooksList, hooksLabelMap } from '../../../utils/hooks';

export default {
  name: {
    type: 'text',
    label: 'Name',
    required: true,
  },
  description: {
    type: 'text',
    multiline: true,
    maxRows: 5,
    label: 'Description',
  },
  insertFunction: {
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
    defaultValue: r => ({ _scriptId: r._id, function: 'main' }),
    type: 'scriptcontent',
    label: 'Edit content',
    helpKey: 'hooks.scriptContent',
  },
};
