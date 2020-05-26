export default {
  fieldMap: {
    name: { fieldId: 'name' },
    description: { fieldId: 'description' },
  },
  layout: {
    fields: ['name', 'description'],
  },
  // preSave: formValues => {
  //   const newValues = formValues;

  //   if (newValues['/settings']) {
  //     if (!isObject(newValues['/settings'])) {
  //       try {
  //         newValues['/settings'] = JSON.parse(newValues['/settings']);
  //       } catch (ex) {
  //         newValues['/settings'] = {};
  //       }
  //     }
  //   }

  //   return newValues;
  // },
};
