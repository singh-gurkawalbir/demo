import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useMemo, useCallback, useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../reducers';
import { FILTER_KEYS } from '../../../utils/errorManagement';
import ResourceTable from '../../ResourceTable';
import Spinner from '../../Spinner';
import ErrorTableFilters from './ErrorTableFilters';
import FetchErrorsHook from './FetchErrorsHook';
import actions from '../../../actions';
import NoResultTypography from '../../NoResultTypography';

const useStyles = makeStyles({
  hide: {
    display: 'none',
  },
  errorDetailsTable: {
    wordBreak: 'break-word',
    '& th': {
      wordBreak: 'normal',
    },
  },
  errorTableWrapper: {
    position: 'relative',
    height: '100%',
  },

});

export const useIsFreshLoadData = errorConfig => {
  const errorObj = useSelectorMemo(selectors.mkResourceFilteredErrorDetailsSelector, errorConfig);

  return !!((!errorObj.status || errorObj.status === 'requested') && !errorObj.nextPageURL);
};

export default function ErrorTable({ flowId, resourceId, isResolved, flowJobId }) {
  const classes = useStyles();
  const filterKey = isResolved ? FILTER_KEYS.RESOLVED : FILTER_KEYS.OPEN;

  const isAnyActionInProgress = useSelector(state =>
    selectors.isAnyActionInProgress(state, { flowId, resourceId })
  );
  const isFlowDisabled = useSelector(state =>
    selectors.resource(state, 'flows', flowId)?.disabled
  );

  const errorConfig = useMemo(() => ({
    flowId,
    resourceId,
    isResolved,
  }), [isResolved, flowId, resourceId]);

  const errorsInCurrPage = useSelectorMemo(selectors.mkResourceFilteredErrorsInCurrPageSelector, errorConfig);

  const isFreshDataLoad = useIsFreshLoadData(errorConfig);

  const actionProps = useMemo(
    () => ({
      resourceId,
      flowId,
      actionInProgress: isAnyActionInProgress,
      isResolved,
      isFlowDisabled,
    }),
    [flowId, isAnyActionInProgress, resourceId, isResolved, isFlowDisabled]
  );
  const dispatch = useDispatch();
  const errorFilter = useSelector(
    state => selectors.filter(state, FILTER_KEYS.OPEN), shallowEqual
  );
  const hasErrors = useSelector(
    state => selectors.hasResourceErrors(state, { flowId, resourceId, isResolved })
  );
  const keydownListener = useCallback(event => {
    event?.stopPropagation();
    if (errorFilter.view === 'drawer' && filterKey !== FILTER_KEYS.OPEN) {
      return;
    }
    const currIndex = errorsInCurrPage.findIndex(eachError => eachError.errorId === errorFilter.currentNavItem);

    if (!errorFilter.currentNavItem && currIndex < 0) {
      dispatch(actions.patchFilter(FILTER_KEYS.OPEN, {
        currentNavItem: errorsInCurrPage[0].errorId,
      }));

      return;
    }
    // enter key
    if (event.keyCode === 13) {
      dispatch(actions.patchFilter(FILTER_KEYS.OPEN, {
        activeErrorId: errorFilter.currentNavItem,
      }));

      return;
    }
    // up arrow key
    if (event.keyCode === 38) {
      const currIndex = errorsInCurrPage.findIndex(eachError => eachError.errorId === errorFilter.currentNavItem);

      if (currIndex === 0) {
        return;
      }
      dispatch(actions.patchFilter(FILTER_KEYS.OPEN, {
        currentNavItem: errorsInCurrPage[currIndex - 1]?.errorId,
      }));

      return;
    }
    // down arrow key
    if (event.keyCode === 40) {
      const currIndex = errorsInCurrPage.findIndex(eachError => eachError.errorId === errorFilter.currentNavItem);

      if (currIndex === errorsInCurrPage.length - 1) {
        return;
      }
      dispatch(actions.patchFilter(FILTER_KEYS.OPEN, {
        currentNavItem: errorsInCurrPage[currIndex + 1]?.errorId,
      }));
    }
  }, [errorFilter.currentNavItem, dispatch, errorsInCurrPage, errorFilter.view, filterKey]);

  useEffect(() => {
    if (errorFilter.view !== 'drawer' && filterKey === FILTER_KEYS.OPEN) {
      window.addEventListener('keydown', keydownListener, true);
    }

    return () => window.removeEventListener('keydown', keydownListener, true);
  }, [keydownListener, errorFilter.view, filterKey]);

  useEffect(() => {
    const currIndex = errorsInCurrPage.findIndex(eachError => eachError.errorId === errorFilter.activeErrorId);

    if (currIndex < 0 && !errorFilter.view && errorFilter.view === 'split') {
      dispatch(actions.patchFilter(FILTER_KEYS.OPEN, {
        activeErrorId: errorsInCurrPage[0]?.errorId,
        currentNavItem: errorsInCurrPage[0]?.errorId,
      }));
    }
  }, [errorsInCurrPage, errorFilter.activeErrorId, dispatch, errorFilter.view]);

  // TODO @Raghu: Refactor the pagination related code
  return (
    <div className={clsx(classes.errorTableWrapper)}>
      <FetchErrorsHook
        flowId={flowId}
        flowJobId={flowJobId}
        resourceId={resourceId}
        isResolved={isResolved}
        filterKey={filterKey}
      />
      {isFreshDataLoad ? (

        <Spinner centerAll />

      ) : (
        <>
          <ErrorTableFilters
            flowId={flowId}
            resourceId={resourceId}
            isResolved={isResolved}
            filterKey={filterKey}
          />
          {
            hasErrors ? (
              <ResourceTable
                resources={errorsInCurrPage}
                className={classes.errorDetailsTable}
                resourceType={filterKey}
                actionProps={actionProps}
            />
            ) : (
              <>
                <NoResultTypography>There don’t seem to be any more errors. You may have already retried or resolved them.
                  <br />
                  <br />
                  If “Refresh errors” is enabled, you can click it to retrieve additional errors.
                </NoResultTypography>
              </>
            )
          }

        </>
      )}
    </div>
  );
}
