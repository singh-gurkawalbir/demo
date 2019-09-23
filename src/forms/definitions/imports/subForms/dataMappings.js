export default {
  fieldMap: {
    dataMapping: {
      id: 'dataMapping',
      type: 'labeltitle',
      label: 'How should the data be mapped?',
    },
    oneToMany: { fieldId: 'oneToMany' },
    pathToMany: { fieldId: 'pathToMany' },
  },
  layout: { fields: ['dataMapping', 'oneToMany', 'pathToMany'] },
};
