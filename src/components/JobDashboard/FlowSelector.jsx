import { useSelector } from 'react-redux';
import { makeStyles, MenuItem } from '@material-ui/core';
import * as selectors from '../../reducers';
import CeligoSelect from '../CeligoSelect';
import { STANDALONE_INTEGRATION } from '../../utils/constants';

const useStyles = makeStyles(() => ({
  flow: {
    minWidth: 130,
    maxWidth: 200,
  },
}));

export default function FlowSelector({
  integrationId,
  storeId,
  value = '',
  onChange,
}) {
  const classes = useStyles();
  const filteredFlows = useSelector(state => {
    if (storeId) {
      return selectors.integrationAppFlowSettings(
        state,
        integrationId,
        null,
        storeId
      ).flows;
    }

    const flows = selectors.resourceList(state, { type: 'flows' }).resources;

    return flows.filter(flow => {
      if (!integrationId || integrationId === STANDALONE_INTEGRATION.id) {
        return !flow._integrationId; // standalone integration flows
      }

      return flow._integrationId === integrationId;
    });
  });

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
