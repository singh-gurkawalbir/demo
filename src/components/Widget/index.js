/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useCallback, useMemo, useEffect} from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Card from '@mui/material/Card';
import { addDays, startOfDay } from 'date-fns';
import { Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import DefaultDashboard from '../../views/Dashboard/panels/AdminDashboard/components/DefaultDashboard';
import '../../views/Dashboard/panels/AdminDashboard/Styles/widget.css';
import { selectors } from '../../reducers';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import actions from '../../actions';
import PanelHeader from '../PanelHeader';
import MuiBox from '../BoxWidget';
import BarGraph from '../Graphs/BarGraph';
import LineGraph from '../Graphs/LineGraph';
import { getSelectedRange } from '../../utils/flowMetrics';
import DateRangeSelector from '../DateRangeSelector';
import SelectResource from '../LineGraph/SelectResource';
import CeligoSelect from '../CeligoSelect';
import ActionGroup from '../ActionGroup';
import { COMM_STATES } from '../../reducers/comms/networkComms';
import { transformData, transformData1, transformData2 } from '../../views/Dashboard/panels/AdminDashboard/components/Transform';

const defaultRange = {
  startDate: startOfDay(addDays(new Date(), -29)).toISOString(),
  endDate: new Date().toISOString(),
  preset: 'last30days',
};

export default function Widget({
  id,
  title,
  graphType,
  graphData,
  childId,
  graphPrefrence,
  integrationId,
}) {
  //! THIS WHOLE PART IS ABOUT THE DATE, RANGE AND INTEGRATION LEVEL
  const dispatch = useDispatch();
  const flowGroupingsSections = useSelectorMemo(selectors.mkFlowGroupingsSections, integrationId);
  const isIntegrationAppV1 = useSelector(state => selectors.isIntegrationAppV1(state, integrationId));
  const hasGrouping = !!flowGroupingsSections || isIntegrationAppV1;
  const [flowCategory, setFlowCategory] = useState();
  const groupings = useSelectorMemo(selectors.mkIntegrationFlowGroups, integrationId);
  const preferences = useSelector(state => selectors.userOwnPreferences(state)?.linegraphs) || {};
  const { rangePreference, resourcePreference } = useMemo(() => {
    const preference = preferences[integrationId] || {};

    return {
      rangePreference: preference.range ? getSelectedRange(preference.range) : defaultRange,
      resourcePreference: preference.resource || [integrationId],
    };
  }, [integrationId, preferences]);

  const [selectedResources, setSelectedResources] = useState(resourcePreference);

  const [refresh] = useState();
  const [range, setRange] = useState(rangePreference);

  const flowResources = useSelectorMemo(selectors.mkIntegrationFlowsByGroup, integrationId, childId, flowCategory);
  const filteredFlowResources = useMemo(() => {
    const flows = flowResources.map(f => ({_id: f._id, name: f.name || `Unnamed (id: ${f._id})`}));

    return [{_id: integrationId, name: 'Integration-level'}, ...flows];
  }, [flowResources, integrationId]);

  const handleFlowCategoryChange = useCallback(e => {
    setFlowCategory(e.target.value);
  }, []);

  const handleDateRangeChange = useCallback(
    range => {
      dispatch(actions.flowMetrics.clear(integrationId));
      setRange(getSelectedRange(range));
      dispatch(
        actions.user.preferences.update({
          linegraphs: {
            ...preferences,
            [integrationId]: {
              ...preferences[integrationId],
              range,
              resource: selectedResources,
            },
          },
        })
      );
    },
    [dispatch, integrationId, preferences, selectedResources]
  );

  const handleResourcesChange = useCallback(
    val => {
      setSelectedResources(val);
      dispatch(
        actions.user.preferences.update({
          linegraphs: {
            ...preferences,
            [integrationId]: {
              ...preferences[integrationId],
              range,
              resource: val,
            },
          },
        })
      );
    },
    [dispatch, integrationId, preferences, range]
  );

  // console.log(range);
  const sections = useMemo(() => groupings.map(s => <MenuItem key={s.titleId || s.sectionId} value={s.titleId || s.sectionId}>{s.title}</MenuItem>), [groupings]);

  // //! THIS PART REPRESENTS THE JOB RECORD AREA
  const [sendQuery, setSendQuery] = useState(!!selectedResources.length);

  const metricData =
  useSelector(
    state => selectors.flowMetricsData(state, integrationId),
    shallowEqual
  ) || {};

  useEffect(() => {
    if (selectedResources.length) {
      setSendQuery(true);
    }
  }, [selectedResources, range, refresh]);

  useEffect(() => {
    if (sendQuery && integrationId === 'none') {
      dispatch(actions.flowMetrics.request('integrations', integrationId, { range, selectedResources }));
      setSendQuery(false);
    }
  }, [metricData, dispatch, integrationId, range, sendQuery, selectedResources]);

  if (metricData.status === COMM_STATES.ERROR) {
    return <Typography>Error occured</Typography>;
  }
  const flowData = metricData.data;

  //! THIS PART IS ABOUT THE GRAPHS
  let finalData = graphData;
  const connectionName = 'connections';
  const flowName = 'flows';

  if (id === '3') {
    finalData = transformData(flowData);
  } else if (id === '1' || id === '0') {
    finalData = transformData1(graphData);
  } else if (id === '2') {
    finalData = transformData2(graphData);
  } else if (id === '5') {
    return <MuiBox data={graphData} value={connectionName} />;
  } else if (id === '6') {
    return <MuiBox data={graphData} value={flowName} />;
  } else {
    finalData = graphData;
  }
  const [data, setData] = useState(finalData);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleBarClick = useCallback(dataDD => {
    const data1 = {
      ids: data.ids,
      values: [
        data.values.find(d => d[data.ids.XAxis] === dataDD.activeLabel),
      ],
    };

    setData(data1);
  });

  // console.log(range);
  const options = [
    {
      label: 'Line',
      value: 'Line',
      config: data => (
        <LineGraph
          data={data} color={graphPrefrence.color}
        />
      ),
    },
    {
      label: 'Bar',
      value: 'Bar',
      config: data => (
        <BarGraph
          data={data}
          color={graphPrefrence.color}
          onChange={handleBarClick}
          range={range}
           />
      ),
    },
  ];

  const [impl] = useState(
    options.find(opt => opt.label === graphType)
  );

  useEffect(() => {
    if (id === '3') {
      setData(transformData(flowData));
    }
  }, [flowData, id, setData]);

  return (
    <Card
      variant="outlined"
      sx={{
        // minHeight: "300px",
        // minWidth: "300px",
        height: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 1,
        padding: '10px',
      }}
    >
      <div className="root">
        <div className="header">
          <PanelHeader
            title={title}
            infoText="To Be Added..."
           />
          <div className="spacer" />
          <ActionGroup>
            {/* <TextButton onClick={handleRefreshClick} startIcon={<RefreshIcon />}>
              Refresh
            </TextButton> */}
            <DateRangeSelector
              onSave={handleDateRangeChange}
              value={{
                startDate: new Date(rangePreference.startDate),
                endDate: new Date(rangePreference.endDate),
                preset: rangePreference.preset,
              }}
           />
            {hasGrouping && (
              <CeligoSelect
                data-test="selectFlowCategory"
                onChange={handleFlowCategoryChange}
                displayEmpty
                value={flowCategory || ''}>
                <MenuItem value="">Select flow group</MenuItem>
                {sections}
              </CeligoSelect>
            )}
            <SelectResource
              integrationId={integrationId}
              selectedResources={selectedResources}
              flowResources={filteredFlowResources}
              onSave={handleResourcesChange}
        />
          </ActionGroup>
        </div>
        <div className="body1" />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 70,
          }}
        >
          {data.values.length === 0 ? <DefaultDashboard id={id} /> : impl.config(data)}
        </div>
      </div>
    </Card>
  );
}
