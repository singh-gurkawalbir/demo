import common from './common';
import file from './file';
import ftpFile from './ftpFile';
import advancedSettings from './advancedSettings';
import fileAdvancedSettings from './fileAdvancedSettings';
import exportOneToMany from './exportOneToMany';
import netsuite from './netsuite';
import fileApiIdentifier from './fileApiIdentifier';

export default {
  common,
  file,
  ftpFile,
  advancedSettings,
  fileAdvancedSettings,
  exportOneToMany,
  fileApiIdentifier,
  ...netsuite,
};
