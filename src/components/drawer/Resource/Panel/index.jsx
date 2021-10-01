import { IconButton, makeStyles, Typography, Divider } from '@material-ui/core';
import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  matchPath, useHistory, useLocation,
  useRouteMatch,
} from 'react-router-dom';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import { isNewId, multiStepSaveResourceTypes } from '../../../../utils/resource';
import EditorDrawer from '../../../AFE/Drawer';
import ExportsPreviewPanel from '../../../ExportsPreviewPanel';
import ApplicationImg from '../../../icons/ApplicationImg';
import Back from '../../../icons/BackArrowIcon';
import LoadResources from '../../../LoadResources';
import ResourceFormWithStatusPanel from '../../../ResourceFormWithStatusPanel';
import ResourceFormActionsPanel from './ResourceFormActionsPanel';
import useHandleSubmitCompleteFn from './useHandleSubmitCompleteFn';
import {applicationsList} from '../../../../constants/applications';
import InstallationGuideIcon from '../../../icons/InstallationGuideIcon';
import { KBDocumentation, getParentResourceContext } from '../../../../utils/connections';
import DebugIcon from '../../../icons/DebugIcon';
import FlowRequestLogsDrawer from '../../FlowStepRequestLogs';
import { VALID_REPORT_TYPES } from '../../../../views/Reports';
import CloseButton from './CloseButton';
import { getAsyncKey } from '../../../../utils/saveAndCloseButtons';
import { TextButton } from '../../../Buttons';

const DRAWER_PATH = '/:operation(add|edit)/:resourceType/:id';
export const isNestedDrawer = url => !!matchPath(url, {
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
  baseFormWithPreview: {
    display: 'grid',
    gridTemplateColumns: '50% 48%',
    gridColumnGap: theme.spacing(1),
    padding: theme.spacing(3),
    '& > div:first-child': {
      padding: 0,
      paddingRight: theme.spacing(2),
    },
  },
  resourceFormWrapper: {
    width: '100%',
    padding: theme.spacing(3),
    overflowY: 'auto',

  },
  appLogo: {
    padding: theme.spacing(0, 1),
    margin: theme.spacing(-0.5, 0),
  },
  guideWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  guideLink: {
    marginRight: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(0.5),
  },
  guideLinkIcon: {
    marginRight: theme.spacing(0.5),
  },
  title: {
    display: 'flex',
    padding: theme.spacing(2, 3),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    position: 'relative',
  },
  titleText: {
    wordBreak: 'break-word',
    paddingRight: theme.spacing(2),
    color: theme.palette.secondary.main,
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
  debugLogButton: {
    padding: '0px 8px',
    borderRadius: 0,
    borderRight: `1px solid ${theme.palette.secondary.lightest}`,
  },
  appLogoWrapper: {
    position: 'relative',
    display: 'flex',
    marginRight: theme.spacing(3),
  },
  divider: {
    height: 24,
    width: 1,
  },
  resourcePanelFooter: {
    background: theme.palette.common.white,
  },
}));
const useDetermineRequiredResources = type => useMemo(() => {
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
}, [type]);

const getTitle = ({ resourceType, resourceLabel, opTitle }) => {
  if (resourceType === 'eventreports') {
    return 'Run report';
  }
  if (resourceType === 'pageGenerator') {
    return 'Create source';
  }

  if (['accesstokens', 'apis', 'connectors'].includes(resourceType)) {
    return `${opTitle} ${resourceLabel}`;
  }

  if (!resourceLabel) { return ''; }

  return `${opTitle} ${resourceLabel.toLowerCase()}`;
};

export const redirectURlToParentListing = url => url.split('/')
  .slice(0, -3)
  .join('/');
export const useRedirectToParentRoute = initFailed => {
  const history = useHistory();
  const match = useRouteMatch();

  useEffect(() => {
    if (initFailed) {
      // remove the last 3 segments from the route ...
      // /:operation(add|edit)/:resourceType/:id
      const stripedRoute = redirectURlToParentListing(match.url);

      history.replace(stripedRoute);
    }
  }, [history, initFailed, match.url]);
};

const useResourceFormRedirectionToParentRoute = (resourceType, id) => {
  const initFailed = useSelector(state =>
    selectors.resourceFormState(state, resourceType, id)?.initFailed
  );

  useRedirectToParentRoute(initFailed);
};

