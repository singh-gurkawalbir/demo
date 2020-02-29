import { isObject } from 'lodash';

export default {
  fieldMap: {
    name: { fieldId: 'name' },
    description: { fieldId: 'description' },
    settings: { fieldId: 'settings' },
  },
  layout: {
    fields: ['name', 'description', 'settings'],
  },
  preSave: formValues => {
    const newValues = formValues;

    if (newValues['/settings']) {
      if (!isObject(newValues['/settings'])) {
        try {
          newValues['/settings'] = JSON.parse(newValues['/settings']);
        } catch (ex) {
          newValues['/settings'] = {};
        }
      }
    }

    return newValues;
  },
};
