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

function ResourceSetupDrawerContent({ integrationId, addOrSelect, onSubmitComplete, onClose, manageOnly, handleStackSetupDone, handleStackClose, mode = 'install' }) {
  const { resourceId, resourceType } = useParams();
  let resourceObj;
  let connectionType;
  const isAuthorized = useSelector(state =>
    selectors.isAuthorized(state, resourceId)
  );
  const currentStep = useSelector(state => {
    let steps = [];

    if (mode === 'child') {
      steps = selectors.addNewChildSteps(state, integrationId)?.steps;
    } else {
      steps = selectors.integrationInstallSteps(state, integrationId);
    }
    // handle all use cases with mode
    const currentStep = steps.find(s => !!s.isCurrentStep);

    return currentStep;
  });

  // resource object construction incase of template : !_connectorId
  // if resourceId is new - construct obj
  if (addOrSelect && resourceType === 'connections' && isNewId(resourceId)) {
    resourceObj = currentStep?.sourceConnection;
    // eslint-disable-next-line no-nested-ternary
    connectionType = resourceObj?.type === 'http'
      ? (resourceObj?.http?.formType === 'rest' ? 'rest' : 'http')
      : resourceObj.type;
  }
  // environment

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
              // eslint-disable-next-line no-nested-ternary
          connectionType={connectionType}
          resource={resourceObj}
                // environment={} - ask sravan
          resourceType={resourceType}
          manageOnly={manageOnly}
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
export default function ResourceSetupDrawer({ integrationId, addOrSelect, onSubmitComplete, onClose, manageOnly, handleStackSetupDone, handleStackClose, mode }) {
  return (
    <RightDrawer
      path="configure/:resourceType/:resourceId"
      height="tall"
      variant="temporary">
      <ResourceSetupDrawerContent
        integrationId={integrationId}
        addOrSelect={addOrSelect}
        onSubmitComplete={onSubmitComplete}
        manageOnly={manageOnly}
        handleStackSetupDone={handleStackSetupDone}
        handleStackClose={handleStackClose}
        mode={mode}
        onClose={onClose} />
    </RightDrawer>
  );
}
