import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import clsx from 'clsx';
import React, { useMemo, useCallback, useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import actions from '../../../actions';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../reducers';
import { FILTER_KEYS } from '../../../utils/errorManagement';
import NoResultTypography from '../../NoResultTypography';
import ResourceTable from '../../ResourceTable';
import Spinner from '../../Spinner';
import ErrorDetailsPanel from './ErrorDetailsPanel';
import ErrorTableFilters from './ErrorTableFilters';
import FetchErrorsHook from './hooks/useFetchErrors';

const useStyles = makeStyles(theme => ({
  hide: {
    display: 'none',
  },
  errorDetailsTable: {
    wordBreak: 'break-word',
    '& th': {
      wordBreak: 'normal',
    },
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    flexBasis: '60%',
  },
  errorTableWrapper: {
    position: 'relative',
    height: '100%',
  },
  errorList: {
    display: 'flex',
    flexDirection: 'row',
    flexBasis: '40%',
  },
  errorTable: {
    wordBreak: 'break-word',
    '& th': {
      wordBreak: 'normal',
    },
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    flexBasis: '60%',
    overflow: 'auto',
  },
  errorDetailsPanel: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  baseFormWithPreview: {
    display: 'grid',
    gridTemplateColumns: '60% 2% 38%',
    gridColumnGap: theme.spacing(0.5),
  },
  resourceFormWrapper: {
    width: '100%',
    overflow: 'auto',
  },
  panelWrapper: {
    width: '100%',
    overflow: 'auto',
  },
  divider: {
    margin: theme.spacing(1, 1, 1),
    marginLeft: theme.spacing(0),
  },
}));

export const useIsFreshLoadData = errorConfig => {
  const errorObj = useSelectorMemo(selectors.mkResourceFilteredErrorDetailsSelector, errorConfig);

  return !!((!errorObj.status || errorObj.status === 'requested') && !errorObj.nextPageURL);
};

const ErrorTableWithPanel = ({
  errorsInCurrPage,
  filterKey,
  actionProps,
  isSplitView,
  resourceId,
  isResolved,
  flowId,
  keydownListener,
}) => {
  const classes = useStyles();

  return isSplitView && !isResolved
    ? (
      <div className={classes.baseFormWithPreview}>
        <div className={classes.errorTable}>
          <ResourceTable
            resources={errorsInCurrPage}
            className={classes.resourceFormWrapper}
            resourceType="splitViewOpenErrors"
            actionProps={actionProps}
            keydownListener={keydownListener}
          />
        </div>
        <Divider
          orientation="vertical"
          className={clsx(classes.divider)}
        />
        <div className={classes.errorDetailsPanel}>
          <ErrorDetailsPanel
            flowId={flowId}
            resourceId={resourceId}
            isResolved={isResolved}
          />
        </div>
      </div>
    )
    : (
      <ResourceTable
        resources={errorsInCurrPage}
        resourceType={filterKey}
        actionProps={actionProps}
        className={classes.errorDetailsTable}
      />
    );
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
  const isSplitView = (filterKey === FILTER_KEYS.OPEN && errorFilter.view !== 'drawer');
  const hasErrors = useSelector(
    state => selectors.hasResourceErrors(state, { flowId, resourceId, isResolved })
  );
  const keydownListener = useCallback(event => {
    // event?.stopPropagation();
    if (!isSplitView) {
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
  }, [errorFilter.currentNavItem, dispatch, errorsInCurrPage, isSplitView]);

  // useEffect(() => {
  //   if (isSplitView) {
  //     window.addEventListener('keydown', keydownListener, true);
  //   }

  //   return () => window.removeEventListener('keydown', keydownListener, true);
  // }, [isSplitView, keydownListener]);

  useEffect(() => {
    const currIndex = errorsInCurrPage.findIndex(eachError => eachError.errorId === errorFilter.activeErrorId);

    if (currIndex < 0 && isSplitView) {
      dispatch(actions.patchFilter(FILTER_KEYS.OPEN, {
        activeErrorId: errorsInCurrPage[0]?.errorId,
        currentNavItem: errorsInCurrPage[0]?.errorId,
      }));
    }
  }, [errorsInCurrPage, errorFilter.activeErrorId, dispatch, isSplitView]);

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

          {hasErrors ? (
            <ErrorTableWithPanel
              errorsInCurrPage={errorsInCurrPage}
              filterKey={filterKey}
              actionProps={actionProps}
              resourceId={resourceId}
              isSplitView={isSplitView}
              flowId={flowId}
              isResolved={isResolved}
              keydownListener={keydownListener}
            />
          ) : (
            <NoResultTypography>There don’t seem to be any more errors. You may have already retried or resolved them.
              <br />
              <br />
              If “Refresh errors” is enabled, you can click it to retrieve additional errors.
            </NoResultTypography>
          )}
        </>
      )}
    </div>
  );
}

