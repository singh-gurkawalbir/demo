import netsuite from './netsuite';
import salesforce from './salesforce';

const allFieldDefinitions = {
  ...netsuite,
  ...salesforce,
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
