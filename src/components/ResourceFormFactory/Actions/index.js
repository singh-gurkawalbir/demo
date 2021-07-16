import IntegrationSettingsSaveButton from './IntegrationSettingsSaveButton';
import SaveAndCloseButtonGroup from './Groups/SaveAndClose';
import NextAndCancel from './Groups/NextAndCancel';
import OAuthAndCancel from './Groups/OAuthAndCancel';
import TestAndSave from './Groups/TestAndSave';
import SaveFileDefinitions from './Groups/SaveFileDefinitions';
import ValidateAndSave from './Groups/ValidateAndSave';
import SaveAndContinueGroup from './Groups/SaveAndContinueGroup';

export default {
  // action groups
  validateandsave: ValidateAndSave,
  testandsavegroup: TestAndSave,
  nextandcancel: NextAndCancel,
  saveandclosegroup: SaveAndCloseButtonGroup,
  saveandcontinuegroup: SaveAndContinueGroup,
  oauthandcancel: OAuthAndCancel,
  savefiledefinitions: SaveFileDefinitions,

  // Single action
  saveintegrationsettings: IntegrationSettingsSaveButton,
};
