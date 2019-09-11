import { useEffect, Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import SvgIcon from '@material-ui/core/SvgIcon';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
// import produce from 'immer';
import * as selectors from '../../reducers';
import actions from '../../actions';
import ResourceForm from '../../components/ResourceFormFactory';
import LoadResources from '../../components/LoadResources';
import openExternalUrl from '../../utils/window';

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
  step: {
    position: 'relative',
    height: '50px',
    padding: '25px 40px 25px 0',
    display: 'inline-flex',
  },
  stepNumber: {
    background: '#eee',
    fontSize: '22px',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    textAlign: 'center',
    lineHeight: '40px',
    marginTop: '-10px',
  },
  floatRight: {
    float: 'right',
  },
  stepText: {
    display: 'inline-flex',
  },
  successText: {
    paddingRight: '15px',
    color: '#4CBB02',
  },
  stepRow: {
    borderBottom: '1px solid #e5e5e5',
    marginTop: '10px',
    marginBottom: '10px',
  },
  iconButton: {
    position: 'absolute',
    top: '5px',
    right: '10px',
  },
}));
const ConnectionModal = props => {
  const { _connectionId, onSubmitComplete, handleClose } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', _connectionId)
  );

  useEffect(() => {
    if (!connection) {
      dispatch(actions.resource.requestCollection('connections'));
    }
  }, [connection, dispatch]);

  if (!connection) {
    return null;
  }

  return (
    <Dialog open maxWidth={false}>
      <DialogTitle>
        Setup Connection
        {handleClose && (
          <IconButton
            onClick={handleClose}
            className={classes.iconButton}
            autoFocus>
            <SvgIcon>
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
            </SvgIcon>
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent style={{ width: '60vw' }}>
        <ResourceForm
          editMode
          resourceType="connections"
          resourceId={_connectionId}
          onSubmitComplete={onSubmitComplete}
          connectionType={connection.type}
        />
      </DialogContent>
    </Dialog>
  );
};

const InstallationStep = props => {
  const classes = useStyles();
  const { step, index, handleStepClick } = props;

  if (!step) {
    return null;
  }

  const onStepClick = e => {
    e.preventDefault();
    handleStepClick(step);
  };

  const getStepText = step => {
    let stepText = '';

    if (step._connectionId) {
      if (step.completed) {
        stepText = 'Configured';
      } else if (step.__isTriggered) {
        stepText = 'Configuring...';
      } else {
        stepText = 'Click to Configure';
      }
    } else if (step.installURL) {
      if (step.completed) {
        stepText = 'Installed';
      } else if (step.__isTriggered) {
        if (step.__verifying) {
          stepText = 'Verifying...';
        } else {
          stepText = 'Verify Now';
        }
      } else {
        stepText = 'Click to Install';
      }
    } else if (step.completed) {
      stepText = 'Configured';
    } else if (step.__isTriggered) {
      stepText = 'Installing...';
    } else {
      stepText = 'Click to Install';
    }

    return stepText;
  };

  return (
    <Grid item xs={12} className={classes.stepRow}>
      <Grid container spacing={2}>
        <Grid item xs={1} className={classes.step}>
          <Typography variant="h4" className={classes.stepNumber}>
            {index}
          </Typography>
        </Grid>
        <Grid item xs={3} className={classes.step}>
          <Typography>{step.name}</Typography>
        </Grid>
        <Grid item xs className={classes.step}>
          <Typography>{step.description}</Typography>
        </Grid>
        <Grid item xs={2} className={classes.step}>
          <img
            alt=""
            src={
              process.env.CDN_BASE_URI +
              step.imageURL.replace(/^\/images\//, '')
            }
          />
        </Grid>
        <Grid item xs={2} className={classes.step}>
          {!step.completed && (
            <Button
              href="/"
              disabled={!step.isCurrentStep}
              onClick={onStepClick}
              underline="none"
              variant="text">
              {getStepText(step)}
            </Button>
          )}
          {step.completed && (
            <Fragment>
              <Typography onClick={onStepClick} className={classes.successText}>
                {getStepText(step)}
              </Typography>
              <img
                alt=""
                src={`${process.env.CDN_BASE_URI}icons/success.png`}
              />
            </Fragment>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

// function reducer(state, action) {
//   const { type, dispatch, integrationId, setShowConnectionDialog } = action;

//   return produce(state, d => {
//     const draft = d;
//     const currentStep = draft.find(d => d.isCurrentStep);

//     // eslint-disable-next-line default-case
//     switch (type) {
//       case 'currentStep':
//         draft.find(d => !d.completed).isCurrentStep = true;
//         break;
//       case 'markTriggered':
//         (currentStep || {}).__isTriggered = true;
//         break;
//       case 'markDone':
//         dispatch(
//           actions.integrationApps.installer.stepInstall(
//             integrationId,
//             currentStep.installerFunction
//           )
//         );
//         (currentStep || {}).isCurrentStep = false;
//         setShowConnectionDialog(false);
//         break;
//     }
//   });
// }

export default function ConnectorInstallation(props) {
  const classes = useStyles();
  const { integrationId } = props.match.params;
  const [selectedConnectionId, setSelectedConnectionId] = useState(null);
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const dispatch = useDispatch();
  const installSteps = useSelector(state =>
    selectors.integrationInstallSteps(state, integrationId)
  );

  // const installationSteps = (integration || {}).install || [];
  // const [installSteps, dispatchLocalAction] = useReducer(
  //   reducer,
  //   installationSteps
  // );

  useEffect(() => {
    const setupIncomplete = installSteps.reduce(
      (result, step) => result || !step.completed,
      false
    );

    if (!setupIncomplete) {
      setIsSetupComplete(true);
    }
  }, [installSteps]);

  if (isSetupComplete) {
    // redirect to integration Settings
    props.history.push(`/pg/integrations/${integrationId}/settings/flows`);
  }

  // if (
  //   !installSteps.find(s => s.isCurrentStep) &&
  //   installSteps.find(s => !s.completed)
  // ) {
  //   dispatchLocalAction({ type: 'currentStep' });
  // }

  // useEffect(() => {
  //   dispatch(actions.resource.requestCollection('integrations'));
  // }, [dispatch]);

  if (!installSteps) {
    return <Typography>No Integration Found</Typography>;
  }

  const handleStepClick = step => {
    const { _connectionId, installURL, installerFunction } = step;

    if (_connectionId) {
      setSelectedConnectionId(_connectionId);
      // dispatchLocalAction({ type: 'markTriggered' });
      setShowConnectionDialog(true);
    } else if (installURL) {
      openExternalUrl({ url: installURL });
      dispatch(
        actions.integrationApps.installer.stepInstallClick(
          integrationId,
          installerFunction
        )
      );
    } else {
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
    // dispatchLocalAction({
    //   type: 'markDone',
    //   _connectionId: selectedConnectionId,
    //   integrationId,
    //   setShowConnectionDialog,
    //   dispatch,
    // });
    const step = installSteps.find(s => s.isCurrentStep);

    dispatch(
      actions.integrationApps.installer.stepInstallClick(
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
        <ConnectionModal
          type="netsuite"
          _connectionId={selectedConnectionId}
          handleClose={handleClose}
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
              <Typography variant="h6">Amazon - NetSuite Connector</Typography>
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
