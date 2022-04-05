import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { selectors } from '../../../../reducers';
import { drawerPaths, buildDrawerUrl } from '../../../../utils/rightDrawer';
import TextButton from '../../../Buttons/TextButton';
import AliasDrawerWrapper from '../../../drawer/Aliases';
import InstallationGuideIcon from '../../../icons/InstallationGuideIcon';

export default function ViewAliases({ editorId }) {
  const history = useHistory();
  const match = useRouteMatch();

  const { resourceId, resourceType } = useSelector(state => {
    const { integrationId, flowId, resourceId, resourceType } = selectors.editor(state, editorId);

    // for flow custom settings it's id is present in resourceId
    const tempFlowId = resourceType === 'flows' ? resourceId : flowId;

    return {
      resourceId: resourceType === 'integrations' ? integrationId : tempFlowId,
      resourceType: resourceType === 'integrations' ? 'integrations' : 'flows',
    };
  }, shallowEqual);

  const handleClick = useCallback(() => {
    history.push(buildDrawerUrl({
      path: drawerPaths.ALIASES.VIEW,
      baseUrl: match.url,
    }));
  }, [history, match.url]);

  return (
    <>
      <AliasDrawerWrapper resourceId={resourceId} resourceType={resourceType} height="tall" />
      <TextButton
        startIcon={<InstallationGuideIcon />}
        onClick={handleClick}>
        View aliases
      </TextButton>
    </>
  );
}
