import React, { useEffect, useMemo, useCallback } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ResourceTable from '../../ResourceTable';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import Spinner from '../../Spinner';
import PreviewLogDetails from './PreviewLogDetails';
import SearchIcon from '../../icons/SearchIcon';
import IconTextButton from '../../IconTextButton';

const useStyles = makeStyles(theme => ({
  listContainer: {
    height: '100%',
    display: 'flex',
    overflowY: 'auto',
  },
  tableWrapper: {
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    flexGrow: 1,
  },
  previewWrapper: {
    flexDirection: 'column',
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    flexGrow: 4,
    padding: theme.spacing(2),
  },
  searchMoreWrapper: {
    textAlign: 'center',
    '& > button': {
      minWidth: 70,
      color: theme.palette.common.white,
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
      padding: theme.spacing(1, 1, 1, 1),
    },
  },
  searchMoreIcon: {
    height: 18,
  },
}));

export default function LogsTable({ flowId, exportId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const nextPageURL = useSelector(state => selectors.listenerLogs(state, exportId).nextPageURL);
  const hasDebugLogs = useSelector(state => !!selectors.logsSummary(state, exportId).length);
  const logsStatus = useSelector(state => selectors.logsStatus(state, exportId));
  const logsInCurrPage = useSelector(state => selectors.logsInCurrPageSelector(state, exportId), shallowEqual);
  const currPageFirstKey = logsInCurrPage[0]?.key;

  useEffect(() => {
    dispatch(actions.logs.listener.request(flowId, exportId));
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
      {!hasDebugLogs && !nextPageURL ? (
        <Typography variant="h5">
          You don’t have any debug log entries.
        </Typography>
      ) : (
        <div className={classes.listContainer}>
          <div className={classes.tableWrapper}>
            <ResourceTable
              resources={logsInCurrPage}
              resourceType="listenerLogs"
              actionProps={actionProps}
              variant="slim" />
            {!hasDebugLogs && nextPageURL && (
              <div className={classes.searchMoreWrapper}>
                <IconTextButton
                  variant="outlined" color="primary"
                  onClick={loadMoreLogs}>
                  <><SearchIcon className={classes.searchMoreIcon} />
                    Search more
                  </>
                </IconTextButton>
              </div>
            )}
          </div>
          <div className={classes.previewWrapper}>
            <PreviewLogDetails flowId={flowId} exportId={exportId} />
          </div>
        </div>
      )}
    </>
  );
}
