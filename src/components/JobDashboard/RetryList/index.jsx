import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import ResourceTable from '../../ResourceTable';
import { isNewId } from '../../../utils/resource';
import RetryTableFilters from './RetryTableFilters';
import NoResultTypography from '../../NoResultTypography';
import { DEFAULT_FILTERS, FILTER_KEYS } from '../../../utils/errorManagement';
import messageStore, { message } from '../../../utils/messageStore';

const useStyles = makeStyles(() => ({
  retriesList: {
    maxHeight: 'calc(100vh - 320px)',
    overflow: 'auto',
  },
}));

export default function RetryList({ flowId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const { resourceId } = match.params;

  const filters = useSelector(state => selectors.filter(state, FILTER_KEYS.RETRIES));
  const retries = useSelector(state => selectors.retryList(state, flowId, resourceId, filters));
  const retryListStatus = useSelector(state => selectors.retryListStatus(state, flowId, resourceId));

  const actionProps = useMemo(() => ({
    resourceId,
    flowId,
  }), [flowId, resourceId]);

  useEffect(() => {
    dispatch(actions.patchFilter(FILTER_KEYS.RETRIES, filters || DEFAULT_FILTERS.RETRIES));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (flowId && !isNewId(flowId)) {
      dispatch(
        actions.errorManager.retries.request({
          flowId,
          resourceId,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, flowId]);

  return (
    <>
      <RetryTableFilters flowId={flowId} resourceId={resourceId} filterKey={FILTER_KEYS.RETRIES} />
      {retryListStatus === 'requested' ? (
        <Spinner center="screen" />
      ) : (
        <div className={classes.retriesList}>
          <ResourceTable
            resources={retries}
            filterKey={FILTER_KEYS.RETRIES}
            resourceType="retries"
            actionProps={actionProps} />
          {!retries.length && (
          <div>
            <NoResultTypography>{messageStore('NO_RESULT', {message: 'retries'})}</NoResultTypography>
            <NoResultTypography>{message.RETRY.ERRORS_RETRIEVE}</NoResultTypography>
            {/* <NoResultTypography>{messageDisplay('RETRY.ERRORS_RETRIEVE')}</NoResultTypography> */}
          </div>
          )}
        </div>
      )}
    </>
  );
}
