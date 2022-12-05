
import { useCallback, useEffect } from 'react';
import { FILTER_KEYS } from '../../../../utils/errorManagement';
import actions from '../../../../actions';
import useKeyboardNavigation from '../../../../hooks/useKeyboardNavigation';

export default function useKeydownListener({showRetryDataChangedConfirmDialog, errorsInPage, filterKey, dispatch, activeErrorId = 0, isSplitView, handleNext}) {
  const currenctActiveIndex = errorsInPage.findIndex(eachError => eachError.errorId === activeErrorId);
  const downKeyLister = useCallback(currIndex => {
    if ((currenctActiveIndex === currIndex && currIndex >= 0) || filterKey !== FILTER_KEYS.OPEN || isSplitView) {
      return;
    }

    showRetryDataChangedConfirmDialog(() => {
      dispatch(actions.patchFilter(FILTER_KEYS.OPEN, {
        activeErrorId: errorsInPage[currIndex]?.errorId,
      }));
      handleNext(errorsInPage[currIndex]?.errorId);
    });
  }, [currenctActiveIndex, dispatch, errorsInPage, filterKey, handleNext, isSplitView, showRetryDataChangedConfirmDialog]);

  const { currentFocussed, resetKeyboardFocus } = useKeyboardNavigation({listLength: errorsInPage.length, initialFocusIndex: currenctActiveIndex});

  useEffect(() => {
    if (!isSplitView) {
      resetKeyboardFocus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKeyboardFocus]);

  useEffect(() => {
    if (currentFocussed > -1) {
      downKeyLister(currentFocussed);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFocussed]);
}

