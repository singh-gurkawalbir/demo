import netsuite from './netsuite';
import newegg from './newegg';
import rakuten from './rakuten';
import sears from './sears';
import file from './file';

const allFieldDefinitions = {
  ...netsuite,
  ...newegg,
  ...rakuten,
  ...sears,
  ...file,
};

export default allFieldDefinitions;
