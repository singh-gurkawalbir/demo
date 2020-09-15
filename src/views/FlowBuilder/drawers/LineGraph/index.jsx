import { makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { subHours } from 'date-fns';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { selectors } from '../../../../reducers';
import util from '../../../../utils/array';
import actions from '../../../../actions';
import RightDrawer from '../../../../components/drawer/Right';
import DateRangeSelector from '../../../../components/DateRangeSelector';
import FlowCharts from '../../../../components/LineGraph/Flow';
import DynaMultiSelect from '../../../../components/LineGraph/SelectResource';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import RefreshIcon from '../../../../components/icons/RefreshIcon';
import IconTextButton from '../../../../components/IconTextButton';

const useStyles = makeStyles(theme => ({
  scheduleContainer: {
    width: '100%',
    overflowX: 'hidden',
    marginTop: -1,
    padding: theme.spacing(-1),
    '& > div': {
      padding: theme.spacing(3, 0),
    },
  },
}));

const getRoundedDate = (d = new Date(), offsetInMins, isFloor) => {
  const ms = 1000 * 60 * offsetInMins; // convert minutes to ms

  return new Date(isFloor ? (Math.floor(d.getTime() / ms) * ms) : (Math.ceil(d.getTime() / ms) * ms));
};

export default function LineGraphDrawer({ flowId }) {
  const match = useRouteMatch();
  const { integrationId } = match.params;
  const parentUrl = match.url;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [selectedResources, setSelectedResources] = useState([flowId]);
  const [range, setRange] = useState({
    startDate: subHours(new Date(), 24).toISOString(),
    endDate: new Date().toISOString(),
  });

  const latestJobDetails = useSelector(state => selectors.latestJobMap(state, integrationId));
  const latestJob = useMemo(() => {
    if (latestJobDetails && latestJobDetails.data) {
      return latestJobDetails.data.find(job => job._flowId === flowId);
    }
  }, [flowId, latestJobDetails]);
  const flowResources = useSelectorMemo(selectors.mkflowResources, flowId);

  const customPresets = useMemo(() => {
    if (latestJob) {
      const startDate = getRoundedDate(new Date(latestJob.createdAt), 1, true);
      const endDate = getRoundedDate(latestJob.endedAt ? new Date(latestJob.endedAt) : new Date(), 1);

      // we aggregate data per hour when range is greater than 4 hours or run period is more than 7 days ago,
      // so the actual flow start and end may miss the aggregate window.
      // hence add -1 and +1 hour to actual flow run range
      if (moment().diff(moment(startDate), 'days') > 7 ||
       moment(endDate).diff(moment(startDate), 'hours') > 4) {
        startDate.setHours(startDate.getHours() - 1);
        endDate.setHours(endDate.getHours() + 1);
      } else {
        // Add -1 and +1 minute range if flow run is less than 4 hours and in last 7 days

        startDate.setMinutes(startDate.getMinutes() - 2);
        endDate.setMinutes(endDate.getMinutes() + 2);
      }

      return [{
        label: 'Last run',
        range: () => ({
          startDate,
          endDate,
        }),
      }];
    }

    return [];
  }, [latestJob]);

  useEffect(() => {
    if (!latestJobDetails || !latestJobDetails.status) {
      dispatch(actions.errorManager.integrationLatestJobs.request({ integrationId }));
    }
  }, [dispatch, integrationId, latestJobDetails]);

  const handleClose = useCallback(() => {
    history.push(parentUrl);
  }, [history, parentUrl]);
  const handleDateRangeChange = useCallback(
    range => {
      dispatch(actions.flowMetrics.clear(flowId));
      setRange(Array.isArray(range) ? range[0] : range);
    },
    [dispatch, flowId]
  );
  const handleRefresh = useCallback(() => {
    dispatch(actions.flowMetrics.clear(flowId));
  }, [dispatch, flowId]);

  const handleResourcesChange = useCallback(
    val => {
      if (!util.areArraysEqual(val, selectedResources, {ignoreOrder: true})) {
        dispatch(actions.flowMetrics.clear(flowId));
        setSelectedResources(val);
      }
    },
    []
  );

  const action = useMemo(
    () => (
      <>
        <IconTextButton onClick={handleRefresh}>
          <RefreshIcon /> Refresh
        </IconTextButton>
        <DateRangeSelector onSave={handleDateRangeChange} customPresets={customPresets} />
        <DynaMultiSelect
          selectedResources={selectedResources}
          flowResources={flowResources}
          isFlow
          onSave={handleResourcesChange}
        />
      </>
    ),
    [handleRefresh, handleDateRangeChange, customPresets, selectedResources, flowResources, handleResourcesChange]
  );

  return (
    <RightDrawer
      anchor="right"
      title="Dashboard"
      height="tall"
      width="full"
      actions={action}
      variant="permanent"
      onClose={handleClose}
      path="charts">
      <FlowCharts
        flowId={flowId}
        selectedResources={selectedResources}
        range={range}
        className={classes.scheduleContainer}
      />
    </RightDrawer>
  );
}
