import { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, Grid } from '@material-ui/core';
import integrationAppsUtil from '../../utils/integrationApps';
import SuccessIcon from '../icons/SuccessIcon';
import ApplicationImg from '../icons/ApplicationImg';
import * as selectors from '../../reducers';
import actions from '../../actions';

const useStyles = makeStyles(theme => ({
  step: {
    position: 'relative',
    height: '50px',
    padding: '25px 40px 25px 0',
    display: 'inline-flex',
  },
  stepNumber: step => ({
    // eslint-disable-next-line no-nested-ternary
    background: step.completed
      ? theme.palette.primary.main
      : step.isCurrentStep
      ? theme.palette.success.main
      : theme.palette.secondary.lightest,
    color:
      step.isCurrentStep || step.completed
        ? theme.palette.background.paper
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
    color: theme.palette.success.main,
  },
  stepRow: {
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    marginTop: '10px',
    marginBottom: '10px',
  },
}));

export default function InstallationStep(props) {
  const classes = useStyles(props.step || {});
  const { step, index, handleStepClick, mode = 'install', templateId } = props;
  const dispatch = useDispatch();
  const [verified, setVerified] = useState(false);
  const connection = useSelector(state => {
    if (step && step.type === 'installPackage') {
      return selectors.resource(
        state,
        'connections',
        (step.options || {})._connectionId
      );
    }

    return null;
  });

  useEffect(() => {
    if (
      connection &&
      step &&
      step.type === 'installPackage' &&
      !step.completed &&
      !verified
    ) {
      dispatch(
        actions.template.updateStep(
          { ...step, status: 'verifying' },
          templateId
        )
      );
      dispatch(
        actions.template.verifyBundleInstall(step, connection, templateId)
      );
      setVerified(true);
    }
  }, [connection, dispatch, step, templateId, verified]);

  if (!step) {
    return null;
  }

  const onStepClick = () => {
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
          {step.imageURL && (
            <img alt="" src={process.env.CDN_BASE_URI + step.imageURL} />
          )}
          {step.type === 'Connection' && (
            <ApplicationImg size="large" type={step.options.connectionType} />
          )}
        </Grid>
        <Grid item xs={2} className={classes.step}>
          {!step.completed && (
            <Button
              disabled={!step.isCurrentStep}
              onClick={onStepClick}
              variant="text">
              {integrationAppsUtil.getStepText(step, mode)}
            </Button>
          )}
          {step.completed && (
            <Fragment>
              <Typography onClick={onStepClick} className={classes.successText}>
                {integrationAppsUtil.getStepText(step, mode)}
              </Typography>
              <SuccessIcon />
            </Fragment>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
