import { hooksList, hooksLabelMap } from '../../../utils/hooks';

export default {
  name: {
    isLoggable: true,
    type: 'text',
    label: 'Name',
    required: true,
  },
  description: {
    isLoggable: true,
    type: 'text',
    multiline: true,
    maxRows: 5,
    label: 'Description',
  },
  newdescription: {
    isLoggable: true,
    type: 'text',
    multiline: true,
    maxRows: 5,
    label: 'Description',
  },
  insertFunction: {
    isLoggable: true,
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
    isLoggable: true,
    defaultValue: r => ({ _scriptId: r._id, function: 'main' }),
    type: 'scriptcontent',
    label: 'Edit content',
    helpKey: 'hooks.scriptContent',
  },
};
