import { hooksList, hooksLabelMap } from '../../../utils/hooks';

export default {
  name: {
    loggable: true,
    type: 'text',
    label: 'Name',
    required: true,
  },
  description: {
    loggable: true,
    type: 'text',
    multiline: true,
    maxRows: 5,
    label: 'Description',
  },
  newdescription: {
    loggable: true,
    type: 'text',
    multiline: true,
    maxRows: 5,
    label: 'Description',
  },
  insertFunction: {
    loggable: true,
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
    loggable: true,
    defaultValue: r => ({ _scriptId: r._id, function: 'main' }),
    type: 'scriptcontent',
    label: 'Edit content',
    helpKey: 'hooks.scriptContent',
  },
};
