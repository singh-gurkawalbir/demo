import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, IconButton, Grid } from '@material-ui/core';
import ArrowBackIcon from '../../components/icons/ArrowLeftIcon';
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
    borderBottom: `solid 1px ${theme.palette.secondary.lightest}`,
    marginBottom: '29px',
  },
  innerContent: {
    width: '80vw',
  },
  stepTable: { position: 'relative', marginTop: '-20px' },
  floatRight: {
    float: 'right',
  },
}));

export default function IntegrationAppAddNewStore(props) {
  const classes = useStyles();
  const { integrationId } = props.match.params;
  const [selectedConnectionId, setSelectedConnectionId] = useState(null);
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const dispatch = useDispatch();
  const integration = useSelector(state =>
    selectors.integrationAppSettings(state, integrationId)
  );
  const addNewStoreSteps = useSelector(state =>
    selectors.addNewStoreSteps(state, integrationId)
  );

  useEffect(() => {
    if (
      !addNewStoreSteps.reduce(
        (result, step) => result || !step.completed,
        false
      )
    ) {
      setIsSetupComplete(true);
    }
  }, [addNewStoreSteps]);

  useEffect(() => {
    if (isSetupComplete) {
      // redirect to integration Settings
      dispatch(actions.integrationApp.store.clearSteps(integrationId));
      dispatch(actions.resource.request('integrations', integrationId));
      props.history.push(`/pg/connectors/${integrationId}/settings/flows`);
    }
  }, [dispatch, integrationId, isSetupComplete, props.history]);

  if (!addNewStoreSteps || !integration || !integration._connectorId) {
    return <Typography>No Integration Found</Typography>;
  }

  const handleStepClick = step => {
    const { _connectionId, installURL, installerFunction } = step;

    // handle connection step click
    if (_connectionId) {
      if (step.isTriggered) {
        return false;
      }

      setSelectedConnectionId(_connectionId);
      setShowConnectionDialog(true);
      // handle Installation step click
    } else if (installURL) {
      if (!step.isTriggered) {
        dispatch(
          actions.integrationApp.store.updateStep(
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
          actions.integrationApp.store.updateStep(
            integrationId,
            installerFunction,
            'verify'
          )
        );
        dispatch(
          actions.integrationApp.store.installStep(
            integrationId,
            installerFunction
          )
        );
      }
      // handle Action step click
    } else if (!step.isTriggered) {
      dispatch(
        actions.integrationApp.store.updateStep(
          integrationId,
          installerFunction,
          'inProgress'
        )
      );
      dispatch(
        actions.integrationApp.store.installStep(
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
    const step = addNewStoreSteps.find(s => s.isCurrentStep);

    dispatch(
      actions.integrationApp.store.updateStep(
        integrationId,
        (step || {}).installerFunction,
        'inProgress'
      )
    );
    dispatch(
      actions.integrationApp.store.installStep(
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
          </Grid>
          <Grid container spacing={3} className={classes.stepTable}>
            {addNewStoreSteps.map((step, index) => (
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
