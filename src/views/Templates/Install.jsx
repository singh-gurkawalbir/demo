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
import * as selectors from '../../reducers';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import openExternalUrl from '../../utils/window';
import ArrowRightIcon from '../../components/icons/ArrowRightIcon';
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

export default function ConnectorInstallation(props) {
  const classes = useStyles();
  const { templateId } = props.match.params;
  const [selectedConnectionId, setSelectedConnectionId] = useState(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const dispatch = useDispatch();
  const template = useSelector(state => selectors.template(state, templateId));
  const connectionMap = useSelector(state =>
    selectors.templateConnectionMap(state, templateId)
  );
  const installSteps = useSelector(state =>
    selectors.templateInstallSteps(state, templateId)
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
      dispatch(actions.template.createComponents());
    }
  }, [dispatch, isSetupComplete, props.history]);

  if (!installSteps) {
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
          actions.integrationApp.installer.updateStep(
            templateId,
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
            templateId,
            installerFunction,
            'verify'
          )
        );
        dispatch(
          actions.integrationApp.installer.installStep(
            templateId,
            installerFunction
          )
        );
      }
      // handle Action step click
    } else if (!step.isTriggered) {
      dispatch(
        actions.integrationApp.installer.updateStep(
          templateId,
          installerFunction,
          'inProgress'
        )
      );
      dispatch(
        actions.integrationApp.installer.installStep(
          templateId,
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
      actions.integrationApp.installer.updateStep(
        templateId,
        (step || {}).installerFunction,
        'inProgress'
      )
    );
    dispatch(
      actions.integrationApp.installer.installStep(
        templateId,
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
          connection={connectionMap[selectedConnectionId]}
          onClose={handleClose}
          onSubmitComplete={handleSubmitComplete}
          addOrSelect
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
                  <Typography color="textPrimary">Setup</Typography>
                  <Typography color="textPrimary">{template.name}</Typography>
                </Breadcrumbs>
              </Paper>
            </Grid>
          </Grid>
          <Grid container spacing={3} className={classes.stepTable}>
            {installSteps.map((step, index) => (
              <InstallationStep
                key={step.name}
                connectionMap={connectionMap}
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
