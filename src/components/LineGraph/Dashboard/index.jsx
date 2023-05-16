import { MenuItem } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useState, useMemo } from 'react';
import { addDays, startOfDay } from 'date-fns';
import { TextButton } from '@celigo/fuse-ui';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import { getSelectedRange } from '../../../utils/flowMetrics';
import RefreshIcon from '../../icons/RefreshIcon';
import DateRangeSelector from '../../DateRangeSelector';
import FlowCharts from './FlowCharts';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import SelectResource from '../SelectResource';
import CeligoSelect from '../../CeligoSelect';
import ActionGroup from '../../ActionGroup';

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
  categorySelect: {
    marginRight: '10px',
  },
  linegraphContainer: {
    marginTop: theme.spacing(-5),
  },
}));
const defaultRange = {
  startDate: startOfDay(addDays(new Date(), -29)).toISOString(),
  endDate: new Date().toISOString(),
  preset: 'last30days',
};

export default function LineGraphDrawer({ integrationId, childId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState();
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
  const [range, setRange] = useState(rangePreference);

  const flowResources = useSelectorMemo(selectors.mkIntegrationFlowsByGroup, integrationId, childId, flowCategory);
  const filteredFlowResources = useMemo(() => {
    const flows = flowResources.map(f => ({_id: f._id, name: f.name || `Unnamed (id: ${f._id})`}));

    return [{_id: integrationId, name: 'Integration-level'}, ...flows];
  }, [flowResources, integrationId]);

  const validResources = useMemo(() => {
    if (selectedResources && selectedResources.length) {
      return selectedResources.filter(sr => filteredFlowResources.find(r => r._id === sr));
    }

    return selectedResources;
  }, [filteredFlowResources, selectedResources]);

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

  return (
    <div className={classes.linegraphContainer}>
      <div className={classes.linegraphActions}>
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
            className={classes.categorySelect}
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
      <FlowCharts
        integrationId={integrationId}
        selectedResources={validResources}
        range={range}
        refresh={refresh}
        className={classes.scheduleContainer}
      />
    </div>
  );
}
