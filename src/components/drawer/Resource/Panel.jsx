import { Fragment, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, useLocation } from 'react-router-dom';
import { makeStyles, Typography, IconButton } from '@material-ui/core';
import LoadResources from '../../../components/LoadResources';
import ResourceForm from '../../../components/ResourceFormFactory';
import { MODEL_PLURAL_TO_LABEL } from '../../../utils/resource';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import Close from '../../../components/icons/CloseIcon';

// Just a temporary variable to increase width
// TODO @Raghu: Discuss with Azhar and do this UI Fix
const useStyles = makeStyles((theme, containerWidth) => ({
  root: {
    zIndex: props => props.zIndex,
    border: 'solid 1px',
    borderColor: 'rgb(0,0,0,0.2)',
    borderLeft: 0,
    height: '100vh',
    width: props => (props.match.isExact ? containerWidth : 150),
    overflowX: 'hidden',
    overflowY: props => (props.match.isExact ? 'auto' : 'hidden'),
    boxShadow: `-5px 0 8px rgba(0,0,0,0.2)`,
    backgroundColor: theme.palette.background.default,
  },
  form: {
    height: `calc(100vh - 136px)`,
    width: props => (props.match.isExact ? undefined : containerWidth),
    maxHeight: 'unset',
    padding: '14px 24px',
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '14px 24px',
    background: theme.palette.background.paper,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: 5,
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

export default function Panel(props) {
  const { match, onClose, zIndex } = props;
  const { id, resourceType, operation } = match.params;
  const isNew = operation === 'add';
  const location = useLocation();
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const formState = useSelector(state =>
    selectors.resourceFormState(state, resourceType, id)
  );
  const newResourceId = useSelector(state =>
    selectors.createdResourceId(state, id)
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
  const stagedProcessor = useSelector(state =>
    selectors.stagedResource(state, id)
  );
  let resourceLabel;

  if (resourceType === 'pageProcessor') {
    resourceLabel = 'Page Processor';
  } else if (resourceType === 'pageGenerator') {
    resourceLabel = 'Page Generator';
  } else {
    resourceLabel = MODEL_PLURAL_TO_LABEL[resourceType];
  }

  const isMultiStepSaveResource = [
    'imports',
    'exports',
    'connections',
    'pageGenerator',
    'pageProcessor',
  ].includes(resourceType);
  const submitButtonLabel = isNew && isMultiStepSaveResource ? 'Next' : 'Save';

  function lookupProcessorResourceType() {
    if (!stagedProcessor || !stagedProcessor.patch) {
      // TODO: we need a better pattern for logging warnings. We need a common util method
      // which logs these warning only if the build is dev... if build is prod, these
      // console.warn/logs should not even be bundled by webpack...
      // eslint-disable-next-line
      return console.warn(
        'No patch-set available to determine new Page Processor resourceType.'
      );
    }

    // [{}, ..., {}, {op: "replace", path: "/adaptorType", value: "HTTPExport"}, ...]
    const adaptorType = stagedProcessor.patch.find(
      p => p.op === 'replace' && p.path === '/adaptorType'
    );

    // console.log(`adaptorType-${id}`, adaptorType);

    if (!adaptorType || !adaptorType.value) {
      // eslint-disable-next-line
      console.warn(
        'No replace operation against /adaptorType found in the patch-set.'
      );
    }

    return adaptorType.value.includes('Export') ? 'exports' : 'imports';
  }

  const isPreviewPanelAvailableForResource = useSelector(state => {
    // Incase of a new resource first step for flows , resourceType would be pg/pp in which case we don't show previewPanel
    if (['pageGenerator', 'pageProcessor'].includes(resourceType)) return false;

    // Returns a bool whether the resource has a preview panel or not
    return selectors.isPreviewPanelAvailableForResource(
      state,
      id,
      resourceType
    );
  });
  // Altering drawer style based on the resource type and whether it has preview panel or not
  // TODO : @Azhar Make the drawer with preview panel to occupy whole screen collapsing left panel
  const classes = useStyles(
    props,
    isPreviewPanelAvailableForResource ? 1200 : 660
  );

  function getEditUrl(id) {
    // console.log(location);
    const segments = location.pathname.split('/');
    const { length } = segments;

    segments[length - 1] = id;
    segments[length - 3] = 'edit';

    if (resourceType === 'pageGenerator') {
      segments[length - 2] = 'exports';
    } else if (resourceType === 'pageProcessor') {
      segments[length - 2] = lookupProcessorResourceType();
    }

    const url = segments.join('/');

    return url;
  }

  function handleSubmitComplete() {
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

      const resourceIdPatch = stagedProcessor.patch.find(
        p => p.op === 'replace' && p.path === '/resourceId'
      );
      const resourceId = resourceIdPatch ? resourceIdPatch.value : null;

      if (isMultiStepSaveResource) {
        if (!resourceId) {
          return props.history.replace(getEditUrl(id));
        }

        // Take care of existing resource selection.
        enqueueSnackbar({
          message: `${resourceLabel} added`,
          variant: 'success',
        });
      }
      // this is NOT a case where a user selected an existing resource,
      // so move to step 2 of the form...

      dispatch(actions.resource.created(resourceId, id));
      onClose();
    } else {
      // For webhook generate URL case
      if (formState.skipClose) {
        props.history.replace(
          `/pg/${resourceType}/edit/${resourceType}/${newResourceId || id}`
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
  }

  const requiredResources = determineRequiredResources(resourceType);

  return (
    <Fragment>
      <div className={classes.root}>
        <div className={classes.title}>
          <Typography variant="h3">
            {isNew ? `Create` : 'Edit'} {resourceLabel}
          </Typography>
          <IconButton
            data-test="closeFlowSchedule"
            aria-label="Close"
            className={classes.closeButton}
            onClick={onClose}>
            <Close />
          </IconButton>
        </div>
        <LoadResources required resources={requiredResources}>
          <ResourceForm
            className={classes.form}
            variant={match.isExact ? 'edit' : 'view'}
            isNew={isNew}
            resourceType={resourceType}
            resourceId={id}
            cancelButtonLabel="Cancel"
            submitButtonLabel={submitButtonLabel}
            onSubmitComplete={handleSubmitComplete}
            onCancel={abortAndClose}
            {...props}
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
