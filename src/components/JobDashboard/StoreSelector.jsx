import { useSelector } from 'react-redux';
import { makeStyles, MenuItem } from '@material-ui/core';
import * as selectors from '../../reducers';
import CeligoSelect from '../CeligoSelect';

const useStyles = makeStyles(() => ({
  store: {
    minWidth: 130,
    maxWidth: 200,
  },
}));

export default function StoreSelector({ integrationId, value = '', onChange }) {
  const classes = useStyles();
  const integration = useSelector(state =>
    selectors.integrationAppSettings(state, integrationId)
  );
  const { supportsMultiStore, storeLabel } = integration.settings || {};

  if (!supportsMultiStore) {
    return null;
  }

  return (
    <CeligoSelect
      className={classes.store}
      onChange={e => onChange(e.target.value)}
      displayEmpty
      value={value}>
      <MenuItem value="">Select a {storeLabel}</MenuItem>
      {integration.stores.map(opt => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label || opt.value}
        </MenuItem>
      ))}
    </CeligoSelect>
  );
}
