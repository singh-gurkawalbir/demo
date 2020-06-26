import netsuite from './netsuite';
import salesforce from './salesforce';
import newegg from './newegg';
import sears from './sears';
import rakuten from './rakuten';
import ftp from './ftp';
import file from './file';

const allFieldDefinitions = {
  ...netsuite,
  ...salesforce,
  ...newegg,
  ...sears,
  ...rakuten,
  ...ftp,
  ...file,
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
