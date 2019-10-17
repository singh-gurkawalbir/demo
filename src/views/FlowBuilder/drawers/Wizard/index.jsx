import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
} from '@material-ui/core';
import { RightDrawer } from '../RightDrawer';
import ChooseAppsPanel from './ChooseAppsPanel';

const useStyles = makeStyles(theme => ({
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  title: {},
  formRoot: {
    paddingTop: theme.spacing(3, 0),
  },
}));

export default function WizardDrawer({ flowId, match, history, ...props }) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(-1);
  const [sourceApps, setSourceApps] = useState([]);
  const [destinationApps, setDestinationApps] = useState([]);
  const open = !flowId;

  function handleSubmit(formValues) {
    setSourceApps(formValues.sourceApps);
    setDestinationApps(formValues.destinationApps);
    setActiveStep(0);
    // console.log(formValues);
  }

  function getSteps() {
    return ['Connect sources', 'Connect destinations'];
  }

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return 'Connect sources content.';
      case 1:
        return 'Connect destinations content.';
      default:
        return 'Unknown stepIndex content.';
    }
  }

  const steps = getSteps();

  return (
    <RightDrawer {...props} open={open}>
      {activeStep === -1 && (
        <ChooseAppsPanel
          sourceApps={sourceApps}
          destinationApps={destinationApps}
          history={history}
          onSubmit={handleSubmit}
        />
      )}
      {activeStep >= 0 && (
        <div>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            orientation="vertical">
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div>
            {activeStep === steps.length ? (
              <div>
                <Typography className={classes.instructions}>
                  All steps completed
                </Typography>
                <Button onClick={() => setActiveStep(-1)}>Reset</Button>
              </div>
            ) : (
              <div>
                <Typography className={classes.instructions}>
                  {getStepContent(activeStep)}
                </Typography>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep(activeStep - 1)}>
                    Back
                  </Button>
                  <Button onClick={() => setActiveStep(activeStep + 1)}>
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </RightDrawer>
  );
}
