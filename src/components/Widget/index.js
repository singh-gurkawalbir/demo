/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useCallback, useMemo, useEffect, lazy, Suspense} from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Card from '@mui/material/Card';
import { addDays, startOfDay } from 'date-fns';
import { Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import '../../views/Dashboard/panels/AdminDashboard/Styles/widget.css';
import { Spinner} from '@celigo/fuse-ui';
import { selectors } from '../../reducers';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import actions from '../../actions';
import PanelHeader from '../PanelHeader';
import MuiBox from '../BoxWidget';
import { getSelectedRange } from '../../utils/flowMetrics';
import DateRangeSelector from '../DateRangeSelector';
import SelectResource from '../LineGraph/SelectResource';
import CeligoSelect from '../CeligoSelect';
import ActionGroup from '../ActionGroup';
import { COMM_STATES } from '../../reducers/comms/networkComms';
import { transformData, transformData1, transformData2 } from '../../views/Dashboard/panels/AdminDashboard/components/Transform';
import DynaForm from '../DynaForm';
import useFormInitWithPermissions from '../../hooks/useFormInitWithPermissions';

const LineGraph = lazy(() => import('../Graphs/LineGraph'));
const BarGraph = lazy(() => import('../Graphs/BarGraph'));
const DefaultDashboard = lazy(() => import('../../views/Dashboard/panels/AdminDashboard/components/DefaultDashboard'));

const fieldMeta = {
  fieldMap: {
    Type: {
      id: 'filter',
      name: 'Filter',
      type: 'select',
      placeholder: 'Please Select type',
      visibleWhenAll: [{ field: 'application', isNot: [''] }],
      options: [
        {
          items: [
            { label: 'Enable', value: 'enabled' },
            { label: 'Disable', value: 'disabled' },
          ],
        },
      ],
      // label: 'Filter',
      // required: true,
      defaultValue: 'disabled',
      noApi: true,
    },
  },
  layout: {
    fields: ['Type'],
  },
};

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
  const [isloading, setIsLoading] = useState(false);

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
    if (metricData.status === COMM_STATES.LOADING) {
      setIsLoading(true);
    }
    if (metricData.status !== COMM_STATES.LOADING) {
      setIsLoading(false);
    }
  }, [dispatch, metricData, integrationId, range, sendQuery, selectedResources]);

  if (metricData.status === COMM_STATES.ERROR) {
    return <Typography>Error occured</Typography>;
  }
  const recordData = metricData.data;

  //! This PART IS ABOUT FETCHING THE FLOWDATA FROM API
  const start = new Date(range.startDate);
  const end = new Date(range.endDate);
  const startDateString = start.toISOString();
  const endDateString = end.toISOString();

  const formKey = 'FlowType';

  const formValues = useSelector(
    state => selectors.formValueTrimmed(state, formKey),
    shallowEqual
  );
  const result = { ...formValues };

  const filterVal = result.Filter;

  // console.log(filterVal);
  useFormInitWithPermissions({ formKey, fieldMeta });

  const flowData = useSelector(selectors.flowTrendData);
  const flowDataStatus = useSelector(selectors.flowTrend);

  // console.log('FLOWDATA', flowData);
  useEffect(() => {
    if (integrationId === 'demo2') {
      dispatch(actions.flowTrends.request(startDateString, endDateString, filterVal));
    }
  }, [dispatch, endDateString, startDateString, integrationId, filterVal]);

  //! THIS PART IS ABOUT THE GRAPHS
  let finalData = graphData;
  const connectionName = 'connections';
  const flowName = 'flows';

  if (id === '3') {
    finalData = transformData(recordData);
  } else if (id === '1' || id === '0') {
    finalData = transformData1(graphData);
  } else if (id === '2') {
    finalData = transformData2(flowData);
    // console.log(finalData);
  } else if (id === '5') {
    return <MuiBox data={graphData} value={connectionName} />;
  } else if (id === '6') {
    return <MuiBox data={graphData} value={flowName} />;
  } else {
    finalData = graphData;
  }
  const [data, setData] = useState(finalData);
  const options = [
    {
      label: 'Line',
      value: 'Line',
      config: data => (
        <Suspense fallback={<div>Loading...</div>}>
          <LineGraph
            data={data} color={graphPrefrence.color}
          />
        </Suspense>
      ),
    },
    {
      label: 'Bar',
      value: 'Bar',
      config: data => (
        <Suspense fallback={<div>Loading...</div>}>
          <BarGraph
            data={data}
            color={graphPrefrence.color}
            range={range}
           />
        </Suspense>
      ),
    },
  ];

  const [impl] = useState(
    options.find(opt => opt.label === graphType)
  );

  useEffect(() => {
    if (id === '2') {
      setData(transformData2(flowData));
      if (flowDataStatus) {
        setIsLoading(true);
      } else {
        setIsLoading(false);
      }
    }
  }, [flowData, id, setData, flowDataStatus]);

  useEffect(() => {
    if (id === '3') {
      setData(transformData(recordData));
    }
  }, [recordData, id, setData]);

  if (isloading) {
    return (
      <Spinner center="horizontal" size="large" sx={{mb: 1}} />
    );
  }

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
            {id === '3' && (
            <SelectResource
              integrationId={integrationId}
              selectedResources={selectedResources}
              flowResources={filteredFlowResources}
              onSave={handleResourcesChange}
        />

            )}
            {id === '2' && <DynaForm formKey={formKey} />}
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
          {data.values.length === 0 ? (
            <Suspense fallback={<div>Loading...</div>}>
              <DefaultDashboard id="0" />
            </Suspense>
          ) : impl.config(data)}
        </div>
      </div>
    </Card>
  );
}
