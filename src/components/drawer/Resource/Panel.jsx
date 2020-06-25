import React, { useCallback, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import {
  Route,
  useLocation,
  generatePath,
  useHistory,
  matchPath,
  useRouteMatch
} from 'react-router-dom';
import { makeStyles, Typography, IconButton } from '@material-ui/core';
import LoadResources from '../../LoadResources';
import { isNewId, multiStepSaveResourceTypes } from '../../../utils/resource';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import Close from '../../icons/CloseIcon';
import Back from '../../icons/BackArrowIcon';
import ApplicationImg from '../../icons/ApplicationImg';
import ResourceFormWithStatusPanel from '../../ResourceFormWithStatusPanel';

const DRAWER_PATH = '/:operation(add|edit)/:resourceType/:id';
const isNestedDrawer = (url) => !!matchPath(url, {
  path: `/**${DRAWER_PATH}${DRAWER_PATH}`,
  exact: true,
  strict: false});
const useStyles = makeStyles(theme => ({
  root: {
    zIndex: props => props.zIndex,
    border: 'solid 1px',
    borderColor: 'rgb(0,0,0,0.2)',
    borderLeft: 0,
    height: '100vh',
    width: props => {
      if (props.occupyFullWidth) return '100%';

      return props.match.isExact ? 824 : 0;
    },
    overflowX: 'hidden',
    overflowY: props => (props.match.isExact ? 'auto' : 'hidden'),
    boxShadow: '-5px 0 8px rgba(0,0,0,0.2)',
  },
  resourceFormWrapper: {
    padding: theme.spacing(3, 3, 0, 3),
  },
  appLogo: {
    paddingRight: theme.spacing(2),
    marginTop: theme.spacing(-0.5),
    marginRight: theme.spacing(4),
    borderRight: `1px solid ${theme.palette.secondary.lightest}`,

  },
  title: {
    display: 'flex',
    padding: theme.spacing(2, 3),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    position: 'relative',
    background: theme.palette.background.default,
  },
  titleText: {
    wordBreak: 'break-word',
    paddingRight: theme.spacing(2),
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

  backButton: {
    marginRight: theme.spacing(1),
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.secondary.dark,
    },
  },

  nestedDrawerTitleText: {
    maxWidth: '90%',
  },
  titleImgBlock: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
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
  if (resourceType.includes('exports') || resourceType.includes('imports')) return [...resourceType, 'connections'];

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
    return 'Fix offline connection';
  }
  if (resourceType === 'accesstokens') {
    return `${opTitle} ${resourceLabel}`;
  }

  return `${opTitle} ${resourceLabel.toLowerCase()}`;
};

const useRedirectionToParentRoute = (resourceType, id) => {
  const history = useHistory();
  const match = useRouteMatch();
  const { initFailed } = useSelector(state =>
    selectors.resourceFormState(state, resourceType, id)
  );

  useEffect(() => {
    if (initFailed) {
      // remove the last 3 segments from the route ...
      // /:operation(add|edit)/:resourceType/:id
      const stripedRoute = match.url
        .split('/')
        .slice(0, -3)
        .join('/');

      history.replace(stripedRoute);
    }
  }, [history, initFailed, match.url]);
};

export default function Panel(props) {
  const { match, onClose, zIndex, occupyFullWidth, flowId } = props;
  const { id, resourceType, operation } = match.params;
  const isNew = operation === 'add';
  const location = useLocation();
  const dispatch = useDispatch();

  useRedirectionToParentRoute(resourceType, id);
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
  const stagedProcessor = useSelector(state =>
    selectors.stagedResource(state, id)
  );
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
  // Incase of a multi step resource, with isNew flag indicates first step and shows Next button
  const isMultiStepSaveResource = multiStepSaveResourceTypes.includes(resourceType);
  const submitButtonLabel = isNew && isMultiStepSaveResource ? 'Next' : 'Save & close';
  const submitButtonColor = isNew && isMultiStepSaveResource ? 'primary' : 'secondary';

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
      }
      // this is NOT a case where a user selected an existing resource,
      // so move to step 2 of the form...

      dispatch(actions.resource.created(resourceId, id));
      // Incase of a resource with single step save, when skipFormClose is passed
      // redirect to the updated URL with new resourceId as we do incase of edit - check else part
      if (skipFormClose && !isMultiStepSaveResource) {
        return props.history.replace(
          generatePath(match.path, {
            id: newResourceId || id,
            resourceType,
            operation,
          })
        );
      }
      // In other cases , close the drawer
      onClose();
    } else {
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


      onClose();
    }
  }

  const showApplicationLogo =
    flowId &&
    ['exports', 'imports'].includes(resourceType) &&
    !!applicationType;
  const requiredResources = determineRequiredResources(resourceType);
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
    <>
      <div className={classes.root}>
        <div className={classes.title}>
          {isNestedDrawer(location.pathname) &&
          <IconButton
            data-test="backDrawer"
            className={classes.backButton}
            onClick={onClose}>
            <Back />
          </IconButton>}
          <div className={classes.titleImgBlock}>
            <Typography variant="h4" className={clsx(classes.titleText, {[classes.nestedDrawerTitleText]: isNestedDrawer(location.pathname)})}>
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
          </div>
          <IconButton
            data-test="closeDrawer"
            className={classes.closeButton}
            onClick={onClose}>
            <Close />
          </IconButton>
        </div>
        <LoadResources required resources={requiredResources}>
          <ResourceFormWithStatusPanel
            className={classes.resourceFormWrapper}
            variant={match.isExact ? 'edit' : 'view'}
            isNew={isNew}
            resourceType={resourceType}
            resourceId={id}
            cancelButtonLabel="Cancel"
            submitButtonLabel={submitButtonLabel}
            submitButtonColor={submitButtonColor}
            onSubmitComplete={handleSubmitComplete}
            onCancel={abortAndClose}
            {...props}
          />
        </LoadResources>
      </div>

      <Route
        path={`${match.url}${DRAWER_PATH}`}
        render={props => (
          <Panel {...props} zIndex={zIndex + 1} onClose={onClose} />
        )}
      />
    </>
  );
}
