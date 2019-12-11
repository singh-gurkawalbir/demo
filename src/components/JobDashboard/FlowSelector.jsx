import { useSelector } from 'react-redux';
import { map } from 'lodash';
import { makeStyles, MenuItem } from '@material-ui/core';
import * as selectors from '../../reducers';
import CeligoSelect from '../CeligoSelect';
import { STANDALONE_INTEGRATION } from '../../utils/constants';

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
  const storeFlows = useSelector(state =>
    map(selectors.integrationAppFlows(state, integrationId, storeId), '_id')
  );
  const filteredFlows = useSelector(
    state =>
      selectors.resourceList(state, {
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
      }).resources
  );

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
