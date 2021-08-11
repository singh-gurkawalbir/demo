import IntegrationSettingsSaveButton from './IntegrationSettingsSaveButton';
import SaveAndCloseButtonGroup from './Groups/SaveAndClose';
import NextAndCancel from './Groups/NextAndCancel';
import OAuthAndCancel from './Groups/OAuthAndCancel';
import OAuthAndTest from './Groups/OAuthAndTest';
import TestAndSave from './Groups/TestAndSave';
import SaveFileDefinitions from './Groups/SaveFileDefinitions';
import ValidateAndSave from './Groups/ValidateAndSave';
import SaveAndContinueGroup from './Groups/SaveAndContinueGroup';
import IntegrationSettings from './Groups/IntegrationSettingsGroup';

export default {
  // action groups
  integrationsettings: IntegrationSettings,
  validateandsave: ValidateAndSave,
  testandsavegroup: TestAndSave,
  nextandcancel: NextAndCancel,
  saveandclosegroup: SaveAndCloseButtonGroup,
  saveandcontinuegroup: SaveAndContinueGroup,
  oauthandcancel: OAuthAndCancel,
  oauthandtest: OAuthAndTest,
  savefiledefinitions: SaveFileDefinitions,

  // Single action
  saveintegrationsettings: IntegrationSettingsSaveButton,
};
