
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import ErrorContent from '../../../ErrorContent';
import { REVISION_IN_PROGRESS_ERROR, NO_CLONE_FAMILY_TO_PULL_FROM_ERROR } from '../../../../utils/revisions';

export default function useOpenRevisionWhenValid({ integrationId, drawerURL, isCreatePull }) {
  const [enquesnackbar] = useEnqueueSnackbar();
  const history = useHistory();
  const isAnyRevisionInProgress = useSelector(state =>
    !!selectors.isAnyRevisionInProgress(state, integrationId)
  );

  const hasNoCloneFamily = useSelector(state => selectors.hasNoCloneFamily(state, integrationId));

  const openRevisionHandler = useCallback(() => {
    if (isAnyRevisionInProgress) {
      return enquesnackbar({
        message: <ErrorContent error={REVISION_IN_PROGRESS_ERROR} />,
        variant: 'error',
      });
    }
    if (isCreatePull && hasNoCloneFamily) {
      // Incase of create pull, we show an error if there are no clones to pull from
      return enquesnackbar({
        message: <ErrorContent error={NO_CLONE_FAMILY_TO_PULL_FROM_ERROR} />,
        variant: 'error',
      });
    }
    if (drawerURL) {
      history.push(drawerURL);
    }
  },
  [isAnyRevisionInProgress, isCreatePull, hasNoCloneFamily, enquesnackbar, drawerURL, history]);

  return openRevisionHandler;
}
