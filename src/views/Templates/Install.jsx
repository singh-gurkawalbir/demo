import { useEffect, useState, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  IconButton,
  Grid,
  Paper,
  Breadcrumbs,
} from '@material-ui/core';
import shortid from 'shortid';
import produce from 'immer';
import ArrowBackIcon from '../../components/icons/ArrowLeftIcon';
import * as selectors from '../../reducers';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import openExternalUrl from '../../utils/window';
import ArrowRightIcon from '../../components/icons/ArrowRightIcon';
import ConnectionSetupDialog from '../../components/ConnectionSetupDialog';
import StackSetupDialog from '../../components/StackSetupDialog';
import InstallationStep from '../../components/InstallStep';
import jsonUtil from '../../utils/json';

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

function reducer(state, action = {}) {
  const { type, step = {} } = action;

  return produce(state, draft => {
    const currentStep = draft.find(
      s =>
        (step._connectionId && s._connectionId === step._connectionId) ||
        (step.installURL && s.installURL === step.installURL) ||
        (step.stackId && s.stackId === step.stackId)
    );

    // eslint-disable-next-line default-case
    switch (type) {
      case 'stepCompleted':
        currentStep.isCurrentStep = false;
        currentStep.completed = true;
        break;
    }

    const uncompletedStep = draft.find(s => !s.completed);

    uncompletedStep.isCurrentStep = true;
  });
}

export default function ConnectorInstallation(props) {
  const classes = useStyles();
  const { templateId } = props.match.params;
  const [connection, setSelectedConnectionId] = useState(null);
  const [stackId, setStackId] = useState(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const dispatch = useDispatch();
  const template = useSelector(state => selectors.template(state, templateId));
  const connectionMap = useSelector(state =>
    selectors.templateConnectionMap(state, templateId)
  );
  const steps = useSelector(state =>
    selectors.templateInstallSteps(state, templateId)
  );
  const [cMap, setCMap] = useState({});
  const [installSteps, dispatchLocalAction] = useReducer(reducer, steps);

  if (
    installSteps.find(s => !s.completed) &&
    !installSteps.find(s => s.isCurrentStep)
  ) {
    dispatchLocalAction({ type: 'init' });
  }

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
    const { _connectionId, installURL, installerFunction, stackId } = step;

    // handle connection step click
    if (_connectionId) {
      if (step.isTriggered) {
        return false;
      }

      const newId = `new-${shortid.generate()}`;
      const connObj = connectionMap[_connectionId];

      dispatch(actions.resourceForm.init('connections', newId, true, true));
      dispatch(
        actions.resourceForm.submit('connections', newId, {
          ...jsonUtil.objectForPatchSet(connObj),
          application: connObj.type,
        })
      );
      dispatch(actions.resourceForm.clear('connections', newId));
      setSelectedConnectionId({ newId, doc: connObj });

      // handle Installation step click
    } else if (installURL) {
      if (!step.isTriggered) {
        dispatchLocalAction(
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

        dispatchLocalAction(
          actions.integrationApp.installer.updateStep(
            templateId,
            installerFunction,
            'verify'
          )
        );
        dispatchLocalAction(
          actions.integrationApp.installer.installStep(
            templateId,
            installerFunction
          )
        );
      }
      // handle Action step click
    } else if (!step.isTriggered) {
      setStackId(true);
    }
  };

  const handleBackClick = e => {
    e.preventDefault();
    props.history.push(`/pg`);
  };

  const handleSubmitComplete = connectionId => {
    dispatchLocalAction({
      type: 'stepCompleted',
      step: { _connectionId: connection.doc._id },
    });
    setCMap({ ...cMap, [connection.doc._id]: connectionId });
    setSelectedConnectionId(false);
  };

  const handleStackSetupDone = stackId => {
    dispatchLocalAction({ type: 'stepCompleted', step: { stackId } });
    setStackId(false);
  };

  const handleClose = () => {
    setSelectedConnectionId(false);
  };

  return (
    <LoadResources required resources="connections,integrations">
      {connection && (
        <ConnectionSetupDialog
          _connectionId={connection.newId}
          connection={connection.doc}
          connectionType={connection.doc.type}
          onClose={handleClose}
          onSubmitComplete={handleSubmitComplete}
          addOrSelect
        />
      )}
      {stackId && (
        <StackSetupDialog
          onClose={handleClose}
          onSubmitComplete={handleStackSetupDone}
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
