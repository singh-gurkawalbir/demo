import installerSagas from './installer';
import uninstallerSagas from './uninstaller';

export default [...installerSagas, ...uninstallerSagas];
