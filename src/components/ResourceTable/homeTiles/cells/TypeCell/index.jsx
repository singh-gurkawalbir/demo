import React from 'react';
import {useSelector, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { selectors } from '../../../../../reducers';
import FieldMessage from '../../../../DynaForm/fields/FieldMessage';
import WarningIcon from '../../../../icons/WarningIcon';
import ExpiredIcon from '../../../../icons/ErrorIcon';

// todo: ashu css
const useStyles = makeStyles(theme => ({
  content: {
    display: 'flex',
    width: '89%',
    maxHeight: 45,
    overflowY: 'auto',
    wordBreak: 'break-word',
  },
  warningIcon: {
    color: theme.palette.warning.main,
  },
  expiredIcon: {
    color: theme.palette.error.main,
  },
  contentWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  details: {
    fontSize: 12,
    color: 'red',
  },
}));

export default function TypeCell({ tile }) {
  const classes = useStyles();
  const {listViewLicenseMesssage, expired, trialExpired} = useSelector(state =>
    selectors.tileLicenseDetails(state, tile), shallowEqual
  );

  const numFlowsText = `${tile.numFlows} Flow${tile.numFlows === 1 ? '' : 's'}`;

  if (tile._connectorId) {
    return (
      <div className={classes.contentWrapper}>
        Integration app
        {listViewLicenseMesssage && (
        <div >
          {(expired || trialExpired) ? <ExpiredIcon className={classes.expiredIcon} /> : <WarningIcon className={classes.warningIcon} />}
          <div className={classes.content}>
            <Typography variant="body2" className={classes.details}>{listViewLicenseMesssage}</Typography>
          </div>
        </div>
        )}
      </div>
    );
  }

  return tile.ssLinkedConnectionId ? 'Custom'
    : (
      <>
        Custom
        <FieldMessage
          isValid
          description={numFlowsText}
           />
      </>
    );
}
