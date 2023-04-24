import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch, matchPath } from 'react-router-dom';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import { isNewId, multiStepSaveResourceTypes } from '../../../../utils/resource';
import EditorDrawer from '../../../AFE/Drawer';
import ExpandModeEditorDrawer from '../../../DynaForm/fields/DynaEditor/ExpandModeEditor/Drawer';
import MockDataDrawer from '../../../DynaForm/fields/DynaMockData/MockDataDrawer';
import PreviewPanel from '../../../PreviewPanel';
import LoadResources from '../../../LoadResources';
import LoadUIFields from '../../../LoadUIFields';
import ResourceFormWithStatusPanel from '../../../ResourceFormWithStatusPanel';
import ResourceFormActionsPanel from './ResourceFormActionsPanel';
import useHandleSubmitCompleteFn from './useHandleSubmitCompleteFn';
import useHandleResourceFormFlowSampleData from './useHandleResourceFormFlowSampleData';
import { getParentResourceContext } from '../../../../utils/connections';
import FlowStepRequestLogsDrawer from '../../FlowStepDebugLogs';
import { VALID_REPORT_TYPES } from '../../../../views/Reports';
import { getAsyncKey } from '../../../../utils/saveAndCloseButtons';
import { drawerPaths } from '../../../../utils/rightDrawer';
import TitleBar from './TitleBar';
import DrawerContent from '../../Right/DrawerContent';

const DRAWER_PATH = `/${drawerPaths.RESOURCE.ROOT}`;
export const isNestedDrawer = url => !!matchPath(url, {
  path: `/**${DRAWER_PATH}${DRAWER_PATH}`,
  exact: true,
  strict: false});

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
    width: props => {
      if (props.occupyFullWidth) return '100%';

      return props.match.isExact ? 822 : 0;
    },
    overflowX: 'hidden',
  },
  baseFormWithPreview: {
    display: 'flex',
    '& > div:first-child': {
      padding: 0,
      paddingRight: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    '& > div': {
      flex: 1,
    },
  },
  resourceFormWrapper: {
    width: '100%',
    overflowY: 'auto',
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
  if (resourceType.includes('exports') || resourceType.includes('imports')) return ['connections', ...resourceType];

  return resourceType;
}, [type]);

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
      // TODO: @Raghu: Can't we replace url with parentUrl - if we could pass till here?
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
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const { id, resourceType, operation } = match.params;
  const { parentType, parentId } = getParentResourceContext(match.url);
  const formKey = getAsyncKey(resourceType, id);
  const isNew = operation === 'add';

  useHandleResourceFormFlowSampleData(formKey);
  useResourceFormRedirectionToParentRoute(resourceType, id);
  const classes = useStyles({
    ...props,
    occupyFullWidth,
    match,
  });

  const abortAndClose = useCallback(() => {
    dispatch(actions.resourceForm.submitAborted(resourceType, id));
    onClose();
    dispatch(actions.resource.clearStaged(id));
    dispatch(actions.resourceFormSampleData.updateType(id, 'preview'));
  }, [dispatch, id, onClose, resourceType]);
  // if this form is for a page processor, we don't know if
  // the new resource is an export or import. We determine this by
  // peeking into the patch set from the first step in PP/PG creation.
  // The patch set should have a value for /adaptorType which
  // contains [*Import|*Export].
  const showNotificationForTechAdaptorForm = useSelector(state => selectors.showNotificationForTechAdaptorForm(state, id));

  // Incase of a multi step resource, with isNew flag indicates first step and shows Next button
  const isMultiStepSaveResource = multiStepSaveResourceTypes.includes(resourceType);
  let submitButtonLabel = isNew && isMultiStepSaveResource ? 'Next' : 'Save & close';

  if (resourceType === 'eventreports') {
    submitButtonLabel = 'Run report';
  }
  const submitButtonColor = isNew && isMultiStepSaveResource ? 'primary' : 'secondary';
  const handleSubmitComplete = useHandleSubmitCompleteFn(resourceType, id, onClose);
  const requiredResources = useDetermineRequiredResources(resourceType);
  const [showNotificationToaster, setShowNotificationToaster] = useState(false);
  const onCloseNotificationToaster = useCallback(() => {
    setShowNotificationToaster(false);
  }, []);

  // will be patching useTechAdaptorForm for assistants if export/import is not supported
  // based on this value, will be showing banner on the new export/import creation
  // using isNew as dependency and this will be false for export/import form
  useEffect(() => {
    if (!isNew) {
      setShowNotificationToaster(showNotificationForTechAdaptorForm);
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

  const isReportType = VALID_REPORT_TYPES.some(({value}) => value === resourceType);

  return (
    <>
      <TitleBar formKey={formKey} flowId={flowId} onClose={onClose} />
      <DrawerContent className={classes.root}>
        <LoadResources required integrationId={integrationId} resources={requiredResources}>
          <LoadUIFields resourceId={id} resourceType={resourceType} flowId={flowId}>
            <div
              className={clsx({
                [classes.baseForm]: resourceType === 'exports',
              },
              {[classes.baseFormWithPreview]: showPreviewPanel }
              )}
          >
              <ResourceFormWithStatusPanel
                formKey={formKey}
                variant={variant}
                isNew={isNew}
                resourceType={resourceType}
                className={clsx({[classes.resourceFormWrapper]: showPreviewPanel })}
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
                <PreviewPanel
                  resourceId={id}
                  formKey={formKey}
                  resourceType={resourceType}
                  flowId={flowId}
          />
              )}
            </div>
          </LoadUIFields>
        </LoadResources>
      </DrawerContent>
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
      <EditorDrawer />
      <ExpandModeEditorDrawer />
      <MockDataDrawer />
      <FlowStepRequestLogsDrawer flowId={flowId} resourceType={resourceType} resourceId={id} />
    </>
  );
}
