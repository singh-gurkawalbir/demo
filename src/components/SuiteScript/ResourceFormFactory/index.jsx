import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { FormStateManager } from '../../ResourceFormFactory';
import SuiteScriptActionsPanel from './SuiteScriptActionsPanel';
import { generateNewId } from '../../../utils/resource';
import getResourceFormAssets from '../../../forms/formFactory/getResourceFromAssets';

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
  }, [dispatch, flowId, resourceId, resourceType, ssLinkedConnectionId]);

  const handleClearResourceForm = useCallback(() => {
    dispatch(
      actions.suiteScript.resourceForm.clear(
        ssLinkedConnectionId,
        resourceType,
        resourceId,
      )
    );
  }, [dispatch, resourceId, resourceType, ssLinkedConnectionId]);

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
    handleInitForm();

    return () =>
      handleClearResourceForm();
  }, [handleClearResourceForm, handleInitForm]);

  const { optionsHandler, validationHandler } = useMemo(
    () => {
      let metadataAssets;

      try {
        // try to load the assets if it can't initForm saga should fail anyway
        metadataAssets = getResourceFormAssets({
          resourceType,
          resource,
          isNew,
          connection,
          ssLinkedConnectionId,
        });
      } catch (e) {
        metadataAssets = {};
      }

      return metadataAssets;
    },
    [connection, isNew, resource, resourceType, ssLinkedConnectionId]
  );
  const { fieldMeta } = formState;

  return (
    <FormStateManager
      {...props}
      handleInitForm={handleInitForm}
      formState={formState}
      fieldMeta={fieldMeta}
      optionsHandler={optionsHandler}
      validationHandler={validationHandler}
    />
  );
};

export default function SuiteScriptFormComponent(props) {
  const [formKey] = useState(generateNewId());

  return (

    <>
      <ResourceFormFactory formKey={formKey} {...props} />

      <SuiteScriptActionsPanel formKey={formKey} {...props} />

    </>
  );
}

