import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory, useRouteMatch } from 'react-router-dom';
import actions from '../../../actions';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import AddOrSelect from '../AddOrSelect';
import { selectors } from '../../../reducers';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../../constants/resource';
import { useFormOnCancel } from '../../FormOnCancelContext/index';
import { getAsyncKey } from '../../../utils/saveAndCloseButtons';
import ResourceDrawer from '../../drawer/Resource';
import ResourceFormWithStatusPanel from '../../ResourceFormWithStatusPanel';
import ResourceFormActionsPanel from '../../drawer/Resource/Panel/ResourceFormActionsPanel';
import { getConnectionType } from '../../../utils/resource';
import { drawerPaths, buildDrawerUrl } from '../../../utils/rightDrawer';
import resourceConstants from '../../../forms/constants/connection';
import EditorDrawer from '../../AFE/Drawer';
import jsonUtil from '../../../utils/json';

const oAuthApplications = [
  ...resourceConstants.OAUTH_APPLICATIONS,
  'netsuite-oauth',
  'shopify-oauth',
  'acumatica-oauth',
  'hubspot-oauth',
  'amazonmws-oauth',
];

const useResourceFormRedirectionToParentRoute = (resourceType, id, redirectFunction) => {
  const history = useHistory();
  const initFailed = useSelector(state =>
    selectors.resourceFormState(state, resourceType, id)?.initFailed
  );

  useEffect(() => {
    if (initFailed) {
      typeof redirectFunction === 'function' && redirectFunction();
    }
  }, [history, initFailed, redirectFunction]);
};

