import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useRouteMatch } from 'react-router-dom';
import CeligPagination from '../../../CeligoPagination';
import KeywordSearch from '../../../KeywordSearch';
import RefreshCard from '../RefreshCard';
import ErrorActions from '../ErrorActions';
import CeligoDivider from '../../../CeligoDivider';
import ToggleViewSelect from '../../../AFE/Drawer/actions/ToggleView';
import { useHandleNextAndPreviousErrorPage } from '../hooks/useHandleNextAndPreviousErrorPage';
import actions from '../../../../actions';
import { useEditRetryConfirmDialog } from '../hooks/useEditRetryConfirmDialog';
import OutlinedButton from '../../../Buttons/OutlinedButton';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';
import PurgeErrorAction from '../PurgeErrorAction';
import { selectors } from '../../../../reducers';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';

const rowsPerPageOptions = [10, 25, 50];

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

export default function ErrorTableFilters({ flowId, resourceId, isResolved, filterKey, flowJobId }) {
  const classes = useStyles();
  const [selectedComponent, setSelectedComponent] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();

  const purgeSuccessMessage = useSelector(state => selectors.purgeSuccessMessage(state));
  const showRetryDataChangedConfirmDialog = useEditRetryConfirmDialog({flowId, resourceId, isResolved});
  const onSearchFocus = useCallback(() => {
    showRetryDataChangedConfirmDialog();
  }, [showRetryDataChangedConfirmDialog]);

  const {
    hasErrors,
    errorObj,
    retryStatus,
    fetchErrors,
    isFreshDataLoad,
    paginationOptions,
    currPage,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useHandleNextAndPreviousErrorPage({flowId, resourceId, isResolved, filterKey, showRetryDataChangedConfirmDialog, flowJobId});

  const handleDownload = useCallback(() => {
    history.push(buildDrawerUrl({
      path: drawerPaths.ERROR_MANAGEMENT.V2.DOWNLOAD_ERRORS,
      baseUrl: match.url,
      params: { type: isResolved ? 'resolved' : 'open' },
    }));
  }, [match.url, history, isResolved]);

  const handleToggleChange = useCallback(event => {
    showRetryDataChangedConfirmDialog(() => {
      dispatch(actions.patchFilter(filterKey, {
        view: event.target.value,
        activeErrorId: '',
      }));
      dispatch(
        actions.analytics.gainsight.trackEvent('OPEN_ERRORS_VIEW_CHANGED', {view: event.target.value})
      );
    });
  }, [dispatch, filterKey, showRetryDataChangedConfirmDialog]);

  useEffect(() => {
    if (purgeSuccessMessage) {
      enqueueSnackbar({
        message: purgeSuccessMessage,
        variant: 'success',
      });
      dispatch(actions.errorManager.flowErrorDetails.purge.clear({flowId, resourceId}));
    }
  }, [enqueueSnackbar, dispatch, purgeSuccessMessage, flowId, resourceId]);

  return (

    <div className={classes.filtersErrorTable}>
      <div className={classes.header}>
        {
        hasErrors &&
          (
            <div className={classes.errorsKeywordSearch}>
              <KeywordSearch filterKey={filterKey} onFocus={onSearchFocus} />
            </div>
          )
        }
        {
          !!errorObj.errors.length &&
          <ErrorActions flowId={flowId} resourceId={resourceId} isResolved={isResolved} className={classes.errorActions} />
        }
        <div className={classes.refreshBtn}>
          <RefreshCard onRefresh={fetchErrors} retryStatus={retryStatus} disabled={!errorObj.updated || isFreshDataLoad} />
        </div>
      </div>
      <div className={classes.paginationWrapper}>
        {hasErrors && !isResolved && (
        <>
          <ToggleViewSelect
            variant="openErrorViews"
            filterKey={filterKey}
            defaultView="split"
            handleToggleChange={handleToggleChange}
          />
          <CeligoDivider position="left" />
        </>
        )}
        {!!errorObj.errors.length && (
          <>
            <CeligPagination
              {...paginationOptions}
              rowsPerPageOptions={rowsPerPageOptions}
              className={classes.tablePaginationRoot}
              count={errorObj.errors.length}
              page={currPage}
              rowsPerPage={rowsPerPage}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              resultPerPageLabel="Per page:"
            />
          </>
        )}
        {selectedComponent}
        {
          hasErrors && (
            <OutlinedButton
              data-test="downloadErrorButton"
              onClick={handleDownload}
              color="secondary">
              Download
            </OutlinedButton>
          )
        }
        {
          hasErrors && isResolved && (
            <PurgeErrorAction flowId={flowId} resourceId={resourceId} setSelectedComponent={setSelectedComponent} />
          )
        }
      </div>
    </div>
  );
}
