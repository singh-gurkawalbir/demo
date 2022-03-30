import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import integrationAppsUtil from '../../utils/integrationApps';
import SuccessIcon from '../icons/SuccessIcon';
import { INSTALL_STEP_TYPES } from '../../utils/constants';
import ApplicationImg from '../icons/ApplicationImg';
import { selectors } from '../../reducers';
import actions from '../../actions';
import InfoIconButton from '../InfoIconButton';
import Spinner from '../Spinner';
import { TextButton } from '../Buttons';
import getImageUrl from '../../utils/image';

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
        : theme.palette.common.white,
    // eslint-disable-next-line no-nested-ternary
    color: step.completed
      ? theme.palette.secondary.contrastText
      : step.isCurrentStep
        ? theme.palette.common.white
        : theme.palette.secondary.contrastText,
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
  stepName: step => ({
    paddingLeft: 14,
    display: 'flex',
    alignItems: 'center',
    color: step.completed ? theme.palette.secondary.lightest : theme.palette.success.main,
  }),
  successText: {
    color: theme.palette.success.main,
  },
  stepRow: {
    marginBottom: theme.spacing(0.5),
    display: 'flex',
    background: theme.palette.background.paper,
    height: theme.spacing(6),
  },
  imgBlock: {
    display: 'flex',
    maxWidth: 136,
    alignItems: 'center',
    '& > img': {
      maxWidth: '100%',
      maxHeight: theme.spacing(3),
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
  installActionBtnWrapper: {
    width: 112,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    position: 'relative',
    minHeight: theme.spacing(4),
    borderLeft: `1px solid ${theme.palette.secondary.contrastText}`,
  },
  installActionBtn: {
    padding: 0,
    minWidth: 'unset',
    display: 'flex',
    alignItems: 'center',
  },
  installBtn: {
    color: `${theme.palette.primary.main} !important`,
    fontWeight: 'bold',
    '&:hover': {
      background: 'none',
    },
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
  stepCountWithName: {
    display: 'flex',
    maxWidth: '60%',
    wordBreak: 'break-word',
  },
  completedText: {
    color: theme.palette.secondary.contrastText,
    fontSize: 15,
    lineHeight: '19px',
  },
  successIcon: {
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
  const { step, index, handleStepClick, mode = 'install', templateId, integrationId, isFrameWork2 } = props;
  const dispatch = useDispatch();
  const [verified, setVerified] = useState(false);
  const isTemplate = useSelector(state => {
    const integrationSettings = selectors.integrationAppSettings(state, integrationId);

    return !integrationSettings?._connectorId;
  });

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
    if (step && !step.completed && !verified) {
      if (
        connection &&
        step.type === INSTALL_STEP_TYPES.INSTALL_PACKAGE
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
      } else if (
        step.isCurrentStep &&
        (step.installURL || step.url) &&
        isTemplate &&
        step.connectionId
      ) {
        dispatch(
          actions.integrationApp.installer.updateStep(
            integrationId,
            step.installerFunction,
            'verify'
          )
        );
        dispatch(
          actions.integrationApp.templates.installer.verifyBundleOrPackageInstall(
            integrationId,
            step.connectionId,
            step.installerFunction,
            isFrameWork2
          )
        );
        setVerified(true);
      }
    }
  }, [connection, dispatch, integrationId, isFrameWork2, isTemplate, step, templateId, verified]);

  if (!step) {
    return null;
  }
  const { stepText, showSpinner } = integrationAppsUtil.getStepText(step, mode);

  const onStepClick = () => {
    handleStepClick(step, connection, index);
  };

  return (

    <div className={classes.stepRow}>
      <div className={classes.installIntegrationStepWrapper}>
        <div className={classes.stepCountWithName}>
          {step.completed && !step.isCurrentStep
            ? <SuccessIcon className={clsx(classes.successText, classes.successIcon)} />
            : (
              <div>
                <Typography variant="h4" className={classes.stepNumber}>
                  {index}
                </Typography>
              </div>
            )}
          <div className={classes.stepName}>
            <Typography className={clsx(classes.stepTextAll, {[classes.stepTextInstall]: (step.isCurrentStep && !step.completed)})}>
              {step.name}
            </Typography>
            <InfoIconButton info={step.description} className={classes.installInfoBtn} />
          </div>
        </div>
        <div className={classes.logoWithAction}>
          <div className={classes.imgBlock}>
            {step.imageURL && (
            <img
              alt=""
              src={getImageUrl(step.imageURL)}
            />
            )}
            {(step.type === INSTALL_STEP_TYPES.CONNECTION || step?.sourceConnection) && (
            <ApplicationImg
              size="small"
              type={
                step?.options?.connectionType?.toLowerCase() || step?.sourceConnection?.http?.formType || step?.sourceConnection?.type || ''
              }
              assistant={step?.sourceConnection?.assistant || step?.sourceConnection?.rdbms?.type}
            />
            )}
          </div>
          <div className={classes.installActionBtnWrapper}>
            {!step.completed && (
            <TextButton
              data-test={stepText}
              disabled={!step.isCurrentStep}
              onClick={onStepClick}
              className={clsx(classes.installActionBtn, {[classes.installBtn]: (step.isCurrentStep && !step.completed)})}
              >
              {showSpinner && <Spinner size="small" />} {stepText}
            </TextButton>
            )}
            {step.completed && (
            <>
              <Typography onClick={onStepClick} className={classes.completedText}>
                {showSpinner && <Spinner size="small" />}  {stepText}
              </Typography>
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