export default function Panel(props) {
  const { onClose, occupyFullWidth, flowId, integrationId } = props;
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const applications = applicationsList();

  const { id, resourceType, operation } = match.params;
  const { parentType, parentId } = getParentResourceContext(match.url);
  const formKey = getAsyncKey(resourceType, id);

  const isNew = operation === 'add';

  useResourceFormRedirectionToParentRoute(resourceType, id);
  const classes = useStyles({
    ...props,
    occupyFullWidth,
    match,
  });

  const hasFlowStepLogsAccess = useSelector(state => selectors.hasLogsAccess(state, id, resourceType, isNew, flowId));
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
  const isTechAdaptorForm = useSelector(state => {
    const staggedPatches = selectors.stagedResource(state, id)?.patch;

    return !!staggedPatches?.find(
      p => p.op === 'replace' && p.path === '/useTechAdaptorForm'
    )?.value;
  }

  );

  const applicationType = useSelector(state => selectors.applicationType(state, resourceType, id));

  const app = applications.find(a => a.id === applicationType) || {};
  // Incase of a multi step resource, with isNew flag indicates first step and shows Next button
  const isMultiStepSaveResource = multiStepSaveResourceTypes.includes(resourceType);
  let submitButtonLabel = isNew && isMultiStepSaveResource ? 'Next' : 'Save & close';

  if (resourceType === 'eventreports') {
    submitButtonLabel = 'Run report';
  }
  const submitButtonColor = isNew && isMultiStepSaveResource ? 'primary' : 'secondary';
  const handleSubmitComplete = useHandleSubmitCompleteFn(resourceType, id, onClose);
  const showApplicationLogo =
    ['exports', 'imports', 'connections'].includes(resourceType) &&
    !!applicationType;
  const requiredResources = useDetermineRequiredResources(resourceType);
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
  const [showNotificationToaster, setShowNotificationToaster] = useState(false);
  const onCloseNotificationToaster = useCallback(() => {
    setShowNotificationToaster(false);
  }, []);

  // will be patching useTechAdaptorForm for assistants if export/import is not supported
  // based on this value, will be showing banner on the new export/import creation
  // using isNew as dependency and this will be false for export/import form
  useEffect(() => {
    if (!isNew) {
      setShowNotificationToaster(isTechAdaptorForm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew]);
  const variant = match.isExact ? 'edit' : 'view';

  const showPreviewPanel = useSelector(state => {
    const shouldShow = selectors.isPreviewPanelAvailableForResource(state, id, resourceType, flowId);
    // isNew is the property we use to infer if this is the first step in resource creation
    const isFirstStep = isNewId(id) && selectors.resourceFormState(state, resourceType, id).isNew;

    // we don't show preview panel if it is the first step
    return shouldShow && !isFirstStep;
  });

  const listenerDrawerHandler = useCallback(() => {
    history.push(`${match.url}/logs`);
  }, [match.url, history]);
  const isReportType = VALID_REPORT_TYPES.some(({value}) => value === resourceType);

  return (
    <>
      <div className={classes.root}>
        <div className={classes.title}>
          {isNestedDrawer(location.pathname) && (
          <IconButton
            data-test="backDrawer"
            className={classes.backButton}
            onClick={onClose}>
            <Back />
          </IconButton>
          )}

          <div data-public className={classes.titleImgBlock}>
            <Typography variant="h4" className={clsx(classes.titleText, {[classes.nestedDrawerTitleText]: isNestedDrawer(location.pathname)})}>
              {title}
            </Typography>
            {showApplicationLogo && (
            <div className={classes.guideWrapper}>
              {resourceType === 'connections' && (app.helpURL || KBDocumentation[applicationType]) && (
              <a className={classes.guideLink} href={app.helpURL || KBDocumentation[applicationType]} rel="noreferrer" target="_blank">
                <InstallationGuideIcon className={classes.guideLinkIcon} />
                {app.name || applicationType} connection guide
              </a>
              )}
              {hasFlowStepLogsAccess && (
                <TextButton
                  onClick={listenerDrawerHandler}
                  startIcon={<DebugIcon />}
                  className={classes.debugLogButton}
                  data-test="listenerLogs">
                  View debug logs
                </TextButton>
              )}
              <div className={classes.appLogoWrapper}>
                <ApplicationImg
                  className={classes.appLogo}
                  size="small"
                  type={applicationType}
                  alt={applicationType || 'Application image'}
                  assistant={app?.assistant}
            />
                <Divider orientation="vertical" className={classes.divider} />
              </div>
            </div>
            )}
          </div>
          <CloseButton
            formKey={formKey}
          />
        </div>
        <LoadResources required resources={requiredResources}>
          <div
            className={clsx({
              [classes.baseForm]: resourceType === 'exports',
            },
            {[classes.baseFormWithPreview]: showPreviewPanel }
            )}
          >
            <ResourceFormWithStatusPanel
              formKey={formKey}
              className={classes.resourceFormWrapper}
              variant={variant}
              isNew={isNew}
              resourceType={resourceType}
              resourceId={id}
              flowId={flowId}
              // All users have access to reports
              skipMonitorLevelAccessCheck={isReportType}
              integrationId={integrationId}
              isFlowBuilderView={!!flowId}
              onSubmitComplete={handleSubmitComplete}
              showNotificationToaster={showNotificationToaster}
              onCloseNotificationToaster={onCloseNotificationToaster}
          />
            {showPreviewPanel && (
              <ExportsPreviewPanel
                resourceId={id}
                formKey={formKey}
                resourceType={resourceType}
                flowId={flowId}
          />
            )}
          </div>
          <div className={classes.resourcePanelFooter}>
            <ResourceFormActionsPanel
              formKey={formKey}
              isNew={isNew}
              resourceType={resourceType}
              resourceId={id}
              flowId={flowId}
              integrationId={integrationId}
              parentType={parentType}
              parentId={parentId}
              cancelButtonLabel="Cancel"
              submitButtonLabel={submitButtonLabel}
              submitButtonColor={submitButtonColor}
              onCancel={abortAndClose}
          />
          </div>
        </LoadResources>
      </div>
      <EditorDrawer />
      <FlowRequestLogsDrawer flowId={flowId} exportId={id} />
    </>
  );
}
