import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Panel from './Panel';

const useStyles = makeStyles(() => ({
  drawerPaper: {
    padding: 0,
  },
  panelContainer: {
    display: 'flex',
  },
}));

export default function ResourceDrawer(props) {
  const classes = useStyles();
  const { match, history } = props;
  const open = !!match;
  const handleClose = () => {
    history.goBack();
  };

  return (
    <Drawer
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
      onClose={handleClose}>
      <div className={classes.panelContainer}>
        {open && <Panel {...props} zIndex={1} onClose={handleClose} />}
      </div>
    </Drawer>
  );
}
