import { useSelector, useDispatch } from 'react-redux';
import React, { useCallback, useEffect, useState } from 'react';
import { isBoolean } from 'lodash';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import DynaCheckbox from './checkbox/DynaCheckbox';

export default function DynaLinkSuiteScriptIntegrator(props) {
  const dispatch = useDispatch();
  const { resourceContext, onFieldChange } = props;

  const canLinkSuiteScriptIntegrator = useSelector((state) =>
    selectors.canLinkSuiteScriptIntegrator(state, resourceContext.resourceId)
  );

  const isSuiteScriptLinkedConnection = useSelector((state) => {
    const preferences = selectors.userPreferences(state);
    return (
      preferences &&
      preferences.ssConnectionIds &&
      preferences.ssConnectionIds.includes(resourceContext.resourceId)
    );
  });

  const hasIntegrations = useSelector(
    (state) =>
      selectors.netsuiteAccountHasSuiteScriptIntegrations(
        state,
        resourceContext.resourceId
      ),
    [dispatch, resourceContext.resourceId]
  );

  const checkIfTheAccountHasIntegrations = useCallback(() => {
    dispatch(
      actions.suiteScript.account.checkHasIntegrations(
        resourceContext.resourceId
      )
    );
  }, [dispatch, resourceContext.resourceId]);

  useEffect(() => {
    if (!isBoolean(hasIntegrations)) {
      checkIfTheAccountHasIntegrations();
    }
  }, [checkIfTheAccountHasIntegrations, hasIntegrations]);

  const [value, setValue] = useState(!!isSuiteScriptLinkedConnection);

  const handleValueChange = useCallback(
    (id, value) => {
      setValue(value);
      onFieldChange(id, value);
    },
    [onFieldChange]
  );

  if (!canLinkSuiteScriptIntegrator) {
    return null;
  }

  return (
    <DynaCheckbox {...props} value={value} onFieldChange={handleValueChange} />
  );
}
