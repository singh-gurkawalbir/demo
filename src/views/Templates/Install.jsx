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
import ResourceSetupDialog from '../../components/ResourceSetupDialog';
import InstallationStep from '../../components/InstallStep';
import resourceConstants from '../../forms/constants/connection';
import { getResourceSubType } from '../../utils/resource';
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
const getConnectionType = resource => {
  const { assistant, type } = getResourceSubType(resource);

  if (assistant) return assistant;

  return type;
};

export default function ConnectorInstallation(props) {
  const classes = useStyles();
  const { templateId } = props.match.params;
  const [connection, setSelectedConnectionId] = useState(null);
  const [stackId, setShowStackDialog] = useState(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const dispatch = useDispatch();
  const template = useSelector(state => selectors.template(state, templateId));
  const installSteps = useSelector(state =>
    selectors.templateInstallSteps(state, templateId)
  );
  const { connectionMap, createdComponents } = useSelector(state =>
    selectors.templateSetup(state, templateId)
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
      // Send the gathered information to BE to create all components
      dispatch(actions.template.createComponents(templateId));
    }
  }, [dispatch, isSetupComplete, props.history, templateId]);
  useEffect(() => {
    if (createdComponents) {
      // redirect to integration Settings
      const integration = createdComponents.find(
        c => c.model === 'Integration'
      );

      dispatch(actions.template.clearTemplate(templateId));
      dispatch(actions.resource.requestCollection('integrations'));
      dispatch(actions.resource.requestCollection('flows'));
      dispatch(actions.resource.requestCollection('connections'));
      dispatch(actions.resource.requestCollection('exports'));
      dispatch(actions.resource.requestCollection('imports'));

      if (integration) {
        props.history.push(
          `/pg/integrations/${integration._id}/settings/flows`
        );
      } else {
        props.history.push('/');
      }
    }
  }, [createdComponents, dispatch, props.history, templateId]);

  if (!installSteps) {
    return <Typography>Invalid Template</Typography>;
  }

  const handleStepClick = step => {
    const { _connectionId, installURL, type } = step;

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
          actions.template.updateStep(
            { ...step, status: 'triggered' },
            templateId
          )
        );
        openExternalUrl({ url: installURL });
      } else {
        if (step.verifying) {
          return false;
        }

        dispatch(
          actions.template.updateStep(
            { ...step, status: 'verifying' },
            templateId
          )
        );
        dispatch(
          actions.template.verifyBundleOrPackageInstall(
            step,
            { _id: step.options._connectionId },
            templateId
          )
        );
      }
      // handle Action step click
    } else if (type === 'Stack') {
      if (!stackId) setShowStackDialog(`new-${shortid.generate()}`);
    }
  };

  const handleBackClick = () => {
    props.history.goBack();
  };

  const handleSubmitComplete = (connectionId, isAuthorized) => {
    if (
      resourceConstants.OAUTH_APPLICATIONS.includes(
        getConnectionType(connection.doc)
      ) &&
      !isAuthorized
    ) {
      return;
    }

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
        <ResourceSetupDialog
          resourceId={connection.newId}
          resource={connection.doc}
          resourceType="connections"
          connectionType={connection.doc.type}
          onClose={handleConnectionClose}
          onSubmitComplete={handleSubmitComplete}
          addOrSelect
        />
      )}
      {stackId && (
        <ResourceSetupDialog
          onClose={handleStackClose}
          addOrSelect
          resourceId={stackId}
          resourceType="stacks"
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
