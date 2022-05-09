import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Spinner from '../../../../Spinner';
import ResourceDiffVisualizer from '../../../../ResourceDiffVisualizer';
import ResourceDiffError from './ResourceDiffError';
import { selectors } from '../../../../../reducers';
import { getRevisionResourceLevelChanges } from '../../../../../utils/revisions';

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

  return (
    <ResourceDiffVisualizer
      integrationId={integrationId}
      diffs={resourceDiffInfo?.diffs}
      titles={resourceDiffInfo?.titles}
      forceExpand={isDiffExpanded}
    />
  );
}
