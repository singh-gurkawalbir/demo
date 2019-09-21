import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  IconButton,
  Grid,
  Paper,
  Breadcrumbs,
} from '@material-ui/core';
import ArrowBackIcon from '../../components/icons/ArrowLeftIcon';
import ArrowRightIcon from '../../components/icons/ArrowRightIcon';
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
  paper: {
    padding: theme.spacing(1, 2),
    background: theme.palette.background.default,
  },
}));

export default function IntegrationAppAddNewStore(props) {
  const classes = useStyles();
  const { integrationId } = props.match.params;
  const [selectedConnectionId, setSelectedConnectionId] = useState(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [requestedSteps, setRequestedSteps] = useState(false);
  const dispatch = useDispatch();
  const integration = useSelector(state =>
    selectors.integrationAppSettings(state, integrationId)
  );
  const addNewStoreSteps = useSelector(state =>
    selectors.addNewStoreSteps(state, integrationId)
  );

  useEffect(() => {
    if ((!addNewStoreSteps || !addNewStoreSteps.length) && !requestedSteps) {
      dispatch(actions.integrationApp.store.addNew(integrationId));
      setRequestedSteps(true);
    }
  }, [addNewStoreSteps, requestedSteps, dispatch, integrationId]);
  useEffect(() => {
    if (
      addNewStoreSteps.length &&
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

  if (!addNewStoreSteps) {
    return <Typography>Loading new store installation steps</Typography>;
  }

  if (!integration || !integration._connectorId) {
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

  const handleBackClick = () => {
    props.history.goBack();
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
    setSelectedConnectionId(false);
  };

  const handleClose = () => {
    setSelectedConnectionId(false);
  };

  return (
    <LoadResources required resources="connections,integrations">
      {selectedConnectionId && (
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

            <Grid item xs>
              <Paper elevation={0} className={classes.paper}>
                <Breadcrumbs
                  separator={<ArrowRightIcon />}
                  aria-label="breadcrumb">
                  <Typography color="textPrimary">Add New Store</Typography>
                  <Typography color="textPrimary">
                    {integration.name}
                  </Typography>
                </Breadcrumbs>
              </Paper>
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
