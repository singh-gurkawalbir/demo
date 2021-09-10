import React from 'react';
// import { makeStyles } from '@material-ui/core';
import GenericRow from './Generic';
import OnlineStatus from '../../../../../../components/OnlineStatus';

// const useStyles = makeStyles(() => ({}));

export default function Connection(props) {
  // const classes = useStyles();

  return (
    <GenericRow {...props}>
      <OnlineStatus offline={!props.result.isOnline} />
    </GenericRow>
  );
}
