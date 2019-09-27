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
import shortid from 'shortid';
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

export default function ConnectorInstallation(props) {
  const classes = useStyles();
  const { templateId } = props.match.params;
  const [connection, setSelectedConnectionId] = useState(null);
  const [stackId, setShowStackDialog] = useState(null);
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
      dispatch(actions.template.createComponents(templateId));
    }
  }, [dispatch, isSetupComplete, props.history, templateId]);

  if (!installSteps) {
    return <Typography>Invalid Template</Typography>;
  }

  const handleStepClick = step => {
    const { _connectionId, installURL, installerFunction, type } = step;

    // handle connection step click
    if (type === 'Connection') {
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
    } else if (type === 'installPackage') {
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
    } else if (type === 'Stack') {
      if (!stackId) setShowStackDialog(`new-${shortid.generate()}`);
    }
  };

  const handleBackClick = e => {
    e.preventDefault();
    props.history.push(`/pg`);
  };

  const handleSubmitComplete = connectionId => {
    dispatch(
      actions.template.updateStep(
        {
          _connectionId: connection.doc._id,
          newConnectionId: connectionId,
          status: 'completed',
          verifyBundleStep: ['netsuite', 'salesforce'].includes(
            connection.doc.type
          )
            ? connection.doc.type
            : false,
        },
        templateId
      )
    );
    setSelectedConnectionId(false);
  };

  const handleStackSetupDone = stackId => {
    dispatch(
      actions.template.updateStep(
        { status: 'completed', stackId, type: 'Stack' },
        templateId
      )
    );
    setShowStackDialog(false);
  };

  const handleConnectionClose = () => {
    setSelectedConnectionId(false);
  };

  const handleStackClose = () => {
    setShowStackDialog(false);
  };

  return (
    <LoadResources required resources="connections,integrations">
      {connection && (
        <ConnectionSetupDialog
          _connectionId={connection.newId}
          connection={connection.doc}
          connectionType={connection.doc.type}
          onClose={handleConnectionClose}
          onSubmitComplete={handleSubmitComplete}
          addOrSelect
        />
      )}
      {stackId && (
        <StackSetupDialog
          onClose={handleStackClose}
          addOrSelect
          resourceId={stackId}
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
                <Breadcrumbs separator={<ArrowRightIcon />}>
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
                templateId={templateId}
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
