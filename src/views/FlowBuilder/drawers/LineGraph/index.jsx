import { makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useState, useMemo } from 'react';
import { subHours } from 'date-fns';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import RightDrawer from '../../../../components/drawer/Right';
import DateRangeSelector from '../../../../components/DateRangeSelector';
import FlowCharts from '../../../../components/LineGraph/Flow';
import DynaMultiSelect from '../../../../components/LineGraph/MultiSelect';

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

export default function LineGraphDrawer({ flowId }) {
  const match = useRouteMatch();
  const parentUrl = match.url;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [selectedResources, setSelectedResources] = useState([flowId]);
  const [range, setRange] = useState({
    startDate: subHours(new Date(), 24).toISOString(),
    endDate: new Date().toISOString(),
  });
  const flowResources = useSelector(state =>
    selectors.flowResources(state, flowId)
  );
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
  const handleResourcesChange = useCallback(
    (id, val) => {
      setSelectedResources(val);
    },
    []
  );

  const action = useMemo(
    () => (
      <>
        <DateRangeSelector onSave={handleDateRangeChange} />
        <DynaMultiSelect
          name="flowResources"
          value={selectedResources}
          placeholder="Please select resources"
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
    ),
    [flowResources, handleDateRangeChange, handleResourcesChange, selectedResources]
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
