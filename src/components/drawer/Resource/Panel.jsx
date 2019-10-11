import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { makeStyles, Typography } from '@material-ui/core';
import LoadResources from '../../../components/LoadResources';
import ResourceForm from '../../../components/ResourceFormFactory';
import { MODEL_PLURAL_TO_LABEL } from '../../../utils/resource';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import * as selectors from '../../../reducers';

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: props => props.zIndex,
    border: 'solid 1px',
    borderColor: 'rgb(0,0,0,0.2)',
    borderLeft: 0,
    height: '100vh',
    width: props => (props.match.isExact ? 450 : 150),
    overflowX: 'hidden',
    overflowY: props => (props.match.isExact ? 'auto' : 'hidden'),
    padding: theme.spacing(2, 0, 0, 0),
    boxShadow: `-5px 0 8px rgba(0,0,0,0.2)`,
  },
  form: {
    height: `calc(100vh - 136px)`,
    width: props => (props.match.isExact ? undefined : 400),
    maxHeight: 'unset',
    marginTop: theme.spacing(1),
  },
  title: {
    padding: theme.spacing(0, 0, 0, 3),
  },
}));

export default function Panel(props) {
  const { match, location, onClose, zIndex } = props;
  const { id, resourceType, operation } = match.params;
  const isNew = operation === 'add';
  const classes = useStyles(props);
  const [enqueueSnackbar] = useEnqueueSnackbar();
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
  const resourceLabel =
    resourceType === 'pageProcessor'
      ? 'Page Processor'
      : MODEL_PLURAL_TO_LABEL[resourceType];

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

    if (resourceType === 'pageProcessor') {
      segments[length - 2] = lookupProcessorResourceType();
    }

    const url = segments.join('/');

    return url;
  }

  function handleSubmitComplete() {
    if (isNew) {
      props.history.replace(getEditUrl(id));
    } else {
      if (newResourceId)
        enqueueSnackbar({
          message: `${resourceLabel} created`,
          variant: 'success',
        });
      else {
        enqueueSnackbar({
          message: `${resourceLabel} edited`,
          variant: 'info',
        });
      }

      onClose();
    }
  }

  const submitButtonLabel =
    isNew &&
    ['imports', 'exports', 'connections', 'pageProcessor'].includes(
      resourceType
    )
      ? 'Next'
      : 'Save';
  const resourceTypeToLoad =
    resourceType === 'pageProcessor' ? 'exports,imports' : resourceType;

  return (
    <Fragment>
      <div className={classes.root}>
        <Typography variant="h5" className={classes.title}>
          {isNew ? `Create` : 'Edit'} {resourceLabel}
        </Typography>
        <LoadResources required resources={resourceTypeToLoad}>
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
