import { makeStyles, MenuItem } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useState, useMemo } from 'react';
import { subHours } from 'date-fns';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import { getSelectedRange } from '../../../utils/flowMetrics';
import RefreshIcon from '../../icons/RefreshIcon';
import DateRangeSelector from '../../DateRangeSelector';
import FlowCharts from './FlowCharts';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import SelectResource from '../SelectResource';
import ButtonGroup from '../../ButtonGroup';
import IconTextButton from '../../IconTextButton';
import CeligoSelect from '../../CeligoSelect';

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
const flowsConfig = { type: 'flows'};
const emptySet = [];

export default function LineGraphDrawer({ integrationId, childId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState();
  const [range, setRange] = useState({
    startDate: subHours(new Date(), 24).toISOString(),
    endDate: new Date().toISOString(),
  });
  const isIntegrationApp = useSelector(state => selectors.isIntegrationApp(state, integrationId));
  const [flowCategory, setFlowCategory] = useState();
  const integrationSectionFlows = useSelectorMemo(selectors.makeIntegrationSectionFlows, integrationId, childId, flowCategory);
  const integrationAppFlowSections = useSelector(state => {
    if (!isIntegrationApp) {
      return emptySet;
    }

    return selectors.integrationAppFlowSections(state, integrationId, childId);
  }, (left, right) => left.length === right.length);

  const validFlows = useMemo(() => isIntegrationApp ? integrationSectionFlows : [], [integrationSectionFlows, isIntegrationApp]);
  const preferences = useSelector(state => selectors.userPreferences(state)?.linegraphs) || {};
  const [selectedResources, setSelectedResources] = useState(preferences[integrationId] || [integrationId]);

  const resourceList = useSelectorMemo(
    selectors.makeResourceListSelector,
    flowsConfig
  );

  const flowResources = useMemo(
    () => {
      const flows = resourceList.resources &&
      resourceList.resources.filter(flow =>
        (flow._integrationId === integrationId && !flow.disabled && (!isIntegrationApp || validFlows.includes(flow._id))))
        .map(f => ({_id: f._id, name: f.name}));

      return [{_id: integrationId, name: 'Integration-level'}, ...flows];
    },
    [resourceList.resources, integrationId, isIntegrationApp, validFlows]
  );
  const validResources = useMemo(() => {
    if (selectedResources && selectedResources.length) {
      return selectedResources.filter(sr => flowResources.find(r => r._id === sr));
    }

    return selectedResources;
  }, [flowResources, selectedResources]);
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
    [dispatch, integrationId, preferences]
  );
  const sections = useMemo(() => integrationAppFlowSections.map(s => <MenuItem key={s.titleId} value={s.titleId}>{s.title}</MenuItem>), [integrationAppFlowSections]);

  return (
    <div className={classes.linegraphContainer}>
      <div className={classes.linegraphActions}>
        <ButtonGroup>
          <IconTextButton onClick={handleRefreshClick}>
            <RefreshIcon /> Refresh
          </IconTextButton>

          <DateRangeSelector onSave={handleDateRangeChange} />
          {isIntegrationApp && (
          <CeligoSelect
            data-test="selectFlowCategory"
            className={classes.categorySelect}
            onChange={handleFlowCategoryChange}
            displayEmpty
            value={flowCategory || ''}>
            <MenuItem value="">Select flow category</MenuItem>
            {sections}
          </CeligoSelect>
          )}
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
        selectedResources={validResources}
        range={range}
        refresh={refresh}
        className={classes.scheduleContainer}
      />
    </div>
  );
}
