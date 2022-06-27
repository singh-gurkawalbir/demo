import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Spinner from '../../../../Spinner';
import ResourceDiffVisualizer from '../../../../ResourceDiffVisualizer';
import ResourceDiffError from './ResourceDiffError';
import { selectors } from '../../../../../reducers';
import { REVISION_TYPES } from '../../../../../utils/constants';
import { getRevisionResourceLevelChanges, hasInvalidRevertResourceDiff } from '../../../../../utils/revisions';
import NotificationToaster from '../../../../NotificationToaster';

export default function ResourceDiffContent({ integrationId, type, parentUrl }) {
  const revisionResourceDiff = useSelector(state => selectors.revisionResourceDiff(state, integrationId));
  const hasResourceDiffError = useSelector(state => !!selectors.revisionResourceDiffError(state, integrationId));
  const isResourceComparisonInProgress = useSelector(state => selectors.isResourceComparisonInProgress(state, integrationId));
  const isDiffExpanded = useSelector(state => selectors.isDiffExpanded(state, integrationId));
  const resourceDiffInfo = useMemo(() => getRevisionResourceLevelChanges(revisionResourceDiff, type), [revisionResourceDiff, type]);

  if (isResourceComparisonInProgress) {
    return <Spinner centerAll />;
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
          Your revert is not allowed. Your operation is already on the same revision you&apos;re trying to revert to.
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
