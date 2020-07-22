import common from './common';
import ftpFile from './ftpFile';
import advancedSettings from './advancedSettings';
import exportOneToMany from './exportOneToMany';
import netsuite from './netsuite';

export default {
  common,
  ftpFile,
  advancedSettings,
  exportOneToMany,
  ...netsuite,
};
