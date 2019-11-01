import installerSagas from './installer';
import uninstallerSagas from './uninstaller';
import settingsSagas from './settings';

export default [...installerSagas, ...uninstallerSagas, ...settingsSagas];
