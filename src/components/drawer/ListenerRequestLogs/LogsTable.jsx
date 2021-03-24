import React, { useEffect, useMemo, useCallback } from 'react';
import clsx from 'clsx';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import ResourceTable from '../../ResourceTable';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import Spinner from '../../Spinner';
import PreviewLogDetails from './PreviewLogDetails';
import SearchIcon from '../../icons/SearchIcon';
import IconTextButton from '../../IconTextButton';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { FILTER_KEY } from '../../../utils/listenerLogs';

const useStyles = makeStyles(theme => ({
  listContainer: {
    height: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
  noResultColumn: {
    gridTemplateColumns: '1fr',
  },
  tableWrapper: {
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    overflowY: 'auto',
  },
  textWrapper: {
    padding: theme.spacing(2),
  },
  previewWrapper: {
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    padding: theme.spacing(2),
    position: 'relative',
  },
  searchMoreWrapper: {
    textAlign: 'center',
    '& > button': {
      fontFamily: 'Roboto400',
      minWidth: 190,
      color: theme.palette.common.white,
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
      padding: theme.spacing(1, 5, 1, 5),
    },
  },
  searchMoreIcon: {
    height: 18,
  },
  searchMoreSpinner: {
    marginRight: theme.spacing(1),
    color: theme.palette.common.white,
  },
}));

export default function LogsTable({ flowId, exportId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const debugUntil = useSelector(state => {
    const resource = selectors.resource(state, 'exports', exportId);
    const {debugUntil} = resource || {};

    if (!debugUntil) {
      return;
    }
    if (moment().isAfter(moment(debugUntil))) {
      return;
    }

    return debugUntil;
  });
  const { hasNextPage, loadMoreStatus, logsStatus } = useSelector(state => {
    const l = selectors.listenerLogs(state, exportId);

    return {
      hasNextPage: !!l.nextPageURL,
      loadMoreStatus: l.loadMoreStatus,
      logsStatus: l.logsStatus,
    };
  }, shallowEqual);

  const hasDebugLogs = useSelector(state => !!selectors.logsSummary(state, exportId).length);
  const logsInCurrPage = useSelectorMemo(selectors.mkLogsInCurrPageSelector, exportId);
  const currPageFirstKey = logsInCurrPage[0]?.key;

  useEffect(() => () => {
    dispatch(actions.logs.listener.clear(exportId));
    dispatch(actions.clearFilter(FILTER_KEY));
  }, [dispatch, exportId]);

  useEffect(() => {
    dispatch(actions.logs.listener.request(flowId, exportId));
    if (debugUntil) {
      dispatch(actions.logs.listener.startLogsPoll(flowId, exportId));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // set the first key on the current page as default when user navigates b/w pages
    if (currPageFirstKey) {
      dispatch(actions.logs.listener.setActiveLog(exportId, currPageFirstKey));
    }
  }, [currPageFirstKey, dispatch, exportId]);

  const actionProps = useMemo(() => ({ flowId, exportId }), [exportId, flowId]);

  const loadMoreLogs = useCallback(() => dispatch(actions.logs.listener.request(flowId, exportId, true)), [dispatch, exportId, flowId]);

  if (!logsStatus || logsStatus === 'requested') {
    return (
      <Spinner centerAll />
    );
  }

  return (
    <>
      <div
        className={clsx(classes.listContainer, {
          [classes.noResultColumn]: !hasDebugLogs,
        })}>
        <div className={classes.tableWrapper}>
          <ResourceTable
            resources={logsInCurrPage}
            resourceType="listenerLogs"
            actionProps={actionProps}
            variant="slim" />
          {!hasDebugLogs && !hasNextPage && (
          <Typography className={classes.textWrapper}>
            You don’t have any debug log entries.
          </Typography>
          )}
          {hasNextPage && (
          <div className={classes.searchMoreWrapper}>
            <IconTextButton
              variant="outlined" color="primary"
              onClick={loadMoreLogs}>
              {loadMoreStatus === 'requested' ? (
                <>
                  <Spinner className={classes.searchMoreSpinner} size={18} />
                  Searching
                </>
              ) : (
                <>
                  <SearchIcon className={classes.searchMoreIcon} />
                  Search more
                </>
              )}
            </IconTextButton>
          </div>
          )}
        </div>
        {hasDebugLogs && (
          <div className={classes.previewWrapper}>
            <PreviewLogDetails flowId={flowId} exportId={exportId} />
          </div>
        )}
      </div>
    </>
  );
}
