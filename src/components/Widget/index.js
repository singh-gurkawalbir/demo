/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Card from '@mui/material/Card';
import { addDays, startOfDay } from 'date-fns';
import MenuItem from '@mui/material/MenuItem';
import '../../views/Dashboard/panels/Custom/Styles/widget.css';
// import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
// import Select from '@mui/material/Select';
// import InputLabel from '@mui/material/InputLabel';
// import FormControl from '@mui/material/FormControl';
// import RefreshIcon from '../icons/RefreshIcon';
// import TextButton from '../Buttons/TextButton';
import { Typography } from '@mui/material';
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

// const useStyles = makeStyles(theme => ({
//   root: {
//     width: '100%',
//     height: '100%',
//     display: 'flex',
//     flexDirection: 'column',
//     cursor: 'grab',
//   },
//   header: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '0.5rem',
//   },
//   spacer: {
//     flexGrow: 1,
//   },
//   body1: {
//     padding: '0.5rem',
//     flexGrow: 1,
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   chartContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     [theme.breakpoints.up('md')]: {
//       flexDirection: 'row',
//     },
//   },
// }));

export const transformData = data => {
  const resultMap = {};

  if (data && Array.isArray(data)) {
    // Check if data is defined and an array
    data.forEach(obj => {
      const date = obj._time;
      const dateObj = new Date(date);

      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      const formattedDate = `${year}-${month}-${day}`;

      const { attribute } = obj;

      if (!resultMap[formattedDate]) {
        resultMap[formattedDate] = {
          success: 0,
          error: 0,
        };
      }

      if (attribute === 's') {
        // eslint-disable-next-line no-plusplus
        resultMap[formattedDate].success++;
      } else if (attribute === 'e') {
        // eslint-disable-next-line no-plusplus
        resultMap[formattedDate].error++;
      }
    });
  } else {
    console.log('Data not received');
    // Add an error message for debugging purposes
  }

  const values = Object.entries(resultMap).map(([formattedDate, counts]) => ({
    label: formattedDate,
    success: counts.success,
    error: counts.error,
  }));

  values.pop();

  return {
    ids: {
      XAxis: 'label',
      YAxis: '',
      Plots: ['success', 'error'],
      MaximumYaxis: '',
    },
    values,
  };
};

const transformData1 = data => {
  const dates = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const obj in data) {
    if (Object.prototype.hasOwnProperty.call(data, obj)) {
      const created = data[obj].createdAt.slice(0, 7);
      const modified = data[obj].lastModified.slice(0, 7);

      if (created in dates) {
        dates[created].create += 1;
      } else {
        dates[created] = { create: 1, modify: 0 };
      }
      if (modified in dates) {
        dates[modified].modify += 1;
      } else {
        dates[modified] = { create: 0, modify: 1 };
      }
    }
  }
  const values = [];

  Object.keys(dates).forEach(key =>
    values.push({
      label: key,
      createdAt: dates[key].create,
      modifiedAt: dates[key].modify,
    })
  );

  return {
    ids: {
      XAxis: 'label',
      YAxis: '',
      Plots: ['createdAt', 'modifiedAt'],
      MaximumYaxis: '',
    },
    values,
  };
};

const transformData2 = data => {
  const types = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const obj in data) {
    if (Object.prototype.hasOwnProperty.call(data, obj)) {
      const typeObj = data[obj].type;

      if (typeObj in types) {
        types[typeObj] += 1;
      } else {
        types[typeObj] = 1;
      }
    }
  }
  const values = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const key in types) {
    if (Object.hasOwn(types, key)) {
      values.push({
        label: key,
        count: types[key],
      });
    }
  }

  return {
    ids: {
      XAxis: 'label',
      YAxis: '',
      Plots: ['count'],
      MaximumYaxis: '',
    },
    values,
  };
};

export const transformData3 = data => {
  let errorCount = 0;
  let successCount = 0;

  // eslint-disable-next-line no-restricted-syntax
  for (const obj in data) {
    if (Object.prototype.hasOwnProperty.call(data, obj)) {
      if (data[obj].attribute === 'e') {
        errorCount += 1;
      } else if (data[obj].offline === 's') {
        successCount += 1;
      }
    }
  }

  return {
    ids: {
      XAxis: 'label',
      YAxis: '',
      Plots: ['count'],
      MaximumYaxis: '',
    },
    values: [
      {
        label: 'Error',
        count: errorCount,
      },
      {
        label: 'Success',
        count: successCount,
      },
    ],
  };
};

