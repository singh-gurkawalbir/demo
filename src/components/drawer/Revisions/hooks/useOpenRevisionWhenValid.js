
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import ErrorContent from '../../../ErrorContent';
import { REVISION_IN_PROGRESS_ERROR } from '../../../../utils/revisions';

export default function useOpenRevisionWhenValid({ integrationId, drawerURL}) {
  const [enquesnackbar] = useEnqueueSnackbar();
  const history = useHistory();
  const isAnyRevisionInProgress = useSelector(state =>
    !!selectors.isAnyRevisionInProgress(state, integrationId)
  );

  const openRevisionHandler = useCallback(() => {
    if (isAnyRevisionInProgress) {
      return enquesnackbar({
        message: <ErrorContent error={REVISION_IN_PROGRESS_ERROR} />,
        variant: 'error',
      });
    }
    if (drawerURL) {
      history.push(drawerURL);
    }
  },
  [isAnyRevisionInProgress, enquesnackbar, drawerURL, history]);

  return openRevisionHandler;
}
