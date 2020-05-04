import netsuite from './netsuite';

const allFieldDefinitions = {
  ...netsuite,
  importData: {
    fieldId: 'importData',
    type: 'labeltitle',
    label: 'How would you like the data imported?',
  },
  advanced: {
    fieldId: 'advanced',
    type: 'labeltitle',
    label: 'Advanced',
  },
};

export default allFieldDefinitions;
