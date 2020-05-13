import { makeStyles, MenuItem } from '@material-ui/core';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../reducers';
import { STANDALONE_INTEGRATION } from '../../utils/constants';
import CeligoSelect from '../CeligoSelect';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';

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
  storeId,
  value = '',
  onChange,
}) {
  const classes = useStyles();
  const storeFlows = useSelector(
    state => {
      if (!storeId) {
        return [];
      }

      return selectors.integrationAppFlowIds(state, integrationId, storeId);
    },
    (left, right) => left.length === right.length
  );
  const flowsFilterConfig = useMemo(
    () => ({
      type: 'flows',
      filter: {
        $where() {
          if (!integrationId || integrationId === STANDALONE_INTEGRATION.id) {
            return !this._integrationId; // standalone integration flows
          }

          if (storeId) {
            return storeFlows.includes(this._id);
          }

          return this._integrationId === integrationId;
        },
      },
    }),
    [integrationId, storeFlows, storeId]
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
      {filteredFlows.map(opt => (
        <MenuItem key={opt._id} value={opt._id}>
          {opt.name || opt._id}
        </MenuItem>
      ))}
    </CeligoSelect>
  );
}
