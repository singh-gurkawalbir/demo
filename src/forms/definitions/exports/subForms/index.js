import common from './common';
import ftpFile from './ftpFile';
import advancedSettings from './advancedSettings';
import exportOneToMany from './exportOneToMany';
import netsuite from './netsuite';
import fileAdvanced from './fileAdvanced';

export default {
  common,
  ftpFile,
  advancedSettings,
  exportOneToMany,
  fileAdvanced,
  ...netsuite,
};