function ResourceSetupDrawerContent({
  integrationId,
  templateId,
  onSubmitComplete,
  onClose,
  handleStackSetupDone,
  handleStackClose,
  mode,
  cloneResourceType,
  cloneResourceId,
  revisionId,
  parentUrl,
  isResourceStaged,
  setIsResourceStaged,
}) {
  const { resourceId, resourceType } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  let resourceObj;
  let connectionType;
  let environment;
  const createdConnectionId = useSelector(state => {
    if (resourceType === 'connections') {
      return selectors.createdResourceId(state, resourceId);
    }
  });

  /**
   * Incase of oAuth connections, once user submits the connectionDoc, we re-open the drawer with created connId
   * So, isAuthorized selector always points to the current connId ( which is a created one once reopened)
   * Once, isAuthorized is true, we automatically trigger the handleSubmit fn and close this drawer
   */
  const isAuthorized = useSelector(state =>
    selectors.isAuthorized(state, resourceId)
  );
  const connectionDoc = useSelector(state => {
    if (resourceType !== 'connections') return;

    return selectors.resource(state, 'connections', createdConnectionId || resourceId);
  });
  const canSelectExistingResources = useSelector(state => {
    if (!integrationId) return true;
    const _connectorId = selectors.integrationAppSettings(state, integrationId)?._connectorId;

    if (_connectorId) {
      // Incase of IAs, user cannot select existing resources
      return false;
    }

    // In all other use cases, user can either add new or select existing resources
    return true;
  });
  const templateInstallSetup = useSelector(state => selectors.installSetup(state, {
    templateId,
    resourceType,
    resourceId,
  }));
  const currentStep = useSelector(
    state => selectors.currentStepPerMode(state, {
      mode,
      integrationId,
      cloneResourceId,
      cloneResourceType,
      revisionId,
    })
  );

  if (mode === 'ss-install') {
    resourceObj = {
      type: 'netsuite',
      netsuite: { type: 'netsuite'},
    };
  } else if (templateId && templateInstallSetup) {
    // Update environment and resourceObject when a resource is cloned
    // and these props are configured in the preview step
    environment = templateInstallSetup?.data?.sandbox ? 'sandbox' : 'production';
    resourceObj = {...(templateInstallSetup?.connectionMap?.[currentStep?._connectionId] || {})};
  } else if (canSelectExistingResources && resourceType === 'connections') {
    // resource object construction incase of template : !_connectorId
  // if resourceId is new - construct obj
    resourceObj = currentStep?.sourceConnection || {};
    // eslint-disable-next-line no-nested-ternary
    connectionType = resourceObj.type === 'http'
      ? (resourceObj.http?.formType === 'rest' ? 'rest' : 'http')
      : resourceObj.type;

    if (!isResourceStaged && setIsResourceStaged) {
      dispatch(
        actions.resource.patchStaged(
          resourceId,
          jsonUtil.objectToPatchSet({
            ...currentStep?.sourceConnection,
            _id: resourceId,
            _integrationId: integrationId,
            installStepConnection: true,
          }),
        )
      );
      if (typeof setIsResourceStaged === 'function') {
        setIsResourceStaged(true);
      }
    }
  }

  const title = `Set up ${RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]}`;

  const formKey = getAsyncKey(resourceType, resourceId);
  const {disabled, setCancelTriggered} = useFormOnCancel(formKey);

  const goBackToParentUrl = useCallback(() => history.replace(parentUrl), [history, parentUrl]);
  const reLaunchDrawerWithCreatedConnectionId = useCallback(connectionId => {
    history.replace(buildDrawerUrl({
      path: drawerPaths.INSTALL.CONFIGURE_RESOURCE_SETUP,
      baseUrl: parentUrl,
      params: { resourceType: 'connections', resourceId: connectionId },
    }));
  }, [history, parentUrl]);
  const handleSubmitComplete = useCallback((...args) => {
    const onSubmitCb = resourceType === 'connections' ? onSubmitComplete : handleStackSetupDone;

    // suitescript install callback handles redirecting to parent url
    // so, no need to handle for ss-install
    if (mode !== 'ss-install') {
      if (resourceType === 'connections') {
        if (connectionDoc && oAuthApplications.includes(getConnectionType(connectionDoc)) && !isAuthorized) {
          // Step should not be marked as completed until Oauth application authorization is completed on other window.
          // So does not proceed further to call onSubmit fb and do post submit action dispatches
          // TODO @Raghu: Revisit this code
          // Currently, only incase of clone , this part of code gets executed as connectionDoc remains null for other use cases
          // But ideally, all oAuth related use cases should fall under this if condition and should be handled
          if (mode === 'clone' && createdConnectionId) {
            reLaunchDrawerWithCreatedConnectionId(createdConnectionId);
          }

          return;
        }
      }
      goBackToParentUrl();
    }
    if (onSubmitCb && typeof onSubmitCb === 'function') {
      onSubmitCb(...args);
    }
  }, [resourceType, onSubmitComplete, handleStackSetupDone, goBackToParentUrl, mode, connectionDoc, isAuthorized, createdConnectionId, reLaunchDrawerWithCreatedConnectionId]);

  const handleClose = useCallback((...args) => {
    const onCloseCb = resourceType === 'connections' ? onClose : handleStackClose;

    if (onCloseCb && typeof onCloseCb === 'function') {
      onCloseCb(...args);
    }
    // suitescript install on close callback handles redirecting to parent url
    if (mode !== 'ss-install') {
      goBackToParentUrl();
    }
  }, [resourceType, onClose, handleStackClose, goBackToParentUrl, mode]);

  useResourceFormRedirectionToParentRoute(resourceType, resourceId, goBackToParentUrl);
  useEffect(() => {
    // This is for oAuth connections
    // When oAuth connections are saved and user logs in successfully, isAuthorized returns true
    // and eventually we trigger handleSubmitComplete to do further updates to install steps
    if (isAuthorized) {
      handleSubmitComplete(resourceId, isAuthorized);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthorized, resourceId]);

  return (
    <>
      <DrawerHeader disableClose={disabled} title={title} handleClose={canSelectExistingResources ? setCancelTriggered : handleClose} />
      {canSelectExistingResources ? (
        <AddOrSelect
          resourceId={resourceId}
          onSubmitComplete={handleSubmitComplete}
          connectionType={connectionType}
          resource={resourceObj}
          environment={environment}
          resourceType={resourceType}
          manageOnly={mode === 'ss-install'}
          onClose={handleClose}
          formKey={formKey} />
      ) : (
        <>
          <DrawerContent>
            <ResourceFormWithStatusPanel
              occupyFullWidth
              formKey={formKey}
              resourceType={resourceType}
              resourceId={resourceId}
              onSubmitComplete={handleSubmitComplete}
            />
          </DrawerContent>
          <ResourceFormActionsPanel
            formKey={formKey}
            resourceType={resourceType}
            resourceId={resourceId}
            cancelButtonLabel="Cancel"
            submitButtonLabel="Save & close"
            onCancel={handleClose}
            integrationId={integrationId}
              />
        </>
      )}
      <ResourceDrawer />
    </>
  );
}
export default function ResourceSetupDrawer(props) {
  const match = useRouteMatch();

  return (
    <RightDrawer path={drawerPaths.INSTALL.CONFIGURE_RESOURCE_SETUP} height="tall">
      <ResourceSetupDrawerContent {...props} parentUrl={match.url} />
      <EditorDrawer />
    </RightDrawer>
  );
}
