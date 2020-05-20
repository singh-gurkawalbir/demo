import { IconButton, makeStyles, Typography } from '@material-ui/core';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath, Route, useLocation } from 'react-router-dom';
import actions from '../../../../actions';
import Close from '../../../icons/CloseIcon';
import LoadResources from '../../../LoadResources';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import * as selectors from '../../../../reducers';
import { generateNewId, isNewId } from '../../../../utils/resource';
import ApplicationImg from '../../../icons/ApplicationImg';
import ResourceFormWithStatusPanel from '../../../ResourceFormWithStatusPanel';
import ActionsFactory from './ActionsFactory';
import useDrawerEditUrl from './useDrawerEditUrl';

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
  resourceFormWrapper: {
    padding: theme.spacing(3, 3, 1, 3),
  },
  appLogo: {
    paddingRight: theme.spacing(6),
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '14px 0px',
    margin: theme.spacing(0, 3),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    position: 'relative',
    background: theme.palette.background.paper,
  },
  titleText: {
    maxWidth: '80%',
    wordBreak: 'break-word',
  },

  closeButton: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2),
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.secondary.dark,
    },
  },
  closeIcon: {
    fontSize: 18,
  },
}));
const determineRequiredResources = type => {
  const resourceType = [];

  // Handling virtual resources types Page processor and Page generators
  if (type === 'pageProcessor') {
    resourceType.push('exports', 'imports');
  } else if (type === 'pageGenerator') {
    resourceType.push('exports');
  } else {
    resourceType.push(type);

    if (type === 'connections') {
      resourceType.push('iClients');
    }
  }

  // if its exports or imports then we need associated connections to be loaded
  if (resourceType.includes('exports') || resourceType.includes('imports'))
    return [...resourceType, 'connections'];

  return resourceType;
};

const getTitle = ({ resourceType, queryParamStr, resourceLabel, opTitle }) => {
  if (resourceType === 'pageGenerator') {
    return 'Create source';
  }

  const queryParams = new URLSearchParams(queryParamStr);
  const isConnectionFixFromImpExp =
    queryParams.get('fixConnnection') === 'true';

  if (isConnectionFixFromImpExp && resourceType === 'connections') {
    return `Fix offline connection`;
  }

  return `${opTitle} ${resourceLabel.toLowerCase()}`;
};

