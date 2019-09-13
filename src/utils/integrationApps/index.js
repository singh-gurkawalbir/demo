export default {
  getStepText: step => {
    let stepText = '';

    if (step._connectionId) {
      if (step.completed) {
        stepText = 'Configured';
      } else if (step.__isTriggered) {
        stepText = 'Configuring...';
      } else {
        stepText = 'Click to Configure';
      }
    } else if (step.installURL) {
      if (step.completed) {
        stepText = 'Installed';
      } else if (step.__isTriggered) {
        if (step.__verifying) {
          stepText = 'Verifying...';
        } else {
          stepText = 'Verify Now';
        }
      } else {
        stepText = 'Click to Install';
      }
    } else if (step.completed) {
      stepText = 'Configured';
    } else if (step.__isTriggered) {
      stepText = 'Installing...';
    } else {
      stepText = 'Click to Install';
    }

    return stepText;
  },
};
