import { MenuItem } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../reducers';
import { STANDALONE_INTEGRATION } from '../../constants';
import CeligoSelect from '../CeligoSelect';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import { stringCompare } from '../../utils/sort';
import { getFlowGroup } from '../../utils/flows';
import customCloneDeep from '../../utils/customCloneDeep';

const useStyles = makeStyles(theme => ({
  flow: {
    minWidth: 130,
    maxWidth: 400,
    borderRadius: theme.spacing(0.5),
    height: theme.spacing(4.5),
  },
  flowGroupName: {
    color: theme.palette.text.secondary,
  },
}));
const OptionIml = ({ item, integrationId, childId, isIntegrationApp}) => {
  const classes = useStyles();
  const flowSections = useSelectorMemo(selectors.mkIntegrationAppFlowSections, integrationId, childId);
  const flowGroupings = useSelectorMemo(selectors.mkFlowGroupingsTiedToIntegrations, integrationId);
  let sectionName;
  let groupName;

  if (isIntegrationApp) {
    sectionName = flowSections.find(flowSection => flowSection.flows?.some(flow => flow._id === item._id))?.title;
  } else {
    groupName = getFlowGroup(flowGroupings, '', item._flowGroupingId)?.name;
  }

  return (
    <>
      <span>{item.name || item._id}</span>
      {isIntegrationApp
        ? sectionName && (<span className={classes.flowGroupName}>{` | ${sectionName}`}</span>)
        : groupName && (<span className={classes.flowGroupName}>{` | ${groupName}`}</span>)}
    </>
  );
};
export default function FlowSelector({
  integrationId,
  childId,
  value = '',
  onChange,
}) {
  const classes = useStyles();
  const isIntegrationApp = useSelector(state => selectors.isIntegrationApp(state, integrationId));
  const childFlows = useSelector(
    state => {
      if (!childId) {
        return [];
      }

      return selectors.integrationAppFlowIds(state, integrationId, childId);
    },
    (left, right) => left.length === right.length
  );
  const flowsFilterConfig = useMemo(
    () => ({
      type: 'flows',
      filter: {
        $where() {
          if (!integrationId || integrationId === STANDALONE_INTEGRATION.id) {
            // eslint-disable-next-line react/no-this-in-sfc
            return !this._integrationId; // standalone integration flows
          }

          if (childId) {
            // eslint-disable-next-line react/no-this-in-sfc
            return childFlows.includes(this._id);
          }

          // eslint-disable-next-line react/no-this-in-sfc
          return this._integrationId === integrationId;
        },
      },
    }),
    [integrationId, childFlows, childId]
  );
  const tempFilteredFlows = useSelectorMemo(
    selectors.makeResourceListSelector,
    flowsFilterConfig
  ).resources;
  const filteredFlows = useMemo(() => customCloneDeep(tempFilteredFlows), [tempFilteredFlows]);

  return (
    <CeligoSelect
      data-test="selectAFlowFilter"
      className={classes.flow}
      onChange={e => onChange(e.target.value)}
      displayEmpty
      value={value || ''}>
      <MenuItem value="">Select flow</MenuItem>
      {filteredFlows.sort(stringCompare('name')).map(opt => (
        <MenuItem key={opt._id} value={opt._id}>
          <OptionIml
            item={opt}
            integrationId={integrationId}
            childId={childId}
            isIntegrationApp={isIntegrationApp}
          />
        </MenuItem>
      ))}
    </CeligoSelect>
  );
}