export default function Panel(props) {
  const { match, onClose, zIndex, occupyFullWidth, flowId } = props;
  const [newId] = useState(generateNewId());
  const { id, resourceType, operation } = match.params;
  const isNew = operation === 'add';
  const location = useLocation();
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const classes = useStyles({
    ...props,
    occupyFullWidth,
  });
  const skipFormClose = useSelector(
    state => selectors.resourceFormState(state, resourceType, id).skipClose
  );
  const newResourceId = useSelector(state =>
    selectors.createdResourceId(state, id)
  );
  const resourceLabel = useSelector(state =>
    selectors.getCustomResourceLabel(state, {
      resourceId: id,
      resourceType,
      flowId,
    })
  );
  const resource = useSelector(state =>
    selectors.resource(state, resourceType, id)
  );
  const abortAndClose = useCallback(() => {
    dispatch(actions.resourceForm.submitAborted(resourceType, id));
    onClose();
    dispatch(actions.resource.clearStaged(id));
  }, [dispatch, id, onClose, resourceType]);
  // if this form is for a page processor, we don't know if
  // the new resource is an export or import. We determine this by
  // peeking into the patch set from the first step in PP/PG creation.
  // The patch set should have a value for /adaptorType which
  // contains [*Import|*Export].
  const stagedProcessorResourceId = useSelector(state => {
    const stagedProcessor = selectors.stagedResource(state, id);
    const resourceIdPatch =
      stagedProcessor &&
      stagedProcessor.patch &&
      stagedProcessor.patch.length &&
      stagedProcessor.patch.find(
        p => p.op === 'replace' && p.path === '/resourceId'
      );
    const resourceId = resourceIdPatch ? resourceIdPatch.value : null;

    return resourceId;
  });
  const applicationType = useSelector(state => {
    const stagedResource = selectors.stagedResource(state, id);

    if (!resource && (!stagedResource || !stagedResource.patch)) {
      return '';
    }

    function getStagedValue(key) {
      const result =
        stagedResource &&
        stagedResource.patch &&
        stagedResource.patch.find(p => p.op === 'replace' && p.path === key);

      return result && result.value;
    }

    // [{}, ..., {}, {op: "replace", path: "/adaptorType", value: "HTTPExport"}, ...]
    const adaptorType =
      getStagedValue('/adaptorType') || (resource && resource.adaptorType);
    const assistant =
      getStagedValue('/assistant') || (resource && resource.assistant);

    if (adaptorType === 'WebhookExport') {
      return (
        getStagedValue('/webhook/provider') ||
        (resource && resource.webhook && resource.webhook.provider)
      );
    }

    if (adaptorType && adaptorType.startsWith('RDBMS')) {
      const connection = selectors.resource(
        state,
        'connections',
        getStagedValue('/_connectionId') || (resource && resource._connectionId)
      );

      return connection && connection.rdbms && connection.rdbms.type;
    }

    return assistant || adaptorType;
  });
  const isMultiStepSaveResource = [
    'imports',
    'exports',
    'connections',
    'pageGenerator',
    'pageProcessor',
  ].includes(resourceType);
  const submitButtonLabel = isNew && isMultiStepSaveResource ? 'Next' : 'Save';
  const editUrl = useDrawerEditUrl(resourceType, id, location.pathname);
  const handleSubmitComplete = useCallback(() => {
    if (isNew) {
      // The following block of logic is used specifically for pageProcessor
      // and pageGenerator forms. These forms allow a user to choose an
      // existing resource. In this case we dont have any more work to do,
      // we just need to match the temp 'new-xxx' id with the one the user
      // selected.

      if (resourceType === 'integrations') {
        return props.history.replace(
          `/pg/${resourceType}/${newResourceId}/flows`
        );
      }

      if (isMultiStepSaveResource) {
        if (!stagedProcessorResourceId) {
          return props.history.replace(editUrl);
        }

        // Take care of existing resource selection.
        enqueueSnackbar({
          message: `${resourceLabel} added`,
          variant: 'success',
        });
      }
      // this is NOT a case where a user selected an existing resource,
      // so move to step 2 of the form...

      dispatch(actions.resource.created(stagedProcessorResourceId, id));
      onClose();
    } else {
      // For web hook generate URL case
      // Form should re render with created new Id
      // Below code just replaces url with created Id and form re initializes
      if (skipFormClose) {
        props.history.replace(
          generatePath(match.path, {
            id: newResourceId || id,
            resourceType,
            operation,
          })
        );

        return;
      }

      if (newResourceId)
        enqueueSnackbar({
          message: `${resourceLabel} created`,
          variant: 'success',
        });
      onClose();
    }
  }, [
    dispatch,
    editUrl,
    enqueueSnackbar,
    id,
    isMultiStepSaveResource,
    isNew,
    match.path,
    newResourceId,
    onClose,
    operation,
    props.history,
    resourceLabel,
    resourceType,
    skipFormClose,
    stagedProcessorResourceId,
  ]);
  const showApplicationLogo =
    flowId &&
    ['exports', 'imports'].includes(resourceType) &&
    !!applicationType;
  const requiredResources = useMemo(
    () => determineRequiredResources(resourceType),
    [resourceType]
  );
  const title = useMemo(
    () =>
      getTitle({
        resourceType,
        queryParamStr: location.search,
        resourceLabel,
        opTitle: isNewId(id) ? 'Create' : 'Edit',
      }),
    [id, location.search, resourceLabel, resourceType]
  );

  return (
    <Fragment>
      <div className={classes.root}>
        <div className={classes.title}>
          <Typography variant="h3" className={classes.titleText}>
            {title}
          </Typography>
          {showApplicationLogo && (
            <ApplicationImg
              className={classes.appLogo}
              size="small"
              type={applicationType}
              alt={applicationType || 'Application image'}
            />
          )}
          <IconButton
            data-test="closeFlowSchedule"
            aria-label="Close"
            className={classes.closeButton}
            onClick={onClose}>
            <Close className={classes.closeIcon} />
          </IconButton>
        </div>
        <LoadResources required resources={requiredResources}>
          <ResourceFormWithStatusPanel
            className={classes.resourceFormWrapper}
            isNew={isNew}
            formKey={newId}
            resourceType={resourceType}
            resourceId={id}
            flowId={flowId}
            // TODO: push this to directly to the button
            submitButtonLabel={submitButtonLabel}
            onSubmitComplete={handleSubmitComplete}
          />
          <ActionsFactory
            formKey={newId}
            isNew={isNew}
            resourceType={resourceType}
            resourceId={id}
            flowId={flowId}
            // TODO: push this to directly to the button
            submitButtonLabel={submitButtonLabel}
            onCancel={abortAndClose}
          />
        </LoadResources>
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
