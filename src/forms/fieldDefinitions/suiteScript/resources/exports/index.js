import netsuite from './netsuite';
import newegg from './newegg';
import rakuten from './rakuten';
import sears from './sears';
import file from './file';
import fileCabinet from './fileCabinet';
import salesforce from './salesforce';

const allFieldDefinitions = {
  ...netsuite,
  ...newegg,
  ...rakuten,
  ...sears,
  ...file,
  ...fileCabinet,
  ...salesforce,
  exportData: {
    fieldId: 'exportData',
    type: 'labeltitle',
    label: 'What would you like to export?',
  },
  advanced: {
    fieldId: 'advanced',
    type: 'labeltitle',
    label: 'Advanced',
  },
};

export default allFieldDefinitions;
