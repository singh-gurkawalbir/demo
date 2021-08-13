import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DynaSelectResource from './DynaSelectResource';
import { selectors } from '../../../reducers';
import { getReplaceConnectionExpression } from '../../../utils/connections';
import actions from '../../../actions';
import { SCOPES } from '../../../sagas/resourceForm';
import useFormContext from '../../Form/FormContext';
import { useSetInitializeFormData } from './assistant/DynaAssistantOptions';

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
  });

  const onFieldChangeHandler = useCallback((id, newConnectionId) => {
    const patch = [];

    patch.push({
      op: 'replace',
      path: '/_connectionId',
      value: newConnectionId,
    });

    dispatch(
      actions.resource.patchStaged(
        resourceId,
        patch,
        SCOPES.VALUE
      )
    );

    let allTouchedFields = Object.values(formContext.fields)
      .filter(field => !!field.touched)
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
  }, [dispatch, resourceId, formContext.fields, parentResourceType, flowId]);

  return (
    <DynaSelectResource
      {...props}
      onFieldChange={onFieldChangeHandler}
      options={options}
      allowEdit={!!hasAccess}
      allowNew={!!hasAccess} />
  );
}

