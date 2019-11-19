import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  IconButton,
  Button,
  Grid,
  Paper,
  Breadcrumbs,
} from '@material-ui/core';
import ArrowBackIcon from '../../components/icons/ArrowLeftIcon';
import * as selectors from '../../reducers';
import actions from '../../actions';
import { getResourceSubType } from '../../utils/resource';
import LoadResources from '../../components/LoadResources';
import openExternalUrl from '../../utils/window';
import resourceConstants from '../../forms/constants/connection';
import ArrowRightIcon from '../../components/icons/ArrowRightIcon';
import ConnectionSetupDialog from '../../components/ResourceSetupDialog';
import InstallationStep from '../../components/InstallStep';
import { confirmDialog } from '../../components/ConfirmDialog';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
    flexGrow: 1,
    width: '100%',
    padding: '10px 25px',
  },
  formHead: {
    borderBottom: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    marginBottom: 29,
  },
  innerContent: {
    width: '80vw',
  },
  stepTable: { position: 'relative', marginTop: -20 },
  floatRight: {
    float: 'right',
  },
  paper: {
    padding: theme.spacing(1, 2),
    background: theme.palette.background.default,
  },
}));
const getConnectionType = resource => {
  const { assistant, type } = getResourceSubType(resource);

  if (assistant) return assistant;

  return type;
};

export default function ConnectorInstallation(props) {
  const classes = useStyles();
  const { integrationId } = props.match.params;
  const [selectedConnectionId, setSelectedConnectionId] = useState(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const dispatch = useDispatch();
  const integration = useSelector(state =>
    selectors.integrationAppSettings(state, integrationId)
  );
  const installSteps = useSelector(state =>
    selectors.integrationInstallSteps(state, integrationId)
  );
  const selectedConnection = useSelector(state =>
    selectors.resource(state, 'connections', selectedConnectionId)
  );

  useEffect(() => {
    if (
      installSteps.length &&
      !installSteps.reduce((result, step) => result || !step.completed, false)
    ) {
      dispatch(actions.resource.request('integrations', integrationId));
      setIsSetupComplete(true);
    }
  }, [dispatch, installSteps, integrationId]);

  useEffect(() => {
    if (isSetupComplete) {
      // redirect to integration Settings
      dispatch(actions.resource.request('integrations', integrationId));

      if (integration.mode === 'settings') {
        props.history.push(`/pg/connectors/${integrationId}/settings/flows`);
      }
    }
  }, [
    dispatch,
    integration.mode,
    integrationId,
    isSetupComplete,
    props.history,
  ]);

  if (!installSteps || !integration || !integration._connectorId) {
    return <Typography>No Integration Found</Typography>;
  }

  const initUninstall = storeId => {
    dispatch(
      actions.integrationApp.uninstaller.preUninstall(storeId, integrationId)
    );
  };

  const handleUninstall = e => {
    e.preventDefault();
    confirmDialog({
      title: 'Uninstall',
      message: `Are you sure you want to uninstall`,
      buttons: [
        {
          label: 'Cancel',
        },
        {
          label: 'Yes',
          onClick: () => {
            const storeId = (integration.stores || {}).length
              ? integration.stores[0].value
              : undefined;

            initUninstall(storeId);
          },
        },
      ],
    });
  };

  const handleStepClick = step => {
    const { _connectionId, installURL, installerFunction } = step;

    // handle connection step click
    if (_connectionId) {
      if (step.isTriggered) {
        return false;
      }

      setSelectedConnectionId(_connectionId);
      // handle Installation step click
    } else if (installURL) {
      if (!step.isTriggered) {
        dispatch(
          actions.integrationApp.installer.updateStep(
            integrationId,
            installerFunction,
            'inProgress'
          )
        );
        openExternalUrl({ url: installURL });
      } else {
        if (step.verifying) {
          return false;
        }

        dispatch(
          actions.integrationApp.installer.updateStep(
            integrationId,
            installerFunction,
            'verify'
          )
        );
        dispatch(
          actions.integrationApp.installer.installStep(
            integrationId,
            installerFunction
          )
        );
      }
      // handle Action step click
    } else if (!step.isTriggered) {
      dispatch(
        actions.integrationApp.installer.updateStep(
          integrationId,
          installerFunction,
          'inProgress'
        )
      );
      dispatch(
        actions.integrationApp.installer.installStep(
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

  const handleSubmitComplete = (connId, isAuthorized) => {
    const step = installSteps.find(s => s.isCurrentStep);

    if (
      resourceConstants.OAUTH_APPLICATIONS.includes(
        getConnectionType(selectedConnection)
      ) &&
      !isAuthorized
    ) {
      return;
    }

    dispatch(
      actions.integrationApp.installer.updateStep(
        integrationId,
        (step || {}).installerFunction,
        'inProgress'
      )
    );
    dispatch(
      actions.integrationApp.installer.installStep(
        integrationId,
        (step || {}).installerFunction
      )
    );
    setSelectedConnectionId(false);
  };

  const handleClose = () => {
    setSelectedConnectionId(false);
  };

  return (
    <LoadResources required resources="connections,integrations">
      {selectedConnectionId && (
        <ConnectionSetupDialog
          resourceId={selectedConnectionId}
          onClose={handleClose}
          onSubmitComplete={handleSubmitComplete}
        />
      )}
      <div className={classes.root}>
        <div className={classes.innerContent}>
          <Grid container className={classes.formHead}>
            <Grid item xs={1}>
              <IconButton
                data-test="back"
                onClick={handleBackClick}
                size="medium">
                <ArrowBackIcon fontSize="inherit" />
              </IconButton>
            </Grid>
            <Grid item xs>
              <Paper elevation={0} className={classes.paper}>
                <Breadcrumbs
                  separator={<ArrowRightIcon />}
                  aria-label="breadcrumb">
                  <Typography color="textPrimary">Setup</Typography>
                  <Typography color="textPrimary">
                    {integration.name}
                  </Typography>
                </Breadcrumbs>
              </Paper>
            </Grid>
            <Grid item xs={1} className={classes.floatRight}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleUninstall}>
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
              />
            ))}
          </Grid>
        </div>
      </div>
    </LoadResources>
  );
}
