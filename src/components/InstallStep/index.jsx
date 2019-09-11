import { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
  step: {
    position: 'relative',
    height: '50px',
    padding: '25px 40px 25px 0',
    display: 'inline-flex',
  },
  stepNumber: props => ({
    // eslint-disable-next-line no-nested-ternary
    background: ((props || {}).step || {}).completed
      ? '#00A1E1'
      : ((props || {}).step || {}).isCurrentStep
      ? '#4CBB02'
      : '#eee',
    color:
      ((props || {}).step || {}).isCurrentStep ||
      ((props || {}).step || {}).completed
        ? '#eee'
        : '',
    fontSize: '22px',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    textAlign: 'center',
    lineHeight: '40px',
    marginTop: '-10px',
  }),
  stepText: {
    display: 'inline-flex',
  },
  successText: {
    paddingRight: '15px',
    color: '#4CBB02',
  },
  stepRow: {
    borderBottom: '1px solid #e5e5e5',
    marginTop: '10px',
    marginBottom: '10px',
  },
}));

export default function InstallationStep(props) {
  const classes = useStyles(props);
  const { step, index, handleStepClick } = props;

  if (!step) {
    return null;
  }

  const onStepClick = e => {
    e.preventDefault();
    handleStepClick(step);
  };

  const getStepText = step => {
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
  };

  return (
    <Grid item xs={12} className={classes.stepRow}>
      <Grid container spacing={2}>
        <Grid item xs={1} className={classes.step}>
          <Typography variant="h4" className={classes.stepNumber}>
            {index}
          </Typography>
        </Grid>
        <Grid item xs={3} className={classes.step}>
          <Typography>{step.name}</Typography>
        </Grid>
        <Grid item xs className={classes.step}>
          <Typography>{step.description}</Typography>
        </Grid>
        <Grid item xs={2} className={classes.step}>
          <img
            alt=""
            src={
              process.env.CDN_BASE_URI +
              step.imageURL.replace(/^\/images\//, '')
            }
          />
        </Grid>
        <Grid item xs={2} className={classes.step}>
          {!step.completed && (
            <Button
              href="/"
              disabled={!step.isCurrentStep}
              onClick={onStepClick}
              underline="none"
              variant="text">
              {getStepText(step)}
            </Button>
          )}
          {step.completed && (
            <Fragment>
              <Typography onClick={onStepClick} className={classes.successText}>
                {getStepText(step)}
              </Typography>
              <img
                alt=""
                src={`${process.env.CDN_BASE_URI}icons/success.png`}
              />
            </Fragment>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
