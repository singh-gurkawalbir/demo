import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import * as selectors from '../../reducers';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import openExternalUrl from '../../utils/window';
import ConnectionSetupDialog from '../../components/ConnectionSetupDialog';
import InstallationStep from '../../components/InstallStep';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
    flexGrow: 1,
    width: '100%',
    padding: '10px 25px',
  },
  formHead: {
    borderBottom: 'solid 1px #e5e5e5',
    marginBottom: '29px',
  },
  backBtn: {
    background: `url(${process.env.CDN_BASE_URI}images/icons/back.png) no-repeat scroll center center`,
    height: '24px',
    marginRight: '10px',
    width: '17px',
    padding: 0,
    margin: '0 10px 0 0',
    minHeight: '24px',
  },
  innerContent: {
    width: '80vw',
  },
  stepTable: { position: 'relative', marginTop: '-20px' },
  floatRight: {
    float: 'right',
  },
}));

export default function ConnectorInstallation(props) {
  const classes = useStyles();
  const { integrationId } = props.match.params;
  const [selectedConnectionId, setSelectedConnectionId] = useState(null);
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const dispatch = useDispatch();
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );
  const installSteps = useSelector(state =>
    selectors.integrationInstallSteps(state, integrationId)
  );

  useEffect(() => {
    if (
      !installSteps.reduce((result, step) => result || !step.completed, false)
    ) {
      setIsSetupComplete(true);
    }
  }, [installSteps]);

  useEffect(() => {
    if (isSetupComplete) {
      // redirect to integration Settings
      dispatch(actions.resource.request('integrations', integrationId));
      props.history.push(`/pg/integrations/${integrationId}/settings/flows`);
    }
  }, [dispatch, integrationId, isSetupComplete, props.history]);

  if (!installSteps || !integration || !integration._connectorId) {
    return <Typography>No Integration Found</Typography>;
  }

  const handleStepClick = step => {
    const { _connectionId, installURL, installerFunction } = step;

    // handle connection step click
    if (_connectionId) {
      if (step.__isTriggered) {
        return false;
      }

      setSelectedConnectionId(_connectionId);
      setShowConnectionDialog(true);
      // handle Installation step click
    } else if (installURL) {
      if (!step.__isTriggered) {
        dispatch(
          actions.integrationApps.installer.stepInstallInProgress(
            integrationId,
            installerFunction
          )
        );
        openExternalUrl({ url: installURL });
      } else {
        if (step.__verifying) {
          return false;
        }

        dispatch(
          actions.integrationApps.installer.verifyStepInstall(
            integrationId,
            installerFunction
          )
        );
        dispatch(
          actions.integrationApps.installer.stepInstall(
            integrationId,
            installerFunction
          )
        );
      }
      // handle Action step click
    } else if (!step.__isTriggered) {
      dispatch(
        actions.integrationApps.installer.stepInstallInProgress(
          integrationId,
          installerFunction
        )
      );
      dispatch(
        actions.integrationApps.installer.stepInstall(
          integrationId,
          installerFunction
        )
      );
    }
  };

  const handleBackClick = e => {
    e.preventDefault();
    props.history.push(`/pg`);
  };

  const handleSubmitComplete = () => {
    const step = installSteps.find(s => s.isCurrentStep);

    dispatch(
      actions.integrationApps.installer.stepInstallInProgress(
        integrationId,
        (step || {}).installerFunction
      )
    );
    dispatch(
      actions.integrationApps.installer.stepInstall(
        integrationId,
        (step || {}).installerFunction
      )
    );
    setShowConnectionDialog(false);
  };

  const handleClose = () => {
    setShowConnectionDialog(false);
  };

  return (
    <LoadResources required resources="connections,integrations">
      {showConnectionDialog && (
        <ConnectionSetupDialog
          _connectionId={selectedConnectionId}
          onClose={handleClose}
          onSubmitComplete={handleSubmitComplete}
        />
      )}
      <div className={classes.root}>
        <div className={classes.innerContent}>
          <Grid container className={classes.formHead}>
            <Grid item xs={1}>
              <IconButton onClick={handleBackClick} size="medium">
                <ArrowBackIcon fontSize="inherit" />
              </IconButton>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="h6">Setup &gt;</Typography>
            </Grid>
            <Grid item xs className="connectorName">
              <Typography variant="h6">{integration.name}</Typography>
            </Grid>
            <Grid item xs={1} className={classes.floatRight}>
              <Button variant="outlined" color="primary">
                Uninstall
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={3} className={classes.stepTable}>
            {installSteps.map((step, index) => (
              <InstallationStep
                key={step.name}
                handleStepClick={handleStepClick}
                index={index + 1}
                step={step}
                classes={classes}
              />
            ))}
          </Grid>
        </div>
      </div>
    </LoadResources>
  );
}
