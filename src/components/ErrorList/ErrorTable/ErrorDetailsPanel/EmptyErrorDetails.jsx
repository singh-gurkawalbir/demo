import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import DrawerHeader from '../../../drawer/Right/DrawerHeader';

const useStyles = makeStyles(() => ({
  emptyErrorDetails: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  content: {
    textAlign: 'center',
  },
}));
export default function EmptyErrorDetails({ classes, showMessage }) {
  const styles = useStyles();

  return (
    <>
      <DrawerHeader title="Error details" showCloseButton={false} className={classes.draweHeader} />
      {showMessage ? (
        <div className={styles.emptyErrorDetails}>
          <Typography variant="body2" className={styles.content}>
            Click an error row to view its details <br />
            or select the checkboxes for batch actions.
          </Typography>
        </div>
      ) : null}
    </>
  );
}
