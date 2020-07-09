import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import integrationAppsUtil from '../../utils/integrationApps';
import SuccessIcon from '../icons/SuccessIcon';
import { INSTALL_STEP_TYPES } from '../../utils/constants';
import ApplicationImg from '../icons/ApplicationImg';
import * as selectors from '../../reducers';
import actions from '../../actions';
import InfoIconButton from '../InfoIconButton';

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
      ? theme.palette.common.white
      : step.isCurrentStep
        ? theme.palette.primary.main
        : theme.palette.secondary.lightest,
    // eslint-disable-next-line no-nested-ternary
    color: step.completed
      ? theme.palette.secondary.contrastText
      : step.isCurrentStep
        ? theme.palette.common.white
        : theme.palette.success.main,
    border: '1px solid',
    // eslint-disable-next-line no-nested-ternary
    borderColor: step.completed
      ? theme.palette.secondary.contrastText
      : step.isCurrentStep
        ? theme.palette.primary.main
        : theme.palette.secondary.contrastText,
    fontSize: '16px',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  stepText: {
    display: 'inline-flex',
  },
  successText: {
    color: theme.palette.success.main,
  },
  stepRow: {
    marginBottom: theme.spacing(0.5),
    display: 'flex',
    background: theme.palette.background.paper,
    minHeight: theme.spacing(6),
  },
  imgBlock: {
    display: 'flex',
    borderRight: `1px solid ${theme.palette.secondary.lightest}`,
    paddingRight: theme.spacing(2),
    marginRight: theme.spacing(2),
    maxWidth: 60,
    '& > img': {
      maxWidth: '100%',
      height: 'auto',
    },
  },
  installIntegrationStepWrapper: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    padding: theme.spacing(1),
    justifyContent: 'space-between',
  },
  logoWithAction: {
    display: 'flex',
  },
  installActionBtn: {
    width: 90,
  },
  installInfoBtn: {
    margin: 0,
    '& svg': {
      fontSize: 16,
    },
    '&:hover': {
      background: 'none',
    },
  },
  stepName: {
    paddingLeft: 14,
    display: 'flex',
    alignItems: 'center',

  },
  stepCountWithName: {
    display: 'flex',
    maxWidth: '70%',
    wordBreak: 'break-word',
  },
  installBtn: {
    color: theme.palette.primary.main,
    padding: 0,
    minWidth: 'unset',
    '&:hover': {
      background: 'none',
    },
  },
  completedText: {
    color: theme.palette.secondary.contrastText,
  },
  succcessIcon: {
    fontSize: 33,
    marginLeft: -1,
  },
  stepTextAll: {
    color: theme.palette.secondary.contrastText,
    fontSize: 15,
  },
  stepTextInstall: {
    fontWeight: 'bold',
    color: theme.palette.secondary.light,
  },
}));

export default function InstallationStep(props) {
  const classes = useStyles(props.step || {});
  const { step, index, handleStepClick, mode = 'install', templateId } = props;

  const dispatch = useDispatch();
  const [verified, setVerified] = useState(false);
  const connection = useSelector(state => {
    if (step && step.type === INSTALL_STEP_TYPES.INSTALL_PACKAGE) {
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
      step.type === INSTALL_STEP_TYPES.INSTALL_PACKAGE &&
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
        actions.template.verifyBundleOrPackageInstall(
          step,
          connection,
          templateId
        )
      );
      setVerified(true);
    }
  }, [connection, dispatch, step, templateId, verified]);

  if (!step) {
    return null;
  }

  const onStepClick = () => {
    handleStepClick(step, connection, index);
  };

  return (

    <div className={classes.stepRow}>
      <div className={classes.installIntegrationStepWrapper}>
        <div className={classes.stepCountWithName}>
          {step.installURL ? (
            <SuccessIcon className={clsx(classes.successText, classes.succcessIcon)} />
          ) :
            <div>
              <Typography variant="h4" className={classes.stepNumber}>
                {index}
              </Typography>
            </div>}
          <div className={classes.stepName}>
            <Typography className={clsx(classes.stepTextAll, {[classes.stepTextInstall]: !step.completed})}>{step.name}</Typography>
            <InfoIconButton info={step.description} className={classes.installInfoBtn} />
          </div>
        </div>
        <div className={classes.logoWithAction}>
          <div className={classes.imgBlock}>
            {step.imageURL && (
            <img
              alt=""
              src={process.env.CDN_BASE_URI + step.imageURL.replace(/^\//g, '')}
            />
            )}
            {step.type === INSTALL_STEP_TYPES.CONNECTION && (
            <ApplicationImg
              size="small"
              type={
                step.options.connectionType
                  ? step.options.connectionType.toLowerCase()
                  : ''
              }
            />
            )}
          </div>
          <div className={classes.installActionBtn}>
            {!step.completed && (
            <Button
              data-test={integrationAppsUtil.getStepText(step, mode)}
              disabled={!step.isCurrentStep}
              onClick={onStepClick}
              variant="text"
              color="primary"
              className={classes.installBtn}
              >
              {integrationAppsUtil.getStepText(step, mode)}
            </Button>
            )}
            {step.completed && (
            <>
              <Typography onClick={onStepClick} className={classes.completedText}>
                {integrationAppsUtil.getStepText(step, mode)}
              </Typography>
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
