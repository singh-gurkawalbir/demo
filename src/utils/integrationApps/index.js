import { INSTALL_STEP_TYPES } from '../constants';

export default {
  getStepText: (step = {}, mode) => {
    let stepText = '';
    const isUninstall = mode === 'uninstall';

    if (step._connectionId || step.type === INSTALL_STEP_TYPES.STACK) {
      if (step.completed) {
        stepText = 'Configured';
      } else if (step.isTriggered) {
        stepText = 'Configuring...';
      } else {
        stepText = 'Click to Configure';
      }
    } else if (step.installURL || step.uninstallURL) {
      if (step.completed) {
        stepText = isUninstall ? 'Uninstalled' : 'Installed';
      } else if (step.isTriggered) {
        if (step.verifying) {
          stepText = 'Verifying...';
        } else {
          stepText = 'Verify Now';
        }
      } else {
        stepText = isUninstall ? 'Click to Uninstall' : 'Click to Install';
      }
    } else if (step.completed) {
      stepText = isUninstall ? 'Done' : 'Configured';
    } else if (step.isTriggered) {
      stepText = isUninstall ? 'Uninstalling...' : 'Installing...';
    } else {
      stepText = isUninstall ? 'Click to Uninstall' : 'Click to Install';
    }

    return stepText;
  },
};
