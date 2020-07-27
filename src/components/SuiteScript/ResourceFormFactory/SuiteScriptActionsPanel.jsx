import { useSelector } from 'react-redux';
import React, { useMemo } from 'react';
import { ActionsFactory } from '../../drawer/Resource/Panel/ResourceFormActionsPanel';
import * as selectors from '../../../reducers';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import consolidatedActions from './Actions';

const secondaryActions = ['test', 'validate'];

export default function (props) {
  const { resourceType, resourceId} = props;

  const resource = useSelectorMemo(selectors.makeResourceDataSelector, resourceType, resourceId);

  // Any extra actions other than Save, Cancel which needs to be separated goes here
  const formState = useSelector(state =>
    selectors.resourceFormState(state, resourceType, resourceId)
  );

  const { actions, fieldMap} = formState?.fieldMeta || {};

  const actionButtons = useMemo(() => {
    // if props has defined actions return it
    if (actions) return actions;
    let actionButtons = ['save', 'saveandclose', 'cancel'];
    // When action button metadata isn't provided we infer the action buttons.
    if (resourceType === 'connections' && resource?.type !== 'other') {
      actionButtons = ['testandsave', 'testsaveandclose', 'cancel', 'test'];
    }
    return actionButtons.map(id => ({
      id,
      mode: secondaryActions.includes(id) ? 'secondary' : 'primary'
    }));
  }, [actions, resource?.type, resourceType]);

  if (!formState.initComplete) return null;

  return <ActionsFactory consolidatedActions={consolidatedActions} fieldMap={fieldMap} actions={actionButtons} {...props} />;
}
