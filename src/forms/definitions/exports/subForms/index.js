import common from './common';
import ftpFile from './ftpFile';
import advancedSettings from './advancedSettings';
import fileAdvancedSettings from './fileAdvancedSettings';
import exportOneToMany from './exportOneToMany';
import netsuite from './netsuite';

export default {
  common,
  ftpFile,
  advancedSettings,
  fileAdvancedSettings,
  exportOneToMany,
  ...netsuite,
};
