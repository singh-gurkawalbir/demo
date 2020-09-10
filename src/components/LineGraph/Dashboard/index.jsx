import { makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import React, { useCallback, useState, useMemo } from 'react';
import { subHours } from 'date-fns';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import RefreshIcon from '../../icons/RefreshIcon';
import DateRangeSelector from '../../DateRangeSelector';
import FlowCharts from './FlowCharts';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import DynaMultiSelect from '../MultiSelect';

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
const flowsConfig = { type: 'flows'};

export default function LineGraphDrawer({ integrationId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [selectedResources, setSelectedResources] = useState([]);
  const [refresh, setRefresh] = useState();
  const [range, setRange] = useState({
    startDate: subHours(new Date(), 24).toISOString(),
    endDate: new Date().toISOString(),
  });
  const resourceList = useSelectorMemo(
    selectors.makeResourceListSelector,
    flowsConfig
  );
  const flowResources = useMemo(
    () =>
      resourceList.resources &&
      resourceList.resources.filter(flow => flow._integrationId === integrationId).map(f => ({_id: f._id, name: f.name})),
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
    (id, val) => {
      if (val.length < 9) {
        setSelectedResources(val);
      }
    },
    []
  );

  return (
    <div>
      <>
        <RefreshIcon className={classes.refreshIcon} onClick={handleRefreshClick} />
        <DateRangeSelector onSave={handleDateRangeChange} />
        <DynaMultiSelect
          name="flowResources"
          value={selectedResources}
          placeholder="Please select up to 8 flows"
          options={[
            {
              items: flowResources.map(r => ({
                value: r._id,
                label: r.name || r.id,
              })),
            },
          ]}
          onFieldChange={handleResourcesChange}
        />
      </>
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
