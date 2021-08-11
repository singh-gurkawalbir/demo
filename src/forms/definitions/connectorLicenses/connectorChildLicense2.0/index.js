export default {
  preSave: formValues => {
    const newValues = formValues;

    try {
      newValues['/opts'] = JSON.parse(newValues['/opts']);
    } catch (e) {
      return newValues;
    }

    return newValues;
  },
  fieldMap: {
    opts: { fieldId: 'opts' },
  },
  layout: {
    type: 'box',
    containers: [
      {
        fields: ['opts'],
      },
    ],
  },
};
