import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { OutlinedButton } from '@celigo/fuse-ui';
import actions from '../../../../../actions';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import { selectors } from '../../../../../reducers';
import { PING_STATES } from '../../../../../reducers/comms/ping';
import useFormContext from '../../../../Form/FormContext';

export default function NetsuiteValidateButton(props) {
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const {
    resourceId,
    id,
    visibleWhen,
    visibleWhenAll,
    formKey,
    flowId,
    integrationId,
    parentType,
    parentId,
  } = props;

  const { fields, disabled: formDisabled } = useFormContext(formKey) || {};
  const { disabled = formDisabled } = props;
  const onFieldChange = useCallback(
    (fieldId, value, skipFieldTouched) =>
      dispatch(
        actions.form.fieldChange(formKey)(fieldId, value, skipFieldTouched)
      ),
    [dispatch, formKey]
  );
  const registerField = useCallback(
    field => dispatch(actions.form.registerField(formKey)(field)),
    [dispatch, formKey]
  );

  const parentContext = useMemo(() => ({
    flowId,
    integrationId,
    parentType,
    parentId,
  }), [flowId, integrationId, parentId, parentType]);
  const values = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);
  const handleValidate = () => {
    // clear the ping comm status first as validity will be determined by netsuite user roles
    dispatch(actions.resource.connections.testClear(resourceId, true));
    dispatch(actions.resource.connections.netsuite.clearUserRoles(resourceId));
    dispatch(
      actions.resource.connections.netsuite.testConnection(
        {connectionId: resourceId, values, parentContext, shouldPingConnection: true}));
  };

  const { status, message, hideNotificationMessage } = useSelector(state =>
    selectors.netsuiteUserRoles(state, resourceId) || {}
  );
  const isValidatingNetsuiteUserRoles = useSelector(state =>
    selectors.isValidatingNetsuiteUserRoles(state)
  );
  const isOffline = useSelector(state =>
    selectors.isConnectionOffline(state, resourceId)
  );
  const matchingActionField = fields && Object.values(fields)?.find(field => field.id === id);
  const fieldsIsVisible = matchingActionField && matchingActionField.visible;
  const testConnectionCommState = useSelector(state =>
    selectors.testConnectionCommState(state, resourceId)
  );
  const pingLoading = testConnectionCommState.commState === PING_STATES.LOADING;

  useEffect(() => {
    if (resourceId && fieldsIsVisible && !isOffline) {
      dispatch(
        actions.resource.connections.netsuite.testConnection(
          {connectionId: resourceId, hideNotificationMessage: true, shouldPingConnection: false})
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fieldsIsVisible, resourceId]);

  // This piece of marks the form valid or invalid based on a successful fetch of user roles
  useEffect(() => {
    if (fieldsIsVisible) {
      if (status === 'success') {
        // enable save button
        onFieldChange(id, 'false', true);
      } else if (status === 'error') {
        if (message) {
          enquesnackbar({ message, variant: 'error' });
          // disable save button
          onFieldChange(id, 'true', true);
        }
      }
    }
  }, [status, id, fieldsIsVisible, enquesnackbar, message, onFieldChange]);

  useEffect(() => {
    // name does not really matter since this is an action button
    // and we are ignoring the value associated to this field
    // through omitWhenValueIs
    if (!fieldsIsVisible) {
      registerField({
        id,
        name: id,
        visibleWhen,
        visibleWhenAll,
        value: 'true',
        validWhen: { isNot: { values: ['true'] } },
        omitWhenValueIs: [undefined, 'false', 'true'],
      });
    }
  }, [fields, id, visibleWhen, visibleWhenAll, fieldsIsVisible, registerField]);

  // Clean up action on un mount , to clear user roles when container is closed
  // TODO @Raghu: check ,should we clear on validate click? or on un mount?
  useEffect(() => () => dispatch(
    actions.resource.connections.netsuite.clearUserRoles(resourceId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);
  if (!fields) return null;

  if (id) {
    if (!fieldsIsVisible) return null;
  }
  // during the validate process we fetch for userRoles and also perform a ping
  const isButtonTesting = isValidatingNetsuiteUserRoles || pingLoading;

  return (
    <OutlinedButton
      data-test={id}
      color="secondary"
      disabled={disabled || isButtonTesting}
      onClick={handleValidate}>
      {(isButtonTesting && !hideNotificationMessage) ? 'Testing' : 'Test connection'}
    </OutlinedButton>
  );
}

