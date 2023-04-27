import React, { useCallback, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactResizeDetector from 'react-resize-detector';
import { Route } from 'react-router-dom';
import { Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import LoadSuiteScriptResources from '../../LoadResources';
import {ResourceFormFactory} from '../../ResourceFormFactory';
import actions from '../../../../actions';
import ConnectionStatusPanel from '../../ConnectionStatusPanel';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';
import { selectors } from '../../../../reducers';
import { useRedirectToParentRoute } from '../../../drawer/Resource/Panel';
import SuiteScriptActionsPanel from '../../ResourceFormFactory/SuiteScriptActionsPanel';
import EditorDrawer from '../../../AFE/Drawer';
import CloseButton from '../../../drawer/Resource/Panel/CloseButton';
import { getAsyncKey } from '../../../../utils/saveAndCloseButtons';

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
    // overflowY: props => (props.match.isExact ? 'auto' : 'hidden'),
    boxShadow: '-5px 0 8px rgba(0,0,0,0.2)',
  },
  formContainer: {
    padding: theme.spacing(3),
    paddingTop: props => (props.notificationPanelHeight ? 0 : theme.spacing(3)),
    borderColor: 'rgb(0,0,0,0.1)',
    borderStyle: 'solid',
    borderWidth: '1px 0 0 0',
    overflowY: 'auto',
  },
  form: {
    height: props => `calc(100vh - 172px - ${props.notificationPanelHeight}px)`,
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
    wordBreak: 'break-word',
    position: 'relative',
    '& > h3': {
      paddingRight: theme.spacing(1),
    },
  },
}));
const useSuiteScriptFormRedirectionToParentRoute = (ssLinkedConnectionId, resourceType, id) => {
  const initFailed = useSelector(state => selectors.suiteScriptResourceFormState(state, {
    resourceType,
    resourceId: id,
    ssLinkedConnectionId,
  })?.initFailed);

  useRedirectToParentRoute(initFailed);
};

export default function Panel(props) {
  const {
    match,
    onClose,
    zIndex,
    occupyFullWidth,
    flowId,
    integrationId,
    ssLinkedConnectionId,
  } = props;
  const { resourceType, operation } = match.params;
  let { id } = match.params;
  const formKey = getAsyncKey(resourceType, id);

  if (['exports', 'imports'].includes(resourceType)) {
    if (!id) {
      id = flowId;
    }
  }
  useSuiteScriptFormRedirectionToParentRoute(ssLinkedConnectionId, resourceType, id);
  const isNew = operation === 'add';
  const dispatch = useDispatch();
  const [notificationPanelHeight, setNotificationPanelHeight] = useState(0);
  const classes = useStyles({
    ...props,
    occupyFullWidth,
    notificationPanelHeight,
  });
  const skipFormClose = useSelector(
    state => selectors.suiteScriptResourceFormState(state, {resourceType, resourceId: id, ssLinkedConnectionId, integrationId}).skipClose
  );
  const handleSubmitComplete = useCallback(() => {
    if (!skipFormClose) {
      onClose();
    }
  }, [onClose, skipFormClose]);
  const abortAndClose = useCallback(() => {
    dispatch(actions.suiteScript.resourceForm.submitAborted(ssLinkedConnectionId, integrationId, resourceType, id));
    onClose();
    dispatch(actions.suiteScript.resource.clearStaged(ssLinkedConnectionId, resourceType, id));
  }, [dispatch, id, integrationId, onClose, resourceType, ssLinkedConnectionId]);
  const submitButtonLabel = 'Save & close';
  const requiredResources = ['tiles', 'connections', 'flows'];
  const resize = (width, height) => {
    setNotificationPanelHeight(height);
  };
  const isViewMode = useSelector(state => !selectors.userHasManageAccessOnSuiteScriptAccount(state, ssLinkedConnectionId));
  const allProps = useMemo(() => ({
    className: classes.form,
    variant: match.isExact ? 'edit' : 'view',
    isNew,
    resourceType,
    resourceId: id,
    cancelButtonLabel: 'Cancel',
    submitButtonLabel,
    submitButtonColor: 'secondary',
    onSubmitComplete: handleSubmitComplete,
    onCancel: abortAndClose,
    ...props,
    disabled: isViewMode,
    formKey,
  }), [abortAndClose, classes.form, formKey, handleSubmitComplete, id, isNew, isViewMode, match.isExact, props, resourceType]);

  return (
    <>
      <div className={classes.root}>
        <div className={classes.title}>
          <Typography variant="h3">{`Edit ${MODEL_PLURAL_TO_LABEL[resourceType].toLowerCase()}`}</Typography>
          <CloseButton formKey={formKey} />
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
            <ResourceFormFactory
              {...allProps}
            />
          </div>
          <SuiteScriptActionsPanel {...allProps} />
        </LoadSuiteScriptResources>
      </div>
      <Route
        path={`${match.url}/:operation(add|edit)/:resourceType/:id`}
        render={props => (
          <Panel {...props} zIndex={zIndex + 1} onClose={onClose} />
        )}
      />
      <EditorDrawer />
    </>
  );
}
