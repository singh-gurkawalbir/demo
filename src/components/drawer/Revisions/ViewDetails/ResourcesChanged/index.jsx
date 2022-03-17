import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../../../../Spinner';
import ResourceDiffVisualizer from '../../../../ResourceDiffVisualizer';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import { getRevisionResourceLevelChanges } from '../../../../../utils/revisions';

export default function ResourcesChanged({ integrationId, revisionId }) {
  const dispatch = useDispatch();

  // selectors
  const isResourceComparisonInProgress = useSelector(state => selectors.isResourceComparisonInProgress(state, integrationId));
  const revisionResourceDiff = useSelector(state => selectors.revisionResourceDiff(state, integrationId));
  const isDiffExpanded = useSelector(state => selectors.isDiffExpanded(state, integrationId));
  // end selectors

  const resourceDiffInfo = useMemo(() => {
    if (revisionResourceDiff) {
      return getRevisionResourceLevelChanges(revisionResourceDiff);
    }
  }, [revisionResourceDiff]);

  useEffect(() => {
    dispatch(actions.integrationLCM.compare.revisionChanges(integrationId, revisionId));

    return () => dispatch(actions.integrationLCM.compare.clear(integrationId));
  }, [dispatch, integrationId, revisionId]);

  if (isResourceComparisonInProgress) {
    return <Spinner centerAll />;
  }

  return (
    <ResourceDiffVisualizer
      integrationId={integrationId}
      diffs={resourceDiffInfo?.diffs}
      forceExpand={isDiffExpanded}
    />
  );
}
