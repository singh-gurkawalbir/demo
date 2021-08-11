import { makeStyles, MenuItem } from '@material-ui/core';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../reducers';
import { STANDALONE_INTEGRATION } from '../../utils/constants';
import CeligoSelect from '../CeligoSelect';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import { stringCompare } from '../../utils/sort';

const useStyles = makeStyles(theme => ({
  flow: {
    minWidth: 130,
    maxWidth: 200,
    borderRadius: theme.spacing(0.5),
    height: theme.spacing(4.5),
  },
}));

export default function FlowSelector({
  integrationId,
  childId,
  value = '',
  onChange,
}) {
  const classes = useStyles();
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
  const filteredFlows = useSelectorMemo(
    selectors.makeResourceListSelector,
    flowsFilterConfig
  ).resources;

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
          {opt.name || opt._id}
        </MenuItem>
      ))}
    </CeligoSelect>
  );
}
