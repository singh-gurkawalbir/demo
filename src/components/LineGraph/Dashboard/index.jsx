import { makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useState, useMemo } from 'react';
import { subHours } from 'date-fns';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import RefreshIcon from '../../icons/RefreshIcon';
import DateRangeSelector from '../../DateRangeSelector';
import FlowCharts from './FlowCharts';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import SelectResource from '../SelectResource';
import ButtonGroup from '../../ButtonGroup';
import IconTextButton from '../../IconTextButton';

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
  linegraphActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(0),
  },
  linegraphContainer: {
    marginTop: theme.spacing(-5),
  },
}));
const flowsConfig = { type: 'flows'};

export default function LineGraphDrawer({ integrationId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState();
  const [range, setRange] = useState({
    startDate: subHours(new Date(), 24).toISOString(),
    endDate: new Date().toISOString(),
  });
  const preferences = useSelector(state => selectors.userPreferences(state)?.linegraphs) || {};
  const [selectedResources, setSelectedResources] = useState(preferences[integrationId] || []);

  const resourceList = useSelectorMemo(
    selectors.makeResourceListSelector,
    flowsConfig
  );
  const flowResources = useMemo(
    () =>
      resourceList.resources &&
      resourceList.resources.filter(flow => flow._integrationId === integrationId && !flow.disabled).map(f => ({_id: f._id, name: f.name})),
    [resourceList.resources, integrationId]
  );
  const handleRefreshClick = useCallback(() => {
    setRefresh(new Date().getTime());
  }, []);
  const handleDateRangeChange = useCallback(
    range => {
      dispatch(actions.flowMetrics.clear(integrationId));
      setRange(Array.isArray(range) ? range[0] : range);
    },
    [dispatch, integrationId]
  );
  const handleResourcesChange = useCallback(
    val => {
      setSelectedResources(val);
      dispatch(
        actions.user.preferences.update({
          linegraphs: {
            ...preferences,
            [integrationId]: val,
          },
        })
      );
    },
    []
  );

  return (
    <div className={classes.linegraphContainer}>
      <div className={classes.linegraphActions}>
        <ButtonGroup>
          <IconTextButton onClick={handleRefreshClick}>
            <RefreshIcon /> Refresh
          </IconTextButton>

          <DateRangeSelector onSave={handleDateRangeChange} />
          <SelectResource
            integrationId={integrationId}
            selectedResources={selectedResources}
            flowResources={flowResources}
            onSave={handleResourcesChange}
        />
        </ButtonGroup>
      </div>
      <FlowCharts
        integrationId={integrationId}
        selectedResources={selectedResources}
        range={range}
        refresh={refresh}
        className={classes.scheduleContainer}
      />
    </div>
  );
}