const defaultRange = {
  startDate: startOfDay(addDays(new Date(), -29)).toISOString(),
  endDate: new Date().toISOString(),
  preset: 'last30days',
};

export default function Widget({
  id,
  // onRemoveItem,
  title,
  graphType,

  graphData,
  integrationId,
  childId,
  graphPrefrence,
}) {
  //! THIS WHOLE PART IS ABOUT THE DATE, RANGE AND INTEGRATION LEVEL
  const dispatch = useDispatch();
  const flowGroupingsSections = useSelectorMemo(selectors.mkFlowGroupingsSections, integrationId);
  const isIntegrationAppV1 = useSelector(state => selectors.isIntegrationAppV1(state, integrationId));
  const hasGrouping = !!flowGroupingsSections || isIntegrationAppV1;
  const [flowCategory, setFlowCategory] = useState();
  const groupings = useSelectorMemo(selectors.mkIntegrationFlowGroups, integrationId);
  const preferences = useSelector(state => selectors.userPreferences(state)?.linegraphs) || {};
  const { rangePreference, resourcePreference } = useMemo(() => {
    const preference = preferences[integrationId] || {};

    return {
      rangePreference: preference.range ? getSelectedRange(preference.range) : defaultRange,
      resourcePreference: preference.resource || [integrationId],
    };
  }, [integrationId, preferences]);

  const [selectedResources, setSelectedResources] = useState(resourcePreference);

  const [refresh, setRefresh] = useState();
  const [range, setRange] = useState(rangePreference);

  const flowResources = useSelectorMemo(selectors.mkIntegrationFlowsByGroup, integrationId, childId, flowCategory);
  const filteredFlowResources = useMemo(() => {
    const flows = flowResources.map(f => ({_id: f._id, name: f.name || `Unnamed (id: ${f._id})`}));

    return [{_id: integrationId, name: 'Integration-level'}, ...flows];
  }, [flowResources, integrationId]);

  // const validResources = useMemo(() => {
  //   if (selectedResources && selectedResources.length) {
  //     return selectedResources.filter(sr => filteredFlowResources.find(r => r._id === sr));
  //   }
  //   return selectedResources;
  // }, [filteredFlowResources, selectedResources]);

  // const handleRefreshClick = useCallback(() => {
  //   setRefresh(new Date().getTime());
  // }, []);

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
              range,
              resource: val,
            },
          },
        })
      );
    },
    [dispatch, integrationId, preferences, range]
  );

  const sections = useMemo(() => groupings.map(s => <MenuItem key={s.titleId || s.sectionId} value={s.titleId || s.sectionId}>{s.title}</MenuItem>), [groupings]);

  // //! THIS PART REPRESENTS THE JOB RECORD AREA
  const [sendQuery, setSendQuery] = useState(!!selectedResources.length);

  const metricData =
  useSelector(
    state => selectors.flowMetricsData(state, integrationId),
    shallowEqual
  ) || {};

  useEffect(() => {
    const fetchData = async () => {
      if (selectedResources.length) {
        setSendQuery(true);
      }
    };

    fetchData();
  }, [selectedResources, range, refresh]);

  useEffect(() => {
    const fetchData = async () => {
      if (sendQuery) {
        dispatch(actions.flowMetrics.request('integrations', integrationId, { range, selectedResources }));
        setSendQuery(false);
      }
    };

    fetchData();
  }, [metricData, dispatch, integrationId, range, sendQuery, selectedResources]);

  if (metricData.status === COMM_STATES.ERROR) {
    return <Typography>Error occured</Typography>;
  }
  // eslint-disable-next-line dot-notation
  const flowData = metricData.data;

  // console.log(transformData1(graphData));
  // console.log(transformData(flowData));

  //! THIS PART IS ABOUT THE GRAPHS
  let finalData = graphData;
  const connectionName = 'connections';
  const flowName = 'flows';

  if (id === '4') {
    finalData = transformData(flowData);
  } else if (id === '1' || id === '3' || id === '0') {
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

  const [impl, setImpl] = useState(
    options.find(opt => opt.label === graphType)
  );

  useEffect(() => {
    <BarGraph
      data={data}
      color={graphPrefrence.color}
      onChange={handleBarClick}
      range={range}
           />;
  }, [impl, handleDateRangeChange, selectedResources, data, graphPrefrence.color, handleBarClick, range]);

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
          {impl.config(data)}
        </div>
      </div>
    </Card>
  );
}

