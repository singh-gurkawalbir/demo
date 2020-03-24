import qs from 'qs';
import { Fragment, useCallback, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactResizeDetector from 'react-resize-detector';
import { Route, useLocation, generatePath } from 'react-router-dom';
import { makeStyles, Typography, IconButton } from '@material-ui/core';
import LoadResources from '../../../components/LoadResources';
import ResourceForm from '../../../components/ResourceFormFactory';
import { isNewId } from '../../../utils/resource';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import Close from '../../../components/icons/CloseIcon';
import ApplicationImg from '../../icons/ApplicationImg';
import OfflineConnectionNotification from '../../OfflineConnectionNotification';
import ConnectionNotification from '../../ConnectionNotification';

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
    paddingTop: 0,
    borderColor: 'rgb(0,0,0,0.1)',
    borderStyle: 'solid',
    borderWidth: '1px 0 0 0',
  },
  form: {
    height: `calc(100vh - 136px)`,
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
  const { match, onClose, zIndex, occupyFullWidth, flowId } = props;
  const { id, resourceType, operation } = match.params;
  const isNew = operation === 'add';
  const classes = useStyles({ ...props, occupyFullWidth });
  const location = useLocation();
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const resForm = useRef(null);
  const [resourceFormStyle, setResourceFormStyle] = useState({
    height: `calc(100vh - 136px)`,
    paddingTop: 24,
  });
  const formState = useSelector(state =>
    selectors.resourceFormState(state, resourceType, id)
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
  const applicationType = useSelector(state => {
    const stagedResource = selectors.stagedResource(state, id);

    if (!stagedResource || !stagedResource.patch) {
      return '';
    }

    function getStagedValue(key) {
      const result = stagedResource.patch.find(
        p => p.op === 'replace' && p.path === key
      );

      return result && result.value;
    }

    // [{}, ..., {}, {op: "replace", path: "/adaptorType", value: "HTTPExport"}, ...]
    const adaptorType = getStagedValue('/adaptorType');
    const assistant = getStagedValue('/assistant');

    if (adaptorType === 'WebhookExport') {
      return getStagedValue('/webhook/provider');
    }

    if (adaptorType && adaptorType.startsWith('RDBMS')) {
      const connection = selectors.resource(
        state,
        'connections',
        getStagedValue('/_connectionId')
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
      // For web hook generate URL case
      // Form should re render with created new Id
      // Below code just replaces url with created Id and form re initializes
      if (formState.skipClose) {
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
  }

  const showApplicationLogo =
    flowId &&
    ['exports', 'imports'].includes(resourceType) &&
    !!applicationType;
  const requiredResources = determineRequiredResources(resourceType);
  const queryParams = qs.parse(props.history.location.search, {
    delimiter: /[?&]/,
    depth: 0,
  });
  const isConnectionFixFromImpExp = !!(
    queryParams && queryParams.fixConnnection === 'true'
  );
  let title = '';

  if (isConnectionFixFromImpExp && resourceType === 'connections') {
    title = `Fix offline connection`;
  } else {
    title = `${isNewId(id) ? `Create` : 'Edit'} ${resourceLabel.toLowerCase()}`;
  }

  if (resourceType === 'pageGenerator') {
    title = 'Create source';
  }

  const resize = useCallback((width, height) => {
    setResourceFormStyle({
      height: `calc(100vh - 136px - ${height}px)`,
      paddingTop: height ? 0 : 24,
    });
  }, []);

  return (
    <Fragment>
      <div className={classes.root}>
        <div className={classes.title}>
          <Typography variant="h3">{title}</Typography>
          {showApplicationLogo && (
            <ApplicationImg
              className={classes.appLogo}
              size="small"
              type={applicationType}
            />
          )}
          <IconButton
            data-test="closeFlowSchedule"
            aria-label="Close"
            className={classes.closeButton}
            onClick={onClose}>
            <Close />
          </IconButton>
        </div>
        <LoadResources required resources={requiredResources}>
          <div className={classes.formContainer}>
            <div>
              {(resourceType === 'exports' || resourceType === 'imports') && (
                <OfflineConnectionNotification
                  resourceType={resourceType}
                  resourceId={id}
                />
              )}
              {resourceType === 'connections' && (
                <ConnectionNotification connectionId={id} />
              )}
              <ReactResizeDetector handleWidth handleHeight onResize={resize} />
            </div>
            <ResourceForm
              style={resourceFormStyle}
              ref={resForm}
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
          </div>
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
