/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '@mui/material/Card';
// import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
import { addDays, startOfDay } from 'date-fns';
import '../../views/Dashboard/panels/Custom/Styles/widget.css';
// import Select from '@mui/material/Select';
// import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import { Typography } from '@mui/material';
// import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../reducers';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import actions from '../../actions';
import PanelHeader from '../PanelHeader';
import MuiBox from '../BoxWidget/BoxWidget';
import BarGraph from '../Graphs/BarGraph';
import RefreshIcon from '../icons/RefreshIcon';
import { getSelectedRange } from '../../utils/flowMetrics';
import DateRangeSelector from '../DateRangeSelector';
import SelectResource from '../LineGraph/SelectResource';
import CeligoSelect from '../CeligoSelect';
import TextButton from '../Buttons/TextButton';
import ActionGroup from '../ActionGroup';
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
  let Unknown = 0;
  let offlineCount = 0;
  let onlineCount = 0;

  // eslint-disable-next-line no-restricted-syntax
  for (const obj in data) {
    if (Object.prototype.hasOwnProperty.call(data, obj)) {
      if (data[obj].offline === true) {
        offlineCount += 1;
      } else if (data[obj].offline === false) {
        onlineCount += 1;
      } else {
        Unknown += 1;
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
        label: 'Unkown',
        count: Unknown,
      },
      {
        label: 'Offline',
        count: offlineCount,
      },
      {
        label: 'Online',
        count: onlineCount,
      },
    ],
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
  onChange,
  graphData,
  integrationId,
  childId,
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

  const handleRefreshClick = useCallback(() => {
    setRefresh(new Date().getTime());
  }, []);

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
  // const [sendQuery, setSendQuery] = useState(!!selectedResources.length);

  // const dataf =
  // useSelector(
  //   state => selectors.flowMetricsData(state, integrationId),
  //   shallowEqual
  // ) || {};

  // useEffect(() => {
  //   if (selectedResources.length) {
  //     setSendQuery(true);
  //   }
  // }, [selectedResources, range, refresh]);

  // useEffect(() => {
  //   if (sendQuery) {
  //     dispatch(actions.flowMetrics.request('integrations', integrationId, { range, selectedResources }));
  //     setSendQuery(false);
  //   }
  // }, [dataf, dispatch, integrationId, range, sendQuery, selectedResources]);

  // if (dataf.status === COMM_STATES.LOADING) {
  //   return (
  //     <Spinner center="horizontal" size="large" sx={{mb: 1}} />
  //   );
  // }
  // if (dataf.status === COMM_STATES.ERROR) {
  //   return <Typography>Error occured</Typography>;
  // }
  // console.log('Hi', dataf);

  //! THIS PART IS ABOUT THE GRAPHS
  let finalData = graphData;
  const connectionName = 'connections';
  const flowName = 'flows';

  if (id === '0') {
    finalData = transformData(graphData);
  } else if (id === '1' || id === '3' || id === '4') {
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

  const handleBarClick = dataDD => {
    const data1 = {
      ids: data.ids,
      values: [
        data.values.find(d => d[data.ids.XAxis] === dataDD.activeLabel),
      ],
    };

    // console.log("drilldown", data1);
    setData(data1);
  };

  const options = [
    {
      label: 'Area',
      value: 'Area',
      config: data => (
        <BarGraph
          data={data} onChange={handleBarClick}
        />
      ),
    },
    {
      label: 'Bar',
      value: 'Bar',
      config: data => (
        <BarGraph
          data={data}
          onChange={handleBarClick}
           />
      ),
    },
    {
      label: 'Pie',
      value: 'Pie',
      config: data => <BarGraph data={data} onChange={handleBarClick} />,
    },
  ];

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [, setSelection] = useState(null);
  const [impl, setImpl] = useState(
    options.find(opt => opt.label === graphType)
  );
  const handleSelection = opt => {
    setSelection(opt);
    setImpl(options.find(option => option.label === opt.target.value));
    onChange(opt.target.value, id);
  };

  const renderedOptions = options.map(option => (
    <MenuItem key={option.value} value={option.label}>
      {option.label}
    </MenuItem>
  ));

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
          {/* <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">
              Graph Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={impl.label}
              onChange={handleSelection}
              label="graphType"
            >
              {renderedOptions}
            </Select>
          </FormControl> */}
          <ActionGroup>
            <TextButton onClick={handleRefreshClick} startIcon={<RefreshIcon />}>
              Refresh
            </TextButton>

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
              // className={classes.categorySelect}
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

