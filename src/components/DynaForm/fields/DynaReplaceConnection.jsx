import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DynaSelectResource from './DynaSelectResource';
import { selectors } from '../../../reducers';
import { getReplaceConnectionExpression } from '../../../utils/connections';
import actions from '../../../actions';
import useFormContext from '../../Form/FormContext';
import { useSetInitializeFormData } from './assistant/DynaAssistantOptions';
import {useHFSetInitializeFormData} from './httpFramework/DynaHFAssistantOptions';
import { MULTIPLE_AUTH_TYPE_ASSISTANTS } from '../../../constants';
import useUpdateGroupingVisibility from './DynaSortAndGroup/useUpdateGroupingVisibility';
import useHandleFileDefinitionFieldVisibility from '../../drawer/Resource/Panel/useHandleFileDefinitionFieldVisibility';

const emptyObj = {};
export default function DynaReplaceConnection(props) {
  const {
    connectionId,
    connectorId,
    flowId,
    resourceId,
    parentResourceType,
    formKey,
    onFieldChange} = props;

  let {integrationId} = props;
  const dispatch = useDispatch();
  const formContext = useFormContext(formKey);

  let childId;
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );

  const connection = useSelector(
    state =>
      selectors.resource(state, 'connections', connectionId) ||
      emptyObj
  );

  const parentIntegration = useSelector(state =>
    selectors.resource(state, 'integrations', integration?._parentId)
  );

  if (parentIntegration?._id) {
    childId = integrationId;
    integrationId = parentIntegration._id;
  }
  const hasAccess = useSelector(state => selectors.resourcePermissions(
    state,
    'integrations',
    integrationId,
    'connections'
  ))?.edit;
  const options = getReplaceConnectionExpression(connection, !!childId, childId, integrationId, connectorId, false);

  useSetInitializeFormData({
    resourceType: parentResourceType,
    resourceId,
    onFieldChange,
    isHTTPFramework: connection?.http?._httpConnectorId,
  });
  useHFSetInitializeFormData({
    resourceType: parentResourceType,
    resourceId,
    onFieldChange,
    isHTTPFramework: connection?.http?._httpConnectorId,
  });

  // these hooks needed to be added in some component
  // which would always be visible on export form
  useUpdateGroupingVisibility({formKey, resourceId, resourceType: parentResourceType});
  useHandleFileDefinitionFieldVisibility(formKey);

  const onFieldChangeHandler = useCallback((id, newConnectionId) => {
    const patch = [];
    let metaDataExists = false;

    if (id !== newConnectionId) {
      patch.push({
        op: 'replace',
        path: '/_connectionId',
        value: newConnectionId,
      });
    }

    // assistantMetadata is removed on connection replace because the metadata changes on
    // switching between different versions of constant contact i.e. v2 & v3
    if (MULTIPLE_AUTH_TYPE_ASSISTANTS.includes(connection?.assistant)) {
      metaDataExists = true;
      patch.push({
        op: 'remove',
        path: '/assistantMetadata',
      });
    }

    dispatch(
      actions.resource.patchStaged(
        resourceId,
        patch,
      )
    );

    let allTouchedFields = Object.values(formContext.fields)
      .filter(field => {
        if (field.touched) {
          if (metaDataExists) {
            if (!(field?.id?.includes('assistantMetadata'))) { return true; }
          } else { return true; }
        }

        return false;
      })
      .map(field => ({ id: field.id, value: field.value }));

    allTouchedFields = [
      ...allTouchedFields,
      { id, value: newConnectionId },
    ];

    // patch and re-init the form if the linked connection is changed
    // so that the fields can read the new connection id
    dispatch(
      actions.resourceForm.init(
        parentResourceType,
        resourceId,
        false,
        false,
        flowId,
        allTouchedFields,
      )
    );
  }, [connection?.assistant, dispatch, resourceId, formContext.fields, parentResourceType, flowId]);

  return (
    <DynaSelectResource
      {...props}
      onFieldChange={onFieldChangeHandler}
      options={options}
      allowEdit={!!hasAccess}
      allowNew={!!hasAccess} />
  );
}

