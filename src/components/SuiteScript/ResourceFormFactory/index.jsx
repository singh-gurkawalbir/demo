import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import formFactory from '../../../forms/formFactory';
import { FormStateManager } from '../../ResourceFormFactory';
import SuiteScriptActionsPanel from './SuiteScriptActionsPanel';

export const ResourceFormFactory = props => {
  const {
    resourceType,
    resourceId,
    isNew,
    flowId,
    ssLinkedConnectionId,
  } = props;
  const dispatch = useDispatch();
  const handleInitForm = useCallback((
    ssLinkedConnectionId,
    resourceType,
    resourceId,
    flowId,
  ) => {
    dispatch(
      actions.suiteScript.resourceForm.init(
        ssLinkedConnectionId,
        resourceType,
        resourceId,
        false,
        false,
        flowId,
        undefined,
      )
    );
  }, [dispatch]);

  const handleClearResourceForm = useCallback((ssLinkedConnectionId, resourceType, resourceId) => {
    dispatch(
      actions.suiteScript.resourceForm.clear(
        ssLinkedConnectionId,
        resourceType,
        resourceId,
      )
    );
  }, [dispatch]);

  const formState = useSelector(state => selectors.suiteScriptResourceFormState(state, {
    resourceType,
    resourceId,
    ssLinkedConnectionId,
  }));
  const { merged: resource } = useSelector(state => selectors.suiteScriptResourceData(state, {
    resourceType,
    id: resourceId,
    ssLinkedConnectionId,
  }));
  const connection = useSelector(state => selectors.resource(
    state,
    'connections',
    resource && resource._connectionId
  ));

  useEffect(() => {
    handleInitForm(
      ssLinkedConnectionId,
      resourceType,
      resourceId,
      flowId,
    );

    return () =>
      handleClearResourceForm(ssLinkedConnectionId, resourceType, resourceId);
  }, [
    flowId,
    handleClearResourceForm,
    handleInitForm,
    isNew,
    resourceId,
    resourceType,
    ssLinkedConnectionId,
  ]);

  const { optionsHandler, validationHandler } = useMemo(
    () =>
      formFactory.getResourceFormAssets({
        resourceType,
        resource,
        isNew,
        connection,
        ssLinkedConnectionId,
      }),
    [connection, isNew, resource, resourceType, ssLinkedConnectionId]
  );
  const { fieldMeta } = formState;

  return (
    <FormStateManager
      {...props}
      formState={formState}
      fieldMeta={fieldMeta}
      optionsHandler={optionsHandler}
      validationHandler={validationHandler}
    />
  );
};

const SuiteScriptFormComponent = props => (

  <>
    <ResourceFormFactory {...props} />

    <SuiteScriptActionsPanel {...props} />

  </>
);

export default SuiteScriptFormComponent;
