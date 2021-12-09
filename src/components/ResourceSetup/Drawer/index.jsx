import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
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
import { isNewId } from '../../../utils/resource';

function ResourceSetupDrawerContent({
  integrationId,
  templateId,
  addOrSelect,
  onSubmitComplete,
  onClose,
  handleStackSetupDone,
  handleStackClose,
  mode,
  cloneResourceType,
  cloneResourceId,
}) {
  const { resourceId, resourceType } = useParams();
  let resourceObj;
  let connectionType;
  let environment;
  const isAuthorized = useSelector(state =>
    selectors.isAuthorized(state, resourceId)
  );
  const templateInstallSetup = useSelector(state => selectors.installSetup(state, {
    templateId,
    resourceType,
    resourceId,
  }));
  const currentStep = useSelector(state => {
    let steps = [];

    if (mode === 'child') {
      steps = selectors.addNewChildSteps(state, integrationId)?.steps;
    } else if (mode === 'install') {
      steps = selectors.integrationInstallSteps(state, integrationId);
    } else if (mode === 'clone') {
      steps = selectors.cloneInstallSteps(state, cloneResourceType, cloneResourceId);
    } else if (mode === 'template') {
      // not used any where??
      // Ref /components/drawer/Install/Integration/index.jsx for setup route that triggers InstallationWizard with template type
      steps = selectors.templateInstallSteps(state, templateId);
    }
    // handle all use cases with mode
    const currentStep = steps.find(s => !!s.isCurrentStep);

    return currentStep;
  });

  if (mode === 'ss-install') {
    resourceObj = {
      type: 'netsuite',
      netsuite: { type: 'netsuite'},
    };
  } else if (templateId && templateInstallSetup) {
    environment = templateInstallSetup?.data?.sandbox ? 'sandbox' : 'production';
    resourceObj = {...templateInstallSetup?.connectionMap[currentStep?._connectionId]};
  } else if (addOrSelect && resourceType === 'connections' && isNewId(resourceId)) {
    // resource object construction incase of template : !_connectorId
  // if resourceId is new - construct obj
    resourceObj = currentStep?.sourceConnection || {};
    // eslint-disable-next-line no-nested-ternary
    connectionType = resourceObj.type === 'http'
      ? (resourceObj.http?.formType === 'rest' ? 'rest' : 'http')
      : resourceObj.type;
  }

  useEffect(() => {
    if (isAuthorized && !addOrSelect) onSubmitComplete(resourceId, isAuthorized);
  }, [isAuthorized, resourceId, onSubmitComplete, addOrSelect]);

  const title = `Set up ${RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]}`;

  const formKey = getAsyncKey(resourceType, resourceId);
  const {disabled, setCancelTriggered} = useFormOnCancel(formKey);

  const handleClose = resourceType === 'connections' ? onClose : handleStackClose;
  const handleSubmitComplete = resourceType === 'connections' ? onSubmitComplete : handleStackSetupDone;

  return (
    <>
      <DrawerHeader disableClose={disabled} title={title} handleClose={setCancelTriggered} />
      {addOrSelect ? (
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
              />
        </>
      )}
      <ResourceDrawer />
    </>
  );
}
export default function ResourceSetupDrawer(props) {
  return (
    <RightDrawer
      path="configure/:resourceType/:resourceId"
      height="tall"
      variant="temporary">
      <ResourceSetupDrawerContent {...props} />
    </RightDrawer>
  );
}
