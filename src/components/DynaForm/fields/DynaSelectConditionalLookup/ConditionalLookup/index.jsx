import React, { useCallback } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import { selectors } from '../../../../../reducers';
import ManageLookup from '../../../../Lookup/Manage';

const emptySet = {};
export default function ConditionalLookup({onSave, disabled, resourceId, resourceType, flowId, ...props}) {
  const match = useRouteMatch();
  const history = useHistory();
  const isEdit = history.location.pathname.includes('/edit');
  const {lookupName} = match.params;
  const value = useSelector(state => {
    if (!lookupName) {
      return emptySet;
    }
    const {lookups} = selectors.mapping(state);

    const val = lookups.find(({_isConditional, name}) => _isConditional && name === lookupName);

    return val || emptySet;
  }, shallowEqual);
  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);
  const handleSave = useCallback((id, val) => {
    onSave(isEdit, val);
    handleClose();
  }, [handleClose, isEdit, onSave]);

  if (isEdit && !value?.name) {
    return null;
  }

  return (
    <ManageLookup
      onSave={handleSave}
      value={value}
      onCancel={handleClose}
      disabled={disabled}
      resourceId={resourceId}
      resourceType={resourceType}
      flowId={flowId}
      {...props}
      />
  );
}
