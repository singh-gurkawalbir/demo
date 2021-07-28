import { useSelector } from 'react-redux';
import React, { useMemo } from 'react';
import { ActionsFactory } from '../../drawer/Resource/Panel/ResourceFormActionsPanel';
import { selectors } from '../../../reducers';
import consolidatedActions from './Actions';

export default function (props) {
  const { resourceType, resourceId, ssLinkedConnectionId} = props;

  const { merged: resource } = useSelector(state => selectors.suiteScriptResourceData(state, {
    resourceType,
    id: resourceId,
    ssLinkedConnectionId,
  }));
  // Any extra actions other than Save, Cancel which needs to be separated goes here
  const formState = useSelector(state => selectors.suiteScriptResourceFormState(state, {
    resourceType,
    resourceId,
    ssLinkedConnectionId,
  }));

  const { actions, fieldMap} = formState?.fieldMeta || {};

  const actionButtons = useMemo(() => {
    // if props has defined actions return it
    if (actions) return actions.map(action => ({...action, mode: 'group'}));

    // When action button metadata isn't provided we infer the action buttons.
    if (resourceType === 'connections' && resource?.type !== 'other') {
      return [{id: 'testandsavegroup', mode: 'group' }];
    }

    return [{id: 'saveandclosegroup', mode: 'group' }];
  }, [actions, resource?.type, resourceType]);

  if (!formState.initComplete) return null;

  return <ActionsFactory consolidatedActions={consolidatedActions} fieldMap={fieldMap} actions={actionButtons} {...props} />;
}
