import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { selectors } from '../../../../reducers';
import getRoutePath from '../../../../utils/routePaths';
import TextButton from '../../../Buttons/TextButton';
import AliasDrawerWrapper from '../../../drawer/Aliases';
import InstallationGuideIcon from '../../../icons/InstallationGuideIcon';

export default function ViewAliases({ editorId }) {
  const history = useHistory();
  const match = useRouteMatch();

  const { integrationId, flowId, resourceType } = useSelector(state => {
    const e = selectors.editor(state, editorId);

    return {
      integrationId: e.integrationId,
      flowId: e.flowId,
      resourceType: e.resourceType,
    };
  }, shallowEqual);

  const handleClick = useCallback(() => {
    history.push(getRoutePath(`${match.url}/aliases/view`));
  }, [history, match.url]);

  return (
    <>
      <AliasDrawerWrapper resourceId={resourceType === 'integrations' ? integrationId : flowId} resourceType={resourceType === 'integrations' ? 'integrations' : 'flows'} height="tall" />
      <TextButton
        startIcon={<InstallationGuideIcon />}
        onClick={handleClick}>
        View aliases
      </TextButton>
    </>
  );
}
