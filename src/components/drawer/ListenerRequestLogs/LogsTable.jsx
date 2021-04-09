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
    gridTemplateColumns: '1fr 2fr',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  noResultColumn: {
    gridTemplateColumns: '1fr',
  },
  tableWrapper: {
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
    borderRight: `1px solid ${theme.palette.secondary.lightest}`,
    overflowY: 'auto',
    minWidth: '560px',
    [theme.breakpoints.down('md')]: {
      minWidth: 'unset',
    },
  },
  textWrapper: {
    padding: theme.spacing(2),
  },
  previewWrapper: {
    position: 'relative',
    padding: theme.spacing(3, 2),
  },
  searchMoreWrapper: {
    textAlign: 'center',
    margin: theme.spacing(2, 0),
  },
  searchButton: {
    color: theme.palette.common.white,
    minWidth: 190,
    padding: theme.spacing(1, 5),
  },
  iconSearchBtn: {
    fontSize: 16,
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
            actionProps={actionProps} />
          {!hasDebugLogs && !hasNextPage && (
          <Typography className={classes.textWrapper}>
            You don’t have any debug log entries.
          </Typography>
          )}
          {hasNextPage && (
          <div className={classes.searchMoreWrapper}>
            <IconTextButton
              variant="outlined"
              color="primary"
              className={classes.searchButton}
              onClick={loadMoreLogs}>
              {loadMoreStatus === 'requested' ? (
                <>
                  <Spinner className={classes.iconSearchBtn} size="small" />
                  Searching
                </>
              ) : (
                <>
                  <SearchIcon className={classes.iconSearchBtn} />
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
