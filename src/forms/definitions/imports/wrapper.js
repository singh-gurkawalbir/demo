import { isJsonString } from '../../../utils/string';

export default {
  preSave: formValues => {
    const retValues = { ...formValues };
    const sampleData = retValues['/sampleData'];

    if (sampleData === '') {
      retValues['/sampleData'] = undefined;
    } else {
      // Save sampleData in JSON format with a fail safe condition
      retValues['/sampleData'] = isJsonString(sampleData)
        ? JSON.parse(sampleData)
        : undefined;
    }

    return retValues;
  },
  fieldMap: {
    common: { formId: 'common' },
    'wrapper.function': { fieldId: 'wrapper.function' },
    'wrapper.configuration': { fieldId: 'wrapper.configuration' },
    'wrapper.lookups': { fieldId: 'wrapper.lookups', visible: false },
    sampleData: { fieldId: 'sampleData' },
    dataMappings: { formId: 'dataMappings' },
    advancedSettings: { formId: 'advancedSettings' },
  },
  layout: {
    fields: ['common', 'dataMappings'],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'How would you like the records imported?',
        fields: [
          'wrapper.function',
          'wrapper.configuration',
          'wrapper.lookups',
        ],
      },
      {
        collapsed: true,
        label: 'Do you have a sample destination record?',
        fields: ['sampleData'],
      },
      { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};
