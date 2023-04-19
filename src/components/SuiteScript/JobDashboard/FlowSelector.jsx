import React from 'react';
import { MenuItem } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import CeligoSelect from '../../CeligoSelect';

const useStyles = makeStyles(theme => ({
  flow: {
    minWidth: 130,
    maxWidth: 200,
    borderRadius: theme.spacing(0.5),
    height: theme.spacing(4.5),
  },
}));

export default function FlowSelector({
  ssLinkedConnectionId,
  integrationId,
  value = '',
  onChange,
}) {
  const classes = useStyles();
  const filteredFlows = useSelector(state =>
    selectors.suiteScriptResourceList(state, {
      resourceType: 'flows',
      ssLinkedConnectionId,
      integrationId,
    })
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
        <MenuItem key={opt._id} value={opt._flowId}>
          {opt.ioFlowName || opt.name || opt._flowId}
        </MenuItem>
      ))}
    </CeligoSelect>
  );
}
