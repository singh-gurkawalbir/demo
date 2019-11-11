import { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { makeStyles, Typography, IconButton } from '@material-ui/core';
import LoadResources from '../../../components/LoadResources';
import ResourceForm from '../../../components/ResourceFormFactory';
import { MODEL_PLURAL_TO_LABEL } from '../../../utils/resource';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import Close from '../../../components/icons/CloseIcon';

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: props => props.zIndex,
    border: 'solid 1px',
    borderColor: 'rgb(0,0,0,0.2)',
    borderLeft: 0,
    height: '100vh',
    width: props => (props.match.isExact ? 660 : 150),
    overflowX: 'hidden',
    overflowY: props => (props.match.isExact ? 'auto' : 'hidden'),
    boxShadow: `-5px 0 8px rgba(0,0,0,0.2)`,
    backgroundColor: theme.palette.background.default,
  },
  form: {
    height: `calc(100vh - 136px)`,
    width: props => (props.match.isExact ? undefined : 660),
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

export default function Panel(props) {
  const { match, location, onClose, zIndex } = props;
  const { id, resourceType, operation } = match.params;
  const isNew = operation === 'add';
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const formState = useSelector(state =>
    selectors.resourceFormState(state, resourceType, id)
  );
  const newResourceId = useSelector(state =>
    selectors.createdResourceId(state, id)
  );
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
      const resourceIdPatch = stagedProcessor.patch.find(
        p => p.op === 'replace' && p.path === '/resourceId'
      );
      const resourceId = resourceIdPatch ? resourceIdPatch.value : null;

      // this is NOT a case where a user selected an existing resource,
      // so move to step 2 of the form...
      if (!resourceId) {
        return props.history.replace(getEditUrl(id));
      }

      // Take care of existing resource selection.
      enqueueSnackbar({
        message: `${resourceLabel} added`,
        variant: 'success',
      });

      dispatch(actions.resource.created(resourceId, id));
      onClose();
    } else {
      if (formState.skipClose) {
        props.history.replace(
          `/pg/${resourceType}/edit/${resourceType}/${newResourceId}`
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

  const submitButtonLabel =
    isNew &&
    [
      'imports',
      'exports',
      'connections',
      'pageGenerator',
      'pageProcessor',
    ].includes(resourceType)
      ? 'Next'
      : 'Save';

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
        <LoadResources required resources="exports,imports">
          <ResourceForm
            className={classes.form}
            variant={match.isExact ? 'edit' : 'view'}
            isNew={isNew}
            resourceType={resourceType}
            resourceId={id}
            cancelButtonLabel="Cancel"
            submitButtonLabel={submitButtonLabel}
            onSubmitComplete={handleSubmitComplete}
            onCancel={onClose}
            {...props}
          />
        </LoadResources>
      </div>

      <Route
        path={`${match.url}/:operation/:resourceType/:id`}
        render={props => (
          <Panel {...props} zIndex={zIndex + 1} onClose={onClose} />
        )}
      />
    </Fragment>
  );
}
