import React, { useMemo, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { DEFAULT_ROWS_PER_PAGE } from '../../../../utils/errorManagement';
import CeligPagination from '../../../CeligoPagination';
import KeywordSearch from '../../../KeywordSearch';
import RefreshCard from '../RefreshCard';
import ErrorActions from '../ErrorActions';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import { useIsFreshLoadData } from '..';
import { useFetchErrors } from '../FetchErrorsHook';

const rowsPerPageOptions = [10, 25, 50];
const emptySet = [];
const emptyObj = {};

const useStyles = makeStyles(theme => ({
  errorsKeywordSearch: {
    width: '250px',
    float: 'left',
    '& > div:first-child': {
      background: theme.palette.common.white,
      '& > div[class*="MuiInputBase-root"]': {
        width: '100%',
        '& > input': {
          width: '100%',
          height: '100%',
        },
      },
    },

  },
  header: {
    paddingBottom: theme.spacing(3),
    display: 'flex',
  },
  tablePaginationRoot: {
    float: 'right',
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 18,
    whiteSpace: 'nowrap',
    marginLeft: theme.spacing(2),
  },
  refreshBtn: {
    marginLeft: theme.spacing(2),
  },
  errorActions: {
    position: 'relative',
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(1),
    '&:after': {
      content: "''",
      position: 'absolute',
      width: '1px',
      height: '75%',
      top: '15%',
      backgroundColor: theme.palette.secondary.lightest,
      right: theme.spacing(-2),
    },
  },
  paginationWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  filtersErrorTable: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

export default function ErrorTableFilters({flowId, resourceId, isResolved, filterKey}) {
  const classes = useStyles();

  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const fetchErrors = useFetchErrors({
    filterKey,
    flowId,
    resourceId,
    isResolved,
  });
  const errorConfig = useMemo(() => ({
    flowId,
    resourceId,
    isResolved,
  }), [isResolved, flowId, resourceId]);

  const errorObj = useSelectorMemo(selectors.mkResourceFilteredErrorDetailsSelector, errorConfig);
  const isFreshDataLoad = useIsFreshLoadData(errorConfig);

  if (!errorObj.errors) {
    errorObj.errors = emptySet;
  }
  const errorType = isResolved ? 'resolved' : 'open';
  const errorFilter = useSelector(
    state => selectors.filter(state, filterKey), shallowEqual
  );
  const { currPage = 0, rowsPerPage = DEFAULT_ROWS_PER_PAGE } = errorFilter.paging || emptyObj;

  const hasErrors = useSelector(
    state => selectors.hasResourceErrors(state, { flowId, resourceId, isResolved })
  );
  const handleChangeRowsPerPage = useCallback(e => {
    dispatch(
      actions.patchFilter(filterKey, {
        paging: {
          ...errorFilter.paging,
          rowsPerPage: parseInt(e.target.value, 10),
        },
      })
    );
  }, [dispatch, filterKey, errorFilter.paging]);
  const handleChangePage = useCallback(
    (e, newPage) => dispatch(
      actions.patchFilter(filterKey, {
        paging: {
          ...errorFilter.paging,
          currPage: newPage,
        },
      })
    ),
    [dispatch, filterKey, errorFilter.paging]
  );
  const handleDownload = useCallback(() => {
    history.push(`${match.url}/download/${errorType}`);
  }, [match.url, history, errorType]);

  const paginationOptions = useMemo(
    () => ({
      // fetch more errors
      loadMoreHandler: () => fetchErrors(true),
      hasMore: !!errorObj.nextPageURL,
      loading: errorObj.status === 'requested',
    }),
    [fetchErrors, errorObj.nextPageURL, errorObj.status]
  );

  return (

    <div className={classes.filtersErrorTable}>
      <div className={classes.header}>
        {
        hasErrors &&
          (
            <div className={classes.errorsKeywordSearch}>
              <KeywordSearch filterKey={filterKey} />
            </div>
          )
        }
        {
          !!errorObj.errors.length &&
          <ErrorActions flowId={flowId} resourceId={resourceId} isResolved={isResolved} className={classes.errorActions} />

        }
        <div className={classes.refreshBtn}>
          <RefreshCard onRefresh={fetchErrors} disabled={!errorObj.updated || isFreshDataLoad} />
        </div>
      </div>
      <div className={classes.paginationWrapper}>
        {!!errorObj.errors.length && (
        <CeligPagination
          {...paginationOptions}
          rowsPerPageOptions={rowsPerPageOptions}
          className={classes.tablePaginationRoot}
          count={errorObj.errors.length}
          page={currPage}
          rowsPerPage={rowsPerPage}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
      />
        )}
        {
            hasErrors && (
            <Button
              variant="outlined"
              color="secondary"
              className={classes.btnActions}
              onClick={handleDownload}>
              Download
            </Button>
            )
          }

      </div>
    </div>
  );
}
