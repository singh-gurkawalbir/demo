import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { dispatch } from 'd3';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../reducers';
import { FILTER_KEYS } from '../../../utils/errorManagement';
import ResourceTable from '../../ResourceTable';
import Spinner from '../../Spinner';
import ErrorDetailsPanel from './ErrorDetailsPanel';
import ErrorTableFilters from './ErrorTableFilters';
import FetchErrorsHook from './FetchErrorsHook';

const useStyles = makeStyles({
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
  },
  errorTableWrapper: {
    position: 'relative',
    height: '100%',
  },
  errorList: {
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'center',
  },
  errorTable: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    // flexShrink: 0,
    // flexBasis: 50,
  },
  errorDetailsPanel: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    // flexShrink: 0,
    // flexBasis: 50,
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
          <div className={classes.errorList}>
            <ResourceTable
              resources={errorsInCurrPage}
              className={classes.errorDetailsTable}
              resourceType={filterKey}
              actionProps={actionProps}
          />
            <ErrorDetailsPanel
              flowId={flowId}
              resourceId={resourceId}
              isResolved={isResolved}
              className={classes.errorDetailsPanel}
          />
          </div>
        </>
      )}
    </div>
  );
}
