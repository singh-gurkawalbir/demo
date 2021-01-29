import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../../reducers';
import TextOverflowCell from '../../../TextOverflowCell';

const useStyles = makeStyles({
  userNameTextOverflow: {
    maxWidth: 240,
  },
});
export default function UserName({ userId, flowId }) {
  const classes = useStyles();
  const userName = useSelector(state =>
    selectors.getIntegrationUserNameById(state, userId, flowId)
  );

  if (userId === 'autopilot') {
    return 'Autopilot';
  }

  return <TextOverflowCell message={userName || userId} classes={classes.userNameTextOverflow} />;
}
