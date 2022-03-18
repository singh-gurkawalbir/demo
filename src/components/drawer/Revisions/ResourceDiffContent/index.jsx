import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import Spinner from '../../../Spinner';
import ResourceDiffVisualizer from '../../../ResourceDiffVisualizer';
import { selectors } from '../../../../reducers';
import { getRevisionResourceLevelChanges } from '../../../../utils/revisions';

const useStyles = makeStyles(theme => ({
  error: {
    color: theme.palette.error.main,
  },
}));

export default function ResourceDiffContent({ integrationId }) {
  const classes = useStyles();
  // selectors
  const revisionResourceDiff = useSelector(state => selectors.revisionResourceDiff(state, integrationId));
  const revisionResourceDiffError = useSelector(state => selectors.revisionResourceDiffError(state, integrationId));
  const isResourceComparisonInProgress = useSelector(state => selectors.isResourceComparisonInProgress(state, integrationId));
  const isDiffExpanded = useSelector(state => selectors.isDiffExpanded(state, integrationId));
  // end selectors
  const resourceDiffInfo = useMemo(() => {
    if (revisionResourceDiff) {
      return getRevisionResourceLevelChanges(revisionResourceDiff);
    }
  }, [revisionResourceDiff]);

  if (isResourceComparisonInProgress) {
    return <Spinner centerAll />;
  }
  if (revisionResourceDiffError) {
    return <div className={classes.error}> {revisionResourceDiffError} </div>;
  }

  return (
    <ResourceDiffVisualizer
      integrationId={integrationId}
      diffs={resourceDiffInfo?.diffs}
      forceExpand={isDiffExpanded}
    />
  );
}
