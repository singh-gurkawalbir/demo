import { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, Grid } from '@material-ui/core';
import integrationAppsUtil from '../../utils/integrationApps';

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
  const { step, index, handleStepClick, mode = 'install' } = props;

  if (!step) {
    return null;
  }

  const onStepClick = e => {
    e.preventDefault();
    handleStepClick(step);
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
              {integrationAppsUtil.getStepText(step, mode)}
            </Button>
          )}
          {step.completed && (
            <Fragment>
              <Typography onClick={onStepClick} className={classes.successText}>
                {integrationAppsUtil.getStepText(step, mode)}
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
