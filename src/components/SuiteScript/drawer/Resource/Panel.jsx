import { Fragment, useCallback, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactResizeDetector from 'react-resize-detector';
import { Route, useLocation, generatePath } from 'react-router-dom';
import { makeStyles, Typography, IconButton } from '@material-ui/core';
import LoadSuiteScriptResources from '../../LoadResources';
import ResourceForm from '../../ResourceFormFactory';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Close from '../../../../components/icons/CloseIcon';
import ApplicationImg from '../../../icons/ApplicationImg';
import ConnectionStatusPanel from '../../ConnectionStatusPanel';

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: props => props.zIndex,
    border: 'solid 1px',
    borderColor: 'rgb(0,0,0,0.2)',
    borderLeft: 0,
    height: '100vh',
    width: props => {
      if (props.occupyFullWidth) return '100%';

      return props.match.isExact ? 660 : 150;
    },
    overflowX: 'hidden',
    overflowY: props => (props.match.isExact ? 'auto' : 'hidden'),
    boxShadow: `-5px 0 8px rgba(0,0,0,0.2)`,
  },
  formContainer: {
    padding: theme.spacing(3),
    paddingTop: props => (props.notificationPanelHeight ? 0 : theme.spacing(3)),
    borderColor: 'rgb(0,0,0,0.1)',
    borderStyle: 'solid',
    borderWidth: '1px 0 0 0',
  },
  form: {
    height: props => `calc(100vh - 136px - ${props.notificationPanelHeight}px)`,
    width: props => {
      if (props.occupyFullWidth) return '100%';

      return props.match.isExact ? '100%' : 660;
    },
    maxHeight: 'unset',
    padding: 0,
  },
  appLogo: {
    paddingRight: '25px',
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '14px 24px',
    background: theme.palette.background.paper,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2),
    padding: 0,
  },
}));

export default function Panel(props) {
  const {
    match,
    onClose,
    zIndex,
    occupyFullWidth,
    flowId,
    integrationId,
    ssLinkedConnectionId,
    flowType,
  } = props;
  const { resourceType, operation } = match.params;
  let { id } = match.params;

  if (['exports', 'imports'].includes(resourceType)) {
    if (!id) {
      id = flowId;
    }
  }

  console.log(`ss Panel match.params ${JSON.stringify(match.params)}`);
  console.log(`ss Panel props ${JSON.stringify(props)}`);

  const isNew = operation === 'add';
  const location = useLocation();
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const [notificationPanelHeight, setNotificationPanelHeight] = useState(0);
  const classes = useStyles({
    ...props,
    occupyFullWidth,
    notificationPanelHeight,
  });
  const formState = useSelector(state =>
    selectors.suiteScriptResourceFormState(state, {
      resourceType,
      resourceId: id,
      ssLinkedConnectionId,
      integrationId,
      flowType,
    })
  );
  const abortAndClose = useCallback(() => {
    dispatch(actions.resourceForm.submitAborted(resourceType, id));
    onClose();
    dispatch(actions.resource.clearStaged(id));
  }, [dispatch, id, onClose, resourceType]);
  const submitButtonLabel = 'Save';
  const requiredResources = []; // determineRequiredResources(resourceType);
  const resize = (width, height) => {
    setNotificationPanelHeight(height);
  };

  return (
    <Fragment>
      <div className={classes.root}>
        <div className={classes.title}>
          <Typography variant="h3">{`Edit ${resourceType}`}</Typography>
          <IconButton
            data-test="closeFlowSchedule"
            aria-label="Close"
            className={classes.closeButton}
            onClick={onClose}>
            <Close />
          </IconButton>
        </div>
        <LoadSuiteScriptResources
          required
          ssLinkedConnectionId={ssLinkedConnectionId}
          integrationId={integrationId}
          resources={requiredResources}>
          <div className={classes.formContainer}>
            <div>
              {['exports', 'imports', 'connections'].includes(resourceType) && (
                <ConnectionStatusPanel
                  resourceType={resourceType}
                  resourceId={id}
                  ssLinkedConnectionId={ssLinkedConnectionId}
                />
              )}
              <ReactResizeDetector handleHeight onResize={resize} />
            </div>
            <ResourceForm
              className={classes.form}
              variant={match.isExact ? 'edit' : 'view'}
              isNew={isNew}
              resourceType={resourceType}
              resourceId={id}
              cancelButtonLabel="Cancel"
              submitButtonLabel={submitButtonLabel}
              // onSubmitComplete={handleSubmitComplete}
              onCancel={abortAndClose}
              {...props}
            />
          </div>
        </LoadSuiteScriptResources>
      </div>

      <Route
        path={`${match.url}/:operation(add|edit)/:resourceType/:id`}
        render={props => (
          <Panel {...props} zIndex={zIndex + 1} onClose={onClose} />
        )}
      />
    </Fragment>
  );
}
