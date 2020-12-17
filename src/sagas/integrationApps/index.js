import installerSagas from './installer';
import uninstallerSagas from './uninstaller';
import settingsSagas from './settings';
import uninstaller2Sagas from './uninstaller2.0';
import resumeSagas from './resume';

export default [...installerSagas, ...uninstallerSagas, ...settingsSagas, ...uninstaller2Sagas, ...resumeSagas];
