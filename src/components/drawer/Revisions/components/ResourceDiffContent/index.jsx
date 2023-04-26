import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import { Spinner } from '@celigo/fuse-ui';
import ResourceDiffVisualizer from '../../../../ResourceDiffVisualizer';
import ResourceDiffError from './ResourceDiffError';
import { selectors } from '../../../../../reducers';
import { REVISION_TYPES } from '../../../../../constants';
import { getRevisionResourceLevelChanges, hasInvalidRevertResourceDiff } from '../../../../../utils/revisions';
import NotificationToaster from '../../../../NotificationToaster';
import { message } from '../../../../../utils/messageStore';

export default function ResourceDiffContent({ integrationId, type, parentUrl }) {
  const revisionResourceDiff = useSelector(state => selectors.revisionResourceDiff(state, integrationId));
  const hasResourceDiffError = useSelector(state => !!selectors.revisionResourceDiffError(state, integrationId));
  const isResourceComparisonInProgress = useSelector(state => selectors.isResourceComparisonInProgress(state, integrationId));
  const isDiffExpanded = useSelector(state => selectors.isDiffExpanded(state, integrationId));
  const resourceDiffInfo = useMemo(() => getRevisionResourceLevelChanges(revisionResourceDiff, type), [revisionResourceDiff, type]);

  if (isResourceComparisonInProgress) {
    return <Spinner center="screen" />;
  }
  if (hasResourceDiffError) {
    return (
      <ResourceDiffError
        integrationId={integrationId}
        type={type}
        parentUrl={parentUrl} />
    );
  }
  if (type === REVISION_TYPES.REVERT && hasInvalidRevertResourceDiff(revisionResourceDiff)) {
    return (
      <NotificationToaster variant="error" size="large">
        <Typography variant="body2">
          {message.REVERT_NOT_ALLOWED}
        </Typography>
      </NotificationToaster>
    );
  }

  return (
    <ResourceDiffVisualizer
      integrationId={integrationId}
      diffs={resourceDiffInfo?.diffs}
      titles={resourceDiffInfo?.titles}
      forceExpand={isDiffExpanded}
    />
  );
}
