
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Help from '../../../../Help';
import RefreshableHeading from '../../../commonCells/RefreshableHeading';

const useStyles = makeStyles(() => ({
  flexContainer: {
    display: 'flex',
  },
}));

export default function StatusHeader() {
  const classes = useStyles();

  return (
    <div className={classes.flexContainer}>
      <RefreshableHeading label="Status" resourceType="ashares" />
      <Help
        title="Status"
        helpKey="users.status"
        disablePortal={false}
        sx={{ml: 0.5}}
        />
    </div>
  );
}
